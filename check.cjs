const fs = require('fs');
const content = fs.readFileSync('src/game/constants/BlockType.ts', 'utf8');
const lines = content.split('\n');
const valueMap = {};
lines.forEach(line => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(\d+)/);
    if(match) {
        const key = match[1];
        const val = match[2];
        if(valueMap[val]) {
            console.log('DUPLICATE VALUE:', val, '->', valueMap[val], 'and', key);
        } else {
            valueMap[val] = key;
        }
    }
});
