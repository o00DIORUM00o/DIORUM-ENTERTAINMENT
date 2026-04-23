const fs = require('fs');

let playerCode = fs.readFileSync('src/game/Player.ts', 'utf8');

// For breakable blocks array inclusion
playerCode = playerCode.replace(/block \=\=\= BlockType\.VILLAGE_BELL/g, `(block >= BlockType.VILLAGE_BELL && block <= BlockType.BLACK_BELL)`);
// For the actual breaking process
playerCode = playerCode.replace(/\} else if \(block \=\=\= BlockType\.VILLAGE_BELL\) \{\n\s*if \(onDropItem\) onDropItem\(bx\, by\, pZ\, \{ \.\.\.ITEMS\[\'village_bell\'\] \}\)\;/g,
`} else if (block >= BlockType.VILLAGE_BELL && block <= BlockType.BLACK_BELL) {
                                                const bellIds = {
                                                    [BlockType.VILLAGE_BELL]: 'village_bell',
                                                    [BlockType.COPPER_BELL]: 'copper_bell',
                                                    [BlockType.IRON_BELL]: 'iron_bell',
                                                    [BlockType.GREEN_BELL]: 'green_bell',
                                                    [BlockType.RED_BELL]: 'red_bell',
                                                    [BlockType.MITHRIL_BELL]: 'mithril_bell',
                                                    [BlockType.BLACK_BELL]: 'black_bell'
                                                };
                                                if (onDropItem) onDropItem(bx, by, pZ, { ...ITEMS[bellIds[block] as keyof typeof ITEMS] });`);

// Block placement handling
playerCode = playerCode.replace(/if \(item\.id \=\=\= \'village_bell\'\) blockToPlace \= BlockType\.VILLAGE_BELL\;/g,
`if (item.id === 'village_bell') blockToPlace = BlockType.VILLAGE_BELL;
                        if (item.id === 'copper_bell') blockToPlace = BlockType.COPPER_BELL;
                        if (item.id === 'iron_bell') blockToPlace = BlockType.IRON_BELL;
                        if (item.id === 'green_bell') blockToPlace = BlockType.GREEN_BELL;
                        if (item.id === 'red_bell') blockToPlace = BlockType.RED_BELL;
                        if (item.id === 'mithril_bell') blockToPlace = BlockType.MITHRIL_BELL;
                        if (item.id === 'black_bell') blockToPlace = BlockType.BLACK_BELL;`);

// Creative mode / manual placement drops
playerCode = playerCode.replace(/\} else if \(currentBlock \=\=\= BlockType\.VILLAGE_BELL\) \{\n\s*onDropItem\(targetX\, targetY\, placeZ\, \{ \.\.\.ITEMS\[\'village_bell\'\] \}\)\;/g,
`} else if (currentBlock >= BlockType.VILLAGE_BELL && currentBlock <= BlockType.BLACK_BELL) {
                                    const bellIds = {
                                        [BlockType.VILLAGE_BELL]: 'village_bell',
                                        [BlockType.COPPER_BELL]: 'copper_bell',
                                        [BlockType.IRON_BELL]: 'iron_bell',
                                        [BlockType.GREEN_BELL]: 'green_bell',
                                        [BlockType.RED_BELL]: 'red_bell',
                                        [BlockType.MITHRIL_BELL]: 'mithril_bell',
                                        [BlockType.BLACK_BELL]: 'black_bell'
                                    };
                                    onDropItem(targetX, targetY, placeZ, { ...ITEMS[bellIds[currentBlock] as keyof typeof ITEMS] });`);

fs.writeFileSync('src/game/Player.ts', playerCode);

// Updater
let updaterCode = `import type { Engine } from '../Engine';
import { BlockType } from '../World';

export class VillagerUpdater {
    static updateAll(engine: Engine, dt: number) {
        // Run every ~2 seconds
        engine.villageTimer = (engine.villageTimer || 0) + dt;
        if (engine.villageTimer < 2.0) return;
        engine.villageTimer = 0;

        const maxVillagersPerBell = 3;
        const px = Math.floor(engine.player.x);
        const py = Math.floor(engine.player.y);
        const pz = Math.floor(engine.player.z);
        const scanRadius = 24;
        
        const villagers = engine.npcs.filter(n => n.type === 'VILLAGER');

        const BELLS = [
            BlockType.COPPER_BELL, 
            BlockType.VILLAGE_BELL, 
            BlockType.IRON_BELL,
            BlockType.GREEN_BELL, 
            BlockType.RED_BELL, 
            BlockType.MITHRIL_BELL, 
            BlockType.BLACK_BELL
        ];

        for (let x = px - scanRadius; x <= px + scanRadius; x++) {
            for (let y = py - scanRadius; y <= py + scanRadius; y++) {
                for (let z = pz - 8; z <= pz + 8; z++) {
                    const block = engine.world.getBlock(x, y, z);
                    
                    if (BELLS.includes(block)) {
                        let nearCount = 0;
                        for (const v of villagers) {
                            if (Math.hypot(v.x - x, v.y - y) <= 16) {
                                nearCount++;
                            }
                        }

                        if (nearCount < maxVillagersPerBell && Math.random() < 0.2) {
                            this.spawnVillager(engine, x, y, z, block);
                        }
                    }
                }
            }
        }
    }

    static spawnVillager(engine: Engine, x: number, y: number, z: number, bellBlock: number) {
        let professions: string[] = [];
        let hp = 50;
        
        switch (bellBlock) {
            case BlockType.COPPER_BELL: 
                professions = ['VILLAGER_COMMONER', 'VILLAGER_BEGGAR', 'VILLAGER_THIEF']; 
                break;
            case BlockType.VILLAGE_BELL: 
                professions = ['VILLAGER_COMMONER', 'VILLAGER_FARMER', 'VILLAGER_MERCHANT']; 
                break;
            case BlockType.IRON_BELL: 
                professions = ['VILLAGER_COMMONER', 'VILLAGER_GUARD', 'VILLAGER_SMITH']; 
                hp = 100;
                break;
            case BlockType.GREEN_BELL: 
                professions = ['VILLAGER_WIZARD', 'VILLAGER_ALCHEMIST', 'VILLAGER_PRIEST']; 
                hp = 80;
                break;
            case BlockType.RED_BELL: 
                professions = ['VILLAGER_BOUNTY_HUNTER', 'VILLAGER_GLADIATOR', 'VILLAGER_ENCHANTER']; 
                hp = 150;
                break;
            case BlockType.MITHRIL_BELL: 
                professions = ['VILLAGER_KNIGHT', 'VILLAGER_NOBLE', 'VILLAGER_COUNCILOR']; 
                hp = 200;
                break;
            case BlockType.BLACK_BELL: 
                professions = ['VILLAGER_NECROMANCER', 'VILLAGER_JESTER', 'VILLAGER_SHAMAN']; 
                hp = 120;
                break;
            default:
                professions = ['VILLAGER_COMMONER'];
                break;
        }

        const prof = professions[Math.floor(Math.random() * professions.length)];
        const tx = x + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
        const ty = y + (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
        
        if (engine.world.getBlock(Math.floor(tx), Math.floor(ty), z) !== BlockType.AIR) return;

        let merchantType = undefined;
        if (['VILLAGER_MERCHANT', 'VILLAGER_FARMER', 'VILLAGER_SMITH', 'VILLAGER_ALCHEMIST', 'VILLAGER_ENCHANTER', 'VILLAGER_SHAMAN', 'VILLAGER_PRIEST', 'VILLAGER_THIEF'].includes(prof)) {
            merchantType = prof; // Many of these will have trade inventories in Phase 3
        }

        engine.npcs.push({
            id: 'villager_' + Math.random().toString(36).substr(2, 9),
            x: tx,
            y: ty,
            z: z,
            vx: 0, vy: 0, vz: 0,
            health: hp,
            maxHealth: hp,
            type: 'VILLAGER',
            state: 'IDLE',
            disposition: 50,
            aimAngle: 0,
            attackTimer: 0,
            attackCooldown: 0,
            merchantType: merchantType,
            tradeInventory: [],
            lastRestockDay: -1, 
            homeX: x,
            homeY: y,
            homeZ: z,
            profession: prof
        });
        
        for (let i = 0; i < 15; i++) {
            engine.particles.push({
                x: tx, y: ty, z: z + 1, text: '', color: (bellBlock === BlockType.BLACK_BELL ? '#8800ff' : '#ffd700'), life: 1, maxLife: 1,
                vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, vz: Math.random() * 2, speed: 0
            });
        }
    }
}
`;
fs.writeFileSync('src/game/updaters/VillagerUpdater.ts', updaterCode);

let rCode = fs.readFileSync('src/game/Renderer.ts', 'utf8');
rCode = rCode.replace(/\} else if \(block \=\=\= BlockType\.VILLAGE_BELL\) \{\n\s*\/\/ Wood posts/g,
`} else if (block >= BlockType.VILLAGE_BELL && block <= BlockType.BLACK_BELL) {
                    // Wood posts (same across all bells)`);

rCode = rCode.replace(/\/\/ The Bell\n\s*ctx\.fillStyle \= \`rgba\(255\, 215\, 0\, \$\{shade\}\)\`\; \/\/ Gold\n\s*ctx\.beginPath\(\)\;\n\s*ctx\.arc\(screenX \+ TILE_SIZE \* 0\.5\, screenY \+ TILE_SIZE \* 0\.5\, TILE_SIZE \* 0\.3\, Math\.PI\, 0\)\;\n\s*ctx\.fill\(\)\;/g,
`// The Bell
                    let r = 255, g = 215, b = 0; // Gold default context
                    if (block === BlockType.COPPER_BELL) { r = 184; g = 115; b = 51; }
                    else if (block === BlockType.IRON_BELL) { r = 169; g = 169; b = 169; }
                    else if (block === BlockType.GREEN_BELL) { r = 46; g = 139; b = 87; }
                    else if (block === BlockType.RED_BELL) { r = 178; g = 34; b = 34; }
                    else if (block === BlockType.MITHRIL_BELL) { r = 192; g = 192; b = 255; }
                    else if (block === BlockType.BLACK_BELL) { r = 20; g = 20; b: 30; }
                    
                    ctx.fillStyle = \`rgba(\${r}, \${g}, \${b}, \${shade})\`;
                    ctx.beginPath();
                    ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.3, Math.PI, 0);
                    ctx.fill();`);
fs.writeFileSync('src/game/Renderer.ts', rCode);
