const fs = require('fs');

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

playerCode = playerCode.replace(/\|\| block === BlockType\.CARPENTERS_BENCH \|\|/g, 
`|| block === BlockType.CARPENTERS_BENCH || block === BlockType.ALCHEMY_TABLE ||`);

playerCode = playerCode.replace(/} else if \(block === BlockType\.CARPENTERS_BENCH\) \{/g,
`} else if (block === BlockType.ALCHEMY_TABLE) {
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['alchemy_table'] });
                                                } else if (block === BlockType.CARPENTERS_BENCH) {`);

playerCode = playerCode.replace(/\|\| currentBlock === BlockType\.CARPENTERS_BENCH \|\|/g, 
`|| currentBlock === BlockType.CARPENTERS_BENCH || currentBlock === BlockType.ALCHEMY_TABLE ||`);

playerCode = playerCode.replace(/} else if \(currentBlock === BlockType\.CARPENTERS_BENCH\) \{/g,
`} else if (currentBlock === BlockType.ALCHEMY_TABLE) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['alchemy_table'] });
                                } else if (currentBlock === BlockType.CARPENTERS_BENCH) {`);

fs.writeFileSync('src/game/Player.ts', playerCode);

