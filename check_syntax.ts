import * as parser from '@typescript-eslint/typescript-estree';
import * as fs from 'fs';
const code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

try {
    parser.parse(code, { loc: true });
} catch (e) {
    console.log(e);
}
