import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const CHESTS_BLOCKS: BlockDef[] = [
    {
        id: 'chest',
        name: 'Chest',
        type: BlockType.CHEST,
        color: { r: 218, g: 165, b: 32 },
    },
    {
        id: 'gold_chest',
        name: 'Gold Chest',
        type: BlockType.GOLD_CHEST,
        color: { r: 255, g: 215, b: 0 },
    },
];