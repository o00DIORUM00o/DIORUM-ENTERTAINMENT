import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/Player.ts");
let content = fs.readFileSync(file, "utf8");

const methods = [
    "learnSpell", "addXp", "upgradeTalent", "addToInventory", "hasItem", 
    "removeItem", "isNearStation", "craftRecipe", "equipItem", "unequipItem", "getDefense"
];

let inventoryContent = fs.readFileSync(path.resolve("src/game/player/PlayerInventory.ts"), "utf8");

for (const method of methods) {
    const fnRegex = new RegExp("\\n    " + method + "\\\\((.*?)\\\\)(: (.*?))? {([\\\\s\\\\S]*?)\\n    }(?=\\n    \\\\w)");
    const match = content.match(fnRegex);
    if (match) {
        let fnBody = match[4];
        const params = match[1];
        const retType = match[3] ? ": " + match[3] : "";
        
        let newParams = params ? "player: Player, " + params : "player: Player";
        let newBody = fnBody.replace(/this\./g, "player.");

        const inventoryMethod = "\\n    static " + method + "(" + newParams + ")" + retType + " {" + newBody + "\\n    }";
        
        // Add before last }
        inventoryContent = inventoryContent.replace(/\n\}$/, inventoryMethod + "\n}");

        // Replace in Player.ts to delegate
        const paramNames = params.split(',').map(p => p.split(':')[0].trim()).filter(Boolean);
        const argsStr = paramNames.length > 0 ? "this, " + paramNames.join(', ') : 'this';
        let returnStr = (retType && retType !== ': void') || method.includes('Item') || method.includes('craft') || method.includes('upgrade') || method.includes('learn') ? 'return ' : '';
        if (method === 'addXp') returnStr = '';
        
        const delegateBody = "\\n    " + method + "(" + params + ")" + retType + " {\\n        " + returnStr + "PlayerInventory." + method + "(" + argsStr + ");\\n    }";
        content = content.replace(match[0], delegateBody);
    }
}

// ensure PlayerInventory imports TALENTS and audioEngine if needed
if (!inventoryContent.includes("import { TALENTS }")) {
    inventoryContent = "import { TALENTS } from '../Talents';\n" + inventoryContent;
}
if (!inventoryContent.includes("import { audioEngine }")) {
    inventoryContent = "import { audioEngine } from '../AudioEngine';\n" + inventoryContent;
}

fs.writeFileSync(path.resolve("src/game/player/PlayerInventory.ts"), inventoryContent);
fs.writeFileSync(file, content);

console.log("Refactored Inventory methods!");
