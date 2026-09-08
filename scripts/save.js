// ============================================
// save.js - full game save/load/reset
// ============================================
// Everything the player can lose by refreshing the page: the world
// (chunks - placed/broken blocks, the overlay layer, block facings,
// dropped ground items), the player's position, their inventory (hotbar +
// main slots) and whatever sits in the crafting grids, every placed GUI
// block's own slot contents (Mixer/Extractor/etc), fluid state (Tanks,
// fluid-input buffers), and quest progress. Quest progress already had its
// own tiny localStorage save (see QUEST_PROGRESS_KEY in quests.js) - this
// file adds one for everything else and ties both together under a single
// "Save" / "Reset World" pair of actions so the player only has to think
// about one save, not several independent ones.
//
// Storage: a single localStorage key holding one JSON blob (SaveGame.KEY
// below). Chunks/inventory/etc are plain data objects already (arrays and
// {id,count,...} stacks - see game.js/inventory.js), so this mostly just
// serializes the existing live state as-is rather than building a parallel
// representation of it.
//
// This is a MANUAL save (a "Save" button), not autosave-on-every-change -
// simpler to reason about, and avoids hammering localStorage on every
// single block placed/item moved. "Reset World" wipes the save and
// reloads the page to rebuild a completely fresh world/inventory/state
// from scratch (the same as a brand new playthrough).

const SaveGame = {
    KEY: 'ir-savegame',
    VERSION: 2,

    // Every placed GUI block also needs its own persistent per-block
    // storage layer's name (see guiBlocks.js's `GuiBlocks.storage`) -
    // listed here just so it's obvious at a glance what this pulls from,
    // not because anything iterates this array.
    // (chunks, groundItems - game.js)
    // (Inventory.slots, Inventory.selectedHotbarIndex - inventory.js)
    // (Crafting.grid2x2.cells, Crafting.grid3x3.cells - crafting.js)
    // (GuiBlocks.storage - guiBlocks.js)
    // (TankState.tanks, FluidSlots.buffers, ExtractorState.progress - fluids.js)
    // (QuestBook.progress - quests.js, already its own save; included here
    //  too so ONE "Save" button covers everything, see save()/load() below)

    // ---- serialize ----

    // Builds one plain-JSON snapshot of everything mutable in the game.
    // Every piece here is already a plain object/array (no functions, no
    // circular refs), so JSON.stringify can just be handed the whole
    // thing directly - no custom (de)serialization needed per system.
    buildSnapshot() {
        return {
            version: this.VERSION,
            savedAt: Date.now(),
            world: {
                chunks,
                groundItems,
                playerX,
                playerY,
                selectedX,
                selectedY
            },
            inventory: (typeof Inventory !== 'undefined') ? {
                slots: Inventory.slots,
                selectedHotbarIndex: Inventory.selectedHotbarIndex
            } : null,
            crafting: (typeof Crafting !== 'undefined') ? {
                grid2x2: Crafting.grid2x2.cells,
                grid3x3: Crafting.grid3x3.cells
            } : null,
            guiBlocks: (typeof GuiBlocks !== 'undefined') ? GuiBlocks.storage : null,
            power: (typeof PowerGrid !== 'undefined') ? PowerGrid.snapshot() : null,
            fluids: {
                tanks: (typeof TankState !== 'undefined') ? TankState.tanks : null,
                buffers: (typeof FluidSlots !== 'undefined') ? FluidSlots.buffers : null,
                extractorProgress: (typeof ExtractorState !== 'undefined') ? ExtractorState.progress : null
            },
            quests: (typeof QuestBook !== 'undefined') ? QuestBook.progress : null
        };
    },

    // ---- save ----

    // Writes the current full game state to localStorage. Returns true on
    // success, false if it couldn't be written (storage disabled/full) -
    // callers (the Save button) use this to show a quick success/failure
    // message rather than assuming it always works.
    save() {
        try {
            const snapshot = this.buildSnapshot();
            localStorage.setItem(this.KEY, JSON.stringify(snapshot));
            // Quest progress already has its own dedicated save
            // (QuestBook.saveProgress -> QUEST_PROGRESS_KEY). Keep that
            // one in sync too on every full save, so either save path
            // (this one, or quests.js's own internal auto-saves on task
            // completion) stays consistent with the other.
            if (typeof QuestBook !== 'undefined') QuestBook.saveProgress();
            return true;
        } catch (e) {
            console.warn('SaveGame: could not save', e);
            return false;
        }
    },

    hasSave() {
        try { return localStorage.getItem(this.KEY) !== null; }
        catch (e) { return false; }
    },

    // ---- load ----

    // Reads a snapshot back out of localStorage, or null if there isn't
    // one / it's corrupt.
    readSnapshot() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || typeof data !== 'object') return null;
            return data;
        } catch (e) {
            console.warn('SaveGame: could not read save', e);
            return null;
        }
    },

    // Restoring has to happen in TWO passes, not one, because of script
    // load order (see index.html): save.js loads first (so it exists by
    // the time game.js's init() runs), but Inventory/Crafting/GuiBlocks/
    // TankState/FluidSlots/QuestBook are only DEFINED by files that load
    // AFTER game.js - and several of them (initInventory(),
    // setupCraftingControls(), QuestBook.init()) populate their own
    // starting state (e.g. TEST_MODE starter items) immediately as a
    // side effect of loading. Applying inventory/quest/etc data too early
    // would just hit `typeof X === 'undefined'` and silently do nothing;
    // applying it before those defaults run would have the defaults
    // stomp the restored save right back over. So:
    //   - applyWorldSnapshot(): world only (chunks/groundItems/player
    //     position) - these live in game.js itself, already defined by
    //     the time its own init() calls this, and MUST run before
    //     getChunk(0,0)/renderWorld() so a saved chunk (0,0) isn't
    //     overwritten by the fresh-start carve-out.
    //   - applyRestSnapshot(): inventory/crafting/GUI blocks/fluids/
    //     quests - deferred to the window 'load' event (see the bottom of
    //     this file), which fires only after every <script> tag AND all
    //     of their own immediate init calls have already finished
    //     running, so this safely overwrites those defaults instead of
    //     racing them.
    applyWorldSnapshot(data) {
        if (!data || !data.world) return false;
        // Replace chunks' contents key-by-key rather than reassigning the
        // `chunks` binding itself (it's declared `const` in game.js) -
        // deleting every existing key then copying the saved ones back in
        // gets the same end result.
        for (const k in chunks) delete chunks[k];
        if (data.world.chunks) Object.assign(chunks, data.world.chunks);

        for (const k in groundItems) delete groundItems[k];
        if (data.world.groundItems) Object.assign(groundItems, data.world.groundItems);

        if (typeof data.world.playerX === 'number') playerX = data.world.playerX;
        if (typeof data.world.playerY === 'number') playerY = data.world.playerY;
        if (typeof data.world.selectedX === 'number') selectedX = data.world.selectedX;
        if (typeof data.world.selectedY === 'number') selectedY = data.world.selectedY;
        return true;
    },

    applyRestSnapshot(data) {
        if (!data) return false;

        if (data.inventory && typeof Inventory !== 'undefined') {
            if (Array.isArray(data.inventory.slots)) {
                // Pad/truncate to the current TOTAL_SIZE in case a future
                // version of the game changes slot counts - loading an
                // old save should never leave Inventory.slots shorter
                // than the UI expects (renderHotbar/renderInventory index
                // straight into it by position).
                const slots = data.inventory.slots.slice(0, Inventory.TOTAL_SIZE);
                while (slots.length < Inventory.TOTAL_SIZE) slots.push(null);
                Inventory.slots = slots;
            }
            if (typeof data.inventory.selectedHotbarIndex === 'number') {
                Inventory.selectedHotbarIndex = data.inventory.selectedHotbarIndex;
            }
        }

        if (data.crafting && typeof Crafting !== 'undefined') {
            if (Array.isArray(data.crafting.grid2x2)) {
                Crafting.grid2x2.cells = data.crafting.grid2x2.slice(0, 4);
                while (Crafting.grid2x2.cells.length < 4) Crafting.grid2x2.cells.push(null);
            }
            if (Array.isArray(data.crafting.grid3x3)) {
                Crafting.grid3x3.cells = data.crafting.grid3x3.slice(0, 9);
                while (Crafting.grid3x3.cells.length < 9) Crafting.grid3x3.cells.push(null);
            }
        }

        if (data.guiBlocks && typeof GuiBlocks !== 'undefined') {
            for (const k in GuiBlocks.storage) delete GuiBlocks.storage[k];
            Object.assign(GuiBlocks.storage, data.guiBlocks);
        }

        if (data.power && typeof PowerGrid !== 'undefined') PowerGrid.restore(data.power);

        if (data.fluids) {
            if (data.fluids.tanks && typeof TankState !== 'undefined') {
                for (const k in TankState.tanks) delete TankState.tanks[k];
                Object.assign(TankState.tanks, data.fluids.tanks);
            }
            if (data.fluids.buffers && typeof FluidSlots !== 'undefined') {
                for (const k in FluidSlots.buffers) delete FluidSlots.buffers[k];
                Object.assign(FluidSlots.buffers, data.fluids.buffers);
            }
            if (data.fluids.extractorProgress && typeof ExtractorState !== 'undefined') {
                for (const k in ExtractorState.progress) delete ExtractorState.progress[k];
                Object.assign(ExtractorState.progress, data.fluids.extractorProgress);
            }
        }

        if (data.quests && typeof QuestBook !== 'undefined') {
            QuestBook.progress = data.quests;
        }

        // Re-render everything now that state has been swapped out from
        // under whatever each system's own startup already drew.
        if (typeof renderInventory === 'function') renderInventory();
        if (typeof renderHotbar === 'function') renderHotbar();
        if (typeof renderCraftUI === 'function') renderCraftUI();
        if (typeof renderGuiBlockOverlay === 'function') renderGuiBlockOverlay();
        if (typeof renderQuestBook === 'function') renderQuestBook();
        return true;
    },

    // Loads the save (if any) and applies the WORLD portion only. Called
    // from game.js's init(). Returns true if a save existed.
    load() {
        const data = this.readSnapshot();
        this._pending = data; // stashed for loadRest() below
        if (!data) return false;
        return this.applyWorldSnapshot(data);
    },

    // Applies the remaining (non-world) portion of whatever load()
    // already read. Called once on the window 'load' event (see bottom
    // of this file) - see the big comment above for why this needs to be
    // a second, later pass instead of happening inside load() itself.
    loadRest() {
        if (!this._pending) return false;
        return this.applyRestSnapshot(this._pending);
    },

    // ---- reset ----

    // Wipes EVERYTHING - world, inventory, crafting grids, GUI blocks,
    // fluids, and quest progress - back to a brand new game, and reloads
    // the page so every system re-initializes from scratch exactly like a
    // first-ever launch (rather than trying to hand-reset 6+ different
    // live objects in place and hope nothing was missed).
    resetAll() {
        try { localStorage.removeItem(this.KEY); } catch (e) { /* ignore */ }
        try { localStorage.removeItem(QUEST_PROGRESS_KEY); } catch (e) { /* ignore */ }
        window.location.reload();
    }
};

// ============================================
// Save/Reset controls
// ============================================
// The buttons themselves live in index.html now, inside .frame-wrapper -
// same row as the Quest Book / Alt toggle buttons, right under the game
// frame - rather than being injected as a separate floating toolbar. This
// file just wires them up and owns the toast popup.
let saveToastTimer = null;
function showSaveToast(message) {
    const toast = document.getElementById('save-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    if (saveToastTimer) clearTimeout(saveToastTimer);
    saveToastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
}

function setupSaveControls() {
    const saveBtn = document.getElementById('save-game-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const ok = SaveGame.save();
            showSaveToast(ok ? 'Game saved' : 'Save failed');
        });
    }

    const resetBtn = document.getElementById('reset-game-btn');
    if (resetBtn) {
        // Destructive + irreversible (wipes the world, inventory, and
        // quest progress permanently) - a plain click is too easy to hit
        // by accident, so this asks for confirmation first, same caution
        // QuestBook's own "Reset Progress" button already uses for the
        // smaller quests-only reset.
        resetBtn.addEventListener('click', () => {
            const confirmed = window.confirm(
                'Reset ALL progress? This deletes your world, inventory, buildings and quest progress permanently and cannot be undone.'
            );
            if (confirmed) SaveGame.resetAll();
        });
    }
}

// save.js is loaded BEFORE game.js (see index.html) precisely so that by
// the time game.js's init() runs at the bottom of that file and calls
// SaveGame.load(), this whole object already exists. The actual
// restore-from-save call lives in game.js's init(), right before the
// starting chunk is generated/rendered - not here at this file's own
// load time, since world/inventory/etc globals (chunks, Inventory,
// Crafting, GuiBlocks...) don't exist yet at this point, only the
// functions in this file that will later read them once called.
// All this file does unconditionally at ITS OWN load time is add the
// Save/Reset buttons, which only touch the DOM, not game state.
setupSaveControls();

// Second restore pass (inventory/crafting/GUI blocks/fluids/quests) - see
// the big comment on applyWorldSnapshot/applyRestSnapshot above for why
// this can't run until every script's own immediate startup code has
// already finished. The 'load' event fires after the whole document
// (including every synchronous <script> at the bottom of index.html,
// each of which runs its own init side effects the instant it parses)
// has finished loading - QuestBook.init() itself is async (a fetch), so
// this also waits one more tick via .then() to land after QuestBook has
// actually populated `nodes`/`edges`, not just been called.
window.addEventListener('load', () => {
    const applyRest = () => {
        SaveGame.loadRest();
    };
    if (typeof QuestBook !== 'undefined' && QuestBook.init) {
        // QuestBook.init().then(renderQuestBook) is already kicked off by
        // quests.js at its own load time; piggyback on a fresh resolved
        // promise instead of re-calling init() a second time, just to
        // guarantee this runs after the current microtask queue (any
        // in-flight QuestBook.init() fetch) has settled.
        Promise.resolve().then(applyRest);
    } else {
        applyRest();
    }
});
