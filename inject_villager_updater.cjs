const fs = require('fs');

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf8');

// 1. Import
if (!updaterCode.includes('VillagerUpdater')) {
    updaterCode = "import { VillagerUpdater } from './updaters/VillagerUpdater';\n" + updaterCode;
}

// 2. Call
updaterCode = updaterCode.replace(/\/\/ Update NPCs\n\ \ \ \ \ \ \ \ NPCUpdater\.updateAll\(engine, dt\);/g, 
`// Update NPCs
        NPCUpdater.updateAll(engine, dt);
        VillagerUpdater.updateAll(engine, dt);`);

fs.writeFileSync('src/game/Updater.ts', updaterCode);

let engineCode = fs.readFileSync('src/game/Engine.ts', 'utf8');
if (!engineCode.includes('villageTimer: number = 0;')) {
    engineCode = engineCode.replace(/spawnerTimer\: number = 0;/, 
`spawnerTimer: number = 0;
    villageTimer: number = 0;`);
}

fs.writeFileSync('src/game/Engine.ts', engineCode);

