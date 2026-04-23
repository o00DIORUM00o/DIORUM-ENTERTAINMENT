const fs = require('fs');

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf8');

const blackHoleLogic = "            } else if (ent.type === 'black_hole') {\\n" +
"                const enemiesList = [...engine.goblins, ...engine.orcs, ...engine.skeletons, ...engine.lavaGolems, ...engine.bees, ...engine.ants, ...engine.rats];\\n" +
"                for (const e of enemiesList) {\\n" +
"                    const dist = Math.hypot((e.x||0) - (ent.x||0), (e.y||0) - (ent.y||0));\\n" +
"                    if (dist < 10 && Math.abs((e.z||0) - (ent.z||0)) < 5) {\\n" +
"                        const pullFactor = (10 - dist) / 10;\\n" +
"                        e.vx = (e.vx||0) + (ent.x - e.x) * pullFactor * 10 * dt;\\n" +
"                        e.vy = (e.vy||0) + (ent.y - e.y) * pullFactor * 10 * dt;\\n" +
"                        if (e.health !== undefined) e.health -= 25 * dt;\\n" +
"                        if (e.hp !== undefined) e.hp -= 25 * dt;\\n" +
"                    }\\n" +
"                }\\n" +
"                if (Math.random() < 0.5) {\\n" +
"                    const angle = Math.random() * Math.PI * 2;\\n" +
"                    const r = 5;\\n" +
"                    engine.particles.push({\\n" +
"                        x: ent.x + Math.cos(angle)*r, y: ent.y + Math.sin(angle)*r, z: ent.z + Math.random(),\\n" +
"                        text: '', color: '#1a1a1a', life: 0.5, maxLife: 0.5,\\n" +
"                        vx: -Math.cos(angle)*15, vy: -Math.sin(angle)*15, vz: 0, speed: 0\\n" +
"                    });\\n" +
"                }\\n";

updaterCode = updaterCode.replace("} else if (ent.type === 'arcane_light') {",
blackHoleLogic + "} else if (ent.type === 'arcane_light') {");

fs.writeFileSync('src/game/Updater.ts', updaterCode);

console.log("Success adding black hole!");
