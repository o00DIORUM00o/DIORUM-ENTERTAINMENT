import { EntityRegistry } from '../registries/EntityRegistry';
import type { Engine } from '../Engine';
import { BlockType } from '../constants/BlockType';
;

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

        for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
            if (!chunk.spawners || chunk.spawners.size === 0) continue;
            const wx = chunk.cx * 16;
            const wy = chunk.cy * 16;
            const activeSpawners = Array.from(chunk.spawners as Set<number>);
            
            for (const idx of activeSpawners) {
                const block = chunk.blocks[idx as number];
                const x = wx + ((idx as number) % 16);
                const y = wy + (Math.floor((idx as number) / 16) % 16);
                const z = Math.floor((idx as number) / 256);
                    
                if (
                    block === BlockType.MERCHANT ||
                    block === BlockType.DRACONIC_MERCHANT ||
                    block === BlockType.SLUG_FOLK_MERCHANT ||
                    block === BlockType.STALL_BOOKS ||
                    block === BlockType.STALL_STAVES ||
                    block === BlockType.STALL_SWORDS ||
                    block === BlockType.STALL_POTIONS ||
                    block === BlockType.STALL_INGOTS ||
                    block === BlockType.STALL_SEEDS ||
                    block === BlockType.STALL_FABRIC ||
                    block === BlockType.STALL_RUNE_KEYS ||
                    block === BlockType.STALL_BLOCKS ||
                    block === BlockType.STALL_LEATHER ||
                    block === BlockType.BAG_MERCHANT_STALL ||
                    block === BlockType.BERRY_FARMER_SHED ||
                    block === BlockType.PRIEST_TENT ||
                    block === BlockType.MERCHANT_TENT ||
                    block === BlockType.WANDERING_BARD_TENT ||
                    block === BlockType.KING_SPAWNER ||
                    block === BlockType.QUEST_NPC_SPAWNER ||
                    block === BlockType.BOUNTY_HUNTER_SPAWNER
                ) {
                    // Spawn merchant NPC and replace block if it was a tent
                    if (block === BlockType.MERCHANT_TENT || block === BlockType.PRIEST_TENT || block === BlockType.WANDERING_BARD_TENT) {
                        engine.world.setBlock(x, y, z, BlockType.TENT); // replace spawner with normal tent
                    } else if (block === BlockType.BAG_MERCHANT_STALL || block === BlockType.BERRY_FARMER_SHED) {
                        engine.world.setBlock(x, y, z, BlockType.WOOD_WALL);
                    } else {
                        engine.world.setBlock(x, y, z, BlockType.AIR);
                    }
                    
                    let npcType: 'VILLAGER' | 'OLD_WIZARD' | 'DRACONIC_MERCHANT' | 'DARK_ELF' | 'DWARF' | 'GNOME' | 'SLUG_FOLK_MERCHANT' | 'NPC_KING' | 'NPC_WIZARD' | 'WANDERING_BARD' | 'BOUNTY_HUNTER' = 'VILLAGER';
                    let idPrefix = 'merchant_';
                    let mType = 'VILLAGER_MERCHANT';

                    if (block === BlockType.DRACONIC_MERCHANT) {
                        npcType = 'DRACONIC_MERCHANT';
                        idPrefix = 'draconic_merchant_';
                        mType = 'DRACONIC_MERCHANT';
                    } else if (block === BlockType.WANDERING_BARD_TENT) {
                        npcType = 'WANDERING_BARD';
                        idPrefix = 'bard_';
                        mType = 'WANDERING_BARD';
                    } else if (block === BlockType.SLUG_FOLK_MERCHANT) {
                        npcType = 'SLUG_FOLK_MERCHANT' as any;
                        idPrefix = 'slug_folk_merchant_';
                        mType = 'SLUG_FOLK_MERCHANT';
                    } else if (block === BlockType.KING_SPAWNER) {
                        npcType = 'NPC_KING';
                        idPrefix = 'king_';
                        mType = 'KING';
                    } else if (block === BlockType.QUEST_NPC_SPAWNER) {
                        npcType = 'NPC_WIZARD';
                        idPrefix = 'wizard_';
                        mType = 'WIZARD';
                    } else if (block === BlockType.BOUNTY_HUNTER_SPAWNER) {
                        npcType = 'BOUNTY_HUNTER';
                        idPrefix = 'bounty_hunter_';
                        mType = 'BOUNTY_HUNTER';
                    } else if (block === BlockType.PRIEST_TENT) {
                        mType = 'VILLAGER_PRIEST';
                    } else if (block === BlockType.MERCHANT_TENT) {
                        mType = 'VILLAGER_MERCHANT';
                    } else if (block === BlockType.STALL_BOOKS) mType = 'STALL_BOOKS';
                    else if (block === BlockType.STALL_STAVES) mType = 'STALL_STAVES';
                    else if (block === BlockType.STALL_SWORDS) mType = 'STALL_SWORDS';
                    else if (block === BlockType.STALL_POTIONS) mType = 'STALL_POTIONS';
                    else if (block === BlockType.STALL_INGOTS) mType = 'STALL_INGOTS';
                    else if (block === BlockType.STALL_SEEDS) mType = 'STALL_SEEDS';
                    else if (block === BlockType.STALL_FABRIC) mType = 'STALL_FABRIC';
                    else if (block === BlockType.STALL_RUNE_KEYS) mType = 'STALL_RUNE_KEYS';
                    else if (block === BlockType.STALL_BLOCKS) mType = 'STALL_BLOCKS';
                    else if (block === BlockType.STALL_LEATHER) mType = 'STALL_LEATHER';
                    else if (block === BlockType.BAG_MERCHANT_STALL) mType = 'BAG_MERCHANT';
                    else if (block === BlockType.BERRY_FARMER_SHED) mType = 'BERRY_FARMER';
                    
                    engine.npcs.push({
                        id: idPrefix + Math.random().toString(36).substr(2, 9),
                        x: x + 0.5,
                        y: y + 0.5,
                        z: z + 1,
                        vx: 0, vy: 0, vz: 0,
                        health: EntityRegistry.get(npcType.toLowerCase())?.maxHealth || EntityRegistry.get('villager').maxHealth, 
                        maxHealth: EntityRegistry.get(npcType.toLowerCase())?.maxHealth || EntityRegistry.get('villager').maxHealth,
                        type: npcType as any,
                        state: 'IDLE',
                        disposition: 0,
                        aimAngle: 0,
                        attackTimer: 0,
                        attackCooldown: 0,
                        merchantType: mType,
                        tradeInventory: [],
                        lastRestockDay: -1,
                        profession: mType
                    });
                    continue;
                }

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
            } // activeSpawners
        } // chunk entries
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
