import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const WOOD_BLOCKS: BlockDef[] = [
    {
        id: 'wood_wall',
        name: 'Wood Wall',
        type: BlockType.WOOD_WALL,
        color: { r: 101, g: 67, b: 33 },
    },{
        id: 'wood_floor',
        name: 'Wood Floor',
        type: BlockType.WOOD_FLOOR,
        color: { r: 139, g: 90, b: 43 },
    },{
        id: 'leaves',
        name: 'Leaves',
        type: BlockType.LEAVES,
        color: { r: 0, g: 100, b: 0 },
    },{
        id: 'pine_leaves',
        name: 'Pine Leaves',
        type: BlockType.PINE_LEAVES,
        color: { r: 34, g: 75, b: 42 },
    },{
        id: 'wooden_staircase',
        name: 'Wooden Staircase',
        type: BlockType.WOODEN_STAIRCASE,
        isSolid: false,
        color: { r: 139, g: 90, b: 43 },
    },{
        id: 'wood_log',
        name: 'Wood Log',
        type: BlockType.WOOD_LOG,
        color: { r: 120, g: 81, b: 45 },
    },{
        id: 'red_wood',
        name: 'Red Wood',
        type: BlockType.RED_WOOD,
        color: { r: 140, g: 50, b: 50 },
    },{
        id: 'red_leaves',
        name: 'Red Leaves',
        type: BlockType.RED_LEAVES,
        color: { r: 200, g: 40, b: 40 },
    },{
        id: 'black_wood',
        name: 'Black Wood',
        type: BlockType.BLACK_WOOD,
        color: { r: 25, g: 25, b: 25 },
    },{
        id: 'black_leaves',
        name: 'Black Leaves',
        type: BlockType.BLACK_LEAVES,
        color: { r: 35, g: 35, b: 35 },
    },{
        id: 'green_wood',
        name: 'Green Wood',
        type: BlockType.GREEN_WOOD,
        color: { r: 50, g: 100, b: 50 },
    },{
        id: 'green_leaves',
        name: 'Green Leaves',
        type: BlockType.GREEN_LEAVES,
        color: { r: 0, g: 255, b: 0 },
    },{
        id: 'blue_wood',
        name: 'Blue Wood',
        type: BlockType.BLUE_WOOD,
        color: { r: 50, g: 70, b: 140 },
    },{
        id: 'blue_leaves',
        name: 'Blue Leaves',
        type: BlockType.BLUE_LEAVES,
        color: { r: 40, g: 100, b: 220 },
    },{
        id: 'orange_wood',
        name: 'Orange Wood',
        type: BlockType.ORANGE_WOOD,
        color: { r: 160, g: 80, b: 30 },
    },{
        id: 'orange_leaves',
        name: 'Orange Leaves',
        type: BlockType.ORANGE_LEAVES,
        color: { r: 240, g: 120, b: 40 },
    },{
        id: 'purple_wood',
        name: 'Purple Wood',
        type: BlockType.PURPLE_WOOD,
        color: { r: 100, g: 50, b: 140 },
    },{
        id: 'purple_leaves',
        name: 'Purple Leaves',
        type: BlockType.PURPLE_LEAVES,
        color: { r: 160, g: 60, b: 220 },
    },{
        id: 'yellow_wood',
        name: 'Yellow Wood',
        type: BlockType.YELLOW_WOOD,
        color: { r: 160, g: 140, b: 40 },
    },{
        id: 'yellow_leaves',
        name: 'Yellow Leaves',
        type: BlockType.YELLOW_LEAVES,
        color: { r: 230, g: 220, b: 80 },
    },{
        id: 'brown_wood',
        name: 'Brown Wood',
        type: BlockType.BROWN_WOOD,
        color: { r: 110, g: 70, b: 40 },
    },{
        id: 'brown_leaves',
        name: 'Brown Leaves',
        type: BlockType.BROWN_LEAVES,
        color: { r: 140, g: 100, b: 60 },
    },{
        id: 'frost_wood',
        name: 'Frost Wood',
        type: BlockType.FROST_WOOD,
        color: { r: 180, g: 220, b: 255 },
    },{
        id: 'ancient_wood',
        name: 'Ancient Wood',
        type: BlockType.ANCIENT_WOOD,
        color: { r: 60, g: 45, b: 35 },
    },{
        id: 'ancient_leaves',
        name: 'Ancient Leaves',
        type: BlockType.ANCIENT_LEAVES,
        color: { r: 255, g: 255, b: 255 }, // Glowing white leaves
    },{
        id: 'mine_shaft_wood',
        name: 'Mine Shaft Wood',
        type: BlockType.MINE_SHAFT_WOOD,
        color: { r: 75, g: 50, b: 35 }, // Dark brown
    },{ id: 'tropical_wood', name: 'Tropical Wood', type: BlockType.TROPICAL_WOOD, color: { r: 120, g: 60, b: 20 }, isSolid: true, hardness: 40 },{ id: 'tropical_leaves', name: 'Tropical Leaves', type: BlockType.TROPICAL_LEAVES, color: { r: 30, g: 150, b: 40 }, isSolid: false, hardness: 10 },
];