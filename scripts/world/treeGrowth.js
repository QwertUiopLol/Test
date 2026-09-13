// Minecraft-style scheduled block ticks for renewable oak trees.
// Kept separate from interaction code so world simulation stays modular.
const TreeGrowth = {
    planted: {},
    GROWTH_TICKS: 20 * 20, // 20 seconds at the central 20 TPS heartbeat

    plant(x, y) { this.planted[`${x},${y}`] = 0; },

    tick() {
        for (const key of Object.keys(this.planted)) {
            this.planted[key]++;
            if (this.planted[key] < this.GROWTH_TICKS) continue;
            const [x, y] = key.split(',').map(Number);
            if (getGlobalCellType(x, y) !== 'IR-sapling') { delete this.planted[key]; continue; }
            // A tree needs a clear 3x3 crown. It retries on later block ticks
            // instead of overwriting a player's construction.
            const crown = [[x, y - 1], [x - 1, y - 1], [x + 1, y - 1], [x, y - 2]];
            if (crown.some(([cx, cy]) => getGlobalCellType(cx, cy) !== 'void')) continue;
            setGlobalCellType(x, y, 'IR-oaklog');
            crown.forEach(([cx, cy]) => setGlobalCellType(cx, cy, 'IR-oak-leaves'));
            delete this.planted[key];
            renderWorld();
        }
    }
};

if (typeof SaveGame !== 'undefined' && SaveGame.pendingTrees) TreeGrowth.planted = SaveGame.pendingTrees;
if (typeof TickSystem !== 'undefined') TickSystem.onTick(() => TreeGrowth.tick());
