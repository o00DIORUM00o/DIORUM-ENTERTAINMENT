import { CraftingRecipe } from '../../registries/RecipeRegistry';

export const CORE_RECIPES: CraftingRecipe[] = Object.values({
    'arcane_turret': {
        id: 'arcane_turret',
        name: 'Arcane Turret',
        description: 'An automated defense turret that fires arcane projectiles. Requires Smithing Level 3.',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
            { id: 'ruby', quantity: 1 },
            { id: 'stone_block', quantity: 10 }
        ],
        result: { id: 'arcane_turret', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 3 },
        requiredStation: 'anvil'
    },
    'grappling_hook': {
        id: 'grappling_hook',
        name: 'Grappling Hook',
        description: 'Fires a hook that pulls you to solid blocks. Uses 10 Mana. Requires Smithing Level 2.',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
            { id: 'fabric', quantity: 5 }
        ],
        result: { id: 'grappling_hook', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 2 },
        requiredStation: 'anvil'
    },
    'glider_wings': {
        id: 'glider_wings',
        name: 'Glider Wings',
        description: 'Equip to the body to drastically slow falling speed and glide horizontally while holding jump. Requires Fabric Crafting 3.',
        ingredients: [
            { id: 'fabric', quantity: 15 },
            { id: 'wood', quantity: 10 }
        ],
        result: { id: 'glider_wings', quantity: 1 },
        requiredTalent: { id: 'fabric_crafting', level: 3 },
        requiredStation: 'fabric_station'
    },
    'buggy_ramp': {
        id: 'buggy_ramp',
        name: 'Buggy Ramp',
        description: 'A wooden ramp to catch some air in the Gnome Buggy.',
        ingredients: [
            { id: 'wood', quantity: 4 }
        ],
        result: { id: 'buggy_ramp', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'alchemy_table': {
        id: 'alchemy_table',
        name: 'Alchemy Table',
        description: 'A mystical table used to brew potions from resources. Requires Carpentry Level 2.',
        ingredients: [
            { id: 'wood', quantity: 15 },
            { id: 'stone', quantity: 5 },
            { id: 'red_berry', quantity: 5 }
        ],
        result: { id: 'alchemy_table', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 2 },
        requiredStation: 'carpenters_bench',
        requiresLearning: true
    },
    'health_potion': {
        id: 'health_potion',
        name: 'Health Potion',
        description: 'Brew a health potion from red berries and a mushroom.',
        ingredients: [
            { id: 'red_berry', quantity: 5 },
            { id: 'mushroom', quantity: 1 }
        ],
        result: { id: 'health_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'mana_potion': {
        id: 'mana_potion',
        name: 'Mana Potion',
        description: 'Brew a mana potion from blue berries and a crystal shard.',
        ingredients: [
            { id: 'blue_berry', quantity: 5 },
            { id: 'crystal_shard', quantity: 1 }
        ],
        result: { id: 'mana_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'swiftness_potion': {
        id: 'swiftness_potion',
        name: 'Potion of Swiftness',
        description: 'Brew a potion that grants speed. Requires spider silk.',
        ingredients: [
            { id: 'yellow_berry', quantity: 5 },
            { id: 'fabric', quantity: 2 } // "fabric" acts as our spider silk right now
        ],
        result: { id: 'swiftness_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'pipe': {
        id: 'pipe',
        name: 'Smoking Pipe',
        description: 'Craft a wooden pipe.',
        ingredients: [
            { id: 'wood', quantity: 2 }
        ],
        result: { id: 'pipe', quantity: 1 }
    },
    'pipe_weed_green': {
        id: 'pipe_weed_green',
        name: 'Green Pipe Weed',
        description: 'Dry some green leaves to smoke.',
        ingredients: [
            { id: 'weed', quantity: 3 }
        ],
        result: { id: 'pipe_weed_green', quantity: 1 },
        requiredStation: 'cooking_pot'
    },
    'pipe_weed_red': {
        id: 'pipe_weed_red',
        name: 'Red Pipe Weed',
        description: 'Mix red berries with pipe weed for a spicy smoke.',
        ingredients: [
            { id: 'weed', quantity: 2 },
            { id: 'red_berry', quantity: 1 }
        ],
        result: { id: 'pipe_weed_red', quantity: 1 },
        requiredStation: 'cooking_pot'
    },
    'pipe_weed_blue': {
        id: 'pipe_weed_blue',
        name: 'Blue Pipe Weed',
        description: 'Mix blue berries with pipe weed for a cool smoke.',
        ingredients: [
            { id: 'weed', quantity: 2 },
            { id: 'blue_berry', quantity: 1 }
        ],
        result: { id: 'pipe_weed_blue', quantity: 1 },
        requiredStation: 'cooking_pot'
    },
    'pipe_weed_purple': {
        id: 'pipe_weed_purple',
        name: 'Purple Pipe Weed',
        description: 'A mystical blend of rare ingredients.',
        ingredients: [
            { id: 'weed', quantity: 2 },
            { id: 'red_berry', quantity: 1 },
            { id: 'blue_berry', quantity: 1 }
        ],
        result: { id: 'pipe_weed_purple', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'fire_vial': {
        id: 'fire_vial',
        name: 'Vial of Liquid Fire',
        description: 'Brew a highly explosive thrown vial of fire.',
        ingredients: [
            { id: 'crystal_shard', quantity: 2 },
            { id: 'coal', quantity: 2 }
        ],
        result: { id: 'fire_vial', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'conveyor_belt': {
        id: 'conveyor_belt',
        name: 'Conveyor Belt',
        description: 'Craft 5 Conveyor Belts.',
        ingredients: [
            { id: 'iron_ingot', quantity: 1 },
            { id: 'leather', quantity: 1 }
        ],
        result: { id: 'conveyor_belt', quantity: 5 },
        requiredStation: 'anvil'
    },
    'auto_miner': {
        id: 'auto_miner',
        name: 'Auto Miner',
        description: 'Craft an Auto Miner.',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
            { id: 'wood', quantity: 5 },
            { id: 'ruby', quantity: 1 }
        ],
        result: { id: 'auto_miner', quantity: 1 },
        requiredStation: 'anvil'
    },
    'auto_dropper': {
        id: 'auto_dropper',
        name: 'Auto Dropper',
        description: 'Craft an Auto Dropper.',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
            { id: 'wood', quantity: 5 }
        ],
        result: { id: 'auto_dropper', quantity: 1 },
        requiredStation: 'anvil'
    },
    'auto_crafter': {
        id: 'auto_crafter',
        name: 'Auto Crafter',
        description: 'Craft an Auto Crafter.',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
            { id: 'wood', quantity: 5 },
            { id: 'emerald', quantity: 1 }
        ],
        result: { id: 'auto_crafter', quantity: 1 },
        requiredStation: 'anvil'
    },
    'vacuum_hopper': {
        id: 'vacuum_hopper',
        name: 'Vacuum Hopper',
        description: 'Craft a Vacuum Hopper.',
        ingredients: [
            { id: 'iron_ingot', quantity: 4 },
            { id: 'wood', quantity: 4 },
            { id: 'ruby', quantity: 1 }
        ],
        result: { id: 'vacuum_hopper', quantity: 1 },
        requiredStation: 'anvil'
    },
    'wire': {
        id: 'wire',
        name: 'Gnomish Wire',
        description: 'Used to transmit power over distances.',
        ingredients: [
            { id: 'copper_ingot', quantity: 1 }
        ],
        result: { id: 'wire', quantity: 10 },
        requiredStation: 'anvil'
    },
    'piston': {
        id: 'piston',
        name: 'Piston Wall',
        description: 'A block that activates and retracts with logic.',
        ingredients: [
            { id: 'wood', quantity: 4 },
            { id: 'iron_ingot', quantity: 2 },
            { id: 'copper_ingot', quantity: 1 }
        ],
        result: { id: 'piston', quantity: 1 },
        requiredStation: 'anvil'
    },
    'arrow_turret': {
        id: 'arrow_turret',
        name: 'Arrow Turret',
        description: 'Fires projectiles when powered.',
        ingredients: [
            { id: 'stone', quantity: 5 },
            { id: 'wood_bow', quantity: 1 },
            { id: 'copper_ingot', quantity: 1 }
        ],
        result: { id: 'arrow_turret', quantity: 1 },
        requiredStation: 'anvil'
    },
    'abyssal_sword': {
        id: 'abyssal_sword',
        name: 'Abyssal Greatsword',
        description: 'A massive blade forged in the dark depths. Drains life from enemies.',
        ingredients: [
            { id: 'abyssal_core', quantity: 3 },
            { id: 'iron_ingot', quantity: 10 }
        ],
        result: { id: 'abyssal_sword', quantity: 1 },
        requiredStation: 'anvil'
    },
    'abyssal_armor': {
        id: 'abyssal_armor',
        name: 'Abyssal Plate Armor',
        description: 'Heavy armor made of abyssal brick and shadow.',
        ingredients: [
            { id: 'abyssal_core', quantity: 5 },
            { id: 'iron_ingot', quantity: 20 }
        ],
        result: { id: 'abyssal_armor', quantity: 1 },
        requiredStation: 'anvil'
    },
    'boat': {
        id: 'boat',
        name: 'Wooden Boat',
        description: 'Sail the seas. Adds a Boat to your Mount menu.',
        ingredients: [
            { id: 'wood', quantity: 50 },
            { id: 'fabric', quantity: 10 }
        ],
        result: { id: 'boat', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'skyship': {
        id: 'skyship',
        name: 'Gnomish Skyship',
        description: 'Take to the skies in a marvel of engineering. Adds a Skyship to your Mount menu.',
        ingredients: [
            { id: 'wood', quantity: 100 },
            { id: 'iron_ingot', quantity: 20 },
            { id: 'fabric', quantity: 50 }
        ],
        result: { id: 'skyship', quantity: 1 },
        requiredStation: 'anvil'
    },
    'gnome_buggy': {
        id: 'gnome_buggy',
        name: 'Gnome Buggy',
        description: 'A fast ground vehicle engineered by gnomes. Adds a Buggy to your Mount menu.',
        ingredients: [
            { id: 'iron_ingot', quantity: 15 },
            { id: 'copper_ingot', quantity: 5 },
            { id: 'leather', quantity: 4 }
        ],
        result: { id: 'gnome_buggy', quantity: 1 },
        requiredStation: 'anvil'
    },
    'saddle': {
        id: 'saddle',
        name: 'Saddle',
        description: 'Used to tame and ride wild animals.',
        ingredients: [
            { id: 'leather', quantity: 5 }
        ],
        result: { id: 'saddle', quantity: 1 }
    },
    'torch': {
        id: 'torch',
        name: 'Torch',
        description: 'Craft 10 torches from wood and coal.',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'coal', quantity: 1 }
        ],
        result: { id: 'torch', quantity: 10 }
    },
    'carpenters_bench': {
        id: 'carpenters_bench',
        name: 'Carpenter\'s Bench',
        description: 'A sturdy workbench for crafting wooden items and furniture.',
        ingredients: [
            { id: 'wood', quantity: 4 }
        ],
        result: { id: 'carpenters_bench', quantity: 1 },
        requiredTalent: {
            id: 'carpentry',
            level: 1
        }
    },
    'wooden_staircase': {
        id: 'wooden_staircase',
        name: 'Wooden Staircase',
        description: 'A set of wooden stairs. Place in quick slot 1 to build up, or quick slot 2 to dig down.',
        ingredients: [
            { id: 'wood', quantity: 2 }
        ],
        result: { id: 'wooden_staircase', quantity: 1 },
        requiredTalent: {
            id: 'carpentry',
            level: 1
        },
        requiredStation: 'carpenters_bench',
        requiresLearning: true
    },
    'storage_chest': {
        id: 'storage_chest',
        name: 'Storage Chest',
        description: 'A wooden chest for storing items.',
        ingredients: [
            { id: 'wood', quantity: 4 }
        ],
        result: { id: 'storage_chest', quantity: 1 },
        requiredTalent: {
            id: 'carpentry',
            level: 1
        },
        requiredStation: 'carpenters_bench',
        requiresLearning: true
    },
    'campfire': {
        id: 'campfire',
        name: 'Campfire',
        description: 'A warm campfire. Provides light and slowly regenerates health when nearby.',
        ingredients: [
            { id: 'wood', quantity: 2 },
            { id: 'coal', quantity: 1 }
        ],
        result: { id: 'campfire', quantity: 1 },
        requiresLearning: true
    },
    'wooden_boomerang': {
        id: 'wooden_boomerang',
        name: 'Wooden Boomerang',
        description: 'A curved piece of wood that returns when thrown.',
        ingredients: [
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'wooden_boomerang', quantity: 1 },
        requiredTalent: {
            id: 'carpentry',
            level: 1
        },
        requiresLearning: true
    },
    'green_metal_boomerang': {
        id: 'green_metal_boomerang',
        name: 'Green Metal Boomerang',
        description: 'A finely crafted boomerang. Spread Shot (Consumes 15 Mana)',
        ingredients: [
            { id: 'green_metal_ingot', quantity: 3 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'green_metal_boomerang', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 2
        },
        requiredStation: 'forge'
    },
    'red_metal_boomerang': {
        id: 'red_metal_boomerang',
        name: 'Red Metal Boomerang',
        description: 'A heavy, seeking boomerang. Seeker Shot (Consumes 20 Mana)',
        ingredients: [
            { id: 'red_metal_ingot', quantity: 3 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'red_metal_boomerang', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 3
        },
        requiredStation: 'forge'
    },
    'masonry_table': {
        id: 'masonry_table',
        name: 'Masonry Table',
        description: 'A sturdy stone table for crafting masonry items.',
        ingredients: [
            { id: 'stone', quantity: 10 },
            { id: 'wood', quantity: 5 }
        ],
        result: { id: 'masonry_table', quantity: 1 },
        requiredTalent: {
            id: 'masonry',
            level: 1
        }
    },
    'fabric_station': {
        id: 'fabric_station',
        name: 'Fabric Station',
        description: 'A loom for weaving fabric from wool.',
        ingredients: [
            { id: 'wood', quantity: 10 },
            { id: 'iron_ingot', quantity: 2 }
        ],
        result: { id: 'fabric_station', quantity: 1 },
        requiredTalent: {
            id: 'fabric_crafting',
            level: 1
        }
    },
    'fabric': {
        id: 'fabric',
        name: 'Fabric',
        description: 'A soft cloth woven from wool.',
        ingredients: [
            { id: 'wool', quantity: 2 }
        ],
        result: { id: 'fabric', quantity: 1 },
        requiredTalent: {
            id: 'fabric_crafting',
            level: 1
        },
        requiredStation: 'fabric_station'
    },
    'leather_station': {
        id: 'leather_station',
        name: 'Leather Station',
        description: 'A tanning rack and workbench for crafting leather goods.',
        ingredients: [
            { id: 'wood', quantity: 10 },
            { id: 'leather', quantity: 2 }
        ],
        result: { id: 'leather_station', quantity: 1 },
        requiredTalent: {
            id: 'leather_crafting',
            level: 1
        }
    },
    'shrine': {
        id: 'shrine',
        name: 'Shrine',
        description: 'A sacred altar to commune with the gods.',
        ingredients: [
            { id: 'stone', quantity: 20 },
            { id: 'crystal_shard', quantity: 2 }
        ],
        result: { id: 'shrine', quantity: 1 },
        requiredTalent: {
            id: 'masonry',
            level: 2
        },
        requiredStation: 'masonry_table',
        requiresLearning: true
    },
    'furnace': {
        id: 'furnace',
        name: 'Furnace',
        description: 'A stone furnace used for smelting ores into ingots.',
        ingredients: [
            { id: 'stone', quantity: 15 },
            { id: 'coal', quantity: 5 }
        ],
        result: { id: 'furnace', quantity: 1 },
        requiredTalent: {
            id: 'masonry',
            level: 1
        },
        requiredStation: 'masonry_table',
        requiresLearning: true
    },
    'anvil': {
        id: 'anvil',
        name: 'Anvil',
        description: 'A heavy iron anvil used for smithing.',
        ingredients: [
            { id: 'iron_ingot', quantity: 20 }
        ],
        result: { id: 'anvil', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 1
        },
        requiredStation: 'furnace',
        requiresLearning: true
    },
    'spike_floor': {
        id: 'spike_floor',
        name: 'Spike Floor',
        description: 'A floor trap with retractable spikes.',
        ingredients: [
            { id: 'stone', quantity: 5 },
            { id: 'iron_ingot', quantity: 2 }
        ],
        result: { id: 'spike_floor', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 1
        },
        requiredStation: 'forge',
        requiresLearning: true
    },
    'pressure_plate': {
        id: 'pressure_plate',
        name: 'Pressure Plate',
        description: 'A mechanism that triggers when stepped on.',
        ingredients: [
            { id: 'stone', quantity: 2 },
            { id: 'iron_ingot', quantity: 1 }
        ],
        result: { id: 'pressure_plate', quantity: 1 },
        requiredTalent: {
            id: 'masonry',
            level: 2
        },
        requiredStation: 'masonry_table',
        requiresLearning: true
    },
    'lever': {
        id: 'lever',
        name: 'Lever',
        description: 'A switch to toggle mechanisms.',
        ingredients: [
            { id: 'stone', quantity: 1 },
            { id: 'wood', quantity: 1 },
            { id: 'iron_ingot', quantity: 1 }
        ],
        result: { id: 'lever', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 1
        },
        requiredStation: 'forge',
        requiresLearning: true
    },
    'heavy_stone': {
        id: 'heavy_stone',
        name: 'Heavy Stone',
        description: 'A very durable stone block.',
        ingredients: [
            { id: 'stone', quantity: 10 }
        ],
        result: { id: 'heavy_stone', quantity: 1 },
        requiredTalent: {
            id: 'masonry',
            level: 2
        },
        requiredStation: 'masonry_table',
        requiresLearning: true
    },
    'iron_block': {
        id: 'iron_block',
        name: 'Iron Block',
        description: 'An extremely durable block of solid iron.',
        ingredients: [
            { id: 'iron_ingot', quantity: 9 }
        ],
        result: { id: 'iron_block', quantity: 1 },
        requiredTalent: {
            id: 'smithing',
            level: 1
        },
        requiredStation: 'forge',
        requiresLearning: true
    },
    'copper_block': { id: 'copper_block', name: 'Copper Block', description: 'A solid block of copper.', ingredients: [{ id: 'copper_ingot', quantity: 9 }], result: { id: 'copper_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'forge' },
    'silver_block': { id: 'silver_block', name: 'Silver Block', description: 'A solid block of silver.', ingredients: [{ id: 'silver_ingot', quantity: 9 }], result: { id: 'silver_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'forge' },
    'gold_block': { id: 'gold_block', name: 'Gold Block', description: 'A solid block of gold.', ingredients: [{ id: 'gold_ingot', quantity: 9 }], result: { id: 'gold_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'forge' },
    'platinum_block': { id: 'platinum_block', name: 'Platinum Block', description: 'A solid block of platinum.', ingredients: [{ id: 'platinum_ingot', quantity: 9 }], result: { id: 'platinum_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'mithril_block': { id: 'mithril_block', name: 'Mithril Block', description: 'A solid block of mithril.', ingredients: [{ id: 'mithril_ingot', quantity: 9 }], result: { id: 'mithril_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 3 }, requiredStation: 'forge' },
    'adamantium_block': { id: 'adamantium_block', name: 'Adamantium Block', description: 'A solid block of adamantium.', ingredients: [{ id: 'adamantium_ingot', quantity: 9 }], result: { id: 'adamantium_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 3 }, requiredStation: 'forge' },
    'eternium_block': { id: 'eternium_block', name: 'Eternium Block', description: 'A solid block of eternium.', ingredients: [{ id: 'eternium_ingot', quantity: 9 }], result: { id: 'eternium_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 3 }, requiredStation: 'forge' },
    'black_metal_block': { id: 'black_metal_block', name: 'Black Metal Block', description: 'A solid block of black metal.', ingredients: [{ id: 'black_metal_ingot', quantity: 9 }], result: { id: 'black_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'blue_metal_block': { id: 'blue_metal_block', name: 'Blue Metal Block', description: 'A solid block of blue metal.', ingredients: [{ id: 'blue_metal_ingot', quantity: 9 }], result: { id: 'blue_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'green_metal_block': { id: 'green_metal_block', name: 'Green Metal Block', description: 'A solid block of green metal.', ingredients: [{ id: 'green_metal_ingot', quantity: 9 }], result: { id: 'green_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'red_metal_block': { id: 'red_metal_block', name: 'Red Metal Block', description: 'A solid block of red metal.', ingredients: [{ id: 'red_metal_ingot', quantity: 9 }], result: { id: 'red_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'orange_metal_block': { id: 'orange_metal_block', name: 'Orange Metal Block', description: 'A solid block of orange metal.', ingredients: [{ id: 'orange_metal_ingot', quantity: 9 }], result: { id: 'orange_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'purple_metal_block': { id: 'purple_metal_block', name: 'Purple Metal Block', description: 'A solid block of purple metal.', ingredients: [{ id: 'purple_metal_ingot', quantity: 9 }], result: { id: 'purple_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'yellow_metal_block': { id: 'yellow_metal_block', name: 'Yellow Metal Block', description: 'A solid block of yellow metal.', ingredients: [{ id: 'yellow_metal_ingot', quantity: 9 }], result: { id: 'yellow_metal_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'forge' },
    'plUTONIUM_block': { id: 'plUTONIUM_block', name: 'Plutonium Block', description: 'A solid block of plutonium.', ingredients: [{ id: 'plUTONIUM_ingot', quantity: 9 }], result: { id: 'plUTONIUM_block', quantity: 1 }, requiredTalent: { id: 'smithing', level: 3 }, requiredStation: 'forge' },
    'silver_ingot': { id: 'silver_ingot', name: 'Silver Ingot', description: 'Smelt silver ore into a usable ingot.', ingredients: [{ id: 'silver_ore', quantity: 2 }, { id: 'coal', quantity: 1 }], result: { id: 'silver_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'gold_ingot_recipe': { id: 'gold_ingot_recipe', name: 'Gold Ingot', description: 'Smelt gold ore into a usable ingot.', ingredients: [{ id: 'gold_ore', quantity: 2 }, { id: 'coal', quantity: 2 }], result: { id: 'gold_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'platinum_ingot': { id: 'platinum_ingot', name: 'Platinum Ingot', description: 'Smelt platinum ore into a usable ingot.', ingredients: [{ id: 'platinum_ore', quantity: 2 }, { id: 'magma_core', quantity: 1 }], result: { id: 'platinum_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'adamantium_ingot': { id: 'adamantium_ingot', name: 'Adamantium Ingot', description: 'Smelt adamantium ore into a usable ingot.', ingredients: [{ id: 'adamantium_ore', quantity: 2 }, { id: 'magma_core', quantity: 1 }], result: { id: 'adamantium_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'eternium_ingot': { id: 'eternium_ingot', name: 'Eternium Ingot', description: 'Smelt eternium ore into a usable ingot.', ingredients: [{ id: 'eternium_ore', quantity: 2 }, { id: 'magma_core', quantity: 2 }], result: { id: 'eternium_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'black_metal_ingot': { id: 'black_metal_ingot', name: 'Black Metal Ingot', description: 'Smelt black metal ore into a usable ingot.', ingredients: [{ id: 'black_metal_ore', quantity: 2 }, { id: 'coal', quantity: 2 }], result: { id: 'black_metal_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'blue_metal_ingot': { id: 'blue_metal_ingot', name: 'Blue Metal Ingot', description: 'Smelt blue metal ore into a usable ingot.', ingredients: [{ id: 'blue_metal_ore', quantity: 2 }, { id: 'coal', quantity: 2 }], result: { id: 'blue_metal_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'orange_metal_ingot': { id: 'orange_metal_ingot', name: 'Orange Metal Ingot', description: 'Smelt orange metal ore into a usable ingot.', ingredients: [{ id: 'orange_metal_ore', quantity: 2 }, { id: 'coal', quantity: 2 }], result: { id: 'orange_metal_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'purple_metal_ingot': { id: 'purple_metal_ingot', name: 'Purple Metal Ingot', description: 'Smelt purple metal ore into a usable ingot.', ingredients: [{ id: 'purple_metal_ore', quantity: 2 }, { id: 'magma_core', quantity: 1 }], result: { id: 'purple_metal_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'yellow_metal_ingot': { id: 'yellow_metal_ingot', name: 'Yellow Metal Ingot', description: 'Smelt yellow metal ore into a usable ingot.', ingredients: [{ id: 'yellow_metal_ore', quantity: 2 }, { id: 'coal', quantity: 2 }], result: { id: 'yellow_metal_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'plUTONIUM_ingot': { id: 'plUTONIUM_ingot', name: 'Plutonium Ingot', description: 'Smelt plutonium ore into a usable ingot.', ingredients: [{ id: 'plUTONIUM_ore', quantity: 2 }, { id: 'magma_core', quantity: 2 }], result: { id: 'plUTONIUM_ingot', quantity: 1 }, requiredStation: 'furnace' },
    'copper_ingot': {
        id: 'copper_ingot',
        name: 'Copper Ingot',
        description: 'Smelt copper ore into a usable ingot.',
        ingredients: [
            { id: 'copper_ore', quantity: 2 },
            { id: 'coal', quantity: 1 }
        ],
        result: { id: 'copper_ingot', quantity: 1 },
        requiredStation: 'furnace'
    },
    'iron_ingot': {
        id: 'iron_ingot',
        name: 'Iron Ingot',
        description: 'Smelt iron ore into a usable ingot.',
        ingredients: [
            { id: 'iron_ore', quantity: 2 },
            { id: 'coal', quantity: 1 }
        ],
        result: { id: 'iron_ingot', quantity: 1 },
        requiredStation: 'furnace'
    },
    'green_metal_ingot': {
        id: 'green_metal_ingot',
        name: 'Green Metal Ingot',
        description: 'Smelt green metal ore into a usable ingot.',
        ingredients: [
            { id: 'green_metal_ore', quantity: 2 },
            { id: 'coal', quantity: 2 }
        ],
        result: { id: 'green_metal_ingot', quantity: 1 },
        requiredStation: 'furnace'
    },
    'red_metal_ingot': {
        id: 'red_metal_ingot',
        name: 'Red Metal Ingot',
        description: 'Smelt red metal ore into a usable ingot.',
        ingredients: [
            { id: 'red_metal_ore', quantity: 2 },
            { id: 'coal', quantity: 2 }
        ],
        result: { id: 'red_metal_ingot', quantity: 1 },
        requiredStation: 'furnace'
    },
    'mithril_ingot': {
        id: 'mithril_ingot',
        name: 'Mithril Ingot',
        description: 'Smelt mithril ore into a usable ingot. Requires intense heat.',
        ingredients: [
            { id: 'mithril_ore', quantity: 2 },
            { id: 'magma_core', quantity: 1 }
        ],
        result: { id: 'mithril_ingot', quantity: 1 },
        requiredStation: 'furnace'
    },
    'fabric_cap': { id: 'fabric_cap', name: 'Fabric Cap', description: 'A simple cap made of fabric.', ingredients: [{ id: 'fabric', quantity: 3 }], result: { id: 'fabric_cap', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_tunic': { id: 'fabric_tunic', name: 'Fabric Tunic', description: 'A simple tunic made of fabric.', ingredients: [{ id: 'fabric', quantity: 5 }], result: { id: 'fabric_tunic', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_pants': { id: 'fabric_pants', name: 'Fabric Pants', description: 'Simple pants made of fabric.', ingredients: [{ id: 'fabric', quantity: 4 }], result: { id: 'fabric_pants', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_shoes': { id: 'fabric_shoes', name: 'Fabric Shoes', description: 'Simple shoes made of fabric.', ingredients: [{ id: 'fabric', quantity: 3 }], result: { id: 'fabric_shoes', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_cloak': { id: 'fabric_cloak', name: 'Fabric Cloak', description: 'A simple cloak made of fabric.', ingredients: [{ id: 'fabric', quantity: 2 }], result: { id: 'fabric_cloak', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_gloves': { id: 'fabric_gloves', name: 'Fabric Gloves', description: 'Simple gloves made of fabric.', ingredients: [{ id: 'fabric', quantity: 2 }], result: { id: 'fabric_gloves', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_belt': { id: 'fabric_belt', name: 'Fabric Belt', description: 'A simple belt made of fabric.', ingredients: [{ id: 'fabric', quantity: 2 }], result: { id: 'fabric_belt', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'fabric_shoulders': { id: 'fabric_shoulders', name: 'Fabric Shoulders', description: 'Simple shoulder pads made of fabric.', ingredients: [{ id: 'fabric', quantity: 3 }], result: { id: 'fabric_shoulders', quantity: 1 }, requiredTalent: { id: 'fabric_crafting', level: 1 }, requiredStation: 'fabric_station' },
    'leather_cap': { id: 'leather_cap', name: 'Leather Cap', description: 'A sturdy cap made of leather.', ingredients: [{ id: 'leather', quantity: 3 }], result: { id: 'leather_cap', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_tunic': { id: 'leather_tunic', name: 'Leather Tunic', description: 'A sturdy tunic made of leather.', ingredients: [{ id: 'leather', quantity: 5 }], result: { id: 'leather_tunic', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_pants': { id: 'leather_pants', name: 'Leather Pants', description: 'Sturdy pants made of leather.', ingredients: [{ id: 'leather', quantity: 4 }], result: { id: 'leather_pants', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_boots': { id: 'leather_boots', name: 'Leather Boots', description: 'Sturdy boots made of leather.', ingredients: [{ id: 'leather', quantity: 3 }], result: { id: 'leather_boots', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_gloves': { id: 'leather_gloves', name: 'Leather Gloves', description: 'Sturdy gloves made of leather.', ingredients: [{ id: 'leather', quantity: 2 }], result: { id: 'leather_gloves', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_belt': { id: 'leather_belt', name: 'Leather Belt', description: 'A sturdy belt made of leather.', ingredients: [{ id: 'leather', quantity: 2 }], result: { id: 'leather_belt', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'leather_spaulders': { id: 'leather_spaulders', name: 'Leather Spaulders', description: 'Sturdy shoulder pads made of leather.', ingredients: [{ id: 'leather', quantity: 3 }], result: { id: 'leather_spaulders', quantity: 1 }, requiredTalent: { id: 'leather_crafting', level: 1 }, requiredStation: 'leather_station' },
    'iron_helmet': { id: 'iron_helmet', name: 'Iron Helmet', description: 'A heavy helmet made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 3 }], result: { id: 'iron_helmet', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_chestplate': { id: 'iron_chestplate', name: 'Iron Chestplate', description: 'A heavy chestplate made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 5 }], result: { id: 'iron_chestplate', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_greaves': { id: 'iron_greaves', name: 'Iron Greaves', description: 'Heavy greaves made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 4 }], result: { id: 'iron_greaves', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_boots': { id: 'iron_boots', name: 'Iron Boots', description: 'Heavy boots made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 3 }], result: { id: 'iron_boots', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_gauntlets': { id: 'iron_gauntlets', name: 'Iron Gauntlets', description: 'Heavy gauntlets made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 2 }], result: { id: 'iron_gauntlets', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_belt': { id: 'iron_belt', name: 'Iron Belt', description: 'A heavy belt made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 2 }], result: { id: 'iron_belt', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_pauldrons': { id: 'iron_pauldrons', name: 'Iron Pauldrons', description: 'Heavy shoulder pads made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 3 }], result: { id: 'iron_pauldrons', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'copper_ring': { id: 'copper_ring', name: 'Copper Ring', description: 'A simple ring made of copper.', ingredients: [{ id: 'copper_ingot', quantity: 1 }], result: { id: 'copper_ring', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_ring': { id: 'iron_ring', name: 'Iron Ring', description: 'A sturdy ring made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 1 }], result: { id: 'iron_ring', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'copper_necklace': { id: 'copper_necklace', name: 'Copper Necklace', description: 'A simple necklace made of copper.', ingredients: [{ id: 'copper_ingot', quantity: 2 }], result: { id: 'copper_necklace', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'iron_necklace': { id: 'iron_necklace', name: 'Iron Necklace', description: 'A sturdy necklace made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 2 }], result: { id: 'iron_necklace', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'hoe_1': {
        id: 'hoe_1',
        name: 'Wooden Hoe',
        description: 'Used to till dirt and grass into soil.',
        ingredients: [
            { id: 'wood', quantity: 3 }
        ],
        result: { id: 'hoe_1', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 1 },
        requiredStation: 'carpenters_bench'
    },
    'watering_can': {
        id: 'watering_can',
        name: 'Watering Can',
        description: 'Used to water dry tilled soil.',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 }
        ],
        result: { id: 'watering_can', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 1 },
        requiredStation: 'anvil'
    },
    'conveyor_belt_n': { id: 'conveyor_belt_n', name: 'Conveyor Belt (North)', description: 'Moves items North automatically.', ingredients: [{ id: 'iron_ingot', quantity: 1 }, { id: 'leather', quantity: 1 }], result: { id: 'conveyor_belt_n', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'conveyor_belt_s': { id: 'conveyor_belt_s', name: 'Conveyor Belt (South)', description: 'Moves items South automatically.', ingredients: [{ id: 'iron_ingot', quantity: 1 }, { id: 'leather', quantity: 1 }], result: { id: 'conveyor_belt_s', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'conveyor_belt_e': { id: 'conveyor_belt_e', name: 'Conveyor Belt (East)', description: 'Moves items East automatically.', ingredients: [{ id: 'iron_ingot', quantity: 1 }, { id: 'leather', quantity: 1 }], result: { id: 'conveyor_belt_e', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'conveyor_belt_w': { id: 'conveyor_belt_w', name: 'Conveyor Belt (West)', description: 'Moves items West automatically.', ingredients: [{ id: 'iron_ingot', quantity: 1 }, { id: 'leather', quantity: 1 }], result: { id: 'conveyor_belt_w', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'worker_gnome': { id: 'worker_gnome', name: 'Worker Gnome', description: 'A magical animated gnome that works the land.', ingredients: [{ id: 'emerald', quantity: 1 }, { id: 'iron_ingot', quantity: 5 }, { id: 'slime_ball', quantity: 5 }], result: { id: 'worker_gnome', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'archer_mercenary': { id: 'archer_mercenary', name: 'Archer Mercenary Post', description: 'Shoots arrows at nearby enemies.', ingredients: [{ id: 'ruby', quantity: 1 }, { id: 'iron_ingot', quantity: 5 }, { id: 'wood', quantity: 10 }], result: { id: 'archer_mercenary', quantity: 1 }, requiredTalent: { id: 'smithing', level: 2 }, requiredStation: 'anvil' },
    'golden_shovel': {
        id: 'golden_shovel',
        name: 'Golden Shovel',
        description: 'A delicate shovel used to extract honeycombs from Bee Hives safely.',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'copper_ingot', quantity: 5 }
        ],
        result: { id: 'golden_shovel', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 2 },
        requiredStation: 'anvil'
    },
    'wooden_sword': {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        description: 'A basic training sword made of wood.',
        ingredients: [
            { id: 'wood', quantity: 4 }
        ],
        result: { id: 'wooden_sword', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 1 },
        requiredStation: 'carpenters_bench'
    },
    'fishing_pole': {
        id: 'fishing_pole',
        name: 'Fishing Pole',
        description: 'Cast into water blocks to fish! (Equip and attack water).',
        ingredients: [
            { id: 'wood', quantity: 3 }
        ],
        result: { id: 'fishing_pole', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 1 },
        requiredStation: 'carpenters_bench'
    },
    'copper_broadsword': {
        id: 'copper_broadsword',
        name: 'Copper Broadsword',
        description: 'A simple but effective broadsword made of copper.',
        ingredients: [
            { id: 'copper_ingot', quantity: 3 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'copper_broadsword', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 1 },
        requiredStation: 'anvil'
    },
    'iron_longsword': {
        id: 'iron_longsword',
        name: 'Iron Longsword',
        description: 'A well-crafted longsword made of iron.',
        ingredients: [
            { id: 'iron_ingot', quantity: 4 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'iron_longsword', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 2 },
        requiredStation: 'anvil'
    },
    'mithril_greatsword': {
        id: 'mithril_greatsword',
        name: 'Mithril Greatsword',
        description: 'A legendary greatsword forged from mithril.',
        ingredients: [
            { id: 'mithril_ingot', quantity: 5 },
            { id: 'magma_core', quantity: 1 },
            { id: 'wood', quantity: 2 }
        ],
        result: { id: 'mithril_greatsword', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 3 },
        requiredStation: 'anvil'
    },
    'wooden_shield': { id: 'wooden_shield', name: 'Wooden Shield', description: 'A basic shield made of wood.', ingredients: [{ id: 'wood', quantity: 5 }], result: { id: 'wooden_shield', quantity: 1 }, requiredTalent: { id: 'carpentry', level: 1 }, requiredStation: 'carpenters_bench' },
    'iron_shield': { id: 'iron_shield', name: 'Iron Shield', description: 'A sturdy shield made of iron.', ingredients: [{ id: 'iron_ingot', quantity: 4 }, { id: 'wood', quantity: 2 }], result: { id: 'iron_shield', quantity: 1 }, requiredTalent: { id: 'smithing', level: 1 }, requiredStation: 'anvil' },
    'shortbow_1': {
        id: 'shortbow_1',
        name: 'Wooden Shortbow',
        description: 'A simple bow crafted from wood.',
        ingredients: [
            { id: 'wood', quantity: 5 }
        ],
        result: { id: 'shortbow_1', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 1 },
        requiredStation: 'carpenters_bench'
    },
    'arrow_1': {
        id: 'arrow_1',
        name: 'Wooden Arrow',
        description: 'Craft 10 wooden arrows.',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'stone', quantity: 1 }
        ],
        result: { id: 'arrow_1', quantity: 10 },
        requiredTalent: { id: 'carpentry', level: 1 },
        requiredStation: 'carpenters_bench'
    },
    'iron_shortbow': {
        id: 'iron_shortbow',
        name: 'Iron Shortbow',
        description: 'A sturdy bow reinforced with iron.',
        ingredients: [
            { id: 'wood', quantity: 3 },
            { id: 'iron_ingot', quantity: 2 }
        ],
        result: { id: 'iron_shortbow', quantity: 1 },
        requiredTalent: { id: 'smithing', level: 1 },
        requiredStation: 'anvil'
    },
    'iron_arrow': {
        id: 'iron_arrow',
        name: 'Iron Arrow',
        description: 'Craft 10 iron arrows.',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'iron_ingot', quantity: 1 }
        ],
        result: { id: 'iron_arrow', quantity: 10 },
        requiredTalent: { id: 'smithing', level: 1 },
        requiredStation: 'anvil'
    },
    'cooking_pot': {
        id: 'cooking_pot',
        name: 'Cooking Pot',
        description: 'A station used for cooking delicious meals. Requires Cooking Level 1.',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
            { id: 'stone', quantity: 3 }
        ],
        result: { id: 'cooking_pot', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 1 },
        requiredStation: 'anvil'
    },
    'cooked_fish': {
        id: 'cooked_fish',
        name: 'Cooked Fish',
        description: 'Roast a raw fish.',
        ingredients: [
            { id: 'raw_fish', quantity: 1 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'cooked_fish', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 1 },
        requiredStation: 'cooking_pot'
    },
    'cooked_meat': {
        id: 'cooked_meat',
        name: 'Cooked Meat',
        description: 'Grill some raw meat. (Assuming you have meat from animals!)',
        ingredients: [
            { id: 'meat', quantity: 1 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: 'cooked_meat', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 1 },
        requiredStation: 'cooking_pot'
    },
    'carrot_soup': {
        id: 'carrot_soup',
        name: 'Carrot Soup',
        description: 'Brew a warm carrot soup.',
        ingredients: [
            { id: 'carrot', quantity: 3 }
        ],
        result: { id: 'carrot_soup', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 1 },
        requiredStation: 'cooking_pot'
    },
    'berry_pie': {
        id: 'berry_pie',
        name: 'Mixed Berry Pie',
        description: 'Bake a pie with various berries.',
        ingredients: [
            { id: 'red_berry', quantity: 2 },
            { id: 'blue_berry', quantity: 2 },
            { id: 'yellow_berry', quantity: 2 }
        ],
        result: { id: 'berry_pie', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 2 },
        requiredStation: 'cooking_pot'
    },
    'golden_feast': {
        id: 'golden_feast',
        name: 'Golden Feast',
        description: 'Prepare a massive feast of grand proportions.',
        ingredients: [
            { id: 'golden_fish', quantity: 1 },
            { id: 'meat', quantity: 5 },
            { id: 'carrot', quantity: 5 },
            { id: 'mushroom', quantity: 2 }
        ],
        result: { id: 'golden_feast', quantity: 1 },
        requiredTalent: { id: 'cooking', level: 3 },
        requiredStation: 'cooking_pot'
    },
    
    // THERA UPDATE RECIPES
    'rune_key_thera': {
        id: 'rune_key_thera',
        name: 'Rune Key: Thera',
        description: 'Craft the gateway to the dinosaur world.',
        ingredients: [
            { id: 'stone', quantity: 20 },
            { id: 'fossil', quantity: 5 },
            { id: 'magic_dust', quantity: 10 }
        ],
        result: { id: 'rune_key_thera', quantity: 1 },
        requiredStation: 'masonry_table'
    },
    'thera_gateway': {
        id: 'thera_gateway',
        name: 'Thera Gateway',
        description: 'Assemble the gateway structure.',
        ingredients: [
            { id: 'stone_block', quantity: 10 },
            { id: 'rune_key_thera', quantity: 1 }
        ],
        result: { id: 'thera_gateway', quantity: 1 },
        requiredStation: 'masonry_table'
    },
    'bone_club': {
        id: 'bone_club',
        name: 'Giant Bone Club',
        description: 'A heavy weapon from ancient bones.',
        ingredients: [
            { id: 'tricera_horn', quantity: 2 },
            { id: 'tropical_wood', quantity: 10 }
        ],
        result: { id: 'bone_club', quantity: 1 },
        requiredStation: 'carpenters_bench' // or anvil
    },
    'raptor_sickle': {
        id: 'raptor_sickle',
        name: 'Raptor Sickle',
        description: 'A fast slashing weapon.',
        ingredients: [
            { id: 'raptor_claw', quantity: 2 },
            { id: 'leather', quantity: 2 },
            { id: 'tropical_wood', quantity: 1 }
        ],
        result: { id: 'raptor_sickle', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'fossil_pickaxe': {
        id: 'fossil_pickaxe',
        name: 'Fossil Pickaxe',
        description: 'Extract fossils.',
        ingredients: [
            { id: 'fossil', quantity: 3 },
            { id: 'tropical_wood', quantity: 2 }
        ],
        result: { id: 'fossil_pickaxe', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'ather_gateway': {
        id: 'ather_gateway',
        name: 'Ather Gateway',
        description: 'Craft the gateway to the world of colossal fungi and giants.',
        ingredients: [
            { id: 'stone', quantity: 10 },
            { id: 'glowcap', quantity: 5 },
            { id: 'fungal_spore', quantity: 5 }
        ],
        result: { id: 'ather_gateway', quantity: 1 },
        requiredStation: 'masonry_table'
    },
    'rune_key_ather': {
        id: 'rune_key_ather',
        name: 'Rune Key of Ather',
        description: 'Unlocks the Ather Gateway.',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
            { id: 'fungal_spore', quantity: 2 }
        ],
        result: { id: 'rune_key_ather', quantity: 1 },
        requiredStation: 'anvil'
    },
    'troll_tusk_sword': {
        id: 'troll_tusk_sword',
        name: 'Troll Tusk Sword',
        description: 'A heavy, curved bone sword.',
        ingredients: [
            { id: 'troll_tusk', quantity: 1 },
            { id: 'leather', quantity: 2 }
        ],
        result: { id: 'troll_tusk_sword', quantity: 1 },
        requiredStation: 'anvil'
    },
    'ogre_club': {
        id: 'ogre_club',
        name: 'Ogre Splinter Club',
        description: 'A devastating heavy weapon.',
        ingredients: [
            { id: 'ogre_club_splinter', quantity: 2 },
            { id: 'leather', quantity: 3 }
        ],
        result: { id: 'ogre_club', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'fungal_shield': {
        id: 'fungal_shield',
        name: 'Fungal Shield',
        description: 'A sturdy shield made of mushroom cap.',
        ingredients: [
            { id: 'glowcap', quantity: 3 },
            { id: 'fungal_spore', quantity: 2 }
        ],
        result: { id: 'fungal_shield', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'spore_cloak': {
        id: 'spore_cloak',
        name: 'Spore Cloak',
        description: 'A softly glowing cloak.',
        ingredients: [
            { id: 'glowcap', quantity: 5 },
            { id: 'cloth', quantity: 3 }
        ],
        result: { id: 'spore_cloak', quantity: 1 },
        requiredStation: 'fabric_station'
    },
    'glass_block': {
        id: 'glass_block',
        name: 'Glass Block',
        description: 'Made by melting sand at the forge.',
        ingredients: [
            { id: 'sand', quantity: 1 },
            { id: 'coal', quantity: 1 }
        ],
        result: { id: 'glass_block', quantity: 1 },
        requiredStation: 'furnace'
    },
    'stone_staircase': {
        id: 'stone_staircase',
        name: 'Stone Staircase',
        description: 'A stone staircase made at the masons table.',
        ingredients: [
            { id: 'stone', quantity: 4 }
        ],
        result: { id: 'stone_staircase', quantity: 1 },
        requiredStation: 'masonry_table'
    },
    'wooden_door': {
        id: 'wooden_door',
        name: 'Wooden Door',
        description: 'A door made of wood.',
        ingredients: [
            { id: 'wood', quantity: 4 }
        ],
        result: { id: 'door', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'stone_door': {
        id: 'stone_door',
        name: 'Stone Door',
        description: 'A sturdy door made of stone.',
        ingredients: [
            { id: 'stone', quantity: 4 }
        ],
        result: { id: 'stone_door', quantity: 1 },
        requiredStation: 'masonry_table'
    },
    'tent': {
        id: 'tent',
        name: 'Tent',
        description: 'A pitchable tent for resting.',
        ingredients: [
            { id: 'wood', quantity: 2 },
            { id: 'leather', quantity: 4 }
        ],
        result: { id: 'tent', quantity: 1 }
    },
    'archer_tent': {
        id: 'archer_tent',
        name: 'Archer Tent',
        description: 'A tent that spawns archers.',
        ingredients: [
            { id: 'wood', quantity: 5 },
            { id: 'leather', quantity: 5 },
            { id: 'iron_ingot', quantity: 1 }
        ],
        result: { id: 'archer_tent', quantity: 1 },
        requiredStation: 'carpenters_bench'
    },
    'dark_knight_tent': {
        id: 'dark_knight_tent',
        name: 'Dark Knight Spawner',
        description: 'Craft a spawner for Dark Knights.',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
            { id: 'leather', quantity: 5 },
            { id: 'ruby', quantity: 1 }
        ],
        result: { id: 'dark_knight_tent', quantity: 1 },
        requiredStation: 'anvil'
    }
});
