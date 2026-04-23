import { BlockType } from './constants/BlockType';
export class ArenaManager {
    active = false;
    stage = 0; // 0 = not started, 1-3 = waves, 4 = boss, 5 = cleared
    timer = 0;
    centerX = 0;
    centerY = 0;
    centerZ = 0;
    spawnedEntities: any[] = [];
    
    start(engine: any, x: number, y: number, z: number) {
        if (this.active) return;
        this.active = true;
        this.stage = 1;
        this.timer = 5.0; // 5 seconds until first wave
        this.centerX = x;
        this.centerY = y;
        this.centerZ = z;
        this.spawnedEntities = [];
        engine.events.emit('HUD_MESSAGE', { text: "Arena Locked! Prepare for battle.", color: "red" });
        this.lockArena(engine);
    }
    
    lockArena(engine: any) {
        // Build iron fence in the gaps
        const bx = this.centerX;
        const by = this.centerY;
        const bz = this.centerZ;
        for (let i = 0; i < 3; i++) {
            // Z = 0 to 2 relative to altar
            // North
            engine.world.setBlock(bx, by - 6, bz + i, BlockType.DOOR_LOCKED); // BlockType.IRON_FENCE
            engine.world.setBlock(bx - 1, by - 6, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx + 1, by - 6, bz + i, BlockType.DOOR_LOCKED);
            // South
            engine.world.setBlock(bx, by + 6, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx - 1, by + 6, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx + 1, by + 6, bz + i, BlockType.DOOR_LOCKED);
            // West
            engine.world.setBlock(bx - 6, by, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx - 6, by - 1, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx - 6, by + 1, bz + i, BlockType.DOOR_LOCKED);
            // East
            engine.world.setBlock(bx + 6, by, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx + 6, by - 1, bz + i, BlockType.DOOR_LOCKED);
            engine.world.setBlock(bx + 6, by + 1, bz + i, BlockType.DOOR_LOCKED);
        }
    }
    
    unlockArena(engine: any) {
        // Remove iron fence in the gaps
        const bx = this.centerX;
        const by = this.centerY;
        const bz = this.centerZ;
        for (let i = 0; i < 3; i++) {
            engine.world.setBlock(bx, by - 6, bz + i, BlockType.AIR);
            engine.world.setBlock(bx - 1, by - 6, bz + i, BlockType.AIR);
            engine.world.setBlock(bx + 1, by - 6, bz + i, BlockType.AIR);
            
            engine.world.setBlock(bx, by + 6, bz + i, BlockType.AIR);
            engine.world.setBlock(bx - 1, by + 6, bz + i, BlockType.AIR);
            engine.world.setBlock(bx + 1, by + 6, bz + i, BlockType.AIR);
            
            engine.world.setBlock(bx - 6, by, bz + i, BlockType.AIR);
            engine.world.setBlock(bx - 6, by - 1, bz + i, BlockType.AIR);
            engine.world.setBlock(bx - 6, by + 1, bz + i, BlockType.AIR);
            
            engine.world.setBlock(bx + 6, by, bz + i, BlockType.AIR);
            engine.world.setBlock(bx + 6, by - 1, bz + i, BlockType.AIR);
            engine.world.setBlock(bx + 6, by + 1, bz + i, BlockType.AIR);
        }
    }

    update(engine: any, dt: number) {
        if (!this.active) return;
        
        // Remove dead entities or offscreen/void entities
        this.spawnedEntities = this.spawnedEntities.filter(e => (e.health > 0 || e.hp > 0) && e.z > -10);
        
        if (this.stage >= 1 && this.stage <= 4) {
            if (this.spawnedEntities.length === 0) {
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.spawnWave(engine, this.stage);
                    if (this.stage === 4) {
                        engine.events.emit('HUD_MESSAGE', { text: "BOSS WAVE!", color: "red" });
                    } else {
                        engine.events.emit('HUD_MESSAGE', { text: "Wave " + this.stage + " started!", color: "yellow" });
                    }
                }
            } else if (this.timer <= 0) {
                // Wait until all are dead before advancing stage
                if (this.spawnedEntities.length === 0) {
                     // Handled above effectively, but actually handled below
                }
            }
        }
        
        // When wave is cleared
        if (this.timer <= 0 && this.spawnedEntities.length === 0) {
            this.stage++;
            this.timer = 5.0;
            if (this.stage > 4) {
                this.unlockArena(engine);
                engine.events.emit('HUD_MESSAGE', { text: "Arena Cleared! The gates open.", color: "green" });
                this.active = false;
                
                // Spawn a reward chest!
                const cx = this.centerX + 0.5;
                const cy = this.centerY - 2.0;
                const cz = this.centerZ + 1.0;
                engine.dropItem(cx, cy, cz, { id: 'health_potion', name: 'Health Potion', type: 'consumable', quantity: 5 });
                engine.dropItem(cx, cy, cz, { id: 'mana_potion', name: 'Mana Potion', type: 'consumable', quantity: 5 });
                engine.dropItem(cx + 8, cy, cz, { id: 'emerald', name: 'Emerald', type: 'material', quantity: 3 });
                // We could drop a weapon/armor too
                engine.events.emit('HUD_MESSAGE', { text: "Loot dropped!", color: "gold" });
            }
        }
    }
    
    spawnWave(engine: any, stage: number) {
        const amount = stage * 3;
        for (let i = 0; i < amount; i++) {
            const rx = this.centerX + (Math.random() - 0.5) * 10;
            const ry = this.centerY + (Math.random() - 0.5) * 10;
            const rz = this.centerZ + 1;
            
            if (stage === 4 && i === 0) {
                // Boss
                const boss = engine.spawnEntity('ogre', rx, ry, rz);
                if (boss) {
                    boss.maxHealth = 1000; boss.health = 1000;
                    boss.scale = 2.0;
                    this.spawnedEntities.push(boss);
                }
                break;
            } else {
                let ent;
                if (stage === 1) ent = engine.spawnEntity('goblin', rx, ry, rz);
                else if (stage === 2) ent = engine.spawnEntity('skeleton', rx, ry, rz);
                else ent = engine.spawnEntity('abyssal_knight', rx, ry, rz);
                
                if (ent) this.spawnedEntities.push(ent);
            }
        }
    }
}
