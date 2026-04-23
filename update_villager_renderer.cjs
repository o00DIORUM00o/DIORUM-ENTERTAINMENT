const fs = require('fs');

let rCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');

// Replace the Wizard rendering logic to handle different NPC types
rCode = rCode.replace(/\/\/ Wizard Robe\n\ \ \ \ \ \ \ \ \ \ \ \ ctx\.fillStyle = \'#4c1d95\'\; \/\/ Deep purple/g, 
`// NPC rendering
            if (npc.type === 'VILLAGER') {
                const prof = (npc as any).profession;
                
                // Base body
                if (prof === 'VILLAGER_GUARD') ctx.fillStyle = '#1e3a8a'; // Dark blue guard uniform
                else if (prof === 'VILLAGER_FARMER') ctx.fillStyle = '#65a30d'; // Olive green farmer
                else ctx.fillStyle = '#78716c'; // Grey commoner/merchant
                
                ctx.beginPath();
                ctx.arc(0, 0, TILE_SIZE * 0.3, 0, Math.PI * 2);
                ctx.fill();
                
                // Head (tan)
                ctx.fillStyle = '#fcd34d';
                ctx.beginPath();
                ctx.arc(TILE_SIZE * 0.1, 0, TILE_SIZE * 0.25, 0, Math.PI * 2);
                ctx.fill();
                
                // Profession Hat/Item
                if (prof === 'VILLAGER_GUARD') {
                    // Iron Helmet line
                    ctx.fillStyle = '#cbd5e1';
                    ctx.fillRect(TILE_SIZE * -0.1, -TILE_SIZE * 0.25, TILE_SIZE * 0.3, TILE_SIZE * 0.5);
                    // Spear
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.25, TILE_SIZE * 0.8, 4);
                    ctx.fillStyle = '#94a3b8'; // Spear tip
                    ctx.beginPath();
                    ctx.moveTo(TILE_SIZE * 1.0, TILE_SIZE * 0.25 + 2);
                    ctx.lineTo(TILE_SIZE * 1.2, TILE_SIZE * 0.25 + 2);
                    ctx.lineTo(TILE_SIZE * 1.0, TILE_SIZE * 0.25 + 8);
                    ctx.fill();
                } else if (prof === 'VILLAGER_FARMER') {
                    // Straw hat
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * -0.05, 0, TILE_SIZE * 0.35, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ca8a04';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * 0.05, 0, TILE_SIZE * 0.2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Cash bag / coin for merchant
                    ctx.fillStyle = '#eab308';
                    ctx.beginPath();
                    ctx.arc(TILE_SIZE * 0.4, 0, TILE_SIZE * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                }

            } else {
                // Wizard Robe
                ctx.fillStyle = '#4c1d95'; // Deep purple`);

rCode = rCode.replace(/ctx\.arc\(TILE_SIZE \* 0\.6\, -TILE_SIZE \* 0\.2\, TILE_SIZE \* 0\.06\, 0\, Math\.PI \* 2\);\n\ \ \ \ \ \ \ \ \ \ \ \ ctx\.fill\(\)\;\n\n\ \ \ \ \ \ \ \ \ \ \ \ ctx\.beginPath\(\)\;\n\ \ \ \ \ \ \ \ \ \ \ \ ctx\.arc\(TILE_SIZE \* 0\.6\, TILE_SIZE \* 0\.2\, TILE_SIZE \* 0\.06\, 0\, Math\.PI \* 2\);\n\ \ \ \ \ \ \ \ \ \ \ \ ctx\.fill\(\)\;/g,
`ctx.arc(TILE_SIZE * 0.6, -TILE_SIZE * 0.2, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(TILE_SIZE * 0.6, TILE_SIZE * 0.2, TILE_SIZE * 0.06, 0, Math.PI * 2);
            ctx.fill();
            } // End of Wizard/Else block`);

fs.writeFileSync('src/game/Renderer.ts', rCode);
