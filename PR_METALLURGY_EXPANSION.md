# Pull Request: Metallurgy Expansion - From Stone Age to Steel

## Overview
This PR massively expands the game's crafting/survival progression from primitive stone-age basics up to the production of usable STEEL. Implements realistic metallurgical processes including Bloomery → Finery Forge → early Crucible/Bessemer process.

## Core Design Pillars Implemented

### 1. Hard Science / Pseudo-Scientific Accuracy
- Real chemistry and physics formulas (Fe₂O₃ + 3CO → 2Fe + 3CO₂)
- Realistic temperature thresholds (Bloomery: 1150-1250°C, Finery Forge: 1400-1500°C)
- Carbon content percentages (wrought iron <0.08%, steel 0.2-2.1%, cast iron >2.1%)
- Material properties and failure states

### 2. Grindy, Hard, Long Progression
- Multi-step ore processing (mining → crushing → washing → smelting → refining)
- Temperature management mechanics
- Airflow calculations for furnaces
- Failure states (overheating produces brittle cast iron requiring re-smelting)
- Impurity removal through slag formation

### 3. Scalable Quest System
- 75+ highly detailed, multi-step quests
- Quests teach game mechanics AND hard science concepts
- Example: "Quest 42: The Carbon Balance - Achieve exactly 0.5% carbon content in your bloom"

---

## Files Changed/Created

### New Content Summary

#### Items (40+ new items)
**Ores:**
- Bog Iron Ore, Hematite, Magnetite, Limonite, Iron Ore
- Crushed variants of each ore type
- Washed ore concentrates

**Fluxes:**
- Crushed Limestone (CaCO₃)
- Quicklime (CaO)
- Slag (iron silicate waste product)

**Fuels:**
- Charcoal (from wood pyrolysis)
- Bituminous Coal
- Coke (coal heated without air)

**Intermediates:**
- Sponge Iron (direct reduction product)
- Pig Iron (high-carbon intermediate)
- Wrought Iron Bloom
- Steel Bloom

**Final Products:**
- Wrought Iron Ingot
- Steel Ingot (various carbon contents)
- Cast Iron Ingot

#### Machines (15+ new machines/blocks)
- Hand-cranked Bellows (airflow generation)
- Clay Bloomery Furnace (1150-1250°C operation)
- Quern-stone (ore crushing)
- Sluice Box (ore washing/concentration)
- Heavy Anvil (metal working)
- Finery Forge (1400-1500°C refining)
- Crucible Furnace (steel production)
- Pyrometer Prototype (temperature measurement)
- Charcoal Pit (fuel production)
- Coke Oven (coal processing)

#### Mechanics
- Heat retention system
- Airflow calculation (CFM based on bellows operation)
- Impurity removal through flux reactions
- Carbon diffusion control
- Temperature monitoring and management

---

## Technical Implementation

### File Structure
All new content follows existing game patterns:
- Registry entries in `scripts/registry.js`
- Crafting recipes in `scripts/crafting.js` (via CraftingRegistry)
- Quest definitions in `assets/quests.json`
- Quest logic integration in `scripts/quests.js`

### Data Format Consistency
- TypeScript/JSON-compatible data structures
- Existing item/block ID convention (`IR-` prefix)
- Compatible with existing GUI system
- Integrates with existing tick-based processing

---

## Quest Line Structure (75 quests across 8 chapters)

### Chapter 1: Prospecting & Ore Identification (Quests 1-10)
- Learn to identify different iron ores
- Understand ore formation and geology
- Basic mining techniques

### Chapter 2: Fuel Production (Quests 11-20)
- Charcoal production via pyrolysis
- Coal processing and coking
- Fuel quality and burn characteristics

### Chapter 3: Ore Beneficiation (Quests 21-30)
- Crushing and grinding mechanics
- Gravity separation (sluice box)
- Ore concentration principles

### Chapter 4: The Bloomery (Quests 31-42)
- Chemistry of direct reduction
- Temperature control (1150-1250°C)
- Airflow management via bellows
- **Quest 42: The Carbon Balance** - achieve target carbon content

### Chapter 5: The Finery Forge (Quests 43-52)
- Decarburization of pig iron
- Oxidation reactions
- Wrought iron production

### Chapter 6: Steel Making (Quests 53-65)
- Crucible steel process
- Carbon control
- Quenching and tempering basics

### Chapter 7: Advanced Metallurgy (Quests 66-72)
- Alloy steels
- Heat treatment
- Quality testing

### Chapter 8: Industrial Dawn (Quests 73-75)
- Early Bessemer process
- Mass production concepts
- Final mastery quest

---

## Scientific Accuracy Notes

### Chemical Reactions Implemented
1. **Bloomery Reduction:** Fe₂O₃ + 3CO → 2Fe + 3CO₂
2. **Limestone Flux:** CaCO₃ → CaO + CO₂ (calcination)
3. **Slag Formation:** CaO + SiO₂ → CaSiO₃
4. **Decarburization:** C + O₂ → CO₂
5. **Carburization:** 3Fe + C → Fe₃C (cementite formation)

### Temperature Thresholds
- Bloomery operation: 1150-1250°C (solid-state reduction)
- Iron melting point: 1538°C (pure), lower with carbon
- Finery Forge: 1400-1500°C (semi-solid processing)
- Crucible steel: 1600-1700°C (full melting)

### Carbon Content Classes
- Wrought Iron: <0.08% C (malleable, low strength)
- Mild Steel: 0.08-0.3% C (general purpose)
- Medium Steel: 0.3-0.6% C (tools, springs)
- High Carbon Steel: 0.6-2.1% C (cutting tools)
- Cast Iron: >2.1% C (brittle, excellent casting)

---

## Testing Checklist
- [ ] All registry entries parse correctly
- [ ] Crafting recipes are balanced
- [ ] Quest chain is completable in order
- [ ] Temperature mechanics work as intended
- [ ] No circular dependencies in recipes
- [ ] All item IDs are unique
- [ ] Quest JSON validates properly

---

## Future Work (Out of Scope for This PR)
- Rolling mill for sheet/plate production
- Wire drawing
- Advanced alloy steels (chromium, nickel, vanadium)
- Full Bessemer converter implementation
- Open hearth furnace
- Metalworking tools (files, drills, taps)

---

## Author Notes
This expansion maintains the game's core philosophy of "hard science, grindy progression, meaningful choices." Every step from dirt to steel requires genuine understanding of the underlying processes, not just button-mashing. Players will learn real metallurgy while playing.

The quest system is designed to be educational without being preachy - scientific concepts are taught through gameplay mechanics and contextual quest descriptions rather than dry lectures.

Temperature management and airflow mechanics add a layer of skill-based challenge beyond simple resource gathering. Failed smelts and off-spec products provide learning opportunities and encourage experimentation.

---

**PR Status:** Ready for Review  
**Breaking Changes:** None (additive only)  
**Migration Required:** No (new content only)  
**Documentation:** Included in quest descriptions and item lore
