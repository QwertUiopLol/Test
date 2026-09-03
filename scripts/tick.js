// ============================================
// Tick System (game "heartbeat")
// ============================================
// A tick is the smallest unit of game time - like Minecraft's own tick
// system: 20 ticks = 1 second, so 1 tick = 50ms. Anything that needs to
// happen "over time" (breaking a block, a Mixer processing pebbles, etc.)
// counts ticks instead of using its own separate setTimeout/setInterval.
//
// How it works:
//   1. TickSystem.start() (called once from game.js's init()) kicks off a
//      single setInterval that fires every 50ms.
//   2. Every other file that needs to react to time passing calls
//      TickSystem.onTick(callback) ONCE, usually near the bottom of that
//      file, to register itself. Look for `TickSystem.onTick(...)` in
//      tInter.js (block breaking progress) and guiBlocks.js (Mixer
//      processing) for real examples.
//   3. Every tick, ALL registered callbacks run in the order they were
//      added, each one receiving the current tick count.
//
// This keeps timing logic centralized: nothing needs its own timer, it
// just asks "am I owed one more tick of progress?" whenever this fires.
const TickSystem = {
    ticks: 0,          // total ticks elapsed since start() was called
    intervalid: null,  // the setInterval id, so stop() can cancel it
    listeners: [],      // every callback registered via onTick()

    // Starts the heartbeat. Safe to call more than once - if it's already
    // running, this does nothing (see the `if (this.intervalid) return`
    // guard), so you don't end up with two intervals firing in parallel.
    start() {
        if (this.intervalid) return;
        this.intervalid = setInterval(() => {
            this.ticks++
            this.listeners.forEach(cb => cb(this.ticks))
        }, 50)
    },

    // Registers a function to be called on every tick. Call this once per
    // system that cares about time (e.g. "is my break-bar progress done
    // yet?"), not once per event - the callback itself should check its
    // own conditions and decide whether to do anything this tick.
    onTick(callback) {
        this.listeners.push(callback)
    },

    // Stops the heartbeat entirely (not currently called anywhere in this
    // project, but here in case you need to pause the whole simulation -
    // e.g. a future pause menu).
    stop() {
        if (this.intervalid) {
            clearInterval(this.intervalid)
            this.intervalid = null
        }
    }
}