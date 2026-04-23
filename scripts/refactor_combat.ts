import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/Player.ts");
let content = fs.readFileSync(file, "utf8");

const attackStartIdx = content.indexOf("// Attacking");
const dashStartIdx = content.indexOf("// Dash logic");

if (attackStartIdx !== -1 && dashStartIdx !== -1) {
    const combatContent = content.substring(attackStartIdx, dashStartIdx);
    
    let refactoredCombatContent = combatContent.replace(/this\./g, "player.");
    
    const combatWrapper = [
        "    static update(player: Player, ctx: UpdateContext) {",
        "        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;",
        refactoredCombatContent,
        "    }"
    ].join("\\n");

    let combatFilePath = path.resolve("src/game/player/PlayerCombat.ts");
    let baseCombatContent = fs.readFileSync(combatFilePath, "utf8");
    
    // Replace the empty static update method
    const targetEmptyUpdate = "static update(player: Player, ctx: UpdateContext) {\n        \n    }";
    const finalCombatFile = baseCombatContent.replace(targetEmptyUpdate, combatWrapper);
    
    fs.writeFileSync(combatFilePath, finalCombatFile);

    // Now remove it from Player.ts
    const replacement = "PlayerCombat.update(this, ctx);\\n\\n        ";
    const finalPlayerContent = content.substring(0, attackStartIdx) + replacement + content.substring(dashStartIdx);
    
    fs.writeFileSync(file, finalPlayerContent);

    console.log("Extracted PlayerCombat!");
}
