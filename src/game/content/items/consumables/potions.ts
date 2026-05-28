import type { Item } from '../../../registries/ItemRegistry';

export const POTIONS_ITEMS: Record<string, Item> = {
    'health_potion': {
        id: "health_potion",
        name: "Health Potion",
        description: "A glowing red vial. Restores 100 health.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1,
        healing: 100
    },
    'mana_potion': {
        id: "mana_potion",
        name: "Mana Potion",
        description: "A vibrant blue vial. Restores 100 mana.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
    'swiftness_potion': {
        id: "swiftness_potion",
        name: "Potion of Swiftness",
        description: "A frothy yellow brew. Grants incredible speed for 60 seconds.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
    'fire_vial': {
        id: "fire_vial",
        name: "Vial of Liquid Fire",
        description: "A dangerous volatile vial. Explodes upon use.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
};
