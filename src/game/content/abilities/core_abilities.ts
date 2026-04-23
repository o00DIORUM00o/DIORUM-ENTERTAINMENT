import { AbilityRegistry } from '../../registries/AbilityRegistry';
import { BlockType } from '../../constants/BlockType';
;

export function defineCoreAbilities() {
    AbilityRegistry.register('METEOR', ({ engine, x, y, z, aimAngle }) => {
        const targetX = x + Math.cos(aimAngle) * 8;
        const targetY = y + Math.sin(aimAngle) * 8;
        for (let p = 0; p < 40; p++) {
            engine.particles.push({
                x: targetX, y: targetY, z: z + 4 - Math.random() * 2,
                text: '', color: '#ff4500', life: 1, maxLife: 1,
                vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: (Math.random() - 0.5) * 8, speed: 0
            });
        }
        engine.forEachEntity((ent: any) => {
            const dist = Math.sqrt((ent.x - targetX)**2 + (ent.y - targetY)**2);
            if (dist <= 6) {
                if (ent.health !== undefined) ent.health -= 150;
                if (ent.hp !== undefined) ent.hp -= 150;
            }
        });
    });

    AbilityRegistry.register('SUMMON_SKELETON', ({ engine, x, y, z }) => {
        engine.skeletons.push({
            x: x + (Math.random() - 0.5) * 2,
            y: y + (Math.random() - 0.5) * 2,
            z: z,
            hp: 150, maxHp: 150,
            vx: 0, vy: 0,
            state: 'WANDER', timer: 0,
            isFriendly: true 
        });
    });

    AbilityRegistry.register('ROOT', ({ engine, x, y }) => {
        engine.forEachEntity((ent: any) => {
            const dist = Math.sqrt((ent.x - x)**2 + (ent.y - y)**2);
            if (dist <= 15 && !ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                if (ent.vx !== undefined) ent.vx = 0; 
                if (ent.vy !== undefined) ent.vy = 0;
                ent.rootTimer = 5.0; 
            }
        });
    });

    AbilityRegistry.register('LIGHTNING_STRIKE', ({ engine, x, y, z, aimAngle }) => {
        const targetX = x + Math.cos(aimAngle) * 8;
        const targetY = y + Math.sin(aimAngle) * 8;
        for (let p = 0; p < 20; p++) {
            engine.particles.push({
                x: targetX, y: targetY, z: z + p * 0.5,
                text: '', color: '#00ffff', life: 0.5, maxLife: 0.5,
                vx: (Math.random() - 0.5), vy: (Math.random() - 0.5), vz: 0, speed: 0
            });
        }
        engine.forEachEntity((ent: any) => {
            const dist = Math.sqrt((ent.x - targetX)**2 + (ent.y - targetY)**2);
            if (dist <= 4 && !ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                if (ent.health !== undefined) ent.health -= 120;
                if (ent.hp !== undefined) ent.hp -= 120;
            }
        });
    });

    AbilityRegistry.register('LAVA_PUDDLE', ({ engine, x, y, z, aimAngle }) => {
        const targetX = x + Math.cos(aimAngle) * 8;
        const targetY = y + Math.sin(aimAngle) * 8;
        for (let lx = -1; lx <= 1; lx++) {
            for (let ly = -1; ly <= 1; ly++) {
               engine.world.setBlock(Math.floor(targetX + lx), Math.floor(targetY + ly), Math.floor(z - 1), BlockType.LAVA); 
            }
        }
    });

    AbilityRegistry.register('METEOR_SHOWER', ({ engine, x, y, z, aimAngle }) => {
        const targetX = x + Math.cos(aimAngle) * 8;
        const targetY = y + Math.sin(aimAngle) * 8;

        for (let i = 0; i < 15; i++) {
            // Drop meteors in a large radius
            const rx = targetX + (Math.random() - 0.5) * 16;
            const rz = targetY + (Math.random() - 0.5) * 16;
            
            // Queue explosions 
            setTimeout(() => {
                const ez = engine.world.getSurface(rx, rz, z + 5) || z;
                engine.aoeEffects.push({
                    x: rx, y: rz, z: ez,
                    radius: 0,
                    maxRadius: 6.0,
                    life: 0.5,
                    maxLife: 0.5,
                    damageType: 'EXPLOSION'
                });
                
                for (let p = 0; p < 30; p++) {
                    engine.particles.push({
                        x: rx, y: rz, z: ez + Math.random() * 2,
                        text: '', color: '#ff4500', life: 1, maxLife: 1,
                        vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10, vz: (Math.random() - 0.5) * 10 + 2, speed: 0
                    });
                }
                
                engine.forEachEntity((ent: any) => {
                    const dist = Math.sqrt((ent.x - rx)**2 + (ent.y - rz)**2);
                    if (dist <= 6 && !ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                        if (ent.health !== undefined) ent.health -= 200;
                        if (ent.hp !== undefined) ent.hp -= 200;
                    }
                });

            }, Math.random() * 2500); // Stagger over 2.5 seconds
        }
    });

    AbilityRegistry.register('FROST_NOVA', ({ engine, x, y, z }) => {
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 / 16) * i;
            engine.projectiles.push({
                x: x, y: y, z: z + 0.5,
                vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15,
                damage: 40,
                damageType: 'ICE',
                life: 2.0, maxLife: 2.0,
                isPlayerProjectile: true
            });
        }
    });

    AbilityRegistry.register('BLACK_HOLE', ({ engine, x, y, z, aimAngle }) => {
        const targetX = x + Math.cos(aimAngle) * 8;
        const targetY = y + Math.sin(aimAngle) * 8;
        engine.entities.push({ type: 'black_hole', x: targetX, y: targetY, z: z, lifeTime: 5.0, timer: 0, health: 9999, maxHealth: 9999, vx:0, vy:0 });
    });

    AbilityRegistry.register('MASS_HEAL', ({ engine, x, y, z }) => {
        engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + 100);
        engine.forEachEntity((ent: any) => {
            if (ent.isFriendly || ent.type === 'npc' || ent.type === 'villager') {
                if (ent.health !== undefined) ent.health = Math.min(ent.maxHealth || 100, ent.health + 100);
                if (ent.hp !== undefined) ent.hp = Math.min(ent.maxHp || 100, ent.hp + 100);
            }
        });
        for (let p = 0; p < 20; p++) {
            engine.particles.push({
                x: x, y: y, z: z + 1,
                text: '➕', color: '#00ff00', life: 1, maxLife: 1,
                vx: (Math.random() - 0.5)*2, vy: (Math.random() - 0.5)*2, vz: 2, speed: 0
            });
        }
    });

    AbilityRegistry.register('TIME_STOP', ({ engine }) => {
        engine.timeStopTimer = 5.0; 
    });

    AbilityRegistry.register('SUMMON_RAT', ({ engine, x, y, z }) => {
        for (let i = 0; i < 3; i++) {
            engine.rats.push({
                id: 'rat_summon_' + Math.random(),
                x: x + (Math.random() - 0.5) * 2,
                y: y + (Math.random() - 0.5) * 2,
                z: z,
                vx: 0, vy: 0, vz: 0,
                timer: 0,
                health: 50, maxHealth: 50,
                behavior: 'AGGRESSIVE',
                type: 'SUMMONED_RAT',
                isFriendly: true,
                speed: 6.0,
                damage: 15
            });
        }
        for (let p = 0; p < 10; p++) {
            engine.particles.push({
                x: x, y: y, z: z + 1,
                text: '', color: '#8B4513', life: 1, maxLife: 1,
                vx: (Math.random() - 0.5)*5, vy: (Math.random() - 0.5)*5, vz: 5, speed: 0
            });
        }
    });

    AbilityRegistry.register('EXPLODING_RUNES', ({ engine, x, y, z }) => {
        for (let i = 0; i < 3; i++) {
            engine.bombs.push({
                x: x + (Math.random() - 0.5) * 6,
                y: y + (Math.random() - 0.5) * 6,
                z: z,
                timer: i * 0.5 + 1.0,
                damage: 100
            });
        }
    });

    AbilityRegistry.register('PUSH_BACK', ({ engine, x, y }) => {
        engine.forEachEntity((ent: any) => {
            if (!ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                const dist = Math.sqrt((ent.x - x)**2 + (ent.y - y)**2);
                if (dist <= 10) {
                    const pushAngle = Math.atan2(ent.y - y, ent.x - x);
                    if (ent.vx !== undefined) ent.vx = Math.cos(pushAngle) * 20;
                    if (ent.vy !== undefined) ent.vy = Math.sin(pushAngle) * 20;
                }
            }
        });
    });

    AbilityRegistry.register('FEAR', ({ engine, x, y, z }) => {
        engine.forEachEntity((ent: any) => {
            if (!ent.isFriendly && ent.health > 0) {
                if (Math.hypot(ent.x - engine.player.x, ent.y - engine.player.y) < 8) {
                    ent.customData = ent.customData || {};
                    ent.customData.fear = 10.0;
                }
            }
        });
        for (let i = 0; i < 40; i++) engine.particles.push({x:engine.player.x+(Math.random()-0.5)*10, y:engine.player.y+(Math.random()-0.5)*10, z:z+Math.random()*3, text:'', color:'#9932CC', life:0.5, maxLife:0.5, vx:0, vy:0, vz:0});
    });

    AbilityRegistry.register('INVISIBILITY', ({ engine, z }) => {
        engine.player.buffs.invisibility = 15;
        if (engine.player.talents['travel_caster'] >= 1) engine.player.buffs.invisibility = 25;
        for (let i = 0; i < 30; i++) engine.particles.push({x:engine.player.x, y:engine.player.y, z:z, text:'', color:'#D3D3D3', life:1, maxLife:1, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:(Math.random()-0.5)*2});
    });

    AbilityRegistry.register('MAGIC_BLOCK', ({ engine, aimAngle }) => {
        let dist = 3;
        let tx = Math.floor(engine.player.x + Math.cos(aimAngle) * dist);
        let ty = Math.floor(engine.player.y + Math.sin(aimAngle) * dist);
        let tz = Math.floor(engine.player.z);
        if (engine.world.getBlock(tx, ty, tz) === 0) {
            engine.world.setBlock(tx, ty, tz, 92); // force field
            engine.world.respawningBlocks.set(`${tx},${ty},${tz}`, { type: 0, timer: 30.0 });
        }
    });

    AbilityRegistry.register('EXPLODING_RUNE', ({ engine }) => {
        engine.entities.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'exploding_rune',
            x: Math.floor(engine.player.x) + 0.5,
            y: Math.floor(engine.player.y) + 0.5,
            z: engine.player.z,
            hp: 1, maxHp: 1, state: 'idle', timer: 0, friendly: true, lifeTime: 300
        });
    });

    AbilityRegistry.register('ARCANE_LIGHT', ({ engine }) => {
        engine.entities.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'arcane_light',
            x: engine.player.x, y: engine.player.y, z: engine.player.z + 1.5,
            hp: 1, maxHp: 1, state: 'idle', timer: 0, friendly: true, lifeTime: 300
        });
    });
    
    const summonTypes = ['wyrmling', 'skeleton', 'zombie', 'wolf', 'bear'];
    for (const summon of summonTypes) {
        AbilityRegistry.register(`SUMMON_${summon.toUpperCase()}`, ({ engine, aimAngle, z }) => {
            let duration = 30;
            if (engine.player.talents['conjure_caster'] >= 1) duration = 45;
            if (engine.player.talents['conjure_caster'] >= 3) duration = 60;
            let hpMult = 1.0; let dmgMult = 1.0;
            if (engine.player.talents['conjure_caster'] >= 2) { hpMult = 1.5; dmgMult = 1.5; }
            if (engine.player.talents['conjure_caster'] >= 3) { hpMult = 2.0; dmgMult = 2.0; }
            
            let baseHp = 20;
            if (summon === 'bear') baseHp = 100;
            if (summon === 'wolf') baseHp = 60;
            if (summon === 'wyrmling') baseHp = 150;
            if (summon === 'zombie') baseHp = 80;
            if (summon === 'skeleton') baseHp = 40;

            engine.entities.push({
                id: Math.random().toString(36).substr(2, 9),
                type: summon,
                x: engine.player.x + Math.cos(aimAngle),
                y: engine.player.y + Math.sin(aimAngle),
                z: engine.player.z,
                hp: baseHp * hpMult,
                maxHp: baseHp * hpMult,
                state: 'idle', timer: 0, friendly: true, lifeTime: duration,
                customData: { dmgMult }
            });
            for (let i = 0; i < 20; i++) engine.particles.push({x:engine.player.x + Math.cos(aimAngle), y:engine.player.y+Math.sin(aimAngle), z:z, text:'', color:'#FFFFFF', life:1, maxLife:1, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:(Math.random()-0.5)*2});
        });
    }

    AbilityRegistry.register('SUMMON_BONE_PILE', ({ engine, aimAngle }) => {
        let tx = Math.floor(engine.player.x + Math.cos(aimAngle) * 2);
        let ty = Math.floor(engine.player.y + Math.sin(aimAngle) * 2);
        let tz = Math.floor(engine.player.z);
        if (engine.world.getBlock(tx, ty, tz) === 0) {
            engine.world.setBlock(tx, ty, tz, 27); 
            for (let i = 0; i < 30; i++) engine.particles.push({x:tx+0.5, y:ty+0.5, z:tz+0.5, text:'', color:'#D3D3D3', life:1, maxLife:1, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:(Math.random()-0.5)*2});
        }
    });

    AbilityRegistry.register('BLINK', ({ engine, aimAngle, z }) => {
        let dist = 5;
        if (engine.player.talents['travel_caster'] >= 3) dist = 8;
        let tx = engine.player.x + Math.cos(aimAngle) * dist;
        let ty = engine.player.y + Math.sin(aimAngle) * dist;
        const bx = Math.floor(tx); const by = Math.floor(ty); const bz = Math.floor(engine.player.z);
        if (engine.world.getBlock(bx,by,bz) === 0) {
            engine.player.x = tx; engine.player.y = ty;
        }
        for (let i = 0; i < 20; i++) engine.particles.push({x:tx, y:ty, z:z, text:'', color:'#C71585', life:1, maxLife:1, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, vz:(Math.random()-0.5)*2});
    });

    AbilityRegistry.register('LEVITATE', ({ engine }) => {
        let dur = 10; if (engine.player.talents['travel_caster'] >= 1) dur = 15;
        engine.player.buffs.levitate = dur;
    });

    AbilityRegistry.register('SPEED', ({ engine }) => {
        let dur = 10; if (engine.player.talents['travel_caster'] >= 1) dur = 15;
        engine.player.buffs.speed = dur;
    });

    AbilityRegistry.register('HEAL', ({ engine }) => {
        let amt = 25; if (engine.player.talents['arcane_healing'] >= 1) amt += 10;
        engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + amt);
    });

    AbilityRegistry.register('MAJOR_HEAL', ({ engine }) => {
        let amt = 60; if (engine.player.talents['arcane_healing'] >= 1) amt += 20;
        engine.player.health = Math.min(engine.player.effectiveMaxHealth, engine.player.health + amt);
    });

    AbilityRegistry.register('BOW_MULTI_SHOT', ({ engine, caster, x, y, z, aimAngle }) => {
        const weapon = caster?.equipment?.['MAIN_HAND'];
        const ammo = caster?.equipment?.['AMMO'];
        const speed = weapon?.projectileSpeed || 25;
        const damage = weapon?.damage || 15;
        const ammoDamage = ammo?.damage || 0;
        const totalDamage = damage + ammoDamage;
        const life = ((weapon?.reach || 10.0) + 15.0) / speed; // give multi-shot good range
        
        // Shoot 5 arrows in a spread
        for(let i = -2; i <= 2; i++) {
            const angle = aimAngle + i * 0.15;
            engine.projectiles.push({
                x, y, z: z + 0.5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                vz: 0,
                damage: totalDamage,
                life: life,
                maxLife: life,
                isPlayer: caster === engine.player,
                owner: caster
            });
        }
        
        if (ammo && caster === engine.player) {
            ammo.quantity--;
            if (ammo.quantity <= 0) caster.equipment['AMMO'] = null;
        }
    });

    AbilityRegistry.register('BOOMERANG_SPREAD_SHOT', ({ engine, caster, x, y, z, aimAngle }) => {
        const weapon = caster?.equipment?.['MAIN_HAND'];
        const speed = weapon?.projectileSpeed || 15;
        const damage = weapon?.damage || 15;
        const talentLevel = caster?.talents?.['boomerang'] || 1;
        const range = talentLevel >= 3 ? 10 : 5;
        const life = range / speed;
        
        let color = '#d2b48c'; 
        if (weapon?.id === 'green_metal_boomerang') color = '#32cd32';
        
        for(let i = -1; i <= 1; i++) {
            const angle = aimAngle + i * 0.2;
            engine.projectiles.push({
                x, y, z: z + 0.5,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                vz: 0,
                damage: damage,
                life: life,
                maxLife: life,
                damageType: 'BOOMERANG',
                isPlayer: caster === engine.player,
                isBoomerang: true,
                color: color,
                returning: false,
                owner: caster,
                rotation: 0
            });
        }
    });

    AbilityRegistry.register('BOOMERANG_SEEKER_SHOT', ({ engine, caster, x, y, z, aimAngle }) => {
        const weapon = caster?.equipment?.['MAIN_HAND'];
        const speed = weapon?.projectileSpeed || 15;
        const damage = weapon?.damage || 15;
        const talentLevel = caster?.talents?.['boomerang'] || 1;
        const range = talentLevel >= 3 ? 10 : 5;
        const life = range / speed;
        
        let color = '#d2b48c'; 
        if (weapon?.id === 'red_metal_boomerang') color = '#ff4500';
        
        engine.projectiles.push({
            x, y, z: z + 0.5,
            vx: Math.cos(aimAngle) * speed,
            vy: Math.sin(aimAngle) * speed,
            vz: 0,
            damage: damage * 1.5, // Seekers hit harder
            life: life + 2.0, // Initial time to find a target before returning
            maxLife: life + 2.0,
            damageType: 'BOOMERANG',
            isPlayer: caster === engine.player,
            isBoomerang: true,
            isSeekerBoomerang: true,
            color: color,
            returning: false,
            owner: caster,
            rotation: 0
        });
    });

    AbilityRegistry.register('BOW_EXPLOSIVE_SHOT', ({ engine, caster, x, y, z, aimAngle }) => {
        const weapon = caster?.equipment?.['MAIN_HAND'];
        const ammo = caster?.equipment?.['AMMO'];
        const speed = (weapon?.projectileSpeed || 25) * 1.5;
        const damage = (weapon?.damage || 25) * 1.5;
        const ammoDamage = ammo?.damage || 0;
        const totalDamage = damage + ammoDamage;
        const life = ((weapon?.reach || 15.0) + 20.0) / speed;
        
        engine.projectiles.push({
            x, y, z: z + 0.5,
            vx: Math.cos(aimAngle) * speed,
            vy: Math.sin(aimAngle) * speed,
            vz: 0,
            damage: totalDamage,
            damageType: 'EXPLOSION', 
            life: life,
            maxLife: life,
            isPlayer: caster === engine.player,
            owner: caster
        });

        if (ammo && caster === engine.player) {
            ammo.quantity--;
            if (ammo.quantity <= 0) caster.equipment['AMMO'] = null;
        }
    });
}
