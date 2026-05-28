import type { Item } from '../../../registries/ItemRegistry';

export const MISC_ITEMS: Record<string, Item> = {
    'saddle': {
        id: "saddle",
        name: "Saddle",
        description: "Used to tame and ride wild animals. Put in quick slot and use on an animal.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 1.5,
        cooldown: 1,
        spread: 0.2,
        stackable: true,
        maxStack: 99
    },
    'saddle_bag': {
        id: "saddle_bag",
        name: "Saddle Bag",
        description: "Equip on a tamed mount to expand its inventory. Put in quick slot and use on your mount.",
        category: "MATERIAL",
        twoHanded: false,
        damage: 0,
        reach: 1.5,
        cooldown: 1,
        spread: 0.2,
        stackable: true,
        maxStack: 5
    },
};
