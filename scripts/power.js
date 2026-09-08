// ============================================
// Power Grid
// ============================================
// A local, deterministic EU grid. Cables form orthogonal networks; generators
// feed each network, batteries buffer surplus, and machines reserve power
// before their processing tick advances. The grid is recalculated every tick
// because players can place or remove cable segments at any time.
const PowerGrid = {
    state: {}, // block coordinate -> { stored } for batteries
    networks: {},

    key(x, y) { return `${x},${y}`; },
    getBlock(x, y) { return Registry.get(getGlobalOverlayType(x, y) || getGlobalCellType(x, y)); },
    isNode(data) { return !!(data && (data.cable || data.power || (data.machine && data.machine.eu > 0))); },
    neighbours(x, y) { return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]; },

    collectNodes() {
        const nodes = {};
        for (const [chunkKey, chunk] of Object.entries(chunks)) {
            const [cx, cy] = chunkKey.split(',').map(Number);
            for (let ly = 0; ly < CHUNK_SIZE; ly++) for (let lx = 0; lx < CHUNK_SIZE; lx++) {
                const x = cx * CHUNK_SIZE + lx, y = cy * CHUNK_SIZE + ly;
                const data = this.getBlock(x, y);
                if (this.isNode(data)) nodes[this.key(x, y)] = { x, y, data };
            }
        }
        return nodes;
    },

    rebuild() {
        const nodes = this.collectNodes(), seen = new Set(), networks = {};
        let id = 0;
        for (const startKey in nodes) {
            if (seen.has(startKey)) continue;
            const queue = [nodes[startKey]], members = [];
            seen.add(startKey);
            while (queue.length) {
                const node = queue.shift(); members.push(node);
                this.neighbours(node.x, node.y).forEach(([x, y]) => {
                    const key = this.key(x, y);
                    if (nodes[key] && !seen.has(key)) { seen.add(key); queue.push(nodes[key]); }
                });
            }
            networks[++id] = members;
        }
        this.networks = networks;
    },

    tick() {
        this.rebuild();
        for (const members of Object.values(this.networks)) {
            let supply = 0;
            const batteries = [];
            members.forEach(({ x, y, data }) => {
                if (data.power && data.power.output) supply += data.power.output;
                if (data.power && data.power.capacity) {
                    const key = this.key(x, y);
                    const state = this.state[key] || (this.state[key] = { stored: 0 });
                    batteries.push({ data, state });
                }
            });
            // Recharge buffers first, but never more than their per-tick rate.
            batteries.forEach(({ data, state }) => {
                const charge = Math.min(supply, data.power.chargeRate || data.power.capacity, data.power.capacity - state.stored);
                state.stored += charge; supply -= charge;
            });
            members.forEach(({ x, y, data }) => {
                if (!data.machine || !data.machine.eu) return;
                const need = data.machine.eu;
                let delivered = Math.min(need, supply); supply -= delivered;
                for (const battery of batteries) {
                    if (delivered >= need) break;
                    const draw = Math.min(need - delivered, battery.state.stored, battery.data.power.dischargeRate || need);
                    battery.state.stored -= draw; delivered += draw;
                }
                this.state[this.key(x, y)] = { stored: this.state[this.key(x, y)]?.stored || 0, available: delivered >= need };
            });
        }
    },

    // Controllers validate their surrounding casing/hatches before a network
    // can energize them. A hatch may sit anywhere in the controller's 5×5
    // service ring, which accommodates both compact and large structures.
    validateMultiblock(x, y, definition) {
        if (!definition || !definition.requiredHatches) return true;
        const found = new Set();
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue;
            const data = this.getBlock(x + dx, y + dy);
            if (data && data.hatch) found.add(data.hatch);
        }
        return definition.requiredHatches.every(hatch => found.has(hatch));
    },

    hasPower(x, y, eu) {
        const data = this.getBlock(x, y);
        if (data && data.multiblock && !this.validateMultiblock(x, y, data.multiblock)) return false;
        const state = this.state[this.key(x, y)];
        return !eu || !!(state && state.available);
    },

    snapshot() { return this.state; },
    restore(state) { this.state = state && typeof state === 'object' ? state : {}; }
};

TickSystem.onTick(() => PowerGrid.tick());
