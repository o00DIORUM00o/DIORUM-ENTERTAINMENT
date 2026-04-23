const fs = require('fs');

let worldStr = fs.readFileSync('src/game/World.ts', 'utf8');
worldStr = worldStr.replace(/new Array\(40\)/g, 'new Array(80)');
fs.writeFileSync('src/game/World.ts', worldStr);

let dGen = fs.readFileSync('src/game/DungeonGenerator.ts', 'utf8');
dGen = dGen.replace(/new Array\(40\)/g, 'new Array(80)');
fs.writeFileSync('src/game/DungeonGenerator.ts', dGen);

console.log("Updated chest sizes to 80");
