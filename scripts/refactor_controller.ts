import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/Player.ts");
let content = fs.readFileSync(file, "utf8");

const dashStartIdx = content.indexOf("// Dash logic");
const quickSlotsStartIdx = content.indexOf("// Quick Slots Logic Placeholder");

if (dashStartIdx !== -1 && quickSlotsStartIdx !== -1) {
    const controllerContent = content.substring(dashStartIdx, quickSlotsStartIdx);
    
    let refactoredControllerContent = controllerContent.replace(/this\./g, "player.");
    
    const controllerWrapper = [
        "    static update(player: Player, ctx: UpdateContext) {",
        "        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;",
        refactoredControllerContent,
        "    }"
    ].join("\\n");

    let controllerFilePath = path.resolve("src/game/player/PlayerController.ts");
    let baseControllerContent = fs.readFileSync(controllerFilePath, "utf8");
    
    // Replace the empty static update method
    const targetEmptyUpdate = "static update(player: Player, ctx: UpdateContext) {\n        \n    }";
    const finalControllerFile = baseControllerContent.replace(targetEmptyUpdate, controllerWrapper);
    
    fs.writeFileSync(controllerFilePath, finalControllerFile);

    // Now remove it from Player.ts
    const replacement = "PlayerController.update(this, ctx);\\n\\n        ";
    const finalPlayerContent = content.substring(0, dashStartIdx) + replacement + content.substring(quickSlotsStartIdx);
    
    fs.writeFileSync(file, finalPlayerContent);

    console.log("Extracted PlayerController!");
}
