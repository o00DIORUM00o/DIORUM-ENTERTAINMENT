export const QuestsConfig: Record<string, any> = {
    QUEST_WIZARD_1: {
        id: 'QUEST_WIZARD_1',
        giverType: 'NPC_WIZARD',
        title: 'Arcane Materials',
        description: 'Bring me 10 Obsidian blocks to repair my tower.',
        type: 'FETCH',
        targetId: 'obsidian',
        requiredCount: 10,
        rewards: [
            { type: 'XP', amount: 500 },
            { type: 'GOLD', amount: 50 },
            { type: 'ITEM', id: 'mana_potion', amount: 5 }
        ]
    },
    QUEST_KING_SIEGE_1: {
        id: 'QUEST_KING_SIEGE_1',
        giverType: 'NPC_KING',
        title: 'Enemy at the Gates',
        description: 'Orcs and goblins are gathering outside Pantheona City! Destroy their 12 tents at the crossroads surrounding the city.',
        type: 'DESTROY_SPAWNER',
        targetId: 'goblin_tent',
        requiredCount: 12,
        rewards: [
            { type: 'XP', amount: 3000 },
            { type: 'GOLD', amount: 1500 },
            { type: 'ITEM', id: 'obsidian_sword', amount: 1 }
        ]
    },
    QUEST_KING_1: {
        id: 'QUEST_KING_1',
        giverType: 'NPC_KING',
        title: 'Reinforce the Castle',
        description: 'The castle walls are weak. Bring me 20 Castle Stone.',
        type: 'FETCH',
        targetId: 'castle_stone',
        requiredCount: 20,
        rewards: [
            { type: 'XP', amount: 300 },
            { type: 'GOLD', amount: 100 }
        ]
    },
    QUEST_MERCHANT_1: {
        id: 'QUEST_MERCHANT_1',
        giverType: 'NPC_MERCHANT',
        title: 'Trading Goods',
        description: 'I need 5 emeralds for a special client. Can you find them?',
        type: 'FETCH',
        targetId: 'emerald',
        requiredCount: 5,
        rewards: [
            { type: 'XP', amount: 400 },
            { type: 'GOLD', amount: 200 },
            { type: 'ITEM', id: 'ring_of_wealth', amount: 1 }
        ]
    }
};
