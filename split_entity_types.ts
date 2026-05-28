import * as fs from 'fs';
import * as parser from '@typescript-eslint/typescript-estree';

const code = fs.readFileSync('src/game/types/EntityTypes.ts', 'utf8');
const lines = code.split('\n');

const ast = parser.parse(code, { loc: true });

let categories: Record<string, string[]> = {
    effects: [],
    enemies: [],
    npcs: [],
    animals: [],
    bosses: [],
    core: []
};

for (const stmt of ast.body) {
    let handled = false;
    if (stmt.type === 'ExportNamedDeclaration') {
        const decl = stmt.declaration;
        if (decl && decl.type === 'TSInterfaceDeclaration') {
            const name = decl.id.name;
            const str = lines.slice(stmt.loc.start.line - 1, stmt.loc.end.line).join('\n');
            
            if (['Particle', 'Projectile', 'Bomb', 'AoEEffect', 'ConeEffect', 'DroppedItem'].includes(name)) {
                categories.effects.push(str);
                handled = true;
            } else if (['Bee', 'GiantAnt', 'Rat', 'Goblin', 'Kobold', 'Gargoyle', 'Djinn', 'Gremlin', 'Orc', 'Drake', 'RockGolem', 'Archer', 'DarkKnight', 'Skeleton', 'SkeletonRemains', 'AbyssalKnight', 'LavaGolem'].includes(name)) {
                categories.enemies.push(str);
                handled = true;
            } else if (['NPC'].includes(name)) {
                categories.npcs.push(str);
                handled = true;
            } else if (['Animal', 'Mount', 'Deer', 'Wolf'].includes(name)) {
                categories.animals.push(str);
                handled = true;
            } else if (['FireDragonBoss', 'Sphinx', 'SandTerror', 'PhantomWizard'].includes(name)) {
                categories.bosses.push(str);
                handled = true;
            } else {
                categories.core.push(str);
                handled = true;
            }
        } else if (decl && decl.type === 'TSTypeAliasDeclaration') {
            const str = lines.slice(stmt.loc.start.line - 1, stmt.loc.end.line).join('\n');
            categories.animals.push(str);
            handled = true;
        }
    }
}

for (const [cat, blocks] of Object.entries(categories)) {
    if (blocks.length === 0) continue;
    
    let imports = '';
    if (cat === 'effects') {
        imports = "import { Item } from '../../Inventory';\nimport { Player } from '../../Player';\n\n";
    } else if (cat === 'animals') {
        imports = "";
    }
    
    const fileContent = imports + blocks.join('\n\n');
    fs.writeFileSync("src/game/types/" + cat + ".ts", fileContent);
}

let indexContent = "import { Item } from '../Inventory';\nimport { Player } from '../Player';\n\n";
for (const cat of Object.keys(categories)) {
    if (categories[cat].length > 0) {
        indexContent += "export * from './" + cat + "';\n";
    }
}

fs.writeFileSync('src/game/types/EntityTypes.ts', indexContent);
console.log("Segmented EntityTypes.ts");
