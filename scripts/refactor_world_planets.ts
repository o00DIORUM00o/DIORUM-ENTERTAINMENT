import * as fs from 'fs';
import * as path from 'path';

const worldPath = path.resolve('./src/game/World.ts');
let worldText = fs.readFileSync(worldPath, 'utf8');

const regex = /let PL_SURFACE = BlockType\.GRASS;[\s\S]*?break;\n\s*\}/;

const substitute = `const planetDef = PlanetRegistry.get(this.activePlanet);
        let PL_SURFACE = planetDef.surfaceBlock;
        let PL_DIRT = planetDef.dirtBlock;
        let PL_STONE = planetDef.stoneBlock;
        let PL_WATER = planetDef.waterBlock;
        let PL_WOOD = planetDef.woodBlock;
        let PL_LEAVES = planetDef.leafBlock;
        let PL_PINE_LEAF = planetDef.pineLeafBlock;
        let PL_ELEV_MOD = planetDef.elevationMod;
        let PL_BASE_ELEV = planetDef.baseElevation;
        let PL_WATER_LEVEL = planetDef.waterLevel;
        let PL_ORE_MULT = planetDef.oreMultiplier;`;

worldText = worldText.replace(regex, substitute);

if (!worldText.includes(`import { PlanetRegistry }`)) {
    worldText = `import { PlanetRegistry } from './registries/PlanetRegistry';\n` + worldText;
}

fs.writeFileSync(worldPath, worldText);
console.log('Successfully refactored World.ts to use PlanetRegistry');
