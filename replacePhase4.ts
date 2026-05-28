import * as fs from 'fs';

let code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

const startIndex = code.indexOf('    static applyDungeons(chunk: Chunk) {');
const endIndex = code.lastIndexOf('    }');

if (startIndex !== -1 && endIndex !== -1) {
    let methodCode = code.substring(startIndex, endIndex + 5);

    // Change TerrainGenerator.xxx to DungeonCarver.xxx inside methodCode
    methodCode = methodCode.replace(/TerrainGenerator\.generateAbyssalRealm/g, 'DungeonCarver.generateAbyssalRealm');
    methodCode = methodCode.replace(/TerrainGenerator\.carveCorridor/g, 'DungeonCarver.carveCorridor');
    methodCode = methodCode.replace(/TerrainGenerator\.setBlockSafe/g, 'DungeonCarver.setBlockSafe');
    methodCode = methodCode.replace(/TerrainGenerator\.carveAbyssalCorridor/g, 'DungeonCarver.carveAbyssalCorridor');
    
    // Create DungeonCarver.ts
    const carverCode = `import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { Chunk } from './Chunk';
import { PlanetRegistry } from '../registries/PlanetRegistry';

export class DungeonCarver {
${methodCode}
}
`;
    fs.writeFileSync('src/game/world/DungeonCarver.ts', carverCode);
    
    // Clean up TerrainGenerator.ts
    let newCode = code.substring(0, startIndex) + code.substring(endIndex + 5);
    newCode = newCode.replace(/TerrainGenerator\.applyDungeons\(chunk\);/g, 'DungeonCarver.applyDungeons(chunk);');
    let importString = "import { DungeonCarver } from './DungeonCarver';\n";
    fs.writeFileSync('src/game/world/TerrainGenerator.ts', importString + newCode);
    console.log("Phase 4 successfully executed!");
} else {
    console.log("Could not find start or end index.");
}
