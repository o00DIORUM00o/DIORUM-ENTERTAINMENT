import { EntityBehaviorRegistry, EntityBehaviorContext } from '../../registries/EntityBehaviorRegistry';
import { ITEMS } from '../../Inventory';
import { ItemGenerator } from '../../ItemGenerator';

function applyGravityAndCollision(engine: any, ent: any, dt: number, isFlying: boolean = false) {
    if (!isFlying) {
        ent.vz = (ent.vz || 0) - 20 * dt;
    } else {
        ent.vz = 0;
    }

    ent.x += (ent.vx || 0) * dt;
    ent.y += (ent.vy || 0) * dt;
    ent.z += (ent.vz || 0) * dt;

    if (!isFlying) {
        const blockStandingOn = engine.world.getBlock(Math.floor(ent.x), Math.floor(ent.y), Math.floor(ent.z - 0.01));
        if (blockStandingOn !== 0) { // isSolid
            ent.z = Math.floor(ent.z - 0.01) + 1;
            ent.vz = 0;
        }
    }

    const block = engine.world.getBlock(Math.floor(ent.x), Math.floor(ent.y), Math.floor(ent.z));
    if (block !== 0) {
        ent.x -= (ent.vx || 0) * dt;
        ent.y -= (ent.vy || 0) * dt;
        ent.vx = 0;
        ent.vy = 0;
    }
}

function handleDeath(ctx: EntityBehaviorContext) {
    const { engine, entity } = ctx;
    if (entity.hp !== undefined && entity.hp <= 0) {
        engine.entities.splice(ctx.index, 1);
        for (let p = 0; p < 15; p++) engine.particles.push({x:entity.x, y:entity.y, z:entity.z, text:'', color:'#880000', life:0.5, maxLife:0.5, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:Math.random(), speed: 0});
        
        let xpGained = Math.max(10, Math.floor((entity.maxHp || entity.maxHealth || 30) * 0.6));
        if (entity.type === 'COLOSSAL_LIZARD_TITAN') xpGained = 2000;
        else if (entity.type === 'GIANT') xpGained = 500;
        engine.player.addXp(xpGained);
        
        const huntingLevel = engine.player.talents['hunting'] || 0;
        let dropModifier = 1;
        if (huntingLevel >= 2) dropModifier = 2;
        
        const dropItemHelper = (itemType: any, qty: number = 1) => {
            engine.dropItem(entity.x, entity.y, entity.z, { ...itemType, quantity: qty * dropModifier });
        };

        // Drops!
        if (Math.random() < 0.3) dropItemHelper(ITEMS['copper_piece'], Math.floor(Math.random() * 3) + 1);

        if (entity.type === 'SLIME') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['slime']); 
        } else if (entity.type === 'CAVE_SPIDER') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['fabric']); 
        } else if (entity.type === 'GIANT') {
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 20) + 10); 
            if (Math.random() < 0.5) dropItemHelper(ITEMS['ancient_wood'], Math.floor(Math.random() * 5) + 1); 
            if (Math.random() < 0.5) {
                const r = Math.random();
                if (r > 0.75) engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateWeapon(15));
                else if (r > 0.5) engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateArmor(15));
                else if (r > 0.25) engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateBow(15));
                else engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateAccessory(15));
            }
        } else if (entity.type === 'COLOSSAL_LIZARD_TITAN') {
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 50) + 50); 
            dropItemHelper(ITEMS['ruby'], Math.floor(Math.random() * 5) + 1); 
            dropItemHelper(ITEMS['emerald'], Math.floor(Math.random() * 5) + 1); 
            
            engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateWeapon(25)); 
            engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateArmor(25)); 
            engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateAccessory(25)); 
        } else if (entity.type && entity.type.startsWith('OBSERVER_')) {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['seer_eye'], 1);
        } else if (entity.type === 'SAND_WORM') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['sand_worm_scale'], Math.floor(Math.random() * 3) + 1);
        } else if (entity.type === 'FIRE_IMP') {
            if (Math.random() < 0.8) dropItemHelper(ITEMS['ruby'], 2); 
        } else if (entity.type === 'stone_golem') {
            if (Math.random() < 0.75) dropItemHelper(ITEMS['stone'], Math.floor(Math.random() * 5) + 3); 
            if (Math.random() < 0.25) dropItemHelper(ITEMS['living_stone'], 1); 
        } else if (entity.type === 'TRICERA_FOLK') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['tricera_horn'], 1);
            if (Math.random() < 0.75) dropItemHelper(ITEMS['dino_scale'], Math.floor(Math.random() * 3) + 1);
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 10) + 5); 
        } else if (entity.type === 'RAPTOR_FOLK' || entity.type === 'WILD_RAPTOR') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['raptor_claw'], 1);
            if (Math.random() < 0.75) dropItemHelper(ITEMS['dino_scale'], Math.floor(Math.random() * 2) + 1);
            if (entity.type === 'RAPTOR_FOLK') dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 8) + 3); 
            if (entity.type === 'WILD_RAPTOR' && Math.random() < 0.05) dropItemHelper(ITEMS['raptor_egg'], 1);
        } else if (entity.type === 'FROG_FOLK') {
            if (Math.random() < 0.8) dropItemHelper(ITEMS['frog_spice'], Math.floor(Math.random() * 2) + 1);
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 12) + 4); 
        } else if (entity.type === 'PTERODACTYL') {
            if (Math.random() < 0.6) dropItemHelper(ITEMS['ptero_wing'], 1);
            if (Math.random() < 0.5) dropItemHelper(ITEMS['dino_scale'], Math.floor(Math.random() * 2) + 1);
            if (Math.random() < 0.05) dropItemHelper(ITEMS['pterodactyl_egg'], 1);
        } else if (entity.type === 'T_REX') {
            dropItemHelper(ITEMS['dino_scale'], Math.floor(Math.random() * 10) + 5);
            dropItemHelper(ITEMS['fossil'], Math.floor(Math.random() * 3) + 1);
            if (Math.random() < 0.05) dropItemHelper(ITEMS['t_rex_egg'], 1);
            engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateWeapon(25)); 
            if (Math.random() > 0.5) engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateArmor(25));
        } else if (entity.type === 'WINTER_ELF' || entity.type === 'FROST_CASTER') {
            if (Math.random() < 0.3) dropItemHelper(ITEMS['star_metal_ore'], Math.floor(Math.random() * 2) + 1);
            if (Math.random() < 0.1) dropItemHelper(ITEMS['glacial_crystal'], 1);
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 15) + 5);
        } else if (entity.type === 'YETI') {
            if (Math.random() < 0.8) dropItemHelper(ITEMS['yeti_fur'], Math.floor(Math.random() * 3) + 1);
            if (Math.random() < 0.2) dropItemHelper(ITEMS['glacial_crystal'], 1);
        } else if (entity.type === 'FROST_WOLF') {
            if (Math.random() < 0.5) dropItemHelper(ITEMS['leather'], Math.floor(Math.random() * 2) + 1);
        } else if (entity.type === 'FUNGI_FOLK') {
            if (Math.random() < 0.8) dropItemHelper(ITEMS['fungal_spore'], Math.floor(Math.random() * 3) + 1);
            if (Math.random() < 0.5) dropItemHelper(ITEMS['glowcap'], Math.floor(Math.random() * 2) + 1);
        } else if (entity.type === 'OGRE') {
            if (Math.random() < 0.7) dropItemHelper(ITEMS['ogre_club_splinter'], Math.floor(Math.random() * 2) + 1);
            engine.dropItem(entity.x, entity.y, entity.z, ItemGenerator.generateAccessory(15));
        } else if (entity.type === 'TROLL') {
            if (Math.random() < 0.6) dropItemHelper(ITEMS['troll_tusk'], 1);
            dropItemHelper(ITEMS['gold_piece'], Math.floor(Math.random() * 20) + 10);
        } else if (entity.type === 'CLAY_GOLEM') {
            dropItemHelper(ITEMS['clay'], Math.floor(Math.random() * 8) + 4);
        }
    }
}

export function defineCoreBehaviors() {
    EntityBehaviorRegistry.setFallback({
        update: (ctx) => {
            const { engine, entity, dt } = ctx;
            applyGravityAndCollision(engine, entity, dt);
            handleDeath(ctx);
        }
    });

    EntityBehaviorRegistry.register('arcane_light', {
        update: (ctx) => {
            const { engine, entity, dt } = ctx;
            entity.x += (engine.player.x - entity.x) * 2 * dt;
            entity.y += (engine.player.y - entity.y) * 2 * dt;
            entity.z += (engine.player.z + 1.5 - entity.z) * 2 * dt;
            handleDeath(ctx);
        }
    });

    EntityBehaviorRegistry.register('wyrmling', {
        update: (ctx) => {
            const { engine, entity, dt } = ctx;
            applyGravityAndCollision(engine, entity, dt, true); // Flying
            
            // Basic hostile approach logic
            const dx = engine.player.x - entity.x;
            const dy = engine.player.y - entity.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 1.2 && dist < 15) {
                entity.vx = (dx / dist) * (entity.speed || 3.0);
                entity.vy = (dy / dist) * (entity.speed || 3.0);
            } else {
                entity.vx = 0; entity.vy = 0;
            }
            
            // Attack logic handled globally for now, or we can copy it here
            
            handleDeath(ctx);
        }
    });

    EntityBehaviorRegistry.register('exploding_rune', {
        update: (ctx) => {
            const { engine, entity, dt, index } = ctx;
            let triggered = false;
            engine.forEachEntity((e: any, category: string) => {
                if (e === entity) return;
                let isEnemy = entity.friendly ? (!e.isFriendly && !e.friendly && category !== 'npc' && category !== 'animal' && e.type !== 'villager') : (e.isFriendly || e.friendly || category === 'npc' || category === 'animal' || e.type === 'villager');
                if (isEnemy) {
                    if (Math.hypot(e.x - entity.x, e.y - entity.y) < 2.0 && Math.abs((e.z||0) - (entity.z||0)) < 1.0) {
                        triggered = true;
                        if (e.health !== undefined) e.health -= 150;
                        if (e.hp !== undefined) e.hp -= 150;
                    }
                }
            });
            if (!triggered && Math.hypot(engine.player.x - entity.x, engine.player.y - entity.y) < 2.0 && Math.abs(engine.player.z - (entity.z||0)) < 1.0 && !entity.friendly) {
                triggered = true;
                engine.player.takeDamage(50);
            }
            if (triggered) {
                engine.entities.splice(index, 1);
                for (let p = 0; p < 30; p++) engine.particles.push({x:entity.x, y:entity.y, z:entity.z, text:'', color:'#ff4500', life:1, maxLife:1, vx:(Math.random()-0.5)*5, vy:(Math.random()-0.5)*5, vz:(Math.random()-0.5)*5, speed: 0});
            }
        }
    });

    EntityBehaviorRegistry.register('black_hole', {
        update: (ctx) => {
            const { engine, entity, dt } = ctx;
            engine.forEachEntity((e: any, category: string) => {
                if (e === entity) return;
                // Black hole pulls enemies
                let isEnemy = entity.friendly ? (!e.isFriendly && !e.friendly && category !== 'npc' && category !== 'animal' && e.type !== 'villager') : (e.isFriendly || e.friendly || category === 'npc' || category === 'animal' || e.type === 'villager');
                if (isEnemy) {
                    const dist = Math.hypot((e.x||0) - (entity.x||0), (e.y||0) - (entity.y||0));
                    if (dist < 10 && Math.abs((e.z||0) - (entity.z||0)) < 5) {
                        const pullFactor = (10 - dist) / 10;
                        e.vx = (e.vx||0) + (entity.x - e.x) * pullFactor * 10 * dt;
                        e.vy = (e.vy||0) + (entity.y - e.y) * pullFactor * 10 * dt;
                        if (e.health !== undefined) e.health -= 25 * dt;
                        if (e.hp !== undefined) e.hp -= 25 * dt;
                    }
                }
            });
            if (Math.random() < 0.5) {
                const angle = Math.random() * Math.PI * 2;
                const r = 5;
                engine.particles.push({
                    x: entity.x + Math.cos(angle)*r, y: entity.y + Math.sin(angle)*r, z: entity.z + Math.random(),
                    text: '', color: '#1a1a1a', life: 0.5, maxLife: 0.5,
                    vx: -Math.cos(angle)*15, vy: -Math.sin(angle)*15, vz: 0, speed: 0
                });
            }
        }
    });

    const standardHostileAI = (ctx: EntityBehaviorContext) => {
        const { engine, entity, dt } = ctx;
        applyGravityAndCollision(engine, entity, dt);
        
        let target = entity.target;
        if (!entity.friendly && (entity.type === 'SLIME' || entity.type === 'CAVE_SPIDER' || entity.type === 'FIRE_IMP' || entity.type.startsWith('OBSERVER_') || entity.type === 'SAND_WORM')) {
            target = engine.player;
        } else if (!target || target.health <= 0 || target.hp <= 0) {
            let closest = null;
            let closestDist = 15;
            engine.forEachEntity((e: any, category: string) => {
                if (e === entity) return;
                
                if (entity.friendly) {
                    if (e.isFriendly || e.friendly || category === 'npc' || category === 'animal' || e.type === 'villager') return;
                } else {
                    if (!e.isFriendly && !e.friendly && e !== engine.player && category !== 'npc' && category !== 'animal' && e.type !== 'villager') return;
                }

                const d = Math.hypot(e.x - entity.x, e.y - entity.y);
                if (d < closestDist && Math.abs((e.z||0) - (entity.z||0)) < 1.0) {
                    closestDist = d;
                    closest = e;
                }
            });
            target = closest;
            if (!entity.friendly) {
                const d = Math.hypot(engine.player.x - entity.x, engine.player.y - entity.y);
                if (d < closestDist && Math.abs((engine.player.z||0) - (entity.z||0)) < 1.0) {
                    target = engine.player;
                }
            }
        }
        
        entity.target = target;
        if (!target) {
            handleDeath(ctx);
            return;
        }
        
        const dx = target.x - entity.x;
        const dy = target.y - entity.y;
        const dist = Math.hypot(dx, dy);

        if (entity.type === 'FIRE_IMP' && dist < 6) {
            entity.vx = 0; entity.vy = 0;
            entity.attackCooldown = (entity.attackCooldown || 0) + dt;
            if (entity.attackCooldown > 2.0) {
                entity.attackCooldown = 0;
                engine.projectiles.push({
                    x: entity.x, y: entity.y, z: entity.z + 0.5,
                    vx: (dx/dist) * 8, vy: (dy/dist) * 8,
                    damage: 15, life: 2.0, isPlayer: false, isFireball: true
                } as any);
            }
        } else if (entity.type && entity.type.startsWith('OBSERVER_') && dist < 8) {
            entity.vx = 0; entity.vy = 0; entity.vz = 0; // Float
            entity.attackCooldown = (entity.attackCooldown || 0) + dt;
            if (entity.attackCooldown > 2.0) {
                entity.attackCooldown = 0;
                if (entity.type === 'OBSERVER_FIRE') {
                    engine.projectiles.push({
                        x: entity.x, y: entity.y, z: entity.z + 0.5,
                        vx: (dx/dist) * 12, vy: (dy/dist) * 12, vz: (target.z - entity.z)/dist * 12,
                        damage: 25, life: 2.0, isPlayer: false, isFireball: true
                    } as any);
                } else {
                    engine.projectiles.push({
                        x: entity.x, y: entity.y, z: entity.z + 0.5,
                        vx: (dx/dist) * 15, vy: (dy/dist) * 15, vz: (target.z - entity.z)/dist * 15,
                        damage: 30, life: 2.0, isPlayer: false
                    });
                }
            }
        } else if (entity.type === 'SAND_WORM') {
            if (dist > 10) {
                entity.state = 'HIDDEN';
                entity.vx = 0; if (Math.random() < 0.1) entity.vy = 0;
            } else if (dist > 4 && entity.state === 'HIDDEN') {
                entity.vx = (dx / dist) * (entity.speed || 1.5);
                entity.vy = (dy / dist) * (entity.speed || 1.5);
                if (Math.random() < 0.2) {
                    engine.particles.push({x: entity.x, y: entity.y, z: entity.z+1, text:'', color:'#101010', life: 0.5, maxLife: 0.5, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2, vz: Math.random()*2, speed: 0});
                }
            } else {
                entity.state = 'CHASE';
                entity.vx = 0; entity.vy = 0;
                entity.attackCooldown = (entity.attackCooldown || 0) + dt;
                if (entity.attackCooldown > 3.0) {
                    entity.attackCooldown = 0;
                    engine.projectiles.push({
                        x: entity.x, y: entity.y, z: entity.z + 0.5,
                        vx: (dx/dist) * 10, vy: (dy/dist) * 10, vz: (target.z - entity.z)/dist * 10,
                        damage: 20, life: 1.5, isPlayer: false, isAcid: true
                    } as any);
                }
            }
        } else if (entity.type === 'stone_golem' && dist > 1.2) {
            if (dist > 8) {
                // Camouflaged as stone
                entity.vx = 0; entity.vy = 0;
                entity.state = 'HIDDEN';
            } else {
                entity.state = 'CHASE';
                entity.vx = (dx / dist) * (entity.speed || 1.5);
                entity.vy = (dy / dist) * (entity.speed || 1.5);
            }
        } else if (dist > 1.2) {
            entity.vx = (dx / dist) * (entity.speed || 3.0);
            entity.vy = (dy / dist) * (entity.speed || 3.0);
            
            if (entity.type === 'SLIME' && entity.vz === 0 && Math.random() < 0.05) {
                entity.vz = 8;
            }
        } else {
            entity.vx = 0; entity.vy = 0;
            entity.attackCooldown = (entity.attackCooldown || 0) + dt;
            if (entity.attackCooldown > 1.0) {
                entity.attackCooldown = 0;
                let dmg = 10;
                if (entity.type === 'SLIME') dmg = 12;
                if (entity.type === 'CAVE_SPIDER') dmg = 8;
                if (target === engine.player) {
                    engine.player.takeDamage(dmg);
                } else {
                    if (target.health !== undefined) target.health -= dmg;
                    if (target.hp !== undefined) target.hp -= dmg;
                }
            }
        }

        // Generic melee logic for other entities
        if (entity.timer > 1.5 && dist <= 1.2) {
            entity.timer = 0;
            let dmg = entity.damage || 15;
            if (entity.type === 'stone_golem') dmg = 25;
            if (entity.type === 'wyrmling') dmg = 30;
            if (entity.type === 'bear') dmg = 20;
            if (entity.type === 'zombie') dmg = 12;
            dmg *= (entity.customData && entity.customData.dmgMult ? entity.customData.dmgMult : 1);
            
            if (target === engine.player) {
                engine.player.takeDamage(dmg);
            } else {
                if (target.health !== undefined) target.health -= dmg;
                if (target.hp !== undefined) target.hp -= dmg;
            }
            
            engine.particles.push({x: target.x, y: target.y, z: target.z + 0.5, text: `-${Math.floor(dmg)}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2, speed: 0});
            
            if ((entity.type === 'skeleton' || entity.type === 'zombie') && (engine.player.talents['necromancy'] || 0) >= 3) {
                engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + dmg * 0.25);
            }
        }
        
        handleDeath(ctx);
    };

    ['SLIME', 'CAVE_SPIDER', 'FIRE_IMP', 'OBSERVER_VOID', 'OBSERVER_FIRE', 'SAND_WORM', 'stone_golem', 'bear', 'zombie', 'GIANT', 'COLOSSAL_LIZARD_TITAN', 'TRICERA_FOLK', 'RAPTOR_FOLK', 'FROG_FOLK', 'PTERODACTYL', 'T_REX', 'WILD_RAPTOR', 'FUNGI_FOLK', 'OGRE', 'TROLL', 'CLAY_GOLEM', 'DARK_ELF_ASSASSIN', 'ARCHER', 'DARK_KNIGHT', 'HUMAN_KNIGHT', 'HUMAN_PALADIN', 'HUMAN_RANGER', 'WINTER_ELF', 'YETI', 'FROST_WOLF'].forEach(type => {
        EntityBehaviorRegistry.register(type, { update: standardHostileAI });
    });
}
