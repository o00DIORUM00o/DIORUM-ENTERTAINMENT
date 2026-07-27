const fs = require('fs');
const path = 'src/game/entities/CompanionUpdater.ts';
let content = fs.readFileSync(path, 'utf8');

const newPassive = `
                    } else if (ent.type === 'SILVER_GOLEM' && engine.player.health < engine.player.maxHealth) {
                        engine.player.health = Math.min(engine.player.maxHealth, engine.player.health + 10);
                        engine.particles.push({x: engine.player.x, y: engine.player.y, z: engine.player.z + 1, text: '+10 HP', color: '#00ff00', life: 1, maxLife: 1, vx: 0, vy: 0, vz: 1});
                    } else if (ent.type === 'ARCANE_CRYSTAL'
`;

content = content.replace("} else if (ent.type === 'ARCANE_CRYSTAL'", newPassive);
fs.writeFileSync(path, content);
console.log("Patched CompanionUpdater.ts");
