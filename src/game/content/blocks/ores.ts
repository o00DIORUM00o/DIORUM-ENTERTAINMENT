import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const ORES_BLOCKS: BlockDef[] = [
    {
        id: 'copper_ore',
        name: 'Copper Ore',
        type: BlockType.COPPER_ORE,
        color: { r: 184, g: 115, b: 51 },
    },{
        id: 'iron_ore',
        name: 'Iron Ore',
        type: BlockType.IRON_ORE,
        color: { r: 161, g: 157, b: 148 },
    },{
        id: 'green_metal_ore',
        name: 'Green Metal Ore',
        type: BlockType.GREEN_METAL_ORE,
        color: { r: 46, g: 139, b: 87 },
    },{
        id: 'red_metal_ore',
        name: 'Red Metal Ore',
        type: BlockType.RED_METAL_ORE,
        color: { r: 178, g: 34, b: 34 },
    },{
        id: 'mithril_ore',
        name: 'Mithril Ore',
        type: BlockType.MITHRIL_ORE,
        color: { r: 135, g: 206, b: 250 },
    },{
        id: 'coal_ore',
        name: 'Coal Ore',
        type: BlockType.COAL_ORE,
        color: { r: 40, g: 40, b: 40 },
    },{
        id: 'ruby',
        name: 'Ruby',
        type: BlockType.RUBY,
        hardness: 150,
        color: { r: 220, g: 20, b: 60 },
    },{
        id: 'emerald',
        name: 'Emerald',
        type: BlockType.EMERALD,
        hardness: 150,
        color: { r: 46, g: 204, b: 113 },
    },{
        id: 'black_diamond',
        name: 'Black Diamond',
        type: BlockType.BLACK_DIAMOND,
        hardness: 150,
        color: { r: 10, g: 10, b: 10 },
    },{
        id: 'voidsight_ore',
        name: 'Voidsight Ore',
        type: BlockType.VOIDSIGHT_ORE,
        hardness: 250,
        color: { r: 0, g: 255, b: 255 }, // Neon blue/cyan
    },{
        id: 'silver_ore',
        name: 'Silver Ore',
        type: BlockType.SILVER_ORE,
        color: { r: 192, g: 192, b: 192 },
    },{
        id: 'gold_ore',
        name: 'Gold Ore',
        type: BlockType.GOLD_ORE,
        color: { r: 255, g: 215, b: 0 },
    },{
        id: 'platinum_ore',
        name: 'Platinum Ore',
        type: BlockType.PLATINUM_ORE,
        color: { r: 229, g: 228, b: 226 },
    },{
        id: 'adamantium_ore',
        name: 'Adamantium Ore',
        type: BlockType.ADAMANTIUM_ORE,
        color: { r: 119, g: 136, b: 153 },
    },{
        id: 'eternium_ore',
        name: 'Eternium Ore',
        type: BlockType.ETERNIUM_ORE,
        color: { r: 216, g: 191, b: 216 },
    },{
        id: 'black_metal_ore',
        name: 'Black Metal Ore',
        type: BlockType.BLACK_METAL_ORE,
        color: { r: 40, g: 40, b: 45 },
    },{
        id: 'blue_metal_ore',
        name: 'Blue Metal Ore',
        type: BlockType.BLUE_METAL_ORE,
        color: { r: 65, g: 105, b: 225 },
    },{
        id: 'orange_metal_ore',
        name: 'Orange Metal Ore',
        type: BlockType.ORANGE_METAL_ORE,
        color: { r: 255, g: 140, b: 0 },
    },{
        id: 'purple_metal_ore',
        name: 'Purple Metal Ore',
        type: BlockType.PURPLE_METAL_ORE,
        color: { r: 147, g: 112, b: 219 },
    },{
        id: 'yellow_metal_ore',
        name: 'Yellow Metal Ore',
        type: BlockType.YELLOW_METAL_ORE,
        color: { r: 255, g: 255, b: 100 },
    },{
        id: 'plutonium_ore',
        name: 'Plutonium Ore',
        type: BlockType.PLUTONIUM_ORE,
        color: { r: 50, g: 205, b: 50 },
    },{
        id: 'diamond',
        name: 'Diamond',
        type: BlockType.DIAMOND,
        color: { r: 185, g: 242, b: 255 },
    },{
        id: 'green_diamond',
        name: 'Green Diamond',
        type: BlockType.GREEN_DIAMOND,
        color: { r: 150, g: 255, b: 150 },
    },{
        id: 'purple_diamond',
        name: 'Purple Diamond',
        type: BlockType.PURPLE_DIAMOND,
        color: { r: 200, g: 150, b: 255 },
    },{ id: 'voidsight_ore', name: 'Voidsight Ore', type: BlockType.VOIDSIGHT_ORE, color: { r: 150, g: 0, b: 255 }, isSolid: true, hardness: 200 },{ id: 'silver_ore', name: 'Silver Ore', type: BlockType.SILVER_ORE, color: { r: 192, g: 192, b: 192 }, isSolid: true, hardness: 50 },{ id: 'gold_ore', name: 'Gold Ore', type: BlockType.GOLD_ORE, color: { r: 255, g: 215, b: 0 }, isSolid: true, hardness: 50 },{ id: 'platinum_ore', name: 'Platinum Ore', type: BlockType.PLATINUM_ORE, color: { r: 229, g: 228, b: 226 }, isSolid: true, hardness: 50 },{ id: 'adamantium_ore', name: 'Adamantium Ore', type: BlockType.ADAMANTIUM_ORE, color: { r: 100, g: 149, b: 237 }, isSolid: true, hardness: 50 },{ id: 'eternium_ore', name: 'Eternium Ore', type: BlockType.ETERNIUM_ORE, color: { r: 255, g: 105, b: 180 }, isSolid: true, hardness: 50 },{ id: 'black_metal_ore', name: 'Black Metal Ore', type: BlockType.BLACK_METAL_ORE, color: { r: 50, g: 50, b: 50 }, isSolid: true, hardness: 50 },{ id: 'blue_metal_ore', name: 'Blue Metal Ore', type: BlockType.BLUE_METAL_ORE, color: { r: 0, g: 0, b: 255 }, isSolid: true, hardness: 50 },{ id: 'orange_metal_ore', name: 'Orange Metal Ore', type: BlockType.ORANGE_METAL_ORE, color: { r: 255, g: 165, b: 0 }, isSolid: true, hardness: 50 },{ id: 'purple_metal_ore', name: 'Purple Metal Ore', type: BlockType.PURPLE_METAL_ORE, color: { r: 128, g: 0, b: 128 }, isSolid: true, hardness: 50 },{ id: 'yellow_metal_ore', name: 'Yellow Metal Ore', type: BlockType.YELLOW_METAL_ORE, color: { r: 255, g: 255, b: 0 }, isSolid: true, hardness: 50 },{ id: 'plUTONIUM_ore', name: 'Plutonium Ore', type: BlockType.PLUTONIUM_ORE, color: { r: 0, g: 255, b: 0 }, isSolid: true, hardness: 50 },{ id: 'fossil_ore', name: 'Fossil Ore', type: BlockType.FOSSIL_ORE, color: { r: 200, g: 180, b: 150 }, isSolid: true, hardness: 60 },{ id: 'clay_ore', name: 'Raw Clay Deposit', type: BlockType.CLAY_ORE, color: { r: 180, g: 120, b: 90 }, isSolid: true, hardness: 50 },
];