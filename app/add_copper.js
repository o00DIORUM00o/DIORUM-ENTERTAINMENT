const fs = require('fs');
const files = [
    'src/game/entities/SphinxBossUpdater.ts',
    'src/game/entities/SandTerrorUpdater.ts',
    'src/game/entities/OrcUpdater.ts',
    'src/game/entities/SkeletonRemainsUpdater.ts',
    'src/game/entities/KoboldUpdater.ts',
    'src/game/entities/AbyssalKnightUpdater.ts',
    'src/game/entities/DrakeUpdater.ts',
    'src/game/entities/RatheEntitiesUpdater.ts',
    'src/game/entities/PhantomWizardUpdater.ts',
    'src/game/entities/SkeletonUpdater.ts',
    'src/game/entities/ShadowWizardUpdater.ts',
    'src/game/entities/LavaGolemUpdater.ts',
    'src/game/entities/RatUpdater.ts',
    'src/game/entities/FireDragonBossUpdater.ts',
    'src/game/entities/AntUpdater.ts'
];

for (const fp of files) {
    if (!fs.existsSync(fp)) continue;
    let content = fs.readFileSync(fp, 'utf8');

    // Make sure ITEMS is imported
    if (!content.includes('ITEMS')) {
        let lines = content.split('\n');
        // Find last import
        let lastImportIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import')) lastImportIndex = i;
        }
        lines.splice(lastImportIndex + 1, 0, `import { ITEMS } from '../Inventory';`);
        content = lines.join('\n');
    }

    // Use replace to find all instances where hp or health <= 0
    let changes = 0;
    const regex = /if\s*\(\s*([a-zA-Z0-9_\.]+)\.(health|hp)\s*<=\s*0\s*\)\s*{/g;
    
    if (!content.includes('copper_piece')) {
        content = content.replace(regex, (match, entity) => {
            changes++;
            return `${match}\n                if (Math.random() < 0.4) engine.dropItem(${entity}.x, ${entity}.y, ${entity}.z, { ...ITEMS['copper_piece'], quantity: Math.floor(Math.random() * 3) + 1 });`;
        });
        
        if (changes > 0) {
            fs.writeFileSync(fp, content);
            console.log("Updated", fp, "changes:", changes);
        }
    }
}
