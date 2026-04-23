const fs = require('fs');

let craftCode = fs.readFileSync('src/game/Crafting.ts', 'utf8');

// 1. Add alchemy_table to Station type
craftCode = craftCode.replace(/export type Station \= 'inventory' \| 'carpenters_bench' \| 'masonry_table' \| 'fabric_station' \| 'leather_station' \| 'furnace' \| 'forge' \| 'anvil';/,
`export type Station = 'inventory' | 'carpenters_bench' | 'masonry_table' | 'fabric_station' | 'leather_station' | 'furnace' | 'forge' | 'anvil' | 'alchemy_table';`);

// 2. Add recipes
const REPLACESTR = `    'alchemy_table': {
        id: 'alchemy_table',
        name: 'Alchemy Table',
        description: 'A mystical table used to brew potions from resources. Requires Carpentry Level 2.',
        ingredients: [
            { id: 'wood', quantity: 15 },
            { id: 'stone', quantity: 5 },
            { id: 'red_berry', quantity: 5 }
        ],
        result: { id: 'alchemy_table', quantity: 1 },
        requiredTalent: { id: 'carpentry', level: 2 },
        requiredStation: 'carpenters_bench',
        requiresLearning: true
    },
    'health_potion': {
        id: 'health_potion',
        name: 'Health Potion',
        description: 'Brew a health potion from red berries and a mushroom.',
        ingredients: [
            { id: 'red_berry', quantity: 5 },
            { id: 'mushroom', quantity: 1 }
        ],
        result: { id: 'health_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'mana_potion': {
        id: 'mana_potion',
        name: 'Mana Potion',
        description: 'Brew a mana potion from blue berries and a crystal shard.',
        ingredients: [
            { id: 'blue_berry', quantity: 5 },
            { id: 'crystal_shard', quantity: 1 }
        ],
        result: { id: 'mana_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'swiftness_potion': {
        id: 'swiftness_potion',
        name: 'Potion of Swiftness',
        description: 'Brew a potion that grants speed. Requires spider silk.',
        ingredients: [
            { id: 'yellow_berry', quantity: 5 },
            { id: 'fabric', quantity: 2 } // "fabric" acts as our spider silk right now
        ],
        result: { id: 'swiftness_potion', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'fire_vial': {
        id: 'fire_vial',
        name: 'Vial of Liquid Fire',
        description: 'Brew a highly explosive thrown vial of fire.',
        ingredients: [
            { id: 'crystal_shard', quantity: 2 },
            { id: 'coal', quantity: 2 }
        ],
        result: { id: 'fire_vial', quantity: 1 },
        requiredStation: 'alchemy_table'
    },
    'conveyor_belt': {`;

craftCode = craftCode.replace(/\ \ \ \ 'conveyor_belt'\: \{/, REPLACESTR);

fs.writeFileSync('src/game/Crafting.ts', craftCode);
