import * as fs from 'fs';
const code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

let lines = code.split('\n');
let ranges = [
  [36, 100], [100, 200], [200, 300], [300, 400], [400, 500], [500, 574]
];

for (const [start, end] of ranges) {
    let depth = 0;
    for (let line = start; line < end; line++) {
        for (let i = 0; i < lines[line].length; i++) {
            const char = lines[line][i];
            if (char === '{') depth++;
            if (char === '}') depth--;
        }
    }
    console.log(`Delta depth between ${start} and ${end}: ${depth}`);
}
