import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
let updaterText = fs.readFileSync(updaterPath, 'utf8');

const target = "EffectUpdater.update(engine, dt);";
const replacement = "ProjectileUpdater.update(engine, dt);\n        EffectUpdater.update(engine, dt);";

updaterText = updaterText.replace(target, replacement);

fs.writeFileSync(updaterPath, updaterText);
console.log("Re-added ProjectileUpdater");
