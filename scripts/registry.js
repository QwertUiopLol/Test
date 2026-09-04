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
        breakTimeTicks: 30,  // Increased from 20 (1.5s) - basic but not instant
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
        breakTimeTicks: 60,  // Increased from 40 (3s) - proper stone difficulty
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
        breakTimeTicks: 40,  // Increased from 25 (2s) - crafting station takes time to break
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
    // ========================================================
    // METALLURGY EXPANSION - Iron Age to Steel Age
    // ========================================================
    // This entire section implements realistic metallurgical progression
    // from primitive iron smelting (bloomery) through refined steel production.
    // Every process is based on real historical methods and chemistry.
    // 
    // Key scientific concepts implemented:
    // - Solid-state reduction (bloomery, 1150-1250°C)
    // - Carburization and decarburization
    // - Slag formation and flux chemistry
    // - Carbon content control (wrought iron <0.08% C, steel 0.2-2.1% C)
    // - Temperature-dependent phase transitions
    // ========================================================
    
    // ---- IRON ORES ----
    'IR-bogironore': {
        // Bog iron ore: hydrated iron oxide (mostly goethite, FeO(OH)) formed
        // in peat bogs by iron-oxidizing bacteria. Historically the FIRST iron
        // source used by many cultures (Vikings, early Celts) because it's
        // found at the surface, no mining needed. Low grade (~30-40% Fe) but
        // easy to access and naturally pre-concentrated.
        name: 'Bog Iron Ore',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#8b4513',
        icon: '🟤',
        texture: 'assets/bog_iron_ore.png'
    },
    'IR-hematite': {
        // Hematite (Fe₂O₃): the most important iron ore, ~70% iron content.
        // Reddish streak (literally - its name comes from Greek "haima" = blood).
        // Requires underground mining but yields the best results in smelting.
        name: 'Hematite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#8b0000',
        icon: '🔴',
        texture: 'assets/hematite.png'
    },
    'IR-magnetite': {
        // Magnetite (Fe₃O₄): magnetic iron ore, ~72% iron content (highest of
        // common ores). Black, heavy, strongly magnetic. Historically prized
        // because it could be separated from gangue using lodestone magnets.
        name: 'Magnetite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#2f2f2f',
        icon: '⚫',
        texture: 'assets/magnetite.png'
    },
    'IR-limonite': {
        // Limonite: generic term for hydrated iron oxides (mostly goethite),
        // yellowish-brown. Lower grade (~50-60% Fe) but widespread. The
        // "yellow ochre" pigment comes from limonite.
        name: 'Limonite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#cd853f',
        icon: '🟠',
        texture: 'assets/limonite.png'
    },
    'IR-ironore': {
        // Generic high-grade iron ore (mixed hematite/magnetite deposit).
        // ~65% Fe, the standard "good ore" for serious smelting operations.
        name: 'Iron Ore',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#696969',
        icon: '🌑',
        texture: 'assets/iron_ore.png'
    },
    
    // ---- CRUSHED ORES (after quern-stone processing) ----
    'IR-crushedbogiron': {
        // Bog iron ore, crushed to sand/gravel size. Increases surface area
        // for more efficient reduction in the bloomery. Real crushed ore is
        // about 2-5mm particle size for optimal smelting.
        name: 'Crushed Bog Iron',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#a0522d',
        icon: '⬤',
        texture: 'assets/crushed_bog_iron.png'
    },
    'IR-crushedhematite': {
        name: 'Crushed Hematite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#a52a2a',
        icon: '⬤',
        texture: 'assets/crushed_hematite.png'
    },
    'IR-crushedmagnetite': {
        name: 'Crushed Magnetite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#3c3c3c',
        icon: '⬤',
        texture: 'assets/crushed_magnetite.png'
    },
    'IR-crushedlimonite': {
        name: 'Crushed Limonite',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#daa520',
        icon: '⬤',
        texture: 'assets/crushed_limonite.png'
    },
    'IR-crushedironore': {
        name: 'Crushed Iron Ore',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#808080',
        icon: '⬤',
        texture: 'assets/crushed_iron_ore.png'
    },
    
    // ---- WASHED/CONCENTRATED ORES (after sluice box processing) ----
    'IR-concentratebogiron': {
        // Bog iron concentrate: washed to remove clay/sand impurities.
        // Gravity separation in a sluice box exploits iron ore's higher
        // specific gravity (~5.0) vs quartz sand (~2.65). Yields ~50% Fe.
        name: 'Bog Iron Concentrate',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#cd661d',
        icon: '◼',
        texture: 'assets/bog_iron_concentrate.png'
    },
    'IR-concentratehematite': {
        // Hematite concentrate: high-grade feed for bloomery (~65% Fe).
        // Washing removes silica and alumina gangue minerals.
        name: 'Hematite Concentrate',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#dc143c',
        icon: '◼',
        texture: 'assets/hematite_concentrate.png'
    },
    'IR-concentratemagnetite': {
        // Magnetite concentrate: highest grade (~70% Fe), often magnetic
        // separation is used historically (lodestones) before washing.
        name: 'Magnetite Concentrate',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#1c1c1c',
        icon: '◼',
        texture: 'assets/magnetite_concentrate.png'
    },
    'IR-concentratelimonite': {
        name: 'Limonite Concentrate',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#b8860b',
        icon: '◼',
        texture: 'assets/limonite_concentrate.png'
    },
    'IR-concentrateironore': {
        name: 'Iron Ore Concentrate',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#696969',
        icon: '◼',
        texture: 'assets/iron_ore_concentrate.png'
    },
    
    // ---- FLUXES ----
    'IR-limestone': {
        // Limestone (CaCO₃): calcium carbonate, the primary flux for iron
        // smelting. Reacts with silica gangue to form slag (CaSiO₃), which
        // melts and floats on top of the iron, protecting it from re-oxidation
        // and allowing easy separation. Essential for any serious metallurgy.
        name: 'Limestone',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#d3d3d3',
        icon: '⬜',
        texture: 'assets/limestone.png'
    },
    'IR-crushedlimestone': {
        // Crushed limestone: must be broken small (~1-2cm) for proper flux
        // action. Large pieces won't fully react; too fine and they clog
        // the furnace burden. Historical bloomeries used hand-broken fist-sized
        // chunks, later crushed smaller.
        name: 'Crushed Limestone',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#e8e8e8',
        icon: '⬤',
        texture: 'assets/crushed_limestone.png'
    },
    'IR-quicklime': {
        // Quicklime (CaO): produced by calcining limestone at 900-1000°C.
        // CaCO₃ → CaO + CO₂. More reactive than raw limestone, forms slag
        // more readily. Historically used in advanced bloomeries and finery
        // forges. Also used for mortar, soil treatment.
        name: 'Quicklime',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#f5f5f5',
        icon: '⚪',
        texture: 'assets/quicklime.png'
    },
    'IR-slag': {
        // Iron silicate slag (primarily CaSiO₃): the waste product of smelting.
        // In reality, slag is a complex mix of calcium silicate, alumina,
        // magnesia, and dissolved iron oxides. Proper slag has a glassy
        // appearance and should be dark green/black. Too much iron in slag
        // (= poor smelt) makes it brownish/red. Can be re-smelted to recover
        // trapped iron prills.
        name: 'Slag',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#2f4f4f',
        icon: '🗿',
        texture: 'assets/slag.png'
    },
    'IR-richslag': {
        // Iron-rich slag: failed or inefficient smelt result. Contains
        // excessive FeO (up to 20-30% iron lost to slag). Brownish/reddish
        // color indicates poor flux ratio or insufficient temperature.
        // Must be re-smelted with fresh ore and proper flux to recover iron.
        name: 'Iron-Rich Slag',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#8b4513',
        icon: '🗿',
        texture: 'assets/rich_slag.png'
    },
    
    // ---- FUELS ----
    'IR-charcoal': {
        // Charcoal: wood pyrolyzed at 400-500°C in low-oxygen conditions.
        // Nearly pure carbon (~75-90% C), burns hotter and cleaner than wood.
        // ESSENTIAL for bloomery smelting - wood smoke contaminates iron with
        // sulfur/phosphorus. Historical charcoal production took weeks in
        // charcoal pits/clamps. Yield: ~20-25% by weight from dry wood.
        name: 'Charcoal',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#1c1c1c',
        icon: '⚫',
        texture: 'assets/charcoal.png'
    },
    'IR-coal': {
        // Bituminous coal: fossilized plant matter, ~75-85% carbon. Burns
        // hot but contains sulfur and volatile compounds that contaminate
        // iron (making it brittle). CANNOT be used directly in bloomery -
        // must be converted to coke first. Historically, coal was avoided
        // for iron until coke was invented (1709, Abraham Darby).
        name: 'Bituminous Coal',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#2f2f2f',
        icon: '🌑',
        texture: 'assets/coal.png'
    },
    'IR-coke': {
        // Coke: coal heated to 1000-1100°C without air (destructive distillation).
        // Drives off volatiles (tar, ammonia, sulfur compounds), leaving ~90-95%
        // pure carbon porous structure. Burns very hot, essential for cupola
        // furnaces and early blast furnaces. Invented specifically to solve
        // coal's contamination problems for iron smelting.
        name: 'Coke',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#1a1a1a',
        icon: '⬛',
        texture: 'assets/coke.png'
    },
    
    // ---- INTERMEDIATE PRODUCTS ----
    'IR-spongeiron': {
        // Sponge iron (direct reduced iron, DRI): product of solid-state
        // reduction in bloomery. Porous metallic iron mixed with unreduced
        // oxides and slag inclusions. Result of Fe₂O₃ + 3CO → 2Fe + 3CO₂.
        // Still contains significant oxygen; must be consolidated by forging.
        // Name comes from its spongy, vesicular appearance when fractured.
        name: 'Sponge Iron',
        type: 'item',
        stackable: true,
        maxStack: 16,
        color: '#a8a8a8',
        icon: '🧽',
        texture: 'assets/sponge_iron.png'
    },
    'IR-bloom': {
        // Iron bloom: the consolidated mass from a bloomery smelt. A mixture
        // of metallic iron particles, slag, and some unreduced ore. Typically
        // 1-5 kg for small bloomeries, up to 20+ kg for large ones. Carbon
        // content varies wildly (0.02-1.5% C) depending on smelt conditions.
        // Must be reheated and hammered (shingled) to expel slag and consolidate.
        name: 'Iron Bloom',
        type: 'item',
        stackable: false,
        maxStack: 1,
        color: '#c0c0c0',
        icon: '🔩',
        texture: 'assets/iron_bloom.png'
    },
    'IR-pigiron': {
        // Pig iron: high-carbon iron (~3.5-4.5% C) from melting cast iron.
        // Named for traditional sand casting molds arranged like piglets
        // suckling from a sow. Very brittle, cannot be forged, but excellent
        // for casting. Must be refined (decarburized) in finery forge to make
        // wrought iron or steel. Melting point ~1150-1200°C (lower than pure
        // iron due to high carbon).
        name: 'Pig Iron',
        type: 'item',
        stackable: true,
        maxStack: 16,
        color: '#4a4a4a',
        icon: '🐖',
        texture: 'assets/pig_iron.png'
    },
    'IR-steelbloom': {
        // Steel bloom: bloom with controlled carbon content (0.2-2.1% C).
        // Achieved through careful carburization (adding carbon) or
        // decarburization (removing carbon) during smelting/forging.
        // Higher carbon = harder but more brittle. This is the "sweet spot"
        // bloom for tool/weapon steel.
        name: 'Steel Bloom',
        type: 'item',
        stackable: false,
        maxStack: 1,
        color: '#b8b8d0',
        icon: '⭐',
        texture: 'assets/steel_bloom.png'
    },
    
    // ---- FINAL PRODUCTS (INGOTS) ----
    'IR-wroughtironingot': {
        // Wrought iron ingot: nearly pure iron (<0.08% C) with fibrous slag
        // inclusions. Malleable, ductile, corrosion-resistant. Cannot be
        // hardened by heat treatment (too little carbon). Used for nails,
        // chains, decorative work, structural elements. Historically the
        // most common form of worked iron until cheap steel (Bessemer, 1856).
        name: 'Wrought Iron Ingot',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#d4d4d4',
        icon: '▭',
        texture: 'assets/wrought_iron_ingot.png'
    },
    'IR-mildsteelingot': {
        // Mild steel ingot (0.08-0.3% C): general-purpose steel. Good balance
        // of strength and ductility. Can be case-hardened (surface carburized)
        // for wear resistance. Used for structural beams, wire, sheet metal,
        // general forgings. Most common modern steel type.
        name: 'Mild Steel Ingot',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#c8c8d8',
        icon: '▭',
        texture: 'assets/mild_steel_ingot.png'
    },
    'IR-mediumsteelingot': {
        // Medium carbon steel ingot (0.3-0.6% C): stronger than mild steel,
        // can be heat treated (quenched and tempered) for hardness. Used for
        // axles, gears, crankshafts, hammers, chisels. The "tool steel" tier
        // for most applications.
        name: 'Medium Steel Ingot',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#b8b8c8',
        icon: '▭',
        texture: 'assets/medium_steel_ingot.png'
    },
    'IR-highcarbonsteelingot': {
        // High carbon steel ingot (0.6-1.5% C): very hard when heat treated,
        // but brittle if not properly tempered. Used for cutting tools,
        // knives, saw blades, springs. File steel is typically ~1.0-1.2% C.
        // Damascus steel patterns come from layering different carbon steels.
        name: 'High Carbon Steel Ingot',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#a8a8b8',
        icon: '▭',
        texture: 'assets/high_carbon_steel_ingot.png'
    },
    'IR-castironingot': {
        // Cast iron ingot (>2.1% C, typically 3-4%): brittle, cannot be
        // forged, but excellent fluidity when molten for casting complex
        // shapes. Hard, wear-resistant, good compression strength. Used for
        // engine blocks, pans, radiators, ornamental work. Melts at ~1150°C.
        name: 'Cast Iron Ingot',
        type: 'item',
        stackable: true,
        maxStack: 64,
        color: '#3c3c3c',
        icon: '▭',
        texture: 'assets/cast_iron_ingot.png'
    },
    
    // ---- METALLURGY MACHINES/BLOCKS ----
    'IR-quernstone': {
        // Quern-stone: the oldest mechanical crushing device. Two stacked
        // stones - stationary lower "bedstone", rotating upper "runner stone".
        // Ore fed through center hole (the "eye"), crushed between stones as
        // runner turns. Essential for crushing ore to increase surface area
        // before smelting. Also grinds limestone into flux powder.
        name: 'Quern-Stone',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 40,
        hardness: 3,
        color: '#696969',
        dropId: 'IR-quernstone',
        overlay: true,
        icon: '⚙',
        texture: 'assets/quern_stone.png',
        gui: {
            title: 'Quern-Stone',
            slots: [
                { id: 'input1', label: 'Ore to Crush', x: 20, y: 35 },
                { id: 'output', label: 'Crushed Ore', output: true, x: 110, y: 35 }
            ],
            progressBar: { x: 68, y: 38, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-sluicebox': {
        // Sluice box: gravity separation device for ore concentration.
        // Water flows through a long box with riffles (obstacles) on the
        // bottom. Heavy ore particles settle behind riffles; lighter sand
        // and clay wash away. Exploits specific gravity difference: iron ore
        // ~5.0 g/cm³ vs quartz sand ~2.65 g/cm³. Historical gold miners used
        // identical原理 ("black sand" concentrates are often magnetite).
        name: 'Sluice Box',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#8b4513',
        dropId: 'IR-sluicebox',
        overlay: true,
        icon: '🌊',
        texture: 'assets/sluice_box.png',
        gui: {
            title: 'Sluice Box',
            slots: [
                { id: 'input1', label: 'Crushed Ore', x: 20, y: 20 },
                { id: 'water', label: 'Water Capsule', x: 20, y: 60 },
                { id: 'concentrate', label: 'Ore Concentrate', output: true, x: 110, y: 20 },
                { id: 'tailings', label: 'Waste Tailings', output: true, x: 110, y: 60 }
            ],
            progressBar: { x: 68, y: 38, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-bellows': {
        // Hand-cranked bellows: air pump for forcing air into furnaces.
        // Leather bag squeezed by wooden boards, with one-way valves (flaps)
        // that let air in on upstroke, force it out through nozzle on
        // downstroke. Critical for reaching bloomery temperatures (1150-1250°C).
        // Airflow rate directly controls combustion rate and peak temperature.
        // Too little air = insufficient heat; too much = over-oxidation of iron.
        name: 'Hand Bellows',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 25,
        hardness: 1,
        color: '#a0522d',
        dropId: 'IR-bellows',
        overlay: true,
        icon: '💨',
        texture: 'assets/bellows.png',
        // Bellows doesn't have input/output slots - it's a manual operation
        // block that provides airflow to adjacent furnaces. Player interacts
        // directly to pump air (separate mechanic from GUI processing).
        gui: {
            title: 'Bellows Controls',
            slots: [],
            specialUI: 'bellows_pump' // Custom UI for pumping action
        }
    },
    'IR-bloomeryfurnace': {
        // Clay bloomery furnace: the first iron-smelting technology (~1200 BCE).
        // Shaft furnace made of clay/stone, ~1-2m tall. Charged from top with
        // alternating layers of charcoal and crushed iron ore. Bellows force
        // air through tuyère (clay pipe) near bottom. Temperature 1150-1250°C
        // - hot enough to reduce Fe₂O₃ to metallic Fe, NOT hot enough to melt
        // iron (1538°C). Result is solid "bloom" of sponge iron + slag mixture.
        // Chemistry: Fe₂O₃ + 3CO → 2Fe + 3CO₂ (CO from incomplete charcoal combustion).
        name: 'Bloomery Furnace',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 50,
        hardness: 2,
        color: '#cd853f',
        dropId: 'IR-bloomeryfurnace',
        overlay: true,
        icon: '🏺',
        texture: 'assets/bloomery_furnace.png',
        gui: {
            title: 'Bloomery Furnace',
            slots: [
                { id: 'ore', label: 'Iron Ore Concentrate', x: 20, y: 15 },
                { id: 'flux', label: 'Crushed Limestone', x: 20, y: 45 },
                { id: 'fuel', label: 'Charcoal', x: 20, y: 75 },
                { id: 'bloom', label: 'Iron Bloom', output: true, x: 140, y: 25 },
                { id: 'slag', label: 'Slag', output: true, x: 140, y: 55 }
            ],
            progressBar: { x: 75, y: 40, width: 40, height: 10, direction: 'right' },
            temperatureGauge: { x: 75, y: 55, width: 40, height: 8, minTemp: 800, maxTemp: 1400 }
        }
    },
    'IR-fineryforge': {
        // Finery forge: decarburization furnace for refining pig iron into
        // wrought iron or steel. Pig iron is melted (1400-1500°C) while air
        // is blown over/through it, oxidizing carbon: C + O₂ → CO₂. Process
        // continues until desired carbon content reached. Skilled finers
        // judged carbon by spark patterns when tapping samples. Wrought iron
        // (<0.08% C) requires nearly complete decarburization; steel (0.2-2.1%)
        // stops partway. Cannot produce cast iron (that requires ADDING carbon).
        name: 'Finery Forge',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 60,
        hardness: 3,
        color: '#b22222',
        dropId: 'IR-fineryforge',
        overlay: true,
        icon: '🔥',
        texture: 'assets/finery_forge.png',
        gui: {
            title: 'Finery Forge',
            slots: [
                { id: 'pigiron', label: 'Pig Iron', x: 20, y: 15 },
                { id: 'fuel', label: 'Coke', x: 20, y: 50 },
                { id: 'product', label: 'Refined Iron/Steel', output: true, x: 140, y: 30 }
            ],
            progressBar: { x: 75, y: 35, width: 40, height: 10, direction: 'right' },
            temperatureGauge: { x: 75, y: 50, width: 40, height: 8, minTemp: 1200, maxTemp: 1700 },
            carbonMeter: { x: 75, y: 65, width: 40, height: 6, label: '%C' }
        }
    },
    'IR-cruciblefurnace': {
        // Crucible furnace: sealed ceramic vessel for melting steel.
        // Invented independently in multiple cultures (wootz steel India,
        // crucible steel Central Asia, Huntsman process England 1740s).
        // Iron + carbon source sealed in clay crucible, heated to 1600-1700°C
        // until fully molten. Carbon diffuses evenly throughout (unlike
        // solid-state cementation). Produces homogeneous high-quality steel.
        // Can also melt cast iron for casting. Crucible is single-use -
        // must be broken to retrieve metal.
        name: 'Crucible Furnace',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 50,
        hardness: 3,
        color: '#8b0000',
        dropId: 'IR-cruciblefurnace',
        overlay: true,
        icon: '🍯',
        texture: 'assets/crucible_furnace.png',
        gui: {
            title: 'Crucible Furnace',
            slots: [
                { id: 'iron', label: 'Iron/Steel Scrap', x: 15, y: 20 },
                { id: 'carbon', label: 'Carbon Source (Charcoal/Coke)', x: 15, y: 50 },
                { id: 'flux', label: 'Flux (Optional)', x: 15, y: 80 },
                { id: 'ingot', label: 'Steel Ingot', output: true, x: 140, y: 50 }
            ],
            progressBar: { x: 70, y: 45, width: 45, height: 12, direction: 'right' },
            temperatureGauge: { x: 70, y: 65, width: 45, height: 10, minTemp: 1400, maxTemp: 1800 }
        }
    },
    'IR-charcoalpit': {
        // Charcoal pit/clamp: wood pyrolysis setup. Wood stacked in pile,
        // covered with turf/charcoal dust to limit air, ignited from bottom.
        // Burns slowly (days to weeks) at 400-500°C with restricted oxygen.
        // Drives off water and volatiles (methane, methanol, acetic acid),
        // leaving nearly pure carbon. Yield: ~20-25% by weight from dry wood.
        // Skill: proper air restriction - too much air burns to ash, too
        // little extinguishes. Smoke color indicates stage (white=steam,
        // blue=volatiles burning, clear=done).
        name: 'Charcoal Pit',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 35,
        hardness: 1,
        color: '#3d2817',
        dropId: 'IR-charcoalpit',
        overlay: true,
        icon: '🪵',
        texture: 'assets/charcoal_pit.png',
        gui: {
            title: 'Charcoal Pit',
            slots: [
                { id: 'wood', label: 'Wood/Planks', x: 20, y: 30 },
                { id: 'charcoal', label: 'Charcoal', output: true, x: 110, y: 30 }
            ],
            progressBar: { x: 68, y: 35, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-cokeoven': {
        // Coke oven: destructive distillation of coal. Coal heated to
        // 1000-1100°C in absence of air (sealed chamber). Volatiles driven
        // off (coal tar, ammonia, coal gas - all useful byproducts), leaving
        // porous coke (~90-95% carbon). Essential for serious iron production
        // because raw coal's sulfur/phosphorus contaminate iron, making it
        // useless for tools/weapons. Coke was the key invention enabling
        // Industrial Revolution iron production (Abraham Darby, 1709).
        name: 'Coke Oven',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 45,
        hardness: 3,
        color: '#2f2f2f',
        dropId: 'IR-cokeoven',
        overlay: true,
        icon: '🏭',
        texture: 'assets/coke_oven.png',
        gui: {
            title: 'Coke Oven',
            slots: [
                { id: 'coal', label: 'Bituminous Coal', x: 20, y: 30 },
                { id: 'coke', label: 'Coke', output: true, x: 110, y: 30 }
            ],
            progressBar: { x: 68, y: 35, width: 32, height: 8, direction: 'right' }
        }
    },
    'IR-anvil': {
        // Heavy anvil: metalworking surface for forging. Traditionally wrought
        // iron body with hardened steel face. Used for hammering blooms to
        // expel slag (shingling), shaping hot metal, welding (forge welding
        // iron/steel at ~1200°C). Different areas serve different purposes:
        // flat face (general work), horn (curving), hardy hole (tool mounting),
        // pritchel hole (punching). Mass matters - light anvils bounce, heavy
        // anvils (100+ kg) absorb hammer energy efficiently.
        name: 'Heavy Anvil',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 60,
        hardness: 5,
        color: '#2f4f4f',
        dropId: 'IR-anvil',
        overlay: true,
        icon: '🔨',
        texture: 'assets/anvil.png',
        gui: {
            title: 'Anvil',
            slots: [
                { id: 'workpiece', label: 'Hot Metal', x: 30, y: 35 },
                { id: 'hammer', label: 'Hammer (Tool)', x: 30, y: 70 },
                { id: 'output', label: 'Forged Item', output: true, x: 130, y: 35 }
            ],
            specialUI: 'anvil_forging' // Mini-game for quality forging
        }
    },
    'IR-pyrometer': {
        // Pyrometer prototype: early temperature measurement device.
        // Pre-modern metallurgists judged temperature by color (black→red→
        // orange→yellow→white) and material behavior (lead melts 327°C,
        // copper 1085°C, iron 1538°C). This simplified version uses thermal
        // expansion of a metal rod or color-matching cards. Essential for
        // consistent heat treatment and knowing when steel is at proper
        // forging/quenching temperature. Accuracy ±25-50°C.
        name: 'Pyrometer Prototype',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#708090',
        dropId: 'IR-pyrometer',
        overlay: false, // Not placed on ground, held/used differently
        icon: '🌡',
        texture: 'assets/pyrometer.png',
        // Pyrometer is a tool, not a processing station - no GUI
        // Used by clicking on furnaces to read their temperature
        gui: null
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
        },
        // ========================================================
        // METALLURGY RECIPES - GuiBlockRecipeRegistry additions
        // ========================================================
        
        // ---- Quern-Stone recipes: ore crushing ----
        {
            // Crushing bog iron ore increases surface area for efficient
            // reduction. Real crushed ore is 2-5mm particle size.
            id: 'quern-crush-bogiron',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-bogironore', count: 1 }
            ],
            result: { id: 'IR-crushedbogiron', count: 2 },
            ticks: 40
        },
        {
            id: 'quern-crush-hematite',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-hematite', count: 1 }
            ],
            result: { id: 'IR-crushedhematite', count: 2 },
            ticks: 40
        },
        {
            id: 'quern-crush-magnetite',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-magnetite', count: 1 }
            ],
            result: { id: 'IR-crushedmagnetite', count: 2 },
            ticks: 45 // Magnetite is harder
        },
        {
            id: 'quern-crush-limonite',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-limonite', count: 1 }
            ],
            result: { id: 'IR-crushedlimonite', count: 2 },
            ticks: 35
        },
        {
            id: 'quern-crush-ironore',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-ironore', count: 1 }
            ],
            result: { id: 'IR-crushedironore', count: 2 },
            ticks: 40
        },
        {
            // Limestone must be crushed for proper flux action in bloomery
            id: 'quern-crush-limestone',
            block: 'IR-quernstone',
            orderMatters: false,
            ingredients: [
                { id: 'IR-limestone', count: 1 }
            ],
            result: { id: 'IR-crushedlimestone', count: 2 },
            ticks: 30
        },
        
        // ---- Sluice Box recipes: ore concentration ----
        {
            // Washing crushed bog iron removes clay/sand impurities
            // Specific gravity: iron ore ~5.0, quartz sand ~2.65
            id: 'sluice-wash-bogiron',
            block: 'IR-sluicebox',
            orderMatters: false,
            ingredients: [
                { id: 'IR-crushedbogiron', count: 2 },
                { id: 'IR-capsule-1000-water', count: 1 }
            ],
            result: { id: 'IR-concentratebogiron', count: 1 },
            ticks: 50
        },
        {
            id: 'sluice-wash-hematite',
            block: 'IR-sluicebox',
            orderMatters: false,
            ingredients: [
                { id: 'IR-crushedhematite', count: 2 },
                { id: 'IR-capsule-1000-water', count: 1 }
            ],
            result: { id: 'IR-concentratehematite', count: 1 },
            ticks: 50
        },
        {
            id: 'sluice-wash-magnetite',
            block: 'IR-sluicebox',
            orderMatters: false,
            ingredients: [
                { id: 'IR-crushedmagnetite', count: 2 },
                { id: 'IR-capsule-1000-water', count: 1 }
            ],
            result: { id: 'IR-concentratemagnetite', count: 1 },
            ticks: 50
        },
        {
            id: 'sluice-wash-limonite',
            block: 'IR-sluicebox',
            orderMatters: false,
            ingredients: [
                { id: 'IR-crushedlimonite', count: 2 },
                { id: 'IR-capsule-1000-water', count: 1 }
            ],
            result: { id: 'IR-concentratelimonite', count: 1 },
            ticks: 50
        },
        {
            id: 'sluice-wash-ironore',
            block: 'IR-sluicebox',
            orderMatters: false,
            ingredients: [
                { id: 'IR-crushedironore', count: 2 },
                { id: 'IR-capsule-1000-water', count: 1 }
            ],
            result: { id: 'IR-concentrateironore', count: 1 },
            ticks: 50
        },
        
        // ---- Charcoal Pit recipes: fuel production ----
        {
            // Wood pyrolysis at 400-500°C, low oxygen
            // Yield: ~20-25% by weight from dry wood
            // Takes multiple planks to produce one charcoal
            id: 'charcoalpit-wood-to-charcoal',
            block: 'IR-charcoalpit',
            orderMatters: false,
            ingredients: [
                { id: 'IR-plank', count: 4 }
            ],
            result: { id: 'IR-charcoal', count: 1 },
            ticks: 120
        },
        
        // ---- Coke Oven recipes: coal processing ----
        {
            // Coal heated to 1000-1100°C without air
            // Drives off volatiles (tar, ammonia, sulfur)
            // Yield: ~70-75% by weight
            id: 'cokeoven-coal-to-coke',
            block: 'IR-cokeoven',
            orderMatters: false,
            ingredients: [
                { id: 'IR-coal', count: 2 }
            ],
            result: { id: 'IR-coke', count: 1 },
            ticks: 100
        },
        
        // ---- Bloomery Furnace recipes: iron smelting ----
        {
            // Bloomery smelting: solid-state reduction at 1150-1250°C
            // Chemistry: Fe₂O₃ + 3CO → 2Fe + 3CO₂
            // Requires concentrated ore, flux (limestone), and charcoal fuel
            // Produces iron bloom (sponge iron + slag mixture) and waste slag
            // Temperature MUST stay below iron melting point (1538°C)
            id: 'bloomery-smelt-hematite',
            block: 'IR-bloomeryfurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-concentratehematite', count: 4 },
                { id: 'IR-crushedlimestone', count: 2 },
                { id: 'IR-charcoal', count: 6 }
            ],
            result: { id: 'IR-bloom', count: 1 },
            ticks: 300,
            byproduct: { id: 'IR-slag', count: 2 },
            minTemp: 1150,
            maxTemp: 1250
        },
        {
            id: 'bloomery-smelt-magnetite',
            block: 'IR-bloomeryfurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-concentratemagnetite', count: 4 },
                { id: 'IR-crushedlimestone', count: 2 },
                { id: 'IR-charcoal', count: 6 }
            ],
            result: { id: 'IR-bloom', count: 1 },
            ticks: 300,
            byproduct: { id: 'IR-slag', count: 2 },
            minTemp: 1150,
            maxTemp: 1250
        },
        {
            // Bog iron is lower grade, produces more slag
            id: 'bloomery-smelt-bogiron',
            block: 'IR-bloomeryfurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-concentratebogiron', count: 6 },
                { id: 'IR-crushedlimestone', count: 3 },
                { id: 'IR-charcoal', count: 8 }
            ],
            result: { id: 'IR-bloom', count: 1 },
            ticks: 350,
            byproduct: { id: 'IR-richslag', count: 3 },
            minTemp: 1150,
            maxTemp: 1250
        },
        
        // ---- Kiln recipe: limestone calcination ----
        {
            // Calcining limestone at 900-1000°C drives off CO₂
            // CaCO₃ → CaO + CO₂
            // Quicklime is more reactive flux than raw limestone
            id: 'kiln-calcine-limestone',
            block: 'IR-kiln',
            orderMatters: false,
            ingredients: [
                { id: 'IR-limestone', count: 2 }
            ],
            result: { id: 'IR-quicklime', count: 2 },
            ticks: 100
        },
        
        // ---- Finery Forge recipes: pig iron refining ----
        {
            // Finery forge: decarburizes pig iron at 1250-1350°C
            // Chemistry: Fe3C + O2 → 3Fe + CO2 (carbon oxidation)
            // Converts brittle pig iron (~4% C) to malleable wrought iron (<0.08% C)
            id: 'finery-refine-pigiron',
            block: 'IR-fineryforge',
            orderMatters: false,
            ingredients: [
                { id: 'IR-pigiron', count: 3 },
                { id: 'IR-coke', count: 4 }
            ],
            result: { id: 'IR-wroughtironingot', count: 2 },
            byproduct: { id: 'IR-slag', count: 1 },
            ticks: 400,
            minTemp: 1250,
            maxTemp: 1350
        },
        
        // ---- Crucible Furnace recipes: steel production ----
        {
            // Crucible steelmaking: melts wrought iron with carbon source
            // Sealed crucible prevents oxidation, allows precise carbon control
            // Produces homogeneous steel with 0.2-2.1% carbon content
            id: 'crucible-mildsteel',
            block: 'IR-cruciblefurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-wroughtironingot', count: 2 },
                { id: 'IR-charcoal', count: 1 }
            ],
            result: { id: 'IR-mildsteelingot', count: 2 },
            byproduct: { id: 'IR-slag', count: 1 },
            ticks: 500,
            minTemp: 1450,
            maxTemp: 1550
        },
        {
            // Medium carbon steel: higher carbon content for tools
            id: 'crucible-mediumsteel',
            block: 'IR-cruciblefurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-wroughtironingot', count: 2 },
                { id: 'IR-coke', count: 2 }
            ],
            result: { id: 'IR-mediumsteelingot', count: 2 },
            byproduct: { id: 'IR-slag', count: 1 },
            ticks: 500,
            minTemp: 1450,
            maxTemp: 1550
        },
        {
            // High carbon steel: maximum carbon for cutting tools/springs
            id: 'crucible-highcarbonsteel',
            block: 'IR-cruciblefurnace',
            orderMatters: false,
            ingredients: [
                { id: 'IR-wroughtironingot', count: 2 },
                { id: 'IR-graphite', count: 1 }
            ],
            result: { id: 'IR-highcarbonsteelingot', count: 2 },
            byproduct: { id: 'IR-slag', count: 1 },
            ticks: 500,
            minTemp: 1500,
            maxTemp: 1600
        },
        
        // ---- Charcoal Pit recipes: fuel production ----
        {
            // Convert wood planks to charcoal in low-oxygen environment
            // Drives off volatiles, leaves nearly pure carbon
            // Essential fuel for bloomery smelting
            id: 'charcoalpit-plank-to-charcoal',
            block: 'IR-charcoalpit',
            orderMatters: false,
            ingredients: [
                { id: 'IR-plank', count: 4 }
            ],
            result: { id: 'IR-charcoal', count: 2 },
            ticks: 200
        },
        
        // ---- Coke Oven recipes: coal processing ----
        {
            // Convert bituminous coal to coke through destructive distillation
            // Removes volatile compounds, creates high-temperature fuel
            // Required for finery forge and crucible furnace
            id: 'cokeoven-coal-to-coke',
            block: 'IR-cokeoven',
            orderMatters: false,
            ingredients: [
                { id: 'IR-bituminouscoal', count: 3 }
            ],
            result: { id: 'IR-coke', count: 2 },
            byproduct: { id: 'IR-coaltar', count: 1 },
            ticks: 300
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
        },
        
        // ========================================================
        // METALLURGY CRAFTING RECIPES
        // ========================================================
        // These recipes allow crafting metallurgy machines and items
        // in the player's inventory grid or at the workbench.
        // ========================================================
        
        // ---- Charcoal Pit crafting ----
        {
            // Hand-assembled charcoal pit: stone housing with clay lining
            // and air vents. Can be crafted in 2x2 inventory grid.
            id: 'charcoalpit-from-stone-clay',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-cobblestone', count: 4 },
                { id: 'IR-claybrick', count: 2 }
            ],
            result: { id: 'IR-charcoalpit', count: 1 }
        },
        
        // ---- Coke Oven crafting ----
        {
            // Coke oven: brick construction with sealed door and flue
            // Requires fired bricks and iron fittings for gas sealing
            id: 'cokeoven-from-bricks',
            type: 'shaped2x2',
            width: 2,
            pattern: [
                'IR-brick', 'IR-brick',
                'IR-brick', 'IR-ironplate'
            ],
            result: { id: 'IR-cokeoven', count: 1 }
        },
        
        // ---- Bloomery Furnace crafting ----
        {
            // Clay bloomery furnace: assembled from clay bricks, stone
            // base, and iron bands. Shapeless recipe for flexibility.
            id: 'bloomeryfurnace-from-clay-stone',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-claybrick', count: 8 },
                { id: 'IR-cobblestone', count: 4 },
                { id: 'IR-ironband', count: 2 }
            ],
            result: { id: 'IR-bloomeryfurnace', count: 1 }
        },
        
        // ---- Finery Forge crafting ----
        {
            // Finery forge: requires steel frame, refractory bricks,
            // and heavy anvil surface. Advanced metallurgy station.
            id: 'fineryforge-from-steel-refractory',
            type: 'shaped3x3',
            width: 3,
            pattern: [
                'IR-steelframe', 'IR-steelframe', 'IR-steelframe',
                'IR-refractorybrick', 'IR-anvilheavy', 'IR-refractorybrick',
                'IR-cobblestone', 'IR-cobblestone', 'IR-cobblestone'
            ],
            result: { id: 'IR-fineryforge', count: 1 }
        },
        
        // ---- Crucible Furnace crafting ----
        {
            // Crucible furnace: graphite crucibles in refractory housing
            // with mechanical bellows attachment. Highest temperature station.
            id: 'cruciblefurnace-from-graphite-refractory',
            type: 'shaped3x3',
            width: 3,
            pattern: [
                'IR-cruciblegraphite', 'IR-bellowsmechanical', 'IR-cruciblegraphite',
                'IR-refractorybrick', null, 'IR-refractorybrick',
                'IR-refractorybrick', 'IR-steelframe', 'IR-refractorybrick'
            ],
            result: { id: 'IR-cruciblefurnace', count: 1 }
        },
        
        // ---- Hand Bellows crafting ----
        {
            // Hand-cranked bellows: wood frame with leather bag
            // Simple auxiliary tool for airflow control
            id: 'bellows-hand-from-wood-leather',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-plank', count: 3 },
                { id: 'IR-leather', count: 2 },
                { id: 'IR-ironrod', count: 1 }
            ],
            result: { id: 'IR-bellowshand', count: 1 }
        },
        
        // ---- Mechanical Bellows crafting ----
        {
            // Mechanical bellows: geared mechanism with metal housing
            // Provides consistent high-pressure airflow
            id: 'bellows-mechanical-from-gears-iron',
            type: 'shaped2x2',
            width: 2,
            pattern: [
                'IR-ironplate', 'IR-gear',
                'IR-gear', 'IR-ironrod'
            ],
            result: { id: 'IR-bellowsmechanical', count: 1 }
        },
        
        // ---- Heavy Anvil crafting ----
        {
            // Heavy forging anvil: massive wrought iron block on stone base
            // Essential for consolidating sponge iron and shaping hot metal
            id: 'anvil-heavy-from-wroughtiron-stone',
            type: 'shaped2x2',
            width: 2,
            pattern: [
                'IR-wroughtironingot', 'IR-wroughtironingot',
                'IR-wroughtironingot', 'IR-stoneblock'
            ],
            result: { id: 'IR-anvilheavy', count: 1 }
        },
        
        // ---- Quern Stone crafting ----
        {
            // Quern-stone: hand mill for crushing ores and materials
            // Two grinding stones in wooden housing
            id: 'quernstone-from-grindingstones',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-grindingstone', count: 2 },
                { id: 'IR-plank', count: 2 }
            ],
            result: { id: 'IR-quernstone', count: 1 }
        },
        
        // ---- Sluice Box crafting ----
        {
            // Sluice box: wooden channel with riffles for ore concentration
            // Uses water flow to separate heavy minerals from lighter gangue
            id: 'sluicebox-from-planks-riffles',
            type: 'shaped2x2',
            width: 2,
            pattern: [
                'IR-plank', 'IR-plank',
                'IR-woodenriffle', 'IR-plank'
            ],
            result: { id: 'IR-sluicebox', count: 1 }
        },
        
        // ---- Pyrometer/Temperature Gauge crafting ----
        {
            // Early pyrometer prototype: ceramic tube with metal wire
            // Measures furnace temperatures via thermal expansion
            id: 'pyrometer-from-ceramic-wire',
            type: 'shapeless',
            ingredients: [
                { id: 'IR-ceramictube', count: 1 },
                { id: 'IR-metalwire', count: 3 },
                { id: 'IR-glass', count: 2 }
            ],
            result: { id: 'IR-pyrometer', count: 1 }
        }
    ]
}