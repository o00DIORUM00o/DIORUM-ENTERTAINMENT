const fs = require('fs');

const files = [
    'src/game/updaters/MechanismUpdater.ts',
    'src/game/systems/AutomationSystem.ts',
    'src/game/Engine.ts'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/BlockType\.CHEST/g, "BlockType.CHEST || engine?.world?.getBlock(cx, cy, cz) === BlockType.GOLD_CHEST || block === BlockType.GOLD_CHEST || sourceBlock === BlockType.GOLD_CHEST"); // this might be messy, let's just do it cleanly
    // actually, let's just do the ones we found earlier:
}
