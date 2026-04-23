const fs = require('fs');

let rendererCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');

const alchemyCustomDraw = `} else if (block === BlockType.ALCHEMY_TABLE) {
                    // Wood table base
                    ctx.fillStyle = \`rgba(101, 67, 33, \${shade})\`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
                    ctx.fillStyle = \`rgba(139, 90, 43, \${shade})\`; // Table top
                    ctx.fillRect(screenX + TILE_SIZE * 0.05, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.9, TILE_SIZE * 0.2);
                    
                    // Cauldron/Flasks on top
                    ctx.fillStyle = \`rgba(40, 40, 40, \${shade})\`; // Cauldron
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Bubbling liquid inside cauldron
                    ctx.fillStyle = \`rgba(50, 205, 50, \${shade})\`; 
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.3, screenY + TILE_SIZE * 0.18, TILE_SIZE * 0.15, 0, Math.PI * 2);
                    ctx.fill();

                    // Flask 1 (Red)
                    ctx.fillStyle = \`rgba(255, 50, 50, \${shade})\`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.7, screenY + TILE_SIZE * 0.15, TILE_SIZE * 0.1, TILE_SIZE * 0.15);
                    ctx.fillStyle = \`rgba(200, 200, 200, \${shade})\`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.72, screenY + TILE_SIZE * 0.08, TILE_SIZE * 0.06, TILE_SIZE * 0.07);

                    // Flask 2 (Blue)
                    ctx.fillStyle = \`rgba(50, 50, 255, \${shade})\`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.2, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = \`rgba(200, 200, 200, \${shade})\`;
                    ctx.fillRect(screenX + TILE_SIZE * 0.82, screenY + TILE_SIZE * 0.1, TILE_SIZE * 0.06, TILE_SIZE * 0.05);
                } else if (block === BlockType.SPIKE_FLOOR || block === BlockType.SPIKE_FLOOR_ACTIVE) {`;

rendererCode = rendererCode.replace(/\} else if \(block === BlockType\.SPIKE_FLOOR \|\| block === BlockType\.SPIKE_FLOOR_ACTIVE\) \{/, alchemyCustomDraw);

fs.writeFileSync('src/game/Renderer.ts', rendererCode);
