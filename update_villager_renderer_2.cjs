const fs = require('fs');

let rCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');

rCode = rCode.replace(/} else if \(block \=\=\= BlockType\.ALCHEMY_TABLE\) \{/g, 
`} else if (block === BlockType.VILLAGE_BELL) {
                    // Golden Bell
                    ctx.fillStyle = \`rgba(255, 215, 0, \${shade})\`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.6, TILE_SIZE * 0.3, Math.PI, 0);
                    ctx.lineTo(screenX + TILE_SIZE * 0.9, screenY + TILE_SIZE * 0.8);
                    ctx.lineTo(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.8);
                    ctx.fill();
                    
                    // Clapper
                    ctx.fillStyle = \`rgba(184, 134, 11, \${shade})\`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.8, TILE_SIZE * 0.08, 0, Math.PI*2);
                    ctx.fill();
                    
                    // Wooden post holding it
                    ctx.fillStyle = \`rgba(101, 67, 33, \${shade})\`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.6, TILE_SIZE * 0.1);
                    ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.9);
                } else if (block === BlockType.ALCHEMY_TABLE) {`);

fs.writeFileSync('src/game/Renderer.ts', rCode);
