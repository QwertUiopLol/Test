// ============================================
// Alt-Mode Test Drop (playable placeholder)
// ============================================
// This is the smallest, most self-contained file in the project - a good
// one to study first if you want to see the whole "read world state ->
// decide -> mutate inventory/ground -> return a result" pattern used
// everywhere else (crafting, breaking, GUI blocks) in miniature.
// It's called from startBreaking() in tInter.js (see the call site there)
// and depends on getGlobalOverlayType/getGlobalCellType (game.js) and
// addItemOrDrop (also game.js).
//
// Design: while altMode is ON, using the BREAK action (dpad-click / Q /
// long-press-and-hold) on the GROUND layer only - not the overlay layer,
// i.e. only when there's no block placed on top (workbench, mixer, etc.)
// on that cell - doesn't run the normal mining/break-bar flow at all.
// Instead it's an instant action: roll one random pebble type and drop a
// single one into the inventory (spilling to the ground tile if the
// inventory has no room, same as any other pickup). No progress bar, no
// waiting out breakTimeTicks - this is a quick test hook for trying out
// the pebble items, not "real" mining yet.
//
// Only the ground layer qualifies on purpose (see the task this shipped
// for: "только на них и если на них не стоит другой блок" - grass/dirt
// only, and only if nothing else is standing on that cell). If an overlay
// block is present, alt-mode falls through to the normal startBreaking()
// flow untouched.
//
// Swap ALT_DROP_POOL below to change which items can drop, or
// pickAltDropItem() to change the odds.
//
// This pool is also the game's one bit of "soil science": real topsoil is
// a mix of weathered mineral grains (the five rock pebbles below) PLUS a
// much smaller fraction of humus - decomposed organic matter left over
// from long-dead plants, still present in the ground even though no living
// plant exists anywhere in this world right now. That's WHY sifting dirt
// can occasionally turn up Humus alongside plain rock: it's old biomass
// trapped in the soil, not something conjured from nothing - and it's the
// one ingredient in the whole tech tree that isn't purely mineral, which
// is exactly what eventually lets a synthetic seed be grown at all (see
// the Mixer's humus+nutrient-gel -> Callus Culture recipe in registry.js).
// Each entry's `weight` is its relative odds; humus is deliberately rare
// (natural topsoil is usually only a few percent organic matter by
// volume) compared to the common mineral pebbles.
const ALT_DROP_POOL = [
    { id: 'IR-apebble', weight: 4 },
    { id: 'IR-cpebble', weight: 4 },
    { id: 'IR-bpebble', weight: 4 },
    { id: 'IR-blpebble', weight: 4 },
    { id: 'IR-dpebble', weight: 4 },
    { id: 'IR-humus', weight: 1 },
    // Rare heavy grains and deposits found while carefully sifting soil.
    // These are intentionally uncommon: they open the metallurgy branch
    // without replacing the early mineral/biology progression.
    { id: 'IR-clay', weight: 2 },
    { id: 'IR-limestone', weight: 2 },
    { id: 'IR-coal', weight: 1 },
    { id: 'IR-bogironore', weight: 2 },
    { id: 'IR-ironore', weight: 1 },
    { id: 'IR-hematite', weight: 1 },
    { id: 'IR-magnetite', weight: 1 },
    { id: 'IR-limonite', weight: 1 }
];

function pickAltDropItem() {
    const totalWeight = ALT_DROP_POOL.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of ALT_DROP_POOL) {
        if (roll < entry.weight) return entry.id;
        roll -= entry.weight;
    }
    return ALT_DROP_POOL[ALT_DROP_POOL.length - 1].id; // floating-point fallback
}

// Ground-layer blocks eligible for the alt-mode test drop. Currently just
// dirt ('grass' doesn't exist as its own block yet - IR-dirt is standing
// in for "grass or ground" until a dedicated grass block is registered;
// add its id here once it exists).
const ALT_DROP_GROUND_TYPES = ['IR-dirt'];

// Returns true if (x, y) qualifies for the alt-mode test drop: a ground
// block from ALT_DROP_GROUND_TYPES, AND no overlay block sitting on top
// of it.
function isAltDropEligible(x, y) {
    const overlayType = getGlobalOverlayType(x, y);
    if (overlayType) return false; // something else is placed on this cell
    const groundType = getGlobalCellType(x, y);
    return ALT_DROP_GROUND_TYPES.includes(groundType);
}

// Called from startBreaking() in tInter.js when altMode is on and the
// break target is eligible (see isAltDropEligible). Handles the whole
// interaction itself - no break-bar, no tick-based progress - and returns
// true if it fired, so the caller knows not to also start a normal break.
function tryAltDrop(x, y) {
    if (!isAltDropEligible(x, y)) return false;

    const itemId = pickAltDropItem();
    addItemOrDrop(x, y, itemId, 1);
    return true;
}
