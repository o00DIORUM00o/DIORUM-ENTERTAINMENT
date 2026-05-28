import type { Item } from '../../../registries/ItemRegistry';

export const SEEDS_AND_HERBS_ITEMS: Record<string, Item> = {
    'carrot_seed': {
        id: "carrot_seed",
        name: "Carrot Seed",
        description: "Plant in Tilled Soil to grow carrots.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'pipe': {
        id: 'pipe',
        name: 'Smoking Pipe',
        description: 'A beautifully crafted wooden pipe. Used to smoke pipe weed.',
        category: 'MISC',
        maxStack: 1,
        quantity: 1
    },
    'pipe_weed_green': {
        id: 'pipe_weed_green',
        name: 'Green Pipe Weed',
        description: 'A classic smooth smoke. Restores 20 Stamina and slightly increases Stamina Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        staminaRestore: 20,
        buff: { duration: 60 }
    },
    'pipe_weed_blue': {
        id: 'pipe_weed_blue',
        name: 'Blue Pipe Weed',
        description: 'A cool, minty smoke. Restores 20 Mana and slightly increases Mana Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        manaRestore: 20,
        buff: { manaRegen: 1, duration: 60 }
    },
    'pipe_weed_red': {
        id: 'pipe_weed_red',
        name: 'Red Pipe Weed',
        description: 'A spicy, warm smoke. Restores 20 HP and slightly increases HP Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        healing: 20,
        buff: { healthRegen: 1, duration: 60 }
    },
    'pipe_weed_purple': {
        id: 'pipe_weed_purple',
        name: 'Purple Pipe Weed',
        description: 'A mystical, mind-expanding smoke. Grants temporary swiftness and increased maximum mana.',
        category: 'CONSUMABLE',
        maxStack: 99,
        manaRestore: 50,
        buff: { speed: 1, maxMana: 1, duration: 120 }
    },
};
