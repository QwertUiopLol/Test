const QUEST_PROGRESS_KEY = 'ir-quest-progress';
const QUEST_UI_KEY = 'ir-quest-ui';

function escapeHtml(str) {
    return String(str === undefined || str === null ? '' : str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
}

// Embedded quest data - no network required, works on file:// protocol
const EMBEDDED_QUEST_DATA = {
  "nodes": [
    {"id":1,"x":240,"y":60,"radius":22,"shape":"circle","title":"Prologue","subtitle":"No trees nearby","description":"Only earth and stone surround you. A sapling must be CREATED from minerals, water, and ancient organic matter.","iconUrl":"","tasks":[]},
    {"id":2,"x":240,"y":200,"radius":22,"shape":"circle","title":"Soil Science","subtitle":"Earth is not just dirt","description":"Hold ALT+Click on Dirt to sift soil by hand. You may get pebbles or rarely humus.","iconUrl":"","tasks":[{"text":"Find Andesite Pebble via ALT+Click","optional":false,"type":"item","itemId":"IR-apebble","itemCount":1}]},
    {"id":3,"x":130,"y":340,"radius":20,"shape":"circle","title":"Stone Table","subtitle":"Craft Workbench","description":"Arrange 4 Cobblestone in 2x2 square to craft Workbench.","iconUrl":"","tasks":[{"text":"Craft Workbench","optional":false,"type":"item","itemId":"IR-workbench","itemCount":1}]},
    {"id":4,"x":350,"y":340,"radius":20,"shape":"circle","title":"Hand Mill","subtitle":"Build Mixer","description":"Find Daisleyte pebble and craft Mixer with 2 Cobblestone.","iconUrl":"","tasks":[{"text":"Find Daisleyte Pebble","optional":false,"type":"item","itemId":"IR-dpebble","itemCount":1},{"text":"Craft Mixer","optional":false,"type":"item","itemId":"IR-mixer","itemCount":1}]},
    {"id":5,"x":130,"y":480,"radius":20,"shape":"circle","title":"Kiln","subtitle":"Build Kiln","description":"Arrange 8 Cobblestone in ring on Workbench for Kiln.","iconUrl":"","tasks":[{"text":"Build Kiln","optional":false,"type":"item","itemId":"IR-kiln","itemCount":1}]},
    {"id":6,"x":350,"y":480,"radius":20,"shape":"circle","title":"Volcanic Flour","subtitle":"Mineral Powder","description":"Grind Andesite and Basalt in Mixer into Mineral Powder.","iconUrl":"","tasks":[{"text":"Find Basalt Pebble","optional":false,"type":"item","itemId":"IR-bpebble","itemCount":1},{"text":"Craft Mineral Powder x2","optional":false,"type":"item","itemId":"IR-mineralpowder","itemCount":2}]},
    {"id":7,"x":460,"y":480,"radius":20,"shape":"circle","title":"Glass Ingredients","subtitle":"Lime and Silica","description":"Grind Calcite into Lime Powder, Blackstone into Silica Powder.","iconUrl":"","tasks":[{"text":"Find Calcite Pebble","optional":false,"type":"item","itemId":"IR-cpebble","itemCount":1},{"text":"Craft Lime Powder","optional":false,"type":"item","itemId":"IR-limepowder","itemCount":1},{"text":"Craft Silica Powder","optional":false,"type":"item","itemId":"IR-silicapowder","itemCount":1}]},
    {"id":8,"x":240,"y":620,"radius":24,"shape":"circle","title":"Glass Capsule","subtitle":"First Vessel","description":"Fire Silica and Lime in Kiln to get Glass Capsules.","iconUrl":"","tasks":[{"text":"Craft Glass Capsule x2","optional":false,"type":"item","itemId":"IR-capsule-1000","itemCount":2}]},
    {"id":9,"x":240,"y":760,"radius":20,"shape":"circle","title":"Water Capsule","subtitle":"Extract Water","description":"Fill empty capsule with water from dirt.","iconUrl":"","tasks":[{"text":"Craft Water Capsule","optional":false,"type":"item","itemId":"IR-capsule-1000-water","itemCount":1}]},
    {"id":10,"x":350,"y":900,"radius":22,"shape":"circle","title":"Nutrient Gel","subtitle":"Hydroponics","description":"Craft Fluid Extractor and make Nutrient Gel.","iconUrl":"","tasks":[{"text":"Craft Fluid Extractor","optional":false,"type":"item","itemId":"IR-fluid-extractor","itemCount":1},{"text":"Craft Nutrient Gel x2","optional":false,"type":"item","itemId":"IR-nutrientgel","itemCount":2}]},
    {"id":11,"x":350,"y":1040,"radius":20,"shape":"circle","title":"Tissue Culture","subtitle":"Callus Growth","description":"Find Humus and grow Callus Culture in Mixer.","iconUrl":"","tasks":[{"text":"Find Humus","optional":false,"type":"item","itemId":"IR-humus","itemCount":1},{"text":"Craft Callus Culture","optional":false,"type":"item","itemId":"IR-callusculture","itemCount":1}]},
    {"id":12,"x":350,"y":1360,"radius":30,"shape":"star","title":"First Sapling","subtitle":"Synthetic Seed FINALE","description":"Create first Oak Sapling through biotechnology.","iconUrl":"","tasks":[{"text":"Craft Oak Sapling","optional":false,"type":"item","itemId":"IR-sapling","itemCount":1}]},
    {"id":13,"x":460,"y":620,"radius":20,"shape":"circle","title":"Plant Ash","subtitle":"Alkali Source","description":"Calcine Humus in Kiln to get Plant Ash.","iconUrl":"","tasks":[{"text":"Craft Plant Ash","optional":false,"type":"item","itemId":"IR-plantash","itemCount":1}]},
    {"id":14,"x":460,"y":700,"radius":20,"shape":"circle","title":"Lye","subtitle":"Potash Solution","description":"Mix Plant Ash with 2 Dirt to get Lye.","iconUrl":"","tasks":[{"text":"Craft Lye","optional":false,"type":"item","itemId":"IR-ashlye","itemCount":1}]},
    {"id":15,"x":460,"y":780,"radius":20,"shape":"circle","title":"Soda Ash","subtitle":"Glass Flux","description":"Calcine Lye in Kiln to get Soda Ash.","iconUrl":"","tasks":[{"text":"Craft Soda Ash","optional":false,"type":"item","itemId":"IR-sodaash","itemCount":1}]},
    {"id":16,"x":240,"y":620,"radius":22,"shape":"circle","title":"Better Glass","subtitle":"Soda-Lime Formula","description":"Craft glass with soda flux for better quality.","iconUrl":"","tasks":[{"text":"Craft Glass Capsule (with soda)","optional":false,"type":"item","itemId":"IR-capsule-1000","itemCount":1}]},
    {"id":17,"x":240,"y":1120,"radius":20,"shape":"circle","title":"Autoclave","subtitle":"Sterilization","description":"Craft Autoclave for sterile processing.","iconUrl":"","tasks":[{"text":"Craft Autoclave","optional":false,"type":"item","itemId":"IR-autoclave","itemCount":1}]},
    {"id":18,"x":240,"y":1200,"radius":20,"shape":"circle","title":"Asepsis","subtitle":"Sterile Materials","description":"Sterilize capsule and nutrient gel separately.","iconUrl":"","tasks":[{"text":"Sterilize Capsule","optional":false,"type":"item","itemId":"IR-capsule-sterile","itemCount":1},{"text":"Sterilize Nutrient Gel","optional":false,"type":"item","itemId":"IR-nutrientgel-sterile","itemCount":1}]},
    {"id":19,"x":460,"y":1120,"radius":20,"shape":"circle","title":"Growth Regulators","subtitle":"Plant Hormones","description":"Create Growth Regulator Solution.","iconUrl":"","tasks":[{"text":"Craft Growth Regulator","optional":false,"type":"item","itemId":"IR-growthregulator","itemCount":1}]},
    {"id":20,"x":460,"y":1200,"radius":20,"shape":"circle","title":"Embryogenic Callus","subtitle":"Differentiated Cells","description":"Create Embryogenic Callus.","iconUrl":"","tasks":[{"text":"Craft Embryogenic Callus","optional":false,"type":"item","itemId":"IR-embryocallus","itemCount":1}]},
    {"id":21,"x":350,"y":1280,"radius":22,"shape":"circle","title":"Encapsulation","subtitle":"Synthetic Seed","description":"Assemble Synthetic Seed.","iconUrl":"","tasks":[{"text":"Craft Synthetic Seed","optional":false,"type":"item","itemId":"IR-synthetic-seed","itemCount":1}]},
    {"id":22,"x":350,"y":1440,"radius":28,"shape":"star","title":"Living Tree","subtitle":"Life from Stone","description":"Grow Oak Tree from Synthetic Seed.","iconUrl":"","tasks":[{"text":"Grow Oak Tree","optional":false,"type":"item","itemId":"IR-oaklog","itemCount":1}]},
    {"id":23,"x":550,"y":340,"radius":20,"shape":"circle","title":"Charcoal","subtitle":"Carbon for Metallurgy","description":"Produce Charcoal in Kiln.","iconUrl":"","tasks":[{"text":"Craft Charcoal x4","optional":false,"type":"item","itemId":"IR-charcoal","itemCount":4}]},
    {"id":24,"x":550,"y":480,"radius":20,"shape":"circle","title":"Refractory Brick","subtitle":"Furnace Materials","description":"Find Clay and fire into Bricks.","iconUrl":"","tasks":[{"text":"Find Clay x4","optional":false,"type":"item","itemId":"IR-clay","itemCount":4},{"text":"Craft Brick x4","optional":false,"type":"item","itemId":"IR-brick","itemCount":4}]},
    {"id":25,"x":550,"y":620,"radius":22,"shape":"circle","title":"Bloomery","subtitle":"Iron Age Begins","description":"Build Bloomery Furnace.","iconUrl":"","tasks":[{"text":"Build Bloomery","optional":false,"type":"item","itemId":"IR-bloomery","itemCount":1}]},
    {"id":26,"x":660,"y":620,"radius":20,"shape":"circle","title":"Iron Ore","subtitle":"Red Stones","description":"Find Iron Ore by sifting.","iconUrl":"","tasks":[{"text":"Find Iron Ore x4","optional":false,"type":"item","itemId":"IR-ironore","itemCount":4}]},
    {"id":27,"x":605,"y":760,"radius":24,"shape":"circle","title":"Iron Bloom","subtitle":"Sponge Iron","description":"Smelt Iron Bloom in Bloomery.","iconUrl":"","tasks":[{"text":"Smelt Iron Bloom","optional":false,"type":"item","itemId":"IR-ironbloom","itemCount":1}]},
    {"id":28,"x":605,"y":900,"radius":20,"shape":"circle","title":"Wrought Iron","subtitle":"Pure Iron","description":"Forge Wrought Iron from bloom.","iconUrl":"","tasks":[{"text":"Forge Wrought Iron","optional":false,"type":"item","itemId":"IR-wroughtiron","itemCount":1}]},
    {"id":29,"x":720,"y":900,"radius":20,"shape":"circle","title":"Steel Bloom","subtitle":"Carburization","description":"Create Steel Bloom via carburization.","iconUrl":"","tasks":[{"text":"Create Steel Bloom","optional":false,"type":"item","itemId":"IR-steelbloom","itemCount":1}]},
    {"id":30,"x":605,"y":1040,"radius":22,"shape":"circle","title":"Medium Steel","subtitle":"Tool Steel","description":"Forge Medium Steel Ingot.","iconUrl":"","tasks":[{"text":"Forge Medium Steel Ingot","optional":false,"type":"item","itemId":"IR-mediumsteelingot","itemCount":1}]},
    {"id":31,"x":720,"y":1040,"radius":20,"shape":"circle","title":"High Carbon Steel","subtitle":"Cutting Steel","description":"Create High Carbon Steel Ingot.","iconUrl":"","tasks":[{"text":"Create High Carbon Steel Ingot","optional":false,"type":"item","itemId":"IR-highcarbonsteelingot","itemCount":1}]},
    {"id":32,"x":605,"y":1180,"radius":20,"shape":"circle","title":"Steel Tools","subtitle":"Industrial Revolution","description":"Craft Steel Pickaxe and Axe.","iconUrl":"","tasks":[{"text":"Craft Steel Pickaxe","optional":false,"type":"item","itemId":"IR-steel-pickaxe","itemCount":1},{"text":"Craft Steel Axe","optional":false,"type":"item","itemId":"IR-steel-axe","itemCount":1}]},
    {"id":33,"x":720,"y":1180,"radius":20,"shape":"circle","title":"Cast Iron","subtitle":"Molten Iron","description":"Produce Cast Iron Ingot (optional).","iconUrl":"","tasks":[{"text":"Produce Cast Iron Ingot","optional":true,"type":"item","itemId":"IR-castironingot","itemCount":1}]},
    {"id":34,"x":660,"y":1320,"radius":32,"shape":"star","title":"STEEL AGE","subtitle":"MASTER OF METAL - FINAL QUEST","description":"You have conquered metallurgy! From rock to steel - Industrial Revolution begins.<br><br>FINAL QUEST: Create high carbon steel products.","iconUrl":"","tasks":[{"text":"Create High Carbon Steel x5","optional":false,"type":"item","itemId":"IR-highcarbonsteelingot","itemCount":5},{"text":"Obtain Cast Iron (optional)","optional":true,"type":"item","itemId":"IR-castironingot","itemCount":1}]}
  ],
  "edges": [
    {"from":1,"to":2},{"from":2,"to":3},{"from":2,"to":4},{"from":3,"to":5},{"from":4,"to":6},{"from":4,"to":7},{"from":5,"to":8},{"from":8,"to":9},{"from":9,"to":10},{"from":6,"to":10},{"from":10,"to":11},{"from":7,"to":13},{"from":13,"to":14},{"from":14,"to":15},{"from":15,"to":16},{"from":16,"to":8},{"from":8,"to":17},{"from":6,"to":19},{"from":19,"to":20},{"from":18,"to":20},{"from":20,"to":21},{"from":21,"to":12},{"from":18,"to":12},{"from":21,"to":22},{"from":22,"to":23},{"from":23,"to":24},{"from":24,"to":25},{"from":24,"to":26},{"from":25,"to":27},{"from":26,"to":27},{"from":27,"to":28},{"from":28,"to":29},{"from":28,"to":30},{"from":29,"to":30},{"from":30,"to":31},{"from":30,"to":32},{"from":31,"to":32},{"from":31,"to":33},{"from":32,"to":34},{"from":33,"to":34}
  ],
  "cameraX":0,"cameraY":0,"nextNodeId":35
};

const QuestBook = {
    isOpen: false,
    loadError: false,
    nodes: [],
    edges: [],
    progress: {},
    openNodeId: null,
    viewMode: 'graph',
    showHidden: false,

    async init() {
        this.progress = this.loadProgress();
        try {
            this.nodes = Array.isArray(EMBEDDED_QUEST_DATA.nodes) ? EMBEDDED_QUEST_DATA.nodes : [];
            this.edges = Array.isArray(EMBEDDED_QUEST_DATA.edges) ? EMBEDDED_QUEST_DATA.edges : [];
        } catch (err) {
            console.warn('Quest Book: could not load embedded quest data', err);
            this.loadError = true;
            this.nodes = [];
            this.edges = [];
        }
        this.syncCompletion();
        this.checkAutoTasks({ silent: true });
        this.loadUiState();
    },

    loadUiState() {
        try {
            const raw = localStorage.getItem(QUEST_UI_KEY);
            const ui = raw ? JSON.parse(raw) : {};
            this.showHidden = !!ui.showHidden;
        } catch (e) { /* ignore */ }
    },

    saveUiState() {
        try { localStorage.setItem(QUEST_UI_KEY, JSON.stringify({ showHidden: this.showHidden })); }
        catch (e) { /* ignore */ }
    },

    loadProgress() {
        try {
            const raw = localStorage.getItem(QUEST_PROGRESS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    },

    saveProgress() {
        try { localStorage.setItem(QUEST_PROGRESS_KEY, JSON.stringify(this.progress)); }
        catch (e) { /* storage unavailable, ignore */ }
    },

    // Wipes all quest progress (every node's completed tasks + completed
    // flag) back to a blank slate and persists that immediately. Used by
    // the "Reset Progress" button - a full restart of the quest line, not
    // a per-quest undo.
    resetProgress() {
        this.progress = {};
        this.saveProgress();
        this.openNodeId = null;
        renderQuestBook();
    },

    getNodeProgress(nodeId) {
        if (!this.progress[nodeId]) this.progress[nodeId] = { completedTasks: [], completed: false };
        return this.progress[nodeId];
    },

    getNode(id) { return this.nodes.find(n => n.id === id); },

    // The prerequisite graph, read straight off `edges`: requirementsFor
    // answers "what must be done before I can start this quest", and
    // unlocksFrom answers the reverse - "what does completing this quest
    // open up". Both are recomputed on demand (not cached), which is fine
    // at this project's scale (a handful of quests).
    requirementsFor(nodeId) { return this.edges.filter(e => e.to === nodeId).map(e => e.from); },
    unlocksFrom(nodeId) { return this.edges.filter(e => e.from === nodeId).map(e => e.to); },

    isCompleted(nodeId) { return !!this.getNodeProgress(nodeId).completed; },

    // Locked = at least one requirement isn't completed yet. Note this is
    // different from isVisible() below - a quest can be "unlocked" (its
    // requirements are done) but still not "visible" if the player hasn't
    // opened up that part of the chain. status() combines both ideas into
    // the three states the UI actually shows.
    isUnlocked(nodeId) {
        return this.requirementsFor(nodeId).every(r => this.isCompleted(r));
    },

    // The three states every quest can be in, used throughout the UI
    // (status badges, whether a quest can be opened, node coloring on the
    // graph, etc).
    status(nodeId) {
        if (this.isCompleted(nodeId)) return 'completed';
        if (!this.isUnlocked(nodeId)) return 'locked';
        return 'available';
    },

    // A quest is "visible" once its chain has actually been opened up:
    // quests with no requirements are always visible (starting points).
    // A quest with requirements only becomes visible once at least one of
    // its direct requirements is completed - i.e. quest 3/4 stay hidden
    // until quest 2 (their requirement) is done, even though quest 2 itself
    // was reachable earlier.
    isVisible(nodeId) {
        const reqs = this.requirementsFor(nodeId);
        if (reqs.length === 0) return true;
        return reqs.some(r => this.isCompleted(r));
    },

    // Player-driven: only used for "manual" tasks.
    toggleTask(nodeId, taskIndex) {
        if (this.status(nodeId) === 'locked') return;
        const node = this.getNode(nodeId);
        const task = node && node.tasks && node.tasks[taskIndex];
        if (task && task.type === 'item') return; // code-verified, not player-togglable
        const prog = this.getNodeProgress(nodeId);
        const i = prog.completedTasks.indexOf(taskIndex);
        if (i === -1) prog.completedTasks.push(taskIndex);
        else prog.completedTasks.splice(i, 1);
        this.syncCompletionForNode(nodeId);
        this.saveProgress();
        renderQuestBook();
    },

    markComplete(nodeId) {
        if (this.status(nodeId) === 'locked') return;
        this.getNodeProgress(nodeId).completed = true;
        this.saveProgress();
        renderQuestBook();
    },

    // Code-driven, but NOT automatic: re-checks every "item" task against
    // the current inventory. Previously this ran on every single inventory
    // change (pickup, craft, move between slots...), which was noisy and
    // meant quests could silently complete themselves in the background.
    // Now it only runs when the player explicitly presses the quest's
    // "Check" button (see renderQuestDetail's check button) or once at
    // startup, to catch progress made in a previous session.
    checkAutoTasks(opts) {
        const silent = opts && opts.silent;
        let changed = false;
        this.nodes.forEach(node => {
            const tasks = node.tasks || [];
            if (!tasks.some(t => t.type === 'item')) return;
            const prog = this.getNodeProgress(node.id);
            tasks.forEach((task, idx) => {
                if (task.type !== 'item') return;
                if (prog.completedTasks.includes(idx)) return; // already locked in
                const have = (typeof Inventory !== 'undefined' && Inventory.countItem) ? Inventory.countItem(task.itemId) : 0;
                const need = task.itemCount || 1;
                if (have >= need) {
                    prog.completedTasks.push(idx);
                    changed = true;
                }
            });
            const wasCompleted = prog.completed;
            this.syncCompletionForNode(node.id);
            if (prog.completed !== wasCompleted) changed = true;
        });
        if (changed) {
            this.saveProgress();
            if (!silent) renderQuestBook();
        }
        return changed;
    },

    // Live progress for a single "item" task, for display purposes.
    itemTaskProgress(task) {
        const have = (typeof Inventory !== 'undefined' && Inventory.countItem) ? Inventory.countItem(task.itemId) : 0;
        const need = task.itemCount || 1;
        return { have, need, met: have >= need };
    },

    syncCompletionForNode(nodeId) {
        const node = this.getNode(nodeId);
        if (!node) return;
        const prog = this.getNodeProgress(nodeId);
        const tasks = node.tasks || [];
        const required = tasks.filter(t => !t.optional);
        if (required.length > 0) {
            prog.completed = required.every(t => prog.completedTasks.includes(tasks.indexOf(t)));
        }
    },

    syncCompletion() {
        this.nodes.forEach(n => this.syncCompletionForNode(n.id));
    },

    toggleOverlay() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openNodeId = null;
            const searchEl = document.getElementById('quest-list-search');
            if (searchEl) searchEl.value = '';
        }
        renderQuestBook();
        if (this.isOpen && typeof QuestGraph !== 'undefined') {
            QuestGraph.onOpen();
        }
    },
    closeOverlay() { this.isOpen = false; renderQuestBook(); },

    // Opens a quest immediately - no camera animation, no delay.
    // A closed quest - either not-yet-reached, or reached but still locked
    // on its own requirements - can only be opened while the eye
    // (showHidden) toggle is on; otherwise this is a no-op.
    openQuest(id) {
        const openableNow = this.isVisible(id) && this.status(id) !== 'locked';
        if (!openableNow && !this.showHidden) return;
        this.openNodeId = id;
        renderQuestBook();
    },
    backToList() { this.openNodeId = null; renderQuestBook(); },

    setViewMode(mode) {
        this.viewMode = mode;
        renderQuestBook();
    },

    toggleShowHidden() {
        this.showHidden = !this.showHidden;
        this.saveUiState();
        renderQuestBook();
    }
};

function questIconMarkup(node) {
    const letter = escapeHtml((node.title || '?').charAt(0).toUpperCase());
    if (node.iconUrl) {
        const src = escapeHtml(node.iconUrl);
        return `<img src="${src}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` +
               `<span class="quest-icon-letter" style="display:none;">${letter}</span>`;
    }
    return `<span class="quest-icon-letter">${letter}</span>`;
}

function renderQuestBook() {
    const overlay = document.getElementById('quest-overlay');
    if (!overlay) return;

    if (!QuestBook.isOpen) {
        overlay.classList.remove('visible');
        return;
    }
    overlay.classList.add('visible');

    const titleEl = document.getElementById('quest-panel-title');
    const backBtn = document.getElementById('quest-back-btn');
    const graphView = document.getElementById('quest-graph-view');
    const detailView = document.getElementById('quest-detail-view');

    if (QuestBook.openNodeId !== null) {
        backBtn.classList.add('flex-visible');
        if (graphView) graphView.style.display = 'none';
        if (detailView) detailView.style.display = 'block';
        renderQuestDetail(QuestBook.openNodeId, titleEl, detailView);
    } else {
        backBtn.classList.remove('flex-visible');
        titleEl.textContent = 'Quest Book';
        if (detailView) detailView.style.display = 'none';
        if (graphView) graphView.style.display = 'flex';
        renderGraphView();
    }
}

function questVisibleForBrowsing(nodeId) {
    // What the player is allowed to see right now: either the quest is
    // actually visible (its chain has been opened up), or the eye toggle
    // is on and we show everything (greyed out) for reference.
    return QuestBook.isVisible(nodeId) || QuestBook.showHidden;
}

function renderGraphView() {
    const emptyEl = document.getElementById('quest-graph-empty');
    const wrapEl = document.getElementById('quest-graph-canvas-wrap');
    const listWrap = document.getElementById('quest-list-wrap');
    const listBtn = document.getElementById('quest-list-toggle');
    const eyeBtn = document.getElementById('quest-eye-toggle');
    const searchEl = document.getElementById('quest-list-search');

    if (listBtn) listBtn.classList.toggle('active', QuestBook.viewMode === 'list');
    if (eyeBtn) eyeBtn.classList.toggle('active', QuestBook.showHidden);
    // Search only makes sense (and is only shown) in list view - the graph
    // is a free-form pannable map, not something search results narrow down.
    if (searchEl) searchEl.style.display = QuestBook.viewMode === 'list' ? 'block' : 'none';

    if (QuestBook.nodes.length === 0) {
        if (wrapEl) wrapEl.style.display = 'none';
        if (listWrap) listWrap.style.display = 'none';
        if (emptyEl) {
            emptyEl.style.display = 'block';
            emptyEl.innerHTML = QuestBook.loadError
                ? `No quests found.<br>
                   Export a quest file from the Quest Editor and save it as<br>
                   <code>assets/quests.json</code> in the game folder.
                   <span class="quest-empty-hint">If you opened index.html directly as a file, quest data needs a local web server to load (e.g. "python -m http.server" or VSCode's Live Server).</span>`
                : `No quests yet.`;
        }
        return;
    }
    if (emptyEl) emptyEl.style.display = 'none';

    if (QuestBook.viewMode === 'list') {
        if (wrapEl) wrapEl.style.display = 'none';
        if (listWrap) { listWrap.style.display = 'block'; renderQuestListView(listWrap); }
    } else {
        if (listWrap) listWrap.style.display = 'none';
        if (wrapEl) wrapEl.style.display = 'block';
        if (typeof QuestGraph !== 'undefined') {
            QuestGraph.init();
            QuestGraph.draw();
        }
    }
}

// Search input lives in the toolbar (only visible in list view) and is
// wired up once at load time - independent of QuestGraph's canvas
// initialization, which only happens when the graph view is first shown.
// Previously the search listener was attached inside QuestGraph.init(),
// which meant it silently never fired if the Quest Book opened directly
// into list view (e.g. after a saved "last view" state) - the input looked
// interactive but typing into it did nothing.
function setupQuestSearch() {
    const searchEl = document.getElementById('quest-list-search');
    if (!searchEl) return;
    searchEl.addEventListener('input', () => {
        const listWrap = document.getElementById('quest-list-wrap');
        if (listWrap) renderQuestListView(listWrap);
    });
}

function renderQuestListView(listWrap) {
    const term = (document.getElementById('quest-list-search') || {}).value || '';
    const q = term.trim().toLowerCase();

    // With the eye toggle off, only quests whose chain has actually been
    // opened up are listed. With it on, every quest is listed - locked /
    // not-yet-reached ones just appear greyed out and can't be opened
    // except through eye mode itself.
    const visible = QuestBook.nodes.filter(n => questVisibleForBrowsing(n.id));
    const filtered = q
        ? visible.filter(n => (n.title || '').toLowerCase().includes(q) || (n.subtitle || '').toLowerCase().includes(q))
        : visible;

    if (filtered.length === 0) {
        listWrap.innerHTML = `<div class="quest-list-empty">${q ? 'No quests match your search.' : 'No quests to show yet.'}</div>`;
        return;
    }

    listWrap.innerHTML = '';
    filtered.forEach(node => {
        const status = QuestBook.status(node.id);
        const actuallyVisible = QuestBook.isVisible(node.id);
        // A quest is openable normally only once it's actually reached and
        // unlocked. Anything else (locked, or only shown via the eye
        // toggle) is greyed out and can only be opened while eye mode is on.
        const openableNow = actuallyVisible && status !== 'locked';
        const closed = !openableNow;
        const row = document.createElement('div');
        row.className = 'quest-list-item' + (closed ? ' locked' : '') + (!actuallyVisible ? ' hidden-quest' : '');
        const badge = status === 'completed' ? '✔' : (closed ? '🔒' : '');
        row.innerHTML = `
            <div class="quest-list-icon">${questIconMarkup(node)}</div>
            <div class="quest-list-info">
                <div class="quest-list-title">${escapeHtml(node.title || 'Untitled')}</div>
                <div class="quest-list-subtitle">${escapeHtml(node.subtitle || '')}</div>
            </div>
            <div class="quest-list-status">${badge}</div>
        `;
        if (openableNow || QuestBook.showHidden) {
            row.addEventListener('click', () => QuestBook.openQuest(node.id));
        }
        listWrap.appendChild(row);
    });
}

function renderQuestDetail(nodeId, titleEl, bodyEl) {
    const node = QuestBook.getNode(nodeId);
    if (!node) { QuestBook.backToList(); return; }
    const status = QuestBook.status(nodeId);
    titleEl.textContent = node.title || 'Untitled';
    bodyEl.innerHTML = '';

    const statusLabel = status === 'locked' ? 'Locked' : status === 'completed' ? 'Completed' : 'Available';
    const header = document.createElement('div');
    header.className = 'quest-detail-header';
    header.innerHTML = `
        <div class="quest-detail-icon">${questIconMarkup(node)}</div>
        <div>
            <div class="quest-detail-subtitle">${escapeHtml(node.subtitle || '')}</div>
            <div class="quest-detail-status quest-status-${status}">${statusLabel}</div>
        </div>
    `;
    bodyEl.appendChild(header);

    if (status === 'locked') {
        const reqs = QuestBook.requirementsFor(nodeId);
        if (reqs.length > 0) {
            const sec = document.createElement('div');
            sec.className = 'quest-section';
            sec.innerHTML = '<h4>Requires</h4>';
            reqs.forEach(reqId => {
                const reqNode = QuestBook.getNode(reqId);
                const tag = document.createElement('span');
                tag.className = 'quest-dep-tag' + (QuestBook.isCompleted(reqId) ? ' quest-dep-done' : '');
                tag.textContent = reqNode ? (reqNode.title || 'Quest ' + reqId) : ('Quest ' + reqId);
                if (reqNode) tag.addEventListener('click', () => QuestBook.openQuest(reqId));
                sec.appendChild(tag);
            });
            bodyEl.appendChild(sec);
        }
    }

    if (node.description) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Description</h4>';
        const desc = document.createElement('div');
        desc.className = 'quest-desc';
        desc.innerHTML = node.description; // authored via the Quest Editor, supports HTML/images
        sec.appendChild(desc);
        bodyEl.appendChild(sec);
    }

    const tasks = node.tasks || [];
    let hasUncheckedItemTask = false;
    if (tasks.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Tasks</h4>';
        const prog = QuestBook.getNodeProgress(nodeId);
        tasks.forEach((task, idx) => {
            const checked = prog.completedTasks.includes(idx);
            if (task.type === 'item') {
                // Code-verified, but only ON DEMAND: the player presses the
                // "Check" button below (not auto-checked as the inventory
                // changes). The live count is still shown so they can see
                // whether they actually have enough before checking.
                if (!checked) hasUncheckedItemTask = true;
                const live = QuestBook.itemTaskProgress(task);
                const row = document.createElement('div');
                row.className = 'quest-task-row auto' + (task.optional ? ' optional' : '');
                row.innerHTML = `
                    <span class="quest-task-check">${checked ? '✔' : '•'}</span>
                    <span>${escapeHtml(task.text)}${task.optional ? ' <em>(optional)</em>' : ''}
                        <em class="quest-task-progress">${checked ? live.need : Math.min(live.have, live.need)}/${live.need} ${escapeHtml(task.itemId || '')}</em>
                    </span>
                `;
                sec.appendChild(row);
            } else {
                const row = document.createElement('label');
                row.className = 'quest-task-row' + (task.optional ? ' optional' : '');
                const disabled = status === 'locked';
                row.innerHTML = `
                    <input type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                    <span>${escapeHtml(task.text)}${task.optional ? ' <em>(optional)</em>' : ''}</span>
                `;
                row.querySelector('input').addEventListener('change', () => QuestBook.toggleTask(nodeId, idx));
                sec.appendChild(row);
            }
        });
        bodyEl.appendChild(sec);

        // "Check" button: verifies every item-type task against the
        // player's current inventory right now, on demand. Only shown
        // while at least one item task is still unverified and the quest
        // isn't locked - once everything's checked off there's nothing
        // left to (re-)verify.
        if (hasUncheckedItemTask && status !== 'locked') {
            const checkBtn = document.createElement('button');
            checkBtn.className = 'quest-check-btn';
            checkBtn.textContent = 'Check';
            checkBtn.addEventListener('click', () => {
                const changed = QuestBook.checkAutoTasks();
                if (!changed) {
                    checkBtn.textContent = 'Not yet\u2026';
                    checkBtn.classList.add('quest-check-btn-fail');
                    setTimeout(() => {
                        checkBtn.textContent = 'Check';
                        checkBtn.classList.remove('quest-check-btn-fail');
                    }, 900);
                } else {
                    renderQuestDetail(nodeId, titleEl, bodyEl);
                }
            });
            bodyEl.appendChild(checkBtn);
        }
    } else if (status !== 'completed') {
        const btn = document.createElement('button');
        btn.className = 'quest-complete-btn';
        btn.textContent = 'Mark as complete';
        btn.disabled = status === 'locked';
        btn.addEventListener('click', () => QuestBook.markComplete(nodeId));
        bodyEl.appendChild(btn);
    }


    // Only list quests this opens up if they're actually reachable now
    // (or the eye toggle is on) - otherwise "Leads to" would spoil titles
    // for quests the player hasn't unlocked the chain for yet.
    const unlocks = QuestBook.unlocksFrom(nodeId).filter(uId => questVisibleForBrowsing(uId));
    if (unlocks.length > 0) {
        const sec = document.createElement('div');
        sec.className = 'quest-section';
        sec.innerHTML = '<h4>Leads to</h4>';
        unlocks.forEach(uId => {
            const uNode = QuestBook.getNode(uId);
            const revealed = QuestBook.isVisible(uId);
            const tag = document.createElement('span');
            tag.className = 'quest-dep-tag';
            tag.textContent = revealed ? (uNode ? (uNode.title || 'Quest ' + uId) : ('Quest ' + uId)) : '???';
            if (revealed) tag.addEventListener('click', () => QuestBook.openQuest(uId));
            else tag.style.cursor = 'default';
            sec.appendChild(tag);
        });
        bodyEl.appendChild(sec);
    }
}

// ============================================
// Quest Graph (canvas view)
// ============================================
// Read-only, pannable view of the same node graph the Quest Editor builds:
// same positions, shapes, icons and connections, just styled for the game
// and with search + click-to-view instead of editing.
const QuestGraph = {
    canvas: null,
    ctx: null,
    cameraX: 0,
    cameraY: 0,
    dpr: 1,
    initialized: false,
    isDragging: false,
    dragMoved: false,
    dragStart: { x: 0, y: 0 },
    dragCameraStart: { x: 0, y: 0 },
    _iconCache: {},

    init() {
        if (this.initialized) return;
        this.canvas = document.getElementById('quest-graph-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
        this.canvas.addEventListener('pointerleave', (e) => this.onPointerUp(e));
        window.addEventListener('resize', () => { this.resize(); this.draw(); });

        // Note: there is no search in the graph view by design - search is
        // list-view only (see setupQuestSearch()). The graph is a free-form
        // map you pan/click around; searching it would just jump the camera
        // around, which isn't useful here.

        this.initialized = true;
        this.resize();
    },

    // Called each time the Quest Book overlay is opened.
    onOpen() {
        this.init();
        this.resize();
        this.fitToNodes();
        this.draw();
    },

    resize() {
        if (!this.canvas) return;
        const wrap = this.canvas.parentElement;
        if (!wrap) return;
        const w = wrap.clientWidth, h = wrap.clientHeight;
        if (w > 0 && h > 0) {
            // Render at devicePixelRatio so the graph is crisp on retina /
            // high-DPI screens instead of looking pixelated. CSS keeps the
            // element's on-screen size at w x h; we just back it with more
            // pixels and scale the drawing context to match.
            const dpr = Math.min(window.devicePixelRatio || 1, 3);
            this.dpr = dpr;
            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';
            this.cssWidth = w;
            this.cssHeight = h;
            if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    },

    fitToNodes() {
        const nodes = QuestBook.nodes;
        if (!this.canvas || nodes.length === 0) return;
        const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
        const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
        const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
        this.cameraX = cx - (this.cssWidth || this.canvas.width) / 2;
        this.cameraY = cy - (this.cssHeight || this.canvas.height) / 2;
    },

    screenToWorld(sx, sy) { return { x: sx + this.cameraX, y: sy + this.cameraY }; },
    worldToScreen(wx, wy) { return { x: wx - this.cameraX, y: wy - this.cameraY }; },

    getEventPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },

    hitTestNode(mx, my) {
        for (const node of QuestBook.nodes) {
            if (!questVisibleForBrowsing(node.id)) continue;
            const s = this.worldToScreen(node.x, node.y);
            const dx = mx - s.x, dy = my - s.y;
            const r = (node.radius || 18) + 6;
            if (dx * dx + dy * dy <= r * r) return node.id;
        }
        return null;
    },

    onPointerDown(e) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStart = this.getEventPos(e);
        this.dragCameraStart = { x: this.cameraX, y: this.cameraY };
        try { this.canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    },

    onPointerMove(e) {
        if (!this.isDragging) return;
        const p = this.getEventPos(e);
        const dx = p.x - this.dragStart.x, dy = p.y - this.dragStart.y;
        if (Math.hypot(dx, dy) > 4) this.dragMoved = true;
        this.cameraX = this.dragCameraStart.x - dx;
        this.cameraY = this.dragCameraStart.y - dy;
        this.draw();
    },

    onPointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (!this.dragMoved) {
            const p = this.getEventPos(e);
            const hit = this.hitTestNode(p.x, p.y);
            // openQuest() itself enforces the rule: reachable quests open
            // normally, everything else only opens while eye mode is on.
            if (hit !== null) QuestBook.openQuest(hit);
        }
        try { this.canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    },

    nodeColors(status) {
        if (status === 'completed') return { fill: '#1a3a2a', stroke: '#4caf7d' };
        if (status === 'locked') return { fill: '#232640', stroke: '#45456a' };
        return { fill: '#1a3a4a', stroke: '#4fc3f7' };
    },

    drawShape(x, y, radius, shape) {
        const ctx = this.ctx;
        ctx.beginPath();
        if (shape === 'circle' || !shape) { ctx.arc(x, y, radius, 0, Math.PI * 2); return; }
        if (shape === 'star') {
            const spikes = 5, outerR = radius, innerR = radius * 0.45;
            const rot = -Math.PI / 2;
            for (let i = 0; i < spikes * 2; i++) {
                const r = i % 2 === 0 ? outerR : innerR;
                const angle = rot + (i * Math.PI) / spikes;
                const px = x + r * Math.cos(angle), py = y + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            return;
        }
        const sides = parseInt(shape, 10);
        if (isNaN(sides) || sides < 3) { ctx.arc(x, y, radius, 0, Math.PI * 2); return; }
        const step = (Math.PI * 2) / sides, start = -Math.PI / 2;
        for (let i = 0; i < sides; i++) {
            const angle = start + i * step;
            const px = x + radius * Math.cos(angle), py = y + radius * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
    },

    drawArrowhead(fromX, fromY, toX, toY, radius) {
        const ctx = this.ctx;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        const len = 9, w = 4.5;
        const tipX = toX - radius * Math.cos(angle);
        const tipY = toY - radius * Math.sin(angle);
        ctx.save();
        ctx.translate(tipX, tipY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-len, -w);
        ctx.lineTo(-len, w);
        ctx.closePath();
        ctx.fillStyle = 'rgba(130,160,210,0.55)';
        ctx.fill();
        ctx.restore();
    },

    drawLetter(x, y, node) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = 'bold 13px "Segoe UI", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((node.title || '?').charAt(0).toUpperCase(), x, y);
    },

    draw() {
        if (!this.ctx || !this.canvas || this.canvas.width === 0) return;
        const ctx = this.ctx;
        const W = this.cssWidth || this.canvas.width;
        const H = this.cssHeight || this.canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#12121f';
        ctx.fillRect(0, 0, W, H);

        // subtle dotted grid, matches the site's dark palette
        const spacing = 56;
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        const startX = -(((this.cameraX % spacing) + spacing) % spacing);
        const startY = -(((this.cameraY % spacing) + spacing) % spacing);
        for (let x = startX; x < W; x += spacing) {
            for (let y = startY; y < H; y += spacing) {
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // A node is drawable if it's actually visible (its chain has been
        // opened up), or the eye toggle is on (show everything, greyed out).
        const drawable = id => questVisibleForBrowsing(id);

        // edges - only between two drawable nodes
        QuestBook.edges.forEach(edge => {
            const from = QuestBook.getNode(edge.from), to = QuestBook.getNode(edge.to);
            if (!from || !to) return;
            if (!drawable(from.id) || !drawable(to.id)) return;
            const revealed = QuestBook.isVisible(to.id);
            const p1 = this.worldToScreen(from.x, from.y), p2 = this.worldToScreen(to.x, to.y);
            ctx.save();
            ctx.globalAlpha = revealed ? 1 : 0.35;
            ctx.strokeStyle = 'rgba(130,160,210,0.35)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            this.drawArrowhead(p1.x, p1.y, p2.x, p2.y, to.radius || 18);
            ctx.restore();
        });

        // nodes
        QuestBook.nodes.forEach(node => {
            if (!drawable(node.id)) return;
            const revealed = QuestBook.isVisible(node.id);
            const s = this.worldToScreen(node.x, node.y);
            const r = node.radius || 18;
            if (s.x < -r - 60 || s.x > W + r + 60 ||
                s.y < -r - 60 || s.y > H + r + 60) return;

            const status = QuestBook.status(node.id);
            const colors = revealed ? this.nodeColors(status) : { fill: '#20222f', stroke: '#3a3c50' };

            ctx.save();
            ctx.globalAlpha = (status === 'locked' ? 0.6 : 1) * (revealed ? 1 : 0.55);
            ctx.beginPath();
            this.drawShape(s.x, s.y, r, node.shape);
            ctx.fillStyle = colors.fill;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = colors.stroke;
            ctx.stroke();

            if (revealed && node.iconUrl) {
                if (!this._iconCache[node.iconUrl]) {
                    const im = new Image();
                    im.src = node.iconUrl;
                    im.onload = () => this.draw();
                    this._iconCache[node.iconUrl] = im;
                }
                const im = this._iconCache[node.iconUrl];
                if (im.complete && im.naturalWidth > 0) {
                    ctx.save();
                    ctx.beginPath();
                    this.drawShape(s.x, s.y, r, node.shape);
                    ctx.clip();
                    const size = r * 1.6;
                    ctx.drawImage(im, s.x - size / 2, s.y - size / 2, size, size);
                    ctx.restore();
                } else {
                    this.drawLetter(s.x, s.y, node);
                }
            } else if (revealed) {
                this.drawLetter(s.x, s.y, node);
            } else {
                // not-yet-reached quest shown via the eye toggle: render as
                // a plain "?" silhouette, no title/icon spoilers.
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.font = 'bold 13px "Segoe UI", Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('?', s.x, s.y);
            }
            ctx.restore();

            // status badge (locked / completed)
            if (revealed && status !== 'available') {
                ctx.save();
                ctx.globalAlpha = 1;
                const bx = s.x + r * 0.72, by = s.y - r * 0.72;
                ctx.beginPath();
                ctx.arc(bx, by, Math.max(7, r * 0.32), 0, Math.PI * 2);
                ctx.fillStyle = '#12121f';
                ctx.fill();
                ctx.font = Math.max(9, r * 0.42) + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = status === 'completed' ? '#4caf7d' : '#aab';
                ctx.fillText(status === 'completed' ? '\u2714' : '\ud83d\udd12', bx, by);
                ctx.restore();
            }

            // title label under the node
            ctx.save();
            ctx.globalAlpha = revealed ? 1 : 0.4;
            ctx.fillStyle = '#c8d4e4';
            ctx.font = '11px "Segoe UI", Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(revealed ? (node.title || 'Untitled') : '???', s.x, s.y + r + 4, 92);
            ctx.restore();
        });

    }
};

function setupQuestControls() {
    const toggleBtn = document.getElementById('quest-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => QuestBook.toggleOverlay());

    const closeBtn = document.getElementById('quest-close');
    if (closeBtn) closeBtn.addEventListener('click', () => QuestBook.closeOverlay());

    const backBtn = document.getElementById('quest-back-btn');
    if (backBtn) backBtn.addEventListener('click', () => QuestBook.backToList());

    const overlayEl = document.getElementById('quest-overlay');
    if (overlayEl) {
        overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) QuestBook.closeOverlay(); });
    }

    const listBtn = document.getElementById('quest-list-toggle');
    if (listBtn) listBtn.addEventListener('click', () => {
        QuestBook.setViewMode(QuestBook.viewMode === 'list' ? 'graph' : 'list');
    });

    const eyeBtn = document.getElementById('quest-eye-toggle');
    if (eyeBtn) eyeBtn.addEventListener('click', () => QuestBook.toggleShowHidden());

    // Reset progress: requires two taps (arm, then confirm within a short
    // window) instead of a native confirm() popup, so it's still a
    // deliberate action but doesn't block the UI with a browser dialog.
    const resetBtn = document.getElementById('quest-reset-toggle');
    if (resetBtn) {
        let armed = false;
        let armTimer = null;
        resetBtn.addEventListener('click', () => {
            if (!armed) {
                armed = true;
                resetBtn.classList.add('armed');
                resetBtn.title = 'Tap again to confirm reset';
                armTimer = setTimeout(() => {
                    armed = false;
                    resetBtn.classList.remove('armed');
                    resetBtn.title = 'Reset all quest progress';
                }, 3000);
            } else {
                clearTimeout(armTimer);
                armed = false;
                resetBtn.classList.remove('armed');
                resetBtn.title = 'Reset all quest progress';
                QuestBook.resetProgress();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'b' || e.key === 'B') {
            e.preventDefault();
            QuestBook.toggleOverlay();
        }
        if (e.key === 'Escape' && QuestBook.isOpen) {
            if (QuestBook.openNodeId !== null) QuestBook.backToList();
            else QuestBook.closeOverlay();
        }
    });
}

QuestBook.init().then(renderQuestBook);
setupQuestControls();
setupQuestSearch();
