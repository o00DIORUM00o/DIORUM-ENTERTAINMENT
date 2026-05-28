import type { Item } from '../../../registries/ItemRegistry';

export const PLANTS_AND_FARMING_ITEMS: Record<string, Item> = {
    'weed': {
        id: 'weed',
        name: 'Wild Weed',
        description: 'A clump of wild weeds. Can be dried and smoked.',
        category: 'MATERIAL',
        maxStack: 99,
        stackable: true
    },
    'weed_seed': {
        id: 'weed_seed',
        name: 'Weed Seed',
        description: 'A seed for a weed. Can be planted.',
        category: 'MATERIAL',
        maxStack: 99,
        stackable: true
    },
    'tropical_wood': {
        id: "tropical_wood",
        name: "Tropical Wood",
        description: "A dark, dense wood harvested from tropical jungles.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fern_frond': {
        id: "fern_frond",
        name: "Fern Frond",
        description: "A giant leaf from a prehistoric fern.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'frog_spice': {
        id: "frog_spice",
        name: "Frog Spice",
        description: "A secretive blend of swamp spices created by the Frog Folk.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'fungal_spore': {
        id: "fungal_spore",
        name: "Fungal Spore",
        description: "A large, glowing spore that smells earthy.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'glowcap': {
        id: "glowcap",
        name: "Glowcap",
        description: "A radiant glowing mushroom cap.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
};
