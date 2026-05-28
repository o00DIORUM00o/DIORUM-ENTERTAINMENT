import type { Item } from '../../../registries/ItemRegistry';

export const CRAFTED_MATERIALS_ITEMS: Record<string, Item> = {
    'fabric': {
        id: "fabric",
        name: "Fabric",
        description: "A soft cloth woven from wool.",
        category: "MATERIAL",
        maxStack: 64,
        quantity: 1
    },
    'leather': {
        id: "leather",
        name: "Leather",
        description: "Tough animal hide. Useful for crafting.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'gold_ingot': {
        id: "gold_ingot",
        name: "Gold Ingot",
        description: "A heavy, shiny bar of pure gold.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'scrap_metal': {
        id: "scrap_metal",
        name: "Scrap Metal",
        description: "Rusty iron pieces.",
        category: "MATERIAL",
        maxStack: 64,
        stackable: true
    },
};
