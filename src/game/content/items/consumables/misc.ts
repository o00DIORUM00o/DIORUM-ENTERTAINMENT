import type { Item } from '../../../registries/ItemRegistry';

export const MISC_ITEMS: Record<string, Item> = {
    'bomb': {
        id: "bomb",
        name: "Bomb",
        description: "Highly explosive. Blows up cracked walls. Handle with care.",
        category: "CONSUMABLE",
        twoHanded: false,
        stackable: true
    },
    'bag_expansion': {
        id: "bag_expansion",
        name: "Bag Expansion",
        description: "Consume to add 10 extra slots to your inventory. Who knew you could eat a bag?",
        category: "CONSUMABLE",
        twoHanded: false,
        stackable: true
    },
};
