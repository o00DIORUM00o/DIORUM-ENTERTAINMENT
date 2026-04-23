const fs = require('fs');
const glob = require('glob');

glob.sync('src/game/entities/*.ts').forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    const lines = code.split('\\n');
    let modified = false;
    for (let i=0; i<lines.length; i++) {
        const line = lines[i];
        if (line.includes('.x +=') && line.includes('.vx')) {
            const varNameMatch = line.match(/(\\w+)\\.x\\s*\\+\\=/);
            if (varNameMatch) {
                const varName = varNameMatch[1];
                lines.splice(i, 0, "            if (" + varName + ".rootTimer > 0) { " + varName + ".rootTimer -= dt; " + varName + ".vx = 0; " + varName + ".vy = 0; }");
                modified = true;
                break;
            }
        }
    }
    if (modified) fs.writeFileSync(file, lines.join('\\n'));
});

console.log("Success modifying root timers");
