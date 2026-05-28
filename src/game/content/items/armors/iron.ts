import type { Item } from '../../../registries/ItemRegistry';

export const IRON_ITEMS: Record<string, Item> = {
    'iron_helmet': {
        id: "iron_helmet",
        name: "Iron Helmet",
        description: "A heavy helmet made of iron.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 4,
        maxStack: 1,
        quantity: 1
    },
    'iron_chestplate': {
        id: "iron_chestplate",
        name: "Iron Chestplate",
        description: "A heavy chestplate made of iron.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 8,
        maxStack: 1,
        quantity: 1
    },
    'iron_greaves': {
        id: "iron_greaves",
        name: "Iron Greaves",
        description: "Heavy greaves made of iron.",
        category: "ARMOR",
        equipmentSlot: "LEGS",
        defense: 6,
        maxStack: 1,
        quantity: 1
    },
    'iron_boots': {
        id: "iron_boots",
        name: "Iron Boots",
        description: "Heavy boots made of iron.",
        category: "ARMOR",
        equipmentSlot: "FEET",
        defense: 4,
        maxStack: 1,
        quantity: 1
    },
    'iron_gauntlets': {
        id: "iron_gauntlets",
        name: "Iron Gauntlets",
        description: "Heavy gauntlets made of iron.",
        category: "ARMOR",
        equipmentSlot: "HANDS",
        defense: 4,
        maxStack: 1,
        quantity: 1
    },
    'iron_belt': {
        id: "iron_belt",
        name: "Iron Belt",
        description: "A heavy belt made of iron.",
        category: "ARMOR",
        equipmentSlot: "BELT",
        defense: 3,
        maxStack: 1,
        quantity: 1
    },
    'iron_pauldrons': {
        id: "iron_pauldrons",
        name: "Iron Pauldrons",
        description: "Heavy shoulder pads made of iron.",
        category: "ARMOR",
        equipmentSlot: "SHOULDERS",
        defense: 4,
        maxStack: 1,
        quantity: 1
    },
    'iron_shield': {
        id: "iron_shield",
        name: "Iron Shield",
        description: "A sturdy shield made of iron.",
        category: "ARMOR",
        equipmentSlot: "OFF_HAND",
        defense: 6,
        maxStack: 1,
        quantity: 1
    },
};
