import * as fs from 'fs';

let code = fs.readFileSync('src/game/Engine.ts', 'utf8');

const importStr = "\nimport { defineRaces } from './registries/RaceRegistry';\nimport { CORE_RACES } from './content/races/core_races';\nimport { defineDeities } from './registries/DeityRegistry';\nimport { CORE_DEITIES } from './content/deities/core_deities';\nimport { defineStarSigns } from './registries/StarSignRegistry';\nimport { CORE_STAR_SIGNS } from './content/starsigns/core_starsigns';\n";

const defStr = "\ndefineRaces(CORE_RACES);\ndefineDeities(CORE_DEITIES);\ndefineStarSigns(CORE_STAR_SIGNS);\n";

code = code.replace(/defineCoreAbilities\(\);/, 'defineCoreAbilities();\n' + defStr);
code = code.replace(/import \{ defineCoreAbilities \} from '\.\/content\/abilities\/core_abilities';/, "import { defineCoreAbilities } from './content/abilities/core_abilities';\n" + importStr);

fs.writeFileSync('src/game/Engine.ts', code);
console.log("Successfully injected define calls into Engine.ts");
