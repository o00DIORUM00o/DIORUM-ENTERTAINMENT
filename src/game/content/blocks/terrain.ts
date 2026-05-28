import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const TERRAIN_BLOCKS: BlockDef[] = [
    {
        id: 'grass',
        name: 'Grass',
        type: BlockType.GRASS,
        color: { r: 25, g: 90, b: 35 },
    },{
        id: 'dirt',
        name: 'Dirt',
        type: BlockType.DIRT,
        color: { r: 139, g: 69, b: 19 },
    },{
        id: 'dirt_path',
        name: 'Dirt Path',
        type: BlockType.DIRT_PATH,
        color: { r: 70, g: 45, b: 25 },
    },{
        id: 'paved_road',
        name: 'Paved Road',
        type: BlockType.PAVED_ROAD,
        color: { r: 75, g: 80, b: 85 },
    },{
        id: 'cobblestone_road',
        name: 'Cobblestone Road',
        type: BlockType.COBBLESTONE_ROAD,
        color: { r: 120, g: 120, b: 125 },
    },{
        id: 'ice',
        name: 'Ice',
        type: BlockType.ICE,
        color: { r: 173, g: 216, b: 230 },
    },{
        id: 'sand',
        name: 'Sand',
        type: BlockType.SAND,
        color: { r: 194, g: 178, b: 128 },
    },{
        id: 'mud',
        name: 'Mud',
        type: BlockType.MUD,
        color: { r: 85, g: 57, b: 34 },
    },{
        id: 'snow',
        name: 'Snow',
        type: BlockType.SNOW,
        color: { r: 255, g: 250, b: 250 },
    },{
        id: 'red_sand',
        name: 'Red Sand',
        type: BlockType.RED_SAND,
        color: { r: 204, g: 102, b: 85 },
    },{
        id: 'red_dirt',
        name: 'Red Dirt',
        type: BlockType.RED_DIRT,
        color: { r: 120, g: 40, b: 40 },
    },{
        id: 'black_sand',
        name: 'Black Sand',
        type: BlockType.BLACK_SAND,
        color: { r: 40, g: 40, b: 40 },
    },{
        id: 'black_dirt',
        name: 'Black Dirt',
        type: BlockType.BLACK_DIRT,
        color: { r: 20, g: 20, b: 20 },
    },{
        id: 'green_sand',
        name: 'Green Sand',
        type: BlockType.GREEN_SAND,
        color: { r: 100, g: 160, b: 100 },
    },{
        id: 'green_dirt',
        name: 'Green Dirt',
        type: BlockType.GREEN_DIRT,
        color: { r: 40, g: 80, b: 40 },
    },{
        id: 'blue_sand',
        name: 'Blue Sand',
        type: BlockType.BLUE_SAND,
        color: { r: 100, g: 140, b: 200 },
    },{
        id: 'blue_dirt',
        name: 'Blue Dirt',
        type: BlockType.BLUE_DIRT,
        color: { r: 40, g: 60, b: 120 },
    },{
        id: 'orange_sand',
        name: 'Orange Sand',
        type: BlockType.ORANGE_SAND,
        color: { r: 220, g: 150, b: 80 },
    },{
        id: 'orange_dirt',
        name: 'Orange Dirt',
        type: BlockType.ORANGE_DIRT,
        color: { r: 140, g: 70, b: 20 },
    },{
        id: 'purple_sand',
        name: 'Purple Sand',
        type: BlockType.PURPLE_SAND,
        color: { r: 160, g: 100, b: 200 },
    },{
        id: 'purple_dirt',
        name: 'Purple Dirt',
        type: BlockType.PURPLE_DIRT,
        color: { r: 80, g: 40, b: 120 },
    },{
        id: 'yellow_sand',
        name: 'Yellow Sand',
        type: BlockType.YELLOW_SAND,
        color: { r: 230, g: 210, b: 100 },
    },{
        id: 'yellow_dirt',
        name: 'Yellow Dirt',
        type: BlockType.YELLOW_DIRT,
        color: { r: 140, g: 120, b: 30 },
    },{
        id: 'brown_sand',
        name: 'Brown Sand',
        type: BlockType.BROWN_SAND,
        color: { r: 160, g: 120, b: 80 },
    },{
        id: 'brown_dirt',
        name: 'Brown Dirt',
        type: BlockType.BROWN_DIRT,
        color: { r: 100, g: 60, b: 30 },
    },{ id: 'sand_terror_altar', name: 'Sand Terror Altar', type: BlockType.SAND_TERROR_ALTAR, color: { r: 180, g: 150, b: 80 }, isSolid: true, hardness: 200, isIndestructible: true },
];