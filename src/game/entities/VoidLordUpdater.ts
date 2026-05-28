import { Engine } from '../Engine';
import { ITEMS } from '../Inventory';

export class VoidLordUpdater {
    static updateAll(engine: Engine, dt: number) {
        for (let i = engine.voidLords.length - 1; i >= 0; i--) {
            const lord = engine.voidLords[i];
            
            if (lord.health <= 0) {
                // Drop loot
                engine.player.addXp(30000);
                for (let j = 0; j < 50; j++) {
                    engine.droppedItems.push({
                        x: lord.x + (Math.random() - 0.5)*2, y: lord.y + (Math.random() - 0.5)*2, z: lord.z,
                        vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: 8,
                        item: { ...ITEMS['adamantium_ore'] },
                        life: 600
                    });
                }
                engine.droppedItems.push({
                    x: lord.x, y: lord.y, z: lord.z,
                    vx: 0, vy: 0, vz: 5,
                    item: ITEMS['adamantium_sword'] ? { ...ITEMS['adamantium_sword'], quantity: 1 } : { ...ITEMS['coin'], quantity: 100 },
                    life: 600
                });
                
                for (let k = 0; k < 100; k++) {
                    engine.particles.push({
                        x: lord.x, y: lord.y, z: lord.z,
                        text: '', color: '#4a0082', life: 1.0, maxLife: 3.0,
                        vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15, vz: (Math.random()) * 15
                    });
                }
                
                engine.voidLords[i] = engine.voidLords[engine.voidLords.length - 1];
                engine.voidLords.pop();
                continue;
            }

            lord.stateTimer -= dt;
            
            const dx = engine.player.x - lord.x;
            const dy = engine.player.y - lord.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (lord.state === 'SPAWN') {
                if (lord.stateTimer <= 0) {
                    lord.state = 'IDLE';
                    lord.stateTimer = 1.0;
                }
                // Summon particles
                engine.particles.push({
                    x: lord.x + (Math.random() - 0.5) * 4, y: lord.y + (Math.random() - 0.5) * 4, z: lord.z,
                    text: '', color: '#000000', life: 0.5, maxLife: 0.5,
                    vx: 0, vy: 0, vz: 5 + Math.random() * 5
                });
                engine.particles.push({
                    x: lord.x + (Math.random() - 0.5) * 4, y: lord.y + (Math.random() - 0.5) * 4, z: lord.z,
                    text: '', color: '#8a2be2', life: 0.5, maxLife: 0.5,
                    vx: 0, vy: 0, vz: 5 + Math.random() * 5
                });
            } else if (lord.state === 'IDLE') {
                lord.vx = 0;
                lord.vy = 0;
                if (lord.stateTimer <= 0) {
                    const roll = Math.random();
                    if (roll < 0.4) {
                        lord.state = 'CHASE';
                        lord.stateTimer = 3.0;
                    } else if (roll < 0.7) {
                        lord.state = 'VOID_BLAST';
                        lord.stateTimer = 1.0;
                    } else if (roll < 0.85) {
                        lord.state = 'SUMMON_MINIONS';
                        lord.stateTimer = 1.0;
                    } else {
                        lord.state = 'TELEPORT';
                        lord.stateTimer = 0.5;
                    }
                }
            } else if (lord.state === 'CHASE') {
                if (dist > 1) {
                    lord.vx = (dx / dist) * 7.0;
                    lord.vy = (dy / dist) * 7.0;
                } else {
                    lord.vx = 0;
                    lord.vy = 0;
                }
                if (lord.stateTimer <= 0) {
                    lord.state = 'IDLE';
                    lord.stateTimer = 0.5;
                }
            } else if (lord.state === 'VOID_BLAST') {
                lord.aimAngle = Math.atan2(dy, dx);
                lord.vx = 0;
                lord.vy = 0;
                
                // Charge particles
                engine.particles.push({
                    x: lord.x + Math.cos(lord.aimAngle), y: lord.y + Math.sin(lord.aimAngle), z: lord.z + 1,
                    text: '', color: '#ff00ff', life: 0.3, maxLife: 0.3,
                    vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: 0
                });
                
                if (lord.stateTimer <= 0) {
                    // Shoot 8 projectiles in a circle + 1 aimed
                    for (let a = 0; a < 8; a++) {
                        const pAngle = (a / 8) * Math.PI * 2;
                        engine.projectiles.push({
                            x: lord.x, y: lord.y, z: lord.z + 1,
                            vx: Math.cos(pAngle) * 15.0, vy: Math.sin(pAngle) * 15.0, vz: 0,
                            life: 2.0, damage: 30, type: 'magic_missile'
                        });
                    }
                    engine.projectiles.push({
                        x: lord.x, y: lord.y, z: lord.z + 1,
                        vx: Math.cos(lord.aimAngle) * 25.0, vy: Math.sin(lord.aimAngle) * 25.0, vz: 0,
                        life: 3.0, damage: 50, type: 'magic_missile'
                    });
                    
                    lord.state = 'IDLE';
                    lord.stateTimer = 1.0;
                }
            } else if (lord.state === 'SUMMON_MINIONS') {
                if (lord.stateTimer <= 0) {
                    for(let m = 0; m < 3; m++) {
                        engine.phantomWizards.push({
                            x: lord.x + (Math.random() - 0.5) * 4,
                            y: lord.y + (Math.random() - 0.5) * 4,
                            z: lord.z + 2,
                            vx: 0, vy: 0, vz: 0,
                            health: 400, maxHealth: 400, damage: 15,
                            state: 'APPEAR', stateTimer: 1.0, aimAngle: 0,
                            teleportX: lord.x, teleportY: lord.y
                        });
                    }
                    lord.state = 'IDLE';
                    lord.stateTimer = 2.0;
                }
            } else if (lord.state === 'TELEPORT') {
                // Particles at old position
                if (Math.random() < 0.5) {
                    engine.particles.push({
                        x: lord.x + (Math.random() - 0.5), y: lord.y + (Math.random() - 0.5), z: lord.z,
                        text: '', color: '#000000', life: 0.5, maxLife: 0.5,
                        vx: 0, vy: 0, vz: Math.random() * 2.0
                    });
                }
                
                if (lord.stateTimer <= 0) {
                    // Teleport near player
                    const angle = Math.random() * Math.PI * 2;
                    const r = 5 + Math.random() * 3;
                    lord.x = engine.player.x + Math.cos(angle) * r;
                    lord.y = engine.player.y + Math.sin(angle) * r;
                    lord.z = engine.player.z;
                    
                    lord.state = 'VOID_BLAST';
                    lord.stateTimer = 1.0;
                }
            }
            
            // Movement
            lord.x += lord.vx * dt;
            lord.y += lord.vy * dt;
            
            // Damage player if touched
            if (lord.state !== 'SPAWN' && dist < 2.0 && Math.abs(engine.player.z - lord.z) < 1.0) {
                engine.player.takeDamage(20);
                engine.events.emit('PLAY_SOUND', 'hurt');
            }
        }
    }
}
