const fs = require('fs');

let inventoryStr = fs.readFileSync('src/game/Inventory.ts', 'utf8');

const matches = [...inventoryStr.matchAll(/'([a-zA-Z0-9_]+)':\s*\{([^}]*)\}/g)];

for (const match of matches) {
    const itemName = match[1];
    const itemBody = match[2];
    
    // Check if it should be stackable
    const isArmorWeapon = itemBody.includes("category: 'ARMOR'") || itemBody.includes("category: 'WEAPON'");
    const hasStack = itemBody.includes('maxStack') || itemBody.includes('stackable');
    
    if (!isArmorWeapon && !hasStack) {
        // inject stackable
        const newItemBody = itemBody + ', stackable: true, maxStack: 99';
        inventoryStr = inventoryStr.replace(match[0], "'" + itemName + "': {" + newItemBody + "}");
    }
}

fs.writeFileSync('src/game/Inventory.ts', inventoryStr);
console.log("Updated stackable items!");
