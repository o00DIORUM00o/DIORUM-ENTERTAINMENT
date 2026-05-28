import { Player } from '../Player';
import { World } from '../World';
import { BlockType } from '../constants/BlockType';
import { UpdateContext } from '../Player';

export class PlayerEnvironment {
    static interact(player: Player, ctx: UpdateContext) {
        const { world } = ctx;
        const px = Math.floor(player.x);
        const py = Math.floor(player.y);
        const pz = Math.floor(player.z);

        // Check 3x3x3 around player
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    const block = world.getBlock(px + dx, py + dy, pz + dz);
                    if (block === BlockType.ABYSSAL_GATEWAY) {
                        player.preAbyssalLocation = { x: player.x, y: player.y, z: player.z };
                        player.x = 60000 * 16 + 32;
                        player.y = 32;
                        player.z = 2.5;
                        return true;
                    } else if (block === BlockType.STAIRS_DOWN) {
                        const currentFloor = Math.floor((player.x / 16 - 60000) / 10);
                        player.x = (60000 + (currentFloor + 1) * 10) * 16 + 32;
                        player.y = 32;
                        player.z = 2.5;
                        return true;
                    } else if (block === BlockType.STAIRS_UP) {
                        const currentFloor = Math.floor((player.x / 16 - 60000) / 10);
                        if (currentFloor <= 0) {
                            if (player.preAbyssalLocation) {
                                player.x = player.preAbyssalLocation.x;
                                player.y = player.preAbyssalLocation.y;
                                player.z = player.preAbyssalLocation.z;
                            } else {
                                player.x = 0; player.y = 0; player.z = world.getElevation(0,0) + 1;
                            }
                        } else {
                            player.x = (60000 + (currentFloor - 1) * 10) * 16 + 32;
                            player.y = 32;
                            player.z = 2.5;
                        }
                        return true;
                    } else if (block === BlockType.BLOOD_ALTAR) {
                        if ((ctx as any).engine.arena && typeof (ctx as any).engine.arena.start === 'function') {
                            (ctx as any).engine.arena.start((ctx as any).engine, px + dx, py + dy, pz + dz);
                        }
                        return true;
                    } else if (block === BlockType.SAND_TERROR_ALTAR) {
                        world.setBlock(px + dx, py + dy, pz + dz, BlockType.AIR);
                        (ctx as any).engine.sandTerrors.push({
                            x: px + dx, y: py + dy, z: pz + dz,
                            vx: 0, vy: 0, vz: 0,
                            health: 1000, maxHealth: 1000, damage: 30,
                            state: 'BURROWED', stateTimer: 1.0, aimAngle: 0,
                            segments: []
                        });
                        return true;
                    } else if (block === BlockType.PHANTOM_WIZARD_ALTAR) {
                        world.setBlock(px + dx, py + dy, pz + dz, BlockType.AIR);
                        (ctx as any).engine.phantomWizards.push({
                            x: px + dx, y: py + dy, z: pz + dz,
                            vx: 0, vy: 0, vz: 0,
                            health: 800, maxHealth: 800, damage: 25,
                            state: 'HIDDEN', stateTimer: 1.0, aimAngle: 0,
                            teleportX: px + dx, teleportY: py + dy
                        });
                        return true;
                    } else if (block === BlockType.VOID_LORD_ALTAR) {
                        world.setBlock(px + dx, py + dy, pz + dz, BlockType.AIR);
                        (ctx as any).engine.voidLords.push({
                            x: px + dx, y: py + dy, z: pz + dz,
                            vx: 0, vy: 0, vz: 0,
                            health: 2000, maxHealth: 2000, damage: 50,
                            state: 'SPAWN', stateTimer: 2.0, aimAngle: 0
                        });
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
