import { EntitySteeringSystem } from '../systems/EntitySteeringSystem';
import { audioEngine } from '../AudioEngine';
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
import { ItemGenerator } from "../ItemGenerator";
import { ZeldaAI } from "./ai/ZeldaAI";
import { Updater } from "../Updater";

export class AnimalUpdater {
    static updateAll(engine: any, dt: number) {
for (let i = engine.animals.length - 1; i >= 0; i--) {
            const animal = engine.animals[i];
            
            // Distance to player
            const dx = engine.player.x - animal.x;
            const dy = engine.player.y - animal.y;
            const dz = engine.player.z - animal.z;
            const distToPlayer = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (animal.behavior === 'PASSIVE') {
                if (!animal.state) {
                    animal.state = 'WANDER';
                    animal.attackCooldown = 0;
                }
                
                animal.moveSpeed = Math.random() * 0.5 + 1.0;
                animal.chaseDist = animal.type === 'FAIRY' ? 0 : 8.0; // spots player
                animal.stopDist = 0;
                animal.attackDist = 0;
                animal.alertTime = 0.5; // stops like a deer in headlights
                animal.fleeHealthThreshold = 1.1; // always flee when hurt/chased

                // Set target to player if nearby
                if (animal.type !== 'FAIRY' && distToPlayer < animal.chaseDist * engine.player.getVisibilityMult()) {
                    animal.target = engine.player;
                     if (animal.state !== 'FLEE' && animal.state !== 'ALERT') {
                        animal.state = 'ALERT';
                        animal.stateTimer = animal.alertTime;
                        engine.particles.push({
                            x: animal.x, y: animal.y, z: animal.z + 1.2,
                            text: '!', color: '#ffea00', life: 0.5, maxLife: 0.5, vy: 0
                        });
                    }
                } else if (animal.state === 'FLEE') {
                     animal.state = 'WANDER';
                     animal.target = undefined;
                }

                if (animal.state === 'ALERT') {
                    animal.stateTimer -= dt;
                    if (animal.stateTimer <= 0) animal.state = 'FLEE';
                }

                if (animal.state === 'FLEE' && animal.target) {
                    const dx = animal.target.x - animal.x;
                    const dy = animal.target.y - animal.y;
                    const dist2D = Math.sqrt(dx*dx + dy*dy);
                    if (dist2D > 0) {
                        animal.vx = -(dx / dist2D) * (animal.moveSpeed * 3);
                        animal.vy = -(dy / dist2D) * (animal.moveSpeed * 3);
                        animal.aimAngle = Math.atan2(-dy, -dx);
                    }
                } else if (animal.state === 'WANDER') {
                    ZeldaAI.update(animal, engine, dt);
                }
            } else if (animal.behavior === 'AGGRESSIVE') {
                if (!animal.state) {
                    animal.state = 'WANDER';
                    animal.attackCooldown = 0;
                }
                
                // Find closest passive animal
                let closestPrey: any = null;
                let closestPreyDist = 15;
                for (const prey of engine.animals) {
                    if (prey.behavior === 'PASSIVE') {
                        const ddx = prey.x - animal.x;
                        const ddy = prey.y - animal.y;
                        const ddz = prey.z - animal.z;
                        const ddist = Math.sqrt(ddx*ddx + ddy*ddy + ddz*ddz);
                        if (ddist < closestPreyDist) {
                            closestPreyDist = ddist;
                            closestPrey = prey;
                        }
                    }
                }
                
                if (distToPlayer < 6) {
                    animal.target = engine.player;
                } else if (closestPrey) {
                    animal.target = closestPrey;
                } else {
                    animal.target = undefined;
                }

                animal.moveSpeed = animal.type === 'WOLF' ? 3.0 : (animal.type === 'BEAR' ? 2.0 : 2.5);
                animal.chaseDist = 12.0;
                animal.stopDist = 0.5;
                animal.attackDist = 1.2;
                animal.alertTime = 0.5;

                ZeldaAI.update(animal, engine, dt);

                if (animal.state === 'ATTACK') {
                    if (animal.attackTimer === undefined || animal.attackTimer <= 0) {
                        animal.attackTimer = 0.5;
                        animal.attackCooldown = 1.5;
                        
                        if (animal.target) {
                            const dx = animal.target.x - animal.x;
                            const dy = animal.target.y - animal.y;
                            const dist2D = Math.sqrt(dx*dx + dy*dy);
                            if (dist2D > 0) {
                                animal.vx = (dx / dist2D) * (animal.moveSpeed * 3);
                                animal.vy = (dy / dist2D) * (animal.moveSpeed * 3);
                            }
                        }
                    }
                    
                    animal.attackTimer -= dt;
                    if (animal.attackTimer <= 0) {
                        animal.state = 'CHASE'; // end lunge
                        if (animal.target) {
                            const dx = animal.target.x - animal.x;
                            const dy = animal.target.y - animal.y;
                            const dz = animal.target.z - animal.z;
                            if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 2.5) {
                                if (animal.target === engine.player) {
                                    engine.player.takeDamage(animal.damage || 5);
                                    let kb = 5.0;
                                    const angle = Math.atan2(dy, dx);
                                    engine.player.vx += Math.cos(angle) * kb;
                                    engine.player.vy += Math.sin(angle) * kb;
                                } else {
                                    animal.target.health -= (animal.damage || 5);
                                    animal.target.vx += Math.cos(animal.aimAngle) * 5;
                                    animal.target.vy += Math.sin(animal.aimAngle) * 5;
                                    engine.particles.push({
                                        x: animal.target.x, y: animal.target.y, z: animal.target.z + 1,
                                        text: `-${animal.damage || 5}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -1
                                    });
                                }
                            }
                        }
                    }
                }
            }
            
            // Apply gravity ONLY to non-flying entities
            if (animal.type !== 'GIANT_EAGLE' && animal.type !== 'FAIRY') {
                animal.vz -= 20 * dt;
            } else if (animal.type === 'GIANT_EAGLE') {
                animal.vz = 0; // Eagles don't fall passively
            } else if (animal.type === 'FAIRY') {
                animal.vz = 0; // Fairies fly
            }
            
            EntitySteeringSystem.applyBoids(animal, engine, dt);
                    EntitySteeringSystem.applyDodge(animal, engine, dt);
            // Movement
            const newX = animal.x + animal.vx * dt;
            const newY = animal.y + animal.vy * dt;
            
            const currentZ = Math.floor(animal.z);
            const blockAtNewPos = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ);
            
            if (isSolid(blockAtNewPos)) {
                if (animal.type === 'GIANT_EAGLE' || animal.type === 'FAIRY') {
                    // Flight capabilities
                    animal.z += 1;
                    animal.x = newX;
                    animal.y = newY;
                } else {
                    const blockAbove = engine.world.getBlock(Math.floor(newX), Math.floor(newY), currentZ + 1);
                    if (!isSolid(blockAbove)) {
                        animal.z = currentZ + 1;
                        animal.x = newX;
                        animal.y = newY;
                    } else {
                        const blockX = engine.world.getBlock(Math.floor(newX), Math.floor(animal.y), currentZ);
                        if (!isSolid(blockX)) animal.x = newX;
                        const blockY = engine.world.getBlock(Math.floor(animal.x), Math.floor(newY), currentZ);
                        if (!isSolid(blockY)) animal.y = newY;
                        
                        if (animal.vz === 0 && Math.random() < 0.1) {
                            animal.vz = 6;
                        }
                    }
                }
            } else {
                animal.x = newX;
                animal.y = newY;
            }
            
            animal.z += animal.vz * dt;
            
            // Eagles drift down if too high, flap up if too low
            if (animal.type === 'GIANT_EAGLE') {
                const surfaceZ = engine.world.getElevation(Math.floor(animal.x), Math.floor(animal.y));
                const targetZ = surfaceZ + 10 + Math.sin(Date.now() / 1000) * 2; // Fly ~10 blocks high with some bobbing
                if (animal.z < targetZ) {
                    animal.vz = 2; // flap up
                } else if (animal.z > targetZ + 2) {
                    animal.vz = -1; // glide down
                } else {
                    animal.vz = 0; // maintain altitude
                }
            } else if (animal.type === 'FAIRY') {
                if (Math.random() < 0.1) {
                    engine.particles.push({
                        x: animal.x + (Math.random()-0.5)*0.5, y: animal.y + (Math.random()-0.5)*0.5, z: animal.z + 0.2 + (Math.random()*0.4),
                        vx: 0, vy: 0, vz: 0.1, life: 1, maxLife: 1, color: '#ffecf0', text: '', size: 1.5
                    });
                }
                const surfaceZ = engine.world.getElevation(Math.floor(animal.x), Math.floor(animal.y));
                const targetZ = surfaceZ + 1.5 + Math.sin(Date.now() / 500 + animal.id.length) * 0.5; // Hover
                if (animal.z < targetZ) {
                    animal.vz = 1;
                } else if (animal.z > targetZ + 0.5) {
                    animal.vz = -1;
                } else {
                    animal.vz = 0;
                }
            }
            
            const blockStandingOn = engine.world.getBlock(Math.floor(animal.x), Math.floor(animal.y), Math.floor(animal.z - 0.01));
            if (isSolid(blockStandingOn) && animal.type !== 'GIANT_EAGLE' && animal.type !== 'FAIRY') {
                animal.z = Math.floor(animal.z - 0.01) + 1;
                animal.vz = 0;
            }

            if (Math.abs(animal.vx) > 0.01 || Math.abs(animal.vy) > 0.01) {
                animal.aimAngle = Math.atan2(animal.vy, animal.vx);
            }

            
            if (distToPlayer > 60) {
                removeFromArray(engine.animals, i);
                continue;
            }
            
            // "Fairy Pool" Update: Fairies heal on touch like A Link to the Past
            if (animal.type === 'FAIRY' && distToPlayer < 1.5) {
                engine.player.health = engine.player.maxHealth;
                audioEngine.playHeal();
                engine.particles.push({
                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1,
                    text: 'FULL HEAL!', color: '#ffb6c1', life: 2.0, maxLife: 2.0, vy: 1
                });
                for (let p = 0; p < 20; p++) {
                    const life = 0.5 + Math.random() * 1.0;
                    engine.particles.push({
                        x: engine.player.x, y: engine.player.y, z: engine.player.z + 0.4 + Math.random() * 1.5,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        vz: Math.random() * 2,
                        life: life, maxLife: life, color: '#ffecee', text: '', size: 3 + Math.random() * 2
                    });
                }
                removeFromArray(engine.animals, i);
                continue;
            }
            
            if (animal.health <= 0) {
                engine.player.addXp(Math.floor(20 * ((animal.maxHealth || 30) / 30)));
                const huntingLevel = engine.player.talents['hunting'] || 0;
                let dropModifier = 1;
                if (huntingLevel >= 2) dropModifier = 2;
                
                const dropItemHelper = (itemType: any) => {
                    engine.dropItem(animal.x, animal.y, animal.z, { ...itemType, quantity: dropModifier });
                };

                if (Math.random() < 0.3) {
                    engine.dropItem(animal.x, animal.y, animal.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });
                }

                if (animal.type === 'DEER') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.5) dropItemHelper(ITEMS['leather']);
                } else if (animal.type === 'BEAR') {
                    if (Math.random() < 0.9) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.9) dropItemHelper(ITEMS['leather']);
                    if (Math.random() < 0.3) dropItemHelper(ITEMS['teeth']);
                } else if (animal.type === 'FROST_WOLF') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['leather']);
                    if (Math.random() < 0.4) dropItemHelper(ITEMS['yeti_fur']); // Just drops yeti fur as a general north item for players
                    if (Math.random() < 0.4) dropItemHelper(ITEMS['teeth']);
                } else if (animal.type === 'WOLF' || animal.type === 'DIRE_WOLF') {
                    if (animal.type === 'DIRE_WOLF') {
                         if (Math.random() < 0.9) dropItemHelper(ITEMS['leather']);
                         if (Math.random() < 0.8) dropItemHelper(ITEMS['teeth']);
                         if (Math.random() < 0.5) dropItemHelper(ITEMS['meat']);
                    } else {
                         if (Math.random() < 0.6) dropItemHelper(ITEMS['leather']);
                         if (Math.random() < 0.4) dropItemHelper(ITEMS['teeth']);
                    }
                } else if (animal.type === 'GIANT_BOAR') {
                    if (Math.random() < 0.9) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.5) dropItemHelper(ITEMS['leather']);
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['boar_tusk']);
                } else if (animal.type === 'MOOSE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.9) dropItemHelper(ITEMS['leather']);
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['moose_antler']);
                } else if (animal.type === 'SHEEP') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['wool']);
                } else if (animal.type === 'BEAR') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['leather']);
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['teeth']);
                } else if (animal.type === 'HORSE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['leather']);
                } else if (animal.type === 'TURTLE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['shell']);
                } else if (animal.type === 'UNICORN') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['unicorn_horn']);
                } else if (animal.type === 'GIANT_CHICKEN') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['feather']);
                } else if (animal.type === 'GIANT_FROG') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['slime']);
                } else if (animal.type === 'CAPYBARA') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                } else if (animal.type === 'DRAGON_HORSE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['leather']);
                } else if (animal.type === 'DRAGON_TURTLE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['shell']);
                } else if (animal.type === 'GIANT_TOAD') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['slime']);
                } else if (animal.type === 'OBSIDIAN_SHEEP') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['wool']);
                } else if (animal.type === 'FAIRY') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['fairy_dust']);
                } else if (animal.type === 'GRYPHON') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['gryphon_feather']);
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                } else if (animal.type === 'GIANT_EAGLE') {
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['feather']);
                    if (Math.random() < 0.8) dropItemHelper(ITEMS['meat']);
                } else if (animal.type === 'PTERODACTYL') {
                    if (Math.random() < 0.6) dropItemHelper(ITEMS['ptero_wing']);
                    if (Math.random() < 0.5) dropItemHelper(ITEMS['dino_scale']);
                    if (Math.random() < 0.05) dropItemHelper(ITEMS['pterodactyl_egg']);
                } else if (animal.type === 'T_REX') {
                    dropItemHelper(ITEMS['dino_scale']);
                    dropItemHelper(ITEMS['fossil']);
                    if (Math.random() < 0.05) dropItemHelper(ITEMS['t_rex_egg']);
                    engine.dropItem(animal.x, animal.y, animal.z, ItemGenerator.generateWeapon(25)); 
                    if (Math.random() > 0.5) engine.dropItem(animal.x, animal.y, animal.z, ItemGenerator.generateArmor(25));
                } else if (animal.type === 'WILD_RAPTOR') {
                    if (Math.random() < 0.5) dropItemHelper(ITEMS['raptor_claw']);
                    if (Math.random() < 0.75) dropItemHelper(ITEMS['dino_scale']);
                    if (Math.random() < 0.05) dropItemHelper(ITEMS['raptor_egg']);
                }
                
                for (let p = 0; p < 10; p++) {
                    const life = 0.5 + Math.random() * 0.5;
                    engine.particles.push({
                        x: animal.x, y: animal.y, z: animal.z + 0.4,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        vz: Math.random() * 4,
                        life: life,
                        maxLife: life,
                        color: 'red',
                        text: '',
                        size: 2 + Math.random() * 2
                    });
                }
                
                removeFromArray(engine.animals, i);
            }
        }
    }
}
