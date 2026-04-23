import * as fs from 'fs';
import * as path from 'path';
import { ITEMS, SPELLS } from '../src/game/Inventory';

function serialize(obj: any) {
    return JSON.stringify(obj, null, 4).replace(/"([^"]+)":/g, '$1:');
}

const groups: Record<string, any[]> = {};

for (const key of Object.keys(ITEMS)) {
    const item = ITEMS[key];
    const cat = item.category || 'MISC';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
}

const dir = path.resolve('./src/game/content/items');
fs.mkdirSync(dir, { recursive: true });

for (const cat of Object.keys(groups)) {
    const catItems = groups[cat];
    let content = `import type { Item } from '../../registries/ItemRegistry';\n\n`;
    content += `export const ${cat}_ITEMS: Record<string, Item> = {\n`;
    for (const item of catItems) {
        content += `    '${item.id}': ${serialize(item).replace(/\n/g, '\n    ')},\n`;
    }
    content += `};\n`;
    
    fs.writeFileSync(path.join(dir, `${cat.toLowerCase()}.ts`), content);
}

// Spells
const spellDir = path.resolve('./src/game/content/spells');
fs.mkdirSync(spellDir, { recursive: true });
let spellContent = `import type { Spell } from '../../registries/ItemRegistry';\n\n`;
spellContent += `export const ALL_SPELLS: Record<string, Spell> = {\n`;
for (const key of Object.keys(SPELLS)) {
    spellContent += `    '${key}': ${serialize(SPELLS[key]).replace(/\n/g, '\n    ')},\n`;
}
spellContent += `};\n`;
fs.writeFileSync(path.join(spellDir, `spells.ts`), spellContent);

console.log("Successfully generated separated files!");
