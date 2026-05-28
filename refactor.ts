import * as fs from 'fs';

const code = fs.readFileSync('src/App.tsx', 'utf8');

const regexConstants = /const RACES = (\[[\s\S]*?\]);\s*const RACE_COLORS: Record<string, string\[\]> = (\{[\s\S]*?\});\s*const DEITIES = (\[[\s\S]*?\]);/m;

// wait, HOMEWORLDS is before RACES
const startHomeworlds = code.indexOf('const HOMEWORLDS:');
const endDeities = code.indexOf('export default function App()');

if (startHomeworlds !== -1 && endDeities !== -1) {
    const extracted = code.substring(startHomeworlds, endDeities);
    
    const extractionCode = `
export ` + extracted.replace(/const /g, 'export const ');

    fs.writeFileSync('src/game/constants/CharacterCreation.ts', extractionCode);
    
    let newApp = code.substring(0, startHomeworlds) + "import { HOMEWORLDS, RACES, RACE_COLORS, DEITIES } from './game/constants/CharacterCreation';\n\n" + code.substring(endDeities);
    fs.writeFileSync('src/App.tsx', newApp);
    console.log("Successfully extracted character creation arrays out of App.tsx");
} else {
    console.log("Could not find start/end.");
}
