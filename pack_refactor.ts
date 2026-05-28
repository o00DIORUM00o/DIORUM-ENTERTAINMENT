import * as fs from 'fs';

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

// Replace applyStartingPack contents
const startPacks = playerCode.indexOf('    applyStartingPack(packName: string) {');
const endPacks = playerCode.indexOf('    learnSpell(inventoryIndex: number) {');

if (startPacks !== -1 && endPacks !== -1) {
    const newCode = `    applyStartingPack(packName: string) {
        this.inventory = new Array(80).fill(null);
        this.inventory[0] = { ...ITEMS['tent'] };
        this.inventory[1] = { ...ITEMS['dagger_1'] };

        const pack = STARTING_PACKS.find(p => p.name === packName);
        if (pack) {
            pack.apply(this);
        } else {
            // Default fallback
            this.inventory[2] = { ...ITEMS['sword_1'] };
            this.inventory[3] = { ...ITEMS['shovel_1'] };
        }
    }

`;
    let patched = playerCode.substring(0, startPacks) + newCode + playerCode.substring(endPacks);
    
    // add import to top
    patched = "import { STARTING_PACKS } from './content/packs/core_packs';\n" + patched;
    
    fs.writeFileSync('src/game/Player.ts', patched);
    console.log("Successfully patched Player.ts for Starting Packs");
} else {
    console.log("Could not find start/end for applyStartingPacks");
}
