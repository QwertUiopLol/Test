// ============================================
// Registry (the game's "database" of block/item types)
// ============================================
// This is the single source of truth for what every block/item IS: its
// name, whether it stacks, how it renders, how long it takes to break,
// what it drops, and (for GUI blocks) how its interface looks. Every other
// system in the game - inventory, world rendering, crafting, JEI, quests -
// looks things up here by id rather than hardcoding block/item behavior
// itself. If you want to add a new block or item, you almost never touch
// game logic in other files: you just add an entry to Registry.register()
// near the bottom of this file, and everything downstream (rendering,
// stacking, breaking, JEI listing...) picks it up automatically because
// it all reads from Registry.get(id).
//
// An "id" is a string like 'IR-dirt' or 'IR-apebble' - the game's internal
// name for that block/item, used as the key everywhere (inventory slots,
// world cell data, crafting recipes, etc). "IR" has no special meaning
// beyond being this project's naming prefix; feel free to keep using it
// for anything you add, just to stay consistent.
const Registry = {
    blocks: {}, // id -> full entry, for anything with type: 'block'
    items: {},  // id -> full entry, for anything with type: 'item'

    // Registers one or more block/item definitions at once. `data` is a
    // plain object shaped like { 'some-id': { name: '...', type: '...', ... } }
    // - see the big Registry.register({...}) call below for real examples.
    //
    // Fills in sensible defaults for any field the caller didn't specify,
    // so a minimal entry (just name/type/color) still works everywhere:
    //   - stackable defaults to true
    //   - maxStack defaults to 64 (stackable) or 1 (not stackable)
    //   - breakTimeTicks defaults to 20 ticks (1 second) to mine
    //   - hardness defaults to 1 (currently just informational/flavor -
    //     breakTimeTicks is what actually controls mining speed)
    //   - dropId defaults to the block's own id (breaking it drops itself),
    //     or null for items (items aren't "broken", so no default drop)
    register(data) {
        for (const id in data) {
            const entry = {id, ...data[id]}

            if (entry.stackable === undefined) entry.stackable = true
            if (entry.maxStack === undefined) entry.maxStack = entry.stackable ? 64 : 1
            if (entry.breakTimeTicks === undefined) entry.breakTimeTicks = 20
            if (entry.hardness === undefined) entry.hardness = 1
            if (entry.dropId === undefined) entry.dropId = entry.type === 'block' ? entry.id : null
            // Cosmetic-only flag (blocks only - see placeBlock() in
            // tInter.js and applyBlockVisual() in game.js): when true, each
            // time this block is placed it rolls a random facing
            // (N/E/S/W) once and keeps it, so tiles of the same block
            // don't all look identically aligned. Defaults to false so
            // every entry has the field explicitly set either way.
            if (entry.randomDirection === undefined) entry.randomDirection = false

            if (entry.type === 'block') {
                this.blocks[id] = entry;
            } else if (entry.type === 'item') {
                this.items[id] = entry
            }
        }
    },

    // Looks up a block OR item by id, wherever it's registered. This is
    // the one function almost every other file calls when it needs to
    // know "what is this id, and what does it look like/do?".
    get(id) {
        return this.blocks[id] || this.items[id] || null
    }
}

// A registry `color` like '#ffffff00' or 'transparent' has zero alpha -
// there's nothing solid to actually paint behind an icon/ground-item chip,
// so renderers use this to skip drawing a border/background-color "frame"
// around fully see-through items (e.g. the pebbles, color: '#ffffff00') -
// see .has-solid-bg in style.css, and its use in itemIconHTML() (inventory.js)
// and renderWorld() (game.js). Without this check, that frame used to be
// drawn as a plain square around every dropped/held item regardless of
// what's inside it, so a transparent-background icon showed nothing but a
// bare dark outline floating on the tile/slot with no visible fill.
function isTransparentColor(color) {
    if (!color) return false;
    const c = color.trim().toLowerCase();
    if (c === 'transparent') return true;
    // #RGBA / #RRGGBBAA with alpha channel all zero
    const hex8 = c.match(/^#([0-9a-f]{8})$/);
    if (hex8) return hex8[1].slice(6, 8) === '00';
    const hex4 = c.match(/^#([0-9a-f]{4})$/);
    if (hex4) return hex4[1].slice(3, 4) === '0';
    // rgba(...)/hsla(...) with alpha 0
    const alphaFn = c.match(/^(?:rgba|hsla)\([^)]*,\s*0(?:\.0+)?\s*\)$/);
    if (alphaFn) return true;
    return false;
}

// TextureCheck: verifies whether a texture PNG actually exists on disk
// before letting any renderer use it as a CSS background-image. Without
// this, a missing file still gets `background-image: url(...)` applied,
// and a missing/broken background-image paints as blank/black *on top of*
// the background-color fallback instead of letting the color show through
// - so items/blocks whose PNG hasn't been dropped into assets/ yet render
// as solid black squares instead of falling back to their `color`.
//
// Usage: call TextureCheck.check(path) once per path (it caches + kicks
// off a real Image() load), then TextureCheck.isLoaded(path) synchronously
// during render. First render of a given texture may briefly show the
// color fallback while the check resolves, then re-render once loaded.
const TextureCheck = {
    _status: {}, // path -> 'loading' | 'ok' | 'missing'
    _onChangeCallbacks: [],

    check(path) {
        if (!path) return false
        const status = this._status[path]
        if (status === 'ok') return true
        if (status === 'missing') return false
        if (status === 'loading') return false

        this._status[path] = 'loading'
        const img = new Image()
        img.onload = () => {
            this._status[path] = 'ok'
            this._notifyChange()
        }
        img.onerror = () => {
            this._status[path] = 'missing'
            this._notifyChange()
        }
        img.src = path
        return false
    },

    isLoaded(path) {
        return this._status[path] === 'ok'
    },

    // Renderers register a callback to re-render once a texture finishes
    // loading (or is confirmed missing), so the UI updates itself instead
    // of staying stuck on the color fallback forever.
    onChange(cb) {
        this._onChangeCallbacks.push(cb)
    },

    _notifyChange() {
        for (const cb of this._onChangeCallbacks) cb()
    }
}

// ============================================
// Actual block/item definitions
// ============================================
// Everything from here down is DATA, not logic - this is the part you'll
// edit most often as you add content. Each key is the block/item's id;
// each value is passed straight into Registry.register() above.
//
// Common fields you'll use:
//   name             - display name shown in UI (inventory, JEI, quests)
//   type             - 'block' (placeable in the world) or 'item' (hotbar-only)
//   stackable/maxStack - see register() defaults above
//   breakTimeTicks   - how many ticks (see tick.js) it takes to mine
//   hardness         - flavor-only for now, doesn't affect mining speed
//   color            - CSS color, used as a fallback while/if `texture` is missing
//   dropId           - what item id you get when you break this block
//   overlay: true    - marks a block as an OVERLAY block (see game.js's
//                      overlay layer notes) - placed ON TOP of a ground
//                      block instead of replacing it, e.g. Workbench/Mixer
//   icon             - either a short text/emoji glyph, OR an image path
//                      (see isImagePath() in inventory.js for how the game
//                      tells the two apart)
//   texture          - world-tile image path, preferred over `icon` for
//                      rendering (see applyBlockVisual in game.js)
//   gui              - optional; see GuiBlocks in guiBlocks.js for the full
//                      format. Turns this block into an interactive station
//                      (Workbench, Mixer, or your own custom one)
//
// NOTE on textures: every block/item below has a `texture` field pointing
// at assets/<name>.png. Most of these files don't exist yet in assets/ -
// drop your own PNGs in there with matching filenames and they'll just
// start rendering (world tiles via applyBlockVisual in game.js, inventory
// icons via itemIconHTML in inventory.js - both already read `texture`).
// Until a file exists, the `color` field is used as a fallback so nothing
// renders invisible/broken in the meantime.
Registry.register({
    'IR-dirt': {
        name: 'Dirt',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 20,
        hardness: 1,
        color: '#6b8e23',
        dropId: 'IR-dirt',
        icon: '',
        texture: 'assets/textures/blocks/dirt.png'
    },
    // Plain "Stone" was removed - it was never wanted, it just existed
    // because Cobblestone's dropId pointed at an 'IR-stone' id that had no
    // Registry entry of its own (see the old comment here for the history:
    // that dangling id was actually why cobblestone couldn't be placed at
    // all - Registry.get('IR-stone') returned null, and placeBlock() in
    // tInter.js requires itemData.type === 'block' before it'll place
    // anything). Fixed the right way this time: Cobblestone now points its
    // own dropId back at itself, so breaking it drops Cobblestone, not a
    // separate "Stone" item - no second stone-ish block needed.
    'IR-cobblestone': {
        name: 'Cobblestone',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 40,
        hardness: 3,
        color: '#808080',
        dropId: 'IR-cobblestone',
        icon: '',
        texture: 'assets/textures/blocks/cobblestone.png',
        // Demo of the randomDirection feature (see rollRandomDirection()/
        // applyBlockVisual() in game.js): each time a Cobblestone block is
        // PLACED, it rolls a random facing (N/E/S/W) once and keeps it,
        // just for visual variety between tiles using the same texture -
        // purely cosmetic, doesn't affect mining/drops/behavior at all.
        // Set to false (or omit the field) on any block that should always
        // face the same way.
        randomDirection: true
    },
    'IR-plank': {
        name: 'Plank',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#a97c50',
        icon: '',
        texture: 'assets/plank.png'
    },
    'IR-oaklog': {
        name: 'Oak Log',
        type: 'block',
        stackable: true,
        maxStack: 64,
        color: '#a97c50',
        icon: '',
        texture: 'assets/oaklog.png'
    },
    'IR-workbench': {
        name: 'Workbench',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 25,
        hardness: 2,
        color: '#8a5a34',
        dropId: 'IR-workbench',
        overlay: true,
        icon: '',
        texture: 'assets/workbench.png',
        // The Workbench is just the first GUI block: `craft3x3: true` tells
        // GuiBlocks to render the existing 3x3 crafting grid (Crafting
        // system) instead of a plain custom slot layout. Any other block
        // with a `gui` object but no craft3x3 flag gets plain slots (see
        // IR-mixer below) - GuiBlocks.open() branches on this per block.
        gui: {
            title: 'Workbench',
            craft3x3: true
        }
    },
    'IR-apebble': {
        name: 'Andesite Pebble',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/pebbles/andesite_pebble.png'
    },
    'IR-cpebble': {
        name: 'Calcite Pebble',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/pebbles/calcite_pebble.png'
    },
    'IR-bpebble': {
        name: 'Basalt Pebble',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/pebbles/basalt_pebble.png'
    },
    'IR-blpebble': {
        name: 'Blackstone Pebble',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/pebbles/blackstone_pebble.png'
    },
    'IR-dpebble': {
        name: 'Deepslate Pebble',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/pebbles/deepslate_pebble.png'
    },
    // ========================================================
    // Synthetic Seed chain - new intermediate materials
    // ========================================================
    // These items exist to answer one honest question: since this world's
    // chunk generator never places a single tree, where would a sapling
    // (see IR-sapling at the bottom of this block) actually come from?
    // The answer modeled here is real biotechnology, not magic: a
    // "synthetic seed" (also called an encapsulated/artificial seed) is a
    // genuine plant-propagation technique - a lab-grown plant embryo
    // (grown from a few living cells via tissue culture, no parent seed
    // required) sealed in a nutrient-loaded capsule so it can be handled,
    // stored, and "planted" just like a real seed. Every item below is one
    // real-world ingredient of that pipeline, sourced from ordinary dirt
    // and rock (see ALT_DROP_POOL in altDrop.js) instead of being handed
    // out for free.
    'IR-humus': {
        name: 'Humus',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#3b2a1a',
        icon: '🟤',
        texture: 'assets/humus.png'
    },
    'IR-limepowder': {
        // Calcite is soft (Mohs ~3) - real agricultural lime (crushed
        // calcite/limestone, i.e. calcium carbonate) is soft enough to be
        // ground up by hand, no machinery needed. Used further down the
        // chain as the "flux" half of a soda-lime-style glass mix.
        name: 'Lime Powder',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#e8e4d0',
        icon: '⚪',
        texture: 'assets/lime_powder.png'
    },
    'IR-mineralpowder': {
        // Andesite + basalt, mechanically ground together, is essentially
        // real "volcanic rock dust" - a legitimate remineralizing
        // fertilizer used in real agriculture for its potassium,
        // magnesium and trace-element content. That's also exactly why it
        // later dissolves into a usable plant nutrient solution.
        name: 'Mineral Powder',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#7a6a52',
        icon: '🌋',
        texture: 'assets/mineral_powder.png'
    },
    'IR-silicapowder': {
        // Blackstone here stands in for a dense, glassy volcanic rock (its
        // own in-game lore already ties it to basalt) - i.e. a real source
        // of silica (SiO2), the main ingredient of ordinary glass.
        name: 'Silica Powder',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#cfd6d6',
        icon: '✦',
        texture: 'assets/silica_powder.png'
    },
    'IR-nutrientgel': {
        // Mineral Powder dissolved in water = a liquid mineral fertilizer,
        // exactly the "nutrient solution" hydroponic growers actually use
        // to feed plants without soil.
        name: 'Nutrient Gel',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#6fae5a',
        icon: '🧪',
        texture: 'assets/nutrient_gel.png'
    },
    'IR-callusculture': {
        // "Callus" is the real botanical term for an undifferentiated mass
        // of plant cells grown in vitro on a nutrient medium (plant tissue
        // culture / micropropagation) - the living raw material real
        // synthetic-seed technology encapsulates in place of a natural
        // embryo.
        name: 'Callus Culture',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#d7e8a0',
        icon: '🧫',
        texture: 'assets/callus_culture.png'
    },
    'IR-sapling': {
        // The payoff: an encapsulated synthetic seed. Growing it into an
        // actual placeable tree/log is future content - this is
        // deliberately where the current tech tree stops.
        name: 'Oak Sapling (Synthetic Seed)',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#4c8f3d',
        icon: '🌱',
        texture: 'assets/sapling.png'
    },
    // ========================================================
    // Ash / Alkali chain - the missing third glass ingredient
    // ========================================================
    // Real soda-lime-silica glass (the ordinary glass all around you) is
    // SiO2 + Na2O + CaO, not just SiO2 + CaO - the alkali (Na2O, "soda")
    // is a FLUX: it lowers the melting point of silica from ~1700C to a
    // kiln-reachable range. Before the industrial Solvay process, soda ash
    // (Na2CO3) was made exactly like this: burn organic matter to ash,
    // leach the ash in water to dissolve the soluble alkali salts out of
    // it ("lye"), then evaporate the lye down to a dry powder. Humus is
    // the one non-mineral ingredient in this whole tree (see altDrop.js),
    // so it's fittingly the source of the one non-mineral ingredient
    // glass needs too.
    'IR-plantash': {
        name: 'Plant Ash',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#c9c4b8',
        icon: '🜂',
        texture: 'assets/plant_ash.png'
    },
    'IR-ashlye': {
        name: 'Ash Lye',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#a8a68f',
        icon: '💧',
        texture: 'assets/ash_lye.png'
    },
    'IR-sodaash': {
        name: 'Soda Ash',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#e5e5e0',
        icon: '🧂',
        texture: 'assets/soda_ash.png'
    },
    // ========================================================
    // Sterile-grade chain - real tissue-culture asepsis
    // ========================================================
    // The single most common reason a real plant tissue culture fails is
    // contamination - mold/bacterial spores riding in on unsterilized
    // glassware or media. Real labs autoclave both the empty vessels AND
    // the nutrient medium (typically ~121C/15psi/15-20min) before any
    // living tissue goes anywhere near them. Modeled here as its own
    // slower station (see IR-autoclave below) rather than folding it into
    // the Kiln, since it's a fundamentally different process (moist heat
    // + pressure + time, not open firing).
    'IR-capsule-sterile': {
        name: 'Sterile Capsule',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#ffffff00',
        icon: 'assets/capsules/capsule_shell.png',
        fluidCapacity: 1000
    },
    'IR-nutrientgel-sterile': {
        name: 'Sterile Nutrient Gel',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#8fd67a',
        icon: '🧫',
        texture: 'assets/nutrient_gel_sterile.png'
    },
    // ========================================================
    // Growth-regulator chain - inducing embryogenic competence
    // ========================================================
    // Ordinary callus (an undifferentiated mass of dividing cells) is NOT
    // automatically able to become a synthetic seed's embryo - real
    // somatic embryogenesis needs the callus deliberately pushed into an
    // "embryogenic" state, historically done by dosing the culture medium
    // with synthetic plant growth regulators (auxins like 2,4-D/NAA,
    // sometimes paired with a cytokinin). Real horticultural rooting-hormone
    // powders are typically prepared as a salt dissolved in a small amount
    // of dilute alkali (their free-acid form barely dissolves in water) -
    // which is exactly why this recipe reuses the alkaline Ash Lye from the
    // glass chain above, rather than inventing an unrelated ingredient.
    'IR-hormonesolution': {
        name: 'Growth Regulator Solution',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#c79fe0',
        icon: '🧬',
        texture: 'assets/hormone_solution.png'
    },
    'IR-embryogeniccallus': {
        name: 'Embryogenic Callus',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#eaf5c0',
        icon: '🌾',
        texture: 'assets/embryogenic_callus.png'
    },
    'IR-kiln': {
        // A Mixer can grind and mix cold powders together, but turning
        // silica + lime into actual glass needs real heat - so that step
        // gets its own station rather than happening in the Mixer.
        name: 'Kiln',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#7a3b28',
        dropId: 'IR-kiln',
        overlay: true,
        icon: '🔥',
        texture: 'assets/kiln.png',
        gui: {
            title: 'Kiln',
            slots: [
                { id: 'input1', label: 'Input 1' },
                { id: 'input2', label: 'Input 2' },
                // 3rd slot: real soda-lime-silica glass needs three oxides
                // (SiO2 + CaO + Na2O), not two - see kiln-glass-capsule below.
                { id: 'input3', label: 'Input 3' },
                { id: 'output', label: 'Output', output: true }
            ],
            progressBar: { x: 55, y: 35, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-autoclave': {
        // A sealed pressure vessel, distinct from the Kiln's open firing
        // chamber - real autoclaves sterilize with moist heat UNDER
        // PRESSURE (~121C/15psi), not just open flame, which is why this
        // is its own station instead of another Kiln recipe.
        name: 'Autoclave',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 35,
        hardness: 3,
        color: '#3f5568',
        dropId: 'IR-autoclave',
        overlay: true,
        icon: '⏚',
        texture: 'assets/autoclave.png',
        gui: {
            title: 'Autoclave',
            slots: [
                { id: 'input1', label: 'Input 1' },
                { id: 'input2', label: 'Input 2' },
                { id: 'output', label: 'Output', output: true }
            ],
            progressBar: { x: 55, y: 35, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-bioreactor': {
        // Where biology, not mineral chemistry, happens - a temperature/
        // humidity-controlled vessel for the actual culturing step
        // (inducing embryogenic competence), separate from the Mixer's
        // purely mechanical grinding and the Kiln/Autoclave's heat-driven
        // processes.
        name: 'Bioreactor',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 35,
        hardness: 2,
        color: '#2f6b4f',
        dropId: 'IR-bioreactor',
        overlay: true,
        icon: '🧪',
        texture: 'assets/bioreactor.png',
        gui: {
            title: 'Bioreactor',
            slots: [
                { id: 'input1', label: 'Input 1' },
                { id: 'input2', label: 'Input 2' },
                { id: 'output', label: 'Output', output: true }
            ],
            progressBar: { x: 55, y: 35, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-mixer': {
        name: 'Mixer',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#556b8a',
        dropId: 'IR-mixer',
        overlay: true,
        icon: '',
        texture: 'assets/mixer.png',
        // ---- GUI block config (see GuiBlockRegistry in crafting.js) ----
        // Any block can opt into having its own slot-based GUI just by
        // adding a `gui` object like this one. `slots` defines the custom
        // slot layout (on top of the player's own inventory/hotbar, which
        // every GUI block gets automatically); `guiTexture` is an optional
        // background image for just the custom-slots frame, not the
        // whole inventory panel.
        gui: {
            title: 'Mixer',
            guiTexture: 'assets/mixer_gui.png',
            // Example of coordinate-positioned slots + a progress bar (see
            // the format notes at the top of guiBlocks.js) - handy once
            // guiTexture points at real art and slots need to line up with
            // it pixel-for-pixel instead of auto-flowing. Swap x/y here to
            // taste; drop the x/y fields entirely to go back to the
            // default auto-flow layout.
            slots: [
                { id: 'input1', label: 'Input 1', x: 20, y: 10 },
                { id: 'input2', label: 'Input 2', x: 20, y: 60 },
                { id: 'output', label: 'Output', output: true, x: 110, y: 35 }
            ],
            progressBar: { x: 68, y: 38, width: 32, height: 8, direction: 'right' }
        }
    },
})

// ============================================
// GUI Block Recipes
// ============================================
// Recipes for blocks that process items automatically from their `input*`
// slots into their `output` slot (see GuiBlockRegistry.processRecipes() in
// guiBlocks.js). Unlike CraftingRegistry above (player-triggered, shaped
// grids), these are shapeless-by-slot and run every tick on their own.
const GuiBlockRecipeRegistry = {
    recipes: [
        {
            // orderMatters: false -> shapeless-by-slot recipe. `ingredients`
            // is a flat array (id + count), same shape as a shapeless
            // CraftingRegistry recipe - it doesn't matter which input slot
            // holds the andesite pebble and which holds the basalt pebble;
            // canProcessShapeless() only checks that all the block's
            // (non-output) input slots TOGETHER contain enough of each
            // required item.
            //
            // Andesite + basalt, mechanically crushed together, models
            // real "volcanic rock dust" fertilizer/remineralizer (see
            // IR-mineralpowder in registry.js) - a genuine agricultural
            // product, not an arbitrary conversion.
            id: 'mixer-mineral-powder',
            block: 'IR-mixer',
            orderMatters: false,
            ingredients: [
                { id: 'IR-apebble', count: 1 },
                { id: 'IR-bpebble', count: 1 }
            ],
            result: { id: 'IR-mineralpowder', count: 2 },
            ticks: 40 // how long one processing cycle takes
        },
        {
            // Blackstone alone, ground down, yields silica powder (see the
            // IR-silicapowder note above) - purposely a worse yield (2 in,
            // 1 out) than the mineral-powder recipe, modeling the real
            // inefficiency of purifying one specific mineral out of a bulk
            // rock instead of just bulk-grinding it.
            id: 'mixer-silica-powder',
            block: 'IR-mixer',
            orderMatters: false,
            ingredients: [
                { id: 'IR-blpebble', count: 2 }
            ],
            result: { id: 'IR-silicapowder', count: 1 },
            ticks: 40
        },
        {
            // The Mixer doubling as a simple incubator: humus (a source of
            // living organic material - see ALT_DROP_POOL in altDrop.js)
            // cultured together with a nutrient gel produces a callus
            // culture - real plant-tissue-culture terminology for a mass
            // of lab-grown, undifferentiated plant cells. Takes noticeably
            // longer than a mechanical grind (120 ticks vs 40) since this
            // is modeling biological growth, not crushing rock.
            id: 'mixer-callus-culture',
            block: 'IR-mixer',
            orderMatters: false,
            ingredients: [
                { id: 'IR-humus', count: 1 },
                { id: 'IR-nutrientgel', count: 1 }
            ],
            result: { id: 'IR-callusculture', count: 1 },
            ticks: 120
        },
        {
            // Real horticultural rooting-hormone/auxin powders (NAA, IBA,
            // 2,4-D) are almost insoluble in plain water as their free
            // acid - growers dissolve them as a salt in a small amount of
            // dilute alkali first. Ash Lye is exactly that alkaline
            // solution already sitting in this tree's glass-making chain,
            // so it doubles as the solvent here; Mineral Powder supplies
            // the trace elements (boron, zinc, manganese) real auxin/
            // cytokinin formulations are typically co-dosed with.
            id: 'mixer-hormone-solution',
            block: 'IR-mixer',
            orderMatters: false,
            ingredients: [
                { id: 'IR-ashlye', count: 1 },
                { id: 'IR-mineralpowder', count: 1 }
            ],
            result: { id: 'IR-hormonesolution', count: 1 },
            ticks: 70
        },
        {
            // Kiln: silica + lime + soda ash, FIRED (not just mixed cold),
            // is the real recipe for soda-lime-SILICA glass (SiO2+CaO+Na2O)
            // - ordinary window/bottle glass, not the simplified SiO2+CaO
            // version this recipe used to be. The soda (alkali) is a flux:
            // it drags silica's melting point down from ~1700C into a
            // kiln-reachable range, same real reason historical glassmakers
            // always added ash/alkali rather than firing pure sand. Listed
            // FIRST among the Kiln's recipes (see the file-matching note on
            // Crafting.findMatch above) since it's the most specific/
            // ingredient-hungry one - the single-ingredient ash recipes
            // below shouldn't accidentally "steal" a tick of progress from
            // this one if all the inputs happen to be sitting in the Kiln
            // at once.
            id: 'kiln-glass-capsule',
            block: 'IR-kiln',
            orderMatters: false,
            ingredients: [
                { id: 'IR-silicapowder', count: 1 },
                { id: 'IR-limepowder', count: 1 },
                { id: 'IR-sodaash', count: 1 }
            ],
            result: { id: 'IR-capsule-1000', count: 2 },
            ticks: 110
        },
        {
            // Roasting humus down to ash - real ash yield from organic
            // matter is a small fraction of the starting mass (most of it
            // leaves as CO2/water vapor), which is why this is a strict
            // 1-for-1 rather than a multiplier: humus is already the
            // rarest drop in the game (see ALT_DROP_POOL, weight 1 vs 4
            // for every pebble), so this recipe is the real bottleneck of
            // the whole glass chain, not the mineral powders.
            id: 'kiln-plant-ash',
            block: 'IR-kiln',
            orderMatters: false,
            ingredients: [
                { id: 'IR-humus', count: 1 }
            ],
            result: { id: 'IR-plantash', count: 1 },
            ticks: 80
        },
        {
            // Evaporating the leached lye (see ash-lye-from-dirt in
            // CraftingRegistry below) back down to a dry alkali powder -
            // the second half of the historical "leach then boil dry"
            // potash/soda-ash process, mirrored here as its own firing
            // step rather than folded into the leaching step itself.
            id: 'kiln-soda-ash',
            block: 'IR-kiln',
            orderMatters: false,
            ingredients: [
                { id: 'IR-ashlye', count: 1 }
            ],
            result: { id: 'IR-sodaash', count: 1 },
            ticks: 60
        },
        // ---- Autoclave recipes: moist heat + pressure sterilization ----
        {
            // Sterilizing the empty glass vessel itself, BEFORE anything
            // living or nutrient-rich goes into it - real lab practice
            // never assumes "just fired in a kiln" counts as sterile,
            // since ambient mold/bacterial spores can resettle on
            // glassware after it cools.
            id: 'autoclave-sterile-capsule',
            block: 'IR-autoclave',
            orderMatters: false,
            ingredients: [
                { id: 'IR-capsule-1000', count: 1 }
            ],
            result: { id: 'IR-capsule-sterile', count: 1 },
            ticks: 90
        },
        {
            // Real plant-tissue-culture media is autoclaved in its own
            // right (typically ~121C/15psi/15-20 min) to kill off any
            // mold/bacterial spores before a living culture ever touches
            // it - by far the single most common reason a real tissue
            // culture attempt fails is skipping exactly this step. Takes
            // noticeably longer than firing glass (150 vs 110 ticks) to
            // reflect that real autoclave cycles run long on purpose.
            id: 'autoclave-sterile-gel',
            block: 'IR-autoclave',
            orderMatters: false,
            ingredients: [
                { id: 'IR-nutrientgel', count: 1 }
            ],
            result: { id: 'IR-nutrientgel-sterile', count: 1 },
            ticks: 150
        },
        // ---- Bioreactor recipe: inducing embryogenic competence ----
        {
            // The step that actually turns "a blob of dividing cells"
            // into "something that can become a synthetic seed's embryo":
            // real somatic embryogenesis requires deliberately dosing an
            // existing callus culture with growth regulators and letting
            // it recondition (real protocols run for weeks; 180 ticks is
            // this tree's longest single process, reflecting that this is
            // the slowest, most biologically delicate step in the whole
            // chain).
            id: 'bioreactor-embryogenic-callus',
            block: 'IR-bioreactor',
            orderMatters: false,
            ingredients: [
                { id: 'IR-callusculture', count: 1 },
                { id: 'IR-hormonesolution', count: 1 }
            ],
            result: { id: 'IR-embryogeniccallus', count: 1 },
            ticks: 180
        }
    ]
}

// ============================================
// Crafting Recipes
// ============================================
// Three recipe kinds, all resolved by Crafting.match() in inventory.js:
//   - "shapeless" : an unordered bag of ingredients (counts matter, position doesn't)
//   - "shaped2x2" : a fixed pattern that must line up in a 2x2 grid (usable
//                   anywhere - the player's inventory always has a 2x2 grid)
//   - "shaped3x3" : a fixed pattern in a 3x3 grid - only available at a
//                   Workbench
// Shaped patterns use a grid of item ids (or null for an empty cell) sized
// to their own recipe (1x1 up to their max), which is then matched against
// every possible offset/position within the crafting grid.
const CraftingRegistry = {
    // ========================================================
    // NOTE on IR-plank / IR-oaklog
    // ========================================================
    // Neither has a recipe right now, on purpose. There is no tree
    // anywhere in this world's chunk generator (see game.js), so wood
    // simply doesn't exist yet to be crafted FROM - the whole point of the
    // chain below is to earn a real IR-sapling item honestly (see the
    // "Synthetic Seed chain" block up in Registry.register()) instead of
    // conjuring logs/planks out of nowhere via a cheat. Once planting +
    // growing a sapling into an actual tree is implemented, Plank/Oak Log
    // recipes belong THERE (chopping down a grown tree), not here.
    recipes: [
        // ---- Tier 0: stone tools, no station required ----
        {
            // A workbench doesn't need to be made of wood - a flat slab of
            // fitted stone works fine as a worktable, and it means the
            // very first station doesn't secretly depend on the wood this
            // whole tree is trying to bootstrap.
            id: 'workbench-from-cobblestone',
            type: 'shaped2x2',
            width: 2,
            pattern: ['IR-cobblestone', 'IR-cobblestone', 'IR-cobblestone', 'IR-cobblestone'],
            result: { id: 'IR-workbench', count: 1 }
        },
        {
            // A simple hand-crank mixer/quern: a cobblestone housing around
            // one hard grinding stone. Deepslate is denser/harder than
            // regular stone (real millstones are historically made from
            // unusually hard, abrasive rock), which is why it's the
            // grinding element here rather than more cobblestone.
            id: 'mixer-from-cobblestone-deepslate',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-cobblestone', count: 2 },
                { id: 'IR-dpebble', count: 1 }
            ],
            result: { id: 'IR-mixer', count: 1 }
        },
        {
            // Calcite is soft enough (Mohs ~3) to crush by hand into
            // agricultural lime - no machinery needed, unlike the harder
            // volcanic rocks processed in the Mixer.
            id: 'lime-powder-from-calcite',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-cpebble', count: 1 }
            ],
            result: { id: 'IR-limepowder', count: 2 }
        },
        {
            // Extracting groundwater trapped between soil grains - the
            // same basic principle a well works on. Needs an empty vessel
            // (the glass capsule) to actually hold the water in.
            id: 'capsule-water-from-dirt',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-capsule-1000', count: 1 },
                { id: 'IR-dirt', count: 2 }
            ],
            result: { id: 'IR-capsule-1000-water', count: 1 }
        },
        {
            // A simple percolation rig: a glass capsule for tubing, a
            // stone housing, and a bit of mineral powder as the filter
            // medium the water leaches through.
            id: 'fluid-extractor-from-parts',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-capsule-1000', count: 1 },
                { id: 'IR-cobblestone', count: 2 },
                { id: 'IR-mineralpowder', count: 1 }
            ],
            result: { id: 'IR-fluid-extractor', count: 1 }
        },
        {
            // Historical potash/soda-ash making: pack the ash into damp
            // ground and let groundwater percolate through it, dissolving
            // the soluble alkali salts out - same "water trapped between
            // soil grains does the extracting" logic as capsule-water-
            // from-dirt above, just leaching ash instead of plain dirt.
            // Deliberately no station and no capsule required: this has
            // to work with nothing but a Kiln on hand, since the whole
            // point is bootstrapping the alkali that glassmaking (and
            // therefore every capsule in the game) depends on.
            id: 'ash-lye-from-dirt',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-plantash', count: 1 },
                { id: 'IR-dirt', count: 2 }
            ],
            result: { id: 'IR-ashlye', count: 1 }
        },
        {
            // A sealed pressure chamber, built the same "hand-assembled
            // from parts" way as the Mixer/Extractor rather than a 3x3
            // structure: 4 capsules stand in for observation/relief ports,
            // silica powder for a heat-resistant gasket seal.
            id: 'autoclave-from-parts',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-capsule-1000', count: 4 },
                { id: 'IR-cobblestone', count: 4 },
                { id: 'IR-silicapowder', count: 1 }
            ],
            result: { id: 'IR-autoclave', count: 1 }
        },
        {
            // Needs sterile-grade glass on hand before it can be built at
            // all - a deliberate gate ensuring the Autoclave exists first.
            id: 'bioreactor-from-parts',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-capsule-sterile', count: 2 },
                { id: 'IR-cobblestone', count: 2 },
                { id: 'IR-mineralpowder', count: 1 }
            ],
            result: { id: 'IR-bioreactor', count: 1 }
        },

        // ---- Tier 1: needs the Workbench's 3x3 grid ----
        {
            // The classic ring-of-stone furnace/kiln shape - 8 cobblestone
            // around a hollow firing chamber. Deliberately needs the full
            // 3x3 grid (a Kiln is a bigger, more deliberate build than the
            // Workbench or Mixer), so this is the one recipe in the tree
            // that genuinely requires the Workbench to exist first.
            id: 'kiln-from-cobblestone-ring',
            type: 'shaped3x3',
            width: 3,
            pattern: [
                'IR-cobblestone', 'IR-cobblestone', 'IR-cobblestone',
                'IR-cobblestone', null, 'IR-cobblestone',
                'IR-cobblestone', 'IR-cobblestone', 'IR-cobblestone'
            ],
            result: { id: 'IR-kiln', count: 1 }
        },
        {
            // Final assembly of the synthetic seed: a STERILE glass
            // capsule (the protective shell), STERILE nutrient gel (the
            // food store), and an EMBRYOGENIC callus (the living embryo,
            // not just any callus - see bioreactor-embryogenic-callus)
            // laid out left-to-right. Trimmed shape is 3 wide x 1 tall,
            // which can never fit the 2-wide inventory grid - this recipe
            // can only ever be completed at the Workbench, fittingly,
            // since it's the capstone of the whole tree. Every ingredient
            // here is itself the end of its own multi-step sub-chain
            // (glass chemistry + asepsis, or mineral/biological culturing)
            // - this single line is where all of them finally meet.
            id: 'sapling-assembly',
            type: 'shaped3x3',
            width: 3,
            pattern: [
                'IR-capsule-sterile', 'IR-nutrientgel-sterile', 'IR-embryogeniccallus',
                null, null, null,
                null, null, null
            ],
            result: { id: 'IR-sapling', count: 1 }
        }
    ]
}