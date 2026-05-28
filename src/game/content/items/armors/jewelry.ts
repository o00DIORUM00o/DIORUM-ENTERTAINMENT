import type { Item } from '../../../registries/ItemRegistry';

export const JEWELRY_ITEMS: Record<string, Item> = {
    'copper_ring': {
        id: "copper_ring",
        name: "Copper Ring",
        description: "A simple ring made of copper.",
        category: "ARMOR",
        equipmentSlot: "RIGHT_RING",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'iron_ring': {
        id: "iron_ring",
        name: "Iron Ring",
        description: "A sturdy ring made of iron.",
        category: "ARMOR",
        equipmentSlot: "RIGHT_RING",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'ring_of_ice': {
        id: "ring_of_ice",
        name: "Ring of Ice",
        description: "A ring emitting a freezing aura. Grants immunity to natural heat exhaustion on volcanic planets.",
        category: "ARMOR",
        equipmentSlot: "RIGHT_RING",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'copper_necklace': {
        id: "copper_necklace",
        name: "Copper Necklace",
        description: "A simple necklace made of copper.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'amulet_of_nature': {
        id: "amulet_of_nature",
        name: "Amulet of Nature",
        description: "A glowing green crystal pendant. Negates all natural ambient toxins and miasma.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'iron_necklace': {
        id: "iron_necklace",
        name: "Iron Necklace",
        description: "A sturdy necklace made of iron.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'amber_amulet': {
        id: "amber_amulet",
        name: "Amber Amulet",
        description: "A large chunk of glowing amber housing a fossilized bug. Improves nature resistance.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 4,
        magicDefense: 8,
        maxStack: 1,
        quantity: 1
    },
    'amber_ring': {
        id: "amber_ring",
        name: "Amber Ring",
        description: "A ring polished from golden amber. Increases stamina regen slightly.",
        category: "ARMOR",
        equipmentSlot: "RIGHT_RING",
        defense: 2,
        magicDefense: 4,
        maxStack: 1,
        quantity: 1
    }
};
