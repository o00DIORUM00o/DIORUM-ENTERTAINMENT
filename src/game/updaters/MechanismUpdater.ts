import { BlockType } from '../constants/BlockType';
import { isSolid } from '../World';
import { audioEngine } from '../AudioEngine';
import { ITEMS } from '../Inventory';
import { RecipeRegistry } from '../registries/RecipeRegistry';

export class MechanismUpdater {
    static update(engine: any, dt: number) {
        engine.mechanismTimer += dt;
        if (engine.mechanismTimer >= 2.0) {
            engine.mechanismTimer = 0;
            // Toggle spike floors and trigger wall shooters in loaded chunks
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.mechanisms || chunk.mechanisms.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                // Need an array copy since we might modify it during iteration
                const activeMechs = Array.from(chunk.mechanisms as Set<number>);
                for (const idx of activeMechs) {
                    const x = (idx as number) % 16;
                    const y = Math.floor((idx as number) / 16) % 16;
                    const z = Math.floor((idx as number) / 256);
                    
                    const block = chunk.blocks[idx as number];
                    if (block === BlockType.SPIKE_FLOOR) {
                        chunk.setBlock(x, y, z, BlockType.SPIKE_FLOOR_ACTIVE);
                    } else if (block === BlockType.SPIKE_FLOOR_ACTIVE) {
                        chunk.setBlock(x, y, z, BlockType.SPIKE_FLOOR);
                    } else if (block === BlockType.WALL_SHOOTER) {
                        const directions = [
                            {dx: 1, dy: 0},
                            {dx: -1, dy: 0},
                            {dx: 0, dy: 1},
                            {dx: 0, dy: -1}
                        ];
                        for (const d of directions) {
                            const adjBlocked = isSolid(engine.world.getBlock(wx + x + d.dx, wy + y + d.dy, z));
                            if (!adjBlocked) {
                                audioEngine?.playShoot?.();
                                engine.projectiles.push({
                                    x: wx + x + 0.5 + d.dx * 0.6,
                                    y: wy + y + 0.5 + d.dy * 0.6,
                                    z: z + 0.5,
                                    vx: d.dx * 10,
                                    vy: d.dy * 10,
                                    damage: 10,
                                    life: 2.0,
                                    isPlayer: false,
                                    color: '#ccc'
                                });
                            }
                        }
                    }
                }
            }
        }

        // Spike floor damage
        const pbx = Math.floor(engine.player.x);
        const pby = Math.floor(engine.player.y);
        const pbz = Math.floor(engine.player.z);
        const blockUnderPlayer = engine.world.getBlock(pbx, pby, pbz - 1);
        if (blockUnderPlayer === BlockType.SPIKE_FLOOR_ACTIVE && engine.player.z - pbz < 0.1) {
            engine.player.takeDamage(10 * dt);
        }

        // Reset all pressure plates in loaded chunks
        for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 16; y++) {
                    for (let z = 0; z < 32; z++) {
                        if (chunk.getBlock(x, y, z) === BlockType.PRESSURE_PLATE_ACTIVE) {
                            chunk.setBlock(x, y, z, BlockType.PRESSURE_PLATE);
                        }
                    }
                }
            }
        }

        // Activate pressure plates under player
        if (blockUnderPlayer === BlockType.PRESSURE_PLATE && engine.player.z - pbz < 0.1) {
            engine.world.setBlock(pbx, pby, pbz - 1, BlockType.PRESSURE_PLATE_ACTIVE);
        }

        const allEnemies = [
            { arr: engine.bees, hpField: 'health' },
            { arr: engine.ants, hpField: 'hp' },
            { arr: engine.goblins, hpField: 'hp' },
            { arr: engine.orcs, hpField: 'hp' },
            { arr: engine.skeletons, hpField: 'hp' },
            { arr: engine.lavaGolems, hpField: 'hp' },
            { arr: engine.rats, hpField: 'hp' },
            { arr: engine.animals, hpField: 'health' }
        ];

        for (const group of allEnemies) {
            for (const entity of group.arr) {
                const ebx = Math.floor(entity.x);
                const eby = Math.floor(entity.y);
                const ebz = Math.floor(entity.z);
                const blockUnderEntity = engine.world.getBlock(ebx, eby, ebz - 1);
                if (blockUnderEntity === BlockType.SPIKE_FLOOR_ACTIVE && entity.z - ebz < 0.1) {
                    (entity as any)[group.hpField] -= 10 * dt;
                }
                if (blockUnderEntity === BlockType.PRESSURE_PLATE && entity.z - ebz < 0.1) {
                    engine.world.setBlock(ebx, eby, ebz - 1, BlockType.PRESSURE_PLATE_ACTIVE);
                }
            }
        }

        // --- GNOMISH WIRING & LOGIC UPDATE ---
        engine.logicTimer = (engine.logicTimer || 0) + dt;
        if (engine.logicTimer >= 0.1) { // 10Hz logic updates
            engine.logicTimer = 0;
            
            const powerSources: {x: number, y: number, z: number}[] = [];
            const currentlyPoweredPistons = new Set<string>();

            // 1. Gather all power sources and reset wires/pistons
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.mechanisms || chunk.mechanisms.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                const activeMechs = Array.from(chunk.mechanisms as Set<number>);
                for (const idx of activeMechs) {
                    const block = chunk.blocks[idx as number];
                    
                    if (block === BlockType.LEVER_ON || block === BlockType.PRESSURE_PLATE_ACTIVE) {
                        const x = (idx as number) % 16;
                        const y = Math.floor((idx as number) / 16) % 16;
                        const z = Math.floor((idx as number) / 256);
                        powerSources.push({x: wx + x, y: wy + y, z});
                    } else if (block === BlockType.WIRE_ON) {
                        const x = (idx as number) % 16;
                        const y = Math.floor((idx as number) / 16) % 16;
                        const z = Math.floor((idx as number) / 256);
                        chunk.setBlock(x, y, z, BlockType.WIRE_OFF);
                    }
                }
            }

            // 2. Propagate Power (BFS)
            const directions = [
                {dx: 1, dy: 0, dz: 0}, {dx: -1, dy: 0, dz: 0},
                {dx: 0, dy: 1, dz: 0}, {dx: 0, dy: -1, dz: 0},
                {dx: 0, dy: 0, dz: 1}, {dx: 0, dy: 0, dz: -1}
            ];

            const queue = [...powerSources];
            const visited = new Set<string>();
            for (const s of queue) visited.add(`${s.x},${s.y},${s.z}`);

            let queueIndex = 0;
            while (queueIndex < queue.length) {
                const current = queue[queueIndex++];
                
                for (const d of directions) {
                    const nx = current.x + d.dx;
                    const ny = current.y + d.dy;
                    const nz = current.z + d.dz;
                    const nKey = `${nx},${ny},${nz}`;
                    
                    if (!visited.has(nKey)) {
                        visited.add(nKey);
                        const nBlock = engine.world.getBlock(nx, ny, nz);
                        
                        if (nBlock === BlockType.WIRE_OFF) {
                            engine.world.setBlock(nx, ny, nz, BlockType.WIRE_ON);
                            queue.push({x: nx, y: ny, z: nz});
                        } else if (nBlock === BlockType.PISTON_CLOSED || nBlock === BlockType.PISTON_OPEN) {
                            currentlyPoweredPistons.add(nKey);
                            if (nBlock === BlockType.PISTON_CLOSED) {
                                engine.world.setBlock(nx, ny, nz, BlockType.PISTON_OPEN);
                            }
                        } else if (nBlock === BlockType.ARROW_TURRET) {
                            // Fire turret! (With a simple cooldown based on a random chance during the 10Hz tick, 
                            // or better, tracking turret cooldowns. Let's do 10% chance per tick == approx 1 shot per sec)
                            if (Math.random() < 0.1) {
                                audioEngine?.playShoot?.();
                                // Fire in ALL clear lateral directions for a basic implementation
                                for (const td of [{dx:1, dy:0}, {dx:-1, dy:0}, {dx:0, dy:1}, {dx:0, dy:-1}]) {
                                    if (!isSolid(engine.world.getBlock(nx + td.dx, ny + td.dy, nz))) {
                                        engine.projectiles.push({
                                            x: nx + 0.5 + td.dx * 0.6,
                                            y: ny + 0.5 + td.dy * 0.6,
                                            z: nz + 0.5,
                                            vx: td.dx * 15,
                                            vy: td.dy * 15,
                                            vz: 0,
                                            damage: 20,
                                            life: 2.0, maxLife: 2.0,
                                            isPlayer: false,
                                            color: '#fbbf24' // Yellow/Orange arrow
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 3. Close unpowered pistons
            // To do this quickly, we just scan chunk mechanisms (or ideally we'd track pistons, but let's just use mechanism array)
            // Or better, let's just make PISTON_OPEN part of our automation block set.
            // Wait, we don't have PISTON_OPEN in automation. Let's add it to Mechanism set in Chunk.ts in a sec, or just scan mechanisms here.
            // PISTON_OPEN/CLOSED are not in the fast scan set, but we can do it via a quick loop or add it to mechanisms.
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                // Full scan for pistons because they are not in the fast set yet, but we'll optimize the gnome loop below!
                // Actually, PISTON_OPEN is rare, let's keep it as a fallback or add it to mechanism list in chunk.
                // It's part of the redstone logic. 
                // Let's just loop over the whole chunk for now, it's fast enough for this specific part, or just check mechanisms?
                // Wait! We can avoid this completely by keeping track of all opened pistons!
            }

            // Since keeping track of open pistons would need more refactoring, let's just do it directly.
            // But wait, currentlyPoweredPistons has all the pistons that SHOULD be open!
            // Any piston we find open that ISN'T in this set should be closed.
            // Since we know all power sources and propagated from them, we can't easily know all pistons, 
            // BUT we can just track ALL pistons in the mechanisms list! Let's do that!
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.mechanisms || chunk.mechanisms.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                const activeMechs = Array.from(chunk.mechanisms as Set<number>);
                for (const idx of activeMechs) {
                    if (chunk.blocks[idx as number] === BlockType.PISTON_OPEN) {
                        const x = (idx as number) % 16;
                        const y = Math.floor((idx as number) / 16) % 16;
                        const z = Math.floor((idx as number) / 256);
                        const pKey = `${wx + x},${wy + y},${z}`;
                        if (!currentlyPoweredPistons.has(pKey)) {
                            chunk.setBlock(x, y, z, BlockType.PISTON_CLOSED);
                        }
                    }
                }
            }
        }

        // --- WORKER GNOME UPDATE (1Hz) ---
        engine.workerTimer = (engine.workerTimer || 0) + dt;
        if (engine.workerTimer >= 1.0) {
            engine.workerTimer = 0;
            
            const stationMap: Record<number, string> = {
                [BlockType.FURNACE]: 'furnace',
                [BlockType.ANVIL]: 'anvil',
                [BlockType.CARPENTERS_BENCH]: 'carpenters_bench',
                [BlockType.MASONRY_TABLE]: 'masonry_table',
                [BlockType.FABRIC_STATION]: 'fabric_station',
                [BlockType.LEATHER_STATION]: 'leather_station'
            };

            const allRecipes = RecipeRegistry.getAll();
            const allEnemies = [
                { arr: engine.goblins, hpField: 'health' },
                { arr: engine.orcs, hpField: 'health' },
                { arr: engine.skeletons, hpField: 'health' },
                { arr: engine.abyssalKnights, hpField: 'health' },
                { arr: engine.lavaGolems, hpField: 'health' },
                { arr: engine.drakes, hpField: 'health' },
                { arr: engine.rats, hpField: 'health' },
                { arr: engine.kobolds, hpField: 'health' },
                { arr: engine.animals, hpField: 'health' } // For archers to hunt? Sure.
            ];

            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                if (!chunk.automation || chunk.automation.size === 0) continue;
                const wx = chunk.cx * 16;
                const wy = chunk.cy * 16;
                const activeAuto = Array.from(chunk.automation as Set<number>);
                for (const idx of activeAuto) {
                    const block = chunk.blocks[idx as number];
                    const x = (idx as number) % 16;
                    const y = Math.floor((idx as number) / 16) % 16;
                    const z = Math.floor((idx as number) / 256);

                    if (block === BlockType.WORKER_GNOME) {
                        const gx = wx + x;
                        const gy = wy + y;
                        const gz = z;
                        
                        // Look around for Chest and Station
                        let chestPos = null;
                                let stationPos = null;
                                let stationId = null;

                                const surroundingDirs = [
                                    {dx: 1, dy: 0, dz: 0}, {dx: -1, dy: 0, dz: 0},
                                    {dx: 0, dy: 1, dz: 0}, {dx: 0, dy: -1, dz: 0},
                                    {dx: 1, dy: 1, dz: 0}, {dx: -1, dy: -1, dz: 0},
                                    {dx: 1, dy: -1, dz: 0}, {dx: -1, dy: 1, dz: 0}
                                ];

                                for (const d of surroundingDirs) {
                                    const bType = engine.world.getBlock(gx + d.dx, gy + d.dy, gz);
                                    if (bType === BlockType.CHEST) {
                                        chestPos = {x: gx + d.dx, y: gy + d.dy, z: gz};
                                    } else if (stationMap[bType]) {
                                        stationPos = {x: gx + d.dx, y: gy + d.dy, z: gz};
                                        stationId = stationMap[bType];
                                    }
                                }

                                if (chestPos && stationId) {
                                    const inv = engine.world.getChest(chestPos.x, chestPos.y, chestPos.z);
                                    if (inv) {
                                        // Attempt to find a recipe we can craft
                                        let crafted = false;
                                        for (const recipe of allRecipes) {
                                            if (recipe.requiredStation === stationId) {
                                                // Check if chest has ingredients
                                                let hasAll = true;
                                                for (const req of recipe.ingredients) {
                                                    let count = 0;
                                                    for (const item of inv) {
                                                        if (item && item.id === req.id) count += item.quantity || 1;
                                                    }
                                                    if (count < req.quantity) {
                                                        hasAll = false;
                                                        break;
                                                    }
                                                }

                                                if (hasAll) {
                                                    // Consume
                                                    for (const req of recipe.ingredients) {
                                                        let needed = req.quantity;
                                                        for (let i = 0; i < inv.length; i++) {
                                                            const item = inv[i];
                                                            if (item && item.id === req.id) {
                                                                if (item.quantity > needed) {
                                                                    item.quantity -= needed;
                                                                    needed = 0;
                                                                    break;
                                                                } else if (item.quantity === needed) {
                                                                    inv[i] = null;
                                                                    needed = 0;
                                                                    break;
                                                                } else {
                                                                    needed -= item.quantity;
                                                                    inv[i] = null;
                                                                }
                                                            }
                                                        }
                                                    }

                                                    // Give result
                                                    const resId = recipe.result.id;
                                                    let remainingRes = recipe.result.quantity;
                                                    
                                                    // Add to existing stacks
                                                    for (const item of inv) {
                                                        if (item && item.id === resId) {
                                                            const maxStack = ITEMS[item.id]?.maxStack || 64;
                                                            const space = maxStack - (item.quantity || 1);
                                                            if (space > 0) {
                                                                const add = Math.min(space, remainingRes);
                                                                item.quantity += add;
                                                                remainingRes -= add;
                                                                if (remainingRes <= 0) break;
                                                            }
                                                        }
                                                    }
                                                    // New stack
                                                    if (remainingRes > 0) {
                                                        for (let i = 0; i < inv.length; i++) {
                                                            if (!inv[i]) {
                                                                inv[i] = { ...ITEMS[resId], quantity: remainingRes };
                                                                remainingRes = 0;
                                                                break;
                                                            }
                                                        }
                                                    }

                                                    crafted = true;
                                                    break; // Gnome crafts 1 item per second
                                                }
                                            }
                                        }
                                        if (crafted) {
                                            // Optional: pop a tiny particle above Gnome
                                        }
                                    }
                                }
                            } else if (chunk.getBlock(x, y, z) === BlockType.ARCHER_MERCENARY) {
                                const ax = wx + x;
                                const ay = wy + y;
                                const az = z;

                                // Default range for archer
                                const RANGE = 15;
                                
                                let closestEnemy: any = null;
                                let closestDistSq = Infinity;

                                for (const group of allEnemies) {
                                    // Skip animals! We only want actual enemies.
                                    if (group.arr === engine.animals) continue; 

                                    // Find closest enemy
                                    for (const enemy of group.arr) {
                                        // Ignore dead enemies
                                        if ((enemy as any)[group.hpField] <= 0) continue;

                                        const dx = enemy.x - (ax + 0.5);
                                        const dy = enemy.y - (ay + 0.5);
                                        const dz = enemy.z - (az + 0.5);
                                        
                                        // basic cylinder distance
                                        const distSq = dx*dx + dy*dy;
                                        if (distSq <= RANGE*RANGE && Math.abs(dz) < 3) {
                                            if (distSq < closestDistSq) {
                                                closestDistSq = distSq;
                                                closestEnemy = enemy;
                                            }
                                        }
                                    }
                                }

                                if (closestEnemy) {
                                    audioEngine?.playShoot?.();
                                    const dx = closestEnemy.x - (ax + 0.5);
                                    const dy = closestEnemy.y - (ay + 0.5);
                                    const mag = Math.sqrt(dx*dx + dy*dy);
                                    const speed = 15.0;
                                    const vx = (dx / mag) * speed;
                                    const vy = (dy / mag) * speed;
                                    
                                    engine.projectiles.push({
                                        x: ax + 0.5,
                                        y: ay + 0.5,
                                        z: az + 0.5,
                                        vx: vx,
                                        vy: vy,
                                        vz: 0,
                                        damage: 20, // Base archer damage
                                        life: RANGE / speed, maxLife: RANGE / speed,
                                        isPlayer: true,
                                        color: '#34d399'
                                    });
                                }
                            } else if (block === BlockType.AUTO_MINER) {
                                // Extractor: generates items based on the block directly below it (z-1) without destroying it.
                                const bBelow = engine.world.getBlock(wx + x, wy + y, z - 1);
                                if (bBelow !== BlockType.AIR) {
                                    // 10% chance per second to extract
                                    if (Math.random() < 0.1) {
                                        let itemToDrop = null;
                                        if (bBelow === BlockType.COPPER_ORE) itemToDrop = ITEMS['copper_ore'];
                                        else if (bBelow === BlockType.IRON_ORE) itemToDrop = ITEMS['iron_ore'];
                                        else if (bBelow === BlockType.GREEN_METAL_ORE) itemToDrop = ITEMS['green_metal_ore'];
                                        else if (bBelow === BlockType.RED_METAL_ORE) itemToDrop = ITEMS['red_metal_ore'];
                                        else if (bBelow === BlockType.MITHRIL_ORE) itemToDrop = ITEMS['mithril_ore'];
                                        else if (bBelow === BlockType.RUBY) itemToDrop = ITEMS['ruby'];
                                        else if (bBelow === BlockType.EMERALD) itemToDrop = ITEMS['emerald'];
                                        else if (bBelow === BlockType.BLACK_DIAMOND) itemToDrop = ITEMS['black_diamond'];
                                        else if (bBelow === BlockType.COAL_ORE) itemToDrop = ITEMS['coal'];
                                        else if (bBelow === BlockType.STONE) itemToDrop = ITEMS['stone'];
                                        else if (bBelow === BlockType.DIRT || bBelow === BlockType.GRASS) itemToDrop = ITEMS['dirt'];
                                        else if (bBelow === BlockType.SAND) itemToDrop = ITEMS['sand'];
                                        else if (bBelow === BlockType.SNOW) itemToDrop = ITEMS['snowball'];

                                        if (itemToDrop) {
                                            engine.dropItem(wx + x + 0.5, wy + y + 0.5, z + 1.2, { ...itemToDrop, quantity: 1 });
                                        }
                                    }
                                }
                            } else if (block === BlockType.AUTO_DROPPER) {
                                // Drops items from an adjacent chest (z+1 usually)
                                const chestPos = { x: wx + x, y: wy + y, z: z + 1 };
                                if (engine.world.getBlock(chestPos.x, chestPos.y, chestPos.z) === BlockType.CHEST) {
                                    const chestKey = `${chestPos.x},${chestPos.y},${chestPos.z}`;
                                    const inv = engine.world.chestInventories.get(chestKey);
                                    if (inv) {
                                        for (let i = 0; i < inv.length; i++) {
                                            const item = inv[i];
                                            if (item && item.quantity > 0) {
                                                // Drop 1
                                                engine.dropItem(wx + x + 0.5, wy + y + 0.5, z + 1.2, { ...ITEMS[item.id], quantity: 1 });
                                                item.quantity--;
                                                if (item.quantity <= 0) inv[i] = null;
                                                break; // Only drop 1 per second max
                                            }
                                        }
                                    }
                                }
                            } else if (block === BlockType.GARDENER_GNOME) {
                                const r = 12;
                                let acted = false;
                                for (let dx = -r; dx <= r && !acted; dx++) {
                                    for (let dy = -r; dy <= r && !acted; dy++) {
                                        const nx = wx + x + dx;
                                        const ny = wy + y + dy;
                                        const bTest = engine.world.getBlock(nx, ny, z);
                                        
                                        if (bTest === BlockType.CROP_STAGE_3) {
                                            engine.world.setBlock(nx, ny, z, BlockType.CROP_STAGE_1); // Replant
                                            engine.dropItem(nx + 0.5, ny + 0.5, z + 1, { ...ITEMS['wheat'], quantity: 2 });
                                            acted = true;
                                        } else if (bTest === BlockType.RED_BERRY_BUSH) {
                                            engine.world.setBlock(nx, ny, z, BlockType.BUSH);
                                            engine.dropItem(nx + 0.5, ny + 0.5, z + 1, { ...ITEMS['red_berry'], quantity: 2 });
                                            acted = true;
                                        } else if (bTest === BlockType.BLUE_BERRY_BUSH) {
                                            engine.world.setBlock(nx, ny, z, BlockType.BUSH);
                                            engine.dropItem(nx + 0.5, ny + 0.5, z + 1, { ...ITEMS['blue_berry'], quantity: 2 });
                                            acted = true;
                                        } else if (bTest === BlockType.BLACK_BERRY_BUSH) {
                                            engine.world.setBlock(nx, ny, z, BlockType.BUSH);
                                            engine.dropItem(nx + 0.5, ny + 0.5, z + 1, { ...ITEMS['black_berry'], quantity: 2 });
                                            acted = true;
                                        } else if (bTest === BlockType.YELLOW_BERRY_BUSH) {
                                            engine.world.setBlock(nx, ny, z, BlockType.BUSH);
                                            engine.dropItem(nx + 0.5, ny + 0.5, z + 1, { ...ITEMS['yellow_berry'], quantity: 2 });
                                            acted = true;
                                        } else if (bTest === BlockType.TILLED_SOIL_WET || bTest === BlockType.TILLED_SOIL_DRY) {
                                            const above = engine.world.getBlock(nx, ny, z + 1);
                                            if (above === BlockType.AIR) {
                                                engine.world.setBlock(nx, ny, z + 1, BlockType.CROP_STAGE_1);
                                                acted = true;
                                            }
                                        }
                                    }
                                }
                            } else if (block === BlockType.MINER_GNOME) {
                                const r = 12;
                                let acted = false;
                                for (let dx = -r; dx <= r && !acted; dx++) {
                                    for (let dy = -r; dy <= r && !acted; dy++) {
                                        for (let dz = -1; dz <= 1 && !acted; dz++) {
                                            const nx = wx + x + dx;
                                            const ny = wy + y + dy;
                                            const nz = z + dz;
                                            const bTest = engine.world.getBlock(nx, ny, nz);
                                            
                                            let itemToDrop = null;
                                            if (bTest === BlockType.COPPER_ORE) itemToDrop = ITEMS['copper_ore'];
                                            else if (bTest === BlockType.IRON_ORE) itemToDrop = ITEMS['iron_ore'];
                                            else if (bTest === BlockType.GREEN_METAL_ORE) itemToDrop = ITEMS['green_metal_ore'];
                                            else if (bTest === BlockType.RED_METAL_ORE) itemToDrop = ITEMS['red_metal_ore'];
                                            else if (bTest === BlockType.MITHRIL_ORE) itemToDrop = ITEMS['mithril_ore'];
                                            else if (bTest === BlockType.RUBY) itemToDrop = ITEMS['ruby'];
                                            else if (bTest === BlockType.EMERALD) itemToDrop = ITEMS['emerald'];
                                            else if (bTest === BlockType.BLACK_DIAMOND) itemToDrop = ITEMS['black_diamond'];
                                            else if (bTest === BlockType.COAL_ORE) itemToDrop = ITEMS['coal'];

                                            if (itemToDrop) {
                                                engine.world.setBlock(nx, ny, nz, BlockType.AIR); // Break the ore
                                                engine.dropItem(wx + x + 0.5, wy + y + 0.5, z + 1.2, { ...itemToDrop, quantity: 1 });
                                                acted = true;
                                            }
                                        }
                                    }
                                }
                            } else if (block === BlockType.GUARD_MERCENARY) {
                                const ax = wx + x;
                                const ay = wy + y;
                                const az = z;
                                const RANGE = 12;
                                
                                let closestEnemy: any = null;
                                let closestDistSq = Infinity;

                                for (const group of allEnemies) {
                                    if (group.arr === engine.animals) continue; 
                                    for (const enemy of group.arr) {
                                        if ((enemy as any)[group.hpField] <= 0) continue;
                                        const dx = enemy.x - (ax + 0.5);
                                        const dy = enemy.y - (ay + 0.5);
                                        const dz = enemy.z - (az + 0.5);
                                        const distSq = dx*dx + dy*dy;
                                        if (distSq <= RANGE*RANGE && Math.abs(dz) < 3) {
                                            if (distSq < closestDistSq) {
                                                closestDistSq = distSq;
                                                closestEnemy = enemy;
                                            }
                                        }
                                    }
                                }

                                if (closestEnemy) {
                                    audioEngine?.playShoot?.();
                                    const dx = closestEnemy.x - (ax + 0.5);
                                    const dy = closestEnemy.y - (ay + 0.5);
                                    const mag = Math.sqrt(dx*dx + dy*dy);
                                    const speed = 25.0;
                                    const vx = (dx / mag) * speed;
                                    const vy = (dy / mag) * speed;
                                    
                                    engine.projectiles.push({
                                        x: ax + 0.5,
                                        y: ay + 0.5,
                                        z: az + 0.5,
                                        vx: vx,
                                        vy: vy,
                                        vz: 0,
                                        damage: 40, // Base guard damage, higher than archer
                                        life: RANGE / speed, maxLife: RANGE / speed,
                                        isPlayer: true,
                                        color: '#cbd5e1' // Silver/steel sword beam look
                                    });
                                }
                            }
                } // close activeAuto loop
            } // close chunk entries
        }
    }
}
