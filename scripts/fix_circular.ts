import * as fs from 'fs';
import * as path from 'path';

const worldPath = path.resolve('./src/game/World.ts');
const text = fs.readFileSync(worldPath, 'utf8');

const match = text.match(/export enum BlockType \{[\s\S]+?\n\}/);
if (!match) throw new Error("Could not find BlockType in World.ts");

const blockTypeEnumStr = match[0];

fs.mkdirSync(path.resolve('./src/game/constants'), { recursive: true });
fs.writeFileSync(path.resolve('./src/game/constants/BlockType.ts'), blockTypeEnumStr);

let newWorldText = text.replace(match[0], `import { BlockType } from './constants/BlockType';\nexport { BlockType };`);
fs.writeFileSync(worldPath, newWorldText);

const lootTablesPath = path.resolve('./src/game/content/loot/LootTables.ts');
let lootTablesText = fs.readFileSync(lootTablesPath, 'utf8');
lootTablesText = lootTablesText.replace(`import { BlockType } from '../../World';`, `import { BlockType } from '../../constants/BlockType';`);
fs.writeFileSync(lootTablesPath, lootTablesText);

console.log('Successfully extracted BlockType to break circular dependency!');
