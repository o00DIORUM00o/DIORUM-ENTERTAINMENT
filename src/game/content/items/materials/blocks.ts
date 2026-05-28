import type { Item } from '../../../registries/ItemRegistry';

export const BLOCKS_ITEMS: Record<string, Item> = {
    'dirt': {
        id: "dirt",
        name: "Dirt",
        description: "Common dirt.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'sand': {
        id: "sand",
        name: "Sand",
        description: "Loose sand.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'clay': {
        id: "clay",
        name: "Clay",
        description: "Moldable clay.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'mud': {
        id: "mud",
        name: "Mud",
        description: "Wet dirt.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'snow': {
        id: "snow",
        name: "Snow",
        description: "Cold snow.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'ice': {
        id: "ice",
        name: "Ice",
        description: "Solid ice.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'wood_floor': {
        id: "wood_floor",
        name: "Wood Floor",
        description: "A wooden floor tile.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'dungeon_brick_hard': {
        id: "dungeon_brick_hard",
        name: "Hard Dungeon Brick",
        description: "Very tough brick.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
    'dungeon_brick_cracked': {
        id: "dungeon_brick_cracked",
        name: "Cracked Dungeon Brick",
        description: "A crumbling brick.",
        category: "MATERIAL",
        maxStack: 99,
        stackable: true
    },
};
