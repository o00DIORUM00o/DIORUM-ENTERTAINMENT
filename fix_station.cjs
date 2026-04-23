const fs = require('fs');

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

playerCode = playerCode.replace(/} else if \(stationId === 'forge'\) \{/,
`} else if (stationId === 'forge') {
            // forge doesn't exist as a block type yet...
        } else if (stationId === 'alchemy_table') {
            stationBlockType = BlockType.ALCHEMY_TABLE;
        } else if (stationId === 'forge') {`);

fs.writeFileSync('src/game/Player.ts', playerCode);
