const fs = require('fs');
const lines = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8').split('\n');

let depth = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let startD = depth;
    for (const char of line) {
        if (char === '{') depth++;
        if (char === '}') depth--;
    }
    if (depth < 0) { console.log('NEGATIVE DEPTH AT ' + (i+1)); break; }
    if (i >= 760 && i <= 790) { console.log((i+1) + ": " + line + " (depth " + startD + " -> " + depth + ")"); }
}

