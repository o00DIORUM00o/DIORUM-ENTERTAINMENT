const fs = require('fs');

let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

const merchantInject = `'VILLAGER_SMITH': {
        guaranteed: [
            { itemToGive: { id: 'sword_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 5 }] },
            { itemToGive: { id: 'iron_armor', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 15 }] },
            // Buys ores
            { itemToGive: { id: 'copper_piece', quantity: 20 }, cost: [{ id: 'iron_ore', quantity: 5 }] }
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_ALCHEMIST': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] },
            { itemToGive: { id: 'mana_potion', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] },
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_PRIEST': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 5 }, cost: [{ id: 'silver_piece', quantity: 8 }] },
            { itemToGive: { id: 'book_healing_word', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 20 }] },
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_ENCHANTER': {
        guaranteed: [
            { itemToGive: { id: 'ring_health', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'ring_mana', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
            { itemToGive: { id: 'book_mark_return', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 2 }] },
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_SHAMAN': {
        guaranteed: [
            { itemToGive: { id: 'health_potion', quantity: 3 }, cost: [{ id: 'bone', quantity: 10 }] },
            { itemToGive: { id: 'book_acid_bolt', quantity: 1 }, cost: [{ id: 'gold_piece', quantity: 5 }] },
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_THIEF': {
        guaranteed: [
            { itemToGive: { id: 'dagger_1', quantity: 1 }, cost: [{ id: 'copper_piece', quantity: 50 }] }, // Stolen goods discount
            { itemToGive: { id: 'shortbow_1', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] }
        ],
        random: { items: [], count: 0 }
    },
    'VILLAGER_NOBLE': {
        guaranteed: [
            { itemToGive: { id: 'gold_piece', quantity: 10 }, cost: [{ id: 'ruby', quantity: 1 }] },
            { itemToGive: { id: 'gold_piece', quantity: 15 }, cost: [{ id: 'emerald', quantity: 1 }] },
            { itemToGive: { id: 'gold_piece', quantity: 50 }, cost: [{ id: 'black_diamond', quantity: 1 }] }
        ],
        random: { items: [], count: 0 }
    },`;

invCode = invCode.replace(/\'VILLAGER_FARMER\'\: \{([\s\S]*?)        \}\n    \}\,/g,
`'VILLAGER_FARMER': {
        guaranteed: [
            { itemToGive: { id: 'red_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
            { itemToGive: { id: 'blue_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'yellow_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            // Buying things from player (giving player coins)
            { itemToGive: { id: 'copper_piece', quantity: 10 }, cost: [{ id: 'wood', quantity: 20 }] },
            { itemToGive: { id: 'copper_piece', quantity: 5 }, cost: [{ id: 'red_berry', quantity: 5 }] }
        ],
        random: {
            count: 1,
            items: [
                { listing: { itemToGive: { id: 'bread', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] }, weight: 10 }
            ]
        }
    },
    ${merchantInject}`);

fs.writeFileSync('src/game/Inventory.ts', invCode);
