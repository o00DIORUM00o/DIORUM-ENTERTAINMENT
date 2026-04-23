import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
const spawnerPath = path.resolve('./src/game/updaters/SpawnerUpdater.ts');

let updaterText = fs.readFileSync(updaterPath, 'utf8');
let spawnerText = fs.readFileSync(spawnerPath, 'utf8');

// Match Animal Spawning
const animalRegex = /\/\/ Animal Spawning Logic[\s\S]*?\} else if \(engine\.player\.z >= 14 && numPassive < 8\) \{ \/\/ Only on surface, max 8 passive animals[\s\S]*?\} \/\/ Loop\n                                \}\n                            \}\n                        \}\n                    \}\n                \}\n            \}\n        \}/;
// Actually matching that might be flaky.

// Wait, since Updater is getting smaller, let's just do a manual refactor of `Updater.ts`!
// It's much safer to replace strings carefully or just output what's left.
