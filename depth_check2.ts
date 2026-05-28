import * as fs from 'fs';
const code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

let depth = 0;
let lines = code.split('\n');
for (let line = 0; line < lines.length; line++) {
    for (let i = 0; i < lines[line].length; i++) {
        const char = lines[line][i];
        if (char === '{') depth++;
        if (char === '}') depth--;
    }
    if (line === 17) console.log(`Line ${line+1}: ${lines[line]} (Depth: ${depth})`);
    if (line === 35) console.log(`Line ${line+1}: ${lines[line]} (Depth: ${depth})`);
    if (line === 36) console.log(`Line ${line+1}: ${lines[line]} (Depth: ${depth})`);
}
