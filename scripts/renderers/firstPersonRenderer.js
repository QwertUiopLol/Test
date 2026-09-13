// Canvas first-person renderer. World data stays in the existing chunk/tile APIs;
// this module owns only camera projection, target picking and draw order.
const FirstPersonRenderer = {
    canvas: null, ctx: null, yaw: 0, target: null,
    FOV: Math.PI / 2.7,

    init() {
        this.canvas = document.getElementById('world');
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.canvas.addEventListener('pointerdown', e => this.beginLook(e));
        this.canvas.addEventListener('pointermove', e => this.moveLook(e));
        this.canvas.addEventListener('pointerup', e => this.endLook(e));
        this.canvas.addEventListener('pointercancel', e => this.endLook(e));
        this.resize();
    },

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.max(1, Math.floor(rect.width * scale));
        this.canvas.height = Math.max(1, Math.floor(rect.height * scale));
        this.ctx.setTransform(scale, 0, 0, scale, 0, 0);
        this.width = rect.width; this.height = rect.height;
    },

    beginLook(e) { this.lookPointer = { id: e.pointerId, x: e.clientX, moved: false }; this.canvas.setPointerCapture(e.pointerId); },
    moveLook(e) {
        if (!this.lookPointer || e.pointerId !== this.lookPointer.id) return;
        const delta = e.clientX - this.lookPointer.x;
        if (Math.abs(delta) > 1) { this.yaw += delta * 0.009; this.lookPointer.x = e.clientX; this.lookPointer.moved = true; this.render(); }
    },
    endLook(e) {
        if (!this.lookPointer || e.pointerId !== this.lookPointer.id) return;
        const tap = !this.lookPointer.moved; this.lookPointer = null;
        if (tap && this.target) onCellClick(this.target.x, this.target.y);
    },

    color(id, fallback) { const data = Registry.get(id); return (data && data.color) || fallback; },
    isSolid(x, y) {
        const ground = getGlobalCellType(x, y);
        const overlay = getGlobalOverlayType(x, y);
        // Machines and grown trees are physical, vertical blocks. Ground tiles
        // remain a walkable voxel floor, matching the original movement model.
        return !!overlay || ground === 'IR-oaklog' || ground === 'IR-oak-leaves';
    },
    ray(angle, maxDistance = 8) {
        const step = 0.035;
        for (let d = 0.22; d < maxDistance; d += step) {
            const x = Math.floor(playerX + .5 + Math.cos(angle) * d);
            const y = Math.floor(playerY + .5 + Math.sin(angle) * d);
            if (this.isSolid(x, y)) return { x, y, distance: d, id: getGlobalOverlayType(x, y) || getGlobalCellType(x, y) };
        }
        return null;
    },
    updateTarget() {
        const hit = this.ray(this.yaw, SELECTION_RADIUS + .7);
        const d = hit ? hit.distance : Math.min(SELECTION_RADIUS, 2);
        this.target = hit || { x: Math.floor(playerX + .5 + Math.cos(this.yaw) * d), y: Math.floor(playerY + .5 + Math.sin(this.yaw) * d) };
        if (isInSelectionRadius(this.target.x, this.target.y)) { selectedX = this.target.x; selectedY = this.target.y; }
    },
    drawFloor(ctx, w, h, horizon) {
        const floor = ctx.createLinearGradient(0, horizon, 0, h);
        floor.addColorStop(0, '#537d4c'); floor.addColorStop(1, '#182b1b'); ctx.fillStyle = floor; ctx.fillRect(0, horizon, w, h - horizon);
        ctx.strokeStyle = '#a0c27a55'; ctx.lineWidth = 1;
        for (let z = 1; z < 12; z++) { const y = horizon + (h - horizon) * (1 - 1 / z); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        for (let x = -12; x <= 12; x++) { const angle = this.yaw + Math.atan2(x, 2); const sx = w / 2 + Math.tan(angle - this.yaw) * w * .55; ctx.beginPath(); ctx.moveTo(w / 2, horizon); ctx.lineTo(sx, h); ctx.stroke(); }
    },
    render() {
        if (!this.canvas) this.init();
        const rect = this.canvas.getBoundingClientRect();
        if (Math.abs(rect.width - this.width) > 1 || Math.abs(rect.height - this.height) > 1) this.resize();
        const { ctx, width: w, height: h } = this; if (!w || !h) return;
        const horizon = h * .48;
        const sky = ctx.createLinearGradient(0, 0, 0, horizon); sky.addColorStop(0, '#3c8ec8'); sky.addColorStop(1, '#c1e8f4'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, horizon);
        this.drawFloor(ctx, w, h, horizon);
        const columns = Math.max(100, Math.floor(w / 3));
        for (let col = 0; col < columns; col++) {
            const camera = (col / columns - .5) * this.FOV;
            const hit = this.ray(this.yaw + camera);
            if (!hit) continue;
            const corrected = hit.distance * Math.cos(camera);
            const blockH = Math.min(h * .9, h / Math.max(corrected, .12));
            const top = horizon - blockH * .55;
            ctx.fillStyle = this.color(hit.id, '#6c7461'); ctx.fillRect(col * w / columns, top, w / columns + 1, blockH);
            ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(col * w / columns, top, 1, blockH);
        }
        this.updateTarget();
        // Minecraft-like crosshair and selected block hint.
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w / 2 - 10, horizon); ctx.lineTo(w / 2 + 10, horizon); ctx.moveTo(w / 2, horizon - 10); ctx.lineTo(w / 2, horizon + 10); ctx.stroke();
        const label = this.target ? `${this.target.x}, ${this.target.y}` : '';
        ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffffffcc'; ctx.fillText(label, w / 2, horizon + 28);
    }
};
