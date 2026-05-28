import { Engine } from '../Engine';
import { isSolid } from '../World';
import { ITEMS } from '../Inventory';

export class CompanionUpdater {
    static updateAll(engine: Engine, dt: number) {
        // Find entities that are marked as companions
        for (let i = engine.entities.length - 1; i >= 0; i--) {
            const ent = engine.entities[i];
            if (!ent.isCompanion) continue;

            const speed = ent.speed || 10.0;
            const px = engine.player.x;
            const py = engine.player.y;
            
            const dx = px - ent.x;
            const dy = py - ent.y;
            const distToPlayer = Math.sqrt(dx*dx + dy*dy);
            
            // Auto heal slowly
            if (ent.health < ent.maxHealth) {
                ent.health += dt * 0.5; 
            }
            if (!ent.level) ent.level = 1;
            if (!ent.xp) ent.xp = 0;
            let xpReq = ent.level * 100;
            
            if (ent.xp >= xpReq) {
                ent.xp -= xpReq;
                ent.level++;
                ent.maxHealth += 20;
                ent.health = ent.maxHealth;
                ent.damage += 5;
                engine.particles.push({
                    x: ent.x, y: ent.y, z: ent.z + 1,
                    text: 'LEVEL UP!', color: '#ffff00',
                    life: 2.0, maxLife: 2.0, vx: 0, vy: 0, vz: 1
                });
            }

            if (!ent.stance) ent.stance = 'AGGRESSIVE';

            let aggroRange = 15; // Aggro range
            if (ent.stance === 'PASSIVE') aggroRange = 0;
            else if (ent.stance === 'DEFENSIVE') aggroRange = 6;

            const allEnemies = [
                ...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.ants, ...engine.rats, ...engine.drakes, ...engine.archers, ...engine.darkKnights, ...engine.abyssalKnights, ...engine.lavaGolems, ...engine.frostCasters, ...engine.phantomWizards, ...engine.shadowWizards, ...engine.sphinxs, ...engine.sandTerrors, ...engine.voidLords, ...engine.fireDragonBosses
            ];

            // Setup closestEnemy tracking
            let closestDist = aggroRange;
            let closestEnemy: any = null;

            for (const enemy of allEnemies) {
                const edx = enemy.x - ent.x;
                const edy = enemy.y - ent.y;
                const edist = Math.sqrt(edx*edx + edy*edy);
                
                // For defensive, we only want to attack enemies near the player
                if (ent.stance === 'DEFENSIVE') {
                    const distToPlayerEnemy = Math.sqrt((enemy.x - px)**2 + (enemy.y - py)**2);
                    if (distToPlayerEnemy > 6) continue;
                }

                if (edist < closestDist) {
                    closestDist = edist;
                    closestEnemy = enemy;
                }
            }

            ent.timer = (ent.timer || 0) + dt;
            
            // Passives
            if (engine.player.activeCompanion && engine.player.activeCompanion.id === ent.id) {
                if (!ent.passiveTimer) ent.passiveTimer = 0;
                ent.passiveTimer += dt;
                
                // Tick passives every 2 seconds
                if (ent.passiveTimer > 2.0) {
                    if (ent.type === 'FAIRY' && engine.player.health < engine.player.maxHealth) {
                        engine.player.health = Math.min(engine.player.maxHealth, engine.player.health + 2);
                        engine.particles.push({x: engine.player.x, y: engine.player.y, z: engine.player.z + 1, text: '+2', color: '#00ff00', life: 1, maxLife: 1, vx: 0, vy: 0, vz: 1});
                    } else if (ent.type === 'ARCANE_CRYSTAL' && engine.player.mana < engine.player.maxMana) {
                        engine.player.mana = Math.min(engine.player.maxMana, engine.player.mana + 5);
                        engine.particles.push({x: engine.player.x, y: engine.player.y, z: engine.player.z + 1, text: '+5 Mana', color: '#0000ff', life: 1, maxLife: 1, vx: 0, vy: 0, vz: 1});
                    } else if (ent.type === 'BABY_TREANT') {
                        if (Math.random() < 0.2) {
                            // Drop berry
                            engine.droppedItems.push({
                                item: { ...ITEMS['red_berry'], quantity: 1, stackable: true, maxStack: 99 },
                                x: ent.x, y: ent.y, z: ent.z,
                                vx: 0, vy: 0, vz: 5, life: 60
                            });
                        }
                    }
                    ent.passiveTimer = 0;
                }
            }

            if (closestEnemy && ent.stance !== 'PASSIVE') {
                // Chase and attack
                const edx = closestEnemy.x - ent.x;
                const edy = closestEnemy.y - ent.y;
                const dist = Math.sqrt(edx*edx + edy*edy);
                
                let attackRange = 1.5;
                if (ent.type === 'TINY_FIRE_DRAGON' || ent.type === 'FAIRY' || ent.type === 'SHADOW_WISP' || ent.type === 'ARCANE_CRYSTAL') attackRange = 6.0;

                if (dist > attackRange) {
                    ent.vx = (edx / dist) * speed;
                    ent.vy = (edy / dist) * speed;
                } else {
                    ent.vx = 0;
                    ent.vy = 0;
                    // Aim at enemy
                    ent.aimAngle = Math.atan2(edy, edx);

                    if (ent.timer > 1.0) { // Attack speed
                        if (ent.type === 'TINY_FIRE_DRAGON') {
                            // Shoot fireball
                            engine.projectiles.push({
                                x: ent.x, y: ent.y, z: ent.z,
                                vx: Math.cos(ent.aimAngle) * 20,
                                vy: Math.sin(ent.aimAngle) * 20,
                                vz: 0,
                                source: ent.id,
                                life: 1.5,
                                maxLife: 1.5,
                                damage: ent.damage || 25,
                                type: 'FIREBALL'
                            });
                            ent.xp += ent.damage || 25;
                        } else if (ent.type === 'FAIRY') {
                            // Shoot magic missile and maybe heal player
                            engine.projectiles.push({
                                x: ent.x, y: ent.y, z: ent.z,
                                vx: Math.cos(ent.aimAngle) * 15,
                                vy: Math.sin(ent.aimAngle) * 15,
                                vz: 0,
                                source: ent.id,
                                life: 1.5, maxLife: 1.5,
                                damage: ent.damage || 15,
                                type: 'magic_missile'
                            });
                            ent.xp += ent.damage || 15;
                            // Small chance to heal player
                            if (Math.random() < 0.25 && engine.player.health < engine.player.maxHealth) {
                                engine.player.health = Math.min(engine.player.maxHealth, engine.player.health + 10);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                                    text: "+10", color: '#00ff00',
                                    life: 1.0, maxLife: 1.0, vx: 0, vy: 0, vz: 1
                                });
                            }
                        } else if (ent.type === 'SHADOW_WISP') {
                            // Shoot dark orb
                            engine.projectiles.push({
                                x: ent.x, y: ent.y, z: ent.z,
                                vx: Math.cos(ent.aimAngle) * 12,
                                vy: Math.sin(ent.aimAngle) * 12,
                                vz: 0,
                                source: ent.id,
                                life: 2.0, maxLife: 2.0,
                                damage: ent.damage || 30,
                                type: 'magic_missile',
                                color: '#4a0080'
                            });
                            ent.xp += ent.damage || 30;
                        } else if (ent.type === 'ARCANE_CRYSTAL') {
                            // Shoot arcane laser
                            engine.projectiles.push({
                                x: ent.x, y: ent.y, z: ent.z,
                                vx: Math.cos(ent.aimAngle) * 25,
                                vy: Math.sin(ent.aimAngle) * 25,
                                vz: 0,
                                source: ent.id,
                                life: 1.0, maxLife: 1.0,
                                damage: ent.damage || 20,
                                type: 'magic_missile',
                                color: '#00ccff'
                            });
                            ent.xp += ent.damage || 20;
                        } else {
                            // Melee
                            closestEnemy.health -= (ent.damage || 10);
                            ent.xp += ent.damage || 10;
                            engine.particles.push({
                                x: closestEnemy.x, y: closestEnemy.y, z: closestEnemy.z + 1,
                                text: (-(ent.damage || 10)).toString(), color: '#ffaa00',
                                life: 0.5, maxLife: 0.5,
                                vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: 2
                            });
                            
                            // Hurt sound mock
                            for(let p = 0; p < 5; p++) {
                                engine.particles.push({
                                    x: closestEnemy.x + (Math.random()-0.5), y: closestEnemy.y + (Math.random()-0.5), z: closestEnemy.z,
                                    text: '', color: '#ff0000', life: 0.3, maxLife: 0.3,
                                    vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 5, speed: 0
                                });
                            }
                        }
                        ent.timer = 0;
                    }
                }
            } else {
                // Follow player
                if (distToPlayer > 15) {
                    // Teleport to player
                    ent.x = px + (Math.random() - 0.5) * 2;
                    ent.y = py + (Math.random() - 0.5) * 2;
                    ent.z = engine.player.z;
                } else if (distToPlayer > 3) {
                    ent.vx = (dx / distToPlayer) * speed;
                    ent.vy = (dy / distToPlayer) * speed;
                } else {
                    // Idle wander
                    if (ent.timer > 2.0) {
                        ent.vx = (Math.random() - 0.5) * speed * 0.5;
                        ent.vy = (Math.random() - 0.5) * speed * 0.5;
                        ent.timer = 0;
                    }
                }
            }

            // Move
            ent.x += ent.vx * dt;
            ent.y += ent.vy * dt;
            
            // Simple Z handling
            const floorZ = engine.world.getElevation(Math.floor(ent.x), Math.floor(ent.y));
            if (ent.z < floorZ + 1) {
                ent.z = floorZ + Math.abs(Math.sin(performance.now()/100)) * 0.5 + 1; // Little hop
            }
        }
    }
}
