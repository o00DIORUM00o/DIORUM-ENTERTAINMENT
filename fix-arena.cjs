const fs = require('fs');

let bc = fs.readFileSync('src/game/content/blocks/core_blocks.ts', 'utf8');
bc = bc.replace(/, interactable: true/g, '');
fs.writeFileSync('src/game/content/blocks/core_blocks.ts', bc);

let sc = fs.readFileSync('src/game/content/structures/core_structures.ts', 'utf8');
sc = sc.replace(/IRON_FENCE/g, 'OBSIDIAN');
fs.writeFileSync('src/game/content/structures/core_structures.ts', sc);

let pc = fs.readFileSync('src/game/Player.ts', 'utf8');
pc = pc.replace(/ctx\.engine\.arena/g, '(ctx as any).engine.arena');
fs.writeFileSync('src/game/Player.ts', pc);

let am = fs.readFileSync('src/game/ArenaManager.ts', 'utf8');
am = am.replace(/51/g, 'BlockType.DOOR_LOCKED');
am = am.replace(/0\); \/\/ AIR/g, 'BlockType.AIR);');
am = am.replace(/0\);/g, 'BlockType.AIR);');
// Add import { BlockType } from './constants/BlockType';
am = "import { BlockType } from './constants/BlockType';\n" + am;
fs.writeFileSync('src/game/ArenaManager.ts', am);

console.log('Fixed compile errors!');
