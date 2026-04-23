import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
let text = fs.readFileSync(updaterPath, 'utf8');

if (!text.includes('EntityRegistry')) {
    text = `import { EntityRegistry } from './registries/EntityRegistry';\n` + text;
}

text = text.replace(/health: 500, maxHealth: 500/g, `health: EntityRegistry.get('villager').maxHealth, maxHealth: EntityRegistry.get('villager').maxHealth`);

text = text.replace(/health: 30, maxHealth: 30,\n\s*damage: 5/g, `health: EntityRegistry.get('giant_ant').maxHealth, maxHealth: EntityRegistry.get('giant_ant').maxHealth,\n                                damage: EntityRegistry.get('giant_ant').damage`);

text = text.replace(/health: 10, maxHealth: 10/g, `health: EntityRegistry.get('rat').maxHealth, maxHealth: EntityRegistry.get('rat').maxHealth`);

text = text.replace(/health: 40, maxHealth: 40,\n\s*damage: 15/g, `health: EntityRegistry.get('skeleton').maxHealth, maxHealth: EntityRegistry.get('skeleton').maxHealth,\n                                    damage: EntityRegistry.get('skeleton').damage`);

// Animals array replace
text = text.replace(/hp: 30, speed: 4.5, jump: 6, stamina: 60/g, `hp: EntityRegistry.get('deer').maxHealth, speed: 4.5, jump: 6, stamina: 60`);
text = text.replace(/hp: 20, speed: 3.0, jump: 5, stamina: 40/g, `hp: EntityRegistry.get('sheep').maxHealth, speed: 3.0, jump: 5, stamina: 40`);
text = text.replace(/hp: 50, speed: 6.0, jump: 7, stamina: 100/g, `hp: EntityRegistry.get('horse').maxHealth, speed: 6.0, jump: 7, stamina: 100`);
text = text.replace(/hp: 100, speed: 1.5, jump: 2, stamina: 30/g, `hp: EntityRegistry.get('turtle').maxHealth, speed: 1.5, jump: 2, stamina: 30`);
text = text.replace(/hp: 20, speed: 4.0, jump: 10, stamina: 50/g, `hp: EntityRegistry.get('giant_chicken').maxHealth, speed: 4.0, jump: 10, stamina: 50`);
text = text.replace(/hp: 30, speed: 3.0, jump: 12, stamina: 40/g, `hp: EntityRegistry.get('giant_frog').maxHealth, speed: 3.0, jump: 12, stamina: 40`);
text = text.replace(/hp: 40, speed: 4.0, jump: 4, stamina: 70/g, `hp: EntityRegistry.get('capybara').maxHealth, speed: 4.0, jump: 4, stamina: 70`);
text = text.replace(/hp: 60, speed: 7.0, jump: 9, stamina: 120/g, `hp: EntityRegistry.get('unicorn').maxHealth, speed: 7.0, jump: 9, stamina: 120`);
text = text.replace(/hp: 80, speed: 3.5, jump: 4, stamina: 80/g, `hp: EntityRegistry.get('bear').maxHealth, speed: 3.5, jump: 4, stamina: 80`);

text = text.replace(/health: 30 \* multiplier,\n\s*maxHealth: \(isShaman \? 20 : 30\) \* multiplier,\n\s*damage: \(isShaman \? 3 : 5\) \* multiplier/g, 
`health: (isShaman ? EntityRegistry.get('goblin_shaman').maxHealth : EntityRegistry.get('goblin').maxHealth) * multiplier,
                                                maxHealth: (isShaman ? EntityRegistry.get('goblin_shaman').maxHealth : EntityRegistry.get('goblin').maxHealth) * multiplier,
                                                damage: (isShaman ? EntityRegistry.get('goblin_shaman').damage : EntityRegistry.get('goblin').damage) * multiplier`);

text = text.replace(/health: 80 \* multiplier,\n\s*maxHealth: 80 \* multiplier,\n\s*damage: 20 \* multiplier/g,
`health: EntityRegistry.get('orc').maxHealth * multiplier,
                                                maxHealth: EntityRegistry.get('orc').maxHealth * multiplier,
                                                damage: EntityRegistry.get('orc').damage * multiplier`);

text = text.replace(/health: 150,\n\s*maxHealth: 150,\n\s*damage: 35/g,
`health: EntityRegistry.get('abyssal_knight').maxHealth,
                                            maxHealth: EntityRegistry.get('abyssal_knight').maxHealth,
                                            damage: EntityRegistry.get('abyssal_knight').damage`);

text = text.replace(/health: 40 \* multiplier,\n\s*maxHealth: 40 \* multiplier,\n\s*damage: 15 \* multiplier/g,
`health: EntityRegistry.get('skeleton').maxHealth * multiplier,
                                            maxHealth: EntityRegistry.get('skeleton').maxHealth * multiplier,
                                            damage: EntityRegistry.get('skeleton').damage * multiplier`);

fs.writeFileSync(updaterPath, text);

console.log('Fixed Updater.ts');
