import type { Item } from '../../../registries/ItemRegistry';

export const DUNGEON_ITEMS_ITEMS: Record<string, Item> = {
    'dungeon_key': {
        id: "dungeon_key",
        name: "Dungeon Key",
        description: "A small key that unlocks basic dungeon doors.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'boss_key': {
        id: "boss_key",
        name: "Boss Key",
        description: "A large, ornate key that unlocks the boss room.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'djinn_lamp': {
        id: "djinn_lamp",
        name: "Djinn Lamp",
        description: "A magical lamp that grants a wish.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
    'rune_key_thera': {
        id: "rune_key_thera",
        name: "Rune Key: Thera",
        description: "A mossy stone slab with a carving of a crescent canyon. Required to build the gateway to Thera.",
        category: "MISC",
        maxStack: 1,
        quantity: 1
    },
};
