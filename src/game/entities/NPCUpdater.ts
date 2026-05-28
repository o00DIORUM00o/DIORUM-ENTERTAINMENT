import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

import { BlockType } from '../constants/BlockType';
import { isSolid } from '../World';;
import { ITEMS, SPELLS } from "../Inventory";
import { Updater } from "../Updater";

export class NPCUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.npcs.length - 1; i >= 0; i--) {
            const npc = engine.npcs[i];
            
            npc.vz -= 20 * dt; // Gravity
            EntitySteeringSystem.applyBoids(npc, engine, dt);
                    EntitySteeringSystem.applyDodge(npc, engine, dt);
            npc.x += npc.vx * dt;
            npc.y += npc.vy * dt;
            npc.z += npc.vz * dt;

            // Floor collision
            const blockStandingOn = engine.world.getBlock(Math.floor(npc.x), Math.floor(npc.y), Math.floor(npc.z - 0.01));
            if (isSolid(blockStandingOn) && blockStandingOn !== BlockType.DOOR_OPEN) {
                npc.z = Math.floor(npc.z - 0.01) + 1;
                npc.vz = 0;
            }

            // Wall collision
            const block = engine.world.getBlock(Math.floor(npc.x), Math.floor(npc.y), Math.floor(npc.z));
            if (isSolid(block)) {
                npc.x -= npc.vx * dt;
                npc.y -= npc.vy * dt;
                npc.vx = 0;
                npc.vy = 0;
            }

            if (npc.stunTimer && npc.stunTimer > 0) {
                npc.stunTimer -= dt;
                npc.vx = 0;
                npc.vy = 0;
            } else {
                const dx = engine.player.x - npc.x;
                const dy = engine.player.y - npc.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (npc.type === 'WANDERING_BARD' && Math.random() < 0.05) {
                    engine.particles.push({
                        x: npc.x + (Math.random() - 0.5), y: npc.y + (Math.random() - 0.5), z: npc.z + 1 + Math.random(),
                        text: ['♪', '♫', '♩', '♬'][Math.floor(Math.random() * 4)],
                        color: `hsl(${Math.random() * 360}, 80%, 70%)`,
                        life: 1.0, maxLife: 1.0, speed: 0, vy: 0.5, vx: (Math.random()-0.5)*0.5, vz: (Math.random()-0.5)*0.5, size: 1.5
                    });
                }

                if (npc.disposition <= -50) {
                    npc.state = 'COMBAT';
                } else if (npc.state === 'COMBAT' && npc.disposition > -50) {
                    npc.state = 'IDLE';
                }

                
                // Villager Guard / Human Combat Logic
                let targetEnemy = null;
                if ((npc.type === 'VILLAGER' && (npc as any).profession === 'VILLAGER_GUARD') || npc.type === 'HUMAN_KNIGHT' || npc.type === 'HUMAN_PALADIN' || npc.type === 'HUMAN_RANGER' || npc.type === 'DWARF' || npc.type === 'GNOME') {
                    const enemiesList = [...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.lavaGolems, ...engine.bees, ...engine.ants, ...(engine.slimes || []), ...(engine.caveSpiders || []), ...(engine.fireImps || [])];
                    let closestDist = 15;
                    for(const e of enemiesList) {
                         const d = Math.hypot(e.x - npc.x, e.y - npc.y);
                         if (d < closestDist && Math.abs(e.z - npc.z) < 1.0) {
                              closestDist = d;
                              targetEnemy = e;
                         }
                    }
                }

                // Wolf Folk Territorial Logic
                if (npc.type === 'WOLF_FOLK' && npc.homeX !== undefined && npc.homeY !== undefined) {
                    const distToHome = Math.hypot(engine.player.x - (npc as any).homeX, engine.player.y - (npc as any).homeY);
                    if (distToHome < 20 && engine.player.z >= npc.homeZ - 2 && engine.player.z <= npc.homeZ + 2) {
                        npc.state = 'COMBAT';
                        npc.disposition = -100; // Become hostile to player
                        if (npc.onMessage && Math.random() < 0.05) {
                           engine.particles.push({x: npc.x, y: npc.y, z: npc.z + 1, text: 'Defend the territory!', color: '#ffaaaa', life: 1, maxLife: 1, speed: 0, vy: -1, vx: 0, vz: 0});
                        }
                    }
                }
                
                // Halfling / Pit Bull / Terrier / Human defensive logic
                if ((npc.type === 'HALFLING' || npc.type === 'PIT_BULL_FOLK' || npc.type === 'TERRIER_FOLK' || npc.type === 'HUMAN_KNIGHT' || npc.type === 'HUMAN_PALADIN' || npc.type === 'HUMAN_RANGER' || npc.type === 'DWARF' || npc.type === 'GNOME' || npc.type === 'VILLAGER' || npc.type === 'SQUIRREL_FOLK' || npc.type === 'BEAST_TAMER')) {
                    // Check if nearby friendlies are under attack
                    let friendlyUnderAttack = false;
                    for (const otherNpc of engine.npcs) {
                        if (otherNpc !== npc && otherNpc.disposition <= -50 && Math.hypot(otherNpc.x - npc.x, otherNpc.y - npc.y) < 20) {
                            friendlyUnderAttack = true;
                            if (npc.disposition > -50) npc.disposition = -100;
                            break;
                        }
                    }

                    const distToHome = npc.homeX !== undefined && npc.homeY !== undefined ? Math.hypot(engine.player.x - (npc as any).homeX, engine.player.y - (npc as any).homeY) : 0;
                    // Defensive if attacked or disposition is low
                    if (npc.disposition <= -50 && (distToHome < 30 || friendlyUnderAttack)) {
                        npc.state = 'COMBAT';
                        if (npc.onMessage && Math.random() < 0.05) {
                            let text = 'For Herat!';
                            if (npc.type === 'DWARF') text = 'For Tarhe! For the mountain!';
                            if (npc.type === 'GNOME') text = 'Intruder in the machinery!';
                            if (npc.type === 'VILLAGER') text = 'Guards! Help!';
                            engine.particles.push({x: npc.x, y: npc.y, z: npc.z + 1, text: text, color: '#ffaaaa', life: 1, maxLife: 1, speed: 0, vy: -1, vx: 0, vz: 0});
                        }
                    }
                }

                if (targetEnemy) {
                    npc.state = 'COMBAT';
                    const dyE = targetEnemy.y - npc.y;
                    const dxE = targetEnemy.x - npc.x;
                    const cDist = Math.hypot(dxE, dyE);
                    npc.aimAngle = Math.atan2(dyE, dxE);
                    
                    if (npc.type === 'HUMAN_RANGER' || npc.type === 'HUMAN_PALADIN' || npc.type === 'DWARF' || npc.type === 'GNOME') {
                        if (cDist > 10) {
                            npc.vx = Math.cos(npc.aimAngle) * 4;
                            npc.vy = Math.sin(npc.aimAngle) * 4;
                        } else {
                            npc.vx = 0;
                            npc.vy = 0;
                            if (npc.attackCooldown <= 0) {
                                npc.attackTimer = 0.5;
                                npc.attackCooldown = 2.0;

                                if (npc.type === 'HUMAN_RANGER') {
                                    engine.projectiles.push({
                                        x: npc.x, y: npc.y, z: npc.z + 0.5,
                                        vx: Math.cos(npc.aimAngle) * 20, vy: Math.sin(npc.aimAngle) * 20, vz: (targetEnemy.z - npc.z) / cDist * 20,
                                        type: 'ARROW', damage: 30, life: 2.0, source: 'ENEMY', isPlayer: false, color: '#facc15'
                                    });
                                } else if (npc.type === 'GNOME') {
                                    engine.projectiles.push({
                                        x: npc.x, y: npc.y, z: npc.z + 0.5,
                                        vx: Math.cos(npc.aimAngle) * 25, vy: Math.sin(npc.aimAngle) * 25, vz: (targetEnemy.z - npc.z) / cDist * 25,
                                        type: 'ARROW', damage: 15, life: 1.5, source: 'ENEMY', isPlayer: false, color: '#aaaaaa'
                                    });
                                    npc.attackCooldown = 0.5;
                                } else if (npc.type === 'DWARF') {
                                    engine.projectiles.push({
                                        x: npc.x, y: npc.y, z: npc.z + 0.5,
                                        vx: Math.cos(npc.aimAngle) * 12, vy: Math.sin(npc.aimAngle) * 12, vz: ((targetEnemy.z - npc.z) / cDist * 12) + 5,
                                        type: 'BOOMERANG', damage: 35, life: 2.5, source: 'ENEMY', isPlayer: false, color: '#71717a'
                                    });
                                } else if (npc.type === 'HUMAN_PALADIN' && Math.random() < 0.5) {
                                    engine.projectiles.push({
                                        x: npc.x, y: npc.y, z: npc.z + 0.5,
                                        vx: Math.cos(npc.aimAngle) * 15, vy: Math.sin(npc.aimAngle) * 15, vz: (targetEnemy.z - npc.z) / cDist * 15,
                                        type: 'FIRE_BOLT', damage: 40, life: 2.0, source: 'ENEMY', isPlayer: false, color: '#ffff00'
                                    });
                                } else if (cDist < 2.0) {
                                    npc.vx = 0;
                                    npc.vy = 0;
                                    npc.attackCooldown = 1.0;
                                    targetEnemy.health -= 45;
                                    if (targetEnemy.hp !== undefined) targetEnemy.hp -= 45; // fallback
                                    engine.particles.push({x: targetEnemy.x, y: targetEnemy.y, z: targetEnemy.z + 1, text: '45', color: '#ffff00', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                                } else {
                                    npc.vx = Math.cos(npc.aimAngle) * 4;
                                    npc.vy = Math.sin(npc.aimAngle) * 4;
                                }
                            }
                        }
                    } else {
                        if (cDist > 1.5) {
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
                    }
                } else if (npc.state === 'CARAVAN_LEADER' && npc.type === 'POMERANIAN_FOLK') {
                    if (npc.disposition <= -50 || npc.health < npc.maxHealth) {
                        npc.state = 'COMBAT';
                        npc.disposition = -100;
                    } else {
                        // Pomeranian caravans move in a straight line, slowly exploring
                        npc.aimAngle += (Math.random() - 0.5) * dt; // Slight wander while moving generally straight
                        npc.vx = Math.cos(npc.aimAngle) * 2;
                        npc.vy = Math.sin(npc.aimAngle) * 2;
                    }
                } else if (npc.state === 'CARAVAN_FOLLOWER' && npc.type === 'POMERANIAN_FOLK') {
                    if (npc.disposition <= -50 || npc.health < npc.maxHealth) {
                        npc.state = 'COMBAT';
                        npc.disposition = -100;
                    } else {
                        const leader = engine.npcs.find((n: any) => n.type === 'POMERANIAN_FOLK' && n.state === 'CARAVAN_LEADER');
                        if (leader) {
                           const ldx = leader.x - npc.x;
                           const ldy = leader.y - npc.y;
                           const ldist = Math.hypot(ldx, ldy);
                           if (ldist > 3) { // Follow distance
                               npc.aimAngle = Math.atan2(ldy, ldx);
                               npc.vx = Math.cos(npc.aimAngle) * 2;
                               npc.vy = Math.sin(npc.aimAngle) * 2;
                           } else {
                               npc.vx = 0;
                               npc.vy = 0;
                           }
                        } else {
                            npc.state = 'CARAVAN_LEADER'; // Become new leader if none exists
                        }
                    }
                } else if (npc.state === 'TALKING') {
                    npc.vx = 0;
                    npc.vy = 0;
                    npc.aimAngle = Math.atan2(dy, dx); // Look at player
                } else if (npc.state === 'COMBAT') {
                    if (dist < 15) {
                        npc.aimAngle = Math.atan2(dy, dx);
                        if (dist > 5) {
                            npc.vx = Math.cos(npc.aimAngle) * 2;
                            npc.vy = Math.sin(npc.aimAngle) * 2;
                        } else if (dist < 3) {
                            npc.vx = -Math.cos(npc.aimAngle) * 2;
                            npc.vy = -Math.sin(npc.aimAngle) * 2;
                        } else {
                            npc.vx = 0;
                            npc.vy = 0;
                        }

                        if (npc.attackCooldown <= 0) {
                            npc.attackTimer = 0.5;
                            npc.attackCooldown = 2.0;

                            if (npc.type === 'WOLF_FOLK' || npc.type === 'PIT_BULL_FOLK' || npc.type === 'TERRIER_FOLK' || npc.type === 'POMERANIAN_FOLK' || npc.type === 'HALFLING' || npc.type === 'HUMAN_KNIGHT' || npc.type === 'SQUIRREL_FOLK' || npc.type === 'BEAST_TAMER') {
                                if (dist < 3.5) {
                                  const dmg = npc.type === 'HUMAN_KNIGHT' ? 25 : npc.type === 'BEAST_TAMER' ? 30 : npc.type === 'SQUIRREL_FOLK' ? 10 : 15;
                                  engine.player.takeDamage(dmg);
                                  engine.particles.push({x: engine.player.x, y: engine.player.y, z: engine.player.z + 1, text: dmg.toString(), color: '#ff0000', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                                  npc.attackCooldown = 1.0;
                                }
                            } else if (npc.type === 'HUMAN_PALADIN') {
                                if (dist < 3.5) {
                                  engine.player.takeDamage(35);
                                  engine.particles.push({x: engine.player.x, y: engine.player.y, z: engine.player.z + 1, text: '35', color: '#ff0000', life: 0.5, maxLife: 0.5, speed: 0, vy: -1, vx: 0, vz: 0});
                                  npc.attackCooldown = 1.5;
                                } else if (Math.random() < 0.3) {
                                    // Holy Bolt
                                    engine.projectiles.push({
                                        x: npc.x, y: npc.y, z: npc.z + 0.5,
                                        vx: Math.cos(npc.aimAngle) * 15, vy: Math.sin(npc.aimAngle) * 15, vz: (engine.player.z - npc.z) / dist * 15,
                                        type: 'FIRE_BOLT', damage: 20, life: 2.0, source: 'ENEMY', isPlayer: false, color: '#ffff00'
                                    });
                                    npc.attackCooldown = 2.0;
                                }
                            } else if (npc.type === 'HUMAN_RANGER') {
                                engine.projectiles.push({
                                    x: npc.x, y: npc.y, z: npc.z + 0.5,
                                    vx: Math.cos(npc.aimAngle) * 20, vy: Math.sin(npc.aimAngle) * 20, vz: (engine.player.z - npc.z) / dist * 20,
                                    type: 'ARROW', damage: 20, life: 2.0, source: 'ENEMY', isPlayer: false, color: '#facc15'
                                });
                                npc.attackCooldown = 1.5;
                            } else if (npc.type === 'DARK_ELF') {
                                // Shoot poison arrow
                                engine.projectiles.push({
                                    x: npc.x,
                                    y: npc.y,
                                    z: npc.z + 0.5,
                                    vx: Math.cos(npc.aimAngle) * 16,
                                    vy: Math.sin(npc.aimAngle) * 16,
                                    vz: (engine.player.z - npc.z) / dist * 16,
                                    type: 'ARROW',
                                    damage: 25,
                                    life: 2.0,
                                    source: 'ENEMY',
                                    isPlayer: false,
                                    color: '#d946ef' // Purple acid arrow
                                });
                            } else if (npc.type === 'GNOME') {
                                // Shoot extremely fast small bolts
                                engine.projectiles.push({
                                    x: npc.x,
                                    y: npc.y,
                                    z: npc.z + 0.5,
                                    vx: Math.cos(npc.aimAngle) * 25,
                                    vy: Math.sin(npc.aimAngle) * 25,
                                    vz: (engine.player.z - npc.z) / dist * 25,
                                    type: 'ARROW',
                                    damage: 15,
                                    life: 1.5,
                                    source: 'ENEMY',
                                    isPlayer: false,
                                    color: '#aaaaaa' // steel bolt
                                });
                                npc.attackCooldown = 0.5; // Gnomes shoot faster!
                            } else if (npc.type === 'DWARF') {
                                // Throw a heavy axe or hammer (ARCING projectile)
                                engine.projectiles.push({
                                    x: npc.x,
                                    y: npc.y,
                                    z: npc.z + 0.5,
                                    vx: Math.cos(npc.aimAngle) * 12,
                                    vy: Math.sin(npc.aimAngle) * 12,
                                    vz: ((engine.player.z - npc.z) / dist * 12) + 5, // Arch upwards
                                    type: 'BOOMERANG', // Use boomerang type for spinning graphic
                                    damage: 35,
                                    life: 2.5,
                                    source: 'ENEMY',
                                    isPlayer: false,
                                    color: '#71717a'
                                });
                            } else {
                                // Shoot fire bolt
                                engine.projectiles.push({
                                    x: npc.x,
                                    y: npc.y,
                                    z: npc.z + 0.5,
                                    vx: Math.cos(npc.aimAngle) * 10,
                                    vy: Math.sin(npc.aimAngle) * 10,
                                    vz: (engine.player.z - npc.z) / dist * 10,
                                    type: 'FIRE_BOLT',
                                    damage: 25,
                                    life: 2.0,
                                    source: 'ENEMY',
                                    isPlayer: false,
                                    color: '#ff4500'
                                });
                            }
                        }
                    } else {
                        npc.vx = 0;
                        npc.vy = 0;
                    }
                } else {
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
                    } else if (Math.random() < 0.01) {
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
                    if (dist < 3) {
                        npc.aimAngle = Math.atan2(dy, dx); // Look at player
                    }
                }
            }

            // Ensure aim angle correctly reflects velocity if actively moving and not aimed at player/target
            if (Math.abs(npc.vx) > 0.01 || Math.abs(npc.vy) > 0.01) {
                if (npc.state === 'WANDER' || npc.state === 'CARAVAN_LEADER' || npc.state === 'CARAVAN_FOLLOWER' || (npc.state !== 'COMBAT' && npc.state !== 'CHASE' && npc.state !== 'TALKING')) {
                    npc.aimAngle = Math.atan2(npc.vy, npc.vx);
                }
            }

            if (npc.attackCooldown > 0) npc.attackCooldown -= dt;
            if (npc.attackTimer > 0) npc.attackTimer -= dt;

            if (npc.health <= 0) {
                removeFromArray(engine.npcs, i);
                if (npc.type === 'DARK_ELF') {
                    engine.player.addXp(1200);
                    if (Math.random() < 0.25) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['dark_elf_blade'] });
                    if (Math.random() < 0.25) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['dark_elf_bow'] });
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 50) + 10 });
                } else if (npc.type === 'DWARF') {
                    engine.player.addXp(1500); // Dwarves are tough
                    if (Math.random() < 0.25) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['dwarven_hammer'] });
                    if (Math.random() < 0.25) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['dwarven_pickaxe'] });
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 75) + 25 });
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['steel_ingot'], quantity: Math.floor(Math.random() * 3) + 1 });
                } else if (npc.type === 'GNOME') {
                    engine.player.addXp(800);
                    if (Math.random() < 0.3) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gnomish_crossbow'] });
                    if (Math.random() < 0.5) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gnomish_gear'], quantity: Math.floor(Math.random() * 3) + 1 });
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 30) + 10 });
                } else if (npc.type === 'SQUIRREL_FOLK') {
                    engine.player.addXp(120);
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['acorn'], quantity: Math.floor(Math.random() * 3) + 1 });
                    if (Math.random() < 0.2) engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 20) + 5 });
                } else if (npc.type === 'BEAST_TAMER') {
                    engine.player.addXp(400);
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['leather'], quantity: Math.floor(Math.random() * 3) + 1 });
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 50) + 10 });
                } else if (npc.type === 'WOLF_FOLK' || npc.type === 'PIT_BULL_FOLK' || npc.type === 'POMERANIAN_FOLK' || npc.type === 'TERRIER_FOLK' || npc.type === 'HALFLING') {
                    engine.player.addXp(100);
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 50) + 10 });
                } else if (npc.type === 'HUMAN_KNIGHT' || npc.type === 'HUMAN_PALADIN' || npc.type === 'HUMAN_RANGER') {
                    engine.player.addXp(750);
                    engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: Math.floor(Math.random() * 150) + 50 });
                } else {
                    engine.player.addXp(npc.type === 'VILLAGER' ? 50 : 1000);
                    if (npc.type !== 'VILLAGER') engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['book_fire_bolt'], quantity: 1 });
                    if (npc.type !== 'VILLAGER') engine.dropItem(npc.x, npc.y, npc.z, { ...ITEMS['gold_piece'], quantity: 50 }); else engine.dropItem(npc.x, Math.floor(npc.y), npc.z, { ...ITEMS[(npc as any).profession === 'VILLAGER_GUARD' ? 'iron_ingot' : 'cloth'], quantity: 3});
                }
            }
        }
    }
}
