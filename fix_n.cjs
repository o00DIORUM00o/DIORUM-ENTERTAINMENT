const fs = require('fs');

const files = fs.readdirSync('src/game/entities');
for (const file of files) {
    if (file.endsWith('.ts')) {
        let code = fs.readFileSync('src/game/entities/' + file, 'utf-8');
        code = code.replace(/\\n/g, '\n');
        fs.writeFileSync('src/game/entities/' + file, code);
    }
}

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf-8');
updaterCode = updaterCode.replace(/\\n/g, '\n');
fs.writeFileSync('src/game/Updater.ts', updaterCode);

console.log('Fixed \\n');
