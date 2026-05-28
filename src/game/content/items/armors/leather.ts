import type { Item } from '../../../registries/ItemRegistry';

export const LEATHER_ITEMS: Record<string, Item> = {
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
};
