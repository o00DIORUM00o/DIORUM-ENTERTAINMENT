const fs = require('fs');
let code = fs.readFileSync('src/game/Updater.ts', 'utf8');

// The file has literal \\n so we just want to parse it as actual new line
code = code.split('\\\\n').join('\\n');

fs.writeFileSync('src/game/Updater.ts', code);
console.log("Replaced literal \\n");
