const fs = require('fs');

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf8');

while (updaterCode.includes('\\\\n')) {
    updaterCode = updaterCode.replace(`\\\\n`, `\\n`);
}

fs.writeFileSync('src/game/Updater.ts', updaterCode);

console.log("Fixed newlines");
