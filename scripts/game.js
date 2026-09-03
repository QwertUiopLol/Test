// ============================================
// game.js - the world/map layer
// ============================================
// This is the "core" file: it owns the world grid (chunks, ground blocks,
// the overlay layer, dropped items), the player/selection position, the
// camera/rendering loop, and top-level input wiring (dpad, keyboard,
// clicking the world). Almost every other file (tInter.js, inventory.js,
// crafting.js, guiBlocks.js...) calls INTO functions defined here
// (getGlobalCellType, setGlobalOverlayType, renderWorld, etc.) rather than
// touching world state directly - so if you're trying to understand "how
// does the game know what's at position (x,y)", this is the file to read.
//
// Rough map of this file, top to bottom:
//   1. Debug settings + main mutable state (player pos, selection, etc.)
//   2. Ground items - dropped stacks lying on the map
//   3. Chunks - how the (theoretically infinite) world is split into
//      fixed-size grids and generated/stored
//   4. Movement/selection rules (walkable, in range, etc.)
//   5. Camera + rendering (figuring out what the viewport shows, building
//      the on-screen grid of .cell divs, and painting each one)
//   6. Debug overlay / dpad mode indicator (small UI helpers)
//   7. Movement, selection, and mode-toggle functions
//   8. Input wiring (buttons, clicks, keyboard) - setupControls()
//   9. init() - runs once on page load, wires everything up and starts
//      the tick system

// ============================================
// Debug Settings
// ============================================
// TEST_MODE relaxes a couple of rules for easier iteration while building:
// see isWalkable() below (walking is unrestricted) and initInventory() in
// inventory.js (gives starter items). Flip to false for "real" behavior.

const TEST_MODE = true;
const CHUNK_SIZE = 16;      // world is split into CHUNK_SIZE x CHUNK_SIZE chunks
const SELECTION_RADIUS = 5; // how far from the player the selection cursor can reach

// ============================================
// Main Data
// ============================================

let playerX = 0;
let playerY = 0;
let selectedX = 0;
let selectedY = 0;
let dpadMode = 'player';
let altMode = false; // toggled by the ALT button - lets other logic (e.g. useSelected) branch on it

let viewportW = 15;
let viewportH = 15;
let cellSize = 0;

let cellPool = [];
const chunks = {};

// ============================================
// Ground Items (dropped items lying on the world)
// ============================================
// Keyed by "x,y" -> single { id, count } | undefined. A ground tile holds
// AT MOST one item type at a time, capped at that item's maxStack (usually
// 64) - like one dropped stack lying on the tile, not an open pile of
// mixed items. Used whenever items can't fit in the inventory (instead of
// just blocking the action) or whenever something is explicitly dropped
// onto the ground.
const groundItems = {};

function groundKey(x, y) { return `${x},${y}`; }

function getGroundItems(x, y) {
    return groundItems[groundKey(x, y)] || null;
}

// Adds `count` of `id` to the ground stack at (x, y).
//
// A ground cell can only ever hold ONE item type at a time, capped at that
// item's maxStack (usually 64) - like a single dropped stack lying on the
// tile, not an open-ended pile. Rules:
//   - Empty cell -> starts a stack of `id`, clamped to maxStack. Anything
//     over the cap is returned as leftover (caller decides what to do,
//     e.g. try dropping on an adjacent tile).
//   - Cell already holds the SAME id -> tops it up to maxStack, returns
//     whatever didn't fit as leftover.
//   - Cell already holds a DIFFERENT id -> nothing fits here at all; the
//     full `count` is returned as leftover so the caller can find another
//     tile instead of silently merging two different items into one pile.
// Returns the leftover count that did NOT fit on this tile (0 if it all fit).
function dropItemOnGround(x, y, id, count) {
    if (!id || count <= 0) return 0;
    const key = groundKey(x, y);
    const maxStack = (typeof Inventory !== 'undefined') ? Inventory.maxStackFor(id) : 64;

    const existing = groundItems[key];
    if (existing && existing.id !== id) {
        // Occupied by a different item type - this tile can't take it.
        return count;
    }

    const currentCount = existing ? existing.count : 0;
    const space = Math.max(0, maxStack - currentCount);
    const add = Math.min(space, count);

    if (add > 0) {
        groundItems[key] = { id, count: currentCount + add };
    }

    return count - add;
}

// Tries to add `count` of `id` to the inventory; whatever doesn't fit is
// dropped on the ground at (x, y) instead of being lost/blocked. Since a
// ground tile only holds one item type at maxStack, if that tile is stuck
// full of a different item, the drop is simply lost (matches "the ground
// can't hold it" rather than pretending it landed somewhere).
function addItemOrDrop(x, y, id, count) {
    if (typeof Inventory === 'undefined') return;
    const leftover = Inventory.addItem(id, count);
    if (leftover > 0) dropItemOnGround(x, y, id, leftover);
}

// Picks up whatever single item stack is sitting at (x, y), adding as much
// as fits into the inventory and leaving the rest (same id) on the ground.
function pickUpGroundItems(x, y) {
    const key = groundKey(x, y);
    const stack = groundItems[key];
    if (!stack) return;

    const leftover = (typeof Inventory !== 'undefined') ? Inventory.addItem(stack.id, stack.count) : stack.count;
    if (leftover > 0) groundItems[key] = { id: stack.id, count: leftover };
    else delete groundItems[key];
}

// ============================================
// Chunks
// ============================================

function getChunkKey(cx, cy) { return `${cx},${cy}`; }

// Chunks are generated LAZILY: a chunk doesn't exist until something asks
// for it (getGlobalCellType/setGlobalCellType below, which every other
// system uses to read/write the world). This means the world is
// effectively infinite - you never have to pre-generate anything, chunks
// just pop into existence the first time the player wanders near them or
// code queries a coordinate inside them.
function getChunk(cx, cy) {
    const key = getChunkKey(cx, cy);
    if (chunks[key]) return chunks[key]; // already generated, reuse it

    // Brand new chunk: 'void' everywhere (empty space) by default, plus an
    // empty overlay layer. `data` and `overlay` are both CHUNK_SIZE x
    // CHUNK_SIZE 2D arrays indexed as [y][x].
    const chunk = {
        data: Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill('void')),
        // Second layer, drawn on top of `data`. Used for things like the
        // workbench that sit ON a ground block without replacing it - the
        // block underneath (grass/stone) is preserved and unaffected when
        // the overlay is placed or broken.
        overlay: Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(null)),
        // Third layer, purely cosmetic: which way a placed block is facing
        // ('N'/'E'/'S'/'W'), only ever set for blocks registered with
        // `randomDirection: true` (see registry.js). Null everywhere else.
        // Rolled once at placement time in placeBlock() (tInter.js) and
        // read back by applyBlockVisual() below to rotate the tile - see
        // the notes there for why this needs its own layer instead of
        // being encoded into the block id itself.
        direction: Array(CHUNK_SIZE).fill().map(() => Array(CHUNK_SIZE).fill(null))
    };

    // Special-case: chunk (0,0) is hand-carved as the starting area (a
    // small stone-bordered dirt patch) instead of being pure void, and
    // this is also where the player's initial spawn position is set. If
    // you add real world generation later (noise-based terrain, etc.),
    // this is the block to replace/extend - everything else in the file
    // just calls getChunk() and doesn't care how a chunk's contents came
    // to be.
    if (cx === 0 && cy === 0) {
        const centerX = Math.floor(CHUNK_SIZE / 2);
        const centerY = Math.floor(CHUNK_SIZE / 2);
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                const x = centerX + dx;
                const y = centerY + dy;
                if (x >= 0 && x < CHUNK_SIZE && y >= 0 && y < CHUNK_SIZE) {
                    const isEdge = Math.abs(dx) === 3 || Math.abs(dy) === 3;
                    chunk.data[y][x] = isEdge ? 'IR-cobblestone' : 'IR-dirt';
                }
            }
        }
        playerX = centerX;
        playerY = centerY;
        selectedX = centerX;
        selectedY = centerY;
    }

    chunks[key] = chunk;
    return chunk;
}

// JS's % can return negative numbers for negative inputs (e.g. -1 % 16 ===
// -1, not 15), which would break indexing into a chunk's local array when
// the player wanders into negative world coordinates. This wraps it into
// the proper 0..m-1 range.
function mod(n, m) { return ((n % m) + m) % m; }

// ---- Ground layer (grass/stone/etc - the "floor" of the world) ----
// x, y here are GLOBAL world coordinates (can be any integer, positive or
// negative) - these functions handle converting to the right chunk +
// local-within-chunk coordinates internally, so calling code never has to
// think about chunks at all.
function getGlobalCellType(x, y) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    return chunk.data[ly][lx];
}

function setGlobalCellType(x, y, type) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    chunk.data[ly][lx] = type;
    // Clearing a cell (breaking it, type === 'void') also clears any
    // rolled facing so a future different block placed here doesn't
    // inherit a stale direction from whatever used to stand on this tile.
    if (type === 'void') chunk.direction[ly][lx] = null;
}

// ---- Direction layer (cosmetic facing for `randomDirection: true` blocks) ----
// x, y here are GLOBAL world coordinates, same conversion as the ground/
// overlay layers above.
function getGlobalDirection(x, y) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    return chunk.direction[ly][lx];
}

function setGlobalDirection(x, y, dir) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    chunk.direction[ly][lx] = dir;
}

const RANDOM_DIRECTIONS = ['N', 'E', 'S', 'W'];
function rollRandomDirection() {
    return RANDOM_DIRECTIONS[Math.floor(Math.random() * RANDOM_DIRECTIONS.length)];
}

// CSS rotation (deg) for each facing, applied to the cell's ground-layer
// background so the same texture reads as facing a different way per
// tile - see applyBlockVisual() below.
const DIRECTION_ROTATION_DEG = { N: 0, E: 90, S: 180, W: 270 };

// ---- Overlay layer (e.g. workbench sitting on top of ground) ----

function getGlobalOverlayType(x, y) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    return chunk.overlay[ly][lx];
}

function setGlobalOverlayType(x, y, type) {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cy = Math.floor(y / CHUNK_SIZE);
    const chunk = getChunk(cx, cy);
    const lx = mod(x, CHUNK_SIZE);
    const ly = mod(y, CHUNK_SIZE);
    chunk.overlay[ly][lx] = type;
}

// ============================================
// Useful functions and rules
// ============================================

function isWalkable(x, y) {
    if (TEST_MODE) return true;
    return getGlobalCellType(x, y) !== 'void';
}

function isInSelectionRadius(x, y) {
    const dx = Math.abs(x - playerX);
    const dy = Math.abs(y - playerY);
    return Math.max(dx, dy) <= SELECTION_RADIUS;
}

// ============================================
// Camera and Render
// ============================================

// Figures out how many cells fit on screen and how big each cell should
// be, based on the current window size. Always keeps an ODD width/height
// (see the `% 2 === 0` bumps below) so there's a single, perfectly
// centered cell for the player to stand on - an even count would leave
// the player straddling two center cells instead of standing in one.
function calculateViewport() {
    const maxWorldSize = Math.min(window.innerWidth - 40, window.innerHeight * 0.55);
    cellSize = Math.max(Math.floor(maxWorldSize / 15), 16);
    viewportW = Math.floor(maxWorldSize / cellSize);
    viewportH = viewportW;
    if (viewportW % 2 === 0) viewportW++;
    if (viewportH % 2 === 0) viewportH++;
}

// Creates the actual DOM elements for the viewport - one <div class="cell">
// per visible tile - and stashes them in `cellPool`. Only called when the
// viewport SIZE changes (window resized to fit more/fewer cells), not on
// every render: normally renderWorld() just reuses and repaints the same
// pooled elements instead of destroying/recreating them, which is much
// cheaper than rebuilding the DOM every frame/move.
function rebuildCellPool() {
    const worldEl = document.getElementById('world');
    worldEl.innerHTML = '';
    cellPool = [];

    worldEl.style.gridTemplateColumns = `repeat(${viewportW}, ${cellSize}px)`;
    worldEl.style.gridTemplateRows = `repeat(${viewportH}, ${cellSize}px)`;

    const total = viewportW * viewportH;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        fragment.appendChild(cell);
        cellPool.push(cell);
    }
    worldEl.appendChild(fragment);
}

// The main render function - called after almost every state change
// (movement, breaking, placing, picking up items...) to redraw the whole
// visible viewport from scratch. It's cheap because it reuses `cellPool`
// (see rebuildCellPool above) rather than recreating DOM nodes each time;
// it just recalculates what belongs in each pooled cell and updates its
// classes/data/CSS vars.
function renderWorld() {
    const prevW = viewportW;
    const prevH = viewportH;
    calculateViewport();

    const worldEl = document.getElementById('world');
    const sizeChanged = (viewportW !== prevW || viewportH !== prevH || cellPool.length === 0);

    if (sizeChanged) {
        rebuildCellPool();
    } else {
        worldEl.style.gridTemplateColumns = `repeat(${viewportW}, ${cellSize}px)`;
        worldEl.style.gridTemplateRows = `repeat(${viewportH}, ${cellSize}px)`;
    }

    const halfW = Math.floor(viewportW / 2);
    const halfH = Math.floor(viewportH / 2);

    let index = 0;
    for (let vy = 0; vy < viewportH; vy++) {
        for (let vx = 0; vx < viewportW; vx++) {
            const gx = playerX - halfW + vx;
            const gy = playerY - halfH + vy;

            const cell = cellPool[index++];
            const cellType = getGlobalCellType(gx, gy);
            const overlayType = getGlobalOverlayType(gx, gy);

            const groundItem = getGroundItems(gx, gy);

            let className = `cell ${cellType}`;
            if (overlayType) className += ` overlay overlay-${overlayType}`;
            if (gx === playerX && gy === playerY) className += ' player';
            if (gx === selectedX && gy === selectedY) className += ' selected';
            if (groundItem) {
                className += ' has-ground-item';
                if (groundItem.count > 1) className += ' ground-item-many';
            }
            cell.className = className;

            // Look up ground block texture/color from the Registry instead
            // of depending on a per-id CSS rule (.cell.IR-xxx). This means
            // any block registered with a `texture` or `color` field just
            // works, with no CSS edits needed.
            applyBlockVisual(cell, cellType, gx, gy);

            cell.dataset.x = gx;
            cell.dataset.y = gy;
            if (overlayType) cell.dataset.overlay = overlayType;
            else delete cell.dataset.overlay;

            // Dropped item on the ground: shows that specific item's own
            // texture/icon (see .cell.has-ground-item::before in style.css)
            // and the stack count, instead of a generic "something's here"
            // marker - so you can tell what's lying on a tile at a glance.
            if (groundItem) {
                const itemData = Registry.get(groundItem.id);
                setBlockVisualVars(cell, itemData, 'ground-item');
                // isTransparentColor() lives in registry.js and is reused
                // by itemIconHTML() in inventory.js for the same idea
                // applied to inventory icons: a fully
                // transparent registry color (e.g. the pebbles) means no
                // solid chip/border should be drawn behind the item's own
                // art, or a bare dark outline shows up floating on the tile.
                const solid = !(typeof isTransparentColor === 'function' && isTransparentColor(itemData && itemData.color));
                cell.classList.toggle('has-solid-bg', solid);
                if (groundItem.count > 1) cell.dataset.groundCount = groundItem.count;
                else delete cell.dataset.groundCount;
            } else {
                cell.style.removeProperty('--ground-item-bg-color');
                cell.style.removeProperty('--ground-item-bg-image');
                cell.classList.remove('has-solid-bg');
                delete cell.dataset.groundCount;
            }

            // Overlay block (e.g. workbench) visual, applied to the
            // ::after pseudo-element via a CSS custom property since JS
            // can't style pseudo-elements directly.
            if (overlayType) {
                const overlayData = Registry.get(overlayType);
                setBlockVisualVars(cell, overlayData, 'overlay');
            } else {
                cell.style.removeProperty('--overlay-bg-color');
                cell.style.removeProperty('--overlay-bg-image');
            }
        }
    }

    updateDebugOverlay();
    updateModeIndicator();

    if (typeof updateBreakBar === 'function') updateBreakBar();
}

// ============================================
// Block visuals (Registry-driven, no per-id CSS needed)
// ============================================
// Blocks/items can define `texture` (an image path/URL, e.g. from
// assets/) and/or `color` (a CSS color, used as a base/fallback and while
// the texture loads). Neither is required - blocks with no texture/color
// registered just render as CSS-default (transparent/void look).

function setBlockVisualVars(el, data, prefix) {
    // prefix is 'overlay'/'ground-item' for those layers, '' for the base
    // ground layer.
    // Ground layer -> --bg-color / --bg-image
    // Overlay layer -> --overlay-bg-color / --overlay-bg-image
    // Ground-item layer -> --ground-item-bg-color / --ground-item-bg-image
    const colorVar = prefix ? `--${prefix}-bg-color` : '--bg-color';
    const imageVar = prefix ? `--${prefix}-bg-image` : '--bg-image';
    if (data && data.color) el.style.setProperty(colorVar, data.color);
    else el.style.removeProperty(colorVar);

    // Prefer `texture` (world-tile image); items that only define `icon`
    // as an image path (e.g. the pebble items, which have no `texture`
    // field) fall back to that so they still show up correctly as ground
    // drops. Emoji/text icons (like '🔨') aren't valid image URLs, so only
    // use `icon` here when it actually looks like an image path.
    const imagePath = (data && data.texture)
        ? data.texture
        : (data && data.icon && /\.(png|jpe?g|gif|webp|svg)$/i.test(data.icon) ? data.icon : null);

    // Only set background-image when the file actually exists (verified
    // async via TextureCheck). A missing file left as a CSS url() paints
    // blank/black on top of the color fallback instead of letting the
    // color show through - checking first avoids that.
    if (imagePath && TextureCheck.check(imagePath)) {
        el.style.setProperty(imageVar, `url("${imagePath}")`);
    } else {
        el.style.removeProperty(imageVar);
    }
}

function applyBlockVisual(cell, cellType, gx, gy) {
    if (cellType === 'void') {
        cell.style.removeProperty('--bg-color');
        cell.style.removeProperty('--bg-image');
        cell.style.removeProperty('--bg-rotation');
        return;
    }
    const data = Registry.get(cellType);
    setBlockVisualVars(cell, data, '');

    // Blocks registered with `randomDirection: true` (registry.js) got a
    // facing rolled once at placement time (see placeBlock() in tInter.js).
    // Rotate just the ground-layer background to reflect it - purely
    // cosmetic, doesn't affect gameplay (walkability, breaking, etc).
    if (data && data.randomDirection) {
        const dir = getGlobalDirection(gx, gy) || 'N';
        cell.style.setProperty('--bg-rotation', `${DIRECTION_ROTATION_DEG[dir] || 0}deg`);
    } else {
        cell.style.removeProperty('--bg-rotation');
    }
}

// ============================================
// Debug Overlay
// ============================================

function updateDebugOverlay() {
    const overlay = document.getElementById('debug-overlay');
    if (!TEST_MODE) {
        overlay.classList.remove('visible');
        overlay.textContent = '';
        return;
    }
    overlay.classList.add('visible');

    const cx = Math.floor(playerX / CHUNK_SIZE);
    const cy = Math.floor(playerY / CHUNK_SIZE);

    overlay.textContent =
`p:(${playerX},${playerY})
s:(${selectedX},${selectedY})
c:(${cx},${cy})
r:${SELECTION_RADIUS}`;
}

// ============================================
// DPad indicator
// ============================================

function updateModeIndicator() {
    const modeEl = document.getElementById('dpad-mode');
    const section = document.querySelector('.control-section');
    const toggleBtn = document.getElementById('toggle-mode');

    if (dpadMode === 'select') {
        modeEl.textContent = 'Selection';
        section.classList.add('select-active');
        toggleBtn.classList.add('select-mode');
    } else {
        modeEl.textContent = 'Movement';
        section.classList.remove('select-active');
        toggleBtn.classList.remove('select-mode');
    }
}

// ============================================
// Movements
// ============================================

function movePlayer(dx, dy) {
    const nx = playerX + dx;
    const ny = playerY + dy;
    if (!isWalkable(nx, ny)) return;
    playerX = nx;
    playerY = ny;
    if (!isInSelectionRadius(selectedX, selectedY)) {
        selectedX = playerX;
        selectedY = playerY;
    }
    pickUpGroundItems(playerX, playerY);
    renderWorld();
}

function moveSelection(dx, dy) {
    const nx = selectedX + dx;
    const ny = selectedY + dy;
    if (!isInSelectionRadius(nx, ny)) return;
    selectedX = nx;
    selectedY = ny;
    renderWorld();
}

function onCellClick(x, y) {
    if (!isInSelectionRadius(x, y)) return;
    selectedX = x;
    selectedY = y;
    renderWorld();
}

function toggleDpadMode() {
    dpadMode = dpadMode === 'player' ? 'select' : 'player';
    renderWorld();
}

function toggleAltMode() {
    altMode = !altMode;
    const altBtn = document.getElementById('dpad-alt');
    if (altBtn) altBtn.classList.toggle('alt-active', altMode);
}

// ============================================
// Controls
// ============================================

function setupControls() {
    const handleDpad = (dx, dy) => {
        if (dpadMode === 'player') movePlayer(dx, dy);
        else moveSelection(dx, dy);
    };
    
    document.getElementById('dpad-up').addEventListener('click', () => handleDpad(0, -1));
    document.getElementById('dpad-down').addEventListener('click', () => handleDpad(0, 1));
    document.getElementById('dpad-left').addEventListener('click', () => handleDpad(-1, 0));
    document.getElementById('dpad-right').addEventListener('click', () => handleDpad(1, 0));
    document.getElementById('toggle-mode').addEventListener('click', toggleDpadMode);

    const altBtn = document.getElementById('dpad-alt');
    if (altBtn) altBtn.addEventListener('click', toggleAltMode);

    const interactBtn = document.getElementById('dpad-interact');
    if (interactBtn) {
        interactBtn.addEventListener('click', () => {
            if (typeof useSelected === 'function') useSelected();
            else if (typeof placeBlock === 'function') placeBlock();
        });
    }

    const clickBtn = document.getElementById('dpad-click'); 
    if (clickBtn) {
        clickBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (typeof startBreaking === 'function') startBreaking();
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(evt => {
            clickBtn.addEventListener(evt, () => {
                if (typeof stopBreaking === 'function') stopBreaking();
            });
        });
    }

    const worldEl = document.getElementById('world');
    worldEl.addEventListener('click', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        onCellClick(parseInt(cell.dataset.x, 10), parseInt(cell.dataset.y, 10));
    });
    worldEl.addEventListener('touchend', (e) => {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        e.preventDefault();
        onCellClick(parseInt(cell.dataset.x, 10), parseInt(cell.dataset.y, 10));
    });
    
    const keysDown = {};
    document.addEventListener('keydown', (e) => {
        if (keysDown[e.key]) return; // autotyping stuff defence
        keysDown[e.key] = true;
        
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W': e.preventDefault(); handleDpad(0, -1); break;
            case 'ArrowDown': case 's': case 'S': e.preventDefault(); handleDpad(0, 1); break;
            case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); handleDpad(-1, 0); break;
            case 'ArrowRight': case 'd': case 'D': e.preventDefault(); handleDpad(1, 0); break;
            case 'Tab': e.preventDefault(); toggleDpadMode(); break;
            case 'q': case 'Q':
                e.preventDefault();
                if (typeof startBreaking === 'function') startBreaking();
                break;
            case 'e': case 'E': case 'Enter':
                e.preventDefault();
                if (typeof useSelected === 'function') useSelected();
                else if (typeof placeBlock === 'function') placeBlock();
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keysDown[e.key] = false;
        if (e.key === 'q' || e.key === 'Q') {
            e.preventDefault();
            if (typeof stopBreaking === 'function') stopBreaking();
        }
    });
}

// ============================================
// Init
// ============================================

// Entry point - runs once when this script loads (see the init() call at
// the very bottom of the file). Sets up the starting chunk, does the
// first render, wires up all input, and starts the tick heartbeat. If
// you're adding a new "system" file that needs to run setup code once at
// load time, the existing pattern (see tInter.js/inventory.js/etc.) is:
// define your setup function, then call it unconditionally at the bottom
// of your own file - you don't need to hook into this init() directly.
function init() {
    // Give save.js (loaded after every other system file, see index.html)
    // a chance to restore a previous save BEFORE the starting chunk is
    // generated/rendered - otherwise chunk (0,0) would already be built
    // fresh (and playerX/playerY reset to its center) by the time a saved
    // world got applied on top of it. SaveGame.load() is a no-op if
    // there's nothing saved yet (fresh playthrough), so this is safe to
    // call unconditionally.
    if (typeof SaveGame !== 'undefined') SaveGame.load();

    getChunk(0, 0);
    renderWorld();
    setupControls();

    // Re-render the world once any pending texture check resolves, so
    // blocks/items pick up their real PNG as soon as it's confirmed to
    // exist (or drop back to the color fallback if it's missing).
    TextureCheck.onChange(() => renderWorld());
    
    if (typeof TickSystem !== 'undefined') {
        TickSystem.start();
    }
    
    window.addEventListener('resize', renderWorld);
}
init();
