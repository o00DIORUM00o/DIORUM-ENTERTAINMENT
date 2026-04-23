const fs = require('fs');

let inventoryStr = fs.readFileSync('src/game/Inventory.ts', 'utf8');

const potDef = `    'pot': { id: 'pot', name: 'Pot', description: 'A fragile pot. Can be thrown or broken.', category: 'MISC', maxStack: 10, stackable: true, quantity: 1 },
    'slime_puddle':`;
    
inventoryStr = inventoryStr.replace("'slime_puddle':", potDef);

fs.writeFileSync('src/game/Inventory.ts', inventoryStr);

let playerStr = fs.readFileSync('src/game/Player.ts', 'utf8');

playerStr = playerStr.replace("item.id === 'slit'", "(item.id === 'pot')");
playerStr = playerStr.replace("|| item.id === 'slime_puddle'", "|| item.id === 'pot' || item.id === 'slime_puddle'");
playerStr = playerStr.replace("if (item.id === 'slime_puddle') blockToPlace = BlockType.SLIME_PUDDLE;", "if (item.id === 'slime_puddle') blockToPlace = BlockType.SLIME_PUDDLE;\n                        if (item.id === 'pot') blockToPlace = BlockType.POT;");

fs.writeFileSync('src/game/Player.ts', playerStr);

console.log("Added Placable Pot");
