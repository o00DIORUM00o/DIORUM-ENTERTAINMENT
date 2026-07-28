const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'src/game/entities/SkeletonUpdater.ts');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replace(
    /isPlayer: skel\.isFriendly, color: '#e2e8f0'/g,
    "isPlayer: !!skel.isFriendly, color: '#e2e8f0'"
);

fs.writeFileSync(targetFile, content);

const targetFile2 = path.join(__dirname, 'src/game/entities/FrostCasterUpdater.ts');
let content2 = fs.readFileSync(targetFile2, 'utf8');

content2 = content2.replace(
    /isPlayer: ent\.isLoyal,/g,
    "isPlayer: !!ent.isLoyal,"
);

fs.writeFileSync(targetFile2, content2);

console.log("Updated skeleton and frost caster damage.");
