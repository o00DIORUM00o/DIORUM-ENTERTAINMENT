import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const LIQUIDS_BLOCKS: BlockDef[] = [
    {
        id: 'water',
        name: 'Water',
        type: BlockType.WATER,
        isSolid: false,
        isIndestructible: true,
        color: { r: 65, g: 105, b: 225 },
    },{
        id: 'lava',
        name: 'Lava',
        type: BlockType.LAVA,
        isSolid: false,
        isIndestructible: true,
        color: { r: 255, g: 69, b: 0 },
    },{
        id: 'lava_pool',
        name: 'Lava Pool',
        type: BlockType.LAVA_POOL,
        color: { r: 255, g: 80, b: 0 },
    },{ id: 'poison_water', name: 'Poison Water', type: BlockType.POISON_WATER, color: { r: 128, g: 0, b: 128 }, isSolid: false, isIndestructible: true },
    { id: 'swamp_water', name: 'Swamp Water', type: BlockType.SWAMP_WATER, color: { r: 60, g: 80, b: 40 }, isSolid: false, isIndestructible: true }
];