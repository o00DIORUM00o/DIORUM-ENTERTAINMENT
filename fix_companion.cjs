const fs = require('fs');
const path = 'src/game/player/actions/CompanionAction.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/}\s*} else if/g, '} else if');
fs.writeFileSync(path, content);
console.log("Fixed CompanionAction.ts double brace");
