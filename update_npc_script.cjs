const fs = require('fs');

let npcCode = fs.readFileSync('src/game/entities/NPCUpdater.ts', 'utf8');

npcCode = npcCode.replace(/if \(npc\.state \=\=\= \'TALKING\'\) \{/g, 
`
                // Villager Guard Logic
                let targetEnemy = null;
                if (npc.type === 'VILLAGER' && (npc as any).profession === 'VILLAGER_GUARD') {
                    const enemiesList = [...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.lavaGolems, ...engine.bees, ...engine.ants, ...(engine.slimes || []), ...(engine.caveSpiders || []), ...(engine.fireImps || [])];
                    let closestDist = 15;
                    for(const e of enemiesList) {
                         const d = Math.hypot(e.x - npc.x, e.y - npc.y);
                         if (d < closestDist && Math.abs(e.z - npc.z) < 2) {
                              closestDist = d;
                              targetEnemy = e;
                         }
                    }
                }

                if (targetEnemy) {
                    npc.state = 'COMBAT';
                    const dyE = targetEnemy.y - npc.y;
                    const dxE = targetEnemy.x - npc.x;
                    npc.aimAngle = Math.atan2(dyE, dxE);
                    
                    if (closestDist > 1.5) {
                        npc.vx = Math.cos(npc.aimAngle) * 4;
                        npc.vy = Math.sin(npc.aimAngle) * 4;
                    } else {
                        npc.vx = 0;
                        npc.vy = 0;
                        if (npc.attackCooldown <= 0) {
                            npc.attackTimer = 0.5;
                            npc.attackCooldown = 1.0;
                            // Attack the enemy
                            targetEnemy.health -= 25;
                            if (targetEnemy.hp !== undefined) targetEnemy.hp -= 25; // fallback
                            engine.particles.push({x: targetEnemy.x, y: targetEnemy.y, z: targetEnemy.z + 1, text: '25', color: '#ff0000', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                            
                            // Audio cue for sword
                            engine.particles.push({x: npc.x, y: npc.y, z: npc.z+1, text: 'SWISH!', color: '#aaaaaa', life: 0.3, maxLife: 0.3, speed: 0, vy: 0, vx: 0, vz: 0});
                        }
                    }
                } else if (npc.state === 'TALKING') {`);
                
npcCode = npcCode.replace(/\} else \{\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \/\/ IDLE \/ WANDER/g, 
`} else {
                    // WANDER NEAR HOME IF VILLAGER, WANDER NEAR CAVE IF OLD WIZARD
                    if ((npc as any).homeX !== undefined) {
                        const hDist = Math.hypot(npc.x - (npc as any).homeX, npc.y - (npc as any).homeY);
                        if (hDist > 12) {
                            // Walk back home
                            const hAngle = Math.atan2((npc as any).homeY - npc.y, (npc as any).homeX - npc.x);
                            npc.vx = Math.cos(hAngle) * 1.5;
                            npc.vy = Math.sin(hAngle) * 1.5;
                            npc.state = 'WANDER';
                        } else {
                             if (Math.random() < 0.01) {
                                npc.state = Math.random() < 0.5 ? 'IDLE' : 'WANDER';
                                if (npc.state === 'WANDER') {
                                    npc.aimAngle = Math.random() * Math.PI * 2;
                                    npc.vx = Math.cos(npc.aimAngle) * 1;
                                    npc.vy = Math.sin(npc.aimAngle) * 1;
                                } else {
                                    npc.vx = 0;
                                    npc.vy = 0;
                                }
                            }
                        }
                    } else if (Math.random() < 0.01) {`);

npcCode = npcCode.replace(/engine\.player\.addXp\(1000\)\;/g, `if (npc.type !== 'VILLAGER') engine.player.addXp(1000);`);
npcCode = npcCode.replace(/engine\.dropItem\(npc\.x\, npc\.y\, npc\.z\, \{ \.\.\.ITEMS\['book_fire_bolt'\]\, quantity\: 1 \}\)\;/g, `if (npc.type !== 'VILLAGER') engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['book_fire_bolt'], quantity: 1 });`);
npcCode = npcCode.replace(/engine\.dropItem\(npc\.x\, npc\.y\, npc\.z\, \{ \.\.\.ITEMS\['gold_piece'\]\, quantity\: 50 \}\)\;/g, `if (npc.type !== 'VILLAGER') engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: 50 }); else engine.dropItem(npc.x, Math.floor(npc.y), npc.z, { ...ITEMS[(npc as any).profession === 'VILLAGER_GUARD' ? 'iron_ingot' : 'cloth'], quantity: 3});`);

fs.writeFileSync('src/game/entities/NPCUpdater.ts', npcCode);
