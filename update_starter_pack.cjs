const fs = require('fs');

let pCode = fs.readFileSync('src/game/Player.ts', 'utf8');

pCode = pCode.replace(/this\.inventory\[4\] \= \{ \.\.\.ITEMS\['stone'\], quantity\: 50 \}\;/g, 
`this.inventory[4] = { ...ITEMS['stone'], quantity: 50 };
            this.inventory[5] = { ...ITEMS['village_bell'], quantity: 1 };`);

fs.writeFileSync('src/game/Player.ts', pCode);

let aCode = fs.readFileSync('src/App.tsx', 'utf8');
aCode = aCode.replace(/pack \=\=\= \"Builder's Crate\" \&\& \"Includes a Shovel, 50 Wood, 50 Stone, and a Tent\.\"/g,
`pack === "Builder's Crate" && "Includes a Shovel, 50 Wood, 50 Stone, a Village Bell, and a Tent."`);
fs.writeFileSync('src/App.tsx', aCode);
