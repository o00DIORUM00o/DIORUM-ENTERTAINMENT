const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.match(/import\s+{([^}]*BlockType[^}]*)}\s+from\s+['"]([^'"]*)World['"]/)) {
        content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]([^'"]*)World['"]/g, (match, imports, prefix) => {
            if (!imports.includes('BlockType')) return match;
            
            const otherImports = imports.split(',').map(s => s.trim()).filter(s => s !== 'BlockType' && s !== '');
            const newPre = prefix.includes('../../') ? '../../' : (prefix.includes('../') ? '../' : './');
            const newPath = newPre + 'constants/BlockType';
            
            let result = `import { BlockType } from '${newPath}';\n`;
            if (otherImports.length > 0) {
                result += `import { ${otherImports.join(', ')} } from '${prefix}World';`;
            }
            changed = true;
            return result;
        });
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
