// ============================================
// Crafting System
// ============================================
// Two crafting surfaces:
//   - Inventory grid: 2x2, always available, lives inside the normal
//     inventory overlay.
//   - Workbench grid: 3x3, only available while a Workbench UI is open
//     (interact with a placed IR-workbench block).
//
// Recipes (see CraftingRegistry in registry.js) come in three kinds:
//   - "shapeless"  : an unordered bag of ingredients/counts. Matches on
//                    either grid size as long as every non-empty grid cell
//                    holds an item the recipe wants, in at least the needed
//                    amount. Extra copies beyond what's needed are fine and
//                    stay in the grid (put 16 stone in a slot for a
//                    "1 stone -> 4 planks" recipe and it still only
//                    consumes 1 stone per craft, exactly like vanilla
//                    Minecraft) - it does NOT require the exact amount.
//   - "shaped2x2"  : a fixed pattern up to 2x2. Only matched against the
//                    2x2 grid (checked at every valid offset+trim).
//   - "shaped3x3"  : a fixed pattern up to 3x3. Only matched against the
//                    3x3 grid (Workbench only).

// Cells in a grid are indexed left-to-right, top-to-bottom, row by row:
// for the 2x2 grid, index 0 = top-left, 1 = top-right, 2 = bottom-left,
// 3 = bottom-right (i.e. index = y * size + x). Same idea for 3x3.
const Crafting = {
    // grid.cells[i] = { id, count } | null
    grid2x2: { size: 2, cells: Array(4).fill(null) },
    grid3x3: { size: 3, cells: Array(9).fill(null) },
    workbenchOpen: false, // whether the Workbench UI (which exposes grid3x3) is open

    // ---- matching ----

    // Trims a shaped pattern grid down to its minimal bounding box, so a
    // recipe authored as e.g. a 2-wide pattern can still be matched
    // wherever it sits inside a larger crafting grid.
    trimPattern(cells, w, h) {
        let minX = w, maxX = -1, minY = h, maxY = -1;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                if (cells[y * w + x]) {
                    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
                }
            }
        }
        if (maxX < 0) return { w: 0, h: 0, cells: [] };
        const tw = maxX - minX + 1, th = maxY - minY + 1;
        const out = [];
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                out.push(cells[y * w + x] || null);
            }
        }
        return { w: tw, h: th, cells: out };
    },

    // Checks whether a shaped recipe's pattern matches the grid's CURRENT
    // contents. Both sides get trimmed to their minimal bounding box first
    // (via trimPattern above) so a recipe drawn in a corner of its own
    // authored grid can still match the same shape sitting anywhere in the
    // player's actual (possibly larger) crafting grid.
    matchesShaped(recipe, grid) {
        const rw = recipe.width || Math.sqrt(recipe.pattern.length) | 0;
        const trimmedRecipe = this.trimPattern(recipe.pattern, rw, recipe.pattern.length / rw);
        const trimmedGrid = this.trimPattern(grid.cells.map(c => c ? c.id : null), grid.size, grid.size);

        if (trimmedRecipe.w === 0) return false;
        if (trimmedRecipe.w !== trimmedGrid.w || trimmedRecipe.h !== trimmedGrid.h) return false;

        for (let i = 0; i < trimmedRecipe.cells.length; i++) {
            const want = trimmedRecipe.cells[i];
            const have = trimmedGrid.cells[i];
            if ((want || null) !== (have || null)) return false;
        }
        return true;
    },

    // Checks whether a shapeless recipe's ingredient list is satisfied by
    // the grid's current contents, ignoring position entirely - only
    // total counts per item id matter (see the file-level comment at the
    // top for the exact rules).
    matchesShapeless(recipe, grid) {
        const have = {};
        let nonEmpty = 0;
        grid.cells.forEach(c => {
            if (!c) return;
            nonEmpty++;
            have[c.id] = (have[c.id] || 0) + c.count;
        });
        const need = {};
        recipe.ingredients.forEach(ing => {
            need[ing.id] = (need[ing.id] || 0) + ing.count;
        });
        if (nonEmpty === 0) return false;

        // Every occupied item id must be one the recipe actually wants -
        // no leftover/unrelated items sitting in the grid.
        for (const id in have) {
            if (!need[id]) return false;
        }
        // For each required ingredient, the grid must hold AT LEAST the
        // needed amount (not exactly - stacking 16 stone in a slot when
        // the recipe only needs 1 is fine, same as vanilla Minecraft:
        // craftOnce() below only ever consumes exactly what the recipe
        // asks for and leaves the rest sitting in the grid).
        for (const id in need) {
            if ((have[id] || 0) < need[id]) return false;
        }
        return true;
    },

    // Scans CraftingRegistry.recipes (registry.js) in order and returns
    // the FIRST one that matches the given grid, or null if nothing
    // matches. Recipe order in the registry therefore acts as a tie-break
    // priority if you ever add two recipes that could both match the same
    // grid contents - put the more specific one first.
    findMatch(grid) {
        const recipes = CraftingRegistry.recipes;
        for (const r of recipes) {
            if (r.type === 'shapeless') {
                if (this.matchesShapeless(r, grid)) return r;
            } else if (r.type === 'shaped2x2' && grid.size === 2) {
                if (this.matchesShaped(r, grid)) return r;
            } else if (r.type === 'shaped3x3' && grid.size === 3) {
                if (this.matchesShaped(r, grid)) return r;
            } else if (r.type === 'shaped2x2' || r.type === 'shaped3x3') {
                // A shaped recipe authored for a smaller grid can still be
                // crafted on a bigger grid (e.g. a 2x2 shape on the 3x3
                // workbench grid) as long as it fits.
                if (this.matchesShaped(r, grid)) return r;
            }
        }
        return null;
    },

    // ---- grid state helpers ----

    // Central helper used everywhere in this file to go from "which grid
    // size am I working with" (2 or 3) to the actual grid object.
    getGrid(size) { return size === 3 ? this.grid3x3 : this.grid2x2; },

    // What the grid would currently produce, without consuming anything -
    // used purely for the result-slot preview (renderCraftGrid below).
    result(size) {
        const grid = this.getGrid(size);
        const recipe = this.findMatch(grid);
        return recipe ? recipe.result : null;
    },

    // Pulls one crafted result and returns it to give the player.
    //   - shaped recipes: consume exactly 1 from each occupied cell that's
    //     part of the pattern (a shaped recipe only ever wants 1 per
    //     cell, position is what matters).
    //   - shapeless recipes: consume exactly `ingredient.count` of each
    //     required item id, taken out of the grid's total pool for that
    //     id (so 16 stone in one slot only ever loses the 1 the recipe
    //     actually needs, same as vanilla Minecraft - the other 15 stay
    //     put).
    craftOnce(size) {
        const grid = this.getGrid(size);
        const recipe = this.findMatch(grid);
        if (!recipe) return null;

        if (recipe.type === 'shapeless') {
            const need = {};
            recipe.ingredients.forEach(ing => {
                need[ing.id] = (need[ing.id] || 0) + ing.count;
            });
            grid.cells.forEach((c, i) => {
                if (!c) return;
                const owed = need[c.id] || 0;
                if (owed <= 0) return;
                const take = Math.min(owed, c.count);
                c.count -= take;
                need[c.id] -= take;
                if (c.count <= 0) grid.cells[i] = null;
            });
        } else {
            // Shaped recipe: consume exactly 1 from each cell that's part
            // of the matched pattern. In practice every occupied cell in
            // the grid IS part of the pattern by the time we get here
            // (matchesShaped requires the grid's occupied cells to trim to
            // exactly the recipe's shape - no unrelated extra items are
            // allowed to coexist in the grid), but we recompute the
            // pattern's actual cell positions here rather than assuming
            // "every occupied cell counts" - this stays correct even if
            // matching rules change later, and works identically whether
            // the pattern sits in the corner, center, or any other offset
            // of a bigger grid (e.g. a shaped2x2 recipe on the 3x3
            // Workbench grid).
            const rw = recipe.width || Math.sqrt(recipe.pattern.length) | 0;
            const rh = recipe.pattern.length / rw;
            const trimmedRecipe = this.trimPattern(recipe.pattern, rw, rh);
            // Find where in the grid the trimmed recipe's bounding box
            // currently sits by locating the grid's own occupied bounding
            // box (matchesShaped already guaranteed they're the same shape).
            let minX = grid.size, minY = grid.size;
            grid.cells.forEach((c, i) => {
                if (!c) return;
                const x = i % grid.size, y = Math.floor(i / grid.size);
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
            });
            for (let ty = 0; ty < trimmedRecipe.h; ty++) {
                for (let tx = 0; tx < trimmedRecipe.w; tx++) {
                    if (!trimmedRecipe.cells[ty * trimmedRecipe.w + tx]) continue;
                    const gx = minX + tx, gy = minY + ty;
                    const gi = gy * grid.size + gx;
                    const c = grid.cells[gi];
                    if (!c) continue;
                    c.count -= 1;
                    if (c.count <= 0) grid.cells[gi] = null;
                }
            }
        }

        return recipe.result;
    },

    // Empties the grid entirely (e.g. when closing the crafting overlay),
    // returning every leftover ingredient stack back to the inventory so
    // nothing the player put in is ever silently destroyed.
    clearGrid(size) {
        const grid = this.getGrid(size);
        // Return any leftover ingredients to the inventory instead of
        // deleting them.
        grid.cells.forEach((c, i) => {
            if (c && typeof Inventory !== 'undefined') Inventory.addItem(c.id, c.count);
            grid.cells[i] = null;
        });
    },

    // ---- craft grid cell interaction (mirrors Inventory drag logic) ----

    handleCraftSlotClick(size, index) {
        const grid = this.getGrid(size);
        const clicked = grid.cells[index];

        if (!Inventory.dragging) {
            if (!clicked) return;
            Inventory.dragging = { fromIndex: -1, item: clicked, craftSize: size };
            grid.cells[index] = null;
            Inventory.displayedItemId = clicked.id;
        } else {
            const dragItem = Inventory.dragging.item;
            if (!clicked) {
                // Placed AS-IS (not rebuilt as {id,count}) so a capsule's
                // fluid/amount (fluids.js) survives being set into a
                // crafting cell instead of silently resetting to empty.
                grid.cells[index] = dragItem;
                Inventory.dragging = null;
            } else if (clicked.id === dragItem.id && (typeof Fluids === 'undefined' || Fluids.stacksMatch(clicked, dragItem))) {
                const maxStack = Inventory.maxStackFor(clicked.id);
                const space = Math.max(0, maxStack - clicked.count);
                const move = Math.min(space, dragItem.count);
                clicked.count += move;
                dragItem.count -= move;
                if (dragItem.count <= 0) Inventory.dragging = null;
            } else {
                grid.cells[index] = dragItem;
                Inventory.dragging = { fromIndex: -1, item: clicked, craftSize: size };
            }
        }
        Inventory.onChange();
        renderCraftUI();
    },

    // Take the crafted result: gives the player the output and consumes
    // ingredients. Click = take one craft's worth.
    handleResultClick(size) {
        const result = this.craftOnce(size);
        if (!result) return;
        Inventory.addItem(result.id, result.count);
        Inventory.onChange();
        renderCraftUI();
    },

    // "Craft all": repeatedly crafts (consuming ingredients each time) for
    // as long as the same recipe keeps matching, giving the player every
    // batch the current grid contents can produce in one tap. Stops the
    // moment the recipe stops matching (ran out of an ingredient) or the
    // recipe itself changes (shouldn't happen mid-loop, but guards against
    // infinite loops either way).
    craftAll(size) {
        const grid = this.getGrid(size);
        const startRecipe = this.findMatch(grid);
        if (!startRecipe) return;

        let crafted = 0;
        const SAFETY_LIMIT = 10000; // guards against any unforeseen infinite loop
        while (crafted < SAFETY_LIMIT) {
            const recipe = this.findMatch(grid);
            if (!recipe || recipe.id !== startRecipe.id) break;
            const result = this.craftOnce(size);
            if (!result) break;
            Inventory.addItem(result.id, result.count);
            crafted++;
        }
        if (crafted > 0) {
            Inventory.onChange();
            renderCraftUI();
        }
    },

    // "Rebalance": takes every ingredient currently sitting in the grid and
    // redistributes it evenly across all the slots that hold that same
    // item id. E.g. a 2x2 diagonal recipe with 63 stone in the top-left
    // slot and 1 stone in the bottom-right becomes 32/32 (evenly split,
    // any remainder going to the earliest slots).
    rebalance(size) {
        const grid = this.getGrid(size);
        // Group current cell indices by item id, in slot order.
        const groups = {};
        grid.cells.forEach((c, i) => {
            if (!c) return;
            if (!groups[c.id]) groups[c.id] = [];
            groups[c.id].push(i);
        });

        let changed = false;
        for (const id in groups) {
            const indices = groups[id];
            if (indices.length < 2) continue; // nothing to balance with just one slot
            const total = indices.reduce((sum, i) => sum + grid.cells[i].count, 0);
            const base = Math.floor(total / indices.length);
            let remainder = total - base * indices.length;
            indices.forEach(i => {
                const give = base + (remainder > 0 ? 1 : 0);
                if (remainder > 0) remainder--;
                if (grid.cells[i].count !== give) changed = true;
                grid.cells[i] = give > 0 ? { id, count: give } : null;
            });
        }

        if (changed) {
            Inventory.onChange();
            renderCraftUI();
        }
    },

    openWorkbench() {
        this.workbenchOpen = true;
        if (typeof Inventory !== 'undefined') Inventory.isOpen = false;
        if (typeof GuiBlocks !== 'undefined') GuiBlocks.close();
        renderInventoryOverlayIfNeeded();
        renderWorkbenchOverlay();
    },

    closeWorkbench() {
        this.workbenchOpen = false;
        this.clearGrid(3);
        // Closing while still holding an item (picked up from a slot and
        // never placed back down) must return it to the inventory, same as
        // Inventory.closeOverlay()/GuiBlocks.close() already do - this was
        // the one closer that forgot to, which is why an item picked up,
        // then left "in hand" while the workbench was closed (✕ button,
        // clicking outside the panel, or Escape - all three route through
        // here), kept following the cursor/finger forever with nowhere
        // left to click it into.
        if (typeof Inventory !== 'undefined' && Inventory.dragging) Inventory.cancelDrag();
        renderWorkbenchOverlay();
    }
};

function renderInventoryOverlayIfNeeded() {
    if (typeof renderInventoryOverlay === 'function') renderInventoryOverlay();
}

// ============================================
// Rendering
// ============================================

function craftSlotHTML(size, index, item) {
    const countHTML = (item && item.count > 1) ? `<div class="item-count">${item.count}</div>` : '';
    return `<div class="inv-slot craft-slot" data-craft-size="${size}" data-index="${index}">
        ${itemIconHTML(item)}
        ${countHTML}
    </div>`;
}

function renderCraftGrid(size) {
    const grid = Crafting.getGrid(size);
    const gridEl = document.getElementById(size === 3 ? 'craft-grid-3x3' : 'craft-grid-2x2');
    if (!gridEl) return;
    gridEl.innerHTML = grid.cells.map((c, i) => craftSlotHTML(size, i, c)).join('');

    const result = Crafting.result(size);
    const resultEl = document.getElementById(size === 3 ? 'craft-result-3x3' : 'craft-result-2x2');
    if (resultEl) {
        resultEl.innerHTML = result ? itemIconHTML(result) + (result.count > 1 ? `<div class="item-count">${result.count}</div>` : '') : '';
        resultEl.classList.toggle('has-result', !!result);
        resultEl.dataset.craftSize = size;
    }

    // Name of the item that will be produced, shown under the arrow so the
    // player can see what they're about to craft without guessing from the
    // icon alone.
    const nameEl = document.getElementById(size === 3 ? 'craft-result-name-3x3' : 'craft-result-name-2x2');
    if (nameEl) {
        const data = result ? Registry.get(result.id) : null;
        nameEl.textContent = data ? data.name : '';
    }

    // "Craft all" button only makes sense once there's actually a result.
    const allBtn = document.getElementById(size === 3 ? 'craft-all-3x3' : 'craft-all-2x2');
    if (allBtn) allBtn.classList.toggle('visible', !!result);
}

function renderCraftUI() {
    renderCraftGrid(2);
    if (Crafting.workbenchOpen) renderCraftGrid(3);
    if (typeof renderInventorySelectedName === 'function') renderInventorySelectedName();
}

function renderWorkbenchOverlay() {
    const overlayEl = document.getElementById('workbench-overlay');
    if (!overlayEl) return;

    if (!Crafting.workbenchOpen) {
        overlayEl.classList.remove('visible');
        return;
    }
    overlayEl.classList.add('visible');

    const mainGrid = document.getElementById('wb-main-grid');
    const hotbarGrid = document.getElementById('wb-hotbar-grid');
    let mainHTML = '';
    for (let i = Inventory.HOTBAR_SIZE; i < Inventory.TOTAL_SIZE; i++) mainHTML += buildSlotHTML(i, 'main');
    if (mainGrid) mainGrid.innerHTML = mainHTML;
    let hbHTML = '';
    for (let i = 0; i < Inventory.HOTBAR_SIZE; i++) hbHTML += buildSlotHTML(i, 'hotbar');
    if (hotbarGrid) hotbarGrid.innerHTML = hbHTML;

    renderCraftGrid(3);

    const dragEl = document.getElementById('drag-item');
    if (dragEl) {
        if (Inventory.dragging) {
            dragEl.innerHTML = itemIconHTML(Inventory.dragging.item) +
                (Inventory.dragging.item.count > 1 ? `<div class="item-count">${Inventory.dragging.item.count}</div>` : '');
            dragEl.classList.add('visible');
        } else {
            dragEl.classList.remove('visible');
            dragEl.innerHTML = '';
        }
    }
}

// ============================================
// Event wiring
// ============================================

function setupCraftGridControls(containerEl, size) {
    if (!containerEl) return;
    containerEl.addEventListener('click', (e) => {
        const slotEl = e.target.closest('.craft-slot');
        if (slotEl) {
            const index = parseInt(slotEl.dataset.index, 10);
            Crafting.handleCraftSlotClick(size, index);
            return;
        }
        const resultEl = e.target.closest('.craft-result-slot');
        if (resultEl && resultEl.classList.contains('has-result')) {
            Crafting.handleResultClick(size);
        }
    });
}

function setupCraftingControls() {
    const grid2 = document.getElementById('craft-grid-2x2');
    setupCraftGridControls(grid2 ? grid2.parentElement : null, 2);
    const grid3 = document.getElementById('craft-grid-3x3');
    setupCraftGridControls(grid3 ? grid3.parentElement : null, 3);

    const craftAll2 = document.getElementById('craft-all-2x2');
    if (craftAll2) craftAll2.addEventListener('click', (e) => { e.stopPropagation(); Crafting.craftAll(2); });
    const craftAll3 = document.getElementById('craft-all-3x3');
    if (craftAll3) craftAll3.addEventListener('click', (e) => { e.stopPropagation(); Crafting.craftAll(3); });

    const rebalance2 = document.getElementById('craft-rebalance-2x2');
    if (rebalance2) rebalance2.addEventListener('click', (e) => { e.stopPropagation(); Crafting.rebalance(2); });
    const rebalance3 = document.getElementById('craft-rebalance-3x3');
    if (rebalance3) rebalance3.addEventListener('click', (e) => { e.stopPropagation(); Crafting.rebalance(3); });

    const wbCloseBtn = document.getElementById('workbench-close');
    if (wbCloseBtn) wbCloseBtn.addEventListener('click', () => Crafting.closeWorkbench());

    const wbOverlay = document.getElementById('workbench-overlay');
    if (wbOverlay) {
        wbOverlay.addEventListener('click', (e) => {
            if (e.target === wbOverlay) Crafting.closeWorkbench();
        });

        // Press&hold / right-click -> split, on the workbench's own
        // inventory/hotbar grid - same attachSlotSplitGesture helper the
        // main inventory overlay and GUI-block panels use, so this was the
        // other overlay where stack-splitting previously had no effect at
        // all (craft-grid cells are excluded, same reasoning as the main
        // inventory overlay: they have their own separate click handling
        // and their data-index values overlap with hotbar/main indices).
        const getSplittableSlotEl = (e) => e.target.closest('.inv-slot:not(.craft-slot)');
        const splitGesture = (typeof attachSlotSplitGesture === 'function')
            ? attachSlotSplitGesture(
                wbOverlay,
                getSplittableSlotEl,
                (slotEl) => {
                    Inventory.handleSlotRightClick(parseInt(slotEl.dataset.index, 10));
                    renderWorkbenchOverlay();
                }
            )
            : { consumeLongPress: () => false };

        // Reuse the same slot click handling as the main inventory overlay
        // for the workbench's own inventory/hotbar grids.
        wbOverlay.addEventListener('click', (e) => {
            if (splitGesture.consumeLongPress()) {
                // the long-press already performed the split; ignore the click that follows it
                return;
            }
            const slotEl = e.target.closest('.inv-slot:not(.craft-slot)');
            if (!slotEl) return;
            const index = parseInt(slotEl.dataset.index, 10);
            Inventory.handleSlotClick(index, e);
            renderWorkbenchOverlay();
        });
        wbOverlay.addEventListener('pointermove', (e) => {
            const dragEl = document.getElementById('drag-item');
            if (dragEl && Inventory.dragging) {
                dragEl.style.left = e.clientX + 'px';
                dragEl.style.top = e.clientY + 'px';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && Crafting.workbenchOpen) {
            Crafting.closeWorkbench();
        }
    });
}

setupCraftingControls();
