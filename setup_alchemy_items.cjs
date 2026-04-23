const fs = require('fs');

let invCode = fs.readFileSync('src/game/Inventory.ts', 'utf8');

invCode = invCode.replace(/export const ITEMS\: Record\<string, Item\> \= \{/,
`export const ITEMS: Record<string, Item> = {
    'alchemy_table': { id: 'alchemy_table', name: 'Alchemy Table', description: 'A mystical table used to brew potions from resources. Can be placed in the world.', category: 'MISC', maxStack: 10, quantity: 1 },
    'health_potion': { id: 'health_potion', name: 'Health Potion', description: 'A glowing red vial. Restores 100 health.', category: 'CONSUMABLE', maxStack: 10, quantity: 1, healing: 100 },
    'mana_potion': { id: 'mana_potion', name: 'Mana Potion', description: 'A vibrant blue vial. Restores 100 mana.', category: 'CONSUMABLE', maxStack: 10, quantity: 1 },
    'swiftness_potion': { id: 'swiftness_potion', name: 'Potion of Swiftness', description: 'A frothy yellow brew. Grants incredible speed for 60 seconds.', category: 'CONSUMABLE', maxStack: 10, quantity: 1 },
    'fire_vial': { id: 'fire_vial', name: 'Vial of Liquid Fire', description: 'A dangerous volatile vial. Explodes upon use.', category: 'CONSUMABLE', maxStack: 10, quantity: 1 },
    'alchemy_table_recipe_scroll': { id: 'alchemy_table_recipe_scroll', name: 'Recipe: Alchemy Table', description: 'Learn to build an Alchemy Table. Requires Carpentry Level 2.', category: 'CONSUMABLE', maxStack: 1, quantity: 1 },`);

fs.writeFileSync('src/game/Inventory.ts', invCode);

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

// Adding block logic
playerCode = playerCode.replace(/if \(item\.id === 'slime_puddle' \|\| item\.id === 'spider_web' \|\| item\.id === 'demon_portal' \|\| item\.id === 'tent' \|\| item\.id === 'wood'/,
`if (item.id === 'alchemy_table' || item.id === 'slime_puddle' || item.id === 'spider_web' || item.id === 'demon_portal' || item.id === 'tent' || item.id === 'wood'`);

playerCode = playerCode.replace(/if \(item\.id === 'demon_portal'\) blockToPlace = BlockType\.DEMON_PORTAL;/,
`if (item.id === 'demon_portal') blockToPlace = BlockType.DEMON_PORTAL;
                        if (item.id === 'alchemy_table') blockToPlace = BlockType.ALCHEMY_TABLE;`);

// Consuming logic
// Around `if (item.healing)` or mana restoration
playerCode = playerCode.replace(/} else if \((item\.id === 'blue_berry')/g,
`} else if (item.id === 'health_potion') {
                        this.health = Math.min(this.maxHealth, this.health + (item.healing || 100));
                        engine.particles.push({x: this.x, y: this.y, z: this.z + 1.5, text: '+100 HP', color: '#ff4444', life: 1.0, maxLife: 1.0, vy: -1, speed: 0});
                    } else if (item.id === 'mana_potion') {
                        this.mana = Math.min(this.maxMana, this.mana + 100);
                        engine.particles.push({x: this.x, y: this.y, z: this.z + 1.5, text: '+100 MP', color: '#4444ff', life: 1.0, maxLife: 1.0, vy: -1, speed: 0});
                    } else if (item.id === 'swiftness_potion') {
                        this.buffs.speed = 60.0;
                        engine.particles.push({x: this.x, y: this.y, z: this.z + 1.5, text: 'SPEED UP!', color: '#ffff44', life: 1.0, maxLife: 1.0, vy: -1, speed: 0});
                    } else if (item.id === 'fire_vial') {
                        // Cast an exploding rune out in front
                        engine.entities.push({
                            id: Math.random().toString(36).substr(2, 9),
                            type: 'exploding_rune',
                            x: Math.floor(this.x + Math.cos(this.aimAngle) * 3) + 0.5,
                            y: Math.floor(this.y + Math.sin(this.aimAngle) * 3) + 0.5,
                            z: this.z,
                            hp: 1, maxHp: 1, state: 'idle', timer: 0, friendly: true, lifeTime: 300
                        });
                        engine.particles.push({x: this.x, y: this.y, z: this.z + 1.5, text: 'FIRE IN THE HOLE!', color: '#ff8800', life: 1.0, maxLife: 1.0, vy: -1, speed: 0});
                    } else if ($1`);

// In giveStartingItems
playerCode = playerCode.replace(/this\.inventory\[4\] \= \{ \.\.\.ITEMS\['demon_portal'\], quantity\: 5 \};/,
`this.inventory[4] = { ...ITEMS['demon_portal'], quantity: 5 };
            this.inventory[5] = { ...ITEMS['alchemy_table'] };
            this.inventory[6] = { ...ITEMS['health_potion'], quantity: 5 };
            this.inventory[7] = { ...ITEMS['mana_potion'], quantity: 5 };
            this.inventory[8] = { ...ITEMS['swiftness_potion'], quantity: 5 };
            this.inventory[9] = { ...ITEMS['fire_vial'], quantity: 5 };`);


fs.writeFileSync('src/game/Player.ts', playerCode);
