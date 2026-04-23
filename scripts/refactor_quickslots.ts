import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/Player.ts");
let content = fs.readFileSync(file, "utf8");

const quickSlotsStartIdx = content.indexOf("// Quick Slots Logic Placeholder");
const deathCheckStartIdx = content.indexOf("// Death check");

if (quickSlotsStartIdx !== -1 && deathCheckStartIdx !== -1) {
    const quickLogicContent = content.substring(quickSlotsStartIdx, deathCheckStartIdx);
    
    let refactoredQuickLogicContent = quickLogicContent.replace(/this\./g, "player.");
    
    const wrapper = [
        "    static updateQuickSlots(player: Player, ctx: UpdateContext) {",
        "        const { world, dx, dy, aimX, aimY, attacking, casting, interacting, jumping, jumpDown, dashing, quick1, quick2, quick3, dt, onHit, onShoot, onAoE, onCastSpell, onMelee, onDropItem, onOpenPortalMenu, onSaddleUse, onPlantBomb, onTriggerSecondary } = ctx;",
        refactoredQuickLogicContent,
        "    }"
    ].join("\\n");

    let inventoryFilePath = path.resolve("src/game/player/PlayerInventory.ts");
    let baseInventoryContent = fs.readFileSync(inventoryFilePath, "utf8");
    
    // Inject it into PlayerInventory
    const targetEmptyUpdate = "export class PlayerInventory {\n    // We will extract functions related to inventory here\n}";
    const finalInventoryFile = baseInventoryContent.replace(targetEmptyUpdate, "export class PlayerInventory {\\n" + wrapper + "\\n}");
    
    fs.writeFileSync(inventoryFilePath, finalInventoryFile);

    // Now remove it from Player.ts
    const replacement = "PlayerInventory.updateQuickSlots(this, ctx);\\n\\n        ";
    const finalPlayerContent = content.substring(0, quickSlotsStartIdx) + replacement + content.substring(deathCheckStartIdx);
    
    fs.writeFileSync(file, finalPlayerContent);

    console.log("Extracted QuickSlots!");
}
