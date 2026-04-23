const fs = require('fs');

let playerStr = fs.readFileSync('src/game/Player.ts', 'utf8');

// Add BlockType.POT to destructible condition checks
playerStr = playerStr.replace(/\|\| block === BlockType\.BONE_PILE_SPAWNER/g, "|| block === BlockType.BONE_PILE_SPAWNER || block === BlockType.POT");
playerStr = playerStr.replace(/\|\| \(block as any\) === BlockType\.BONE_PILE_SPAWNER/g, "|| (block as any) === BlockType.BONE_PILE_SPAWNER || (block as any) === BlockType.POT");
playerStr = playerStr.replace(/block !== BlockType\.BONE_PILE_SPAWNER/g, "block !== BlockType.BONE_PILE_SPAWNER && block !== BlockType.POT");

fs.writeFileSync('src/game/Player.ts', playerStr);
console.log("Added POT to destructibles");
