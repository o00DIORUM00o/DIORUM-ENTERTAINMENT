import type { Item } from '../../registries/ItemRegistry';

export const AMMO_ITEMS: Record<string, Item> = {
    'arrow_1': {
        id: "arrow_1",
        name: "Wooden Arrow",
        description: "A simple wooden arrow with a stone tip.",
        category: "AMMO",
        quantity: 1,
        maxStack: 99
    },
    'iron_arrow': {
        id: "iron_arrow",
        name: "Iron Arrow",
        description: "A wooden arrow with a sharp iron tip. Deals +5 damage.",
        category: "AMMO",
        quantity: 1,
        maxStack: 99,
        damage: 5
    },
};
