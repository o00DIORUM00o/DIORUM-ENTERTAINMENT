import * as fs from 'fs';
import * as path from 'path';

const updaterPath = path.resolve('./src/game/Updater.ts');
let updaterText = fs.readFileSync(updaterPath, 'utf8');

const regex = /engine\.mechanismTimer \+= dt;[\s\S]*?engine\.world\.setBlock\(ebx, eby, ebz - 1, BlockType\.PRESSURE_PLATE_ACTIVE\);\n                \}\n            \}\n        \}/;

const extracted = `MechanismUpdater.update(engine, dt);`;

if (updaterText.match(regex)) {
    updaterText = updaterText.replace(regex, extracted);
    updaterText = "import { MechanismUpdater } from './updaters/MechanismUpdater';\n" + updaterText;
    fs.writeFileSync(updaterPath, updaterText);
    console.log("Mechanisms effectively refactored to MechanismUpdater.ts!");
} else {
    console.log("Could not find regex match for Mechanisms.");
}
