const fs = require('fs');

const path = 'src/game/player/actions/ConsumableAction.ts';
let content = fs.readFileSync(path, 'utf8');

const spawnLogic = `
                    if (item.summonsBoss) {
                        if (ctx.engine) {
                            const newBoss = {
                                id: \`boss_\${Date.now()}\`,
                                type: item.summonsBoss,
                                name: item.name,
                                x: player.x,
                                y: player.y + 2,
                                z: player.z,
                                vx: 0, vy: 0, vz: 0,
                                maxHealth: 2000,
                                health: 2000,
                                damage: 40,
                                speed: 2,
                                state: 'WANDER'
                            };
                            if (!ctx.engine.metalGolems) ctx.engine.metalGolems = [];
                            ctx.engine.metalGolems.push(newBoss);
                            if (player.onMessage) player.onMessage(\`Summoned \${item.name}!\`);
                            consumed = true;
                        }
                    }
                    if (item.summonsNPC) {
                        if (ctx.engine) {
                            const newNPC = {
                                id: \`npc_\${Date.now()}\`,
                                type: item.summonsNPC,
                                name: item.name,
                                x: player.x,
                                y: player.y + 2,
                                z: player.z,
                                vx: 0, vy: 0, vz: 0,
                                maxHealth: 1000,
                                health: 1000,
                                damage: 0,
                                speed: 1,
                                isMerchant: true,
                                tradeInventory: [],
                                state: 'WANDER'
                            };
                            if (!ctx.engine.npcs) ctx.engine.npcs = [];
                            ctx.engine.npcs.push(newNPC);
                            if (player.onMessage) player.onMessage(\`Summoned \${item.name}!\`);
                            consumed = true;
                        }
                    }
                    if (item.id === 'red_berry') {
`;

content = content.replace("if (item.id === 'red_berry') {", spawnLogic);
fs.writeFileSync(path, content);
console.log("Patched ConsumableAction.ts");
