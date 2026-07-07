# DEORUM, THE FIRST CHAPTER - Cheat Sheet & Reference

This document serves as a read-only reference for the current state of the game. It provides a high-level overview of the architecture, systems, and features to ensure context is maintained across long development sessions.

## 1. Core Architecture
- **Engine:** Custom 2.5D top-down raycasting engine built on HTML5 Canvas (`src/game/Engine.ts`).
- **World Subsystem:** Modular chunk-based (16x16x32) procedural generation (`src/game/world/`). Includes `World.ts`, `Chunk.ts`, `ChunkManager.ts`, and `TerrainGenerator.ts`.
- **Player Subsystem:** Modular player systems (`src/game/player/`). Includes `Player.ts`, `PlayerInventory.ts`, `PlayerCombat.ts`, `PlayerInteraction.ts`, and `PlayerMovement.ts`.
- **UI:** React overlay for HUD, Inventory, Crafting, and Menus (`src/components/`).
- **State Management:** The `Engine` class holds the main game loop (`update` and `draw`), managing the `Player`, `World`, `Entities`, and `Particles`.

## 2. Player Systems (`src/game/player/`)
- **Stats:** Health, Mana, Stamina (all have regen mechanics). Handled in `Player.ts` and `PlayerCombat.ts`.
- **Inventory & Quick Slots:** Managed by `PlayerInventory.ts` (40 slots total, 3 quick slots for active weapons/tools). Equipment slots including MAIN_HAND, OFF_HAND, HEAD, CHEST, LEGS, RING_1, RING_2, AMULET.
- **Combat Mechanics:** Managed by `PlayerCombat.ts`. Includes melee/ranged attacks, spread computations, and projectile emissions.
- **Interaction Mechanics:** Managed by `PlayerInteraction.ts`. Includes block placement/destruction and chest opening. 
- **Movement Mechanics:** Managed by `PlayerMovement.ts`. Includes collision detection, jumping, dashing, and mount logic.

## 3. Talents (`src/game/Talents.ts`)
Players earn XP and level up to unlock/upgrade talents:
- **Gathering/Crafting:** Carpentry, Masonry, Fabric Crafting, Leather Crafting, Smithing.
- **Combat:** Swords (Spin Attack, Dash Attack, Sword Beam), Archery, Bolt Caster.
- **Utility/Stats:** Reading, Jump, Dash, Boomerang, Vitality, Endurance, Focus.

## 4. World & Environment (`src/game/world/`)
- **Generation:** Handled by `TerrainGenerator.ts` using simplex noise to create biomes, structures, caves, and ores.
- **Biomes:** Forest, Desert, Snow, Swamp, Corrupted, Abyssal Realm.
- **Planets / Dimensions:** Multiverse system with Arcane Gates leading to distinct worlds (e.g., ARETH - world of dragons).
- **Structures:** 
  - Dungeons (with heavy stone, iron blocks, spike floors, levers).
  - Wizard Towers (with unique floors/walls).
  - Enemy Camps (Goblin Camps, Orc Tents, Goblin Shaman Tents).
  - Bone Pile Spawners (spawns skeletons).
- **Blocks:** 
  - *Terrain:* Dirt, Grass, Stone, Water, Lava, Sand, Snow, Swamp Dirt, Corrupted Dirt.
  - *Ores:* Coal, Copper, Iron, Green Metal, Red Metal, Mithril, Ruby, Emerald, Black Diamond.
  - *Crafted/Placed:* Wood/Stone Tiles, Marble (White, Black, Green), Obsidian, Lava Rock.
  - *Interactive:* Chests, Doors, Levers, Pressure Plates, Spike Floors, Shrines, Campfires, Torches.

## 5. Entities & Combat (`src/game/Engine.ts`)
- **Enemies:** Goblins, Orcs, Skeletons, Bees, Ants, Lava Golems, Rats, Abyssal Horrors.
- **Animals (Mountable/Huntable):** Deer, Wolf, Sheep, Bear, Horse, Turtle, Unicorn, Giant Chicken, Giant Frog, Capybara.
- **Areth Wildlife:** Dragon Horse, Dragon Turtle, Giant Toad, Obsidian Sheep.
- **NPCs:** 
  - Merchant (Trades items).
  - Old Wizard (Found in Wizard Towers, uses Gemini AI for chat).
- **Combat Mechanics:**
  - Weapons have specific `damage`, `reach`, `cooldown`, and `spread`.
  - Pickaxes deal 5x damage to stone/ores. Axes deal 5x damage to wood/trees.
  - AoE spells (Fireball, Ice Spike) and Projectiles (Magic Missiles, Sword Beams).

## 6. Crafting & Stations (`src/game/Crafting.ts`)
Crafting requires specific stations and talent levels:
- **Carpenter's Bench:** Wood weapons, shields, bows.
- **Masonry Table:** Stone tiles, marble blocks.
- **Anvil:** Metal ingots, swords, armor, rings.
- **Furnace:** Smelting ores into ingots.
- **Fabric Station:** Cloth armor, bags.
- **Leather Station:** Leather armor, saddles.

## 7. Important Code Conventions
- **Block Drops:** When a block is destroyed, its drop logic is handled sequentially through `PlayerCombat.ts` and tools usage, which processes the item mapping from constants. Drops for entities are in `Updater.ts` and `AnimalUpdater.ts`.
- **Block Placement:** Validated and placed in `PlayerInventory.ts` and `PlayerCombat.ts`.
- **Colors:** Block colors are defined in `BLOCK_COLORS` inside `src/game/Constants.ts`.
- **Items:** All items are defined in the `ITEMS` dictionary in `src/game/Inventory.ts`.

## 8. Architectural Directives (The AI-First Workspace Rules)
To maintain an AI-friendly, scalable, and modular workspace, the following rules MUST be strictly followed:
- **RULE 1: No Monolithic Loops.** Never write massive `if/else` chains or switch statements for entities, structures, or rendering. Use Declarative Registries (e.g., `EntityBehaviorRegistry`, `AbilityRegistry`, `StructureRegistry`).
- **RULE 2: The 300-Line Rule.** If a file exceeds 300-400 lines (e.g., `Updater.ts`, `Renderer.ts`), it must be shattered into localized subsystems or controllers. 
- **RULE 3: Event-Driven UI.** Core engine code must NEVER touch the DOM or React directly. Rely entirely on `EventEmitter` to broadcast state changes (`engine.events.emit('HUD_UPDATE')`).
- **RULE 4: Strict Typing Everywhere.** Expose interfaces for all data structures (Entities, Drops, Stats) in a centralized type file (or at the top of domain controllers) so the compiler acts as an anti-hallucination guardrail.
- **RULE 5: Isolate Memory Boundaries.** Systems should not reach into each other's hidden states arbitrarily. Pass bounded contexts (e.g., `EntityBehaviorContext`, `AbilityContext`) rather than raw global pointers when possible.
- **RULE 6: The Archetype / Template Pattern.** Rather than code-diving hundreds of unique implementations (e.g., trying to read every one of the 400 Enemy Spawners), think in Archetypes. For example, an ENEMY SPAWNER can be summarized as: *A BLOCK, DESTRUCTIBLE, MAX OF 3 ACTIVE ENEMY SPAWNS*. By understanding the core templates of objects (Buildings, Tools, Companions, Spawners), you can create scalable additions without scanning hundreds of instances. Before digging into 50 files for an implementation, define its archetype template.
- **RULE 7: Dungeon Templates.** Instead of repeatedly hardcoding custom layouts for every dungeon (e.g., North Dungeon), use modular generation templates. A dungeon archetype looks like: `2 FLOOR DUNGEON, BLOCK_TYPE: [Wall/Floor block], SPAWNER_TYPE: [Goblin Tent / Bone Pile, etc]`. Pass these parameters into a generalized dungeon carving utility to spawn structurally identical but thematically distinct environments without copy-pasting loops.

## 9. The AI Game Dev Roadmap & Phase 5

To maintain simplicity, context awareness, and modularity, we are following a strict internal roadmap called **"THE AI GAME DEV UPDATE"**. We want you to feel that you have the creative tools you WANT, allowing you to easily read the codebase, understand systems, and paint with features rather than fighting spaghetti code.

### The Roadmap:
- **Phase 1: Player Subsystem Extrication (Completed).** Split the monolithic `Player.ts` and core loops into granular domain code (`PlayerCombat`, `PlayerInteraction`, `PlayerInventory`, etc.).
- **Phase 2: Procedural Segregation (Completed).** Extracted terrain generation, cave carving, and structure algorithms from chunk management (`TerrainGenerator.ts`, `DungeonGenerator.ts`).
- **Phase 3: Behavior Registries (Completed).** Replaced massive update switches for entity logic with `EntitySteeringSystem` and localized updaters.
- **Phase 4: UI Event Decoupling (Completed).** Ensured core code only emits events.
- **Phase 5: Data Defabrication & Renderer Decoupling (ACTIVE).** Splitting giant, 1000+ line registry files into categorical buckets. Breaking `EnemyRenderer`, `NPCRenderer`, `AnimalRenderer`, and massive item action switches down by genus and capability.
- **Phase 6: State Machine Unification.** Using a generalized, data-driven State Machine schema for UI, player actions, and complex logic transitions.

### Phase 5 Actions (Just Completed)
We shattered the massive renderer files (which were up to 1600+ lines long) into sub-folders:
- `src/game/renderers/enemies/` (categorized into `humanoids.ts`, `dragons.ts`, `undead.ts` etc.)
- `src/game/renderers/npcs/` (categorized into `villagers.ts`, `merchants.ts`, etc.)
- `src/game/renderers/animals/` (categorized into mounts, standard animals, etc.)

---
*Note: This file is automatically loaded into the AI's context to maintain a persistent understanding of the game's architecture.*


