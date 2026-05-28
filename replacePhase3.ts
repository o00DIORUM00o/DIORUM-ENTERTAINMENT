import * as fs from 'fs';

let code = fs.readFileSync('src/game/world/TerrainGenerator.ts', 'utf8');

const startIndex = code.indexOf('        // Phase 3: Crossroad Locations');
const endIndex = code.indexOf('        TerrainGenerator.applyDungeons(chunk);');

if (startIndex !== -1 && endIndex !== -1) {
    const newCode = code.substring(0, startIndex) +
`        // Phase 3: Crossroad Locations
        LotGenerator.generate(chunk, planetDef, PL_BASE_ELEV);
` + code.substring(endIndex);

    // Also import LotGenerator
    let importString = "import { LotGenerator } from './LotGenerator';\n";
    let finalCode = importString + newCode;
    
    fs.writeFileSync('src/game/world/TerrainGenerator.ts', finalCode);
    console.log("Replaced successfully!");
} else {
    console.log("Could not find start or end index.", startIndex, endIndex);
}
