const fs = require('fs');

let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace('{[0, 1, 2].map((i) => {', '{[0, 1].map((i) => {');
appStr = appStr.replace("{i === 0 ? 'LB' : i === 1 ? 'RB' : 'TOUCH'}", "{i === 0 ? 'LB' : 'RB'}");

fs.writeFileSync('src/App.tsx', appStr);

console.log("Updated App.tsx quickslots mapping");
