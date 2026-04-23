const fs = require('fs');

let worldCode = fs.readFileSync('src/game/World.ts', 'utf8');
worldCode = worldCode.replace(/VILLAGE_BELL = 99,/g,
`VILLAGE_BELL = 99,
    COPPER_BELL = 100,
    IRON_BELL = 101,
    GREEN_BELL = 102,
    RED_BELL = 103,
    MITHRIL_BELL = 104,
    BLACK_BELL = 105,`);
worldCode = worldCode.replace(/b \=\=\= BlockType\.VILLAGE_BELL/g, `(b >= BlockType.VILLAGE_BELL && b <= BlockType.BLACK_BELL)`);
fs.writeFileSync('src/game/World.ts', worldCode);

let constCode = fs.readFileSync('src/game/Constants.ts', 'utf8');
constCode = constCode.replace(/99\: \{ r\: 255\, g\: 215\, b\: 0 \}\,    \/\/ VILLAGE_BELL \(Gold\)/g,
`99: { r: 255, g: 215, b: 0 },    // VILLAGE_BELL (Gold)
    100: { r: 184, g: 115, b: 51 },  // COPPER_BELL
    101: { r: 169, g: 169, b: 169 }, // IRON_BELL
    102: { r: 46, g: 139, b: 87 },   // GREEN_BELL
    103: { r: 178, g: 34, b: 34 },   // RED_BELL
    104: { r: 192, g: 192, b: 255 }, // MITHRIL_BELL
    105: { r: 20, g: 20, b: 30 },    // BLACK_BELL`);
fs.writeFileSync('src/game/Constants.ts', constCode);

let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');
invCode = invCode.replace(/\'village_bell'\: \{ id\: \'village_bell\'\, name\: \'Village Bell\'\, description\: \'Attracts villagers to your settlement\.\'\, category\: \'MISC\'\, maxStack\: 10\, quantity\: 1 \}\,/g,
`'village_bell': { id: 'village_bell', name: 'Gold Bell', description: 'Attracts Commoners, Farmers, and Merchants.', category: 'MISC', maxStack: 10, quantity: 1 },
    'copper_bell': { id: 'copper_bell', name: 'Copper Bell', description: 'Attracts Commoners, Beggars, and Thieves.', category: 'MISC', maxStack: 10, quantity: 1 },
    'iron_bell': { id: 'iron_bell', name: 'Iron Bell', description: 'Attracts Commoners, Guards, and Smiths.', category: 'MISC', maxStack: 10, quantity: 1 },
    'green_bell': { id: 'green_bell', name: 'Green Metal Bell', description: 'Attracts Wizards, Alchemists, and Priests.', category: 'MISC', maxStack: 10, quantity: 1 },
    'red_bell': { id: 'red_bell', name: 'Red Metal Bell', description: 'Attracts Bounty Hunters, Gladiators, and Enchanters.', category: 'MISC', maxStack: 10, quantity: 1 },
    'mithril_bell': { id: 'mithril_bell', name: 'Mithril Bell', description: 'Attracts Knights, Nobles, and Councilors.', category: 'MISC', maxStack: 10, quantity: 1 },
    'black_bell': { id: 'black_bell', name: 'Black Diamond Bell', description: 'Attracts Necromancers, Jesters, and Shamans.', category: 'MISC', maxStack: 10, quantity: 1 },`);
fs.writeFileSync('src/game/Inventory.ts', invCode);

let craftCode = fs.readFileSync('src/game/Crafting.ts', 'utf8');
craftCode = craftCode.replace(/\'village_bell\'\: \{\n\s*id\: \'village_bell\'\,\n\s*requiredTalent\: \'masonry\'\,\n\s*levelReq\: 1\,\n\s*station\: \'anvil\'\,\n\s*ingredients\: \[\n\s*\{ id\: \'gold_piece\'\, quantity\: 15 \}\,\n\s*\{ id\: \'wood\'\, quantity\: 20 \}\,\n\s*\{ id\: \'iron_ingot\'\, quantity\: 5 \}\n\s*\]\,\n\s*output\: \{ id\: \'village_bell\'\, quantity\: 1 \}\n\s*\}/g,
`'village_bell': {
        id: 'village_bell',
        requiredTalent: 'masonry',
        levelReq: 1,
        station: 'anvil',
        ingredients: [
            { id: 'gold_piece', quantity: 15 },
            { id: 'wood', quantity: 20 },
            { id: 'iron_ingot', quantity: 5 }
        ],
        output: { id: 'village_bell', quantity: 1 }
    },
    'copper_bell': {
        id: 'copper_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'copper_ingot', quantity: 10 }, { id: 'wood', quantity: 20 }],
        output: { id: 'copper_bell', quantity: 1 }
    },
    'iron_bell': {
        id: 'iron_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'iron_ingot', quantity: 10 }, { id: 'wood', quantity: 20 }],
        output: { id: 'iron_bell', quantity: 1 }
    },
    'green_bell': {
        id: 'green_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'green_metal_ingot', quantity: 10 }, { id: 'wood', quantity: 20 }],
        output: { id: 'green_bell', quantity: 1 }
    },
    'red_bell': {
        id: 'red_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'red_metal_ingot', quantity: 10 }, { id: 'wood', quantity: 20 }],
        output: { id: 'red_bell', quantity: 1 }
    },
    'mithril_bell': {
        id: 'mithril_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'mithril_ingot', quantity: 10 }, { id: 'wood', quantity: 20 }],
        output: { id: 'mithril_bell', quantity: 1 }
    },
    'black_bell': {
        id: 'black_bell', requiredTalent: 'masonry', levelReq: 1, station: 'anvil',
        ingredients: [{ id: 'black_diamond', quantity: 5 }, { id: 'wood', quantity: 20 }, { id: 'iron_ingot', quantity: 10 }],
        output: { id: 'black_bell', quantity: 1 }
    }`);
fs.writeFileSync('src/game/Crafting.ts', craftCode);
