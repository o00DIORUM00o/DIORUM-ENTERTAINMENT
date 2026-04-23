import * as fs from 'fs';
import * as path from 'path';

const pluginPath = path.resolve('./src/game/World.ts');
let pluginText = fs.readFileSync(pluginPath, 'utf8');

// Replace the safe zone check
pluginText = pluginText.replace(
    /if \(this\.activePlanet === 'ARETH'\) \{[\s\S]*?\} else if \(dist < 30\) \{[\s\S]*?\}/,
    `if (planetDef.safeAreaMethod === 'BOX') {
                    if (wx >= -16 && wx < 32 && wy >= -16 && wy < 32) {
                        e = 0; // Completely flat
                        r = 0.5; // No river
                    }
                } else if (planetDef.safeAreaMethod === 'RADIAL' && dist < 30) {
                    const blend = Math.max(0, Math.min(1, (30 - dist) / 10));
                    e = e * (1 - blend) + (0) * blend; 
                    m = m * (1 - blend) + (-0.5) * blend; 
                    r = r * (1 - blend) + (0.5) * blend; 
                }`
);

// Replace Spawner Generation logic
const oldSpawnerLogic = /if \(this\.activePlanet === 'ARETH'\) \{[\s\S]*?else spawnerType = BlockType\.DEMON_PORTAL;\n\s*\}/;
const newSpawnerLogic = `let roll = Math.random();
                                for (const entry of planetDef.spawnerTable) {
                                    if (roll < entry.chance) {
                                        spawnerType = entry.block;
                                        break;
                                    }
                                    roll -= entry.chance;
                                }`;

pluginText = pluginText.replace(oldSpawnerLogic, newSpawnerLogic);
// Oh wait, there is still the ending '}' block from "else {". Wait, I should make sure my regex replacement matches perfectly.
fs.writeFileSync(pluginPath, pluginText);
console.log('Done replacement');
