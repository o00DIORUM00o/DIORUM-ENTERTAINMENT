import * as fs from 'fs';
import * as path from 'path';

const constantsPath = path.resolve('./src/game/Constants.ts');
let text = fs.readFileSync(constantsPath, 'utf8');

const regex = /export const BLOCK_COLORS(?:[\s\S]*?)};\n/g;

text = text.replace(regex, `import { BLOCK_COLORS as REGISTRY_COLORS } from './registries/BlockRegistry';\nexport const BLOCK_COLORS = REGISTRY_COLORS;\n`);

fs.writeFileSync(constantsPath, text);
console.log('Successfully replaced BLOCK_COLORS with registry!');
