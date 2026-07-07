import { Engine } from './Engine';
import { Chunk } from './world/Chunk';
import { Player } from './Player';

export class SaveManager {
    static compressBlocks(blocks: Uint16Array): number[] {
        const result: number[] = [];
        let currentVal = blocks[0];
        let count = 1;
        for (let i = 1; i < blocks.length; i++) {
            if (blocks[i] === currentVal) {
                count++;
            } else {
                result.push(currentVal, count);
                currentVal = blocks[i];
                count = 1;
            }
        }
        result.push(currentVal, count);
        return result;
    }

    static decompressBlocks(encoded: number[], out: Uint16Array) {
        let idx = 0;
        for (let i = 0; i < encoded.length; i += 2) {
            const val = encoded[i];
            const count = encoded[i+1];
            for (let j = 0; j < count; j++) {
                if (idx < out.length) {
                    out[idx++] = val;
                }
            }
        }
    }

    static saveGame(engine: Engine): string {
        try {
            // Serialize chunks
            const chunksData: Record<string, any> = {};
            for (const [key, chunk] of engine.world.chunkManager.chunks.entries()) {
                chunksData[key] = {
                    cx: chunk.cx,
                    cy: chunk.cy,
                    activePlanet: chunk.activePlanet,
                    blocks: this.compressBlocks(chunk.blocks)
                };
            }

            // Serialize player
            const p = engine.player;
            const playerData = {
                x: p.x, y: p.y, z: p.z,
                spawnX: p.spawnX, spawnY: p.spawnY, spawnZ: p.spawnZ,
                markPosition: p.markPosition,
                preAbyssalLocation: p.preAbyssalLocation,
                portals: p.portals,
                health: p.health, maxHealth: p.maxHealth,
                mana: p.mana, maxMana: p.maxMana,
                stamina: p.stamina, maxStamina: p.maxStamina,
                xp: p.xp, level: p.level, xpToNextLevel: p.xpToNextLevel,
                skillPoints: p.skillPoints,
                talents: p.talents,
                learnedRecipes: p.learnedRecipes,
                knownSpells: p.knownSpells,
                activeSpell: p.activeSpell,
                starSign: p.starSign,
                color: p.color,
                race: p.race,
                quests: p.quests,
                deityStandings: p.deityStandings,
                buffs: p.buffs,
                inventory: (p as any).inventory,
                equipment: (p as any).equipment,
                quickSlots: (p as any).quickSlots
            };

            // Serialize chestData
            const chestDataObj: Record<string, any> = {};
            for (const [key, val] of engine.world.chestData.entries()) {
                chestDataObj[key] = val;
            }

            const saveData = {
                version: 1,
                activePlanet: engine.world.activePlanet,
                timeOfDay: engine.world.timeOfDay,
                dayCount: engine.world.dayCount,
                player: playerData,
                chunks: chunksData,
                chests: chestDataObj,
            };

            const json = JSON.stringify(saveData);
            localStorage.setItem('deorum_save', json);
            return 'Game Saved Successfully!';
        } catch (e: any) {
            console.error(e);
            return 'Error saving game: ' + e.message;
        }
    }

    static loadGame(engine: Engine): string {
        try {
            const json = localStorage.getItem('deorum_save');
            if (!json) return 'No save found!';
            
            const data = JSON.parse(json);
            if (!data || data.version !== 1) return 'Incompatible or corrupt save.';

            // Restore World properties
            engine.world.activePlanet = data.activePlanet || 'HERAT';
            if (data.timeOfDay !== undefined) engine.world.timeOfDay = data.timeOfDay;
            if (data.dayCount !== undefined) engine.world.dayCount = data.dayCount;

            // Restore chestData
            engine.world.chestData.clear();
            if (data.chests) {
                for (const [key, val] of Object.entries(data.chests)) {
                    engine.world.chestData.set(key, val as any);
                }
            }

            // Clear existing chunks and restore
            engine.world.chunkManager.chunks.clear();
            engine.world.chunkManager.mruCache = [];
            
            for (const [key, chData] of Object.entries(data.chunks)) {
                if (!chData) continue;
                const anyChData = chData as any;
                const chunk = new Chunk(anyChData.cx, anyChData.cy, anyChData.activePlanet);
                this.decompressBlocks(anyChData.blocks, chunk.blocks);
                chunk.rebuildMetadata();
                engine.world.chunkManager.chunks.set(key, chunk);
            }

            // Restore Player properties
            const p = engine.player;
            const pd = data.player;
            if (pd) {
                p.x = pd.x; p.y = pd.y; p.z = pd.z;
                p.spawnX = pd.spawnX; p.spawnY = pd.spawnY; p.spawnZ = pd.spawnZ;
                p.markPosition = pd.markPosition;
                p.preAbyssalLocation = pd.preAbyssalLocation;
                p.portals = pd.portals || {};
                p.health = pd.health; p.maxHealth = pd.maxHealth;
                p.mana = pd.mana; p.maxMana = pd.maxMana;
                p.stamina = pd.stamina; p.maxStamina = pd.maxStamina;
                p.xp = pd.xp; p.level = pd.level; p.xpToNextLevel = pd.xpToNextLevel;
                p.skillPoints = pd.skillPoints;
                p.talents = pd.talents || {};
                p.learnedRecipes = pd.learnedRecipes || [];
                p.knownSpells = pd.knownSpells || [];
                p.activeSpell = pd.activeSpell;
                p.starSign = pd.starSign || 'SWIFT_FALCON';
                p.color = pd.color || '#fff';
                p.race = pd.race || 'HUMAN';
                p.quests = pd.quests || [];
                if (pd.deityStandings) p.deityStandings = pd.deityStandings;
                if (pd.buffs) p.buffs = pd.buffs;
                if (pd.inventory) (p as any).inventory = pd.inventory;
                if (pd.equipment) (p as any).equipment = pd.equipment;
                if (pd.quickSlots) (p as any).quickSlots = pd.quickSlots;
            }

            // Also clear all volatile arrays
            engine.projectiles = [];
            engine.particles = [];
            engine.entities = [];
            engine.bombs = [];
            engine.droppedItems = [];
            // Maybe keep some entities or clear them? Usually game loads with an empty active entity list and they respawn
            
            return 'Game Loaded Successfully!';
        } catch (e: any) {
            console.error(e);
            return 'Error loading game: ' + e.message;
        }
    }
}
