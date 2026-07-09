import { Player } from '../Player';
import { World } from '../World';
import { BlockType } from '../constants/BlockType';
import { audioEngine } from '../AudioEngine';

export class PlayerInteractionSystem {
    static handleInteraction(engine: any, interacting: boolean, potThrown: boolean) {
        if (!interacting || potThrown) return;

        const pZ = Math.floor(engine.player.z);
        const interactX = Math.floor(engine.player.x + Math.cos(engine.player.aimAngle));
        const interactY = Math.floor(engine.player.y + Math.sin(engine.player.aimAngle));
        
        let interactedWithNPC = false;
        for (const npc of engine.npcs) {
            const ndx = npc.x - engine.player.x;
            const ndy = npc.y - engine.player.y;
            const ndist = Math.sqrt(ndx*ndx + ndy*ndy);
            if (ndist < 1.5 && Math.abs(npc.z - engine.player.z) < 2) {
                if (npc.state !== 'COMBAT') {
                    engine.onInteractNPC?.(npc);
                    interactedWithNPC = true;
                    break;
                }
            }
        }

        if (!interactedWithNPC) {
            const block = engine.world.getBlock(interactX, interactY, pZ);
            if (block === BlockType.POT || block === BlockType.BUSH || block === BlockType.RED_BERRY_BUSH || block === BlockType.BLUE_BERRY_BUSH || block === BlockType.BLACK_BERRY_BUSH || block === BlockType.YELLOW_BERRY_BUSH) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.AIR);
                engine.player.carryingPot = true;
                engine.player.carriedBlockType = block;
            } else if (block === BlockType.DOOR_CLOSED) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
            } else if (block === BlockType.STONE_DOOR_CLOSED) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.STONE_DOOR_OPEN);
            } else if (block === BlockType.DOOR_LOCKED) {
                if (engine.player.hasItem('dungeon_key', 1)) {
                    engine.player.removeItem('dungeon_key', 1);
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
                    if (engine.player.onMessage) engine.player.onMessage('Unlocked the door.');
                } else {
                    if (engine.player.onMessage) engine.player.onMessage('You need a Dungeon Key.');
                }
            } else if (block === BlockType.DOOR_BOSS) {
                if (engine.player.hasItem('boss_key', 1)) {
                    engine.player.removeItem('boss_key', 1);
                    engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_OPEN);
                    if (engine.player.onMessage) engine.player.onMessage('Unlocked the boss door.');
                } else {
                    if (engine.player.onMessage) engine.player.onMessage('You need the Boss Key.');
                }
            } else if (block === BlockType.DOOR_OPEN) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.DOOR_CLOSED);
            } else if (block === BlockType.STONE_DOOR_OPEN) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.STONE_DOOR_CLOSED);
            } else if (block === BlockType.LEVER) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.LEVER_ON);
                // Check for nearby iron blocks and remove them (open door)
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dy = -2; dy <= 2; dy++) {
                        if (engine.world.getBlock(interactX + dx, interactY + dy, pZ) === BlockType.IRON_BLOCK) {
                            engine.world.setBlock(interactX + dx, interactY + dy, pZ, BlockType.AIR);
                        }
                    }
                }
            } else if (block === BlockType.LEVER_ON) {
                engine.world.setBlock(interactX, interactY, pZ, BlockType.LEVER);
                // We could close it, but let's just leave it open for now or we'd need to remember where it was
            } else if (block === BlockType.ROAD_SIGN) {
                const words = ["Beware", "To the city", "Danger ahead", "Turn back", "Welcome", "Safe travels", "Ogres nearby", "Darkness waits", "Look up", "Keep right", "Pomeranian crossing", "Wizard territory", "Goblins!", "Slime crossing", "Buy armor", "Nothing here"];
                const hash = (interactX * 73856093) ^ (interactY * 19349663) ^ pZ;
                const index = Math.abs(hash) % words.length;
                const text = words[index];
                if (engine.player.onMessage) engine.player.onMessage(`Sign reads: "${text}"`);
                
                engine.particles.push({
                    x: interactX + 0.5,
                    y: interactY + 0.5,
                    z: pZ + 1,
                    text: text,
                    color: '#ffffff',
                    life: 3.0,
                    maxLife: 3.0,
                    vy: 0,
                    vz: 0.5
                });
            } else if (block === BlockType.CHEST) {
                audioEngine.playChestOpen();
                engine.onOpenChest?.(interactX, interactY, pZ);
            } else if (block === BlockType.SHRINE || block === BlockType.ALTAR_DIVINE || block === BlockType.ALTAR_CORRUPTED) {
                engine.onOpenShrine?.(interactX, interactY, pZ);
            } else if (block === BlockType.ARCANE_GATE) {
                audioEngine.playPortal();
                engine.onOpenArcaneGate?.();
            } else if (block === BlockType.TENT) {
                // Rest at tent
                engine.player.health = engine.player.effectiveMaxHealth;
                engine.player.mana = engine.player.effectiveMaxMana;
                engine.player.stamina = engine.player.maxStamina;
                
                // Set spawn point (we can just use the tent's location)
                engine.player.spawnX = interactX + 0.5;
                engine.player.spawnY = interactY + 0.5;
                engine.player.spawnZ = pZ;

                engine.particles.push({
                    x: engine.player.x,
                    y: engine.player.y,
                    z: engine.player.z + 1,
                    text: 'Rested!',
                    color: '#22c55e',
                    life: 2.0,
                    maxLife: 2.0,
                    vy: -1
                });
            } else {
                // Check staircase interaction if no other block interaction occurred
                const px = Math.floor(engine.player.x);
                const py = Math.floor(engine.player.y);
                const blockIn = engine.world.getBlock(px, py, pZ);
                const blockUnder = engine.world.getBlock(px, py, pZ - 1);

                const isStairs = (b: number) => b === BlockType.WOODEN_STAIRCASE || b === BlockType.STONE_STAIRCASE || b === BlockType.DUNGEON_STAIRS;
                if (isStairs(blockIn)) {
                    let targetZ = pZ;
                    while (targetZ < 32 && isStairs(engine.world.getBlock(px, py, targetZ))) {
                        targetZ++;
                    }
                    engine.player.z = targetZ;
                } else if (isStairs(blockUnder)) {
                    let targetZ = pZ - 1;
                    while (targetZ > 0 && isStairs(engine.world.getBlock(px, py, targetZ - 1))) {
                        targetZ--;
                    }
                    engine.player.z = targetZ;
                }
            }
        }
    }
}
