const fs = require('fs');
let code = fs.readFileSync('src/game/Updater.ts', 'utf8');

const entityMap2 = [
    { name: 'rat', array: 'rats' },
    { name: 'golem', array: 'lavaGolems' },
    { name: 'skel', array: 'skeletons' },
    { name: 'npc', array: 'npcs' },
    { name: 'bee', array: 'bees' }
    // Note: AbyssalKnights could use 'k', let's check
];

// Let's just do a generic replace for standard x += vx * dt lines if they haven't been Boids injected yet.
['rat', 'golem', 'skel', 'npc', 'bee', 'k'].forEach(name => {
    // Find lines like: rat.x += rat.vx * dt;
    // Replace with: Updater.applyBoids(rat, engine, dt);\n            rat.x += rat.vx * dt;
    const rx = new RegExp('(\\n\\s*' + name + '\\.x \\+= ' + name + '\\.vx \\* dt;)', 'g');
    if (code.match(rx)) {
        code = code.replace(rx, '\\n            Updater.applyBoids(' + name + ', engine, dt);$1');
        console.log("Injected Boids into " + name + ".");
    } else {
        console.log("Could not find x += vx * dt for " + name);
    }
});

fs.writeFileSync('src/game/Updater.ts', code);
console.log("Done.");
