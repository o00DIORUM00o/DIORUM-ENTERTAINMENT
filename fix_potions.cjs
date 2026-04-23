const fs = require('fs');

let code = fs.readFileSync('src/game/Player.ts', 'utf8');

code = code.replace(/if \(item\.id === 'red_berry' \|\| item\.id === 'blue_berry' \|\| item\.id === 'black_berry' \|\| item\.id === 'yellow_berry'\) \{/,
`if (item.id === 'red_berry' || item.id === 'blue_berry' || item.id === 'black_berry' || item.id === 'yellow_berry' || item.id === 'health_potion' || item.id === 'mana_potion' || item.id === 'swiftness_potion' || item.id === 'fire_vial') {`);

fs.writeFileSync('src/game/Player.ts', code);
