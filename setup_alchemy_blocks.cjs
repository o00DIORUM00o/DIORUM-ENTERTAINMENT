const fs = require('fs');

let worldCode = fs.readFileSync('src/game/World.ts', 'utf8');
worldCode = worldCode.replace(/export enum BlockType \{/, 
`export enum BlockType {
    ALCHEMY_TABLE = 98,`);
worldCode = worldCode.replace(/if \(type === BlockType\.DEMON_PORTAL\) return true;/, 
`if (type === BlockType.DEMON_PORTAL) return true;
    if (type === BlockType.ALCHEMY_TABLE) return true;`);
fs.writeFileSync('src/game/World.ts', worldCode);

let constCode = fs.readFileSync('src/game/Constants.ts', 'utf8');
constCode = constCode.replace(/97: \{ r: 139, g: 0, b: 0 \},      \/\/ DEMON_PORTAL \(Dark Red\)/, 
`97: { r: 139, g: 0, b: 0 },      // DEMON_PORTAL (Dark Red)
    98: { r: 75, g: 0, b: 130 },     // ALCHEMY_TABLE (Indigo)`);
fs.writeFileSync('src/game/Constants.ts', constCode);
