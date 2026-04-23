import { BlockType } from '../../constants/BlockType';
import { ITEMS, Item } from '../../Inventory';
import { BlockRegistry } from '../../registries/BlockRegistry';

export interface LootDrop {
    item: Item;
    quantity?: number;
}

export type LootTableFunc = () => LootDrop[];

export const BLOCK_LOOT_TABLES: Partial<Record<BlockType, LootTableFunc>> = {
    [BlockType.BUSH]: () => [
        { item: ITEMS['red_berry'], quantity: 2 },
        { item: ITEMS['red_berry_seed'], quantity: 2 }
    ],
    [BlockType.RED_BERRY_BUSH]: () => [
        { item: ITEMS['red_berry'], quantity: 2 },
        { item: ITEMS['red_berry_seed'], quantity: 2 }
    ],
    [BlockType.BLUE_BERRY_BUSH]: () => [
        { item: ITEMS['blue_berry'], quantity: 2 },
        { item: ITEMS['blue_berry_seed'], quantity: 2 }
    ],
    [BlockType.BLACK_BERRY_BUSH]: () => [
        { item: ITEMS['black_berry'], quantity: 2 },
        { item: ITEMS['black_berry_seed'], quantity: 2 }
    ],
    [BlockType.YELLOW_BERRY_BUSH]: () => [
        { item: ITEMS['yellow_berry'], quantity: 2 },
        { item: ITEMS['yellow_berry_seed'], quantity: 2 }
    ],
    [BlockType.TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.GOBLIN_CAMP]: () => [{ item: ITEMS['tent'] }],
    [BlockType.GOBLIN_SHAMAN_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.ORC_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.WOOD_WALL]: () => [{ item: ITEMS['wood'] }],
    [BlockType.TRUNK]: () => [{ item: ITEMS['wood'] }],
    [BlockType.MUSHROOM_STEM]: () => [{ item: ITEMS['wood'] }],
    [BlockType.MUSHROOM_CAP]: () => [{ item: ITEMS['wood'] }],
    [BlockType.WOOD_LOG]: () => [{ item: ITEMS['wood'] }],
    [BlockType.STONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.GRAVESTONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.COPPER_ORE]: () => [{ item: ITEMS['copper_ore'] }],
    [BlockType.IRON_ORE]: () => [{ item: ITEMS['iron_ore'] }],
    [BlockType.GREEN_METAL_ORE]: () => [{ item: ITEMS['green_metal_ore'] }],
    [BlockType.RED_METAL_ORE]: () => [{ item: ITEMS['red_metal_ore'] }],
    [BlockType.MITHRIL_ORE]: () => [{ item: ITEMS['mithril_ore'] }],
    [BlockType.SILVER_ORE]: () => [{ item: ITEMS['silver_ore'] }],
    [BlockType.GOLD_ORE]: () => [{ item: ITEMS['gold_ore'] }],
    [BlockType.PLATINUM_ORE]: () => [{ item: ITEMS['platinum_ore'] }],
    [BlockType.ADAMANTIUM_ORE]: () => [{ item: ITEMS['adamantium_ore'] }],
    [BlockType.ETERNIUM_ORE]: () => [{ item: ITEMS['eternium_ore'] }],
    [BlockType.BLACK_METAL_ORE]: () => [{ item: ITEMS['black_metal_ore'] }],
    [BlockType.BLUE_METAL_ORE]: () => [{ item: ITEMS['blue_metal_ore'] }],
    [BlockType.ORANGE_METAL_ORE]: () => [{ item: ITEMS['orange_metal_ore'] }],
    [BlockType.PURPLE_METAL_ORE]: () => [{ item: ITEMS['purple_metal_ore'] }],
    [BlockType.YELLOW_METAL_ORE]: () => [{ item: ITEMS['yellow_metal_ore'] }],
    [BlockType.PLUTONIUM_ORE]: () => [{ item: ITEMS['plUTONIUM_ore'] }],
    [BlockType.COAL_ORE]: () => [{ item: ITEMS['coal'] }],
    [BlockType.CAMPFIRE]: () => [{ item: ITEMS['campfire'] }],
    [BlockType.VILLAGE_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.COPPER_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.IRON_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.GREEN_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.RED_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.MITHRIL_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.BLACK_BELL]: () => [{ item: ITEMS['village_bell'] }],
    [BlockType.ALCHEMY_TABLE]: () => [{ item: ITEMS['alchemy_table'] }],
    [BlockType.CARPENTERS_BENCH]: () => [{ item: ITEMS['carpenters_bench'] }],
    [BlockType.WOODEN_STAIRCASE]: () => [{ item: ITEMS['wooden_staircase'] }],
    [BlockType.COPPER_BLOCK]: () => [{ item: ITEMS['copper_block'] }],
    [BlockType.SILVER_BLOCK]: () => [{ item: ITEMS['silver_block'] }],
    [BlockType.GOLD_BLOCK]: () => [{ item: ITEMS['gold_block'] }],
    [BlockType.PLATINUM_BLOCK]: () => [{ item: ITEMS['platinum_block'] }],
    [BlockType.MITHRIL_BLOCK]: () => [{ item: ITEMS['mithril_block'] }],
    [BlockType.ADAMANTIUM_BLOCK]: () => [{ item: ITEMS['adamantium_block'] }],
    [BlockType.ETERNIUM_BLOCK]: () => [{ item: ITEMS['eternium_block'] }],
    [BlockType.BLACK_METAL_BLOCK]: () => [{ item: ITEMS['black_metal_block'] }],
    [BlockType.BLUE_METAL_BLOCK]: () => [{ item: ITEMS['blue_metal_block'] }],
    [BlockType.GREEN_METAL_BLOCK]: () => [{ item: ITEMS['green_metal_block'] }],
    [BlockType.RED_METAL_BLOCK]: () => [{ item: ITEMS['red_metal_block'] }],
    [BlockType.ORANGE_METAL_BLOCK]: () => [{ item: ITEMS['orange_metal_block'] }],
    [BlockType.PURPLE_METAL_BLOCK]: () => [{ item: ITEMS['purple_metal_block'] }],
    [BlockType.YELLOW_METAL_BLOCK]: () => [{ item: ITEMS['yellow_metal_block'] }],
    [BlockType.PLUTONIUM_BLOCK]: () => [{ item: ITEMS['plUTONIUM_block'] }],
    [BlockType.IRON_BLOCK]: () => [{ item: ITEMS['iron_block'] }],
    [BlockType.MARBLE]: () => [{ item: ITEMS['marble'] }],
    [BlockType.BLACK_MARBLE]: () => [{ item: ITEMS['black_marble'] }],
    [BlockType.GREEN_MARBLE]: () => [{ item: ITEMS['green_marble'] }],
    [BlockType.OBSIDIAN]: () => [{ item: ITEMS['obsidian'] }],
    [BlockType.LAVA_ROCK]: () => [{ item: ITEMS['lava_rock'] }],
    [BlockType.RUBY]: () => [{ item: ITEMS['ruby'] }],
    [BlockType.EMERALD]: () => [{ item: ITEMS['emerald'] }],
    [BlockType.BLACK_DIAMOND]: () => [{ item: ITEMS['black_diamond'] }],
    [BlockType.CONVEYOR_BELT_N]: () => [{ item: ITEMS['conveyor_belt'] }],
    [BlockType.CONVEYOR_BELT_S]: () => [{ item: ITEMS['conveyor_belt'] }],
    [BlockType.CONVEYOR_BELT_E]: () => [{ item: ITEMS['conveyor_belt'] }],
    [BlockType.CONVEYOR_BELT_W]: () => [{ item: ITEMS['conveyor_belt'] }],
    [BlockType.AUTO_MINER]: () => [{ item: ITEMS['auto_miner'] }],
    [BlockType.AUTO_DROPPER]: () => [{ item: ITEMS['auto_dropper'] }],
    [BlockType.AUTO_CRAFTER]: () => [{ item: ITEMS['auto_crafter'] }],
    [BlockType.VACUUM_HOPPER]: () => [{ item: ITEMS['vacuum_hopper'] }],
    [BlockType.BONE_PILE_SPAWNER]: () => [{ item: ITEMS['bone'], quantity: 5 }],
    [BlockType.GIANT_MUSHROOM_STALK]: () => [{ item: ITEMS['fungal_spore'] }],
    [BlockType.CLAY_ORE]: () => [{ item: ITEMS['clay'], quantity: Math.floor(Math.random() * 3) + 1 }],
    [BlockType.SLIME_PUDDLE]: () => [{ item: ITEMS['slime'], quantity: Math.floor(Math.random() * 2) + 1 }],
    [BlockType.POT]: () => {
        const randomLoot = ['gold_piece', 'copper_piece', 'health_potion', 'red_berry', 'slime'];
        const itemToDrop = randomLoot[Math.floor(Math.random() * randomLoot.length)];
        return [{ item: ITEMS[itemToDrop] }];
    },
    [BlockType.CRYSTAL]: () => [{ item: ITEMS['crystal_shard'], quantity: Math.floor(Math.random() * 3) + 1 }],
    [BlockType.TORCH]: () => [{ item: ITEMS['torch'] }],
    [BlockType.BEE_HIVE]: () => [{ item: ITEMS['bee_hive'] }],
    [BlockType.CHEST]: () => [{ item: ITEMS['storage_chest'] }],
    [BlockType.DIRT]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.GRASS]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.RED_DIRT]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.BLACK_DIRT]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.GREEN_DIRT]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.BLUE_DIRT]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.SOIL]: () => [{ item: ITEMS['dirt'] }],
    [BlockType.SAND]: () => [{ item: ITEMS['sand'] }],
    [BlockType.RED_SAND]: () => [{ item: ITEMS['sand'] }],
    [BlockType.BLACK_SAND]: () => [{ item: ITEMS['sand'] }],
    [BlockType.GREEN_SAND]: () => [{ item: ITEMS['sand'] }],
    [BlockType.BLUE_SAND]: () => [{ item: ITEMS['sand'] }],
    [BlockType.CLAY]: () => [{ item: ITEMS['clay'] }],
    [BlockType.RED_CLAY]: () => [{ item: ITEMS['clay'] }],
    [BlockType.BLACK_CLAY]: () => [{ item: ITEMS['clay'] }],
    [BlockType.GREEN_CLAY]: () => [{ item: ITEMS['clay'] }],
    [BlockType.BLUE_CLAY]: () => [{ item: ITEMS['clay'] }],
    [BlockType.MUD]: () => [{ item: ITEMS['mud'] }],
    [BlockType.SNOW]: () => [{ item: ITEMS['snow'] }],
    [BlockType.LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.PINE_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.RED_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.BLACK_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.GREEN_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.BLUE_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['wood'] }] : [],
    [BlockType.RED_WOOD]: () => [{ item: ITEMS['wood'] }],
    [BlockType.BLACK_WOOD]: () => [{ item: ITEMS['wood'] }],
    [BlockType.GREEN_WOOD]: () => [{ item: ITEMS['wood'] }],
    [BlockType.BLUE_WOOD]: () => [{ item: ITEMS['wood'] }],
    [BlockType.RED_STONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.BLACK_STONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.GREEN_STONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.BLUE_STONE]: () => [{ item: ITEMS['stone'] }],
    [BlockType.RED_MARBLE]: () => [{ item: ITEMS['marble'] }],
    [BlockType.WOOD_FLOOR]: () => [{ item: ITEMS['wood_floor'] }],
    [BlockType.DOOR_CLOSED]: () => [{ item: ITEMS['door'] }],
    [BlockType.DOOR_OPEN]: () => [{ item: ITEMS['door'] }],
    [BlockType.STONE_DOOR_CLOSED]: () => [{ item: ITEMS['stone_door'] }],
    [BlockType.STONE_DOOR_OPEN]: () => [{ item: ITEMS['stone_door'] }],
    [BlockType.STONE_STAIRCASE]: () => [{ item: ITEMS['stone_staircase'] }],
    [BlockType.GLASS]: () => [{ item: ITEMS['glass_block'] }],
    [BlockType.ARCHER_TENT]: () => [{ item: ITEMS['archer_tent'] }],
    [BlockType.DARK_KNIGHT_TENT]: () => [{ item: ITEMS['dark_knight_tent'] }],
    [BlockType.BED]: () => [{ item: ITEMS['bed'] }],
    [BlockType.MASONRY_TABLE]: () => [{ item: ITEMS['masonry_table'] }],
    [BlockType.SHRINE]: () => [{ item: ITEMS['shrine'] }],
    [BlockType.FURNACE]: () => [{ item: ITEMS['furnace'] }],
    [BlockType.ICE]: () => [{ item: ITEMS['ice'] }],
    [BlockType.ANT_HILL]: () => [{ item: ITEMS['ant_hill'] }],
    [BlockType.ANVIL]: () => [{ item: ITEMS['anvil'] }],
    [BlockType.PRESSURE_PLATE]: () => [{ item: ITEMS['pressure_plate'] }],
    [BlockType.PRESSURE_PLATE_ACTIVE]: () => [{ item: ITEMS['pressure_plate'] }],
    [BlockType.LEVER]: () => [{ item: ITEMS['lever'] }],
    [BlockType.LEVER_ON]: () => [{ item: ITEMS['lever'] }],
    [BlockType.WIRE_ON]: () => [{ item: ITEMS['wire'] }],
    [BlockType.WIRE_OFF]: () => [{ item: ITEMS['wire'] }],
    [BlockType.PISTON_OPEN]: () => [{ item: ITEMS['piston'] }],
    [BlockType.PISTON_CLOSED]: () => [{ item: ITEMS['piston'] }],
    [BlockType.BUGGY_RAMP]: () => [{ item: ITEMS['buggy_ramp'] }],
    [BlockType.GUARD_MERCENARY]: () => [{ item: ITEMS['guard_contract'] }],
    [BlockType.GARDENER_GNOME]: () => [{ item: ITEMS['gardener_contract'] }],
    [BlockType.MINER_GNOME]: () => [{ item: ITEMS['miner_contract'] }],
    [BlockType.ARROW_TURRET]: () => [{ item: ITEMS['arrow_turret'] }],
    [BlockType.WORKER_GNOME]: () => [{ item: ITEMS['worker_contract'] }],
    [BlockType.ARCHER_MERCENARY]: () => [{ item: ITEMS['archer_contract'] }],
    [BlockType.FABRIC_STATION]: () => [{ item: ITEMS['fabric_station'] }],
    [BlockType.LEATHER_STATION]: () => [{ item: ITEMS['leather_station'] }],
    [BlockType.DUNGEON_BRICK_HARD]: () => [{ item: ITEMS['dungeon_brick_hard'] }],
    [BlockType.DUNGEON_BRICK_CRACKED]: () => [{ item: ITEMS['dungeon_brick_cracked'] }],
    [BlockType.ANCIENT_WOOD]: () => [{ item: ITEMS['ancient_wood'] }],
    [BlockType.ANCIENT_LEAVES]: () => [{ item: ITEMS['ancient_leaves'] }],
    [BlockType.GLOWING_MUSHROOM_BLOCK]: () => [{ item: ITEMS['glowing_mushroom_block'] }],
    [BlockType.LAVA_POOL]: () => [{ item: ITEMS['lava_rock'] }],
    [BlockType.VOID_BEACON]: () => [{ item: ITEMS['void_beacon'] }],
    
    // THERA UPDATE
    [BlockType.TROPICAL_WOOD]: () => [{ item: ITEMS['tropical_wood'] }],
    [BlockType.TROPICAL_LEAVES]: () => Math.random() < 0.25 ? [{ item: ITEMS['tropical_wood'] }] : [],
    [BlockType.FERN]: () => Math.random() < 0.5 ? [{ item: ITEMS['fern_frond'] }] : [],
    [BlockType.TRICERA_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.RAPTOR_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.FROG_TENT]: () => [{ item: ITEMS['tent'] }],
    [BlockType.FOSSIL_ORE]: () => [{ item: ITEMS['fossil'] }, { item: ITEMS['stone'] }]
};

export function getLootForBlock(block: BlockType): { item: Item, quantity?: number }[] {
    const tableFn = BLOCK_LOOT_TABLES[block];
    if (tableFn) {
        return tableFn().filter(d => Boolean(d.item));
    }
    
    // Fallback for everything else
    const blockDef = BlockRegistry.getBlock(block);
    if (blockDef && ITEMS[blockDef.id]) {
         return [{ item: ITEMS[blockDef.id], quantity: 1 }];
    }
    
    return [];
}
