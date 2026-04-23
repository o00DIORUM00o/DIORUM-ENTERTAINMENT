const fs = require('fs');

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf8');

const triggerSecondaryLogic = `
            onTriggerSecondary: (ability: string, aimAngle: number, px: number, py: number, pz: number) => {
                const targetX = px + Math.cos(aimAngle) * 8;
                const targetY = py + Math.sin(aimAngle) * 8;
                const allEnts = [
                    ...(engine.bees || []), 
                    ...(engine.ants || []), 
                    ...(engine.goblins || []), 
                    ...(engine.orcs || []), 
                    ...(engine.skeletons || []), 
                    ...(engine.lavaGolems || []),
                    ...(engine.rats || []),
                    ...(engine.animals || []),
                    ...(engine.entities || [])
                ];

                if (ability === 'METEOR') {
                    // Huge explosion at targetX, targetY (simulate with particle effects and AoE damage)
                    for (let p = 0; p < 40; p++) {
                        engine.particles.push({
                            x: targetX, y: targetY, z: pz + 4 - Math.random() * 2,
                            text: '', color: '#ff4500', life: 1, maxLife: 1,
                            vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, vz: (Math.random() - 0.5) * 8, speed: 0
                        });
                    }
                    for (const ent of allEnts) {
                        const dist = Math.sqrt((ent.x - targetX)**2 + (ent.y - targetY)**2);
                        if (dist <= 6) {
                            if (ent.health !== undefined) ent.health -= 150;
                            if (ent.hp !== undefined) ent.hp -= 150;
                        }
                    }
                } else if (ability === 'SUMMON_SKELETON') {
                    engine.skeletons.push({
                        x: px + (Math.random() - 0.5) * 2,
                        y: py + (Math.random() - 0.5) * 2,
                        z: pz,
                        hp: 150, maxHp: 150,
                        vx: 0, vy: 0,
                        state: 'WANDER', timer: 0,
                        isFriendly: true // Special flag so we don't attack player (handled later if needed, or skeleton AI updated, but lets just add the flag)
                    });
                } else if (ability === 'ROOT') {
                    for (const ent of allEnts) {
                        const dist = Math.sqrt((ent.x - px)**2 + (ent.y - py)**2);
                        if (dist <= 15 && !ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                            ent.vx = 0; ent.vy = 0;
                            ent.rootTimer = 5.0; // Handled in Updater
                        }
                    }
                } else if (ability === 'LIGHTNING_STRIKE') {
                    for (let p = 0; p < 20; p++) {
                        engine.particles.push({
                            x: targetX, y: targetY, z: pz + p * 0.5,
                            text: '', color: '#00ffff', life: 0.5, maxLife: 0.5,
                            vx: (Math.random() - 0.5), vy: (Math.random() - 0.5), vz: 0, speed: 0
                        });
                    }
                    for (const ent of allEnts) {
                        const dist = Math.sqrt((ent.x - targetX)**2 + (ent.y - targetY)**2);
                        if (dist <= 4 && !ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                            if (ent.health !== undefined) ent.health -= 120;
                            if (ent.hp !== undefined) ent.hp -= 120;
                        }
                    }
                } else if (ability === 'LAVA_PUDDLE') {
                    for (let lx = -1; lx <= 1; lx++) {
                        for (let ly = -1; ly <= 1; ly++) {
                           // Set block to lava
                           engine.world.setBlock(Math.floor(targetX + lx), Math.floor(targetY + ly), Math.floor(pz - 1), 6); // 6 is LAVA
                        }
                    }
                } else if (ability === 'FROST_NOVA') {
                    for (let i = 0; i < 16; i++) {
                        const angle = (Math.PI * 2 / 16) * i;
                        engine.projectiles.push({
                            x: px, y: py, z: pz + 0.5,
                            vx: Math.cos(angle) * 15, vy: Math.sin(angle) * 15,
                            damage: 40,
                            damageType: 'ICE',
                            life: 2.0, maxLife: 2.0,
                            isPlayerProjectile: true
                        });
                    }
                } else if (ability === 'BLACK_HOLE') {
                    engine.entities.push({ type: 'black_hole', x: targetX, y: targetY, z: pz, lifeTime: 5.0, timer: 0, health: 9999, maxHealth: 9999, vx:0, vy:0 });
                } else if (ability === 'MASS_HEAL') {
                    engine.player.health = Math.min(engine.player.maxHealth, engine.player.health + 100);
                    for (const ent of allEnts) {
                        if (ent.isFriendly || ent.type === 'npc' || ent.type === 'villager') {
                            if (ent.health !== undefined) ent.health = Math.min(ent.maxHealth || 100, ent.health + 100);
                            if (ent.hp !== undefined) ent.hp = Math.min(ent.maxHp || 100, ent.hp + 100);
                        }
                    }
                    for (let p = 0; p < 20; p++) {
                        engine.particles.push({
                            x: px, y: py, z: pz + 1,
                            text: '➕', color: '#00ff00', life: 1, maxLife: 1,
                            vx: (Math.random() - 0.5)*2, vy: (Math.random() - 0.5)*2, vz: 2, speed: 0
                        });
                    }
                } else if (ability === 'TIME_STOP') {
                    (engine as any).timeStopTimer = 5.0; 
                } else if (ability === 'PUSH_BACK') {
                    for (const ent of allEnts) {
                        if (!ent.isFriendly && ent.type !== 'npc' && ent.type !== 'villager') {
                            const dist = Math.sqrt((ent.x - px)**2 + (ent.y - py)**2);
                            if (dist <= 10) {
                                const pushAngle = Math.atan2(ent.y - py, ent.x - px);
                                ent.vx = Math.cos(pushAngle) * 20;
                                ent.vy = Math.sin(pushAngle) * 20;
                            }
                        }
                    }
                }
            },
            onHit: (hx, hy, hz, damage, blockType) => {
`;

updaterCode = updaterCode.replace(/onHit\: \(hx\, hy\, hz\, damage\, blockType\) \=\> \{/g, triggerSecondaryLogic);

fs.writeFileSync('src/game/Updater.ts', updaterCode);

console.log("Success modifying Updater.ts");
