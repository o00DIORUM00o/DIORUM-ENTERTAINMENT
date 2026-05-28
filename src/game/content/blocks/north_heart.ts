import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const NORTH_HEART_BLOCKS: BlockDef[] = [
    { id: 'permafrost', name: 'Permafrost', type: BlockType.PERMAFROST, color: { r: 180, g: 190, b: 200 } },
    { id: 'frozen_wood', name: 'Frozen Wood Log', type: BlockType.FROZEN_WOOD, color: { r: 150, g: 170, b: 180 } },
    { id: 'frozen_leaves', name: 'Frozen Leaves', type: BlockType.FROZEN_LEAVES, color: { r: 200, g: 220, b: 230 } },
    { id: 'glacial_ice', name: 'Glacial Ice', type: BlockType.GLACIAL_ICE, color: { r: 100, g: 200, b: 255 } },
    { id: 'glacial_crystal_ore', name: 'Glacial Crystal Ore', type: BlockType.GLACIAL_CRYSTAL_ORE, color: { r: 50, g: 150, b: 255 } },
    { id: 'star_metal_ore', name: 'Star Metal Ore', type: BlockType.STAR_METAL_ORE, color: { r: 255, g: 255, b: 150 } },
    { id: 'winter_elf_tent', name: 'Winter Elf Tent', type: BlockType.WINTER_ELF_TENT, color: { r: 220, g: 220, b: 240 } },
    { id: 'yeti_cave', name: 'Yeti Cave', type: BlockType.YETI_CAVE, color: { r: 255, g: 255, b: 255 } },
];
