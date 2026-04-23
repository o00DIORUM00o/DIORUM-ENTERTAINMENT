const fs = require('fs');

let npcCode = fs.readFileSync('src/game/entities/NPCUpdater.ts', 'utf8');

// The problematic lines:
//                   } else if (Math.random() < 0.01) {
//                   if (Math.random() < 0.01) {
//                       npc.state = Math.random() < 0.5 ? 'IDLE' : 'WANDER';

npcCode = npcCode.replace(/\} else if \(Math\.random\(\) \< 0\.01\) \{\n\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ if \(Math\.random\(\) \< 0\.01\) \{/g, 
`} else if (Math.random() < 0.01) {`);

fs.writeFileSync('src/game/entities/NPCUpdater.ts', npcCode);
