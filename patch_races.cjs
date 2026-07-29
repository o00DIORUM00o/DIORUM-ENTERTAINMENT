const fs = require('fs');
let p = 'src/game/content/races/core_races.ts';
let c = fs.readFileSync(p, 'utf8');

let newGroups = `    {
        names: ['IMP', 'COPPER DRAGON FOLK'],
        talents: { reading: 1, focus: 1 }
    },
];`;
c = c.replace('];', newGroups);

fs.writeFileSync(p, c);
console.log('patched races');
