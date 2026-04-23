const fs = require('fs');
let code = fs.readFileSync('src/game/Updater.ts', 'utf-8');
code = code.replace(/\\n\s*Updater\.applyBoids/g, '\n            Updater.applyBoids');
fs.writeFileSync('src/game/Updater.ts', code);
