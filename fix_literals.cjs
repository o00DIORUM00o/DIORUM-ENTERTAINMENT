const fs = require('fs');

let worldStr = fs.readFileSync('src/game/World.ts', 'utf8');
worldStr = worldStr.split('\\\\n').join('\\n');
fs.writeFileSync('src/game/World.ts', worldStr);

let dGen = fs.readFileSync('src/game/DungeonGenerator.ts', 'utf8');
dGen = dGen.split('\\\\n').join('\\n');
fs.writeFileSync('src/game/DungeonGenerator.ts', dGen);

let upGen = fs.readFileSync('src/game/Updater.ts', 'utf8');
upGen = upGen.split('\\\\n').join('\\n');
fs.writeFileSync('src/game/Updater.ts', upGen);

let playGen = fs.readFileSync('src/game/Player.ts', 'utf8');
playGen = playGen.split('\\\\n').join('\\n');
fs.writeFileSync('src/game/Player.ts', playGen);

console.log("Fixed literals");
