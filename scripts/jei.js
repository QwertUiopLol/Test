// ============================================
// JEI-style Item List ("Just Enough Items")
// ============================================
// This file's job: given the Registry (registry.js) and every recipe
// source (CraftingRegistry + GuiBlockRecipeRegistry), let the player
// browse "what exists" and "how do I make/use it" without needing to
// already know the recipes. It reads other systems' data but doesn't
// mutate world/inventory state itself except via JEI.give() (TEST_MODE
// cheat-give) and clicking through recipe chains (pure navigation).
//
// Shows every registered block/item in one searchable grid (no top-level
// station tabs cluttering the main list - a station's own recipes live on
// that station item's own detail view instead, see below).
//
// Tapping any item opens its detail view, which has up to three sub-tabs:
//   - "Recipe"  : every recipe that crafts this item (what you already had).
//   - "Usage"   : every recipe/process that CONSUMES this item - i.e. what
//                 it's good for. Covers both player crafting-grid recipes
//                 (CraftingRegistry) and automatic GUI-block processing
//                 recipes (GuiBlockRecipeRegistry, e.g. the Mixer).
//   - "Produce" : station items only (any block with a `gui` entry, e.g.
//                 Workbench/Mixer) - what that station can make. Hidden
//                 for non-station items. What consumes the station block
//                 itself lives on that item's own "Usage" tab instead
//                 (usagesFor) - not duplicated in here.

const JEI = {
    isOpen: false,
    query: '',

    // Small "Give Item / View Recipes" popup shown on long-press of a slot.
    contextMenu: {
        open: false,
        id: null
    },

    // Full-page item detail view (Recipe / Usage / Produce sub-tabs),
    // opened from the context menu or straight from a tap when TEST_MODE
    // is off (see openRecipesFor()).
    recipeView: {
        open: false,
        id: null,
        // 'recipe' = how to craft this item, 'usage' = what it's used for,
        // 'produce' = (station items only) what this station can make.
        subTab: 'recipe',
        // Navigation history: every previous { id, subTab } visited while
        // drilling into a recipe chain (tapping an ingredient/result icon
        // inside a recipe card jumps to THAT item's own detail view). Back
        // pops one entry off this stack instead of always closing the
        // whole detail view, so "recipe -> click ingredient -> Back"
        // returns to the recipe list, not straight to the main item grid.
        history: []
    },

    // Every registered block/item, sorted alphabetically - the base list
    // that filteredEntries() below narrows down by search text.
    allEntries() {
        const blocks = Object.values(Registry.blocks);
        const items = Object.values(Registry.items);
        return [...blocks, ...items].sort((a, b) => a.name.localeCompare(b.name));
    },

    // ---- craft stations (used by the "Produce" sub-tab on a station
    //      item's own detail view - see renderJEIRecipeView) ----

    // Every block registered with a `gui` entry is a "station": the
    // Workbench (craft3x3 -> the full CraftingRegistry, since anything
    // shapeless/shaped2x2/shaped3x3 can be made on a 3x3 grid), and any
    // processing block like the Mixer (slots w/ an output -> its own
    // GuiBlockRecipeRegistry recipes). The player's own inventory 2x2 grid
    // is included as a pseudo-station too, since it can craft a subset of
    // recipes without needing to place any block at all - it has no item
    // of its own, so it never gets a "Produce" tab, but stationRecipes()
    // still needs to answer for it.
    stations() {
        const list = [{
            id: 'inventory',
            name: 'Inventory (2x2)',
            icon: '',
            texture: null,
            color: '#556b8a',
            isInventory: true
        }];
        for (const id in Registry.blocks) {
            const data = Registry.blocks[id];
            if (data.gui) {
                list.push({
                    id: data.id,
                    name: data.gui.title || data.name,
                    icon: data.icon,
                    texture: data.texture,
                    color: data.color,
                    isInventory: false,
                    craft3x3: !!data.gui.craft3x3
                });
            }
        }
        return list;
    },

    // Recipes obtainable at a given station id.
    stationRecipes(stationId) {
        if (stationId === 'inventory') {
            return CraftingRegistry.recipes.filter(r => r.type === 'shapeless' || r.type === 'shaped2x2');
        }
        const station = this.stations().find(s => s.id === stationId);
        if (!station) return [];
        if (station.craft3x3) {
            // A 3x3 grid can make anything in CraftingRegistry.
            return CraftingRegistry.recipes.slice();
        }
        if (typeof GuiBlockRecipeRegistry !== 'undefined') {
            return GuiBlockRecipeRegistry.recipes.filter(r => r.block === stationId);
        }
        return [];
    },

    // Every distinct result item id a station can produce, in registry order.
    stationEntries(stationId) {
        const recipes = this.stationRecipes(stationId);
        const seen = new Set();
        const out = [];
        recipes.forEach(r => {
            if (!r.result || seen.has(r.result.id)) return;
            seen.add(r.result.id);
            const data = Registry.get(r.result.id);
            if (data) out.push(data);
        });
        return out.sort((a, b) => a.name.localeCompare(b.name));
    },

    // Every recipe (anywhere - crafting grid or another GUI block) that
    // consumes the given station's own block id as an ingredient. E.g. for
    // the Workbench this finds recipes where 'IR-workbench' itself is one
    // of the inputs. Same idea as usagesFor() but keyed off the station
    // block rather than a player-picked item; used by the "Produce" tab.
    stationUsageRecipes(stationId) {
        if (stationId === 'inventory') return [];
        return this.usagesFor(stationId);
    },

    // Main item-list grid: every registered block/item, filtered by the
    // search box. No station filtering here - a station's own products
    // live on that station's "Produce" detail sub-tab instead.
    filteredEntries() {
        const q = this.query.trim().toLowerCase();
        const base = this.allEntries();
        if (!q) return base;
        return base.filter(e =>
            (e.name && e.name.toLowerCase().includes(q)) ||
            (e.id && e.id.toLowerCase().includes(q))
        );
    },

    give(id, count) {
        const data = Registry.get(id);
        if (!data) return;
        const amount = count === undefined ? (data.maxStack || 64) : count;
        Inventory.addItem(id, amount);
    },

    // "Recipe" tab data source: all recipes that produce this item as a
    // result, in registry order.
    // Covers both player-crafted recipes and GUI-block auto-processing
    // recipes, tagged with `source` so the recipe card knows how to
    // render + which station it belongs to.
    recipesFor(id) {
        const crafted = CraftingRegistry.recipes
            .filter(r => r.result && r.result.id === id)
            .map(r => ({ ...r, source: 'craft' }));
        const processed = (typeof GuiBlockRecipeRegistry !== 'undefined' ? GuiBlockRecipeRegistry.recipes : [])
            .filter(r => r.result && r.result.id === id)
            .map(r => ({ ...r, source: 'gui' }));
        // Fluid processors deliberately live in FluidRecipeRegistry because
        // their input is measured in mB rather than item stacks.  They are
        // still a production route, so omitting them here made Nutrient Gel
        // look unobtainable in JEI.
        const fluid = (typeof FluidRecipeRegistry !== 'undefined' ? FluidRecipeRegistry.recipes : [])
            .filter(r => r.result && r.result.id === id)
            .map(r => ({
                ...r,
                source: 'fluid',
                // The card needs an item-shaped visual for the liquid input.
                // A filled water capsule is the player-facing way to supply
                // water to the extractor; the label below preserves the
                // exact 250 mB requirement.
                ingredients: [
                    ...(r.ingredient ? [r.ingredient] : []),
                    { id: 'IR-capsule-1000-water', count: 1, fluidAmount: r.fluidAmount }
                ]
            }));
        return [...crafted, ...processed, ...fluid, ...this.gatheringSourcesFor(id)];
    },

    // Not every item enters the game through a crafting grid or a machine.
    // Sifting is a real acquisition route, so expose it alongside recipes
    // instead of leaving raw drops with the misleading "No known recipes"
    // message.  Keeping this derived from ALT_DROP_POOL makes the tooltip
    // automatically stay in sync when the drop table is balanced later.
    gatheringSourcesFor(id) {
        const sifted = typeof ALT_DROP_POOL === 'undefined' ? [] : ALT_DROP_POOL
            .filter(entry => entry.id === id)
            .map(entry => ({
                id: `sifting-${entry.id}`,
                source: 'gathering',
                method: 'Sift dirt',
                ingredients: [{ id: 'IR-dirt', count: 1 }],
                result: { id: entry.id, count: 1 }
            }));
        const blockDrops = Object.values(Registry.blocks)
            .filter(block => block.dropId === id && block.id !== id)
            .map(block => ({
                id: `breaking-${block.id}`,
                source: 'gathering',
                method: `Break ${block.name}`,
                ingredients: [{ id: block.id, count: 1 }],
                result: { id, count: 1 }
            }));
        return [...sifted, ...blockDrops];
    },

    // All recipes/processes that CONSUME this item as an ingredient - the
    // "Usage" tab. Covers shaped/shapeless crafting-grid ingredients and
    // GUI-block input slots.
    usagesFor(id) {
        const crafted = CraftingRegistry.recipes
            .filter(r => recipeUsesIngredient(r, id))
            .map(r => ({ ...r, source: 'craft' }));
        const processed = (typeof GuiBlockRecipeRegistry !== 'undefined' ? GuiBlockRecipeRegistry.recipes : [])
            .filter(r => Object.values(r.ingredients).some(ing => ing.id === id))
            .map(r => ({ ...r, source: 'gui' }));
        return [...crafted, ...processed];
    },

    toggleOverlay() {
        this.isOpen = !this.isOpen;
        renderJEI();
        // Note: deliberately NOT auto-focusing the search input here.
        // Focusing it immediately pops the on-screen keyboard on mobile,
        // covering half the item grid the moment JEI opens. The player
        // can tap the search field themselves if they want to type.
    },

    openOverlay() {
        this.isOpen = true;
        renderJEI();
    },

    closeOverlay() {
        this.isOpen = false;
        this.closeContextMenu();
        this.closeRecipeView();
        renderJEI();
    },

    // ---- context menu (long-press on a slot) ----

    openContextMenu(id) {
        this.contextMenu.open = true;
        this.contextMenu.id = id;
        renderJEI();
    },

    closeContextMenu() {
        this.contextMenu.open = false;
        this.contextMenu.id = null;
        renderJEI();
    },

    // ---- recipe/usage detail view ----

    // Opens the detail view for `id`. If a detail view is already open
    // (e.g. the player tapped an ingredient/result icon inside a recipe
    // card), the view being left is pushed onto the history stack first,
    // so Back can return to it instead of closing straight out to the
    // main item grid. `fromContextMenu`/a fresh open from the grid starts
    // a brand new stack.
    openRecipesFor(id, subTab) {
        this.contextMenu.open = false;
        if (this.recipeView.open && this.recipeView.id) {
            this.recipeView.history.push({ id: this.recipeView.id, subTab: this.recipeView.subTab });
        } else {
            this.recipeView.history = [];
        }
        this.recipeView.open = true;
        this.recipeView.id = id;
        this.recipeView.subTab = subTab || 'recipe';
        renderJEI();
    },

    setRecipeViewTab(subTab) {
        this.recipeView.subTab = subTab;
        renderJEI();
    },

    // Back button: pops one step back through the drill-down history if
    // there is any, otherwise this is the first/only item in the view and
    // Back closes the detail view back out to the main item list.
    backRecipeView() {
        if (this.recipeView.history.length > 0) {
            const prev = this.recipeView.history.pop();
            this.recipeView.id = prev.id;
            this.recipeView.subTab = prev.subTab;
            renderJEI();
        } else {
            this.closeRecipeView();
        }
    },

    closeRecipeView() {
        this.recipeView.open = false;
        this.recipeView.id = null;
        this.recipeView.subTab = 'recipe';
        this.recipeView.history = [];
        renderJEI();
    }
};

// Does a CraftingRegistry recipe use the given item id as one of its
// ingredients? Handles all three recipe shapes (shapeless ingredient list,
// shaped patterns of item ids).
function recipeUsesIngredient(recipe, id) {
    if (recipe.type === 'shapeless') {
        return recipe.ingredients.some(ing => ing.id === id);
    }
    return (recipe.pattern || []).includes(id);
}

function jeiSlotHTML(entry) {
    // Previously this drew the icon by hand (itemIconStyle + label only),
    // completely bypassing itemIconHTML's fluid-container handling in
    // inventory.js. That logic is exactly what paints the colored liquid
    // overlay on top of a capsule's shell (and falls back to the
    // Registry's `prefilled` marker for bare {id}-only entries like these,
    // since JEI entries never went through Inventory.addItem) - skipping
    // it meant every capsule in the JEI list rendered as the same bare
    // shell. Reuse itemIconHTML here, same as jeiRecipeGridHTML already
    // does for recipe-grid icons, so the main list matches.
    return `<div class="jei-slot" data-id="${entry.id}" title="${entry.name}">
        ${itemIconHTML({ id: entry.id, count: 1 })}
        <div class="jei-slot-name">${entry.name}</div>
    </div>`;
}

// A tiny read-only crafting grid for a single recipe, e.g. a 3x3 grid with
// stone around the border. Reuses the same .craft-slot/.item-icon classes
// as the real crafting UI so it looks identical, just not interactive.
function jeiRecipeGridHTML(recipe) {
    if (recipe.type === 'shapeless' || recipe.source === 'fluid') {
        // No fixed layout - just list each ingredient as its own slot,
        // stacked in a row, since position doesn't matter for shapeless.
        // Width the grid to exactly how many ingredients there are (up to
        // 2 per row) instead of always reserving a fixed 3-wide box, so a
        // single-ingredient recipe sits right next to the arrow instead of
        // leaving a big empty gap.
        const cols = Math.max(1, Math.min(2, recipe.ingredients.length));
        const slots = recipe.ingredients.map(ing => {
            // itemIconHTML() only paints the icon itself - it never draws
            // a count badge (see buildSlotHTML in inventory.js, which is
            // the only other caller and always renders its own separate
            // .item-count div next to the icon). Shapeless ingredients can
            // require more than 1 of an item (e.g. 4 capsules), and that
            // was silently dropped here - every ingredient always looked
            // like "just 1" regardless of what the recipe actually needed.
            const countHTML = ing.count > 1 ? `<div class="item-count">${ing.count}</div>` : '';
            return `<div class="jei-recipe-cell" data-id="${ing.id}">
                ${itemIconHTML({ id: ing.id, count: ing.count })}
                ${countHTML}
            </div>`;
        }).join('');
        return `<div class="jei-recipe-grid jei-recipe-shapeless" style="grid-template-columns: repeat(${cols}, 34px); max-width: ${cols * 34 + (cols - 1) * 3}px;">${slots}</div>`;
    }

    const size = recipe.type === 'shaped3x3' ? 3 : 2;
    const width = recipe.width || size;
    const pattern = recipe.pattern || [];
    const height = Math.ceil(pattern.length / width);

    let cells = '';
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let item = null;
            let cellId = '';
            if (x < width && y < height) {
                const id = pattern[y * width + x];
                if (id) { item = { id, count: 1 }; cellId = id; }
            }
            cells += `<div class="jei-recipe-cell" data-id="${cellId}">${itemIconHTML(item)}</div>`;
        }
    }
    const sizeClass = size === 3 ? 'jei-recipe-grid-3x3' : 'jei-recipe-grid-2x2';
    return `<div class="jei-recipe-grid ${sizeClass}">${cells}</div>`;
}

// A read-only version of a GUI block's own slot layout (e.g. the Mixer's
// Input 1 / Input 2 / Output), for recipes that come from
// GuiBlockRecipeRegistry rather than the player's crafting grid.
function jeiGuiRecipeGridHTML(recipe) {
    const cells = Object.keys(recipe.ingredients).map(slotId => {
        const ing = recipe.ingredients[slotId];
        // Same fix as the shapeless grid above - GUI-block recipes (Mixer,
        // Extractor, etc.) can also require more than 1 of an ingredient
        // per craft, and itemIconHTML alone never shows that count.
        const countHTML = ing.count > 1 ? `<div class="item-count">${ing.count}</div>` : '';
        return `<div class="jei-recipe-cell" data-id="${ing.id}" title="${slotId}">
            ${itemIconHTML({ id: ing.id, count: ing.count })}
            ${countHTML}
        </div>`;
    }).join('');
    const cols = Math.max(1, Math.min(2, Object.keys(recipe.ingredients).length));
    return `<div class="jei-recipe-grid jei-recipe-shapeless" style="grid-template-columns: repeat(${cols}, 34px); max-width: ${cols * 34 + (cols - 1) * 3}px;">${cells}</div>`;
}

function jeiRecipeTypeLabel(recipe) {
    if (recipe.source === 'gathering') {
        return `${recipe.method} — hold Alt and use Break on exposed dirt`;
    }
    if (recipe.source === 'gui') {
        const stationData = Registry.get(recipe.block);
        const stationName = stationData ? stationData.name : recipe.block;
        return `${stationName} \u2014 auto-process (${recipe.ticks} ticks)`;
    }
    if (recipe.source === 'fluid') {
        const stationData = Registry.get(recipe.block);
        const stationName = stationData ? stationData.name : recipe.block;
        return `${stationName} — ${recipe.fluidAmount} mB ${recipe.fluid} (${recipe.ticks} ticks)`;
    }
    if (recipe.type === 'shapeless') return 'Shapeless (any position)';
    if (recipe.type === 'shaped3x3') return 'Shaped \u2014 Workbench (3x3)';
    return 'Shaped \u2014 2x2';
}

function jeiRecipeCardHTML(recipe) {
    const resultCount = recipe.result.count > 1 ? `<div class="item-count">${recipe.result.count}</div>` : '';
    const gridHTML = recipe.source === 'gui' ? jeiGuiRecipeGridHTML(recipe) : jeiRecipeGridHTML(recipe);
    return `<div class="jei-recipe-card" data-recipe-source="${recipe.source}">
        ${gridHTML}
        <div class="jei-recipe-arrow">→</div>
        <div class="jei-recipe-output">
            <div class="craft-result-slot has-result" data-id="${recipe.result.id}">
                ${itemIconHTML({ id: recipe.result.id, count: recipe.result.count })}
                ${resultCount}
            </div>
        </div>
    </div>
    <div class="jei-recipe-type">${jeiRecipeTypeLabel(recipe)}</div>`;
}

function renderJEI() {
    const overlay = document.getElementById('jei-overlay');
    if (!overlay) return;

    if (!JEI.isOpen) {
        overlay.classList.remove('visible');
        return;
    }
    overlay.classList.add('visible');

    const grid = document.getElementById('jei-grid');
    if (grid) {
        const entries = JEI.filteredEntries();
        grid.innerHTML = entries.length === 0
            ? `<div class="jei-empty">No items found</div>`
            : entries.map(jeiSlotHTML).join('');
    }

    const hintEl = document.getElementById('jei-hint');
    if (hintEl) {
        hintEl.textContent = (typeof TEST_MODE !== 'undefined' && TEST_MODE)
            ? 'Tap: add stack • Hold: more options'
            : 'Tap: view recipes • Hold: more options';
    }

    renderJEIContextMenu();
    renderJEIRecipeView();
}

function renderJEIContextMenu() {
    const menuEl = document.getElementById('jei-context-menu');
    if (!menuEl) return;

    if (!JEI.contextMenu.open || !JEI.contextMenu.id) {
        menuEl.classList.remove('visible');
        menuEl.innerHTML = '';
        return;
    }

    const data = Registry.get(JEI.contextMenu.id);
    const name = data ? data.name : JEI.contextMenu.id;

    // TEST_MODE unlocks "Give Item" as a debug shortcut. With it off,
    // players can only look recipes up - no spawning items out of thin
    // air in what's meant to be a normal playthrough.
    const giveBtn = (typeof TEST_MODE !== 'undefined' && TEST_MODE)
        ? `<button class="jei-context-btn" data-action="give">Give Item</button>`
        : '';

    menuEl.innerHTML = `<div class="jei-context-box">
        <div class="jei-context-title">${name}</div>
        ${giveBtn}
        <button class="jei-context-btn" data-action="recipes">View Recipes</button>
        <button class="jei-context-btn" data-action="usages">Usage</button>
        <button class="jei-context-btn jei-context-cancel" data-action="cancel">Cancel</button>
    </div>`;
    menuEl.classList.add('visible');
}

function renderJEIRecipeView() {
    const viewEl = document.getElementById('jei-recipe-view');
    if (!viewEl) return;

    if (!JEI.recipeView.open || !JEI.recipeView.id) {
        viewEl.classList.remove('visible');
        viewEl.innerHTML = '';
        return;
    }

    const data = Registry.get(JEI.recipeView.id);
    const name = data ? data.name : JEI.recipeView.id;
    // "Produce" only makes sense for items that are themselves a craft
    // station (blocks with a `gui` entry, e.g. Workbench/Mixer) - it's
    // where the old main-menu station tabs + Produces/Used-in toggle moved
    // to, scoped to just that one station instead of cluttering the item
    // list. Fall back off the tab entirely for non-station items, even if
    // it was somehow left active from a previous item.
    const isStation = !!(data && data.gui);
    let subTab = JEI.recipeView.subTab;
    if (subTab === 'produce' && !isStation) subTab = 'recipe';

    let body;
    let emptyMsg;
    if (subTab === 'produce') {
        // Produce only shows what the station can make. What consumes the
        // station block itself belongs on that station item's own Usage
        // tab (usagesFor), not duplicated in here.
        const produces = JEI.stationEntries(JEI.recipeView.id);
        const producesHTML = produces.length === 0
            ? `<div class="jei-empty">This station can\u2019t make anything yet</div>`
            : `<div class="jei-produce-grid">${produces.map(jeiSlotHTML).join('')}</div>`;
        body = `<div class="jei-produce-section">
                <div class="jei-produce-heading">Produces</div>
                ${producesHTML}
            </div>`;
    } else {
        const recipes = subTab === 'usage' ? JEI.usagesFor(JEI.recipeView.id) : JEI.recipesFor(JEI.recipeView.id);
        emptyMsg = subTab === 'usage' ? 'This item isn\u2019t used in any known recipe' : 'No known recipes craft this item';
        body = recipes.length === 0
            ? `<div class="jei-empty">${emptyMsg}</div>`
            : recipes.map(r => jeiRecipeCardHTML(r)).join('');
    }

    const produceTabHTML = isStation
        ? `<button class="jei-recipe-subtab${subTab === 'produce' ? ' active' : ''}" data-subtab="produce">Produce</button>`
        : '';

    viewEl.innerHTML = `<div class="jei-recipe-header">
            <button id="jei-recipe-back" class="jei-context-btn jei-recipe-back-btn">← Back</button>
            <span class="jei-recipe-header-item">
                <span class="item-icon jei-recipe-header-icon" style="${itemIconStyle(data)}">${(data && data.icon && !isImagePath(data.icon)) ? data.icon : ''}</span>
                ${name}
            </span>
        </div>
        <div class="jei-recipe-subtabs">
            <button class="jei-recipe-subtab${subTab === 'recipe' ? ' active' : ''}" data-subtab="recipe">Recipe</button>
            <button class="jei-recipe-subtab${subTab === 'usage' ? ' active' : ''}" data-subtab="usage">Usage</button>
            ${produceTabHTML}
        </div>
        <div class="jei-recipe-list">${body}</div>`;
    viewEl.classList.add('visible');
}

function setupJEIControls() {
    const toggleBtn = document.getElementById('jei-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => JEI.toggleOverlay());
    }

    const closeBtn = document.getElementById('jei-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => JEI.closeOverlay());
    }

    const overlayEl = document.getElementById('jei-overlay');
    if (overlayEl) {
        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) JEI.closeOverlay();
        });
    }

    const searchEl = document.getElementById('jei-search');
    if (searchEl) {
        searchEl.addEventListener('input', (e) => {
            JEI.query = e.target.value;
            renderJEI();
        });
    }

    // Tap behavior depends on TEST_MODE:
    //   - TEST_MODE on:  tap gives a full stack (quick spawn for testing).
    //   - TEST_MODE off: tap opens "View Recipes" directly, since giving
    //                    items for free isn't something a normal
    //                    playthrough should allow.
    // Press & hold always opens the Give Item / View Recipes / Where It's
    // Used context menu, exactly like real JEI's right-click/long-press menu.
    const grid = document.getElementById('jei-grid');
    if (grid) {
        const HOLD_MS = 450;
        let holdTimer = null;
        let holdFired = false;
        let currentId = null;

        const clearHold = () => {
            if (holdTimer) clearTimeout(holdTimer);
            holdTimer = null;
            currentId = null;
        };

        grid.addEventListener('pointerdown', (e) => {
            const slotEl = e.target.closest('.jei-slot');
            if (!slotEl) return;
            holdFired = false;
            currentId = slotEl.dataset.id;
            holdTimer = setTimeout(() => {
                holdFired = true;
                holdTimer = null;
                JEI.openContextMenu(currentId);
                if (navigator.vibrate) navigator.vibrate(10);
            }, HOLD_MS);
        });

        ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
            grid.addEventListener(evt, clearHold);
        });

        grid.addEventListener('click', (e) => {
            const slotEl = e.target.closest('.jei-slot');
            if (!slotEl) return;
            if (holdFired) {
                // the long-press already opened the context menu; ignore
                // the trailing click so it doesn't also fire a tap action
                holdFired = false;
                return;
            }
            const id = slotEl.dataset.id;
            if (typeof TEST_MODE !== 'undefined' && TEST_MODE) {
                JEI.give(id);
            } else {
                JEI.openRecipesFor(id, 'recipe');
            }
        });
    }

    // Context menu buttons (Give Item / View Recipes / Where It's Used / Cancel).
    const contextMenuEl = document.getElementById('jei-context-menu');
    if (contextMenuEl) {
        contextMenuEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.jei-context-btn');
            if (btn) {
                const action = btn.dataset.action;
                const id = JEI.contextMenu.id;
                if (action === 'give') {
                    JEI.give(id);
                    JEI.closeContextMenu();
                } else if (action === 'recipes') {
                    JEI.openRecipesFor(id, 'recipe');
                } else if (action === 'usages') {
                    JEI.openRecipesFor(id, 'usage');
                } else {
                    JEI.closeContextMenu();
                }
                return;
            }
            if (e.target === contextMenuEl) JEI.closeContextMenu();
        });
    }

    // Recipe view: "Back" button, Recipe/Usage sub-tabs, and tapping any
    // ingredient/output icon inside a recipe card to jump straight to
    // THAT item's detail view (so you can click through a crafting chain).
    const recipeViewEl = document.getElementById('jei-recipe-view');
    if (recipeViewEl) {
        recipeViewEl.addEventListener('click', (e) => {
            if (e.target.closest('#jei-recipe-back')) {
                JEI.backRecipeView();
                return;
            }
            const subtabBtn = e.target.closest('.jei-recipe-subtab');
            if (subtabBtn) {
                JEI.setRecipeViewTab(subtabBtn.dataset.subtab);
                return;
            }
            const cellEl = e.target.closest('.jei-recipe-cell[data-id], .craft-result-slot[data-id]');
            if (cellEl && cellEl.dataset.id) {
                JEI.openRecipesFor(cellEl.dataset.id, 'recipe');
                return;
            }
            // Items shown on the "Produce" sub-tab (a station's own
            // jei-produce-grid) reuse the same .jei-slot markup as the
            // main item list, but that grid lives inside this recipe-view
            // panel rather than #jei-grid, so it had no click handler at
            // all - tapping a produced item did nothing. Tapping one here
            // should show ITS recipe (which station/ingredients make it),
            // same as tapping it from the main list would.
            const produceSlotEl = e.target.closest('.jei-slot[data-id]');
            if (produceSlotEl && produceSlotEl.dataset.id) {
                JEI.openRecipesFor(produceSlotEl.dataset.id, 'recipe');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'j' || e.key === 'J') {
            e.preventDefault();
            JEI.toggleOverlay();
        }
        if (e.key === 'Escape' && JEI.isOpen) {
            if (JEI.contextMenu.open) {
                JEI.closeContextMenu();
            } else if (JEI.recipeView.open) {
                JEI.backRecipeView();
            } else {
                JEI.closeOverlay();
            }
        }
    });
}

setupJEIControls();
