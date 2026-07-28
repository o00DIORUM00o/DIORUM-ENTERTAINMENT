const fs = require('fs');
const path = require('path');
const glob = require('glob');

const dir = path.join(__dirname, 'src/game/entities');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Updater.ts'));

for (const file of files) {
    if (file === 'CompanionUpdater.ts') continue;
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Quick regex replace: if we see engine.projectiles.push({, we make sure isPlayer is in there somewhere.
    // Actually, it's safer to just do a manual check.
    // If it has "engine.projectiles.push({" but not "isPlayer:", we inject it.
    
    let parts = content.split('engine.projectiles.push({');
    if (parts.length > 1) {
        let changed = false;
        for (let i = 1; i < parts.length; i++) {
            let chunk = parts[i];
            let closingIdx = chunk.indexOf('});');
            if (closingIdx !== -1) {
                let inside = chunk.substring(0, closingIdx);
                if (!inside.includes('isPlayer')) {
                    parts[i] = '\n                            isPlayer: false,' + chunk;
                    changed = true;
                }
            }
        }
        if (changed) {
            fs.writeFileSync(fullPath, parts.join('engine.projectiles.push({'));
            console.log("Fixed", file);
        }
    }
}
