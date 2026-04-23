import type { Item } from '../../registries/ItemRegistry';

export const MISC_ITEMS: Record<string, Item> = {
    'door': {
        id: "door",
        name: "Wooden Door",
        description: "A door made of wood.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'djinn_lamp': {
        id: "djinn_lamp",
        name: "Djinn Lamp",
        description: "A magical lamp that grants a wish.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'arcane_turret': {
        id: "arcane_turret",
        name: "Arcane Turret",
        description: "An automated defense turret that fires arcane projectiles at hostile entities.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
        quantity: 1
    },
    'bed': {
        id: "bed",
        name: "Bed",
        description: "A place to sleep and set spawn.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'ant_hill': {
        id: "ant_hill",
        name: "Ant Hill",
        description: "Spawn point for ants.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'village_bell': {
        id: "village_bell",
        name: "Village Bell",
        description: "A resounding golden bell. Placing this will slowly attract villagers to the area to form a settlement.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'alchemy_table': {
        id: "alchemy_table",
        name: "Alchemy Table",
        description: "A mystical table used to brew potions from resources. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'pot': {
        id: "pot",
        name: "Pot",
        description: "A fragile pot. Can be thrown or broken.",
        category: "MISC",
        maxStack: 10,
        stackable: true,
        quantity: 1
    },
    'slime_puddle': {
        id: "slime_puddle",
        name: "Slime Puddle",
        description: "Spawns Slimes.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'spider_web': {
        id: "spider_web",
        name: "Spider Web",
        description: "Spawns Cave Spiders.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'demon_portal': {
        id: "demon_portal",
        name: "Demon Portal",
        description: "Spawns Fire Imps.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'bee_hive': {
        id: "bee_hive",
        name: "Bee Hive",
        description: "A buzzing bee hive. Can be placed in the world to spawn bees.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'buggy_ramp': {
        id: "buggy_ramp",
        name: "Buggy Ramp",
        description: "A wooden ramp specifically designed for sick Gnome Buggy jumps.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'tent': {
        id: "tent",
        name: "Tent",
        description: "A cozy tent. Can be placed to rest.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'archer_tent': {
        id: 'archer_tent',
        name: 'Archer Tent',
        description: 'A tent that spawns archers.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'dark_knight_tent': {
        id: 'dark_knight_tent',
        name: 'Dark Knight Spawner',
        description: 'A spawner that summons Dark Knights.',
        category: 'MISC',
        maxStack: 10,
        quantity: 1
    },
    'cooking_pot': {
        id: "cooking_pot",
        name: "Cooking Pot",
        description: "A large iron pot for brewing stews, soups, and feasts.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'carpenters_bench': {
        id: "carpenters_bench",
        name: "Carpenter's Bench",
        description: "A sturdy workbench for crafting wooden items and furniture. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'wooden_staircase': {
        id: "wooden_staircase",
        name: "Wooden Staircase",
        description: "A set of wooden stairs. Place in quick slot 1 to build up, or quick slot 2 to dig down.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'masonry_table': {
        id: "masonry_table",
        name: "Masonry Table",
        description: "A sturdy stone table for crafting masonry items. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'fabric_station': {
        id: "fabric_station",
        name: "Fabric Station",
        description: "A loom for weaving fabric from wool. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'leather_station': {
        id: "leather_station",
        name: "Leather Station",
        description: "A tanning rack and workbench for crafting leather goods. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'shrine': {
        id: "shrine",
        name: "Shrine",
        description: "A sacred altar to commune with the gods. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'storage_chest': {
        id: "storage_chest",
        name: "Storage Chest",
        description: "A wooden chest for storing items. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'dark_wizard_pedestal': {
        id: "dark_wizard_pedestal",
        name: "Shadow Pedestal",
        description: "A dark altar that summons an exiled wizard. Be prepared to reflect his magic!",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'dungeon_key': {
        id: "dungeon_key",
        name: "Dungeon Key",
        description: "A small key that unlocks basic dungeon doors.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'boss_key': {
        id: "boss_key",
        name: "Boss Key",
        description: "A large, ornate key that unlocks the boss room.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'furnace': {
        id: "furnace",
        name: "Furnace",
        description: "A stone furnace used for smelting ores into ingots. Can be placed in the world.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'anvil': {
        id: "anvil",
        name: "Anvil",
        description: "A heavy iron anvil used for smithing. Can be placed in the world next to a furnace to create a forge.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'spike_floor': {
        id: "spike_floor",
        name: "Spike Floor",
        description: "A floor trap with retractable spikes. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'pressure_plate': {
        id: "pressure_plate",
        name: "Pressure Plate",
        description: "A mechanism that triggers when stepped on. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'piston': {
        id: "piston",
        name: "Piston Wall",
        description: "A mechanical wall that extends when unpowered, and retracts when powered.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'lever': {
        id: "lever",
        name: "Lever",
        description: "A switch to toggle mechanisms. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'wire': {
        id: "wire",
        name: "Gnomish Wire",
        description: "Transmits mechanical power from levers and plates to other mechanisms.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'arrow_turret': {
        id: "arrow_turret",
        name: "Arrow Turret",
        description: "A mechanical turret that fires arrows when powered by a wire.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'miner_contract': {
        id: "miner_contract",
        name: "Miner Contract",
        description: "Hire a Miner. Place the miner and they will gather ore of any type within 12 squares of them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'gardener_contract': {
        id: "gardener_contract",
        name: "Gardener Contract",
        description: "Hire a Gardener. Place the gardener and they will farm the 12 squares around them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'guard_contract': {
        id: "guard_contract",
        name: "Guard Contract",
        description: "Hire a Guard. Place the guard to attack enemies fiercely within 12 squares of them.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'worker_contract': {
        id: "worker_contract",
        name: "Worker Contract",
        description: "Hire a Gnome Worker. Place next to a Chest and a Furnace to automate smelting.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'archer_contract': {
        id: "archer_contract",
        name: "Archer Contract",
        description: "Hire an Elven Archer. Place as a guard to fire arrows at nearby enemies automatically.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'gnome_buggy': {
        id: "gnome_buggy",
        name: "Gnome Buggy",
        description: "A fast ground vehicle engineered by gnomes. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'boat': {
        id: "boat",
        name: "Wooden Boat",
        description: "A small vessel for traversing rivers and oceans. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'skyship': {
        id: "skyship",
        name: "Gnomish Skyship",
        description: "A triumph of engineering! A flying ship that defies gravity. Use it to add to your Mounts menu.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'heavy_stone': {
        id: "heavy_stone",
        name: "Heavy Stone",
        description: "A very durable stone block. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'iron_block': {
        id: "iron_block",
        name: "Iron Block",
        description: "An extremely durable block of solid iron. Can be placed in the world.",
        category: "MISC",
        maxStack: 64,
        quantity: 1
    },
    'wood': {
        id: "wood",
        name: "Wood Log",
        description: "A sturdy piece of wood.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'stone': {
        id: "stone",
        name: "Stone Block",
        description: "A heavy block of stone.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'marble': {
        id: "marble",
        name: "Marble",
        description: "A smooth white marble block.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'black_marble': {
        id: "black_marble",
        name: "Black Marble",
        description: "A smooth black marble block.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'green_marble': {
        id: "green_marble",
        name: "Green Marble",
        description: "A smooth green marble block.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'obsidian': {
        id: "obsidian",
        name: "Obsidian",
        description: "A very hard, dark volcanic glass.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'lava_rock': {
        id: "lava_rock",
        name: "Lava Rock",
        description: "A porous rock formed from cooled lava.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'ruby': {
        id: "ruby",
        name: "Ruby",
        description: "A precious red gemstone.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'emerald': {
        id: "emerald",
        name: "Emerald",
        description: "A precious green gemstone.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'black_diamond': {
        id: "black_diamond",
        name: "Black Diamond",
        description: "An incredibly rare and hard black diamond.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'copper_ore': {
        id: "copper_ore",
        name: "Copper Ore",
        description: "A chunk of raw copper ore. Can be smelted.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'iron_ore': {
        id: "iron_ore",
        name: "Iron Ore",
        description: "A chunk of raw iron ore. Can be smelted.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'green_metal_ore': {
        id: "green_metal_ore",
        name: "Green Metal Ore",
        description: "A chunk of strange green metal ore.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'red_metal_ore': {
        id: "red_metal_ore",
        name: "Red Metal Ore",
        description: "A chunk of glowing red metal ore.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'mithril_ore': {
        id: "mithril_ore",
        name: "Mithril Ore",
        description: "A chunk of legendary mithril ore. Extremely rare.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'copper_ingot': {
        id: "copper_ingot",
        name: "Copper Ingot",
        description: "A smelted bar of copper. Used for basic crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'iron_ingot': {
        id: "iron_ingot",
        name: "Iron Ingot",
        description: "A smelted bar of iron. Used for sturdy crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'green_metal_ingot': {
        id: "green_metal_ingot",
        name: "Green Metal Ingot",
        description: "A smelted bar of green metal. Used for advanced crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'red_metal_ingot': {
        id: "red_metal_ingot",
        name: "Red Metal Ingot",
        description: "A smelted bar of red metal. Used for expert crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'mithril_ingot': {
        id: "mithril_ingot",
        name: "Mithril Ingot",
        description: "A smelted bar of mithril. Used for master crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'silver_ore': { id: "silver_ore", name: "Silver Ore", description: "Raw silver ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'gold_ore': { id: "gold_ore", name: "Gold Ore", description: "Raw gold ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'platinum_ore': { id: "platinum_ore", name: "Platinum Ore", description: "Raw platinum ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'adamantium_ore': { id: "adamantium_ore", name: "Adamantium Ore", description: "Raw adamantium ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'eternium_ore': { id: "eternium_ore", name: "Eternium Ore", description: "Raw eternium ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'black_metal_ore': { id: "black_metal_ore", name: "Black Metal Ore", description: "Raw black metal ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'blue_metal_ore': { id: "blue_metal_ore", name: "Blue Metal Ore", description: "Raw blue metal ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'orange_metal_ore': { id: "orange_metal_ore", name: "Orange Metal Ore", description: "Raw orange metal ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'purple_metal_ore': { id: "purple_metal_ore", name: "Purple Metal Ore", description: "Raw purple metal ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'yellow_metal_ore': { id: "yellow_metal_ore", name: "Yellow Metal Ore", description: "Raw yellow metal ore.", category: "MISC", quantity: 1, maxStack: 64 },
    'plUTONIUM_ore': { id: "plUTONIUM_ore", name: "Plutonium Ore", description: "Raw plutonium ore. It glows.", category: "MISC", quantity: 1, maxStack: 64 },
    'silver_ingot': { id: "silver_ingot", name: "Silver Ingot", description: "Smelted silver.", category: "MISC", quantity: 1, maxStack: 64 },
    'platinum_ingot': { id: "platinum_ingot", name: "Platinum Ingot", description: "Smelted platinum.", category: "MISC", quantity: 1, maxStack: 64 },
    'adamantium_ingot': { id: "adamantium_ingot", name: "Adamantium Ingot", description: "Smelted adamantium.", category: "MISC", quantity: 1, maxStack: 64 },
    'eternium_ingot': { id: "eternium_ingot", name: "Eternium Ingot", description: "Smelted eternium.", category: "MISC", quantity: 1, maxStack: 64 },
    'black_metal_ingot': { id: "black_metal_ingot", name: "Black Metal Ingot", description: "Smelted black metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'blue_metal_ingot': { id: "blue_metal_ingot", name: "Blue Metal Ingot", description: "Smelted blue metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'orange_metal_ingot': { id: "orange_metal_ingot", name: "Orange Metal Ingot", description: "Smelted orange metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'purple_metal_ingot': { id: "purple_metal_ingot", name: "Purple Metal Ingot", description: "Smelted purple metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'yellow_metal_ingot': { id: "yellow_metal_ingot", name: "Yellow Metal Ingot", description: "Smelted yellow metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'plUTONIUM_ingot': { id: "plUTONIUM_ingot", name: "Plutonium Ingot", description: "Smelted plutonium.", category: "MISC", quantity: 1, maxStack: 64 },
    'copper_block': { id: "copper_block", name: "Copper Block", description: "A solid block of copper.", category: "MISC", quantity: 1, maxStack: 64 },
    'silver_block': { id: "silver_block", name: "Silver Block", description: "A solid block of silver.", category: "MISC", quantity: 1, maxStack: 64 },
    'gold_block': { id: "gold_block", name: "Gold Block", description: "A solid block of gold.", category: "MISC", quantity: 1, maxStack: 64 },
    'platinum_block': { id: "platinum_block", name: "Platinum Block", description: "A solid block of platinum.", category: "MISC", quantity: 1, maxStack: 64 },
    'mithril_block': { id: "mithril_block", name: "Mithril Block", description: "A solid block of mithril.", category: "MISC", quantity: 1, maxStack: 64 },
    'adamantium_block': { id: "adamantium_block", name: "Adamantium Block", description: "A solid block of adamantium.", category: "MISC", quantity: 1, maxStack: 64 },
    'eternium_block': { id: "eternium_block", name: "Eternium Block", description: "A solid block of eternium.", category: "MISC", quantity: 1, maxStack: 64 },
    'black_metal_block': { id: "black_metal_block", name: "Black Metal Block", description: "A solid block of black metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'blue_metal_block': { id: "blue_metal_block", name: "Blue Metal Block", description: "A solid block of blue metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'green_metal_block': { id: "green_metal_block", name: "Green Metal Block", description: "A solid block of green metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'red_metal_block': { id: "red_metal_block", name: "Red Metal Block", description: "A solid block of red metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'orange_metal_block': { id: "orange_metal_block", name: "Orange Metal Block", description: "A solid block of orange metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'purple_metal_block': { id: "purple_metal_block", name: "Purple Metal Block", description: "A solid block of purple metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'yellow_metal_block': { id: "yellow_metal_block", name: "Yellow Metal Block", description: "A solid block of yellow metal.", category: "MISC", quantity: 1, maxStack: 64 },
    'plUTONIUM_block': { id: "plUTONIUM_block", name: "Plutonium Block", description: "A solid block of plutonium.", category: "MISC", quantity: 1, maxStack: 64 },
    'coal': {
        id: "coal",
        name: "Coal",
        description: "A lump of coal. Useful for smelting and crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'torch': {
        id: "torch",
        name: "Torch",
        description: "A wooden stick with a burning end. Provides light in dark places. Can be placed on the ground.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'copper_piece': {
        id: "copper_piece",
        name: "Copper Piece",
        description: "A common coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'iron_piece': {
        id: "iron_piece",
        name: "Iron Piece",
        description: "A valuable coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'bone': {
        id: "bone",
        name: "Bone",
        description: "A bone from a fallen skeleton.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'magma_core': {
        id: "magma_core",
        name: "Magma Core",
        description: "A glowing, intensely hot core from a Lava Golem.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'crystal_shard': {
        id: "crystal_shard",
        name: "Crystal Shard",
        description: "A glowing purple shard mined from the deep caverns.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'gold_piece': {
        id: "gold_piece",
        name: "Gold Piece",
        description: "A valuable coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'campfire': {
        id: "campfire",
        name: "Campfire",
        description: "A warm campfire. Provides light and slowly regenerates health when nearby.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'red_berry_seed': {
        id: "red_berry_seed",
        name: "Red Berry Seed",
        description: "Plant in tilled soil to grow a red berry bush.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'blue_berry_seed': {
        id: "blue_berry_seed",
        name: "Blue Berry Seed",
        description: "Plant in tilled soil to grow a blue berry bush.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'black_berry_seed': {
        id: "black_berry_seed",
        name: "Black Berry Seed",
        description: "Plant in tilled soil to grow a black berry bush.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'yellow_berry_seed': {
        id: "yellow_berry_seed",
        name: "Yellow Berry Seed",
        description: "Plant in tilled soil to grow a yellow berry bush.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'ancient_wood': {
        id: "ancient_wood",
        name: "Ancient Wood",
        description: "Wood from a very old, magical tree.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'ancient_leaves': {
        id: "ancient_leaves",
        name: "Ancient Leaves",
        description: "Luminescent leaves that pulse with energy.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'glowing_mushroom_block': {
        id: "glowing_mushroom_block",
        name: "Glowing Mushroom Block",
        description: "A gigantic chunk of a glowing mushroom.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'deep_slate': {
        id: "deep_slate",
        name: "Deep Slate",
        description: "A dark, dense stone found deep underground.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'mine_shaft_wood': {
        id: "mine_shaft_wood",
        name: "Mine Shaft Wood",
        description: "Heavy, load-bearing wood used for deep excavations.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'lantern_block': {
        id: "lantern_block",
        name: "Lantern",
        description: "A warm, glowing lantern to light up dark caverns.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    
    // THERA UPDATE
    'rune_key_thera': {
        id: "rune_key_thera",
        name: "Rune Key: Thera",
        description: "A mossy stone slab with a carving of a crescent canyon. Required to build the gateway to Thera.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'thera_gateway': {
        id: "thera_gateway",
        name: "Thera Gateway",
        description: "A portal to the prehistoric world of Thera. Place in the world and touch it to travel.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'halfling_house_spawner': {
        id: "halfling_house_spawner",
        name: "Halfling House",
        description: "A cozy hole in the ground where halflings rest.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'pit_bull_tent': {
        id: "pit_bull_tent",
        name: "Pit Bull Tent",
        description: "A sturdy, well-constructed tent.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'pomeranian_wagon': {
        id: "pomeranian_wagon",
        name: "Pomeranian Wagon",
        description: "A brightly colored, mobile wagon.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'terrier_tent': {
        id: "terrier_tent",
        name: "Terrier Tent",
        description: "A scrappy, haphazardly assembled tent.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'wolf_folk_camp': {
        id: "wolf_folk_camp",
        name: "Wolf Folk Camp",
        description: "A minimalist camp for the nomadic wolf folk.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'glass_block': {
        id: "glass_block",
        name: "Glass Block",
        description: "A block made of glass.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
        quantity: 1
    },
    'stone_staircase': {
        id: "stone_staircase",
        name: "Stone Staircase",
        description: "A sturdy staircase made of stone.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
        quantity: 1
    },
    'stone_door': {
        id: "stone_door",
        name: "Stone Door",
        description: "A heavy door made of stone.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
        quantity: 1
    }
};
