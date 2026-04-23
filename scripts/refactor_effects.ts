import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
let updaterText = fs.readFileSync(updaterPath, 'utf8');

const regex = /\/\/ Update Cone effects[\s\S]*?vz: \(Math\.random\(\) - 0\.5\) \* 0\.5\n                \}\);\n            \}\n        \}/;

const extracted = `EffectUpdater.update(engine, dt);`;

if (updaterText.match(regex)) {
    updaterText = updaterText.replace(regex, extracted);
    updaterText = "import { EffectUpdater } from './updaters/EffectUpdater';\n" + updaterText;
    fs.writeFileSync(updaterPath, updaterText);
    console.log("Effects effectively refactored to EffectUpdater.ts!");
} else {
    console.log("Could not find regex match for Effects.");
}
