import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const FLORA_BLOCKS: BlockDef[] = [
    {
        id: 'mushroom_stem',
        name: 'Mushroom Stem',
        type: BlockType.MUSHROOM_STEM,
        hardness: 20,
        color: { r: 220, g: 220, b: 240 },
    },{
        id: 'mushroom_cap',
        name: 'Mushroom Cap',
        type: BlockType.MUSHROOM_CAP,
        hardness: 20,
        color: { r: 0, g: 255, b: 255 },
    },{
        id: 'seedling_red',
        name: 'Seedling Red',
        type: BlockType.SEEDLING_RED,
        color: { r: 100, g: 180, b: 50 },
    },{
        id: 'seedling_blue',
        name: 'Seedling Blue',
        type: BlockType.SEEDLING_BLUE,
        color: { r: 100, g: 180, b: 50 },
    },{
        id: 'seedling_black',
        name: 'Seedling Black',
        type: BlockType.SEEDLING_BLACK,
        color: { r: 100, g: 180, b: 50 },
    },{
        id: 'seedling_yellow',
        name: 'Seedling Yellow',
        type: BlockType.SEEDLING_YELLOW,
        color: { r: 100, g: 180, b: 50 },
    },{
        id: 'glowing_mushroom_block',
        name: 'Glowing Mushroom',
        type: BlockType.GLOWING_MUSHROOM_BLOCK,
        color: { r: 180, g: 0, b: 255 },
    },{
        id: 'crop_stage_1',
        name: 'Seeds',
        type: BlockType.CROP_STAGE_1,
        isSolid: false,
        color: { r: 154, g: 205, b: 50 },
        hardness: 5
    },{
        id: 'crop_stage_2',
        name: 'Sprouts',
        type: BlockType.CROP_STAGE_2,
        isSolid: false,
        color: { r: 50, g: 205, b: 50 },
        hardness: 5
    },{
        id: 'crop_stage_3',
        name: 'Crops',
        type: BlockType.CROP_STAGE_3,
        isSolid: false,
        color: { r: 34, g: 139, b: 34 },
        hardness: 10
    },{ id: 'weed', name: 'Weed', type: BlockType.WEED, isSolid: false, color: {r: 34, g: 100, b: 34}, hardness: 5 },{ id: 'giant_mushroom_stalk', name: 'Giant Mushroom Stalk', type: BlockType.GIANT_MUSHROOM_STALK, color: { r: 220, g: 210, b: 190 }, isSolid: true, hardness: 30 },{ id: 'giant_mushroom_cap_red', name: 'Giant Mushroom Cap (Red)', type: BlockType.GIANT_MUSHROOM_CAP_RED, color: { r: 200, g: 40, b: 40 }, isSolid: true, hardness: 20 },{ id: 'giant_mushroom_cap_brown', name: 'Giant Mushroom Cap (Brown)', type: BlockType.GIANT_MUSHROOM_CAP_BROWN, color: { r: 140, g: 100, b: 60 }, isSolid: true, hardness: 20 },{ id: 'glowcap_mushroom', name: 'Glowcap Mushroom', type: BlockType.GLOWCAP_MUSHROOM, color: { r: 100, g: 255, b: 200 }, isSolid: false, hardness: 10 },{ id: 'stall_seeds', name: 'Seeds Stall', type: BlockType.STALL_SEEDS, color: { r: 139, g: 69, b: 19 }, isSolid: true, isIndestructible: true },
];