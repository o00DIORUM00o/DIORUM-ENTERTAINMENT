import * as fs from 'fs';
let code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');
code += '\n}\n';
fs.writeFileSync('src/game/world/TerrainGenerator.ts', code);
