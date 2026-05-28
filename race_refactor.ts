import * as fs from 'fs';

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

const startRaces = playerCode.indexOf('    applyRacialBenefits(race: string) {');
const endRaces = playerCode.indexOf('    applyStartingPack(packName: string) {');

if (startRaces !== -1 && endRaces !== -1) {
    const newCode = `    applyRacialBenefits(raceName: string) {
        this.race = raceName;
        const race = RaceRegistry.get(raceName);
        if (race && race.startingTalents) {
            for (const [talent, bonus] of Object.entries(race.startingTalents)) {
                this.talents[talent] = (this.talents[talent] || 0) + bonus;
            }
        } else {
            // Default generic fallback
            this.talents['vitality'] = (this.talents['vitality'] || 0) + 2;
            this.talents['endurance'] = (this.talents['endurance'] || 0) + 1;
        }
    }

`;
    let patched = playerCode.substring(0, startRaces) + newCode + playerCode.substring(endRaces);
    
    // add import to top
    patched = "import { RaceRegistry } from './registries/RaceRegistry';\n" + patched;
    
    fs.writeFileSync('src/game/Player.ts', patched);
    console.log("Successfully patched Player.ts for Races");
} else {
    console.log("Could not find start/end for applyRacialBenefits");
}
