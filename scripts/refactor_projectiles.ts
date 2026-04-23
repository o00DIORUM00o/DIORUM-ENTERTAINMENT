import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
let updaterText = fs.readFileSync(updaterPath, 'utf8');

const regex = /\/\/ Update projectiles[\s\S]*?removeFromArray\(engine\.projectiles, i\);\n                \}\n            \}\n        \}/;

const extracted = `ProjectileUpdater.update(engine, dt);`;

if (updaterText.match(regex)) {
    updaterText = updaterText.replace(regex, extracted);
    updaterText = "import { ProjectileUpdater } from './updaters/ProjectileUpdater';\n" + updaterText;
    fs.writeFileSync(updaterPath, updaterText);
    console.log("Projectiles effectively refactored to ProjectileUpdater.ts!");
} else {
    console.log("Could not find regex match.");
}
