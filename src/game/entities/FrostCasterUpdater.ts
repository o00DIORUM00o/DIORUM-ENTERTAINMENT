import { CHUNK_SIZE, TILE_SIZE, WORLD_HEIGHT } from '../Constants';
import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { ItemGenerator } from '../ItemGenerator';
import { removeFromArray } from '../Updater';
import { ITEMS } from '../Inventory';

export class FrostCasterUpdater {
    static updateAll(engine: any, dt: number) {
        if (!engine.frostCasters) return;
        for (let i = engine.frostCasters.length - 1; i >= 0; i--) {
            const ent = engine.frostCasters[i];
            
            // Apply gravity and movement
            ent.vz -= 30 * dt; // Gravity
            ent.x += ent.vx * dt;
            ent.y += ent.vy * dt;
            ent.z += ent.vz * dt;
            
            ent.vx *= 0.8;
            ent.vy *= 0.8;
            
            // Collision with world
            const surfaceInfo = engine.world.getSurface(ent.x, ent.y, ent.z);
            if (ent.z <= surfaceInfo.z) {
                ent.z = surfaceInfo.z;
                ent.vz = 0;
            }
            
            if (ent.health <= 0) {
                // Drop loot
                if (Math.random() < 0.5) engine.dropItem(ent.x, ent.y, ent.z, ItemGenerator.generateWeapon(25));
                if (Math.random() < 0.5) engine.dropItem(ent.x, ent.y, ent.z, ItemGenerator.generateArmor(25));
                if (Math.random() < 0.3) engine.dropItem(ent.x, ent.y, ent.z, { ...ITEMS['star_metal_ore'], quantity: Math.floor(Math.random() * 2) + 1 });
                if (Math.random() < 0.1) engine.dropItem(ent.x, ent.y, ent.z, { ...ITEMS['glacial_crystal'], quantity: 1 });
                
                // Explode into ice particles
                for (let p = 0; p < 20; p++) {
                    engine.particles.push({
                        x: ent.x, y: ent.y, z: ent.z + Math.random(),
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: Math.random() * 5,
                        life: 1.0, maxLife: 1.0, color: '#00ffff'
                    });
                }
                removeFromArray(engine.frostCasters, i);
                continue;
            }

            // Find target
            let target: any = null;
            let minDist = Infinity;
            
            const findTarget = (entities: any[], isHostile: boolean) => {
                for (const e of entities) {
                    if (!e || e.health <= 0) continue;
                    const dx = e.x - ent.x;
                    const dy = e.y - ent.y;
                    const distSq = dx*dx + dy*dy;
                    if (distSq < minDist && distSq < 15 * 15) { // 15 tile aggro range
                        minDist = distSq;
                        target = e;
                    }
                }
            };

            if (ent.isLoyal) {
                // Target enemies
                findTarget(engine.goblins || [], true);
                findTarget(engine.orcs || [], true);
                findTarget(engine.skeletons || [], true);
                findTarget(engine.abyssalKnights || [], true);
            } else {
                // Target player and loyals
                const dx = engine.player.x - ent.x;
                const dy = engine.player.y - ent.y;
                if (dx*dx + dy*dy < 15 * 15) target = engine.player;
                // Also target guards
                if (!target) findTarget(engine.npcs || [], true);
            }

            if (target) {
                const headDist = Math.sqrt(minDist === Infinity ? ((engine.player.x-ent.x)**2 + (engine.player.y-ent.y)**2) : minDist);
                ent.aimAngle = Math.atan2(target.y - ent.y, target.x - ent.x);
                ent.castTimer = (ent.castTimer || 0) + dt;

                // Keep distance (kiting)
                if (headDist < 8) {
                    ent.vx -= Math.cos(ent.aimAngle) * 20 * dt;
                    ent.vy -= Math.sin(ent.aimAngle) * 20 * dt;
                    ent.state = 'FLEE';
                } else if (headDist > 12) {
                    ent.vx += Math.cos(ent.aimAngle) * 10 * dt;
                    ent.vy += Math.sin(ent.aimAngle) * 10 * dt;
                    ent.state = 'CHASE';
                } else {
                    ent.state = 'CASTING';
                }

                // Attack logic
                ent.attackTimer = (ent.attackTimer || 0) - dt;
                if (ent.attackTimer <= 0 && ent.castTimer > 1.0) {
                    ent.attackTimer = 2.5; // Cooldown
                    ent.castTimer = 0;
                    
                    // Summon Ice Bolt
                    const shootAngle = ent.aimAngle;
                    const speed = 15;
                    engine.projectiles.push({
                        x: ent.x, y: ent.y, z: ent.z + 1.0,
                        vx: Math.cos(shootAngle) * speed,
                        vy: Math.sin(shootAngle) * speed,
                        vz: 0,
                        damage: 30,
                        damageType: 'ICE',
                        life: 1.5,
                        maxLife: 1.5,
                        isPlayer: ent.isLoyal,
                        owner: ent,
                        statusEffect: { type: 'chill', chance: 1.0, duration: 3.0 },
                        color: '#00ffff'
                    });
                    
                    // Visual cast effect
                    for (let p = 0; p < 10; p++) {
                        engine.particles.push({
                            x: ent.x + Math.cos(shootAngle), y: ent.y + Math.sin(shootAngle), z: ent.z + 1.0,
                            vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 2,
                            life: 0.5, maxLife: 0.5, color: '#ffffff'
                        });
                    }
                }
            } else {
                ent.state = 'IDLE';
                ent.castTimer = 0;
                
                // Wander around camp
                if (!ent.wanderX || Math.random() < 0.01) {
                    if (ent.campKey) {
                        const parts = ent.campKey.split(',');
                        const cx = parseFloat(parts[0]) || ent.x;
                        const cy = parseFloat(parts[1]) || ent.y;
                        ent.wanderX = cx + (Math.random() - 0.5) * 10;
                        ent.wanderY = cy + (Math.random() - 0.5) * 10;
                    } else {
                        ent.wanderX = ent.x + (Math.random() - 0.5) * 10;
                        ent.wanderY = ent.y + (Math.random() - 0.5) * 10;
                    }
                }
                
                const dx = ent.wanderX - ent.x;
                const dy = ent.wanderY - ent.y;
                const distSq = dx*dx + dy*dy;
                if (distSq > 1.0) {
                    const moveAngle = Math.atan2(dy, dx);
                    ent.vx += Math.cos(moveAngle) * 5 * dt;
                    ent.vy += Math.sin(moveAngle) * 5 * dt;
                    ent.state = 'WANDER';
                    ent.aimAngle = moveAngle;
                }
            }
            
            // Shield gen
            if (!target && ent.magicShield < 50) {
                ent.magicShield += 5 * dt;
            }
        }
    }
}