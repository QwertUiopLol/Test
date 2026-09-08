// ============================================
// tInter.js - "terrain interaction": breaking, placing, using blocks
// ============================================
// This is where the player's core verbs live:
//   - startBreaking()/stopBreaking() : holding down BREAK on a targeted
//     cell, ticking up progress until the block breaks (see the
//     TickSystem.onTick hook at the bottom of this file)
//   - useSelected()                  : the context-sensitive "USE" action -
//     picks up ground items, opens a station's GUI, or falls through to
//     placing a block, in that priority order
//   - placeBlock()                   : places whichever block is selected
//     in the hotbar onto the targeted cell, on the ground or overlay layer
//     depending on the block's own `overlay` flag (see registry.js)
//
// All three are wired up as button/key handlers in setupControls() over
// in game.js - this file only defines what happens once one of those
// actions fires, using the world-state helpers from game.js
// (getGlobalCellType, setGlobalOverlayType, etc.) and Inventory/Registry
// to do the actual work.

// Breaking status: only ever one block can be "being broken" at a time,
// tracked in this single shared object rather than per-cell state.
let breakingBlock = { x: null, y: null, progress: 0, type: null };
let isHoldingBreak = false; // Flag for pressing a key/button
const plantedSaplings = {}; // "x,y" -> growth ticks; intentionally world-coordinate based

function selectedToolData() {
    const selected = typeof Inventory !== 'undefined' && Inventory.getSelectedItem();
    return selected && Registry.get(selected.id);
}

function breakTicksFor(blockData) {
    const tool = selectedToolData();
    if (!tool || !tool.toolType || !blockData.effectiveTools || !blockData.effectiveTools.includes(tool.toolType)) {
        return blockData.breakTimeTicks;
    }
    // An under-tier pick can still chip a block, but receives no speed bonus.
    if ((tool.harvestLevel || 0) < (blockData.requiredHarvestLevel || 0)) return blockData.breakTimeTicks * 3;
    return Math.max(1, Math.ceil(blockData.breakTimeTicks / (tool.miningSpeed || 1)));
}

// ============================================
// Break progress bar (UI)
// ============================================

function updateBreakBar() {
    const bar = document.getElementById('break-bar');
    const fill = document.getElementById('break-bar-fill');
    if (!bar || !fill) return;

    if (!isHoldingBreak || breakingBlock.x === null) {
        bar.classList.remove('visible');
        return;
    }

    bar.classList.add('visible');

    const blockData = Registry.get(breakingBlock.type);
    const pct = blockData ? Math.min(100, (breakingBlock.progress / breakTicksFor(blockData)) * 100) : 0;
    fill.style.width = pct + '%';
}

// ============================================
// Blocks Breaking
// ============================================

// Called once when the player presses/holds the BREAK button (or Q, or
// the dpad-click). Doesn't do the breaking itself - it just validates the
// target and, if valid, starts the progress counter that the TickSystem
// hook at the bottom of this file increments every tick until it's done.
function startBreaking() {
    const x = selectedX;
    const y = selectedY;

    if (!isInSelectionRadius(x, y)) return;
    if (playerX === x && playerY === y) return; // can't break the block you're standing on

    // Alt-mode test hook (scripts/altDrop.js): while altMode is on and the
    // targeted cell is an eligible ground block with nothing placed on top
    // of it, this replaces the normal break entirely with an instant
    // random-pebble drop - no break-bar, no progress ticks.
    if (altMode && typeof tryAltDrop === 'function' && tryAltDrop(x, y)) {
        return;
    }

    // Breaking targets whatever is on top: the overlay block (e.g. a
    // workbench) if there is one, otherwise the ground block itself.
    const overlayType = getGlobalOverlayType(x, y);
    const current = overlayType || getGlobalCellType(x, y);

    if (current === 'void') return;

    const blockData = Registry.get(current);
    if (!blockData || blockData.type !== 'block') return;

    isHoldingBreak = true;
    breakingBlock = { x, y, progress: 0, type: current, layer: overlayType ? 'overlay' : 'ground' };
    updateBreakBar();
}

// Called when the BREAK button/key is released (or the tick handler below
// decides the break should be cancelled, e.g. the selection moved away).
// Resets breaking state back to "nothing in progress" - any partial
// progress is simply lost, there's no "remembering" a half-broken block.
function stopBreaking() {
    isHoldingBreak = false;
    breakingBlock = { x: null, y: null, progress: 0, type: null };
    updateBreakBar();
}

// ============================================
// Blocks Placing
// ============================================

// ============================================
// Alt Mode
// ============================================
// The `altMode` flag itself (toggled by the ALT button) lives in game.js.
// Its one current effect is the test pebble-drop hook on the BREAK action
// - see tryAltDrop() in scripts/altDrop.js and its call from
// startBreaking() above. "Use" is intentionally left alone by altMode so
// picking up ground items / opening a station's GUI still works as normal
// no matter which mode is active.

// "Use" action: picks up any dropped items on the selected cell first,
// then opens the Workbench UI if there's a workbench on it, otherwise
// falls through to placing whatever block is selected.
function useSelected() {
    if (getGroundItems(selectedX, selectedY)) {
        pickUpGroundItems(selectedX, selectedY);
        renderWorld();
        return;
    }

    // Wrenches configure pipes, cables and machine faces instead of opening
    // their GUI. This is deliberately a real action with tool wear: rotate a
    // port before connecting it, then use the same wrench to reconfigure it.
    const heldTool = selectedToolData();
    const overlayType = getGlobalOverlayType(selectedX, selectedY);
    const groundType = getGlobalCellType(selectedX, selectedY);
    const targetData = Registry.get(overlayType || groundType);
    if (heldTool && heldTool.toolType === 'wrench' && targetData && targetData.wrenchConfigurable) {
        const current = getGlobalDirection(selectedX, selectedY) || 'N';
        const next = RANDOM_DIRECTIONS[(RANDOM_DIRECTIONS.indexOf(current) + 1) % RANDOM_DIRECTIONS.length];
        setGlobalDirection(selectedX, selectedY, next);
        Inventory.damageSelectedTool(1);
        renderWorld();
        return;
    }

    // Ground-layer block can also have a GUI (e.g. a furnace placed as the
    // base block rather than an overlay) - check both layers.
    if (overlayType && typeof GuiBlocks !== 'undefined' && GuiBlocks.tryOpen(overlayType, selectedX, selectedY)) {
        return;
    }
    if (groundType && groundType !== 'void' && typeof GuiBlocks !== 'undefined' && GuiBlocks.tryOpen(groundType, selectedX, selectedY)) {
        return;
    }
    placeBlock();
}

// Places the currently-selected hotbar item onto the targeted cell, IF
// it's a block and the placement rules allow it there. Two very different
// rule sets apply depending on whether the block is an overlay block
// (registry.js `overlay: true`, e.g. Workbench) or a regular ground block
// - see the two branches below.
function placeBlock() {
    const x = selectedX;
    const y = selectedY;
    const current = getGlobalCellType(x, y);

    // Must have a selected hotbar item that is a placeable block
    if (typeof Inventory === 'undefined') return;
    const selectedItem = Inventory.getSelectedItem();
    if (!selectedItem) return;

    const itemData = Registry.get(selectedItem.id);
    if (!itemData || itemData.type !== 'block') return;

    if (playerX === x && playerY === y) return;
    if (!isInSelectionRadius(x, y)) return;

    // Can't place a block on a cell that has dropped items lying on it.
    if (getGroundItems(x, y)) return;

    if (itemData.overlay) {
        // Overlay blocks (e.g. workbench): placed as a second layer ON TOP
        // of an existing ground block. The ground block (grass/stone) is
        // required underneath and stays untouched; the cell itself must
        // not already have an overlay block on it.
        if (current === 'void') return;
        if (getGlobalOverlayType(x, y)) return;

        if (!Inventory.consumeSelected(1)) return;
        setGlobalOverlayType(x, y, selectedItem.id);
        renderWorld();
        return;
    }

    // Regular ground blocks: placed into an empty (void) cell, must be
    // adjacent to some other ground block so placement can't float in
    // open space.
    if (current !== 'void') return;

    const hasAdjacentBlock = (
        getGlobalCellType(x + 1, y) !== 'void' ||
        getGlobalCellType(x - 1, y) !== 'void' ||
        getGlobalCellType(x, y + 1) !== 'void' ||
        getGlobalCellType(x, y - 1) !== 'void'
    );
    if (!hasAdjacentBlock) return;

    if (!Inventory.consumeSelected(1)) return;

    setGlobalCellType(x, y, selectedItem.id);

    if (itemData.plantable) plantedSaplings[`${x},${y}`] = 0;

    // Blocks registered with `randomDirection: true` (registry.js) get a
    // facing rolled ONCE here, right at placement, and stored per-tile
    // (see setGlobalDirection/getGlobalDirection in game.js) - not
    // re-rolled on every render, or a block's facing would flicker/change
    // every time the world redraws instead of staying put once placed.
    // This is purely cosmetic (a rotated texture, see applyBlockVisual in
    // game.js) - it doesn't affect breaking, walkability, or crafting.
    if (itemData.randomDirection) {
        setGlobalDirection(x, y, rollRandomDirection());
    }

    renderWorld();
}

// ============================================
// Tick System Implemention
// ============================================
// Registers with TickSystem (tick.js) to advance break progress once per
// tick, as long as isHoldingBreak is true and the target hasn't changed
// out from under us. This is the pattern to copy if you add your own
// "takes time" mechanic later: register one onTick callback, and have it
// check its own conditions/early-return rather than assuming it should
// always act.
if (typeof TickSystem !== 'undefined') {
    TickSystem.onTick(() => {
        if (!isHoldingBreak || breakingBlock.x === null) return;
        
        // If the selection has left the block being broken then reset
        if (breakingBlock.x !== selectedX || breakingBlock.y !== selectedY) {
            stopBreaking();
            return;
        }
        
        // If the block is no longer in the same place then reset
        const currentAtTarget = breakingBlock.layer === 'overlay'
            ? getGlobalOverlayType(breakingBlock.x, breakingBlock.y)
            : getGlobalCellType(breakingBlock.x, breakingBlock.y);
        if (currentAtTarget !== breakingBlock.type) {
            stopBreaking();
            return;
        }
        
        const blockData = Registry.get(breakingBlock.type);
        if (!blockData) return;
        
        breakingBlock.progress++;
        updateBreakBar();
        
        if (breakingBlock.progress >= breakTicksFor(blockData)) {
            const tool = selectedToolData();
            if (tool && tool.toolType && blockData.effectiveTools && blockData.effectiveTools.includes(tool.toolType)) {
                Inventory.damageSelectedTool(1);
            }
            const dropId = blockData.dropId;
            if (dropId) {
                addItemOrDrop(breakingBlock.x, breakingBlock.y, dropId, 1);
            }

            // Overlay blocks (e.g. workbench) only clear the overlay layer -
            // the ground block underneath (grass/stone) is left untouched.
            if (breakingBlock.layer === 'overlay') {
                setGlobalOverlayType(breakingBlock.x, breakingBlock.y, null);
            } else {
                setGlobalCellType(breakingBlock.x, breakingBlock.y, 'void');
            }
            stopBreaking();
            renderWorld();
        }
    });

    // A planted synthetic seed becomes a harvestable tree only when it has
    // room to expand.  This makes wood renewable without creating logs from
    // a menu or a world-generation exception.
    TickSystem.onTick(() => {
        for (const key of Object.keys(plantedSaplings)) {
            plantedSaplings[key]++;
            if (plantedSaplings[key] < 300) continue;
            const [x, y] = key.split(',').map(Number);
            if (getGlobalCellType(x, y) !== 'IR-sapling') { delete plantedSaplings[key]; continue; }
            const crown = [[x, y - 1], [x - 1, y - 1], [x + 1, y - 1], [x, y - 2]];
            if (crown.some(([cx, cy]) => getGlobalCellType(cx, cy) !== 'void')) continue;
            setGlobalCellType(x, y, 'IR-oaklog');
            crown.forEach(([cx, cy]) => setGlobalCellType(cx, cy, 'IR-oak-leaves'));
            delete plantedSaplings[key];
            renderWorld();
        }
    });
}
