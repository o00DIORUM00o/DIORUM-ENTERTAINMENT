const fs = require('fs');

let worldStr = fs.readFileSync('src/game/World.ts', 'utf8');
worldStr = worldStr.replace('SLIME_PUDDLE = 95', 'SLIME_PUDDLE = 106');
worldStr = worldStr.replace('SPIDER_WEB = 96', 'SPIDER_WEB = 107');
worldStr = worldStr.replace('DEMON_PORTAL = 97', 'DEMON_PORTAL = 108');
worldStr = worldStr.replace('ALCHEMY_TABLE = 98', 'ALCHEMY_TABLE = 109');
worldStr = worldStr.replace('VILLAGE_BELL = 99', 'VILLAGE_BELL = 110');
worldStr = worldStr.replace('COPPER_BELL = 100', 'COPPER_BELL = 111');
worldStr = worldStr.replace('IRON_BELL = 101', 'IRON_BELL = 112');
worldStr = worldStr.replace('GREEN_BELL = 102', 'GREEN_BELL = 113');
worldStr = worldStr.replace('RED_BELL = 103', 'RED_BELL = 114');
worldStr = worldStr.replace('MITHRIL_BELL = 104', 'MITHRIL_BELL = 115');
worldStr = worldStr.replace('BLACK_BELL = 105', 'BLACK_BELL = 116');

fs.writeFileSync('src/game/World.ts', worldStr);

let constStr = fs.readFileSync('src/game/Constants.ts', 'utf8');
constStr = constStr.replace('95: { r: 50, g: 205, b: 50 },    // SLIME_PUDDLE', '106: { r: 50, g: 205, b: 50 },    // SLIME_PUDDLE');
constStr = constStr.replace('96: { r: 220, g: 220, b: 220 },  // SPIDER_WEB', '107: { r: 220, g: 220, b: 220 },  // SPIDER_WEB');
constStr = constStr.replace('97: { r: 139, g: 0, b: 0 },      // DEMON_PORTAL (Dark Red)', '108: { r: 139, g: 0, b: 0 },      // DEMON_PORTAL');
constStr = constStr.replace('98: { r: 75, g: 0, b: 130 },     // ALCHEMY_TABLE (Indigo)', '109: { r: 75, g: 0, b: 130 },     // ALCHEMY_TABLE');
constStr = constStr.replace('99: { r: 255, g: 215, b: 0 },    // VILLAGE_BELL (Gold)', '110: { r: 255, g: 215, b: 0 },    // VILLAGE_BELL');
constStr = constStr.replace('100: { r: 184, g: 115, b: 51 },  // COPPER_BELL', '111: { r: 184, g: 115, b: 51 },  // COPPER_BELL');
constStr = constStr.replace('101: { r: 169, g: 169, b: 169 }, // IRON_BELL', '112: { r: 169, g: 169, b: 169 }, // IRON_BELL');
constStr = constStr.replace('102: { r: 46, g: 139, b: 87 },   // GREEN_BELL', '113: { r: 46, g: 139, b: 87 },   // GREEN_BELL');
constStr = constStr.replace('103: { r: 178, g: 34, b: 34 },   // RED_BELL', '114: { r: 178, g: 34, b: 34 },   // RED_BELL');
constStr = constStr.replace('104: { r: 192, g: 192, b: 255 }, // MITHRIL_BELL', '115: { r: 192, g: 192, b: 255 }, // MITHRIL_BELL');
constStr = constStr.replace('105: { r: 20, g: 20, b: 30 },    // BLACK_BELL', '116: { r: 20, g: 20, b: 30 },    // BLACK_BELL');

fs.writeFileSync('src/game/Constants.ts', constStr);

console.log("Replaced overlapping ID collisions");
