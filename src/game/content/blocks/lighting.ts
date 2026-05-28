import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const LIGHTING_BLOCKS: BlockDef[] = [
    {
        id: 'torch',
        name: 'Torch',
        type: BlockType.TORCH,
        isSolid: false,
        hardness: 5,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'lantern_block',
        name: 'Lantern',
        type: BlockType.LANTERN_BLOCK,
        color: { r: 255, g: 200, b: 50 }, // Bright yellow/glow
    },
];