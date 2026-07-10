import type { Item } from '../../../registries/ItemRegistry';

export const MISC_MATERIALS_ITEMS: Record<string, Item> = {
    'string': {
        id: "string",
        name: "String",
        description: "A length of sturdy string or twine.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'coal': {
        id: "coal",
        name: "Coal",
        description: "A lump of coal. Useful for smelting and crafting.",
        category: "MISC",
        quantity: 1,
        maxStack: 64
    },
    'copper_piece': {
        id: "copper_piece",
        name: "Copper Piece",
        description: "A common coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'iron_piece': {
        id: "iron_piece",
        name: "Iron Piece",
        description: "A valuable coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'bone': {
        id: "bone",
        name: "Bone",
        description: "A bone from a fallen skeleton.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'magma_core': {
        id: "magma_core",
        name: "Magma Core",
        description: "A glowing, intensely hot core from a Lava Golem.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'crystal_shard': {
        id: "crystal_shard",
        name: "Crystal Shard",
        description: "A glowing purple shard mined from the deep caverns.",
        category: "MISC",
        quantity: 1,
        maxStack: 99
    },
    'lute': {
        id: "lute",
        name: "Lute",
        description: "A finely crafted wooden lute. Plucking its strings brings joy to the soul.",
        category: "MISC",
        quantity: 1,
        maxStack: 1
    },
    'ocarina': {
        id: "ocarina",
        name: "Ocarina",
        description: "A small wind instrument made of clay. It whistles a simple, sweet tune.",
        category: "MISC",
        quantity: 1,
        maxStack: 1
    },
    'gold_piece': {
        id: "gold_piece",
        name: "Gold Piece",
        description: "A valuable coin used for trading.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
    'gemini_coin': {
        id: "gemini_coin",
        name: "Gemini Coin",
        description: "A very rare coin minted by an artificial intelligence.",
        category: "MISC",
        quantity: 1,
        maxStack: 999
    },
};
