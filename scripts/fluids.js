// ============================================
// fluids.js - fluid types + fluid-holding items (capsules/cells)
// ============================================
// GregTech/IC2-style fluid capsules: an item that can carry a fixed amount
// of SOME fluid inside it, on top of the normal id/count stacking every
// other item uses. Read this file if you want to add a new fluid type, a
// new capsule capacity, a pre-filled capsule, or a new fluid-handling GUI
// block/slot.
//
// ---- The core idea ----
// Every other item in the game is fully described by its Registry entry
// alone (see registry.js) - two stacks of the same id are always
// identical. A capsule breaks that: two "Capsule (1000mB)" stacks can hold
// DIFFERENT fluids/amounts. So a capsule's actual state doesn't live in the
// Registry - it lives on the item STACK itself, as two extra fields
// alongside the normal {id, count}:
//   { id: 'IR-capsule-1000', count: 3, fluid: 'water', amount: 400 }
// `fluid` is a FluidRegistry id (or null for an empty capsule) and
// `amount` is how many mB are currently inside EACH capsule in that stack
// (every capsule in one stack always holds the identical fluid+amount -
// see stacksMatch() below, which is what enforces that at merge time).
//
// ---- Stacking rules (GregTech-style) ----
// Two capsule stacks of the SAME id (i.e. same registered volume) are
// allowed to combine into one stack ONLY if their fluid contents are
// identical too:
//   - both empty                              -> stack together
//   - both hold the same fluid AND same amount -> stack together
//   - anything else (different fluid, or same fluid but different amount,
//     or one empty/one full)                   -> do NOT stack, sits in
//                                                  its own slot instead
// This mirrors real GT/IC2 cells: a stack of empty cells is one stack, a
// stack of "16x Cell (1000mB Water, full)" is another stack, and a
// half-full one-off cell just sits alone since merging it would silently
// average/duplicate fluid amounts. See Fluids.stacksMatch() below - this
// is the ONE extra check bolted onto every merge-by-id call site in the
// game (Inventory.handleSlotClick/handleSlotRightClick in inventory.js,
// GuiBlocks.handleSlotClick in guiBlocks.js, Crafting.handleCraftSlotClick
// in crafting.js) so capsules merge correctly instead of either never
// stacking at all or incorrectly merging different fluids/amounts.
//
// `fluid`/`amount` are plain extra properties on the same stack object
// used everywhere else in the game (inventory slots, GUI block slots,
// ground items, drag state...). Every system that just moves/copies a
// WHOLE stack object already carries them along for free. The one place
// that needs to be careful is anywhere that REBUILDS a stack from scratch
// as `{id, count}` (splitting one capsule off a stack, or Inventory.addItem
// starting a new stack) - see cloneStack() below, used at every such spot
// so fluid state is copied along instead of silently dropped.

// ============================================
// Fluid Registry
// ============================================
const FluidRegistry = {
    fluids: {},

    register(data) {
        for (const id in data) {
            this.fluids[id] = { id, ...data[id] };
        }
    },

    get(id) {
        return this.fluids[id] || null;
    }
};

FluidRegistry.register({
    water: {
        name: 'Water',
        color: '#3a7abf'
    },
    lava: {
        name: 'Lava',
        color: '#d0523a'
    },
    // Sulfuric Acid - the other example fluid asked for alongside water,
    // registered the exact same way (just an id/name/color trio). Any new
    // fluid the game ever needs is just another entry here; nothing else
    // has to change for a new fluid type to work in capsules/tanks/slots.
    sulfuric_acid: {
        name: 'Sulfuric Acid',
        color: '#c8d84a'
    }
});

// ============================================
// Fluid container helpers
// ============================================
const Fluids = {
    // True for any item stack that's registered as a fluid container (see
    // `fluidCapacity` on a Registry item entry below), regardless of
    // whether it currently holds anything.
    isContainer(stack) {
        if (!stack) return false;
        const data = Registry.get(stack.id);
        return !!(data && data.fluidCapacity);
    },

    capacityOf(id) {
        const data = Registry.get(id);
        return (data && data.fluidCapacity) || 0;
    },

    // Current amount/fluid held by a stack, defaulting to "empty" for a
    // container stack that's never been filled yet (fluid/amount fields
    // not present until the first fill).
    amountOf(stack) {
        return (stack && stack.amount) || 0;
    },
    fluidOf(stack) {
        return (stack && stack.fluid) || null;
    },

    // Adds up to `amount` of `fluidId` into a container stack, in place.
    // Refuses (returns 0 moved) if the stack already holds a DIFFERENT
    // fluid - same "one fluid at a time" rule GregTech cells/capsules use,
    // matching how a ground tile already refuses to mix two different
    // items (see dropItemOnGround in game.js). Returns how much actually
    // went in (0..amount), so the caller knows how much to pull from the
    // source.
    fill(stack, fluidId, amount) {
        if (!this.isContainer(stack) || amount <= 0) return 0;
        const existing = this.fluidOf(stack);
        if (existing && existing !== fluidId) return 0;

        const capacity = this.capacityOf(stack.id);
        const current = this.amountOf(stack);
        const space = Math.max(0, capacity - current);
        const move = Math.min(space, amount);
        if (move <= 0) return 0;

        stack.fluid = fluidId;
        stack.amount = current + move;
        return move;
    },

    // Removes up to `amount` from a container stack, in place. Once a
    // container empties out completely, its `fluid` is cleared back to
    // null (an empty capsule is fluid-agnostic again, can be filled with
    // anything next). Returns how much actually came out.
    drain(stack, amount) {
        if (!this.isContainer(stack) || amount <= 0) return 0;
        const current = this.amountOf(stack);
        const move = Math.min(current, amount);
        if (move <= 0) return 0;

        stack.amount = current - move;
        if (stack.amount <= 0) {
            stack.amount = 0;
            stack.fluid = null;
        }
        return move;
    },

    // Two stacks of the SAME registered id are allowed to merge (stack
    // together in one slot) only if this returns true. See the file header
    // "Stacking rules" note above for the full reasoning - short version:
    // non-containers always match (normal items, unaffected by any of
    // this); containers only match when both are empty, or both hold the
    // identical fluid at the identical amount.
    stacksMatch(a, b) {
        if (!a || !b || a.id !== b.id) return false;
        if (!this.isContainer(a)) return true; // ordinary item - id match is enough
        const aFluid = this.fluidOf(a), bFluid = this.fluidOf(b);
        const aAmt = this.amountOf(a), bAmt = this.amountOf(b);
        if (!aFluid && !bFluid) return true; // both empty
        return aFluid === bFluid && aAmt === bAmt;
    },

    // Copies a stack, including fluid/amount if present - use this instead
    // of hand-building `{id, count}` anywhere a capsule stack might get
    // split, duplicated, or freshly created, so its contents survive.
    cloneStack(stack, count) {
        const copy = { id: stack.id, count: count !== undefined ? count : stack.count };
        if (this.isContainer(stack)) {
            copy.fluid = stack.fluid || null;
            copy.amount = stack.amount || 0;
        }
        return copy;
    },

    // Short display label for a container stack's contents, e.g.
    // "400 / 1000 mB Water" or "Empty" - used by the GUI slot tooltip/name
    // label (see fluidSlotTitle in guiBlocks.js).
    describe(stack) {
        if (!this.isContainer(stack)) return '';
        const capacity = this.capacityOf(stack.id);
        const amount = this.amountOf(stack);
        const fluidId = this.fluidOf(stack);
        if (!fluidId || amount <= 0) return `Empty (0 / ${capacity} mB)`;
        const fluidData = FluidRegistry.get(fluidId);
        const name = fluidData ? fluidData.name : fluidId;
        return `${name} (${amount} / ${capacity} mB)`;
    }
};

// ============================================
// Capsule / cell items - registered via helpers, arbitrary volumes
// ============================================
// registerCapsule(volume) makes an EMPTY capsule of any size you want, e.g.
// registerCapsule(1000), registerCapsule(2000), registerCapsule(4000), or
// any other number - there's nothing hardcoded to a fixed list of sizes.
// The id is auto-derived as 'IR-capsule-<volume>' and it stacks (see
// "Stacking rules" above) with any other capsule of the SAME volume that
// currently holds the identical contents (both empty, in this case, since
// this helper always registers the empty base item).
//
// `maxStack` is set high (64, same default as a normal item) rather than
// 1 - the OLD version of this file forced maxStack: 1 specifically because
// the merge-by-id logic didn't know how to compare fluid contents yet.
// Now that Fluids.stacksMatch() is wired into every merge call site, empty
// capsules of the same size are safe to stack normally, and partially/
// fully filled ones naturally end up alone in their own slot the moment
// their contents stop matching every other stack of that id.
function registerCapsule(volume, opts) {
    opts = opts || {};
    const id = opts.id || `IR-capsule-${volume}`;
    Registry.register({
        [id]: {
            name: opts.name || `Capsule (${volume}mB)`,
            type: 'item',
            stackable: true,
            maxStack: 64,
            // Fully transparent (not translucent white) - itemIconStyle()
            // in inventory.js applies `color` as a background-color layer
            // UNDER the shell texture. '#ffffff33' painted a faint grey/
            // white square behind every capsule (visible around/through
            // the shell's transparent edges) - the "странный серый
            // полупрозрачный квадрат" bug. isTransparentColor() (registry.js)
            // also uses this to skip the .has-solid-bg inset shadow, which
            // is correct here since the capsule shell art has its own edge.
            color: '#ffffff00',
            // Shell (base.png) + liquid overlay (overlay.png), rendered
            // together in itemIconHTML (inventory.js): the shell always
            // shows, and the liquid overlay is clipped to the current
            // fill % and tinted to the held fluid's color - see
            // capsuleFluidOverlayHTML() below and its use in inventory.js.
            icon: 'assets/capsules/capsule_shell.png',
            fluidCapacity: volume
        }
    });
    return id;
}

// registerFilledCapsule(volume, fluidId, amount) makes a capsule item that
// is ALREADY filled from the moment it's registered/crafted - e.g. a
// "Capsule of Water (1000mB)" or "Capsule of Sulfuric Acid (1000mB)" you
// can hand out directly via crafting/JEI/debug, without needing a Tank to
// fill it first. Internally this is just a normal capsule of that volume
// (registerCapsule handles the id/maxStack/icon/etc.) that additionally
// carries a `prefilled` marker so Inventory.addItem (inventory.js) knows to
// stamp fresh stacks with the right fluid/amount - see the addItem patch
// below.
function registerFilledCapsule(volume, fluidId, amount, opts) {
    opts = opts || {};
    const fluidData = FluidRegistry.get(fluidId);
    const fluidName = fluidData ? fluidData.name : fluidId;
    const id = opts.id || `IR-capsule-${volume}-${fluidId}`;
    registerCapsule(volume, {
        id,
        name: opts.name || `Capsule of ${fluidName} (${volume}mB)`
    });
    // Mark this Registry entry as "starts pre-filled" - read by
    // Inventory.addItem() so a freshly-created stack of this id starts
    // with fluid/amount already set, instead of starting empty like a
    // plain capsule would.
    Registry.items[id].prefilled = { fluid: fluidId, amount: Math.min(amount, volume) };
    return id;
}

// ---- Example capsule sizes ----
// Only the standard 1000mB capsule is registered (and therefore shows up
// in the registry/JEI list) - registerCapsule/registerFilledCapsule still
// support any other volume if a block/recipe wants to hand one out
// directly, but non-standard sizes are no longer registered up front here.
registerCapsule(1000);

// ---- Example pre-filled capsules ----
// A full (fluid = volume) pre-filled 1000mB capsule for every registered
// fluid (water/lava/sulfuric acid), so both the empty AND already-full
// version of the standard capsule show up in the registry/JEI list. Add
// more fluid ids to CAPSULE_FLUIDS if new fluids are registered later;
// nothing else needs to change.
const CAPSULE_VOLUMES = [1000];
const CAPSULE_FLUIDS = ['water', 'lava', 'sulfuric_acid'];
for (const volume of CAPSULE_VOLUMES) {
    for (const fluidId of CAPSULE_FLUIDS) {
        registerFilledCapsule(volume, fluidId, volume);
    }
}

// Empty capsules are no longer crafted directly here - they're made from
// real glass chemistry (silica + lime, FIRED) at the Kiln. See the
// 'kiln-glass-capsule' entry in GuiBlockRecipeRegistry (registry.js).

// ============================================
// Fluid Tank block - a world-placed fluid source/reservoir
// ============================================
// The Tank is the "infinite-ish" fluid store a Fluid Extractor pulls from.
// It's a plain GUI block with two capsule slots of its own: dropping a
// capsule in `capsuleIn` either fills it from the tank's stored fluid, or
// (if the capsule already holds fluid) empties it INTO the tank -
// whichever direction makes sense given what's in the capsule and what's
// in the tank - then moves the (now updated) capsule to `capsuleOut` for
// the player to collect. This is the "capsule <-> tank" interaction
// GregTech-style multiblocks use, minus the multiblock part.
//
// `tankCapacity` is configurable per-block-instance the same way capsule
// volume is configurable per-item: just change the number here (or copy
// this whole registry entry under a new id for a second tank size) - noth-
// ing about TankState/tankTick below is hardcoded to 10000.
Registry.register({
    'IR-tank': {
        name: 'Fluid Tank',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#3a5a7a',
        dropId: 'IR-tank',
        overlay: true,
        icon: '🛢',
        texture: 'assets/tank.png',
        gui: {
            title: 'Super Tank I',
            // Marks this panel as a big fluid-gauge display (see
            // tankDisplayHTML in guiBlocks.js) instead of the generic
            // icon-grid slots layout every other GUI block uses - shows a
            // large "Liquid Amount" bar with the exact mB count and a
            // "Locked Fluid" readout (the fluid type this Tank is
            // currently committed to, same rule TankState already
            // enforced: empty until first fill, then stuck on that fluid
            // until it's fully drained again).
            tankDisplay: true,
            slots: [
                { id: 'capsuleIn', label: 'Insert Capsule' },
                { id: 'capsuleOut', label: 'Result', output: true }
            ]
        },
        // Starting fluid content for a freshly-placed Tank. Was defaulting
        // to full (10000mB water) purely as a testing convenience, but a
        // freshly-placed Tank reading as already full - with no way to
        // empty it out again, since draining requires a capsule holding a
        // DIFFERENT fluid than what's locked in (see tankTick() below) -
        // meant an empty capsule could only ever pull water back OUT, never
        // actually clear the tank. Starts empty now, same as any other
        // freshly-placed container; TankState.get() below only consults
        // these on the first-ever touch of a given Tank position.
        tankCapacity: 10000,
        tankDefaultFluid: null,
        tankDefaultAmount: 0
    }
});

// Per-placed-Tank fluid storage, keyed by "x,y" - same pattern as
// GuiBlocks.storage in guiBlocks.js (each placed block instance is
// independent; two Tanks on the map don't share fluid).
//
// `locked` (off by default, matching a freshly-placed Tank in vanilla
// GT/IC2) is the missing "Locked Fluid" toggle: when true, the Tank
// commits to a single fluid type - once ANY fluid has been put in, only
// that same fluid can ever be added again until the Tank is fully
// drained back to empty, exactly like a locked GT cell/tank. When false
// (the default), a Tank with room left will accept a capsule's fluid even
// if it's different from what a locked Tank is already holding - this was
// the missing case that let e.g. a capsule of acid get poured into a tank
// already holding water (see tankTick() below): with locking off that's
// now an intentional mixing tank; with locking on it's refused instead.
const TankState = {
    tanks: {},
    keyFor(x, y) { return `${x},${y}`; },
    get(x, y) {
        const key = this.keyFor(x, y);
        if (!this.tanks[key]) {
            const data = Registry.get('IR-tank');
            this.tanks[key] = {
                capacity: data.tankCapacity || 10000,
                fluid: data.tankDefaultFluid || null,
                amount: data.tankDefaultAmount || 0,
                locked: false
            };
        }
        return this.tanks[key];
    },
    // Toggles the Locked Fluid button for a placed Tank. Turning locking
    // ON while the tank already holds a fluid just starts enforcing that
    // fluid going forward (nothing about the tank's current contents
    // changes) - it does NOT require the tank to be empty first, matching
    // how a "Locked" checkbox reads in the reference UI (a live on/off
    // switch, not a one-time commit).
    toggleLock(x, y) {
        const tank = this.get(x, y);
        tank.locked = !tank.locked;
        return tank.locked;
    }
};

// Runs once per tick for every currently-open Tank GUI (only needs to act
// while the player is looking at it, unlike GuiBlocks.processTick's
// always-on recipes) - moves a capsule dropped in `capsuleIn` straight to
// `capsuleOut`, filled or drained against this Tank's stored fluid.
// Direction is picked automatically:
//   - empty capsule (or one already holding the tank's own fluid, with
//     room left) -> FILL it from the tank
//   - capsule holding a DIFFERENT fluid than the tank, tank has room
//     -> DRAIN it INTO the tank instead
function tankTick() {
    if (!GuiBlocks.open) return;
    const blockId = getGlobalOverlayType(GuiBlocks.open.x, GuiBlocks.open.y)
        || getGlobalCellType(GuiBlocks.open.x, GuiBlocks.open.y);
    if (blockId !== 'IR-tank') return;

    const { x, y, guiDef } = GuiBlocks.open;
    const slots = GuiBlocks.getSlots(x, y, guiDef);
    const inStack = slots.capsuleIn;
    if (!inStack || !Fluids.isContainer(inStack)) return;
    if (slots.capsuleOut) return; // wait for the player to collect the last result first

    const tank = TankState.get(x, y);

    // A stack can hold many identical capsules at once (see the file header
    // "Stacking rules" note - every capsule in one stack starts out with
    // the same fluid+amount). Capsules are peeled off the stack one at a
    // time (each independently reaching the tank's remaining room),
    // splitting the stack into "capsules that finished changing state"
    // (which move to capsuleOut) and "capsules untouched because the tank
    // ran out of room/fluid first" (which stay behind in capsuleIn for the
    // player to keep working through).
    //
    // IMPORTANT: every capsule being peeled off starts from the SAME
    // pristine state (whatever the stack in capsuleIn currently holds) -
    // `pristine` below is that read-only snapshot, re-cloned fresh at the
    // top of every loop iteration. Earlier this loop kept mutating and
    // reusing ONE `single` object across iterations instead, which fed
    // capsule N's already-changed state into capsule N+1's decision of
    // which direction to go - e.g. capsule 1 draining into the tank left
    // that shared object empty, so capsule 2 read as "empty capsule, tank
    // has fluid" and filled itself right back up FROM the tank, undoing
    // capsule 1. For an even-sized stack this cancels out completely
    // (nothing ever seems to go in - "can't add anything to the tank"),
    // for an odd one only a single capsule's worth ever actually moves,
    // regardless of stack size. Re-cloning `pristine` each iteration
    // means every capsule is judged against its own real starting state,
    // not whatever the previous capsule in the loop was left holding.
    const pristine = Fluids.cloneStack(inStack, 1);
    const heldFluid = Fluids.fluidOf(pristine);
    const pristineAmount = Fluids.amountOf(pristine);
    let movedCount = 0;
    let single = pristine; // final per-capsule state stamped onto capsuleOut once the loop ends

    for (let i = 0; i < inStack.count; i++) {
        const fresh = Fluids.cloneStack(inStack, 1);
        const tankRoom = tank.capacity - tank.amount;
        const capsuleRoom = Fluids.capacityOf(fresh.id) - Fluids.amountOf(fresh);

        if (!heldFluid || (heldFluid === tank.fluid && capsuleRoom > 0)) {
            // Fill this one capsule from the tank.
            if (!tank.fluid || tank.amount <= 0) break;
            const move = Math.min(capsuleRoom, tank.amount);
            if (move <= 0) break;
            const full = move === capsuleRoom;
            // A capsule that doesn't fully top up (tank ran dry) ends in a
            // DIFFERENT state than the ones already fully topped up before
            // it in this same tick - it can't be batched into the same
            // capsuleOut stack as them, so if any capsule already moved
            // this tick, leave this partial one (and the rest of the
            // stack) behind for next tick instead, where it'll be judged
            // alone.
            if (!full && movedCount > 0) break;
            Fluids.fill(fresh, tank.fluid, move);
            tank.amount -= move;
            single = fresh;
            movedCount++;
            if (!full) break;
        } else {
            // Drain this one capsule into the tank - same fluid-lock
            // rules as before, just evaluated per capsule.
            if (tank.fluid && tank.fluid !== heldFluid && tank.amount > 0) break; // different fluid already stored - refuse
            if (tank.locked && tank.fluid && tank.fluid !== heldFluid) break; // locked to a fluid, even at 0mB
            if (tankRoom <= 0) break; // tank is genuinely full - refuse
            const move = Math.min(tankRoom, Fluids.amountOf(fresh));
            if (move <= 0) break;
            const full = move === pristineAmount; // fully drained (vs. tank filling up mid-capsule)
            if (!full && movedCount > 0) break; // same batching rule as the fill branch above
            tank.fluid = heldFluid;
            tank.amount += move;
            Fluids.drain(fresh, move);
            single = fresh;
            movedCount++;
            if (!full) break;
        }
    }

    if (movedCount <= 0) return;

    const changedStack = Fluids.cloneStack(single, movedCount);
    slots.capsuleOut = changedStack;

    const remaining = inStack.count - movedCount;
    slots.capsuleIn = remaining > 0 ? Fluids.cloneStack(inStack, remaining) : null;

    Inventory.onChange();
    renderGuiBlockOverlay();
}

if (typeof TickSystem !== 'undefined') {
    TickSystem.onTick(() => tankTick());
}

// ============================================
// Fluid Crafting Slots (GregTech/IC2-style) - generic engine
// ============================================
// This is the actual "crafting slot for liquid" system: a GUI block slot
// that holds its OWN fluid buffer with a configurable capacity (144, 288,
// 1000, 8000mB, anything you want), separate from whatever capsule you tap
// against it. Tapping a capsule against one of these slots moves fluid
// between the capsule and the slot's buffer, same rules as a real GT/IC2
// fluid input/output slot:
//
//   - Capsule holds fluid, slot is empty or holds the SAME fluid with room
//     left -> fluid flows CAPSULE -> SLOT, up to whichever runs out first
//     (slot's remaining capacity, or everything the capsule is holding).
//     Any leftover stays in the capsule in your hand - e.g. capsule has
//     1000mB water, slot caps at 400mB and is empty: slot ends up at
//     400mB, capsule keeps the other 600mB (exactly the example in the
//     request: "останется 600, в слоте 400").
//   - Capsule is empty (or holds the SAME fluid with room left) and the
//     slot holds fluid -> fluid flows SLOT -> CAPSULE instead, up to
//     whichever runs out first. E.g. capsule has 600mB water (room for
//     400 more, since its own capacity is 1000), slot holds 300mB water:
//     capsule ends up at 900mB, slot empties out to 0.
//   - Different, incompatible fluids on both sides with no room to
//     receIve -> nothing happens (mirrors Fluids.fill's own refusal rule).
//
// A block opts a slot into this behavior just by adding `fluidSlot: true`
// and an `mbCapacity` to one of its `gui.slots` entries (see
// IR-fluid-extractor below for a real example with input AND output fluid
// slots at DIFFERENT configured capacities). Every other slot on that same
// block (item ingredient slots, item output slots) keeps working exactly
// as GuiBlocks already handles them - this only changes behavior for slots
// explicitly marked fluidSlot: true.
const FluidSlots = {
    // Per-(x,y)-per-slot-id buffer state: { fluid, amount }. Lazily
    // created the first time a given fluid slot is touched, same pattern
    // as TankState/ExtractorState.
    buffers: {},
    keyFor(x, y, slotId) { return `${x},${y}:${slotId}`; },

    get(x, y, slotId, mbCapacity) {
        const key = this.keyFor(x, y, slotId);
        if (!this.buffers[key]) {
            this.buffers[key] = { capacity: mbCapacity, fluid: null, amount: 0 };
        }
        // Capacity can be (re)configured on the registry entry at any time
        // (e.g. tuning numbers during development) - keep the live buffer
        // in sync rather than freezing whatever capacity existed when the
        // block was first opened.
        this.buffers[key].capacity = mbCapacity;
        return this.buffers[key];
    },

    // Handles a click on a fluidSlot with a capsule currently being
    // dragged. Returns true if it handled the interaction (caller should
    // stop, i.e. NOT fall through to the normal item-merge logic), false
    // if this wasn't a fluid interaction at all (e.g. dragging a non-
    // capsule item onto a fluid slot - refused entirely, a fluid slot only
    // ever accepts capsules).
    tryHandleCapsuleDrop(x, y, slotDef) {
        if (!Inventory.dragging) return false;
        const dragItem = Inventory.dragging.item;
        if (!Fluids.isContainer(dragItem)) return false; // fluid slots only accept capsules

        const buffer = this.get(x, y, slotDef.id, slotDef.mbCapacity || 0);

        // Inventory.dragging.item can be a whole STACK of capsules (e.g.
        // count: 4), not just one - see Inventory.dragging's own comment
        // ("{ fromIndex, item }") and pickUp()/handleSlotClick(), which
        // pick up the entire clicked stack. This used to mutate
        // dragItem.fluid/.amount directly while leaving dragItem.count
        // untouched, which stamped the SAME fluid state onto every
        // capsule in the stack at once even though only enough fluid for
        // ONE capsule actually moved - "залить одной капсулой, взять
        // стек из 4 - все 4 показываются заполненными", when only one
        // should be. Only ever fill/drain a single capsule peeled off the
        // stack (same one-at-a-time approach tankTick() already uses
        // below for the Tank), then split the stack: the changed capsule
        // replaces just 1 unit of dragItem, the remaining count-1
        // capsules stay behind in hand exactly as they were.
        const single = Fluids.cloneStack(dragItem, 1);
        const capsuleFluid = Fluids.fluidOf(single);
        const capsuleAmount = Fluids.amountOf(single);
        const capsuleRoom = Fluids.capacityOf(single.id) - capsuleAmount;

        let moved = false;

        // Direction 1: capsule -> slot (capsule has fluid the slot can accept)
        if (capsuleFluid && (!buffer.fluid || buffer.fluid === capsuleFluid) && buffer.amount < buffer.capacity) {
            const room = buffer.capacity - buffer.amount;
            const move = Math.min(room, capsuleAmount);
            if (move > 0) {
                if (!buffer.fluid) buffer.fluid = capsuleFluid;
                buffer.amount += move;
                Fluids.drain(single, move);
                moved = true;
            }
        }

        // Direction 2: slot -> capsule (slot has fluid the capsule can accept)
        if (!moved && buffer.fluid && buffer.amount > 0 && (!capsuleFluid || capsuleFluid === buffer.fluid) && capsuleRoom > 0) {
            const move = Math.min(capsuleRoom, buffer.amount);
            if (move > 0) {
                Fluids.fill(single, buffer.fluid, move);
                buffer.amount -= move;
                if (buffer.amount <= 0) { buffer.amount = 0; buffer.fluid = null; }
                moved = true;
            }
        }

        if (moved) {
            if (dragItem.count > 1) {
                // Leave the untouched remainder in hand, still dragging,
                // and drop just the one changed capsule into its own
                // stack of 1 - same split shape Inventory already uses
                // elsewhere (e.g. splitStack). The player is now
                // "holding" both: the changed one takes over the drag
                // slot's original position conceptually, but since a
                // drag can only carry one stack at a time, the changed
                // capsule is placed back where the stack came from as a
                // separate 1-count stack, and the drag continues with
                // the reduced remainder.
                dragItem.count -= 1;
                this._depositSingleCapsule(single);
            } else {
                // Whole drag stack was just this one capsule - update it
                // in place and keep it in hand, exactly as before.
                dragItem.fluid = single.fluid;
                dragItem.amount = single.amount;
            }
            Inventory.onChange();
            return true;
        }

        // Nothing could move (incompatible fluids, or both sides already
        // at their limit) - still counts as "handled" so a capsule never
        // falls through into being merged/swapped as if it were a plain
        // item.
        return true;
    },

    // Places a single just-filled/drained capsule (split off a larger
    // dragged stack) back into the player's inventory - merging into a
    // matching stack (same id + same fluid/amount, see stacksMatch) if
    // one exists, otherwise the first empty slot. Mirrors
    // Inventory.addItem's own stacking search but starts from a fully-
    // built stack object (with its fluid/amount already set) rather than
    // a fresh {id, count}.
    _depositSingleCapsule(stack) {
        for (let i = 0; i < Inventory.slots.length; i++) {
            const slot = Inventory.slots[i];
            if (slot && this.stacksMatch(slot, stack) && slot.count < Inventory.maxStackFor(slot.id)) {
                slot.count += 1;
                return;
            }
        }
        for (let i = 0; i < Inventory.slots.length; i++) {
            if (!Inventory.slots[i]) {
                Inventory.slots[i] = this.cloneStack(stack, 1);
                return;
            }
        }
        // Inventory full (very unlikely here since this capsule was just
        // picked up FROM the inventory a moment ago, so a slot should
        // still be free/mergeable) - as a last resort, drop a plain
        // (non-fluid) copy on the ground under the player rather than
        // silently destroying it outright. dropItemOnGround only tracks
        // {id, count} on the ground, so the fluid contents can't be
        // preserved in this fallback path.
        if (typeof dropItemOnGround === 'function' && typeof playerX !== 'undefined' && typeof playerY !== 'undefined') {
            dropItemOnGround(playerX, playerY, stack.id, 1);
        }
    },

    // Short label for a fluid slot's current buffer, same style as
    // Fluids.describe() for a capsule - used for the slot's tooltip.
    describe(x, y, slotDef) {
        const buffer = this.get(x, y, slotDef.id, slotDef.mbCapacity || 0);
        if (!buffer.fluid || buffer.amount <= 0) return `Empty (0 / ${buffer.capacity} mB)`;
        const fluidData = FluidRegistry.get(buffer.fluid);
        const name = fluidData ? fluidData.name : buffer.fluid;
        return `${name} (${buffer.amount} / ${buffer.capacity} mB)`;
    }
};

// ============================================
// Fluid Extractor block - example use of fluidSlot input AND output
// ============================================
// Rebuilt on top of FluidSlots above instead of draining a whole capsule
// at once: `fluidInput` is a fluidSlot capped at 1000mB (tap a capsule
// against it to feed it, partial amounts stay in your capsule exactly like
// the crafting-slot example in the request), and the recipe below drains
// from THAT buffer once enough has accumulated. A capsule tapped against
// `fluidInput` when it already holds fluid also works the other way (pulls
// fluid back out), same as any fluidSlot.
Registry.register({
    'IR-fluid-extractor': {
        name: 'Fluid Extractor',
        type: 'block',
        stackable: true,
        maxStack: 64,
        breakTimeTicks: 30,
        hardness: 2,
        color: '#4a6a4a',
        dropId: 'IR-fluid-extractor',
        overlay: true,
        icon: '⚗',
        texture: 'assets/fluid_extractor.png',
        gui: {
            title: 'Fluid Extractor',
            slots: [
                // fluidSlot: true + mbCapacity marks this as a
                // GregTech-style liquid crafting slot (see FluidSlots
                // above) instead of a plain item slot - tap any capsule
                // against it to fill/drain up to 1000mB at a time.
                { id: 'fluidInput', label: 'Fluid Input', fluidSlot: true, mbCapacity: 1000 },
                { id: 'ingredient', label: 'Ingredient' },
                { id: 'output', label: 'Output', output: true }
            ],
            progressBar: { x: 0, y: 0, width: 32, height: 8, direction: 'right' }
        }
    }
});

// Recipes that need FLUID as an ingredient, not just items - kept as their
// own registry (rather than bolted onto GuiBlockRecipeRegistry) since the
// matching/consuming logic is different enough (a fluid amount instead of
// an item id+count) to just be its own small system.
//   block          - which block type runs this recipe (IR-fluid-extractor)
//   fluidSlotId    - which of that block's fluidSlot slots supplies the fluid
//   fluid          - required FluidRegistry id
//   fluidAmount    - required mB of that fluid, consumed from the slot's buffer
//   ingredient     - optional { id, count } item also required/consumed,
//                    taken from the `ingredient` slot
//   result         - { id, count } produced into `output`
//   ticks          - how long one craft takes once inputs are satisfied
const FluidRecipeRegistry = {
    recipes: [
        {
            // Dissolving mineral powder (real volcanic rock dust) in water
            // is exactly how a hydroponic liquid fertilizer / nutrient
            // solution is actually made in real life - the capsule of
            // water goes in via the fluidInput slot (tap it against the
            // slot), the powder goes in the ingredient slot, and the
            // Extractor leaches the two together over time.
            id: 'extractor-nutrient-gel',
            block: 'IR-fluid-extractor',
            fluidSlotId: 'fluidInput',
            fluid: 'water',
            fluidAmount: 250,
            ingredient: { id: 'IR-mineralpowder', count: 1 },
            result: { id: 'IR-nutrientgel', count: 1 },
            ticks: 60
        }
    ]
};

// Per-placed-Extractor craft progress, keyed by "x,y" - the fluid buffer
// itself now lives in FluidSlots (shared engine), so this only needs to
// track recipe progress, same shape as GuiBlocks.progress.
const ExtractorState = {
    progress: {},
    keyFor(x, y) { return `${x},${y}`; }
};

// Runs once per tick for every currently-open Extractor GUI: checks/
// advances a matching FluidRecipeRegistry recipe against the fluidInput
// slot's buffer + the `ingredient` slot, same progress-bar-then-consume
// shape GuiBlocks.processTick uses for the Mixer.
function fluidExtractorTick() {
    if (!GuiBlocks.open) return;
    const blockId = getGlobalOverlayType(GuiBlocks.open.x, GuiBlocks.open.y)
        || getGlobalCellType(GuiBlocks.open.x, GuiBlocks.open.y);
    if (blockId !== 'IR-fluid-extractor') return;

    const { x, y, guiDef } = GuiBlocks.open;
    const slots = GuiBlocks.getSlots(x, y, guiDef);
    const key = ExtractorState.keyFor(x, y);

    const recipe = FluidRecipeRegistry.recipes.find(r => {
        if (r.block !== blockId) return false;
        const slotDef = guiDef.slots.find(s => s.id === r.fluidSlotId);
        if (!slotDef) return false;
        const buffer = FluidSlots.get(x, y, slotDef.id, slotDef.mbCapacity || 0);
        if (buffer.fluid !== r.fluid || buffer.amount < r.fluidAmount) return false;
        if (r.ingredient) {
            const have = slots.ingredient;
            if (!have || have.id !== r.ingredient.id || have.count < r.ingredient.count) return false;
        }
        const out = slots.output;
        if (out && out.id !== r.result.id) return false;
        if (out && out.count + r.result.count > Inventory.maxStackFor(r.result.id)) return false;
        return true;
    });

    if (!recipe) {
        delete ExtractorState.progress[key];
        renderGuiBlockOverlay();
        return;
    }

    const prog = ExtractorState.progress[key] && ExtractorState.progress[key].recipeId === recipe.id
        ? ExtractorState.progress[key]
        : { recipeId: recipe.id, ticksDone: 0 };
    prog.ticksDone++;

    if (prog.ticksDone >= recipe.ticks) {
        const slotDef = guiDef.slots.find(s => s.id === recipe.fluidSlotId);
        const buffer = FluidSlots.get(x, y, slotDef.id, slotDef.mbCapacity || 0);
        buffer.amount -= recipe.fluidAmount;
        if (buffer.amount <= 0) { buffer.amount = 0; buffer.fluid = null; }
        if (recipe.ingredient) {
            slots.ingredient.count -= recipe.ingredient.count;
            if (slots.ingredient.count <= 0) slots.ingredient = null;
        }
        if (slots.output) slots.output.count += recipe.result.count;
        else slots.output = { id: recipe.result.id, count: recipe.result.count };
        delete ExtractorState.progress[key];
        Inventory.onChange();
    } else {
        ExtractorState.progress[key] = prog;
    }
    renderGuiBlockOverlay();
}

if (typeof TickSystem !== 'undefined') {
    TickSystem.onTick(() => fluidExtractorTick());
}
