import { QuestsConfig } from '../QuestsConfig';
import { Player } from '../Player';
import { Engine } from '../Engine';
import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE } from '../Constants';

export class QuestSystem {
    // Check if player meets requirements for an active fetch quest
    static checkQuestProgress(player: Player) {
        let changed = false;
        for (const quest of player.quests) {
            if (quest.state === 'ACTIVE' && quest.type === 'FETCH') {
                const count = player.inventory.filter(i => i.id === quest.targetId).reduce((a, b) => a + b.quantity, 0);
                if (quest.currentCount !== count) {
                    quest.currentCount = count;
                    changed = true;
                }
                if (quest.currentCount >= quest.requiredCount) {
                    quest.state = 'COMPLETED';
                    changed = true;
                }
            }
        }
        return changed;
    }

    static onEnemyKilled(engine: Engine, enemyType: string) {
        let changed = false;
        for (const quest of engine.player.quests) {
            if (quest.state === 'ACTIVE' && quest.type === 'KILL') {
                if (quest.targetId === enemyType) {
                    quest.currentCount = (quest.currentCount || 0) + 1;
                    changed = true;
                    if (quest.currentCount < quest.requiredCount) {
                        engine.events.emit('HUD_MESSAGE', { text: `${quest.title}: (${quest.currentCount}/${quest.requiredCount})`, color: 'orange' });
                    } else if (quest.currentCount >= quest.requiredCount) {
                        quest.currentCount = quest.requiredCount;
                        quest.state = 'COMPLETED';
                        engine.events.emit('HUD_MESSAGE', { text: `Objective Complete: ${quest.title}! Return for bounty.`, color: '#ffcc00' });
                    }
                }
            }
        }
        return changed;
    }

    static onBlockDestroyed(engine: Engine, blockType: BlockType) {
        let changed = false;
        for (const quest of engine.player.quests) {
            if (quest.state === 'ACTIVE' && quest.type === 'DESTROY_SPAWNER') {
                if (blockType === BlockType.GOBLIN_CAMP || blockType === BlockType.ORC_TENT) {
                    quest.currentCount++;
                    changed = true;
                    if (quest.currentCount < quest.requiredCount) {
                        engine.events.emit('HUD_MESSAGE', { text: `Enemy Tent Destroyed! (${quest.currentCount}/${quest.requiredCount})`, color: 'orange' });
                    } else if (quest.currentCount === quest.requiredCount) {
                        quest.state = 'COMPLETED';
                        engine.events.emit('HUD_MESSAGE', { text: `Objective Complete: ${quest.title}! Return to the King.`, color: '#ffcc00' });
                    }
                }
            }
        }
        return changed;
    }

    static canAcceptQuest(player: Player, questId: string): boolean {
        return !player.quests.find(q => q.id === questId);
    }

    static acceptQuest(engine: Engine, questId: string) {
        const player = engine.player;
        const def = QuestsConfig[questId];
        if (!def) return;
        player.quests.push({
            id: def.id,
            giverId: def.giverType,
            title: def.title,
            description: def.description,
            type: def.type,
            targetId: def.targetId,
            requiredCount: def.requiredCount,
            currentCount: 0,
            state: 'ACTIVE',
            rewards: def.rewards
        });
        
        if (questId === 'QUEST_KING_SIEGE_1') {
            this.triggerSiegeEvent(engine);
        }

        this.checkQuestProgress(player);
    }

    static triggerSiegeEvent(engine: Engine) {
        engine.events.emit('HUD_MESSAGE', { text: "THE SIEGE HAS BEGUN!", color: "red" });
        
        const intersections = [
            { ix: 128, iy: 0 },
            { ix: 0, iy: 128 },
            { ix: 128, iy: 128 }
        ];

        const offsets = [
            { dx: 8, dy: 8 },
            { dx: -8, dy: 8 },
            { dx: 8, dy: -8 },
            { dx: -8, dy: -8 }
        ];

        for (const I of intersections) {
            for (const off of offsets) {
                const wx = I.ix + off.dx;
                const wy = I.iy + off.dy;
                // Force chunk generation to ensure we can place blocks
                const cx = Math.floor(wx / CHUNK_SIZE);
                const cy = Math.floor(wy / CHUNK_SIZE);
                const chunk = engine.world.chunkManager.getChunk('HERAT', cx, cy);
                
                const lx = (wx % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
                const ly = (wy % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
                const bz = chunk.heightMap[lx + ly * CHUNK_SIZE];
                
                // Clear any non-air blocks above ground just to be safe
                for (let zOffset = 1; zOffset <= 5; zOffset++) {
                    engine.world.setBlock(wx, wy, bz + zOffset, BlockType.AIR);
                }

                // Place Tent
                engine.world.setBlock(wx, wy, bz + 1, Math.random() > 0.5 ? BlockType.GOBLIN_CAMP : BlockType.ORC_TENT);
                engine.world.setBlock(wx, wy, bz + 2, BlockType.AIR);
                // Place Campfire nearby
                engine.world.setBlock(wx + 1, wy, bz + 1, BlockType.CAMPFIRE);
            }
        }
    }

    static turnInQuest(engine: Engine, questId: string) {
        const player = engine.player;
        const quest = player.quests.find(q => q.id === questId);
        if (!quest || quest.state !== 'COMPLETED') return;

        if (quest.type === 'FETCH') {
            // Remove items from inventory
            let remaining = quest.requiredCount;
            for (let i = player.inventory.length - 1; i >= 0; i--) {
                const item = player.inventory[i];
                if (item.id === quest.targetId) {
                    if (item.quantity > remaining) {
                        item.quantity -= remaining;
                        remaining = 0;
                        break;
                    } else {
                        remaining -= item.quantity;
                        player.inventory.splice(i, 1);
                    }
                }
            }
        }

        quest.state = 'TURNED_IN';

        // Give rewards
        const def = QuestsConfig[questId];
        if (def && def.rewards) {
            for (const r of def.rewards) {
                if (r.type === 'XP') {
                    player.xp += r.amount;
                } else if (r.type === 'GOLD') {
                    const existing = player.inventory.find(i => i.id === 'gold_piece');
                    if (existing) {
                        existing.quantity += r.amount;
                    } else {
                        player.inventory.push({ id: 'gold_piece', name: 'Gold Piece', category: 'MISC', stackable: true, quantity: r.amount, maxStack: 999 } as any);
                    }
                } else if (r.type === 'ITEM' && r.id) {
                    player.inventory.push({ id: r.id, name: r.id, category: 'MISC', stackable: true, quantity: r.amount, maxStack: 99 } as any);
                }
            }
        }
        engine.events.emit('HUD_MESSAGE', { text: `Quest Completed: ${quest.title}`, color: '#ffcc00' });
    }

    static getAvailableQuests(player: Player, giverType: string): any[] {
        const available: any[] = [];
        for (const [id, def] of Object.entries(QuestsConfig)) {
            if (def.giverType === giverType) {
                const existing = player.quests.find(q => q.id === id);
                if (!existing) {
                    available.push(def);
                }
            }
        }
        return available;
    }

    static getActiveQuestsForGiver(player: Player, giverType: string): any[] {
         return player.quests.filter(q => q.giverId === giverType && q.state !== 'TURNED_IN');
    }
}
