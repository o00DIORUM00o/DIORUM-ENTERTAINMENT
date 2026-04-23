import { BlockType } from '../constants/BlockType';
;
import { SPELLS } from '../Inventory';
import { audioEngine } from '../AudioEngine';
import { EntityRegistry } from '../registries/EntityRegistry';

import { AbilityRegistry } from '../registries/AbilityRegistry';

export class PlayerActionCallbacks {
    static getCallbacks(engine: any) {
        return {
            onChangePlanet: (planetId: string) => {
                engine.resetWorld(planetId);
            },
            onTriggerSecondary: (ability: string, aimAngle: number, px: number, py: number, pz: number) => {
                AbilityRegistry.cast(ability, {
                    engine,
                    caster: engine.player,
                    x: px,
                    y: py,
                    z: pz,
                    aimAngle
                });
            },
            onHit: (hx: number, hy: number, hz: number, damage: number, blockType: number) => {
                engine.particles.push({
                    x: hx,
                    y: hy,
                    z: hz + 1, 
                    text: (blockType === BlockType.BUSH || blockType === BlockType.RED_BERRY_BUSH || blockType === BlockType.BLUE_BERRY_BUSH || blockType === BlockType.BLACK_BERRY_BUSH || blockType === BlockType.YELLOW_BERRY_BUSH) ? 'Chop!' : `-${damage}`,
                    color: (blockType === BlockType.BUSH || blockType === BlockType.RED_BERRY_BUSH || blockType === BlockType.BLUE_BERRY_BUSH || blockType === BlockType.BLACK_BERRY_BUSH || blockType === BlockType.YELLOW_BERRY_BUSH) ? '#22c55e' : '#ef4444',
                    life: 1.0,
                    maxLife: 1.0,
                    vy: -2 
                });
            },
            onPlantBomb: (px: number, py: number, pz: number) => {
                engine.bombs.push({
                    x: px + 0.5,
                    y: py + 0.5,
                    z: pz,
                    timer: 3.0 
                });
                return true;
            },
            onShoot: (px: number, py: number, pz: number, pvx: number, pvy: number, pDamage: number, pDamageType?: string, pLife?: number, statusEffect?: any) => {
                if (pDamageType === 'BOOMERANG') {
                    const talentLevel = engine.player.talents['boomerang'] || 1;
                    const range = talentLevel >= 3 ? 10 : 5;
                    const speed = Math.sqrt(pvx*pvx + pvy*pvy);
                    const life = range / speed;
                    
                    const weapon = engine.player.equipment['MAIN_HAND'];
                    let color = '#d2b48c'; // wood
                    if (weapon?.id === 'green_metal_boomerang') color = '#32cd32';
                    if (weapon?.id === 'red_metal_boomerang') color = '#ff4500';
                    
                    audioEngine?.playShoot?.();
                    engine.projectiles.push({
                        x: px, y: py, z: pz, vx: pvx, vy: pvy, damage: pDamage,
                        life: life, damageType: 'PHYSICAL', isPlayer: true,
                        isBoomerang: true, color: color, returning: false, owner: engine.player, rotation: 0,
                        statusEffect: statusEffect
                    });
                } else {
                    audioEngine?.playShoot?.();
                    engine.projectiles.push({
                        x: px, y: py, z: pz, vx: pvx, vy: pvy, damage: pDamage,
                        life: pLife !== undefined ? pLife : 2.0, damageType: pDamageType, isPlayer: true,
                        isGrapple: pDamageType === 'GRAPPLE',
                        statusEffect: statusEffect
                    });
                }
            },
            onPersistentAoE: (ax: number, ay: number, az: number, radius: number, life: number, type: string, color: string, damage?: number) => {
                engine.persistentAoEs.push({
                    x: ax, y: ay, z: az, radius, life, maxLife: life, type, color, damage
                });
            },
            onAoE: (ax: number, ay: number, az: number, radius: number, damage: number, damageType?: string, statusEffect?: any) => {
                engine.aoeEffects.push({
                    x: ax, y: ay, z: az, radius: 0, maxRadius: radius,
                    life: 0.5, maxLife: 0.5, damageType, statusEffect
                });
                
                engine.forEachEntity((e: any, type: string) => {
                    let healthField = e.health !== undefined ? 'health' : 'hp';
                    if (e[healthField] === undefined) return;

                    const dx = e.x - ax;
                    const dy = e.y - ay;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    let reachBuffer = 0.2;
                    if (type === 'animal' || type === 'orc') reachBuffer = 0.4;
                    if (type === 'lavaGolem') reachBuffer = 0.6;
                    if (type === 'abyssalKnight') reachBuffer = 0.5;

                    if (dist <= radius + reachBuffer && Math.abs(e.z - az) < 2) {
                        let finalDamage = damage;
                        if (type === 'animal') {
                            const huntingLevel = engine.player.talents['hunting'] || 0;
                            if (huntingLevel >= 1) finalDamage = Math.floor(finalDamage * 1.5);
                        }
                        
                        e[healthField] -= finalDamage;

                        if (type === 'npc') e.disposition -= 100;
                        if (type === 'animal') {
                            if (e.behavior === 'PASSIVE') { e.state = 'FLEE'; e.fleeTimer = 5.0; }
                            else { e.state = 'CHASE'; e.target = engine.player; }
                        }
                        if (type === 'abyssalKnight') { e.target = engine.player; e.state = 'CHASE'; }

                        const angle = Math.atan2(dy, dx);
                        e.vx += Math.cos(angle) * 3;
                        e.vy += Math.sin(angle) * 3;

                        if (statusEffect && Math.random() < statusEffect.chance) {
                            if (!e.statuses) e.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                            e.statuses[statusEffect.type] = statusEffect.duration;
                        }

                        engine.particles.push({
                            x: e.x, y: e.y, z: e.z + 0.5,
                            text: `-${finalDamage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                        });
                        
                        const totalLifesteal = engine.player.getEquipmentStats().lifesteal;
                        if (totalLifesteal > 0) {
                            const heal = finalDamage * totalLifesteal;
                            engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + Math.floor(heal));
                            engine.particles.push({
                                x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                                text: `+${Math.floor(heal)}`, color: '#00ff00', life: 1.0, maxLife: 1.0, vy: -1
                            });
                        }
                        
                        if (engine.player.hasFavoredDeity('ANIMA')) {
                            const healAmount = Math.floor(finalDamage * 0.1);
                            if (healAmount > 0 && engine.player.health < engine.player.effectiveMaxHealth) {
                                engine.player.health = Math.min(engine.player.health + healAmount, engine.player.effectiveMaxHealth);
                                engine.particles.push({
                                    x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                                    text: `+${healAmount}`, color: '#00ff00', life: 1.0, maxLife: 1.0, vy: -1
                                });
                            }
                        }

                        if (engine.player.hasFavoredDeity('RUINA') && Math.random() < 0.25) {
                            if (!e.statuses) e.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                            const effects = ['burn', 'chill', 'poison'];
                            e.statuses[effects[Math.floor(Math.random()*effects.length)]] = 5.0;
                            engine.particles.push({
                                x: e.x, y: e.y, z: e.z + 1.5,
                                text: `RUINA!`, color: '#660066', life: 1.0, maxLife: 1.0, vy: -1
                            });
                        }
                    }
                });

                if (damageType === 'ICE') {
                    const r = Math.ceil(radius);
                    for (let x = Math.floor(ax) - r; x <= Math.floor(ax) + r; x++) {
                        for (let y = Math.floor(ay) - r; y <= Math.floor(ay) + r; y++) {
                            for (let z = Math.floor(az) - 2; z <= Math.floor(az) + 2; z++) {
                                const dx = x - ax;
                                const dy = y - ay;
                                if (Math.sqrt(dx*dx + dy*dy) <= radius) {
                                    if (engine.world.getBlock(x, y, z) === BlockType.WATER) {
                                        engine.world.setBlock(x, y, z, BlockType.ICE);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onCastSpell: (cx: number, cy: number, cz: number, spellId: string, aimAngle: number) => {
                const spell = SPELLS[spellId];
                if (spell) {
                    const mappedSpellId = spellId.toUpperCase();
                    if (AbilityRegistry.cast(mappedSpellId, {
                        engine,
                        caster: engine.player,
                        x: cx,
                        y: cy,
                        z: cz,
                        aimAngle
                    })) {
                        return; // Successfully cast from registry
                    }

                    // Fallback to old cone-effect for generic spells not explicitly converted
                    engine.coneEffects.push({
                        x: cx, y: cy, z: cz,
                        radius: spell.reach, spread: spell.spread,
                        angle: aimAngle, life: 0.4, maxLife: 0.4,
                        damageType: spell.damageType
                    });
                    
                    if (spell.damageType === 'ICE') {
                        const r = Math.ceil(spell.reach);
                        for (let x = Math.floor(cx) - r; x <= Math.floor(cx) + r; x++) {
                            for (let y = Math.floor(cy) - r; y <= Math.floor(cy) + r; y++) {
                                for (let z = Math.floor(cz) - 2; z <= Math.floor(cz) + 2; z++) {
                                    const dx = x - cx;
                                    const dy = y - cy;
                                    const dist = Math.sqrt(dx*dx + dy*dy);
                                    if (dist <= spell.reach) {
                                        const angle = Math.atan2(dy, dx);
                                        let angleDiff = angle - aimAngle;
                                        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                                        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                                        
                                        if (Math.abs(angleDiff) <= spell.spread) {
                                            if (engine.world.getBlock(x, y, z) === BlockType.WATER) {
                                                engine.world.setBlock(x, y, z, BlockType.ICE);
                                                engine.world.respawningBlocks.set(`${x},${y},${z}`, { type: BlockType.WATER, timer: 120.0 });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            onMelee: (reach: number, spread: number, damage: number, statusEffect?: any) => {
                // Deflect projectiles
                for (let i = 0; i < engine.projectiles.length; i++) {
                    const p = engine.projectiles[i];
                    if (p.isReflectable && !p.isPlayer) {
                        const pdx = p.x - engine.player.x;
                        const pdy = p.y - engine.player.y;
                        const pdist = Math.sqrt(pdx*pdx + pdy*pdy);
                        if (pdist <= reach + 0.8 && Math.abs(p.z - engine.player.z) < 4) {
                            const angle = Math.atan2(pdy, pdx);
                            let angleDiff = angle - engine.player.aimAngle;
                            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                            
                            if (Math.abs(angleDiff) <= spread + 0.5) { // Generous reflection hit
                                const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy) * 1.5; // reflect faster
                                p.vx = Math.cos(engine.player.aimAngle) * Math.max(speed, 15);
                                p.vy = Math.sin(engine.player.aimAngle) * Math.max(speed, 15);
                                p.isPlayer = true;
                                p.isReflected = true;
                                p.life += 2.0;
                                engine.particles.push({
                                    x: p.x, y: p.y, z: p.z + 0.5,
                                    text: `REFLECT!`, color: '#ffffff', life: 1.0, maxLife: 1.0, vy: -1
                                });
                            }
                        }
                    }
                }

                engine.forEachEntity((e: any, type: string) => {
                    if (e.type === 'SHADOW_WIZARD') return; // immune to melee
                    
                    let healthField = e.health !== undefined ? 'health' : 'hp';
                    if (e[healthField] === undefined) return;

                    const dx = e.x - engine.player.x;
                    const dy = e.y - engine.player.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    let reachBuffer = 0.2;
                    if (type === 'bee' || type === 'gremlin') reachBuffer = 0.2;
                    if (type === 'ant' || type === 'goblin' || type === 'kobold' || type === 'skeleton' || type === 'skeleton_remains' || type === 'rat' || type === 'npc') reachBuffer = 0.3;
                    if (type === 'animal' || type === 'orc' || type === 'djinn') reachBuffer = 0.45;
                    if (type === 'abyssalKnight' || type === 'gargoyle') reachBuffer = 0.5;
                    if (type === 'lavaGolem') reachBuffer = 0.6;
                    if (type === 'sphinx') reachBuffer = 1.5; // HUGE hitbox

                    if (dist <= reach + reachBuffer && Math.abs(e.z - engine.player.z) < 4) {
                        const angle = Math.atan2(dy, dx);
                        let angleDiff = angle - engine.player.aimAngle;
                        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                        
                        if (Math.abs(angleDiff) <= spread) {
                            let finalDamage = damage;
                            if (type === 'animal') {
                                const huntingLevel = engine.player.talents['hunting'] || 0;
                                if (huntingLevel >= 1) finalDamage = Math.floor(finalDamage * 1.5);
                            }
                            
                            e[healthField] -= finalDamage;
                            
                            if (type === 'npc') e.disposition -= 100;
                            if (type === 'animal') {
                                if (e.behavior === 'PASSIVE') { e.state = 'FLEE'; e.fleeTimer = 5.0; }
                                else { e.state = 'CHASE'; e.target = engine.player; }
                            }
                            if (type === 'abyssalKnight') { e.target = engine.player; e.state = 'CHASE'; }
                            if (type === 'goblin' || type === 'kobold' || type === 'orc' || type === 'skeleton' || type === 'lavaGolem' || type === 'rat' || type === 'gargoyle' || type === 'djinn' || type === 'gremlin') {
                                e.state = 'CHASE';
                                e.target = engine.player;
                                e.stunTimer = 0.2; // ALttP RECOIL stun!
                            }
                            if (type === 'sphinx' && e.state === 'SLEEP') {
                                e.state = 'IDLE'; e.stateTimer = 1.0;
                            }

                            if (type !== 'sphinx') {
                                e.vx += Math.cos(angle) * 15; // Solid ALttP knockback
                                e.vy += Math.sin(angle) * 15;
                            } else {
                                e.vx += Math.cos(angle) * 2; // Reduced knockback for boss
                                e.vy += Math.sin(angle) * 2;
                            }
                            
                            if (engine.player.hasFavoredDeity('ANIMA')) {
                                const healAmount = Math.floor(finalDamage * 0.1);
                                if (healAmount > 0 && engine.player.health < engine.player.effectiveMaxHealth) {
                                    engine.player.health = Math.min(engine.player.health + healAmount, engine.player.effectiveMaxHealth);
                                    engine.particles.push({
                                        x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
                                        text: `+${healAmount}`, color: '#00ff00', life: 1.0, maxLife: 1.0, vy: -1
                                    });
                                }
                            }

                            if (engine.player.hasFavoredDeity('RUINA') && Math.random() < 0.25) {
                                if (!e.statuses) e.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                                const effects = ['burn', 'chill', 'poison'];
                                e.statuses[effects[Math.floor(Math.random()*effects.length)]] = 5.0;
                                engine.particles.push({
                                    x: e.x, y: e.y, z: e.z + 1.5,
                                    text: `RUINA!`, color: '#660066', life: 1.0, maxLife: 1.0, vy: -1
                                });
                            }
                            
                            if (statusEffect && Math.random() < statusEffect.chance) {
                                if (!e.statuses) e.statuses = { burn: 0, poison: 0, chill: 0, bleed: 0 };
                                e.statuses[statusEffect.type] = statusEffect.duration;
                            }
                            
                            engine.particles.push({
                                x: e.x, y: e.y, z: e.z + 0.5,
                                text: `-${finalDamage}`, color: '#ef4444', life: 1.0, maxLife: 1.0, vy: -2
                            });
                            
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
                    }
                });
            },
            onSaddleUse: (x: number, y: number, z: number, aimAngle: number) => {
                let closestAnimal = null;
                let closestDist = 2.0;

                for (const animal of engine.animals) {
                    const adx = animal.x - x;
                    const ady = animal.y - y;
                    const adist = Math.sqrt(adx*adx + ady*ady);
                    if (adist < closestDist && Math.abs(animal.z - z) < 2) {
                        closestDist = adist;
                        closestAnimal = animal;
                    }
                }

                if (closestAnimal) {
                    closestAnimal.state = 'FLEE';
                    closestAnimal.fleeTimer = 5.0;
                    
                    engine.particles.push({
                        x: closestAnimal.x, y: closestAnimal.y, z: closestAnimal.z + 0.5,
                        text: 'Taming...', color: '#ffff00', life: 1.0, maxLife: 1.0, vy: -2
                    });
                    
                    const mountId = 'mount_' + Date.now();
                    const mount = {
                        id: mountId,
                        type: closestAnimal.type,
                        name: 'Tamed ' + closestAnimal.type,
                        speed: closestAnimal.speed,
                        jumpPower: closestAnimal.jumpPower,
                        maxStamina: closestAnimal.maxStamina
                    };
                    
                    if (!engine.player.mounts) engine.player.mounts = [];
                    engine.player.mounts.push(mount);
                    
                    const idx = engine.animals.indexOf(closestAnimal);
                    if (idx > -1) {
                        engine.animals.splice(idx, 1);
                    }
                    
                    return true;
                }
                return false;
            },
            onDropItem: (x: number, y: number, z: number, item: any) => {
                engine.dropItem(x, y, z, item);
            },
            onOpenPortalMenu: (color: string) => {
                if (engine.onOpenPortalMenu) {
                    engine.onOpenPortalMenu(color);
                }
            }
        };
    }
}
