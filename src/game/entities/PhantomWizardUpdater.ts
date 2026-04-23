import { Engine } from '../Engine';
import { ITEMS } from '../Inventory';

export class PhantomWizardUpdater {
    static updateAll(engine: Engine, dt: number) {
        for (let i = engine.phantomWizards.length - 1; i >= 0; i--) {
            const wiz = engine.phantomWizards[i];
            
            if (wiz.health <= 0) {
                engine.player.addXp(12000);
                // Loot drop
                for (let j = 0; j < 30; j++) {
                    engine.droppedItems.push({
                        x: wiz.x + (Math.random() - 0.5)*2, y: wiz.y + (Math.random() - 0.5)*2, z: wiz.z,
                        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: 8,
                        item: { ...ITEMS['coin'] },
                        life: 600
                    });
                }
                engine.droppedItems.push({
                    x: wiz.x, y: wiz.y, z: wiz.z,
                    vx: 0, vy: 0, vz: 5,
                    item: ITEMS['magic_staff'] ? { ...ITEMS['magic_staff'], quantity: 1 } : { ...ITEMS['coin'], quantity: 50 },
                    life: 600
                });
                
                for (let k = 0; k < 50; k++) {
                    engine.particles.push({
                        x: wiz.x, y: wiz.y, z: wiz.z,
                        text: '', color: '#8a2be2', life: 1.0, maxLife: 2.0,
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: (Math.random()) * 10
                    });
                }
                
                engine.phantomWizards[i] = engine.phantomWizards[engine.phantomWizards.length - 1];
                engine.phantomWizards.pop();
                continue;
            }

            wiz.stateTimer -= dt;
            
            const dx = engine.player.x - wiz.x;
            const dy = engine.player.y - wiz.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (wiz.state === 'HIDDEN') {
                wiz.z = -100; // Unhittable
                if (wiz.stateTimer <= 0) {
                    wiz.state = 'APPEAR';
                    wiz.stateTimer = 1.0;
                    
                    // Pick a random location within 10 units of player
                    const angle = Math.random() * Math.PI * 2;
                    const r = 6 + Math.random() * 4;
                    wiz.x = engine.player.x + Math.cos(angle) * r;
                    wiz.y = engine.player.y + Math.sin(angle) * r;
                    wiz.z = 2.0; // Floats slightly
                }
            } else if (wiz.state === 'APPEAR') {
                // Spawn particles to indicate appearing
                if (Math.random() < 0.5) {
                    engine.particles.push({
                        x: wiz.x + (Math.random() - 0.5), y: wiz.y + (Math.random() - 0.5), z: wiz.z,
                        text: '', color: '#9370db', life: 0.5, maxLife: 0.5,
                        vx: 0, vy: 0, vz: Math.random() * 2.0
                    });
                }
                
                if (wiz.stateTimer <= 0) {
                    wiz.state = 'CHARGE_SPELL';
                    wiz.stateTimer = 1.5;
                }
            } else if (wiz.state === 'CHARGE_SPELL') {
                wiz.aimAngle = Math.atan2(dy, dx);
                
                // Charge particles
                engine.particles.push({
                    x: wiz.x, y: wiz.y, z: wiz.z + 1,
                    text: '', color: '#ff00ff', life: 0.3, maxLife: 0.3,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: 0
                });
                
                if (wiz.stateTimer <= 0) {
                    wiz.state = 'ATTACK';
                    wiz.stateTimer = 0.5;
                    
                    const attackRoll = Math.random();
                    if (attackRoll < 0.4) {
                        // 3-way spread
                        for (let a = -1; a <= 1; a++) {
                            const pAngle = wiz.aimAngle + a * 0.3;
                            engine.projectiles.push({
                                x: wiz.x, y: wiz.y, z: wiz.z + 1,
                                vx: Math.cos(pAngle) * 12.0, vy: Math.sin(pAngle) * 12.0, vz: 0,
                                life: 3.0, damage: 20, type: 'magic_missile'
                            });
                        }
                    } else if (attackRoll < 0.8) {
                        // Fast single projectile
                        engine.projectiles.push({
                            x: wiz.x, y: wiz.y, z: wiz.z + 1,
                            vx: Math.cos(wiz.aimAngle) * 20.0, vy: Math.sin(wiz.aimAngle) * 20.0, vz: 0,
                            life: 3.0, damage: 30, type: 'magic_missile'
                        });
                    } else {
                        // AoE explosion where player is standing
                        engine.aoeEffects.push({
                           x: engine.player.x, y: engine.player.y, z: engine.player.z,
                           radius: 3, maxRadius: 3, life: 1.0, maxLife: 1.0, damageType: 'FIRE'
                        });
                    }
                }
            } else if (wiz.state === 'ATTACK') {
                if (wiz.stateTimer <= 0) {
                    wiz.state = 'VANISH';
                    wiz.stateTimer = 1.0;
                }
            } else if (wiz.state === 'VANISH') {
                if (Math.random() < 0.5) {
                    engine.particles.push({
                        x: wiz.x + (Math.random() - 0.5), y: wiz.y + (Math.random() - 0.5), z: wiz.z,
                        text: '', color: '#4b0082', life: 0.5, maxLife: 0.5,
                        vx: 0, vy: 0, vz: Math.random() * 2.0
                    });
                }
                
                if (wiz.stateTimer <= 0) {
                    wiz.state = 'HIDDEN';
                    wiz.stateTimer = 1.0 + Math.random() * 1.5;
                }
            }
            
            // Damage player if touched (though it floats, maybe z matters)
            if (wiz.state !== 'HIDDEN' && dist < 1.5 && Math.abs(engine.player.z - wiz.z) < 2) {
                engine.player.takeDamage(15);
                engine.events.emit('PLAY_SOUND', 'hurt');
            }
        }
    }
}
