import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve('./src/game/Player.ts');
let text = fs.readFileSync(file, 'utf8');

text = `import { BlockRegistry } from './registries/BlockRegistry';\n` + text;
fs.writeFileSync(file, text);
