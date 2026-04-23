import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve('src/game/Updater.ts');
let content = fs.readFileSync(file, 'utf8');

// The block to replace
const targetStart = `            onTriggerSecondary: (ability: string, aimAngle: number, px: number, py: number, pz: number) => {`;
const targetEnd = `            onOpenPortalMenu: (color) => {
                if (engine.onOpenPortalMenu) {
                    engine.onOpenPortalMenu(color);
                }
            }
        });`;

const startIndex = content.indexOf(targetStart);
if (startIndex !== -1) {
    const endIndex = content.indexOf(targetEnd, startIndex);
    if (endIndex !== -1) {
        // extract the part before `engine.player.update({` to insert the callbacks properly
        const updateCallMatch = `        engine.player.update({
            world: engine.world,
            dx, dy, aimX: ax, aimY: ay,
            attacking: playerAttacking, casting, interacting, jumping, jumpDown, dashing,
            quick1, quick2, quick3, dt,
            
            onTriggerSecondary: (ability: string, aimAngle: number, px: number, py: number, pz: number) => {`;
            
        const replaceMatch = content.indexOf(updateCallMatch);

        if (replaceMatch !== -1) {
            const blockEnd = endIndex + targetEnd.length;

            const finalContent = content.substring(0, replaceMatch) +
`        const callbacks = PlayerActionCallbacks.getCallbacks(engine);
        engine.player.update({
            world: engine.world,
            dx, dy, aimX: ax, aimY: ay,
            attacking: playerAttacking, casting, interacting, jumping, jumpDown, dashing,
            quick1, quick2, quick3, dt,
            ...callbacks
        });` + content.substring(blockEnd);

            let newContent = "import { PlayerActionCallbacks } from './updaters/PlayerActionCallbacks';\n" + finalContent;
            
            fs.writeFileSync(file, newContent);
            console.log("Successfully refactored Player Actions block!");
        } else {
             console.log("Could not find the beginning of player update match.");
        }
    } else {
        console.log("Could not find end of target block.");
    }
} else {
    console.log("Could not find start of target block.");
}
