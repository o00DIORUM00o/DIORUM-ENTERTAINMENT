import { ZeldaAI } from './ai/ZeldaAI';
import { ITEMS } from '../Inventory';
import { BlockType } from '../constants/BlockType';
import { removeFromArray } from '../Updater';

export class ShadowWizardUpdater {
    static updateAll(engine: any, dt: number) {
        if (!engine.shadowWizards) return;
        
        for (let i = engine.shadowWizards.length - 1; i >= 0; i--) {
            const w = engine.shadowWizards[i];
            
            // Initialization
            if (!w.state) {
                w.state = 'IDLE';
                w.teleportTimer = 3.0; // Starts with a delay
                w.health = 100; // Let's give him 100 HP, but deflected orb deals 20
                w.maxHealth = 100;
                w.type = 'SHADOW_WIZARD';
                w.behavior = 'BOSS'; // Optional
            }

            // Health handling
            if (w.health <= 0) {
                if (Math.random() < 0.4) engine.dropItem(w.x, w.y, w.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                engine.player.addXp(1000);
                engine.dropItem(w.x, w.y, w.z, { id: 'dark_matter', name: 'Dark Matter', description: 'Essence of a shadow wizard.', category: 'MATERIAL', maxStack: 64, quantity: 5 });
                engine.particles.push({
                    x: w.x, y: w.y, z: w.z + 1,
                    text: 'DEFEATED...', color: '#6b21a8', life: 2.0, maxLife: 2.0, vy: -1
                });
                removeFromArray(engine.shadowWizards, i);
                continue;
            }

            w.z = engine.world.getElevation(Math.floor(w.x), Math.floor(w.y)); // Stick to floor roughly, or floating
            w.vz = 0; // Hovering

            const distToPlayer = Math.sqrt((w.x - engine.player.x)**2 + (w.y - engine.player.y)**2);
            w.aimAngle = Math.atan2(engine.player.y - w.y, engine.player.x - w.x);

            if (w.state === 'IDLE') {
                w.teleportTimer -= dt;
                if (w.teleportTimer <= 0) {
                    w.state = 'TELEPORTING';
                    w.teleportPhase = 0; // 0 = fading out, 1 = fading in
                    w.phaseTimer = 0.5;
                }
            } else if (w.state === 'TELEPORTING') {
                w.phaseTimer -= dt;
                if (w.teleportPhase === 0) {
                    if (w.phaseTimer <= 0) {
                        // Move to new location
                        const angle = Math.random() * Math.PI * 2;
                        const dist = 5 + Math.random() * 5; // 5 to 10 blocks away
                        w.x = engine.player.x + Math.cos(angle) * dist;
                        w.y = engine.player.y + Math.sin(angle) * dist;
                        w.teleportPhase = 1;
                        w.phaseTimer = 0.5;
                    }
                } else if (w.teleportPhase === 1) {
                    if (w.phaseTimer <= 0) {
                        w.state = 'ATTACK_TELL';
                        w.tellTimer = 1.0; // Charge up
                        w.attackType = Math.random() < 0.3 ? 'SHATTER' : 'REFLECTABLE'; 
                    }
                }
            } else if (w.state === 'ATTACK_TELL') {
                w.tellTimer -= dt;
                
                // Spawn particles charging at his hands
                if (Math.random() < 0.2) {
                    engine.particles.push({
                        x: w.x + (Math.random()-0.5), y: w.y + (Math.random()-0.5), z: w.z + 0.8,
                        text: '✨', color: w.attackType === 'SHATTER' ? '#00ffff' : '#ff00ff', life: 0.5, maxLife: 0.5, vy: 1
                    });
                }

                if (w.tellTimer <= 0) {
                    w.state = 'IDLE';
                    w.teleportTimer = 2.0;

                    const speed = 6; // Slower projectile, easier to hit back
                    const vx = Math.cos(w.aimAngle) * speed;
                    const vy = Math.sin(w.aimAngle) * speed;

                    if (w.attackType === 'REFLECTABLE') {
                        engine.projectiles.push({
                            x: w.x, y: w.y, z: w.z + 0.8,
                            vx, vy, vz: 0,
                            damage: 20, // Deals 20 damage if hit player
                            life: 5.0,
                            isPlayer: false,
                            color: '#ff00ff',
                            isReflectable: true,
                            isReflected: false
                        });
                        engine.particles.push({
                            x: w.x, y: w.y, z: w.z + 1.5,
                            text: 'HA!', color: '#ff00ff', life: 1.0, maxLife: 1.0, vy: -1
                        });
                    } else if (w.attackType === 'SHATTER') {
                        // Shatter shot - splits into multiple spread shots later, not reflectable
                        engine.projectiles.push({
                            x: w.x, y: w.y, z: w.z + 0.8,
                            vx: vx * 1.5, vy: vy * 1.5, vz: 0,
                            damage: 15,
                            life: 3.0,
                            isPlayer: false,
                            color: '#00ffff',
                            isReflectable: false,
                            isReflected: false
                        });
                    }
                }
            }
        }
    }
}
