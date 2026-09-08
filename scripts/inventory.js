// ============================================
// Inventory System
// ============================================
// 9 hotbar slots (indices 0-8) + 27 inventory slots (indices 9-35)
// Each slot: null | { id: string, count: number }
//
// This file has three main parts, in order:
//   1. The Inventory object itself - all the actual state and logic
//      (adding items, click/drag handling, splitting stacks). This is the
//      part other files call into (Inventory.addItem, Inventory.dragging,
//      etc.) - basically everything outside this file that touches items
//      goes through here.
//   2. Rendering - turning Inventory.slots into the actual hotbar/overlay
//      HTML. itemIconHTML()/itemIconStyle() here are also reused by
//      crafting.js, guiBlocks.js, and jei.js for drawing any item icon
//      anywhere in the game, not just inventory slots.
//   3. Two extra small UI features bolted on top: the split-stack popup
//      (pick an exact split amount) and the hotbar hold-menu (split/drop
//      without opening the full inventory).
//
// Drag-and-drop model: there is no native HTML drag/drop here. Instead,
// "dragging" is just a piece of state (Inventory.dragging) that follows
// the cursor/finger visually (via #drag-item, moved manually on
// pointermove), and every slot click checks "is something currently being
// dragged?" to decide whether this click is a pickup, a drop, a merge, or
// a swap. See handleSlotClick() below for the actual decision tree.

const Inventory = {
    HOTBAR_SIZE: 9,
    MAIN_SIZE: 27,
    TOTAL_SIZE: 36,

    slots: Array(36).fill(null),
    selectedHotbarIndex: 0,

    // drag state
    dragging: null, // { fromIndex, item }
    isOpen: false,

    // split-popup state
    splitState: null, // { index, item }

    // Item currently "selected" for display purposes in the overlay (the
    // item under the cursor/finger, or last one picked up) - purely a UI
    // label, doesn't affect gameplay logic.
    displayedItemId: null,

    // ---- core stack helpers ----

    maxStackFor(id) {
        const data = Registry.get(id);
        return data && data.maxStack ? data.maxStack : 64;
    },

    // Add an item to inventory (used for block/item drops). Returns leftover count that didn't fit.
    //
    // Fluid-container aware (see fluids.js): a plain capsule id merges
    // into/creates EMPTY stacks only, exactly like before. A capsule
    // registered via registerFilledCapsule() (its Registry entry has a
    // `prefilled` field) instead only merges into/creates stacks that
    // already hold that same prefilled fluid+amount - see
    // Fluids.stacksMatch(), applied here the same way it's applied to
    // every other merge-by-id site in the game (handleSlotClick etc.) so
    // pre-filled capsules can't silently merge with unrelated empty ones.
    addItem(id, count) {
        if (!id || count <= 0) return count;
        const maxStack = this.maxStackFor(id);
        let remaining = count;
        const data = Registry.get(id);
        const prefilled = data && data.prefilled;
        const template = prefilled ? { id, fluid: prefilled.fluid, amount: prefilled.amount } : { id };

        // first try to fill existing stacks of same id (and matching fluid
        // contents, for a fluid container - see Fluids.stacksMatch)
        for (let i = 0; i < this.TOTAL_SIZE && remaining > 0; i++) {
            const slot = this.slots[i];
            if (!slot || slot.id !== id || slot.count >= maxStack) continue;
            if (typeof Fluids !== 'undefined' && Fluids.isContainer(slot) && !Fluids.stacksMatch(slot, template)) continue;
            const space = maxStack - slot.count;
            const add = Math.min(space, remaining);
            slot.count += add;
            remaining -= add;
        }

        // then place into empty slots
        for (let i = 0; i < this.TOTAL_SIZE && remaining > 0; i++) {
            if (!this.slots[i]) {
                const add = Math.min(maxStack, remaining);
                const newStack = { id, count: add };
                // Durable tools are always non-stackable.  Store remaining
                // uses on the stack, rather than mutating the Registry entry,
                // so two tools can wear independently.
                if (data && data.durability) newStack.durability = data.durability;
                if (prefilled) {
                    newStack.fluid = prefilled.fluid;
                    newStack.amount = prefilled.amount;
                }
                this.slots[i] = newStack;
                remaining -= add;
            }
        }

        this.onChange();
        return remaining;
    },

    getSelectedItem() {
        return this.slots[this.selectedHotbarIndex];
    },

    // Total count of a given item id across every slot (hotbar + main).
    // Used by the Quest Book to auto-verify "have item in inventory" tasks.
    countItem(id) {
        let total = 0;
        for (let i = 0; i < this.TOTAL_SIZE; i++) {
            const slot = this.slots[i];
            if (slot && slot.id === id) total += slot.count;
        }
        return total;
    },

    // Remove `count` of whatever is in the selected hotbar slot (used when placing a block)
    consumeSelected(count = 1) {
        const slot = this.slots[this.selectedHotbarIndex];
        if (!slot) return false;
        if (slot.count < count) return false;
        slot.count -= count;
        if (slot.count <= 0) this.slots[this.selectedHotbarIndex] = null;
        this.onChange();
        return true;
    },

    damageSelectedTool(amount = 1) {
        const slot = this.getSelectedItem();
        const data = slot && Registry.get(slot.id);
        if (!slot || !data || !data.durability) return false;
        if (slot.durability === undefined) slot.durability = data.durability;
        slot.durability -= amount;
        if (slot.durability <= 0) this.slots[this.selectedHotbarIndex] = null;
        this.onChange();
        return true;
    },

    selectHotbar(index) {
        if (index < 0 || index >= this.HOTBAR_SIZE) return;
        this.selectedHotbarIndex = index;
        this.onChange();
    },

    // Remove exactly `count` from a specific slot (used by hotbar drop/split).
    // Returns the removed { id, count } or null if nothing could be removed.
    removeFromSlot(index, count) {
        const slot = this.slots[index];
        if (!slot || count <= 0) return null;
        const take = Math.min(count, slot.count);
        // Taking the WHOLE stack (the only case that ever applies to a
        // non-stackable item like a fluid capsule, since its count is
        // always 1): return the actual stack object instead of rebuilding
        // {id, count} by hand, so extra fields like fluid/amount
        // (fluids.js) aren't silently dropped.
        if (take >= slot.count) {
            this.slots[index] = null;
            this.onChange();
            return slot;
        }
        slot.count -= take;
        const removed = { id: slot.id, count: take };
        this.onChange();
        return removed;
    },

    // ---- drag & drop / click logic ----

    // Left click on a slot: pick up whole stack, or place it, or merge/swap.
    // This is the core of the drag-and-drop model described in the file
    // header above - every click just asks "is `this.dragging` set?" and
    // branches from there:
    //   - nothing dragging + clicked a slot with an item  -> pick it up
    //   - dragging + clicked an empty slot                -> drop it there
    //   - dragging + clicked a slot with the SAME item id -> merge stacks
    //     (as much as fits; if there's leftover, keep dragging the rest)
    //   - dragging + clicked a slot with a DIFFERENT item -> swap them
    handleSlotClick(index, event) {
        const clicked = this.slots[index];

        if (!this.dragging) {
            if (!clicked) return;
            // pick up
            this.dragging = { fromIndex: index, item: clicked };
            this.slots[index] = null;
            this.displayedItemId = clicked.id;
        } else {
            const dragItem = this.dragging.item;
            if (!clicked) {
                // drop into empty slot
                this.slots[index] = dragItem;
                this.dragging = null;
            } else if (clicked.id === dragItem.id && (typeof Fluids === 'undefined' || Fluids.stacksMatch(clicked, dragItem))) {
                // merge stacks — allow moving the FULL stack (up to maxStack, e.g. 64/64)
                // Fluids.stacksMatch guards this for fluid containers (see
                // fluids.js): same id alone isn't enough for a capsule, its
                // fluid+amount must match too, or this falls through to the
                // swap branch below instead of merging mismatched contents.
                const maxStack = this.maxStackFor(clicked.id);
                const space = Math.max(0, maxStack - clicked.count);
                if (space > 0) {
                    const move = Math.min(space, dragItem.count);
                    clicked.count += move;
                    dragItem.count -= move;
                    if (dragItem.count <= 0) {
                        this.dragging = null;
                    }
                    // if leftover remains, keep dragging leftover
                } else {
                    // full stack already, swap
                    this.slots[index] = dragItem;
                    this.dragging = { fromIndex: index, item: clicked };
                }
            } else {
                // Different item types - check if we can merge dragged item elsewhere first
                // to prevent losing items when swapping with a full inventory
                const swapTarget = this.dragging.fromIndex;
                
                // If original slot is now empty or was the same slot, allow swap
                // Otherwise, try to find space for the swapped-out item
                if (swapTarget !== null && this.slots[swapTarget] === null) {
                    // Original slot is empty, put clicked item there
                    this.slots[swapTarget] = clicked;
                    this.slots[index] = dragItem;
                    this.dragging = null;
                } else {
                    // Swap normally - the clicked item goes back to drag state
                    this.slots[index] = dragItem;
                    this.dragging = { fromIndex: index, item: clicked };
                }
            }
        }
        this.onChange();
    },

    // Right click: open the split popup (choose exact amount) or place
    // one item at a time while dragging. Same "is something dragging?"
    // branching idea as handleSlotClick above, but this is the "one at a
    // time" / "let me pick an exact split" version:
    //   - nothing dragging + stack of 1-2 -> no meaningful choice to make,
    //     just split it 50/50 directly (see the count < 3 shortcut below)
    //   - nothing dragging + stack of 3+  -> open the slider popup so the
    //     player can choose exactly how many to take (openSplitPopup)
    //   - dragging + clicked empty slot   -> place ONE item there
    //   - dragging + clicked same item    -> add ONE item to that stack
    //   - dragging + clicked different, non-empty stack -> do nothing
    //     (there's no sensible "swap one item" behavior)
    handleSlotRightClick(index) {
        const clicked = this.slots[index];

        if (!this.dragging) {
            if (!clicked) return;
            if (clicked.count <= 1) {
                // Nothing to split - a single-item stack (this is also the
                // ONLY case a non-stackable item like a fluid capsule ever
                // hits, since its count is always 1). Pick up the stack
                // object AS-IS instead of rebuilding {id, count} by hand,
                // so extra fields like a capsule's fluid/amount (see
                // fluids.js) travel with it instead of being silently
                // dropped.
                this.dragging = { fromIndex: index, item: clicked };
                this.slots[index] = null;
                this.onChange();
                return;
            }
            if (clicked.count < 3) {
                // Only one meaningful split (1/1) is possible - skip the popup and do it directly.
                // Uses Fluids.cloneStack (fluids.js) instead of a bare
                // {id, count} so a split stack of capsules keeps its
                // fluid/amount fields on BOTH halves - every capsule in one
                // stack already holds identical contents (see
                // Fluids.stacksMatch, which is what keeps stacks that way),
                // so copying fluid/amount onto both halves is always correct.
                const half = Math.ceil(clicked.count / 2);
                const remain = clicked.count - half;
                const cloneStack = (typeof Fluids !== 'undefined') ? Fluids.cloneStack.bind(Fluids) : (s, c) => ({ id: s.id, count: c });
                this.dragging = { fromIndex: index, item: cloneStack(clicked, half) };
                this.slots[index] = remain > 0 ? cloneStack(clicked, remain) : null;
                this.onChange();
                return;
            }
            // Let the player pick exactly how many items to take out of the stack
            if (typeof openSplitPopup === 'function') openSplitPopup(index);
            return;
        } else {
            const dragItem = this.dragging.item;
            const cloneStack = (typeof Fluids !== 'undefined') ? Fluids.cloneStack.bind(Fluids) : (s, c) => ({ id: s.id, count: c });
            if (!clicked) {
                this.slots[index] = cloneStack(dragItem, 1);
                dragItem.count -= 1;
                if (dragItem.count <= 0) this.dragging = null;
            } else if (clicked.id === dragItem.id && (typeof Fluids === 'undefined' || Fluids.stacksMatch(clicked, dragItem))) {
                const maxStack = this.maxStackFor(clicked.id);
                if (clicked.count < maxStack) {
                    clicked.count += 1;
                    dragItem.count -= 1;
                    if (dragItem.count <= 0) this.dragging = null;
                }
            }
            // if right-clicking a different, non-empty stack -> do nothing
        }
        this.onChange();
    },

    // Cancel current drag (e.g. closing the inventory/workbench overlay
    // while still holding an item): always return it to the first
    // available slot rather than specifically its origin slot. Applies
    // uniformly whether the item was picked up from a normal inventory
    // slot or from a crafting grid cell.
    cancelDrag() {
        if (!this.dragging) return;
        const { item, fromIndex } = this.dragging;

        const leftover = this.addItem(item.id, item.count);
        // If truly no space left anywhere, drop the leftover on the ground
        // at player position instead of silently destroying it. This prevents
        // item loss when closing inventory with full slots.
        if (leftover > 0 && typeof addItemOrDrop === 'function') {
            // Find player position from game.js scope
            const px = (typeof playerX !== 'undefined') ? playerX : 0;
            const py = (typeof playerY !== 'undefined') ? playerY : 0;
            addItemOrDrop(px, py, item.id, leftover);
        }

        this.dragging = null;
        this.onChange();
    },

    // Complete a custom split started via openSplitPopup(): pull `takeCount` items
    // out of the stack that was open in the popup and pick them up as the dragged item.
    //
    // Works for either a plain inventory slot (numeric index into
    // this.slots) or a GUI-block custom slot (splitState.guiBlockSlot set,
    // index is that block's slotId, backed by GuiBlocks.getSlots' own
    // object instead of this.slots) - see openSplitPopup below for where
    // that distinction gets recorded.
    confirmSplit(takeCount) {
        if (!this.splitState) return;
        const { index, item, guiBlockSlot } = this.splitState;
        const take = Math.max(1, Math.min(takeCount, item.count - 1));
        const leave = item.count - take;
        // cloneStack (fluids.js) instead of a bare {id, count} - see the
        // matching note on the count<3 shortcut above; every capsule in
        // this stack already holds identical fluid/amount, so both halves
        // of the split should too.
        const cloneStack = (typeof Fluids !== 'undefined') ? Fluids.cloneStack.bind(Fluids) : (s, c) => ({ id: s.id, count: c });
        this.dragging = { fromIndex: guiBlockSlot ? null : index, item: cloneStack(item, take) };
        const remainder = leave > 0 ? cloneStack(item, leave) : null;
        if (guiBlockSlot && typeof GuiBlocks !== 'undefined' && GuiBlocks.open) {
            const slots = GuiBlocks.getSlots(GuiBlocks.open.x, GuiBlocks.open.y, GuiBlocks.open.guiDef);
            slots[index] = remainder;
        } else {
            this.slots[index] = remainder;
        }
        this.splitState = null;
        this.onChange();
        if (typeof renderGuiBlockOverlay === 'function') renderGuiBlockOverlay();
    },

    cancelSplit() {
        this.splitState = null;
    },

    // Called after essentially every state-changing action (add/remove
    // item, click a slot, split a stack...) to keep every dependent UI
    // piece in sync. If you add a new UI surface that displays inventory
    // contents, wire its re-render call in here too - this is the single
    // "something changed, everybody update" hook for the whole item system.
    onChange() {
        renderInventory();
        // Keep the crafting grids (result slot in particular) in sync
        // whenever inventory contents change.
        if (typeof renderCraftUI === 'function') renderCraftUI();
        if (typeof renderWorkbenchOverlay === 'function' && typeof Crafting !== 'undefined' && Crafting.workbenchOpen) {
            renderWorkbenchOverlay();
        }
        if (typeof renderHotbarMenu === 'function') renderHotbarMenu();
        // Note: Quest Book "item" tasks are no longer auto-checked on every
        // inventory change - the player presses the quest's own "Check"
        // button (see QuestBook.checkAutoTasks() in quests.js) to verify
        // them on demand instead.
    },

    toggleOverlay() {
        this.isOpen = !this.isOpen;
        if (this.isOpen && typeof GuiBlocks !== 'undefined') GuiBlocks.close();
        if (!this.isOpen) {
            this.cancelDrag();
            if (typeof closeSplitPopup === 'function') closeSplitPopup();
            if (typeof Crafting !== 'undefined') Crafting.clearGrid(2);
        }
        renderInventory();
        if (typeof renderCraftUI === 'function') renderCraftUI();
    },

    openOverlay() {
        this.isOpen = true;
        renderInventory();
        if (typeof renderCraftUI === 'function') renderCraftUI();
    },

    closeOverlay() {
        this.isOpen = false;
        this.cancelDrag();
        if (typeof closeSplitPopup === 'function') closeSplitPopup();
        if (typeof Crafting !== 'undefined') Crafting.clearGrid(2);
        renderInventory();
        if (typeof renderCraftUI === 'function') renderCraftUI();
    }
};

// ============================================
// Rendering
// ============================================

// ============================================
// Rendering
// ============================================
// Everything below turns Inventory.slots (plain data) into HTML. The key
// idea: no block/item ever gets its own hand-written CSS/HTML - instead
// itemIconStyle()/itemIconHTML() read whatever Registry.get(id) returns
// (color/texture/icon) and generate a generic-but-correct icon from that.
// This is also why adding a new item to registry.js "just works" visually
// everywhere (hotbar, inventory grid, crafting slots, JEI, quest previews)
// without touching any rendering code.

// Builds the inline style + inner HTML for one item/block icon, using
// only Registry data (color / texture / icon glyph) - no per-id CSS rules
// needed anywhere blocks/items are shown (hotbar, inventory, crafting
// grids, JEI, quest recipe previews, etc).
// Some entries only have an image path in `icon` (e.g. the pebble items,
// which have no separate `texture` field) rather than in `texture`. Emoji/
// text glyphs (like '🔨') aren't image paths, so only treat `icon` as an
// image when it actually looks like one - same rule game.js uses for
// world-tile rendering.
const IMAGE_PATH_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
function isImagePath(str) {
    return typeof str === 'string' && IMAGE_PATH_RE.test(str);
}

// isTransparentColor() lives in registry.js (registry.js loads first and
// it's registry-data logic, not inventory-specific) - reused here as-is.

function itemIconStyle(data) {
    const color = (data && data.color) || '#888';
    // Prefer `texture`; fall back to `icon` when `icon` is itself an image
    // path rather than a text/emoji glyph.
    const imagePath = (data && data.texture)
        ? data.texture
        : (data && isImagePath(data.icon) ? data.icon : null);
    // Only apply the image as a CSS background-image once TextureCheck
    // has confirmed the PNG actually loads. If we set url(...) for a file
    // that 404s, the browser renders that layer as blank/black *over* the
    // background-color instead of letting the color fallback show - so an
    // unverified texture path looks worse than no texture at all.
    if (imagePath && TextureCheck.check(imagePath)) {
        return `background-color:${color};background-image:url('${imagePath}');background-size:cover;background-position:center;`;
    }
    return `background:${color};`;
}

function itemIconHTML(item) {
    if (!item) return '';
    const data = Registry.get(item.id);
    // Only show `icon` as a text label when it's a glyph, not an image
    // path (image paths are rendered via itemIconStyle's background-image
    // instead - showing the raw path as text was the "big text instead of
    // texture" bug).
    const label = (data && data.icon && !isImagePath(data.icon)) ? data.icon : '';
    const solidClass = isTransparentColor(data && data.color) ? '' : ' has-solid-bg';
    // Fluid containers (capsules/cells - see fluids.js) draw the capsule
    // SHELL (data.icon, e.g. assets/capsules/capsule_shell.png - already
    // applied as this icon's background by itemIconStyle above) with a
    // bottom-anchored LIQUID FILL layered on top, clipped to the capsule's
    // actual interior outline and sized to the current fill %.
    //
    // This used to be done with a `mask-image: url(capsule_fill.png)` -
    // reusing the fill art's own alpha shape so the liquid only ever
    // painted inside the capsule's interior. That approach silently never
    // worked: browsers refuse to use a locally-loaded PNG (file:// - which
    // is how this game's index.html is normally opened, with no server)
    // as a CSS mask image, so `mask-image` there was a no-op and the
    // "liquid" layer never rendered *at all*, at any fill level.
    // `background-image`/`background-color` don't have this restriction,
    // which is why the shell art itself (drawn as an ordinary
    // background-image in itemIconStyle) always displayed fine - only the
    // mask-based overlay was broken.
    //
    // Fixed by describing the capsule's interior as a plain CSS
    // `clip-path: inset(...)` rectangle instead of a raster mask -
    // CAPSULE_FILL_INSET below is measured directly off the source art
    // (capsule_fill.png's non-transparent pixels sit at x:7-9/y:3-13 of
    // its 16x16 canvas - see the top/right/bottom/left inset percentages
    // computed from that box) so the liquid lines up with the shell's
    // actual drawn interior. clip-path has no such file:// restriction and
    // needs no image loaded at all, so this also can't silently fail the
    // way the mask did.
    let fluidHTML = '';
    // Capsules use a narrow vertical-vial artwork on a 16x16 canvas (most
    // of the canvas is transparent padding). itemIconStyle() below applies
    // `background-size: cover`, which is meant for photo-style textures
    // that fill their whole canvas - on a mostly-empty canvas like this
    // one it just centers the tiny vial with no size correction, so next
    // to a full-bleed block texture (e.g. Cobblestone) the capsule reads
    // as "barely there". The isContainer class switches that one icon to
    // `background-size: contain` and enlarges it (see .item-icon.is-fluid-
    // container in style.css) so the shell art actually fills the visible
    // icon box instead of floating small in the middle of it.
    const isContainerClass = (typeof Fluids !== 'undefined' && Fluids.isContainer(item)) ? ' is-fluid-container' : '';
    if (typeof Fluids !== 'undefined' && Fluids.isContainer(item)) {
        const capacity = Fluids.capacityOf(item.id);
        // A JEI/registry-list preview icon is a bare `{id}` stack (see
        // JEI.allEntries() in jei.js) - it never went through
        // Inventory.addItem, so it has no `fluid`/`amount` fields of its
        // own even for a registerFilledCapsule() item. That made every
        // capsule (empty AND pre-filled) render with the exact same bare
        // shell in the list - "все одинаковые пока не попадут в
        // инвентарь". Fall back to the Registry's `prefilled` marker
        // (stamped by registerFilledCapsule, see fluids.js) whenever the
        // stack itself doesn't carry fluid state yet, so the list preview
        // shows the correct liquid immediately.
        const prefilled = data && data.prefilled;
        const amount = (item.amount !== undefined && item.amount !== null) ? item.amount
            : (prefilled ? prefilled.amount : 0);
        const fluidId = (item.fluid !== undefined && item.fluid !== null) ? item.fluid
            : (prefilled ? prefilled.fluid : null);
        const pct = capacity > 0 ? Math.round((amount / capacity) * 100) : 0;
        const fluidData = fluidId ? FluidRegistry.get(fluidId) : null;
        const fluidColor = fluidData ? fluidData.color : '#888';
        if (fluidId && amount > 0) {
            fluidHTML = `<div class="item-fluid-fill item-fluid-fill-capsule" style="height:${pct}%;background-color:${fluidColor};"></div>`;
        }
    }
    return `<div class="item-icon${solidClass}${isContainerClass}" style="${itemIconStyle(data)}">${label}${fluidHTML}</div>`;
}

// One inventory/hotbar slot's outer HTML (icon + count badge + selection
// highlight). `extraClass` is 'hotbar' or 'main' - just styling hooks, no
// logic difference. Every grid (player inventory, workbench, GUI blocks)
// calls this the same way, keyed by the item's absolute slot index.
function buildSlotHTML(index, extraClass) {
    const item = Inventory.slots[index];
    const selected = (extraClass === 'hotbar' && index === Inventory.selectedHotbarIndex) ? ' selected-slot' : '';
    const countHTML = (item && item.count > 1) ? `<div class="item-count">${item.count}</div>` : '';
    return `<div class="inv-slot ${extraClass}${selected}" data-index="${index}">
        ${itemIconHTML(item)}
        ${countHTML}
    </div>`;
}

function renderHotbar() {
    const hotbarEl = document.getElementById('hotbar');
    if (!hotbarEl) return;
    let html = '';
    for (let i = 0; i < Inventory.HOTBAR_SIZE; i++) {
        html += buildSlotHTML(i, 'hotbar');
    }
    hotbarEl.innerHTML = html;
}

function renderInventoryOverlay() {
    const overlayEl = document.getElementById('inventory-overlay');
    if (!overlayEl) return;

    // #drag-item is `position: fixed` (see style.css), so it renders on
    // top of the ENTIRE screen, not just inside the overlay - it has to
    // stay in sync with Inventory.dragging regardless of whether the
    // overlay itself is open or closed. This used to live further down,
    // after the `!Inventory.isOpen` early return below, so closing the
    // overlay (e.g. tapping the ✕ close button, which calls
    // Inventory.closeOverlay() -> cancelDrag() -> Inventory.dragging =
    // null) never actually reached the code that hides #drag-item / clears
    // its innerHTML. The item you were holding stayed visually stuck to
    // the main screen even though Inventory.dragging was already null.
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

    if (!Inventory.isOpen) {
        overlayEl.classList.remove('visible');
        return;
    }
    overlayEl.classList.add('visible');

    const mainGrid = document.getElementById('inv-main-grid');
    const hotbarGrid = document.getElementById('inv-hotbar-grid');

    let mainHTML = '';
    for (let i = Inventory.HOTBAR_SIZE; i < Inventory.TOTAL_SIZE; i++) {
        mainHTML += buildSlotHTML(i, 'main');
    }
    if (mainGrid) mainGrid.innerHTML = mainHTML;

    let hbHTML = '';
    for (let i = 0; i < Inventory.HOTBAR_SIZE; i++) {
        hbHTML += buildSlotHTML(i, 'hotbar');
    }
    if (hotbarGrid) hotbarGrid.innerHTML = hbHTML;
}

// Display name for an item STACK, preferring actual current contents over
// the Registry's baked-in id name for fluid containers. A capsule's id
// (and therefore its Registry `name`, e.g. "Capsule of Sulfuric Acid
// (1000mB)" for a registerFilledCapsule() item) describes what it was
// CRAFTED/REGISTERED as, not what it currently holds - once a capsule's
// fluid changes (drained into a tank, refilled with something else, etc)
// the id doesn't change with it, so showing `data.name` verbatim could
// label a capsule now full of water as "Capsule of Sulfuric Acid". Using
// Fluids.describe() (fluids.js) for any container instead always reflects
// the stack's real `fluid`/`amount` fields, e.g. "1000 / 1000 mB Water".
function displayNameFor(item) {
    if (!item) return '';
    if (typeof Fluids !== 'undefined' && Fluids.isContainer(item)) {
        return Fluids.describe(item);
    }
    const data = Registry.get(item.id);
    return data ? data.name : '';
}

// Item currently held/selected in the hotbar, shown as a small label above
// it so the player can always see what they've got equipped.
function renderHotbarSelectedName() {
    const nameEl = document.getElementById('hotbar-selected-name');
    if (!nameEl) return;
    const item = Inventory.getSelectedItem();
    nameEl.textContent = displayNameFor(item);
    nameEl.classList.toggle('visible', !!item);
}

// Item currently being dragged around the inventory overlay (or the last
// one picked up) - shown as a label so players can tell what they're
// holding/what they just selected while crafting.
function renderInventorySelectedName() {
    const invNameEl = document.getElementById('inv-selected-name');
    const wbNameEl = document.getElementById('wb-selected-name');
    const item = Inventory.dragging ? Inventory.dragging.item
        : (Inventory.displayedItemId ? { id: Inventory.displayedItemId } : null);
    const text = displayNameFor(item);
    if (invNameEl) invNameEl.textContent = text;
    if (wbNameEl) wbNameEl.textContent = text;
}

// Redraws every inventory-related UI piece at once (hotbar, the overlay
// grid, and both "selected item name" labels). Called from
// Inventory.onChange() and a few other places whenever slots change.
function renderInventory() {
    renderHotbar();
    renderInventoryOverlay();
    renderHotbarSelectedName();
    renderInventorySelectedName();
}

// ============================================
// Split-stack popup
// ============================================
// Lets the player pick an exact amount to take out of a stack (e.g. split 10
// into 7/3) instead of always taking half.

// Opens the popup and pre-fills its slider to a 50/50 split as a starting
// point - the player then drags the slider to whatever exact split they
// want before confirming (see confirmSplit() above, wired up in
// setupSplitPopup() below).
//
// `index` is a plain inventory slot number by default. Pass
// `{ guiBlockSlot: true }` as `opts` when `index` is actually a GUI-block
// slotId (string) instead - see GuiBlocks.handleSlotRightClick, which is
// what opens the popup that way.
function openSplitPopup(index, opts) {
    opts = opts || {};
    const guiBlockSlot = !!opts.guiBlockSlot;
    const item = guiBlockSlot
        ? (typeof GuiBlocks !== 'undefined' && GuiBlocks.open
            ? GuiBlocks.getSlots(GuiBlocks.open.x, GuiBlocks.open.y, GuiBlocks.open.guiDef)[index]
            : null)
        : Inventory.slots[index];
    if (!item || item.count < 2) return;

    Inventory.splitState = { index, item, guiBlockSlot };

    const popup = document.getElementById('split-popup');
    const slider = document.getElementById('split-slider');
    if (!popup || !slider) return;

    slider.min = 1;
    slider.max = item.count - 1;
    slider.value = Math.floor(item.count / 2);

    const icon = itemIconHTML({ id: item.id, count: 1 });
    const takeIconEl = document.getElementById('split-take-icon');
    const leaveIconEl = document.getElementById('split-leave-icon');
    if (takeIconEl) takeIconEl.innerHTML = icon;
    if (leaveIconEl) leaveIconEl.innerHTML = icon;

    updateSplitPreview();
    popup.classList.add('visible');
}

function updateSplitPreview() {
    if (!Inventory.splitState) return;
    const slider = document.getElementById('split-slider');
    const takeEl = document.getElementById('split-take-count');
    const leaveEl = document.getElementById('split-leave-count');
    if (!slider) return;

    const take = parseInt(slider.value, 10);
    const leave = Inventory.splitState.item.count - take;
    if (takeEl) takeEl.textContent = take;
    if (leaveEl) leaveEl.textContent = leave;
}

function closeSplitPopup() {
    const popup = document.getElementById('split-popup');
    if (popup) popup.classList.remove('visible');
    Inventory.cancelSplit();
    HotbarMenu.splitIndex = null;
}

function setupSplitPopup() {
    const popup = document.getElementById('split-popup');
    const slider = document.getElementById('split-slider');
    const confirmBtn = document.getElementById('split-confirm');
    const cancelBtn = document.getElementById('split-cancel');
    if (!popup || !slider || !confirmBtn || !cancelBtn) return;

    slider.addEventListener('input', updateSplitPreview);

    confirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const take = parseInt(slider.value, 10);
        if (HotbarMenu.splitIndex !== null) {
            // Hotbar split: drop the chosen amount on the ground at the
            // player's feet instead of picking it up as a drag item.
            const index = HotbarMenu.splitIndex;
            const removed = Inventory.removeFromSlot(index, take);
            if (removed && typeof dropItemOnGround === 'function') {
                dropItemOnGround(playerX, playerY, removed.id, removed.count);
                if (typeof renderWorld === 'function') renderWorld();
            }
            HotbarMenu.splitIndex = null;
        } else {
            Inventory.confirmSplit(take);
        }
        popup.classList.remove('visible');
    });

    cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSplitPopup();
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) closeSplitPopup();
    });
}

// ============================================
// Hotbar hold menu (Split / Drop)
// ============================================
// Press & hold a hotbar slot on the main game screen (no need to open the
// full inventory) to split part of the stack onto the ground, or drop the
// whole stack. Mirrors the JEI long-press pattern.

const HotbarMenu = {
    open: false,
    index: null,
    splitIndex: null // set while the split-popup was opened from here
};

function openHotbarMenu(index) {
    const item = Inventory.slots[index];
    if (!item) return;
    HotbarMenu.open = true;
    HotbarMenu.index = index;
    renderHotbarMenu();
}

function closeHotbarMenu() {
    HotbarMenu.open = false;
    HotbarMenu.index = null;
    renderHotbarMenu();
}

function renderHotbarMenu() {
    const menuEl = document.getElementById('hotbar-context-menu');
    if (!menuEl) return;

    if (!HotbarMenu.open || HotbarMenu.index === null) {
        menuEl.classList.remove('visible');
        menuEl.innerHTML = '';
        return;
    }

    const item = Inventory.slots[HotbarMenu.index];
    if (!item) {
        menuEl.classList.remove('visible');
        menuEl.innerHTML = '';
        return;
    }

    const data = Registry.get(item.id);
    const name = data ? data.name : item.id;
    const splitBtn = item.count >= 2
        ? `<button class="jei-context-btn" data-action="split">Split</button>`
        : '';

    menuEl.innerHTML = `<div class="jei-context-box">
        <div class="jei-context-title">${name} (${item.count})</div>
        ${splitBtn}
        <button class="jei-context-btn" data-action="drop">Drop</button>
        <button class="jei-context-btn jei-context-cancel" data-action="cancel">Cancel</button>
    </div>`;
    menuEl.classList.add('visible');
}

function setupHotbarMenu() {
    const hotbarEl = document.getElementById('hotbar');
    const menuEl = document.getElementById('hotbar-context-menu');
    if (!hotbarEl || !menuEl) return;

    const HOLD_MS = 450;
    let holdTimer = null;
    let holdFired = false;
    let currentIndex = null;
    let startX = 0, startY = 0;

    const clearHold = () => {
        if (holdTimer) clearTimeout(holdTimer);
        holdTimer = null;
        currentIndex = null;
    };

    hotbarEl.addEventListener('pointerdown', (e) => {
        const slotEl = e.target.closest('.inv-slot');
        if (!slotEl) return;
        if (Inventory.isOpen) return; // overlay handles its own slots
        holdFired = false;
        currentIndex = parseInt(slotEl.dataset.index, 10);
        startX = e.clientX;
        startY = e.clientY;
        holdTimer = setTimeout(() => {
            holdFired = true;
            holdTimer = null;
            openHotbarMenu(currentIndex);
            if (navigator.vibrate) navigator.vibrate(10);
        }, HOLD_MS);
    });

    hotbarEl.addEventListener('pointermove', (e) => {
        if (!holdTimer) return;
        // a finger drifting too far means it's not a deliberate hold - cancel
        if (Math.abs(e.clientX - startX) > 12 || Math.abs(e.clientY - startY) > 12) {
            clearHold();
        }
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
        hotbarEl.addEventListener(evt, clearHold);
    });

    // Suppress the trailing click (slot selection) that follows a long-press
    hotbarEl.addEventListener('click', (e) => {
        if (holdFired) {
            holdFired = false;
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    menuEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.jei-context-btn');
        if (!btn) return;
        const action = btn.dataset.action;
        const index = HotbarMenu.index;

        if (action === 'drop') {
            const item = Inventory.slots[index];
            if (item) {
                const removed = Inventory.removeFromSlot(index, item.count);
                if (removed && typeof dropItemOnGround === 'function') {
                    dropItemOnGround(playerX, playerY, removed.id, removed.count);
                    if (typeof renderWorld === 'function') renderWorld();
                }
            }
            closeHotbarMenu();
        } else if (action === 'split') {
            closeHotbarMenu();
            HotbarMenu.splitIndex = index;
            if (typeof openSplitPopup === 'function') openSplitPopup(index);
        } else {
            closeHotbarMenu();
        }
    });

    menuEl.addEventListener('click', (e) => {
        if (e.target === menuEl) closeHotbarMenu();
    });
}

// ============================================
// Event wiring
// ============================================

// Generic press&hold -> split-stack gesture, usable on ANY overlay that
// has slots wanting the same behavior the player inventory overlay has
// (see the matching block below, which this was extracted from). This is
// what makes stack-splitting work identically in the player inventory,
// the Workbench, and any generic GUI block panel (Mixer, Tank, ...)
// instead of being wired up only once for the inventory overlay.
//
// `getSlotEl(e)` should return the slot element under the pointer/touch
// event (excluding anything that has its own separate click handling,
// e.g. crafting-grid cells), or null/undefined if the event isn't over a
// splittable slot at all.
// `onSplit(slotEl)` is called once the long-press fires (or a real
// desktop contextmenu event lands) - it should perform the actual split
// for whatever slot type this overlay uses (Inventory.handleSlotRightClick
// for a plain index, GuiBlocks.handleSlotRightClick for a slotId, etc).
//
// Returns a `wasLongPress()` getter so the caller's own 'click' handler
// can check it and skip the trailing click a long-press/split leaves
// behind (exactly like the inventory overlay's own click handler does).
function attachSlotSplitGesture(overlayEl, getSlotEl, onSplit) {
    const LONG_PRESS_MS = 450;
    const MOVE_CANCEL_PX = 12;
    let pressTimer = null;
    let pressStart = null;
    let longPressFired = false;

    const clearPressTimer = () => {
        if (pressTimer) clearTimeout(pressTimer);
        pressTimer = null;
        pressStart = null;
    };

    overlayEl.addEventListener('pointerdown', (e) => {
        const slotEl = getSlotEl(e);
        if (!slotEl) return;
        pressStart = { x: e.clientX, y: e.clientY };
        pressTimer = setTimeout(() => {
            longPressFired = true;
            pressTimer = null;
            onSplit(slotEl);
            if (navigator.vibrate) navigator.vibrate(15);
        }, LONG_PRESS_MS);
    });

    overlayEl.addEventListener('pointermove', (e) => {
        if (pressStart) {
            const dx = e.clientX - pressStart.x;
            const dy = e.clientY - pressStart.y;
            if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearPressTimer();
        }
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
        overlayEl.addEventListener(evt, clearPressTimer);
    });

    overlayEl.addEventListener('contextmenu', (e) => {
        const slotEl = getSlotEl(e);
        if (!slotEl) return;
        e.preventDefault();
        if (longPressFired) {
            // avoid double-splitting if a touch device fires both our timer and a native contextmenu
            longPressFired = false;
            return;
        }
        onSplit(slotEl);
    });

    return {
        // Called from the overlay's own 'click' handler: returns true (and
        // clears the flag) exactly once right after a long-press/split
        // fired, so that handler can ignore the trailing click instead of
        // also treating it as a pickup/place.
        consumeLongPress() {
            if (longPressFired) {
                longPressFired = false;
                return true;
            }
            return false;
        }
    };
}

// Wires up all input event listeners for the inventory system: hotbar
// clicks, slot click/long-press inside the overlay, and keyboard
// shortcuts (1-9 to select hotbar, I to toggle inventory, Escape to
// close). Called once from initInventory() at the bottom of this file.
function setupInventoryControls() {
    const toggleBtn = document.getElementById('inventory-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => Inventory.toggleOverlay());
    }

    const closeBtn = document.getElementById('inventory-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => Inventory.closeOverlay());
    }

    const overlayEl = document.getElementById('inventory-overlay');

    // Hotbar: click to select slot (when overlay closed) or drag-drop (when open)
    const hotbarEl = document.getElementById('hotbar');
    if (hotbarEl) {
        hotbarEl.addEventListener('click', (e) => {
            const slotEl = e.target.closest('.inv-slot');
            if (!slotEl) return;
            const index = parseInt(slotEl.dataset.index, 10);
            if (!Inventory.isOpen) {
                Inventory.selectHotbar(index);
            }
        });
    }

    // Slot interaction inside the overlay.
    // Short tap  -> pick up / place / merge / swap (handleSlotClick)
    // Press&hold -> split the stack in half (handleSlotRightClick) — this replaces
    // relying on the browser's contextmenu event, which doesn't fire reliably on
    // phones (iOS in particular won't fire it on plain divs), so split-stack used
    // to be effectively unusable on touch. Pointer events work for touch AND mouse,
    // and real right-click is still kept as a bonus shortcut for desktop.
    if (overlayEl) {
        // Snap/move the drag ghost to the finger/cursor immediately, instead of
        // waiting for the next pointermove (which left it frozen at the old spot on touch)
        overlayEl.addEventListener('pointerdown', (e) => {
            const dragEl = document.getElementById('drag-item');
            if (dragEl && Inventory.dragging) {
                dragEl.style.left = e.clientX + 'px';
                dragEl.style.top = e.clientY + 'px';
            }
        });
        overlayEl.addEventListener('pointermove', (e) => {
            const dragEl = document.getElementById('drag-item');
            if (dragEl && Inventory.dragging) {
                dragEl.style.left = e.clientX + 'px';
                dragEl.style.top = e.clientY + 'px';
            }
        });

        // Exclude craft-slot: it has its own click handler (setupCraftGridControls),
        // and its data-index values overlap with hotbar/main slot indices, so without
        // this exclusion a click on a crafting cell would ALSO fire handleSlotClick
        // on the coincidentally-matching regular slot (e.g. crafting cell 0 would also
        // pick up/swap whatever is in hotbar slot 0).
        const getSplittableSlotEl = (e) => e.target.closest('.inv-slot:not(.craft-slot)');

        const splitGesture = attachSlotSplitGesture(
            overlayEl,
            getSplittableSlotEl,
            (slotEl) => Inventory.handleSlotRightClick(parseInt(slotEl.dataset.index, 10))
        );

        overlayEl.addEventListener('click', (e) => {
            if (e.target === overlayEl) {
                Inventory.closeOverlay();
                return;
            }
            if (splitGesture.consumeLongPress()) {
                // the long-press already performed the split; ignore the click that follows it
                return;
            }
            const slotEl = getSplittableSlotEl(e);
            if (!slotEl) return;
            const index = parseInt(slotEl.dataset.index, 10);
            Inventory.handleSlotClick(index, e);
        });
    }

    document.addEventListener('keydown', (e) => {
        // number keys 1-9 select hotbar slot
        if (e.key >= '1' && e.key <= '9') {
            Inventory.selectHotbar(parseInt(e.key, 10) - 1);
        }
        if (e.key === 'i' || e.key === 'I') {
            e.preventDefault();
            Inventory.toggleOverlay();
        }
        if (e.key === 'Escape' && Inventory.isOpen) {
            if (Inventory.splitState) {
                closeSplitPopup();
            } else {
                Inventory.closeOverlay();
            }
        }
    });
}

// Entry point for this file - called once at the bottom, on load. Wires
// up all inventory-related input handlers, seeds starter items in
// TEST_MODE, and does the first render.
function initInventory() {
    setupInventoryControls();
    setupSplitPopup();
    setupHotbarMenu();

    // Starter items for testing block placement
    if (TEST_MODE) {
        Inventory.addItem('IR-dirt', 128);
        Inventory.addItem('IR-cobblestone', 16);
    } else {
        // Normal mode: give minimal starter items (just a few dirt blocks)
        Inventory.addItem('IR-dirt', 5);
    }

    renderInventory();

    // Re-render icons once any pending texture check resolves, so item
    // slots pick up their real PNG as soon as it's confirmed loaded (or
    // fall back to color if the file turns out to be missing). Also
    // covers JEI/crafting slots, which call itemIconStyle/itemIconHTML
    // through the same Registry data.
    TextureCheck.onChange(() => {
        renderInventory();
        if (typeof renderCraftUI === 'function') renderCraftUI();
        if (typeof renderGuiBlockOverlay === 'function') renderGuiBlockOverlay();
        if (typeof renderJEI === 'function') renderJEI();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // in case scripts load before DOM ready in some environments
});

initInventory();
