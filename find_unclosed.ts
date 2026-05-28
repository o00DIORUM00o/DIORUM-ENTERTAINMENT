import * as fs from 'fs';
const code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

let depth = 0;
let lines = code.split('\n');
for (let line = 36; line < 574; line++) {
    for (let i = 0; i < lines[line].length; i++) {
        const char = lines[line][i];
        if (char === '{') depth++;
        if (char === '}') depth--;
    }
}
console.log(`Delta depth between line 37 and 574: ${depth}`);
