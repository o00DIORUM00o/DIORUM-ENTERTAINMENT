const fs = require('fs');

let worldCode = fs.readFileSync('src/game/World.ts', 'utf8');

worldCode = worldCode.replace(/export enum BlockType \{/g, 
`export enum BlockType {
    VILLAGE_BELL = 99,`);
    
worldCode = worldCode.replace(/if \(type === BlockType\.ALCHEMY_TABLE\) return true;/g, 
`if (type === BlockType.ALCHEMY_TABLE) return true;
    if (type === BlockType.VILLAGE_BELL) return true;`);

fs.writeFileSync('src/game/World.ts', worldCode);

let constCode = fs.readFileSync('src/game/Constants.ts', 'utf8');
constCode = constCode.replace(/98\: \{ r\: 75\, g\: 0\, b\: 130 \}\,     \/\/ ALCHEMY_TABLE \(Indigo\)/g, 
`98: { r: 75, g: 0, b: 130 },     // ALCHEMY_TABLE (Indigo)
    99: { r: 255, g: 215, b: 0 },    // VILLAGE_BELL (Gold)`);
fs.writeFileSync('src/game/Constants.ts', constCode);
