import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const CRAFTING_BLOCKS: BlockDef[] = [
    {
        id: 'alchemy_table',
        name: 'Alchemy Table',
        type: BlockType.ALCHEMY_TABLE,
        color: { r: 75, g: 0, b: 130 },
    },{
        id: 'carpenters_bench',
        name: 'Carpenters Bench',
        type: BlockType.CARPENTERS_BENCH,
        color: { r: 160, g: 100, b: 60 },
    },{
        id: 'masonry_table',
        name: 'Masonry Table',
        type: BlockType.MASONRY_TABLE,
        color: { r: 105, g: 105, b: 105 },
    },{
        id: 'furnace',
        name: 'Furnace',
        type: BlockType.FURNACE,
        color: { r: 60, g: 60, b: 60 },
    },{
        id: 'anvil',
        name: 'Anvil',
        type: BlockType.ANVIL,
        color: { r: 80, g: 80, b: 80 },
    },
];