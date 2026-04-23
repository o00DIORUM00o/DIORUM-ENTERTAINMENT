import * as fs from 'fs';
import * as path from 'path';

const pluginPath = path.resolve('./src/game/content/planets/core_planets.ts');
let pluginText = fs.readFileSync(pluginPath, 'utf8');

const standardSpawners = `[
            { block: BlockType.BEE_HIVE, chance: 0.20 },
            { block: BlockType.GOBLIN_CAMP, chance: 0.20 },
            { block: BlockType.ORC_TENT, chance: 0.10 },
            { block: BlockType.GOBLIN_SHAMAN_TENT, chance: 0.10 },
            { block: BlockType.BONE_PILE_SPAWNER, chance: 0.20 },
            { block: BlockType.ANT_HILL, chance: 0.17 },
            { block: BlockType.SLIME_PUDDLE, chance: 0.01 },
            { block: BlockType.SPIDER_WEB, chance: 0.01 },
            { block: BlockType.DEMON_PORTAL, chance: 0.01 }
        ]`;

const arethSpawners = `[
            { block: BlockType.KOBOLD_TENT, chance: 0.33 },
            { block: BlockType.DRAKE_NEST, chance: 0.33 },
            { block: BlockType.LAVA_POOL, chance: 0.34 }
        ]`;


pluginText = pluginText.replace(/oreMultiplier: 1\n    \},/g, `oreMultiplier: 1,
        safeAreaMethod: 'RADIAL',
        spawnerTable: ${standardSpawners}
    },`);

pluginText = pluginText.replace(/oreMultiplier: (\d)\n    \},/g, `oreMultiplier: $1,
        safeAreaMethod: 'RADIAL',
        spawnerTable: ${standardSpawners}
    },`);

// Need to specifically inject areth configs
pluginText = pluginText.replace(/id: 'ARETH',([\s\S]*?)oreMultiplier: (\d)\n/, `id: 'ARETH',$1oreMultiplier: $2,\n        safeAreaMethod: 'BOX',\n        spawnerTable: ${arethSpawners}\n`);

// Deal with the very last one lacking a trailing comma possibly
pluginText = pluginText.replace(/oreMultiplier: 1\n    \}\n/g, `oreMultiplier: 1,
        safeAreaMethod: 'RADIAL',
        spawnerTable: ${standardSpawners}
    }\n`);


fs.writeFileSync(pluginPath, pluginText);
console.log('Fixed Planet Data');
