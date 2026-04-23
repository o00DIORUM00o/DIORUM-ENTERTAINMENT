import { BlockType } from '../constants/BlockType';
import { isIndestructible, getLootForBlock } from '../World';
import { BlockRegistry } from '../registries/BlockRegistry';

export class ProjectileUpdater {
    static update(engine: any, dt: number) {
        for (let i = engine.projectiles.length - 1; i >= 0; i--) {
            const p = engine.projectiles[i];
            p.life -= dt;
            
            if (p.isBoomerang) {
                if (p.returning) {
                    if (p.owner) {
                        const dx = p.owner.x - p.x;
                        const dy = p.owner.y - p.y;
                        const dz = p.owner.z + 0.5 - p.z;
                        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                        if (dist < 0.5) {
                            // Caught it
                            if (p.grabbedItem) {
                                p.owner.addToInventory({ ...p.grabbedItem.item });
                                engine.particles.push({
                                    x: p.owner.x,
                                    y: p.owner.y,
                                    z: p.owner.z + 1,
                                    text: `+${p.grabbedItem.item.name}`,
                                    color: '#22c55e',
                                    life: 1.0,
                                    maxLife: 1.0,
                                    vy: -1
                                });
                            }
                            engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                            engine.projectiles.pop();
                            continue;
                        } else {
                            const speed = 15;
                            p.vx = (dx / dist) * speed;
                            p.vy = (dy / dist) * speed;
                            p.vz = (dz / dist) * speed;
                        }
                    } else {
                        engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                        engine.projectiles.pop();
                        continue;
                    }
                } else if (p.isSeekerBoomerang) {
                    if (!p.hitTargets) p.hitTargets = new Set();
                    
                    let nearestDist = Infinity;
                    let target = null;
                    engine.forEachEntity((ent: any, type: string) => {
                        let healthField = ent.health !== undefined ? 'health' : 'hp';
                        if (!ent || ent === p.owner || ent[healthField] <= 0) return;
                        if (type === 'villager' || type === 'npc' || (type === 'animal' && ent.behavior === 'PASSIVE')) return;
                        if (p.hitTargets.has(ent)) return;
                        
                        const dx = ent.x - p.x;
                        const dy = ent.y - p.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < nearestDist && Math.abs((ent.z || 0) - p.z) < 5 && dist < 15) {
                            nearestDist = dist;
                            target = ent;
                        }
                    });

                    if (target) {
                        const dx = target.x - p.x;
                        const dy = target.y - p.y;
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy) || 18;
                        
                        const desiredVx = (dx / dist) * speed;
                        const desiredVy = (dy / dist) * speed;
                        
                        p.vx += (desiredVx - p.vx) * 0.15;
                        p.vy += (desiredVy - p.vy) * 0.15;
                        
                        const currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
                        p.vx = (p.vx / currentSpeed) * speed;
                        p.vy = (p.vy / currentSpeed) * speed;
                        
                        if (p.life <= 0.1) p.life = 0.5; // keep it alive while hunting
                    } else if (p.life <= 0) {
                        p.returning = true;
                        p.life = 10.0;
                    }
                } else if (p.life <= 0) {
                    p.returning = true;
                    p.life = 10.0; 
                }
                
                p.rotation = (p.rotation || 0) + 15 * dt;
            } else if (p.life <= 0) {
                engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                engine.projectiles.pop();
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.vz !== undefined) {
                p.z += p.vz * dt;
            }

            const bx = Math.floor(p.x);
            const by = Math.floor(p.y);
            const bz = Math.floor(p.z);
            const block = engine.world.getBlock(bx, by, bz);
            
            if (p.damageType === 'ICE') {
                for (let zOffset = 0; zOffset >= -2; zOffset--) {
                    if (engine.world.getBlock(bx, by, bz + zOffset) === BlockType.WATER) {
                        engine.world.setBlock(bx, by, bz + zOffset, BlockType.ICE);
                        engine.world.respawningBlocks.set(`${bx},${by},${bz + zOffset}`, { type: BlockType.WATER, timer: 120.0 });
                    }
                }
            }
            
            if (p.damageType === 'ANIMATE_STONE') {
                if (block === 3 /* STONE */) {
                    engine.world.setBlock(bx, by, bz, 0 /* AIR */);
                    engine.entities.push({
                        id: Math.random().toString(36).substring(2, 11),
                        type: 'stone_golem',
                        x: bx + 0.5,
                        y: by + 0.5,
                        z: bz,
                        hp: 120, maxHp: 120, state: 'idle', timer: 0, friendly: true, lifeTime: 60,
                        customData: { dmgMult: 1.0 }
                    });
                    for (let j = 0; j < 40; j++) engine.particles.push({x:bx+0.5, y:by+0.5, z:bz+0.5, text:'', color:'#969696', life:1, maxLife:1, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:(Math.random()-0.5)*2});
                    engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                    engine.projectiles.pop();
                    continue; 
                }
            }
            
            let hit = false;

            if (p.isPlayer !== false) {
                if (p.isBoomerang && !p.grabbedItem && p.owner && (p.owner.talents['boomerang'] || 0) >= 1) {
                    for (let j = engine.droppedItems.length - 1; j >= 0; j--) {
                        const item = engine.droppedItems[j];
                        const idx = item.x - p.x;
                        const idy = item.y - p.y;
                        const idz = item.z - p.z;
                        if (idx*idx + idy*idy + idz*idz < 1.0) {
                            p.grabbedItem = item;
                            engine.droppedItems[j] = engine.droppedItems[engine.droppedItems.length - 1];
                            engine.droppedItems.pop();
                            p.returning = true;
                            p.life = 10.0;
                            break;
                        }
                    }
                }

                let hitEntity = false;
                engine.forEachEntity((ent: any, type: string) => {
                    if (hitEntity) return;
                    
                    let healthField = ent.health !== undefined ? 'health' : 'hp';
                    if (ent[healthField] === undefined) return;
                    
                    let radiusBuffer = 0.3;
                    if (type === 'bee' || type === 'gremlin') radiusBuffer = 0.2;
                    if (type === 'animal' || type === 'orc' || type === 'djinn') radiusBuffer = 0.45;
                    if (type === 'lavaGolem') radiusBuffer = 0.6;
                    if (type === 'abyssalKnight' || type === 'gargoyle') radiusBuffer = 0.5;
                    if (type === 'sphinx') radiusBuffer = 1.5;
                    
                    const dx = ent.x - p.x;
                    const dy = ent.y - p.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist <= 0.15 + radiusBuffer && Math.abs(ent.z - p.z) < 2.5) {
                        if (ent.type === 'SHADOW_WIZARD' && (!p.isReflected || !p.isReflectable)) {
                            // Hit by normal projectile, do nothing but consume projectile maybe? 
                            // Let's just clank
                            engine.particles.push({ x: p.x, y: p.y, z: p.z + 0.5, text: 'SHIELDED', color: '#aaaaaa', life: 0.5, maxLife: 0.5, vy: -1.0 });
                            hitEntity = true;
                            return;
                        }

                        let finalDamage = p.damage;
                        if (type === 'animal' && (p.isPlayer || p.fromPlayer || (p.owner && p.owner.id === engine.player.id))) {
                            const huntingLevel = engine.player.talents['hunting'] || 0;
                            if (huntingLevel >= 1) finalDamage = Math.floor(finalDamage * 1.5);
                        }
                        
                        ent[healthField] -= finalDamage;
                        
                        if (type === 'npc') ent.disposition -= 100;
                        if (type === 'animal') {
                            if (ent.behavior === 'PASSIVE') { ent.state = 'FLEE'; ent.fleeTimer = 5.0; }
                            else { ent.state = 'CHASE'; ent.target = engine.player; }
                        }
                        if (type === 'abyssalKnight') { ent.target = engine.player; ent.state = 'CHASE'; }
                        if (type === 'goblin' || type === 'kobold' || type === 'orc' || type === 'skeleton' || type === 'lavaGolem' || type === 'rat' || type === 'gargoyle' || type === 'djinn' || type === 'gremlin') {
                            ent.state = 'CHASE';
                            ent.target = engine.player;
                        }
                        if (type === 'sphinx' && ent.state === 'SLEEP') {
                            ent.state = 'IDLE'; ent.stateTimer = 1.0;
                        }

                        const angle = Math.atan2(p.vy, p.vx);
                        if (ent.vx !== undefined && ent.vy !== undefined) {
                            if (type !== 'sphinx') {
                                ent.vx += Math.cos(angle) * 3;
                                ent.vy += Math.sin(angle) * 3;
                            } else {
                                ent.vx += Math.cos(angle) * 0.5;
                                ent.vy += Math.sin(angle) * 0.5;
                            }
                        }

                        if (p.isBoomerang && p.owner && (p.owner.talents['boomerang'] || 0) >= 2) {
                            ent.stunTimer = 3.0;
                        }

                        if (p.statusEffect && Math.random() < p.statusEffect.chance) {
                            if (!ent.statuses) ent.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                            ent.statuses[p.statusEffect.type] = p.statusEffect.duration;
                        }

                        engine.particles.push({
                            x: ent.x, y: ent.y, z: ent.z + 0.5,
                            text: `-${finalDamage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                        });

                        if (p.fromPlayer || p.isPlayer) {
                            const totalLifesteal = engine.player.getEquipmentStats().lifesteal;
                            if (totalLifesteal > 0) {
                                const heal = finalDamage * totalLifesteal;
                                engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + heal);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                                    text: `+${Math.floor(heal)}`, color: '#00ff00', life: 1.0, maxLife: 1.0, vy: -1
                                });
                            }
                        }

                        if (!p.isBoomerang) {
                            hitEntity = true;
                        } else if (p.isSeekerBoomerang) {
                            if (!p.hitTargets) p.hitTargets = new Set();
                            p.hitTargets.add(ent);
                        }
                    }
                });
                
                hit = hitEntity;
            } else {
                const pdx = engine.player.x - p.x;
                const pdy = engine.player.y - p.y;
                const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
                if (pdist <= 0.15 + 0.4 && Math.abs(engine.player.z - p.z) < 1) {
                    engine.player.takeDamage(p.damage);
                    hit = true;
                    engine.particles.push({
                        x: engine.player.x, y: engine.player.y, z: engine.player.z + 0.5,
                        text: `-${p.damage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                    });
                }
            }

            const isSolidBlock = Object.values(BlockType).includes(block) && block !== BlockType.AIR && block !== BlockType.WATER && block !== BlockType.LAVA && block !== BlockType.GRASS;
            
            if (p.isGrapple && isSolidBlock && p.isPlayer) {
                const dx = p.x - engine.player.x;
                const dy = p.y - engine.player.y;
                const dz = p.z - engine.player.z;
                engine.player.vx = dx * 3;
                engine.player.vy = dy * 3;
                engine.player.vz = Math.max(dz * 3, 10) + 10;
                
                // Grapple visually connects and pull the player, we can remove it immediately after hit
                engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                engine.projectiles.pop();
                continue;
            }

            if (hit || isSolidBlock) {
                if (!hit && isSolidBlock && !p.isPot && !p.isBoomerang) {
                    if (!isIndestructible(block)) {
                        const key = `${bx},${by},${bz}`;
                        const blockDef = BlockRegistry.getBlock(block);
                        let hp = engine.world.blockHealth.get(key) ?? (blockDef?.hardness ?? 50); 
                        hp -= p.damage;
                        if (hp <= 0) {
                            engine.breakBlock(bx, by, bz, block, true);
                            
                            for (let j = 0; j < 5; j++) {
                                engine.particles.push({
                                    x: bx + 0.5, y: by + 0.5, z: bz + 0.5, text: '', color: '#aaaaaa', life: 0.5, maxLife: 0.5,
                                    vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: Math.random() * 4
                                });
                            }
                        } else {
                            engine.world.blockHealth.set(key, hp);
                            const textHexColor = (block === BlockType.BUSH || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH) ? '#22c55e' : '#ef4444';
                            const textVal = (block === BlockType.BUSH || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH) ? 'Chop!' : `-${p.damage}`;
                            engine.particles.push({
                                x: bx + 0.5, y: by + 0.5, z: bz + 0.5, text: textVal, color: textHexColor, life: 1, maxLife: 1, vy: -2
                            });
                        }
                    }
                }

                if (p.isPot) {
                    const drops = getLootForBlock(BlockType.POT);
                    for (const drop of drops) {
                        engine.droppedItems.push({
                            x: p.x + (Math.random() - 0.5) * 0.5,
                            y: p.y + (Math.random() - 0.5) * 0.5,
                            z: p.z,
                            vx: (Math.random() - 0.5) * 5,
                            vy: (Math.random() - 0.5) * 5,
                            vz: 5,
                            item: { ...drop.item, quantity: drop.quantity ?? 1 },
                            life: 300,
                            maxLife: 300
                        });
                    }
                    for (let k = 0; k < 5; k++) {
                        engine.particles.push({
                            x: p.x, y: p.y, z: p.z, text: '', color: '#d2b48c', life: 0.5, maxLife: 0.5, 
                            vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: Math.random() * 4
                        });
                    }
                }
                
                if (p.damageType === 'EXPLOSION') {
                    // Explode!
                    engine.aoeEffects.push({
                        x: p.x, y: p.y, z: p.z,
                        radius: 0,
                        maxRadius: 4.0,
                        life: 0.5,
                        maxLife: 0.5,
                        damageType: 'EXPLOSION'
                    });
                    
                    // Deal damage in radius
                    engine.forEachEntity((ent: any, type: string) => {
                        let healthField = ent.health !== undefined ? 'health' : 'hp';
                        if (ent[healthField] === undefined) return;
                        
                        const dist = Math.sqrt(Math.pow(ent.x - p.x, 2) + Math.pow(ent.y - p.y, 2));
                        if (dist <= 4.0 && Math.abs(ent.z - p.z) < 2) {
                            ent[healthField] -= 150; // Explosion damage
                            engine.particles.push({
                                x: ent.x, y: ent.y, z: ent.z + 0.5,
                                text: `-150`, color: '#ffaaaa', life: 1.0, maxLife: 1.0, vy: -2
                            });
                        }
                    });
                }
                
                if (p.isBoomerang) {
                    p.returning = true;
                    p.life = 10.0;
                } else {
                    engine.projectiles[i] = engine.projectiles[engine.projectiles.length - 1];
                    engine.projectiles.pop();
                }
            }
        }
    }
}
