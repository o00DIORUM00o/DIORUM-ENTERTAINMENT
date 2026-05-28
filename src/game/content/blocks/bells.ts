import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const BELLS_BLOCKS: BlockDef[] = [
    {
        id: 'village_bell',
        name: 'Village Bell',
        type: BlockType.VILLAGE_BELL,
        color: { r: 255, g: 215, b: 0 },
    },{
        id: 'copper_bell',
        name: 'Copper Bell',
        type: BlockType.COPPER_BELL,
        color: { r: 184, g: 115, b: 51 },
    },{
        id: 'iron_bell',
        name: 'Iron Bell',
        type: BlockType.IRON_BELL,
        color: { r: 169, g: 169, b: 169 },
    },{
        id: 'green_bell',
        name: 'Green Bell',
        type: BlockType.GREEN_BELL,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'red_bell',
        name: 'Red Bell',
        type: BlockType.RED_BELL,
        color: { r: 178, g: 34, b: 34 },
    },{
        id: 'mithril_bell',
        name: 'Mithril Bell',
        type: BlockType.MITHRIL_BELL,
        color: { r: 192, g: 192, b: 255 },
    },{
        id: 'black_bell',
        name: 'Black Bell',
        type: BlockType.BLACK_BELL,
        color: { r: 20, g: 20, b: 30 },
    },
];