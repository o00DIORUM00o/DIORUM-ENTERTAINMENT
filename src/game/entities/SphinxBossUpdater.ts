import { Engine } from '../Engine';
import { Sphinx } from '../types/EntityTypes';
import { ITEMS } from '../Inventory';

export function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

export class SphinxBossUpdater {
    static updateAll(engine: Engine, dt: number) {
        for (let i = engine.sphinxs.length - 1; i >= 0; i--) {
            const s = engine.sphinxs[i];
            
            if (s.health <= 0) {
                engine.player.addXp(5000);
                // Drop loot
                for (let j = 0; j < 50; j++) {
                    engine.droppedItems.push({
                        x: s.x + (Math.random() - 0.5) * 2, y: s.y + (Math.random() - 0.5) * 2, z: s.z + 1,
                        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: 8,
                        item: { ...ITEMS['coin'] },
                        life: 600
                    });
                }
                engine.droppedItems.push({
                    x: s.x, y: s.y, z: s.z,
                    vx: 0, vy: 0, vz: 5,
                    item: { ...ITEMS['sphinx_crown'] },
                    life: 600
                });

                for (let k = 0; k < 50; k++) {
                    engine.particles.push({
                        x: s.x + (Math.random() - 0.5) * 4, y: s.y + (Math.random() - 0.5) * 4, z: s.z + Math.random() * 4,
                        text: '', color: '#daa520', life: 1.0 + Math.random(), maxLife: 2.0,
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: (Math.random()) * 10
                    });
                }
                
                removeFromArray(engine.sphinxs, i);
                continue;
            }

            const dx = engine.player.x - s.x;
            const dy = engine.player.y - s.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            s.stateTimer -= dt;
            s.attackCooldown -= dt;
            if (s.laserTimer !== undefined && s.laserTimer > 0) s.laserTimer -= dt;

            // Simple bobbing idle z
            if (s.state !== 'SLEEP') {
                 s.z = 2 + Math.sin(Date.now() / 300) * 0.2;
            }

            if (s.state === 'SLEEP') {
                if (dist < 10) {
                    s.state = 'IDLE';
                    s.stateTimer = 2.0;

                    // Wake up particles
                    for (let j = 0; j < 20; j++) {
                        engine.particles.push({
                            x: s.x, y: s.y, z: s.z,
                            text: '', color: '#daa520', life: 1.0, maxLife: 1.0,
                            vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 5
                        });
                    }
                }
            } else if (s.state === 'IDLE') {
                if (s.stateTimer <= 0) {
                    // Pick next attack
                    const roll = Math.random();
                    if (roll < 0.3 && engine.gargoyles.length < 5) {
                        s.state = 'SUMMON';
                        s.stateTimer = 2.0;
                    } else if (roll < 0.6) {
                        s.state = 'ATTACK_SANDSTORM';
                        s.stateTimer = 4.0;
                    } else {
                        s.state = 'ATTACK_LASER';
                        s.stateTimer = 3.0; // Sweeping laser
                        s.aimAngle = Math.atan2(dy, dx) - 0.5; // Start offset
                    }
                }
            } else if (s.state === 'SUMMON') {
                if (s.stateTimer <= 0) {
                    // Spawn Gargoyles
                    for (let g = 0; g < 2; g++) {
                        engine.gargoyles.push({
                            x: s.x + (Math.random() - 0.5) * 4,
                            y: s.y + (Math.random() - 0.5) * 4,
                            z: s.z,
                            vx: 0, vy: 0, vz: 0,
                            health: 120, maxHealth: 120, damage: 25,
                            state: 'AWAKE',
                            attackCooldown: 1.0, aimAngle: 0, attackTimer: 0
                        });
                    }
                    s.state = 'IDLE';
                    s.stateTimer = 2.0;
                }
            } else if (s.state === 'ATTACK_SANDSTORM') {
                if (s.attackCooldown <= 0) {
                    import('../AudioEngine').then(m => m.audioEngine.playSandstorm());
                    // Shoot tornado at player
                    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.2;
                    engine.projectiles.push({
                        x: s.x, y: s.y, z: s.z + 1,
                        vx: Math.cos(angle) * 12, vy: Math.sin(angle) * 12, vz: 0,
                        damage: 25,
                        life: 3.0,
                        isPlayer: false,
                        color: '#eccb7c',
                        size: 0.6,
                        type: 'MAGIC_TORNADO'
                    });
                    s.attackCooldown = 0.4;
                }
                if (s.stateTimer <= 0) {
                    s.state = 'IDLE';
                    s.stateTimer = 1.0;
                }
            } else if (s.state === 'ATTACK_LASER') {
                s.aimAngle += dt * 0.5; // Sweep across
                
                if (s.laserTimer === undefined || s.laserTimer <= 0) {
                     import('../AudioEngine').then(m => m.audioEngine.playLaser());
                     engine.projectiles.push({
                        x: s.x, y: s.y, z: s.z + 2,
                        vx: Math.cos(s.aimAngle) * 30, vy: Math.sin(s.aimAngle) * 30, vz: 0,
                        damage: 40,
                        life: 2.0,
                        isPlayer: false,
                        color: '#00ffff', // Laser color
                        size: 0.3,
                        type: 'SAND_LASER'
                    });
                    s.laserTimer = 0.05; // Rapid fire beam
                }

                if (s.stateTimer <= 0) {
                    s.state = 'IDLE';
                    s.stateTimer = 2.0;
                }
            }
        }
    }
}
