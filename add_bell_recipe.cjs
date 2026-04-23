const fs = require('fs');

let cCode = fs.readFileSync('src/game/Crafting.ts', 'utf8');

cCode = cCode.replace(/export const RECIPES\: Record\<string\, Recipe\> \= \{/g, 
`export const RECIPES: Record<string, Recipe> = {
    'village_bell': {
        id: 'village_bell',
        name: 'Village Bell',
        description: 'A loud golden bell that attracts villagers to build a settlement.',
        ingredients: [
            { id: 'gold_piece', quantity: 15 },
            { id: 'wood', quantity: 20 },
            { id: 'iron_ingot', quantity: 5 }
        ],
        result: { id: 'village_bell', quantity: 1 },
        requiredStation: 'anvil'
    },`);

fs.writeFileSync('src/game/Crafting.ts', cCode);
