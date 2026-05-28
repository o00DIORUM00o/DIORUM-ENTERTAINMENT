import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const CHESTS_BLOCKS: BlockDef[] = [
    {
        id: 'chest',
        name: 'Chest',
        type: BlockType.CHEST,
        color: { r: 218, g: 165, b: 32 },
    },
];