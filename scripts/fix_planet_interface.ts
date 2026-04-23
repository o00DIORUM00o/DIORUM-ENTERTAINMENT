import * as fs from 'fs';
import * as path from 'path';

const pluginPath = path.resolve('./src/game/registries/PlanetRegistry.ts');
let pluginText = fs.readFileSync(pluginPath, 'utf8');

const regex = /oreMultiplier: number;([\s\S]*?)class Registry/;

const replacement = `oreMultiplier: number;
    safeAreaMethod: 'BOX' | 'RADIAL';
    spawnerTable: { block: BlockType, chance: number }[];
}

class Registry`;

pluginText = pluginText.replace(regex, replacement);

fs.writeFileSync(pluginPath, pluginText);
console.log('Fixed PlanetRegistry Interface');
