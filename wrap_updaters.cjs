const fs = require('fs');
const glob = require('glob');

let updaterCode = fs.readFileSync('src/game/Updater.ts', 'utf8');

const updaters = [
    'BeeUpdater', 'LavaGolemUpdater', 'RatUpdater', 'SpawnerUpdater', 
    'NPCUpdater', 'VillagerUpdater', 'AnimalUpdater', 'AntUpdater', 
    'AbyssalKnightUpdater', 'GoblinUpdater', 'OrcUpdater', 
    'SkeletonUpdater', 'SkeletonRemainsUpdater'
];

updaters.forEach(updater => {
    updaterCode = updaterCode.replaceAll(updater + '.updateAll(engine, dt);', "if (!(engine as any).timeStopTimer || (engine as any).timeStopTimer <= 0) { " + updater + ".updateAll(engine, dt); }");
});

fs.writeFileSync('src/game/Updater.ts', updaterCode);

console.log("Success wrapping updaters natively");
