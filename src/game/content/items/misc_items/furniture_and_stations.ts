import type { Item } from '../../../registries/ItemRegistry';

export const FURNITURE_AND_STATIONS_ITEMS: Record<string, Item> = {
    'door': {
        id: "door",
        name: "Wooden Door",
        description: "A door made of wood.",
        category: "MISC",
        maxStack: 99,
        stackable: true
    },
    'stone_door': {
        id: "stone_door",
        name: "Stone Door",
        description: "A heavy door made of stone.",
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
    'stone_staircase': {
        id: "stone_staircase",
        name: "Stone Staircase",
        description: "A sturdy staircase made of stone.",
        category: "MISC",
        maxStack: 99,
        stackable: true,
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
    'campfire': {
        id: "campfire",
        name: "Campfire",
        description: "A warm campfire. Provides light and slowly regenerates health when nearby.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'buggy_ramp': {
        id: "buggy_ramp",
        name: "Buggy Ramp",
        description: "A wooden ramp specifically designed for sick Gnome Buggy jumps.",
        category: "MISC",
        maxStack: 10,
        quantity: 1
    },
    'torch': {
        id: "torch",
        name: "Torch",
        description: "A wooden stick with a burning end. Provides light in dark places. Can be placed on the ground.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
};
