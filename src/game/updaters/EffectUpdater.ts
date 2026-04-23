import { BlockType } from '../constants/BlockType';
import { isIndestructible, getLootForBlock } from '../World';;
import { removeFromArray } from '../Updater';

export class EffectUpdater {
    static update(engine: any, dt: number) {
        // Update Cone effects
        for (let i = engine.coneEffects.length - 1; i >= 0; i--) {
            const cone = engine.coneEffects[i];
            cone.life -= dt;
            if (cone.life <= 0) {
                engine.coneEffects[i] = engine.coneEffects[engine.coneEffects.length - 1];
                engine.coneEffects.pop();
            }
        }

        // Update AoE effects
        for (let i = engine.aoeEffects.length - 1; i >= 0; i--) {
            const aoe = engine.aoeEffects[i];
            aoe.life -= dt;
            aoe.radius = aoe.maxRadius * (1 - (aoe.life / aoe.maxLife));
            if (aoe.life <= 0) {
                engine.aoeEffects[i] = engine.aoeEffects[engine.aoeEffects.length - 1];
                engine.aoeEffects.pop();
            }
        }

        // Update persistent AoEs
        for (let i = engine.persistentAoEs.length - 1; i >= 0; i--) {
            const paoe = engine.persistentAoEs[i];
            paoe.life -= dt;
            
            // Damage logic for FIRE persistent AoE (damage every 0.5s)
            if (paoe.type === 'FIRE') {
                if (!paoe.nextTick || paoe.maxLife - paoe.life >= paoe.nextTick) {
                    paoe.nextTick = (paoe.nextTick || 0) + 0.5;
                    engine.forEachEntity((ent: any) => {
                        let healthField = ent.health !== undefined ? 'health' : 'hp';
                        if (ent[healthField] !== undefined) {
                            const dist = Math.sqrt((ent.x - paoe.x)**2 + (ent.y - paoe.y)**2);
                            if (dist < paoe.radius && Math.abs(ent.z - paoe.z) < 2) {
                                ent[healthField] -= paoe.damage || 5;
                                if (ent.state === 'PASSIVE') ent.state = 'FLEE';
                                else if (ent.state === 'WANDER') ent.state = 'CHASE';
                            }
                        }
                    });
                }
                
                // Fire particles
                if (Math.random() < 0.3) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = Math.random() * paoe.radius;
                    engine.particles.push({
                        x: paoe.x + Math.cos(angle) * r, y: paoe.y + Math.sin(angle) * r, z: paoe.z + 0.1,
                        text: '', color: '#ff4500', life: 0.4, maxLife: 0.4, vy: -1.0, size: 2
                    });
                }
            } else if (paoe.type === 'ARCANE_PROTECTION') {
                // Arcane particles
                if (Math.random() < 0.2) {
                    const angle = Math.random() * Math.PI * 2;
                    const r = paoe.radius; // edge of circle
                    engine.particles.push({
                        x: paoe.x + Math.cos(angle) * r, y: paoe.y + Math.sin(angle) * r, z: paoe.z + 0.1,
                        text: '', color: '#9932cc', life: 0.8, maxLife: 0.8, vy: -0.5, size: 2
                    });
                }
            }

            if (paoe.life <= 0) {
                engine.persistentAoEs[i] = engine.persistentAoEs[engine.persistentAoEs.length - 1];
                engine.persistentAoEs.pop();
            }
        }

        // Process bombs
        for (let i = engine.bombs.length - 1; i >= 0; i--) {
            const b = engine.bombs[i];
            b.timer -= dt;

            // Optional ticking particles
            if (Math.random() < 0.2) {
                engine.particles.push({
                    x: b.x + (Math.random() - 0.5) * 0.2,
                    y: b.y + (Math.random() - 0.5) * 0.2,
                    z: b.z + 0.5,
                    text: '',
                    color: '#ff4500', // spark color
                    life: 0.5, maxLife: 0.5, vy: -1.0, size: 2
                });
            }

            if (b.timer <= 0) {
                // EXPLODE!
                const px = Math.floor(b.x);
                const py = Math.floor(b.y);
                const pz = Math.floor(b.z);

                // Destroy blocks
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        for (let dz = -2; dz <= 2; dz++) {
                            if (dx*dx + dy*dy + dz*dz <= 5) {
                                const bx = px + dx;
                                const by = py + dy;
                                const bz = pz + dz;
                                const block = engine.world.getBlock(bx, by, bz);
                                if (block !== BlockType.AIR && !isIndestructible(block)) { 
                                     engine.breakBlock(bx, by, bz, block, true);
                                }
                            }
                        }
                    }
                }

                // Add huge AoE damage effect
                engine.aoeEffects.push({
                    x: b.x, y: b.y, z: b.z,
                    radius: 0, maxRadius: 4, life: 0.25, maxLife: 0.25, damage: 100, isPlayer: true, damageType: 'EXPLOSION'
                });

                // Spawn cool particles
                for (let j = 0; j < 30; j++) {
                    engine.particles.push({
                        x: b.x + (Math.random() - 0.5) * 2,
                        y: b.y + (Math.random() - 0.5) * 2,
                        z: b.z + Math.random() * 2,
                        text: '',
                        color: Math.random() > 0.5 ? '#ff4500' : '#ffff00',
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        vz: (Math.random() - 0.5) * 10,
                        life: Math.random() * 0.5 + 0.2,
                        maxLife: 1.0,
                        size: Math.random() * 5 + 3
                    });
                }

                engine.bombs[i] = engine.bombs[engine.bombs.length - 1];
                engine.bombs.pop();
            }
        }

        // Update particles
        for (let i = engine.particles.length - 1; i >= 0; i--) {
            const p = engine.particles[i];
            p.life -= dt;
            if (p.vx) p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.vz) p.z += p.vz * dt;
            if (p.life <= 0) {
                engine.particles[i] = engine.particles[engine.particles.length - 1];
                engine.particles.pop();
            }
        }

        // Spawn ambient cavern particles (spores/fireflies)
        if (engine.player && engine.player.z < 8 && Math.random() < 0.2) {
            const px = engine.player.x + (Math.random() - 0.5) * 30;
            const py = engine.player.y + (Math.random() - 0.5) * 30;
            const pz = engine.player.z + (Math.random() - 0.5) * 10;
            
            if (engine.world.getBlock(Math.floor(px), Math.floor(py), Math.floor(pz)) === BlockType.AIR) {
                engine.particles.push({
                    x: px, y: py, z: pz,
                    text: '', 
                    color: Math.random() < 0.5 ? '#00ffff' : '#ba55d3', 
                    life: 3.0 + Math.random() * 2.0,
                    maxLife: 5.0,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    vz: (Math.random() - 0.5) * 0.5,
                    size: 1 + Math.random() * 2
                });
            }
        }
    }
}
