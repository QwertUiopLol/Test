// ============================================
// Generic GUI Blocks
// ============================================
// Read this file if you want to add your own interactive station block
// (like a furnace, a saw, anything with its own little UI panel and
// input/output slots) - registry.js's IR-mixer entry is the template to
// copy from. You define the panel's shape as data (the `gui` object on a
// Registry entry); this file is the generic engine that turns that data
// into a working, clickable panel with persistent per-block storage.
//
// Any block can get its own popup panel just by adding a `gui` object to
// its Registry entry (see IR-workbench and IR-mixer in registry.js):
//
//   gui: {
//       title: 'Mixer',                 // panel header text
//       guiTexture: 'assets/xyz.png',   // optional background image for
//                                       // JUST the custom-slots frame
//                                       // (#gui-block-slots) - not the
//                                       // whole panel/inventory menu
//       craft3x3: true,                 // OR: special-case, renders the
//                                       // existing 3x3 Crafting grid
//                                       // instead of plain slots (this is
//                                       // what makes the Workbench work)
//       slots: [                        // plain custom slot layout
//           // Omit x/y for the default auto-flow (flex-wrap) layout.
//           // Add x/y (pixels, relative to the top-left of the slots
//           // panel) to position a slot exactly instead - useful once a
//           // custom guiTexture is in play and slots need to line up with
//           // art drawn on it, e.g. a real Minecraft-style furnace GUI.
//           // Mixing positioned and unpositioned slots in the same list
//           // isn't supported - once ANY slot has x/y, all of them are
//           // laid out absolutely (unpositioned ones default to 0,0).
//           { id: 'input1', label: 'Input 1', x: 20, y: 10 },
//           { id: 'input2', label: 'Input 2', x: 20, y: 60 },
//           { id: 'output', label: 'Output', output: true, x: 90, y: 35 }
//       ],
//       progressBar: {                  // optional processing progress bar
//           x: 55, y: 35,               // top-left position, in pixels,
//                                       // relative to the slots panel
//           width: 32, height: 10,      // size in pixels
//           direction: 'right'          // fill direction: 'right' (default),
//                                       // 'left', 'up', or 'down'
//       }
//   }
//
// This module owns opening/closing the panel, persisting each placed GUI
// block's own slot contents (keyed by world position, so different mixers
// on the map don't share items), rendering it (custom slots + the same
// inventory/hotbar grid every GUI panel gets), and running any
// GuiBlockRecipeRegistry recipes for blocks that process automatically
// (`output`-slot blocks). The Workbench keeps using the existing Crafting
// system underneath (craft3x3) - this module just becomes the one place
// that decides WHICH panel body to show.

const GuiBlocks = {
    // Per-placed-block slot storage, keyed by "x,y" -> { [slotId]: {id,count}|null }.
    // This is WHY two Mixers placed in different spots don't share items:
    // each world position gets its own independent slot state here, only
    // created the first time that specific block is opened (see getSlots).
    storage: {},

    // Currently open GUI block, or null.
    // { x, y, blockId, guiDef }
    open: null,

    keyFor(x, y) { return `${x},${y}`; },

    // Lazily creates/returns the slot state for a placed GUI block. First
    // time a given (x,y) is opened, every slot defined in guiDef.slots
    // starts out empty (null); after that, the same object is reused so
    // items placed in it persist between opens/closes.
    getSlots(x, y, guiDef) {
        const key = this.keyFor(x, y);
        if (!this.storage[key]) {
            const slots = {};
            guiDef.slots.forEach(s => { slots[s.id] = null; });
            this.storage[key] = slots;
        }
        return this.storage[key];
    },

    // Called from useSelected() in tInter.js when interacting with a block
    // that has a `gui` entry. Returns true if it handled the interaction
    // (so the caller doesn't fall through to placeBlock()).
    tryOpen(blockId, x, y) {
        const data = Registry.get(blockId);
        if (!data || !data.gui) return false;

        if (data.gui.craft3x3) {
            // Delegate to the existing Workbench crafting UI.
            if (typeof Crafting !== 'undefined') Crafting.openWorkbench();
            return true;
        }

        this.open = { x, y, blockId, guiDef: data.gui };
        if (typeof Inventory !== 'undefined') {
            Inventory.isOpen = false;
            if (typeof renderInventory === 'function') renderInventory();
        }
        if (typeof Crafting !== 'undefined' && Crafting.workbenchOpen) Crafting.closeWorkbench();
        renderGuiBlockOverlay();
        return true;
    },

    close() {
        if (!this.open) return;
        // Closing while holding an item (picked up from a custom slot)
        // returns it to the inventory, same as closing the player
        // inventory/workbench overlay does.
        if (Inventory.dragging) Inventory.cancelDrag();
        this.open = null;
        renderGuiBlockOverlay();
    },

    // ---- slot click logic (mirrors Inventory.handleSlotClick) ----
    // Same pickup/drop/merge/swap decision tree as the player inventory's
    // own handleSlotClick in inventory.js, just operating on this block's
    // `slots` object instead of Inventory.slots - with one extra rule:
    // output slots (slotDef.output) can only be taken FROM, never placed
    // INTO, since they're meant to hold whatever the block produces.
    handleSlotClick(slotId) {
        if (!this.open) return;
        const slots = this.getSlots(this.open.x, this.open.y, this.open.guiDef);
        const slotDef = this.open.guiDef.slots.find(s => s.id === slotId);
        const clicked = slots[slotId];

        // Fluid slots (registry.js `gui.slots[].fluidSlot: true` - see
        // FluidSlots in fluids.js) work completely differently from a
        // normal item slot: they never actually HOLD the capsule you tap
        // against them, they just move fluid into/out of a separate
        // internal buffer and leave the (now updated) capsule in your
        // hand. Route to that engine first and stop here if it applies -
        // a fluid slot should never fall through to the plain item
        // pickup/merge/swap logic below.
        if (slotDef && slotDef.fluidSlot) {
            if (typeof FluidSlots !== 'undefined' && FluidSlots.tryHandleCapsuleDrop(this.open.x, this.open.y, slotDef)) {
                Inventory.onChange();
                renderGuiBlockOverlay();
                return;
            }
            // Not currently dragging a capsule (or dragging a non-capsule
            // item) - a fluid slot has no plain item to pick up, so a
            // click here with nothing relevant in hand simply does
            // nothing, rather than falling through to slots[slotId]
            // (which is never populated for a fluidSlot in the first
            // place).
            return;
        }

        if (!Inventory.dragging) {
            if (!clicked) return;
            Inventory.dragging = { fromIndex: null, item: clicked };
            slots[slotId] = null;
            Inventory.displayedItemId = clicked.id;
        } else {
            // Output slots only ever give items out - you can't place into them.
            if (slotDef && slotDef.output) {
                return;
            }
            const dragItem = Inventory.dragging.item;
            if (!clicked) {
                slots[slotId] = dragItem;
                Inventory.dragging = null;
            } else if (clicked.id === dragItem.id && (typeof Fluids === 'undefined' || Fluids.stacksMatch(clicked, dragItem))) {
                // Fluids.stacksMatch guard: see the same note in
                // Inventory.handleSlotClick (inventory.js) - a shared id
                // isn't enough for a capsule to merge, its fluid/amount
                // must match too.
                const maxStack = Inventory.maxStackFor(clicked.id);
                const space = Math.max(0, maxStack - clicked.count);
                if (space > 0) {
                    const move = Math.min(space, dragItem.count);
                    clicked.count += move;
                    dragItem.count -= move;
                    if (dragItem.count <= 0) Inventory.dragging = null;
                } else {
                    slots[slotId] = dragItem;
                    Inventory.dragging = { fromIndex: null, item: clicked };
                }
            } else {
                slots[slotId] = dragItem;
                Inventory.dragging = { fromIndex: null, item: clicked };
            }
        }
        Inventory.onChange();
        renderGuiBlockOverlay();
    },

    // Right click / long-press on a custom GUI-block slot: split the stack,
    // exactly mirroring Inventory.handleSlotRightClick (inventory.js) so
    // stack-splitting works the same way here as it does in the player
    // inventory - previously this was the ONE place in the game where a
    // split gesture had no effect at all, since only inventory.js's overlay
    // wired up the long-press/contextmenu handlers.
    //   - nothing dragging + slot has 1 item        -> pick up the single item
    //   - nothing dragging + slot has 2 items        -> split 1/1 directly
    //   - nothing dragging + slot has 3+ items       -> open the exact-amount split popup
    //   - dragging + clicked empty slot              -> drop exactly 1
    //   - dragging + clicked matching stack with room -> merge exactly 1
    //   - output slots can't be split INTO, only picked up from (same rule
    //     as handleSlotClick above)
    handleSlotRightClick(slotId) {
        if (!this.open) return;
        const slots = this.getSlots(this.open.x, this.open.y, this.open.guiDef);
        const slotDef = this.open.guiDef.slots.find(s => s.id === slotId);
        const clicked = slots[slotId];

        // Fluid slots have no plain item stack to split - a fluid slot's
        // "amount" is split by capacity, not stack count, so there's
        // nothing for a stack-split gesture to do here.
        if (slotDef && slotDef.fluidSlot) return;

        const cloneStack = (typeof Fluids !== 'undefined') ? Fluids.cloneStack.bind(Fluids) : (s, c) => ({ id: s.id, count: c });

        if (!Inventory.dragging) {
            if (!clicked) return;
            if (clicked.count <= 1) {
                Inventory.dragging = { fromIndex: null, item: clicked };
                slots[slotId] = null;
                Inventory.onChange();
                renderGuiBlockOverlay();
                return;
            }
            if (clicked.count < 3) {
                const half = Math.ceil(clicked.count / 2);
                const remain = clicked.count - half;
                Inventory.dragging = { fromIndex: null, item: cloneStack(clicked, half) };
                slots[slotId] = remain > 0 ? cloneStack(clicked, remain) : null;
                Inventory.onChange();
                renderGuiBlockOverlay();
                return;
            }
            // Let the player pick exactly how many items to take out of the
            // stack, same popup the player inventory uses - openSplitPopup
            // only needs an { index, item } to work from, and a GUI-block
            // slot id fits that shape just as well as a numeric inventory
            // index (confirmSplit below is what actually applies it back
            // to the right place).
            if (typeof openSplitPopup === 'function') {
                openSplitPopup(slotId, { guiBlockSlot: true });
            }
            return;
        }

        if (slotDef && slotDef.output) return; // can't place into an output slot

        const dragItem = Inventory.dragging.item;
        if (!clicked) {
            slots[slotId] = cloneStack(dragItem, 1);
            dragItem.count -= 1;
            if (dragItem.count <= 0) Inventory.dragging = null;
        } else if (clicked.id === dragItem.id && (typeof Fluids === 'undefined' || Fluids.stacksMatch(clicked, dragItem))) {
            const maxStack = Inventory.maxStackFor(clicked.id);
            if (clicked.count < maxStack) {
                clicked.count += 1;
                dragItem.count -= 1;
                if (dragItem.count <= 0) Inventory.dragging = null;
            }
        }
        // if right-clicking a different, non-empty stack -> do nothing
        Inventory.onChange();
        renderGuiBlockOverlay();
    },

    // ---- automatic processing (mixer-style blocks) ----
    // Runs every tick for every placed GUI block that has matching
    // GuiBlockRecipeRegistry recipes: if the required inputs are present
    // and the output slot has room, consumes the inputs and produces the
    // result after `ticks` ticks of progress.
    //
    // How the loop below works, plainly:
    //   for every placed GUI block we know about ->
    //     find which recipes even apply to this block type ->
    //     does ANY of them currently match what's in its input slots? ->
    //       no  -> forget any in-progress recipe, nothing to do this tick
    //       yes -> add 1 tick of progress toward that recipe; once
    //              progress reaches recipe.ticks, actually consume the
    //              inputs and produce the output (consumeAndProduce)
    progress: {}, // "x,y" -> { recipeId, ticksDone }

    processTick() {
        if (typeof GuiBlockRecipeRegistry === 'undefined') return;
        for (const key in this.storage) {
            const [x, y] = key.split(',');
            const blockId = getGlobalOverlayType(Number(x), Number(y)) || getGlobalCellType(Number(x), Number(y));
            const recipes = GuiBlockRecipeRegistry.recipes.filter(r => r.block === blockId);
            if (recipes.length === 0) continue;

            const slots = this.storage[key];
            const recipe = recipes.find(r => this.canProcess(slots, r));
            if (!recipe) {
                delete this.progress[key];
                continue;
            }

            const prog = this.progress[key] && this.progress[key].recipeId === recipe.id
                ? this.progress[key]
                : { recipeId: recipe.id, ticksDone: 0 };
            prog.ticksDone++;

            if (prog.ticksDone >= recipe.ticks) {
                this.consumeAndProduce(slots, recipe);
                delete this.progress[key];
            } else {
                this.progress[key] = prog;
            }
            // Re-render every tick the bar is progressing (not just on the
            // tick it completes) - otherwise the fill never visibly moves
            // even though ticksDone is incrementing underneath, and then
            // jumps straight from empty to gone once the craft finishes.
            if (this.open && this.keyFor(this.open.x, this.open.y) === key) renderGuiBlockOverlay();
        }
    },

    // recipe.orderMatters (default true) controls how `recipe.ingredients`
    // is matched against the block's input slots:
    //   - true  (default, old behavior): each key in `ingredients` IS a
    //     specific slot id (e.g. input1/input2) - that exact slot must hold
    //     that exact item. Put the right item in the wrong slot and it
    //     won't match, just like a shaped crafting-grid recipe.
    //   - false : `ingredients` is treated as an unordered bag (a plain
    //     array of {id, count}, position/slot doesn't matter) - any input
    //     slot can hold any of the required items, in any arrangement,
    //     as long as the input slots collectively contain at least the
    //     needed amount of each id. Same idea as a "shapeless" crafting
    //     recipe, just applied to a GUI block's input slots instead of a
    //     crafting grid.
    canProcess(slots, recipe) {
        if (recipe.orderMatters === false) return this.canProcessShapeless(slots, recipe);

        for (const slotId in recipe.ingredients) {
            const need = recipe.ingredients[slotId];
            const have = slots[slotId];
            if (!have || have.id !== need.id || have.count < need.count) return false;
        }
        return this.outputHasRoom(slots, recipe);
    },

    // Unordered match: pools every INPUT slot's contents together (skips
    // the output slot) and checks the pool holds enough of each required
    // id, regardless of which slot it's actually sitting in.
    canProcessShapeless(slots, recipe) {
        const need = {};
        recipe.ingredients.forEach(ing => {
            need[ing.id] = (need[ing.id] || 0) + ing.count;
        });

        const have = {};
        for (const slotId in slots) {
            const def = this.currentGuiDefSlot(slotId);
            if (def && def.output) continue; // don't count the output slot as an ingredient source
            const item = slots[slotId];
            if (!item) continue;
            have[item.id] = (have[item.id] || 0) + item.count;
        }

        for (const id in need) {
            if ((have[id] || 0) < need[id]) return false;
        }
        return this.outputHasRoom(slots, recipe);
    },

    outputHasRoom(slots, recipe) {
        const outSlot = Object.keys(slots).find(id => {
            const def = this.currentGuiDefSlot(id);
            return def && def.output;
        });
        if (outSlot) {
            const existing = slots[outSlot];
            if (existing && existing.id !== recipe.result.id) return false;
            const maxStack = Inventory.maxStackFor(recipe.result.id);
            if (existing && existing.count + recipe.result.count > maxStack) return false;
        }
        return true;
    },

    currentGuiDefSlot(slotId) {
        // Only meaningful while a matching panel is open; falls back to
        // scanning the registry for any block whose gui defines this slot
        // id as output, which is fine since slot ids are scoped per block
        // type in practice (input1/input2/output).
        if (this.open) {
            const def = this.open.guiDef.slots.find(s => s.id === slotId);
            if (def) return def;
        }
        for (const id in Registry.blocks) {
            const g = Registry.blocks[id].gui;
            if (g && g.slots) {
                const def = g.slots.find(s => s.id === slotId);
                if (def) return def;
            }
        }
        return null;
    },

    consumeAndProduce(slots, recipe) {
        if (recipe.orderMatters === false) {
            this.consumeShapeless(slots, recipe);
        } else {
            for (const slotId in recipe.ingredients) {
                const need = recipe.ingredients[slotId];
                slots[slotId].count -= need.count;
                if (slots[slotId].count <= 0) slots[slotId] = null;
            }
        }
        const outSlot = Object.keys(slots).find(id => {
            const def = this.currentGuiDefSlot(id);
            return def && def.output;
        });
        if (!outSlot) return;
        if (slots[outSlot]) slots[outSlot].count += recipe.result.count;
        else slots[outSlot] = { id: recipe.result.id, count: recipe.result.count };
    },

    // Consumes exactly what's owed of each required id, pulled out of
    // whichever input slot(s) actually hold it - mirrors Crafting.craftOnce's
    // shapeless branch in crafting.js.
    consumeShapeless(slots, recipe) {
        const need = {};
        recipe.ingredients.forEach(ing => {
            need[ing.id] = (need[ing.id] || 0) + ing.count;
        });
        for (const slotId in slots) {
            const def = this.currentGuiDefSlot(slotId);
            if (def && def.output) continue;
            const item = slots[slotId];
            if (!item) continue;
            const owed = need[item.id] || 0;
            if (owed <= 0) continue;
            const take = Math.min(owed, item.count);
            item.count -= take;
            need[item.id] -= take;
            if (item.count <= 0) slots[slotId] = null;
        }
    }
};

if (typeof TickSystem !== 'undefined') {
    TickSystem.onTick(() => GuiBlocks.processTick());
}

// ============================================
// Rendering
// ============================================
// The panel is built entirely in JS (no per-block HTML needed in
// index.html) and mounted into a single reusable overlay element. This
// means adding a brand-new station block never requires editing
// index.html - the very first call to renderGuiBlockOverlay() (see the
// `if (!overlayEl)` branch below) creates the shared DOM structure lazily,
// and every subsequent open just repopulates it with that block's own
// `gui` data and slot contents.

// `positioned` is true once ANY slot in the block's gui.slots list has an
// x/y - at that point every slot in the panel is laid out with
// position:absolute (via inline style) instead of the default flex-wrap,
// so it can be lined up against a custom guiTexture pixel-for-pixel.
function guiSlotHTML(slotDef, item, positioned, x, y) {
    const posStyle = positioned
        ? ` style="position:absolute; left:${slotDef.x || 0}px; top:${slotDef.y || 0}px;"`
        : '';

    // Fluid slots (see FluidSlots in fluids.js) never hold an actual item
    // stack - they render their own internal buffer's fill level/tooltip
    // instead of an item icon, so the slot visibly reads as "how full is
    // this liquid buffer" rather than looking like an empty item slot.
    if (slotDef.fluidSlot && typeof FluidSlots !== 'undefined') {
        const buffer = FluidSlots.get(x, y, slotDef.id, slotDef.mbCapacity || 0);
        const pct = buffer.capacity > 0 ? Math.round((buffer.amount / buffer.capacity) * 100) : 0;
        const fluidData = buffer.fluid ? FluidRegistry.get(buffer.fluid) : null;
        const fluidColor = fluidData ? fluidData.color : '#888';
        const fillHTML = (buffer.fluid && buffer.amount > 0)
            ? `<div class="item-fluid-fill" style="height:${pct}%;background:${fluidColor};"></div>`
            : '';
        const title = FluidSlots.describe(x, y, slotDef);
        return `<div class="inv-slot gui-slot gui-slot-fluid" data-slot-id="${slotDef.id}" title="${title}"${posStyle}>
            <div class="item-icon has-solid-bg" style="background:#2a2a3a;">${fillHTML}</div>
        </div>`;
    }

    const countHTML = (item && item.count > 1) ? `<div class="item-count">${item.count}</div>` : '';
    const outputClass = slotDef.output ? ' gui-slot-output' : '';
    // Fluid containers show their fill state (e.g. "Water (400 / 1000 mB)")
    // as the slot's tooltip instead of just the item's plain name, so
    // hovering/long-pressing a capsule slot tells you what's actually
    // inside it - same Fluids.describe() used by fluidSlotTitle-style
    // labels elsewhere.
    const title = (item && typeof Fluids !== 'undefined' && Fluids.isContainer(item))
        ? Fluids.describe(item)
        : (slotDef.label || '');
    return `<div class="inv-slot gui-slot${outputClass}" data-slot-id="${slotDef.id}" title="${title}"${posStyle}>
        ${itemIconHTML(item)}
        ${countHTML}
    </div>`;
}

// Renders the optional gui.progressBar for the currently open block, filled
// according to how far along its active GuiBlockRecipeRegistry recipe is
// (0 when nothing is processing). Returns '' when the block defines no
// progressBar at all.
function guiProgressBarHTML(guiDef, x, y) {
    if (!guiDef.progressBar) return '';
    const pb = guiDef.progressBar;
    const key = GuiBlocks.keyFor(x, y);
    let pct = 0;
    // Two independent progress sources can drive this same bar widget:
    // GuiBlocks.progress (item-only recipes, e.g. the Mixer) or
    // ExtractorState.progress (fluid recipes - see fluids.js). Whichever
    // one actually has an in-progress entry for this block wins; a block
    // only ever uses one of the two in practice.
    const itemProg = GuiBlocks.progress[key];
    if (itemProg) {
        const recipe = (typeof GuiBlockRecipeRegistry !== 'undefined')
            ? GuiBlockRecipeRegistry.recipes.find(r => r.id === itemProg.recipeId)
            : null;
        if (recipe) pct = Math.max(0, Math.min(100, (itemProg.ticksDone / recipe.ticks) * 100));
    }
    if (typeof ExtractorState !== 'undefined') {
        const fluidProg = ExtractorState.progress[key];
        if (fluidProg) {
            const recipe = (typeof FluidRecipeRegistry !== 'undefined')
                ? FluidRecipeRegistry.recipes.find(r => r.id === fluidProg.recipeId)
                : null;
            if (recipe) pct = Math.max(0, Math.min(100, (fluidProg.ticksDone / recipe.ticks) * 100));
        }
    }
    const dir = pb.direction || 'right';
    const width = pb.width || 32;
    const height = pb.height || 10;
    // Fill grows from the appropriate edge depending on direction, using
    // the same idea as the break-bar (a child sized to a %, no JS layout
    // math needed beyond picking which axis/edge to grow from).
    let fillStyle;
    if (dir === 'left') {
        fillStyle = `position:absolute; top:0; right:0; height:100%; width:${pct}%;`;
    } else if (dir === 'up') {
        fillStyle = `position:absolute; left:0; bottom:0; width:100%; height:${pct}%;`;
    } else if (dir === 'down') {
        fillStyle = `position:absolute; left:0; top:0; width:100%; height:${pct}%;`;
    } else {
        fillStyle = `position:absolute; top:0; left:0; height:100%; width:${pct}%;`;
    }
    return `<div class="gui-progress-bar" style="position:absolute; left:${pb.x || 0}px; top:${pb.y || 0}px; width:${width}px; height:${height}px;">
        <div class="gui-progress-bar-fill" style="${fillStyle}"></div>
    </div>`;
}

// ---- "Super Tank" style display (gui.tankDisplay: true) ----
// A big fluid-gauge readout used instead of the plain icon-grid slots
// layout - built for IR-tank (see fluids.js) but usable by any block that
// sets `tankDisplay: true` on its gui entry and reads its fluid state from
// TankState. Shows exactly the top portion asked for (title bar already
// comes from the panel header) - a large "Liquid Amount" bar with the
// exact mB count, and a "Locked Fluid" readout for whichever fluid this
// Tank is currently committed to. No extra button row underneath (the
// small side-button column in reference art belongs to a different mod's
// GUI chrome, not to this game's control set) - the two functional
// capsuleIn/capsuleOut slots this block actually needs still render, just
// as a small pair beneath the gauge instead of being the whole panel.
function tankDisplayHTML(guiDef, x, y) {
    const tank = (typeof TankState !== 'undefined') ? TankState.get(x, y) : { capacity: 0, fluid: null, amount: 0 };
    const pct = tank.capacity > 0 ? Math.max(0, Math.min(100, (tank.amount / tank.capacity) * 100)) : 0;
    const fluidData = tank.fluid ? FluidRegistry.get(tank.fluid) : null;
    const fluidColor = fluidData ? fluidData.color : '#2a2a3a';
    const fluidName = fluidData ? fluidData.name : 'None';
    const amountLabel = `${tank.amount.toLocaleString()}`;

    const slots = GuiBlocks.getSlots(x, y, guiDef);
    // Slot `label`s (e.g. "Insert Capsule"/"Result") only ever showed up as
    // a hover/long-press tooltip via guiSlotHTML's `title` attribute -
    // easy to miss, especially on touch. Render each one as visible text
    // directly under its slot here instead of relying on the tooltip.
    const capsuleSlotsHTML = guiDef.slots.map(s => `
        <div class="tank-capsule-slot-col">
            ${guiSlotHTML(s, slots[s.id], false, x, y)}
            <div class="tank-capsule-slot-label">${s.label || ''}</div>
        </div>`).join('');

    return `
        <div class="tank-display">
            <div class="tank-gauge">
                <div class="tank-gauge-fill" style="height:${pct}%;background-color:${fluidColor};"></div>
                <div class="tank-gauge-label">
                    <div class="tank-gauge-title">Liquid Amount</div>
                    <div class="tank-gauge-amount">${amountLabel} / ${tank.capacity.toLocaleString()} mB</div>
                </div>
            </div>
            <div class="tank-locked-fluid">
                <div class="tank-locked-fluid-title">Locked Fluid</div>
                <div class="tank-locked-fluid-row">
                    <div class="tank-locked-fluid-swatch" style="background-color:${fluidColor};"></div>
                    <div class="tank-locked-fluid-name">${tank.fluid ? fluidName : 'Empty'}</div>
                </div>
                <button class="tank-lock-btn${tank.locked ? ' active' : ''}" data-tank-lock="1" data-x="${x}" data-y="${y}"
                    title="When on, this Tank only ever accepts the fluid it's already holding (even once fully drained) - nothing else can be poured in until it's unlocked again.">
                    ${tank.locked ? 'Locked' : 'Unlocked'}
                </button>
            </div>
            <div class="tank-capsule-slots">${capsuleSlotsHTML}</div>
            <div class="tank-capsule-hint">Put a capsule in "Insert Capsule" - it fills from the tank, or drains into it if it's holding a different fluid. Collect the result from the "Result" slot.</div>
        </div>`;
}

function renderGuiBlockOverlay() {
    let overlayEl = document.getElementById('gui-block-overlay');
    if (!overlayEl) {
        overlayEl = document.createElement('div');
        overlayEl.id = 'gui-block-overlay';
        overlayEl.className = 'inventory-overlay';
        overlayEl.innerHTML = `
            <div class="inventory-panel" id="gui-block-panel">
                <div class="inventory-panel-header">
                    <span id="gui-block-title">Block</span>
                    <button id="gui-block-close" class="inv-close-btn">✕</button>
                </div>
                <div id="gui-block-slots" class="gui-block-slots"></div>
                <div id="gui-block-selected-name" class="inv-selected-name"></div>
                <div id="gui-block-main-grid" class="inv-grid main-grid"></div>
                <div class="inv-hotbar-section">
                    <div id="gui-block-hotbar-grid" class="inv-grid hotbar-grid"></div>
                </div>
            </div>`;
        document.body.appendChild(overlayEl);

        document.getElementById('gui-block-close').addEventListener('click', () => GuiBlocks.close());
        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) GuiBlocks.close();
        });

        // Press&hold / right-click -> split, on EITHER kind of slot this
        // panel shows: its own custom slots (.gui-slot, split via
        // GuiBlocks.handleSlotRightClick) and the player inventory/hotbar
        // grid underneath (.inv-slot, split via Inventory.handleSlotRightClick,
        // same as the main inventory overlay). Uses the same
        // attachSlotSplitGesture helper as inventory.js/crafting.js so
        // stack-splitting behaves identically everywhere in the game.
        const getSplittableSlotEl = (e) => e.target.closest('.gui-slot, .inv-slot:not(.gui-slot)');
        const splitGesture = attachSlotSplitGesture(
            overlayEl,
            getSplittableSlotEl,
            (slotEl) => {
                if (slotEl.classList.contains('gui-slot')) {
                    GuiBlocks.handleSlotRightClick(slotEl.dataset.slotId);
                } else {
                    Inventory.handleSlotRightClick(parseInt(slotEl.dataset.index, 10));
                    renderGuiBlockOverlay();
                }
            }
        );

        overlayEl.addEventListener('click', (e) => {
            if (splitGesture.consumeLongPress()) {
                // the long-press already performed the split; ignore the click that follows it
                return;
            }
            // Super Tank's "Locked Fluid" toggle button (see
            // tankDisplayHTML above / TankState.toggleLock in fluids.js) -
            // checked before the slot lookups below since it's not a slot
            // at all, just a plain button inside the tank-display panel.
            const lockBtn = e.target.closest('[data-tank-lock]');
            if (lockBtn) {
                const x = parseInt(lockBtn.dataset.x, 10);
                const y = parseInt(lockBtn.dataset.y, 10);
                if (typeof TankState !== 'undefined') TankState.toggleLock(x, y);
                renderGuiBlockOverlay();
                return;
            }
            const slotEl = e.target.closest('.gui-slot');
            if (slotEl) {
                GuiBlocks.handleSlotClick(slotEl.dataset.slotId);
                return;
            }
            const invSlotEl = e.target.closest('.inv-slot:not(.gui-slot)');
            if (invSlotEl) {
                const index = parseInt(invSlotEl.dataset.index, 10);
                Inventory.handleSlotClick(index, e);
                renderGuiBlockOverlay();
            }
        });
        overlayEl.addEventListener('pointermove', (e) => {
            const dragEl = document.getElementById('drag-item');
            if (dragEl && Inventory.dragging) {
                dragEl.style.left = e.clientX + 'px';
                dragEl.style.top = e.clientY + 'px';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && GuiBlocks.open) GuiBlocks.close();
        });
    }

    if (!GuiBlocks.open) {
        overlayEl.classList.remove('visible');
        return;
    }
    overlayEl.classList.add('visible');

    const { blockId, guiDef, x, y } = GuiBlocks.open;
    document.getElementById('gui-block-title').textContent = guiDef.title || (Registry.get(blockId) || {}).name || 'Block';

    // The panel itself (header + custom slots + player inventory/hotbar)
    // never gets the texture - only #gui-block-slots below does, so the
    // art only shows behind the custom slots frame, not the whole menu.
    const panelEl = document.getElementById('gui-block-panel');
    panelEl.style.backgroundImage = '';

    const slots = GuiBlocks.getSlots(x, y, guiDef);
    const slotsEl = document.getElementById('gui-block-slots');
    slotsEl.classList.toggle('tank-display-mode', !!guiDef.tankDisplay);
    if (guiDef.tankDisplay) {
        // Super-Tank-style gauge display (see tankDisplayHTML above) - no
        // positioned-slot layout or guiTexture background applies here,
        // it draws its own gauge/labels/slots entirely.
        slotsEl.classList.remove('gui-block-slots-positioned');
        slotsEl.style.backgroundImage = '';
        slotsEl.innerHTML = tankDisplayHTML(guiDef, x, y) + guiProgressBarHTML(guiDef, x, y);
    } else {
        const positioned = guiDef.slots.some(s => s.x !== undefined || s.y !== undefined);
        slotsEl.classList.toggle('gui-block-slots-positioned', positioned);
        if (guiDef.guiTexture) {
            slotsEl.style.backgroundImage = `url("${guiDef.guiTexture}")`;
            slotsEl.style.backgroundSize = 'cover';
            slotsEl.style.backgroundPosition = 'center';
        } else {
            slotsEl.style.backgroundImage = '';
        }
        slotsEl.innerHTML = guiDef.slots.map(s => guiSlotHTML(s, slots[s.id], positioned, x, y)).join('')
            + guiProgressBarHTML(guiDef, x, y);
    }

    // Name of the item currently picked up (or last picked up) from either
    // a custom slot or the inventory/hotbar grid below it - same idea as
    // the player inventory/workbench's own "selected name" label, which
    // this panel didn't have before.
    const nameEl = document.getElementById('gui-block-selected-name');
    if (nameEl) {
        const id = Inventory.dragging ? Inventory.dragging.item.id : Inventory.displayedItemId;
        const nameData = id ? Registry.get(id) : null;
        const draggedStack = Inventory.dragging ? Inventory.dragging.item : null;
        if (draggedStack && typeof Fluids !== 'undefined' && Fluids.isContainer(draggedStack)) {
            nameEl.textContent = Fluids.describe(draggedStack);
        } else {
            nameEl.textContent = nameData ? nameData.name : '';
        }
    }

    const mainGrid = document.getElementById('gui-block-main-grid');
    let mainHTML = '';
    for (let i = Inventory.HOTBAR_SIZE; i < Inventory.TOTAL_SIZE; i++) mainHTML += buildSlotHTML(i, 'main');
    mainGrid.innerHTML = mainHTML;

    const hotbarGrid = document.getElementById('gui-block-hotbar-grid');
    let hbHTML = '';
    for (let i = 0; i < Inventory.HOTBAR_SIZE; i++) hbHTML += buildSlotHTML(i, 'hotbar');
    hotbarGrid.innerHTML = hbHTML;

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
