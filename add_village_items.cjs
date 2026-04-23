const fs = require('fs');

let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

// Add items
invCode = invCode.replace(/export const ITEMS\: Record\<string\, Item\> \= \{/g, 
`export const ITEMS: Record<string, Item> = {
    'village_bell': { id: 'village_bell', name: 'Village Bell', description: 'A resounding golden bell. Placing this will slowly attract villagers to the area to form a settlement.', category: 'MISC', maxStack: 10, quantity: 1 },`);

// Add merchant tables
invCode = invCode.replace(/export const MERCHANT_TABLES\: Record\<string\, MerchantLootTable\> \= \{/g, 
`export const MERCHANT_TABLES: Record<string, MerchantLootTable> = {
    'VILLAGER_MERCHANT': {
        guaranteed: [
            { itemToGive: { id: 'bread', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'torch', quantity: 10 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
        ],
        random: {
            rolls: 3,
            pool: [
                { listing: { itemToGive: { id: 'health_potion', quantity: 1 }, cost: [{ id: 'silver_piece', quantity: 2 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'leather', quantity: 5 }, cost: [{ id: 'silver_piece', quantity: 1 }] }, weight: 10 },
                { listing: { itemToGive: { id: 'iron_ingot', quantity: 3 }, cost: [{ id: 'silver_piece', quantity: 3 }] }, weight: 5 }
            ]
        }
    },
    'VILLAGER_FARMER': {
        guaranteed: [
            { itemToGive: { id: 'red_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 5 }] },
            { itemToGive: { id: 'blue_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            { itemToGive: { id: 'yellow_berry_seed', quantity: 5 }, cost: [{ id: 'copper_piece', quantity: 10 }] },
            // Buying things from player (giving player coins)
            { itemToGive: { id: 'copper_piece', quantity: 5 }, cost: [{ id: 'red_berry', quantity: 10 }] }
        ],
        random: {
            rolls: 2,
            pool: [
                { listing: { itemToGive: { id: 'black_berry_seed', quantity: 2 }, cost: [{ id: 'silver_piece', quantity: 1 }] }, weight: 5 },
                { listing: { itemToGive: { id: 'mushroom', quantity: 5 }, cost: [{ id: 'silver_piece', quantity: 1 }] }, weight: 10 }
            ]
        }
    },`);

fs.writeFileSync('src/game/Inventory.ts', invCode);

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');
playerCode = playerCode.replace(/if \(item\.id === 'alchemy_table' \|\| item\.id === 'slime_puddle'/g, 
`if (item.id === 'village_bell' || item.id === 'alchemy_table' || item.id === 'slime_puddle'`);

playerCode = playerCode.replace(/if \(item\.id === 'alchemy_table'\) blockToPlace = BlockType\.ALCHEMY_TABLE;/g, 
`if (item.id === 'alchemy_table') blockToPlace = BlockType.ALCHEMY_TABLE;
                        if (item.id === 'village_bell') blockToPlace = BlockType.VILLAGE_BELL;`);

playerCode = playerCode.replace(/} else if \(block === BlockType\.ALCHEMY_TABLE\) \{/g, 
`} else if (block === BlockType.VILLAGE_BELL) {
                                                    if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS['village_bell'] });
                                                } else if (block === BlockType.ALCHEMY_TABLE) {`);

playerCode = playerCode.replace(/\|\| block === BlockType\.ALCHEMY_TABLE \|\|/g, 
`|| block === BlockType.ALCHEMY_TABLE || block === BlockType.VILLAGE_BELL ||`);

playerCode = playerCode.replace(/\|\| currentBlock === BlockType\.ALCHEMY_TABLE \|\|/g, 
`|| currentBlock === BlockType.ALCHEMY_TABLE || currentBlock === BlockType.VILLAGE_BELL ||`);

playerCode = playerCode.replace(/} else if \(currentBlock === BlockType\.ALCHEMY_TABLE\) \{/g, 
`} else if (currentBlock === BlockType.VILLAGE_BELL) {
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS['village_bell'] });
                                } else if (currentBlock === BlockType.ALCHEMY_TABLE) {`);

// In giveStartingItems
playerCode = playerCode.replace(/this\.inventory\[9\] \= \{ \.\.\.ITEMS\['fire_vial'\], quantity\: 5 \};/g, 
`this.inventory[9] = { ...ITEMS['fire_vial'], quantity: 5 };
            this.inventory[10] = { ...ITEMS['village_bell'], quantity: 5 };`);

fs.writeFileSync('src/game/Player.ts', playerCode);

