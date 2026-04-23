import type { Item } from '../../registries/ItemRegistry';

export const ARMOR_ITEMS: Record<string, Item> = {
    'glider_wings': {
        id: "glider_wings",
        name: "Glider Wings",
        description: "Equip to the body to drastically slow falling speed and glide horizontally while holding jump.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'sphinx_crown': {
        id: "sphinx_crown",
        name: "Crown of the Sphinx",
        description: "Imbued with ancient power. Grants vast life-draining capabilities.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        maxStack: 1,
        quantity: 1,
        defense: 15, lifesteal: 0.15
    },
    'abyssal_armor': {
        id: "abyssal_armor",
        name: "Abyssal Plate Armor",
        description: "Heavy armor made of abyssal brick and shadow.",
        category: "ARMOR",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0,
        defense: 25
    },
    'dragon_scale_armor': {
        id: "dragon_scale_armor",
        name: "Dragon Scale Armor",
        description: "Nearly impenetrable set of scales stripped from the Fire Dragon Boss.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 45,
        maxStack: 1,
        quantity: 1
    },
    'fabric_cap': {
        id: "fabric_cap",
        name: "Fabric Cap",
        description: "A simple cap made of fabric.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_tunic': {
        id: "fabric_tunic",
        name: "Fabric Tunic",
        description: "A simple tunic made of fabric.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'fabric_pants': {
        id: "fabric_pants",
        name: "Fabric Pants",
        description: "Simple pants made of fabric.",
        category: "ARMOR",
        equipmentSlot: "LEGS",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_shoes': {
        id: "fabric_shoes",
        name: "Fabric Shoes",
        description: "Simple shoes made of fabric.",
        category: "ARMOR",
        equipmentSlot: "FEET",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_cloak': {
        id: "fabric_cloak",
        name: "Fabric Cloak",
        description: "A simple cloak made of fabric.",
        category: "ARMOR",
        equipmentSlot: "CLOAK",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_gloves': {
        id: "fabric_gloves",
        name: "Fabric Gloves",
        description: "Simple gloves made of fabric.",
        category: "ARMOR",
        equipmentSlot: "HANDS",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_belt': {
        id: "fabric_belt",
        name: "Fabric Belt",
        description: "A simple belt made of fabric.",
        category: "ARMOR",
        equipmentSlot: "BELT",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'fabric_shoulders': {
        id: "fabric_shoulders",
        name: "Fabric Shoulders",
        description: "Simple shoulder pads made of fabric.",
        category: "ARMOR",
        equipmentSlot: "SHOULDERS",
        defense: 1,
        maxStack: 1,
        quantity: 1
    },
    'leather_cap': {
        id: "leather_cap",
        name: "Leather Cap",
        description: "A sturdy cap made of leather.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'leather_tunic': {
        id: "leather_tunic",
        name: "Leather Tunic",
        description: "A sturdy tunic made of leather.",
        category: "ARMOR",
        equipmentSlot: "BODY",
        defense: 4,
        maxStack: 1,
        quantity: 1
    },
    'leather_pants': {
        id: "leather_pants",
        name: "Leather Pants",
        description: "Sturdy pants made of leather.",
        category: "ARMOR",
        equipmentSlot: "LEGS",
        defense: 3,
        maxStack: 1,
        quantity: 1
    },
    'leather_boots': {
        id: "leather_boots",
        name: "Leather Boots",
        description: "Sturdy boots made of leather.",
        category: "ARMOR",
        equipmentSlot: "FEET",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'leather_gloves': {
        id: "leather_gloves",
        name: "Leather Gloves",
        description: "Sturdy gloves made of leather.",
        category: "ARMOR",
        equipmentSlot: "HANDS",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'leather_belt': {
        id: "leather_belt",
        name: "Leather Belt",
        description: "A sturdy belt made of leather.",
        category: "ARMOR",
        equipmentSlot: "BELT",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
    'leather_spaulders': {
        id: "leather_spaulders",
        name: "Leather Spaulders",
        description: "Sturdy shoulder pads made of leather.",
        category: "ARMOR",
        equipmentSlot: "SHOULDERS",
        defense: 2,
        maxStack: 1,
        quantity: 1
    },
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
    'gas_mask': {
        id: "gas_mask",
        name: "Gas Mask",
        description: "Filters out toxic fumes and miasma found on swamp worlds.",
        category: "ARMOR",
        equipmentSlot: "HEAD",
        defense: 3,
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
    'wooden_shield': {
        id: "wooden_shield",
        name: "Wooden Shield",
        description: "A basic shield made of wood.",
        category: "ARMOR",
        equipmentSlot: "OFF_HAND",
        defense: 3,
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
    'antigravity_artifact': {
        id: "antigravity_artifact",
        name: "Antigravity Artifact",
        description: "A glowing core of immense energy. Hold SPACE to ascend endlessly and defy gravity.",
        category: "ARMOR",
        equipmentSlot: "NECKLACE",
        defense: 20,
        maxStack: 1,
        quantity: 1
    },
    'fungal_shield': {
        id: "fungal_shield",
        name: "Fungal Shield",
        description: "A massive, hardened mushroom cap that acts as a great shield.",
        category: "ARMOR",
        equipmentSlot: "OFF_HAND",
        defense: 12,
        maxStack: 1,
        quantity: 1
    },
    'spore_cloak': {
        id: "spore_cloak",
        name: "Spore Cloak",
        description: "A cloak woven from bioluminescent mycelial threads.",
        category: "ARMOR",
        equipmentSlot: "CLOAK",
        defense: 6,
        maxStack: 1,
        quantity: 1
    }
};
