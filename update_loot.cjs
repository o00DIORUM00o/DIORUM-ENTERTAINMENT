const fs = require('fs');

// Add pots and random loot to starter chest
let worldStr = fs.readFileSync('src/game/World.ts', 'utf8');

const additionalLoot = "\\n            chestInventory[4] = { ...ITEMS['health_potion'], quantity: 5 };\\n            chestInventory[5] = { ...ITEMS['pot'], quantity: 10 };\\n            chestInventory[6] = { ...ITEMS['book_speed'] };\\n";

worldStr = worldStr.replace("chestInventory[3] = { ...ITEMS['red_berry_seed'], quantity: 5 };", 
"chestInventory[3] = { ...ITEMS['red_berry_seed'], quantity: 5 };" + additionalLoot);

fs.writeFileSync('src/game/World.ts', worldStr);

// Now update DungeonGenerator.ts to include pots in chests
let dGenStr = fs.readFileSync('src/game/DungeonGenerator.ts', 'utf8');
const dGenMod = "if (Math.random() < 0.3) chestInv[4] = { ...ITEMS['bomb'], quantity: 3 };";
const dGenModReplacement = "if (Math.random() < 0.3) chestInv[4] = { ...ITEMS['bomb'], quantity: 3 };\\n                if (Math.random() < 0.6) chestInv[5] = { ...ITEMS['pot'], quantity: Math.floor(Math.random() * 5) + 1 };\\n                if (Math.random() < 0.4) chestInv[6] = { ...ITEMS['health_potion'], quantity: 2 };\\n";
dGenStr = dGenStr.replace(dGenMod, dGenModReplacement);

fs.writeFileSync('src/game/DungeonGenerator.ts', dGenStr);

// In Updater.ts add pot breaking logic
let updaterStr = fs.readFileSync('src/game/Updater.ts', 'utf8');
const potBreak = "if (p.isPot) {\\n                    // Shatter pot\\n                    engine.world.setBlock(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z), BlockType.AIR);";
const potBreakRep = "if (p.isPot) {\\n                    // Shatter pot\\n                    engine.world.setBlock(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z), BlockType.AIR);\\n                    if (Math.random() < 0.5) {\\n                        const randomLoot = ['gold_piece', 'copper_piece', 'health_potion', 'red_berry', 'slime'];\\n                        const itemToDrop = randomLoot[Math.floor(Math.random() * randomLoot.length)];\\n                        engine.dropItem(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z), { ...ITEMS[itemToDrop] });\\n                    }";
updaterStr = updaterStr.replace(potBreak, potBreakRep);
fs.writeFileSync('src/game/Updater.ts', updaterStr);

// Also add POT breaking to Player.ts when attacked by weapons
let playerStr = fs.readFileSync('src/game/Player.ts', 'utf8');
playerStr = playerStr.replace(/\} else if \(block === BlockType\.BONE_PILE_SPAWNER\) \{[\s\S]*?if \(onDropItem\) onDropItem\(bx, by, pZ, \{ \.\.\.ITEMS\['bone'\], quantity: 5 \}\);/g, "} else if (block === BlockType.BONE_PILE_SPAWNER) {\n                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['bone'], quantity: 5 });\n                                            } else if (block === BlockType.POT) {\n                                                if (onDropItem && Math.random() < 0.5) {\n                                                    const randomLoot = ['gold_piece', 'copper_piece', 'health_potion', 'red_berry', 'slime'];\n                                                    const itemToDrop = randomLoot[Math.floor(Math.random() * randomLoot.length)];\n                                                    onDropItem(bx, by, pZ, { ...ITEMS[itemToDrop] });\n                                                }");
fs.writeFileSync('src/game/Player.ts', playerStr);

console.log("Updated world and dungeon generators");
