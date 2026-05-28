import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const MISC_BLOCKS: BlockDef[] = [
    {
        id: 'slime_puddle',
        name: 'Slime Puddle',
        type: BlockType.SLIME_PUDDLE,
        isIndestructible: true,
        color: { r: 50, g: 205, b: 50 },
    },{
        id: 'spider_web',
        name: 'Spider Web',
        type: BlockType.SPIDER_WEB,
        color: { r: 220, g: 220, b: 220 },
    },{
        id: 'road_sign',
        name: 'Road Sign',
        type: BlockType.ROAD_SIGN,
        color: { r: 160, g: 100, b: 50 },
    },{
        id: 'air',
        name: 'Air',
        type: BlockType.AIR,
        isSolid: false,
        isIndestructible: true,
    },{
        id: 'bed',
        name: 'Bed',
        type: BlockType.BED,
        color: { r: 178, g: 34, b: 34 },
    },{
        id: 'dummy',
        name: 'Dummy',
        type: BlockType.DUMMY,
        color: { r: 210, g: 180, b: 140 },
    },{
        id: 'trunk',
        name: 'Trunk',
        type: BlockType.TRUNK,
        hardness: 100,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'bush',
        name: 'Bush',
        type: BlockType.BUSH,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'bee_hive',
        name: 'Bee Hive',
        type: BlockType.BEE_HIVE,
        color: { r: 230, g: 180, b: 50 },
    },{
        id: 'crystal',
        name: 'Crystal',
        type: BlockType.CRYSTAL,
        hardness: 80,
        color: { r: 186, g: 85, b: 211 },
    },{
        id: 'pot',
        name: 'Pot',
        type: BlockType.POT,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'wizard_tower_wall',
        name: 'Wizard Tower Wall',
        type: BlockType.WIZARD_TOWER_WALL,
        color: { r: 70, g: 50, b: 120 },
    },{
        id: 'wizard_tower_floor',
        name: 'Wizard Tower Floor',
        type: BlockType.WIZARD_TOWER_FLOOR,
        color: { r: 100, g: 80, b: 150 },
    },{
        id: 'ant_hill',
        name: 'Ant Hill',
        type: BlockType.ANT_HILL,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'soil',
        name: 'Soil',
        type: BlockType.SOIL,
        color: { r: 80, g: 50, b: 20 },
    },{
        id: 'red_berry_bush',
        name: 'Red Berry Bush',
        type: BlockType.RED_BERRY_BUSH,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'blue_berry_bush',
        name: 'Blue Berry Bush',
        type: BlockType.BLUE_BERRY_BUSH,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'black_berry_bush',
        name: 'Black Berry Bush',
        type: BlockType.BLACK_BERRY_BUSH,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'yellow_berry_bush',
        name: 'Yellow Berry Bush',
        type: BlockType.YELLOW_BERRY_BUSH,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'spike_floor',
        name: 'Spike Floor',
        type: BlockType.SPIKE_FLOOR,
        isSolid: false,
        color: { r: 120, g: 120, b: 120 },
    },{
        id: 'spike_floor_active',
        name: 'Spike Floor Active',
        type: BlockType.SPIKE_FLOOR_ACTIVE,
        isSolid: false,
        color: { r: 120, g: 120, b: 120 },
    },{
        id: 'pressure_plate',
        name: 'Pressure Plate',
        type: BlockType.PRESSURE_PLATE,
        isSolid: false,
        color: { r: 150, g: 150, b: 150 },
    },{
        id: 'pressure_plate_active',
        name: 'Pressure Plate Active',
        type: BlockType.PRESSURE_PLATE_ACTIVE,
        isSolid: false,
        color: { r: 150, g: 150, b: 150 },
    },{
        id: 'lever',
        name: 'Lever',
        type: BlockType.LEVER,
        isSolid: false,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'lever_on',
        name: 'Lever On',
        type: BlockType.LEVER_ON,
        isSolid: false,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'iron_block',
        name: 'Iron Block',
        type: BlockType.IRON_BLOCK,
        color: { r: 180, g: 180, b: 190 },
    },{
        id: 'fabric_station',
        name: 'Fabric Station',
        type: BlockType.FABRIC_STATION,
        color: { r: 200, g: 180, b: 160 },
    },{
        id: 'leather_station',
        name: 'Leather Station',
        type: BlockType.LEATHER_STATION,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'dungeon_floor',
        name: 'Dungeon Floor',
        type: BlockType.DUNGEON_FLOOR,
        isIndestructible: true,
        color: { r: 70, g: 70, b: 80 },
    },{
        id: 'abyssal_floor',
        name: 'Abyssal Floor',
        type: BlockType.ABYSSAL_FLOOR,
        isIndestructible: true,
        color: { r: 30, g: 20, b: 30 },
    },{
        id: 'stairs_down',
        name: 'Stairs Down',
        type: BlockType.STAIRS_DOWN,
        isSolid: false,
        isIndestructible: true,
        color: { r: 100, g: 100, b: 100 },
    },{
        id: 'stairs_up',
        name: 'Stairs Up',
        type: BlockType.STAIRS_UP,
        isSolid: false,
        isIndestructible: true,
        color: { r: 120, g: 120, b: 120 },
    },{
        id: 'conveyor_belt_n',
        name: 'Conveyor Belt N',
        type: BlockType.CONVEYOR_BELT_N,
        isSolid: false,
        color: { r: 80, g: 80, b: 90 },
    },{
        id: 'conveyor_belt_s',
        name: 'Conveyor Belt S',
        type: BlockType.CONVEYOR_BELT_S,
        isSolid: false,
        color: { r: 80, g: 80, b: 90 },
    },{
        id: 'conveyor_belt_e',
        name: 'Conveyor Belt E',
        type: BlockType.CONVEYOR_BELT_E,
        isSolid: false,
        color: { r: 80, g: 80, b: 90 },
    },{
        id: 'conveyor_belt_w',
        name: 'Conveyor Belt W',
        type: BlockType.CONVEYOR_BELT_W,
        isSolid: false,
        color: { r: 80, g: 80, b: 90 },
    },{
        id: 'auto_miner',
        name: 'Auto Miner',
        type: BlockType.AUTO_MINER,
        color: { r: 180, g: 100, b: 50 },
    },{
        id: 'auto_dropper',
        name: 'Auto Dropper',
        type: BlockType.AUTO_DROPPER,
        color: { r: 150, g: 150, b: 150 },
    },{
        id: 'auto_crafter',
        name: 'Auto Crafter',
        type: BlockType.AUTO_CRAFTER,
        color: { r: 100, g: 150, b: 200 },
    },{
        id: 'vacuum_hopper',
        name: 'Vacuum Hopper',
        type: BlockType.VACUUM_HOPPER,
        color: { r: 50, g: 150, b: 100 },
    },{
        id: 'slime_trail',
        name: 'Slime Trail',
        type: BlockType.SLIME_TRAIL,
        isSolid: false,
        color: { r: 150, g: 255, b: 50 },
    },{
        id: 'magic_block',
        name: 'Magic Block',
        type: BlockType.MAGIC_BLOCK,
        color: { r: 150, g: 50, b: 250 },
    },{
        id: 'altar_divine',
        name: 'Altar Divine',
        type: BlockType.ALTAR_DIVINE,
        isIndestructible: true,
        color: { r: 255, g: 255, b: 200 },
    },{
        id: 'altar_corrupted',
        name: 'Altar Corrupted',
        type: BlockType.ALTAR_CORRUPTED,
        isIndestructible: true,
        color: { r: 60, g: 0, b: 80 },
    },{
        id: 'wall_shooter',
        name: 'Wall Shooter',
        type: BlockType.WALL_SHOOTER,
        color: { r: 100, g: 100, b: 110 },
    },{
        id: 'clay',
        name: 'Clay',
        type: BlockType.CLAY,
        color: { r: 164, g: 116, b: 73 },
    },{
        id: 'red_clay',
        name: 'Red Clay',
        type: BlockType.RED_CLAY,
        color: { r: 180, g: 60, b: 60 },
    },{
        id: 'black_clay',
        name: 'Black Clay',
        type: BlockType.BLACK_CLAY,
        color: { r: 30, g: 30, b: 30 },
    },{
        id: 'green_clay',
        name: 'Green Clay',
        type: BlockType.GREEN_CLAY,
        color: { r: 60, g: 120, b: 60 },
    },{
        id: 'blue_clay',
        name: 'Blue Clay',
        type: BlockType.BLUE_CLAY,
        color: { r: 60, g: 90, b: 160 },
    },{
        id: 'orange_clay',
        name: 'Orange Clay',
        type: BlockType.ORANGE_CLAY,
        color: { r: 180, g: 100, b: 40 },
    },{
        id: 'purple_clay',
        name: 'Purple Clay',
        type: BlockType.PURPLE_CLAY,
        color: { r: 120, g: 60, b: 160 },
    },{
        id: 'yellow_clay',
        name: 'Yellow Clay',
        type: BlockType.YELLOW_CLAY,
        color: { r: 190, g: 170, b: 60 },
    },{
        id: 'brown_clay',
        name: 'Brown Clay',
        type: BlockType.BROWN_CLAY,
        color: { r: 130, g: 90, b: 50 },
    },{
        id: 'green_crystal',
        name: 'Green Crystal',
        type: BlockType.GREEN_CRYSTAL,
        color: { r: 50, g: 255, b: 50 },
    },{
        id: 'red_crystal',
        name: 'Red Crystal',
        type: BlockType.RED_CRYSTAL,
        color: { r: 255, g: 50, b: 50 },
    },{
        id: 'black_crystal',
        name: 'Black Crystal',
        type: BlockType.BLACK_CRYSTAL,
        color: { r: 30, g: 30, b: 30 },
    },{
        id: 'blue_crystal',
        name: 'Blue Crystal',
        type: BlockType.BLUE_CRYSTAL,
        color: { r: 50, g: 50, b: 255 },
    },{
        id: 'orange_crystal',
        name: 'Orange Crystal',
        type: BlockType.ORANGE_CRYSTAL,
        color: { r: 255, g: 165, b: 0 },
    },{
        id: 'purple_crystal',
        name: 'Purple Crystal',
        type: BlockType.PURPLE_CRYSTAL,
        color: { r: 200, g: 50, b: 255 },
    },{
        id: 'yellow_crystal',
        name: 'Yellow Crystal',
        type: BlockType.YELLOW_CRYSTAL,
        color: { r: 255, g: 255, b: 50 },
    },{
        id: 'green_glow_crystal',
        name: 'Green Glow Crystal',
        type: BlockType.GREEN_GLOW_CRYSTAL,
        color: { r: 100, g: 255, b: 100 },
    },{
        id: 'red_glow_crystal',
        name: 'Red Glow Crystal',
        type: BlockType.RED_GLOW_CRYSTAL,
        color: { r: 255, g: 100, b: 100 },
    },{
        id: 'blue_glow_crystal',
        name: 'Blue Glow Crystal',
        type: BlockType.BLUE_GLOW_CRYSTAL,
        color: { r: 100, g: 100, b: 255 },
    },{
        id: 'orange_glow_crystal',
        name: 'Orange Glow Crystal',
        type: BlockType.ORANGE_GLOW_CRYSTAL,
        color: { r: 255, g: 200, b: 100 },
    },{
        id: 'purple_glow_crystal',
        name: 'Purple Glow Crystal',
        type: BlockType.PURPLE_GLOW_CRYSTAL,
        color: { r: 220, g: 100, b: 255 },
    },{
        id: 'yellow_glow_crystal',
        name: 'Yellow Glow Crystal',
        type: BlockType.YELLOW_GLOW_CRYSTAL,
        color: { r: 255, g: 255, b: 150 },
    },{
        id: 'jade',
        name: 'Jade',
        type: BlockType.JADE,
        color: { r: 0, g: 168, b: 107 },
    },{
        id: 'sapphire',
        name: 'Sapphire',
        type: BlockType.SAPPHIRE,
        color: { r: 15, g: 82, b: 186 },
    },{
        id: 'amber',
        name: 'Amber',
        type: BlockType.AMBER,
        color: { r: 255, g: 191, b: 0 },
    },{
        id: 'green_amber',
        name: 'Green Amber',
        type: BlockType.GREEN_AMBER,
        color: { r: 150, g: 200, b: 50 },
    },{
        id: 'red_coal',
        name: 'Red Coal',
        type: BlockType.RED_COAL,
        color: { r: 100, g: 20, b: 20 },
    },{
        id: 'salt',
        name: 'Salt',
        type: BlockType.SALT,
        color: { r: 240, g: 240, b: 245 },
    },{
        id: 'void_matter',
        name: 'Void Matter',
        type: BlockType.VOID_MATTER,
        color: { r: 10, g: 0, b: 25 },
    },{
        id: 'astral_dust',
        name: 'Astral Dust',
        type: BlockType.ASTRAL_DUST,
        color: { r: 180, g: 150, b: 255 },
    },{
        id: 'chrono_glass',
        name: 'Chrono Glass',
        type: BlockType.CHRONO_GLASS,
        color: { r: 255, g: 240, b: 180 },
    },{
        id: 'pale_slime_block',
        name: 'Pale Slime Block',
        type: BlockType.PALE_SLIME_BLOCK,
        color: { r: 200, g: 255, b: 180 },
    },{
        id: 'merchant',
        name: 'Merchant',
        type: BlockType.MERCHANT,
        color: { r: 100, g: 100, b: 150 },
    },{
        id: 'draconic_merchant',
        name: 'Draconic Merchant',
        type: BlockType.DRACONIC_MERCHANT,
        color: { r: 150, g: 120, b: 50 },
    },{
        id: 'deep_slate',
        name: 'Deep Slate',
        type: BlockType.DEEP_SLATE,
        color: { r: 45, g: 45, b: 50 }, // Very dark stone
    },{
        id: 'wire_off',
        name: 'Wire (Off)',
        type: BlockType.WIRE_OFF,
        color: { r: 100, g: 30, b: 30 },
        isSolid: false,
        hardness: 20
    },{
        id: 'wire_on',
        name: 'Wire (On)',
        type: BlockType.WIRE_ON,
        color: { r: 255, g: 50, b: 50 },
        isSolid: false,
        hardness: 20
    },{
        id: 'piston_closed',
        name: 'Piston (Closed)',
        type: BlockType.PISTON_CLOSED,
        color: { r: 120, g: 120, b: 120 },
        isSolid: true,
        hardness: 100
    },{
        id: 'piston_open',
        name: 'Piston (Open)',
        type: BlockType.PISTON_OPEN,
        color: { r: 60, g: 60, b: 60 },
        isSolid: false, // Players can walk through when open
        hardness: 100
    },{
        id: 'arrow_turret',
        name: 'Arrow Turret',
        type: BlockType.ARROW_TURRET,
        color: { r: 160, g: 100, b: 40 },
        isSolid: true,
        hardness: 80
    },{
        id: 'worker_gnome',
        name: 'Gnome Worker',
        type: BlockType.WORKER_GNOME,
        color: { r: 200, g: 150, b: 100 },
        isSolid: true,
        hardness: 50
    },{
        id: 'tilled_soil_dry',
        name: 'Dry Tilled Soil',
        type: BlockType.TILLED_SOIL_DRY,
        color: { r: 105, g: 75, b: 50 } // Lighter brown than dirt
    },{
        id: 'tilled_soil_wet',
        name: 'Wet Tilled Soil',
        type: BlockType.TILLED_SOIL_WET,
        color: { r: 75, g: 45, b: 20 } // Dark rich brown
    },{
        id: 'archer_mercenary',
        name: 'Archer Mercenary',
        type: BlockType.ARCHER_MERCENARY,
        color: { r: 50, g: 150, b: 50 },
        isSolid: true,
        hardness: 40
    },{ id: 'void_beacon', name: 'Void Beacon', type: BlockType.VOID_BEACON, color: { r: 255, g: 0, b: 200 }, isSolid: true, hardness: 500, isIndestructible: false /* the beacon must be destroyed! */ },{ id: 'slug_folk_merchant', name: 'Slug Folk Merchant', type: BlockType.SLUG_FOLK_MERCHANT, color: { r: 100, g: 150, b: 100 }, isSolid: true, isIndestructible: true },{ id: 'dragon_lair', name: 'Dragon Lair', type: BlockType.DRAGON_LAIR, color: {r: 150, g: 40, b:40}, isSolid: true, hardness: 1000, isIndestructible: true },{ id: 'gargoyle_pedestal', name: 'Gargoyle Pedestal', type: BlockType.GARGOYLE_PEDESTAL, color: { r: 100, g: 100, b: 100 }, isSolid: true, hardness: 200 },{ id: 'silver_block', name: 'Silver Block', type: BlockType.SILVER_BLOCK, color: { r: 192, g: 192, b: 192 }, isSolid: true, hardness: 200 },{ id: 'gold_block', name: 'Gold Block', type: BlockType.GOLD_BLOCK, color: { r: 255, g: 215, b: 0 }, isSolid: true, hardness: 200 },{ id: 'platinum_block', name: 'Platinum Block', type: BlockType.PLATINUM_BLOCK, color: { r: 229, g: 228, b: 226 }, isSolid: true, hardness: 200 },{ id: 'adamantium_block', name: 'Adamantium Block', type: BlockType.ADAMANTIUM_BLOCK, color: { r: 100, g: 149, b: 237 }, isSolid: true, hardness: 200 },{ id: 'eternium_block', name: 'Eternium Block', type: BlockType.ETERNIUM_BLOCK, color: { r: 255, g: 105, b: 180 }, isSolid: true, hardness: 200 },{ id: 'black_metal_block', name: 'Black Metal Block', type: BlockType.BLACK_METAL_BLOCK, color: { r: 50, g: 50, b: 50 }, isSolid: true, hardness: 200 },{ id: 'blue_metal_block', name: 'Blue Metal Block', type: BlockType.BLUE_METAL_BLOCK, color: { r: 0, g: 0, b: 255 }, isSolid: true, hardness: 200 },{ id: 'orange_metal_block', name: 'Orange Metal Block', type: BlockType.ORANGE_METAL_BLOCK, color: { r: 255, g: 165, b: 0 }, isSolid: true, hardness: 200 },{ id: 'purple_metal_block', name: 'Purple Metal Block', type: BlockType.PURPLE_METAL_BLOCK, color: { r: 128, g: 0, b: 128 }, isSolid: true, hardness: 200 },{ id: 'yellow_metal_block', name: 'Yellow Metal Block', type: BlockType.YELLOW_METAL_BLOCK, color: { r: 255, g: 255, b: 0 }, isSolid: true, hardness: 200 },{ id: 'plUTONIUM_block', name: 'Plutonium Block', type: BlockType.PLUTONIUM_BLOCK, color: { r: 0, g: 255, b: 0 }, isSolid: true, hardness: 200 },{ id: 'cooking_pot', name: 'Cooking Pot', type: BlockType.COOKING_POT, color: { r: 60, g: 60, b: 70 }, isSolid: true, hardness: 50 },{ id: 'fern', name: 'Fern', type: BlockType.FERN, color: { r: 50, g: 200, b: 50 }, isSolid: false, hardness: 5 },{ id: 'ogre_den', name: 'Ogre Den', type: BlockType.OGRE_DEN, color: { r: 80, g: 70, b: 60 }, isSolid: true, hardness: 150, isIndestructible: true },{ id: 'troll_cave', name: 'Troll Cave', type: BlockType.TROLL_CAVE, color: { r: 60, g: 60, b: 70 }, isSolid: true, hardness: 120, isIndestructible: true },{ id: 'blood_altar', name: 'Blood Altar', type: BlockType.BLOOD_ALTAR, color: { r: 180, g: 20, b: 20 }, isSolid: true, isIndestructible: true },{ id: 'arcane_turret', name: 'Arcane Turret', type: BlockType.ARCANE_TURRET, color: { r: 219, g: 39, b: 119 }, isSolid: true, hardness: 100 },{ id: 'gardener_gnome', name: 'Gardener Gnome', type: BlockType.GARDENER_GNOME, color: { r: 100, g: 200, b: 100 }, isSolid: true, hardness: 50 },{ id: 'guard_mercenary', name: 'Guard Mercenary', type: BlockType.GUARD_MERCENARY, color: { r: 100, g: 100, b: 200 }, isSolid: true, hardness: 100 },{ id: 'miner_gnome', name: 'Miner Gnome', type: BlockType.MINER_GNOME, color: { r: 150, g: 150, b: 150 }, isSolid: true, hardness: 50 },{ id: 'dark_wizard_pedestal', name: 'Shadow Pedestal', type: BlockType.DARK_WIZARD_PEDESTAL, color: { r: 80, g: 0, b: 100 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'buggy_ramp', name: 'Buggy Ramp', type: BlockType.BUGGY_RAMP, color: { r: 139, g: 69, b: 19 }, isSolid: false, hardness: 50 },{ id: 'phantom_wizard_altar', name: 'Phantom Wizard Altar', type: BlockType.PHANTOM_WIZARD_ALTAR, color: { r: 100, g: 40, b: 180 }, isSolid: true, hardness: 200, isIndestructible: true },{ id: 'void_lord_altar', name: 'Void Lord Altar', type: BlockType.VOID_LORD_ALTAR, color: { r: 50, g: 0, b: 70 }, isSolid: true, hardness: 200, isIndestructible: false },{ id: 'stall_books', name: 'Books Stall', type: BlockType.STALL_BOOKS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_staves', name: 'Staves Stall', type: BlockType.STALL_STAVES, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_swords', name: 'Swords Stall', type: BlockType.STALL_SWORDS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_potions', name: 'Potions Stall', type: BlockType.STALL_POTIONS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_ingots', name: 'Ingots Stall', type: BlockType.STALL_INGOTS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_fabric', name: 'Fabric Stall', type: BlockType.STALL_FABRIC, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_rune_keys', name: 'Rune Keys Stall', type: BlockType.STALL_RUNE_KEYS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_blocks', name: 'Blocks Stall', type: BlockType.STALL_BLOCKS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'stall_leather', name: 'Leather Stall', type: BlockType.STALL_LEATHER, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },{ id: 'glass', name: 'Glass', type: BlockType.GLASS, color: { r: 200, g: 250, b: 250 }, isSolid: true, hardness: 10 },{ id: 'squirrel_folk_treehouse', name: 'Squirrel Folk Treehouse', type: BlockType.SQUIRREL_FOLK_TREEHOUSE, color: { r: 139, g: 69, b: 19 }, isSolid: true, hardness: 100, isIndestructible: true },
{ id: 'stall_bags', name: 'Bag Merchant Stall', type: BlockType.BAG_MERCHANT_STALL, color: { r: 160, g: 80, b: 20 }, isSolid: true, isIndestructible: true },
{ id: 'berry_farmers_shed', name: 'Berry Farmer Shed', type: BlockType.BERRY_FARMER_SHED, color: { r: 80, g: 160, b: 80 }, isSolid: true, isIndestructible: true }
];