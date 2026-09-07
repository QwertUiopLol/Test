# Industrial Revolution: Reborn - TODO List

## ✅ COMPLETED TASKS

### Bug Fixes
- [x] **TEST_MODE default** - Changed `TEST_MODE = false` in game.js (was true)
- [x] **Drag cancel item loss** - Fixed in inventory.js: items now drop to ground when inventory is full instead of being silently destroyed
- [x] **Viewport recalculation optimization** - Moved calculateViewport() from every render to only on resize events
- [x] **HandleSlotClick swap logic** - Improved swap behavior to preserve original slot state and prevent item loss

### Progression Rebalancing
- [x] **Starting platform size** - Reduced from 7x7 to 5x5 for harder early game
- [x] **Starter items** - Normal mode now gives only 5 dirt blocks instead of 128 dirt + 16 cobblestone
- [x] **Block break times increased**:
  - IR-dirt: 20 → 30 ticks (1s → 1.5s)
  - IR-cobblestone: 40 → 60 ticks (2s → 3s)
  - IR-workbench: 25 → 40 ticks (1.25s → 2s)

---

## 🐛 BUG FIXES (Priority: High)

### Remaining Critical Bugs
1. **[crafting.js] Craft grid clear on full inventory** - Workbench closing returns items to inventory but if inventory is full, items may be lost. Same issue as inventory drag cancel.

2. **[fluids.js] Fluid capsule stacking edge case** - While Fluids.stacksMatch() is wired in, need to verify ALL merge points check it consistently (especially in GuiBlocks and Crafting systems).

### Visual/UI Bugs
3. **[registry.js] TextureCheck caching** - Missing textures may briefly show color fallback before confirming missing. Could cause flickering on first render.

4. **[quests.js] Quest Book fetch() requires server** - Documented limitation but could fall back to embedded quest data or provide better error messaging.

---

## ⚡ OPTIMIZATIONS (Priority: Medium)

### Performance
5. **[game.js] Render optimization** - renderWorld() repaints ALL cells every time. Implement dirty-rect rendering to only update changed cells (player moved, block broken/placed, etc.).

6. **[game.js] Cell pool management** - rebuildCellPool() destroys/recreates all DOM elements on viewport change. Consider virtual scrolling or recycling for smoother resizing.

7. **[tick.js] Tick system efficiency** - All onTick callbacks run every tick regardless of relevance. Add activation/deactivation for conditional ticking (e.g., only process GUI blocks when open/nearby).

8. **[registry.js] Texture loading** - TextureCheck loads all textures synchronously on demand. Preload critical textures during initial load to prevent mid-game hitches.

9. **[game.js] Chunk management** - Chunks are never unloaded. Implement chunk garbage collection for distant chunks to prevent memory bloat in long play sessions.

10. **[save.js] Save system** - Currently saves entire state. Implement incremental/delta saves to reduce storage writes and improve performance.

---

## 📈 PROGRESSION REBALANCING (Priority: High)

### Remaining Difficulty Adjustments
11. **[altDrop.js] Pebble drop rates** - ALT mode pebble drops likely too generous. Adjust probabilities:
    - Common pebbles (andesite/basalt): 10-15%
    - Rare pebbles (deepslate/blackstone): 3-5%
    - Humus (organic): <1%

12. **[registry.js] Recipe costs** - Review crafting recipes for resource sinks:
    - Mixer/Kiln recipes should require more base materials
    - Glass capsule recipe gives 2 per craft - balance against ingredient rarity

13. **[quests.js] Quest gating** - Quest chain is linear. Add branching paths:
    - Multiple approaches to same goal
    - Optional side quests for bonus rewards
    - Prestige/reset mechanics for replay value

### Resource Scarcity
14. **[registry.js] Stack sizes** - All items stack to 64. Consider:
    - Reduce fluid capsules to 16 (heavy/bulky)
    - Reduce raw ores/pebbles to 32
    - Keep processed materials at 64

15. **[crafting.js] Recipe complexity** - Add multi-step processing:
    - Raw ore → crushed → purified → smelted (instead of direct)
    - Byproducts/waste products from processing
    - Pollution/toxicity mechanics requiring cleanup

---

## 🎮 NEW WORLD INTERACTION MECHANICS (Priority: Medium-High)

### Core Mechanics
16. **[tInter.js] Tool system** - Implement tools with durability:
    - Pickaxe: Faster stone/cobble breaking
    - Shovel: Faster dirt/sand breaking
    - Axe: Faster wood/log breaking
    - Each tool has N uses before breaking
    - Tools crafted at workbench, upgraded through tiers

17. **[game.js] Multi-block structures** - Detect and validate multi-block formations:
    - Kiln (3x3 ring) becomes functional only when complete
    - Fluid Extractor multiblock variant
    - Large tanks, industrial machines
    - Visual feedback when structure is valid/invalid

18. **[tInter.js] Right-click interactions** - Expand right-click beyond split:
    - Rotate blocks (for non-randomDirection blocks)
    - Activate special block functions
    - Harvest partial resources

19. **[game.js] Gravity blocks** - Implement falling sand/gravel mechanics:
    - Certain blocks fall if unsupported
    - Can be used for traps, automatic farms
    - Requires collision detection updates

20. **[tInter.js] Block states** - Add block variants/states:
    - Wet dirt (from water interaction)
    - Cracked cobble (after heating/cooling)
    - Different wood plank types from different logs

### Environmental Systems
21. **[game.js] Water/fluid physics** - Expand fluids.js to world:
    - Water flows to adjacent lower tiles
    - Infinite water source mechanic (2x2 or L-shape)
    - Lava that solidifies on water contact
    - Flooding/flood protection mechanics

22. **[game.js] Plant growth system** - Sapling planting and growth:
    - Plant sapling on dirt/grass
    - Growth stages over time (use TickSystem)
    - Requirements: light level, hydration, bone meal accelerator
    - Harvest logs/leaves/apples when mature

23. **[game.js] Ore generation** - Replace void-only world gen:
    - Underground ore veins (copper, tin, iron, etc.)
    - Surface boulders (large deposit indicators)
    - Geodes with rare minerals
    - Quarry/mining dimension access

24. **[tInter.js] Excavation depth** - Add Y-level/depth mechanics:
    - Digging down reaches deeper layers
    - Different stone types at depth (granite, diorite, deepslate)
    - Bedrock at bottom layer
    - Cave systems, underground lakes

### Quality of Life
25. **[game.js] Minimap/Radar** - Show explored terrain:
    - Fog of war for unexplored areas
    - Markers for points of interest
    - Waypoint system for navigation

26. **[guiBlocks.js] Storage blocks** - Add chest/barrel storage:
    - 27+ slot storage blocks
    - Hopper-like transfer between inventories
    - Sorting/filtering systems

27. **[tInter.js] Conveyor belts** - Item transport:
    - Move items between machines automatically
    - Splitter/merger variants
    - Underground belts for crossing paths

28. **[game.js] Power system** - Energy infrastructure:
    - Generators (steam, combustion, renewable)
    - Power cables with loss over distance
    - Machines require power to operate
    - Battery buffers for storage

---

## 🔧 TECHNICAL DEBT (Priority: Low-Medium)

### Architecture
29. **[all files] Module pattern consistency** - Standardize module patterns across codebase.

30. **[all files] Event system** - Replace direct function calls with event emitter pattern.

31. **[save.js] Version migration** - Add save format versioning and backward compatibility.

32. **[registry.js] Data-driven design** - Move all block/item definitions to JSON files.

### Testing & Debugging
33. **[all files] Error handling** - Add try/catch guards around critical operations.

34. **[game.js] Debug tools** - Enhance debug overlay with FPS counter, memory usage, teleport command.

35. **[all files] Console logging** - Standardize log levels (debug, info, warn, error).

---

## 🎨 CONTENT ADDITIONS (Priority: Low)

### New Blocks/Items
36. **[registry.js] Wood variants** - Different tree types with corresponding planks.

37. **[registry.js] Stone variants** - Granite, diorite, andesite blocks with polished variants.

38. **[registry.js] Decoration blocks** - Carpets, banners, paintings, colored glass.

39. **[registry.js] Functional blocks** - Levers, buttons, pressure plates, doors, pistons.

### New Systems
40. **[registry.js + guiBlocks.js] Brewing system** - Potion making with brewing stand.

41. **[registry.js] Enchanting** - Item upgrades with enchanting table and anvil.

42. **[quests.json] End-game content** - Post-sapling progression, automation, space tier.

---

## 📝 DOCUMENTATION (Priority: Low)

43. **[README.md] Setup guide** - Clear instructions for local server setup.

44. **[CODE_COMMENTS.md] Architecture overview** - Document module dependencies and data flow.

45. **[CHANGELOG.md] Version history** - Track bug fixes, balance changes, new features.

---

## ✅ QUICK WINS (Can be done in <1 hour each)

- [x] Set `TEST_MODE = false` by default
- [x] Add viewport resize optimization
- [x] Increase cobblestone breakTimeTicks to 60
- [x] Fix drag-cancel item loss by dropping to ground
- [ ] Add keyboard shortcut hints to button titles (WASD, Q, E, etc.)
- [ ] Add pause menu with resume/save/quit options
- [ ] Add tooltips to all hotbar items showing name on hover
- [ ] Add confirmation dialog for "Reset Progress" buttons
- [ ] Add "eye" toggle explanation in quest UI tooltip

---

*Last updated: Current session*
*Total items: 45*
*Completed: 8*
*Remaining: 37*
