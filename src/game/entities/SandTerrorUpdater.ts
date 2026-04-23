import { Engine } from '../Engine';
import { ITEMS } from '../Inventory';

export class SandTerrorUpdater {
    static updateAll(engine: Engine, dt: number) {
        for (let i = engine.sandTerrors.length - 1; i >= 0; i--) {
            const terror = engine.sandTerrors[i];
            
            if (terror.health <= 0) {
                engine.player.addXp(12000);
                // Loot drop
                for (let j = 0; j < 30; j++) {
                    engine.droppedItems.push({
                        x: terror.x + (Math.random() - 0.5) * 2, y: terror.y + (Math.random() - 0.5) * 2, z: Math.max(terror.z, 1) + 1,
                        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: 8,
                        item: { ...ITEMS['coin'] },
                        life: 600
                    });
                }
                engine.droppedItems.push({
                    x: terror.x, y: terror.y, z: terror.z > 0 ? terror.z : 1,
                    vx: 0, vy: 0, vz: 5,
                    item: ITEMS['ruby'] ? { ...ITEMS['ruby'], quantity: 5 } : { ...ITEMS['coin'], quantity: 50 },
                    life: 600
                });
                
                for (let k = 0; k < 50; k++) {
                    engine.particles.push({
                        x: terror.x, y: terror.y, z: terror.z,
                        text: '', color: '#d2b48c', life: 1.0, maxLife: 2.0,
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: (Math.random()) * 10
                    });
                }
                
                engine.sandTerrors[i] = engine.sandTerrors[engine.sandTerrors.length - 1];
                engine.sandTerrors.pop();
                continue;
            }

            terror.stateTimer -= dt;
            
            const dx = engine.player.x - terror.x;
            const dy = engine.player.y - terror.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (terror.state === 'BURROWED') {
                terror.z = -1; // Underground
                const speed = 7.0;
                
                // Track player slowly
                if (dist > 1) {
                    terror.vx = (dx / dist) * speed;
                    terror.vy = (dy / dist) * speed;
                } else {
                    terror.vx = 0; terror.vy = 0;
                }
                
                terror.x += terror.vx * dt;
                terror.y += terror.vy * dt;
                
                // Dirt particles showing movement
                if (Math.random() < 0.4) {
                    engine.particles.push({
                        x: terror.x + (Math.random() - 0.5), y: terror.y + (Math.random() - 0.5), z: 1.0,
                        text: '', color: '#8b4513', life: 0.5, maxLife: 0.5,
                        vx: 0, vy: 0, vz: 1.0 + Math.random() * 2.0
                    });
                }
                
                if (terror.stateTimer <= 0) {
                    terror.state = 'EMERGING';
                    terror.stateTimer = 0.5;
                    terror.vx = 0; terror.vy = 0;
                    terror.z = 0;
                }
            } else if (terror.state === 'EMERGING') {
                terror.z += 2.0 * dt;
                if (Math.random() < 0.5) {
                    engine.particles.push({
                        x: terror.x + (Math.random() - 0.5)*2, y: terror.y + (Math.random() - 0.5)*2, z: 1.0,
                        text: '', color: '#8b4513', life: 0.5, maxLife: 0.5,
                        vx: (Math.random() - 0.5)*5, vy: (Math.random() - 0.5)*5, vz: Math.random() * 5.0
                    });
                }
                if (terror.stateTimer <= 0) {
                    terror.state = 'ABOVE';
                    terror.stateTimer = 2.0;
                    // Jump arc logic
                    terror.vz = 15.0;
                    // Aim at player
                    terror.aimAngle = Math.atan2(dy, dx);
                    terror.vx = Math.cos(terror.aimAngle) * 5.0;
                    terror.vy = Math.sin(terror.aimAngle) * 5.0;
                    
                    // Shoot rocks out
                    for(let r=0; r<8; r++) {
                        const angle = r * (Math.PI / 4);
                        engine.projectiles.push({
                            x: terror.x, y: terror.y, z: terror.z,
                            vx: Math.cos(angle) * 8.0, vy: Math.sin(angle) * 8.0, vz: 5.0,
                            life: 2.0, damage: 15, type: 'rock'
                        });
                    }
                }
            } else if (terror.state === 'ABOVE') {
                terror.vz -= 25.0 * dt; // gravity
                terror.x += terror.vx * dt;
                terror.y += terror.vy * dt;
                terror.z += terror.vz * dt;
                
                // Tail segments follow
                // We fake delay by updating segments to trail the head
                if (terror.z <= 0.5) {
                     terror.state = 'DIVING';
                     terror.stateTimer = 0.5;
                     terror.z = 0.5;
                }
            } else if (terror.state === 'DIVING') {
                terror.z -= 4.0 * dt;
                if (terror.stateTimer <= 0) {
                    terror.state = 'BURROWED';
                    terror.stateTimer = 3.0 + Math.random() * 2.0;
                }
            }
            
            // Damage player if close and above ground
            if (terror.z > 0 && dist < 3) {
                engine.player.takeDamage(25);
                engine.events.emit('PLAY_SOUND', 'hurt');
            }
        }
    }
}
