import * as fs from 'fs';
import * as path from 'path';

const constantsPath = path.resolve('./src/game/Constants.ts');
const btypePath = path.resolve('./src/game/constants/BlockType.ts');
const textConst = fs.readFileSync(constantsPath, 'utf8');

// Quick evaluator to grab the colors
const blockColorsMatch = textConst.match(/export const BLOCK_COLORS: Record<number, \{r: number, g: number, b: number\}> = (\{[\s\S]*?\n\});/);

// Find block properties
const btypeStr = fs.readFileSync(btypePath, 'utf8');
const typesMatch = btypeStr.match(/export enum BlockType \{([\s\S]*?)\}/);

const typeLines = typesMatch[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));

// Regex extract
const colorsText = blockColorsMatch ? blockColorsMatch[1] : '{}';

function safelyEvalColors(str: string) {
    try {
        // Evaluate the object by returning it
        const objStr = str.replace(/([0-9]+):/g, '"$1":').replace(/r:/g, '"r":').replace(/g:/g, '"g":').replace(/b:/g, '"b":');
        
        let cleaned = objStr.replace(/\/\/.*$/gm, ""); // remove comments
        cleaned = cleaned.replace(/,\s*\}/g, '}'); // trailing commas
        return JSON.parse(cleaned);
    } catch(e) {
        return {};
    }
}

const colorsObj = safelyEvalColors(colorsText);

const enumMap: Record<string, number> = {};
const reverseEnumMap: Record<number, string> = {};

for (const line of typeLines) {
    const parts = line.split('=');
    if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parseInt(parts[1].trim().replace(',', ''));
        enumMap[key] = value;
        reverseEnumMap[value] = key;
    }
}

// Logic for solid/indestructible/hardness
const nonSolid = new Set([
     'AIR', 'WATER',  'LAVA', 'DOOR_OPEN', 'TORCH', 'BONE_PILE_SPAWNER', 'WOODEN_STAIRCASE', 'SPIKE_FLOOR',
     'SPIKE_FLOOR_ACTIVE', 'PRESSURE_PLATE', 'PRESSURE_PLATE_ACTIVE', 'LEVER', 'LEVER_ON', 
     'WOOD_TILE', 'STONE_TILE', 'ARCANE_GATE', 'DUNGEON_FLOOR', 'ABYSSAL_FLOOR', 'STAIRS_DOWN', 'STAIRS_UP', 
     'CONVEYOR_BELT_N', 'CONVEYOR_BELT_S', 'CONVEYOR_BELT_E', 'CONVEYOR_BELT_W'
]);

const indestructible = new Set([
    'AIR', 'WATER', 'LAVA', 'SLIME_PUDDLE', 'DUNGEON_BRICK_INDESTRUCTIBLE', 'DUNGEON_BRICK_CRACKED', 
    'DUNGEON_BRICK_HARD', 'DUNGEON_BRICK', 'DUNGEON_FLOOR', 'HEAVY_STONE', 'ABYSSAL_GATEWAY', 
    'ABYSSAL_BRICK', 'ABYSSAL_FLOOR', 'ARCANE_GATE', 'DEMON_PORTAL', 'STAIRS_UP', 'STAIRS_DOWN', 
    'DOOR_BOSS', 'ALTAR_DIVINE', 'ALTAR_CORRUPTED'
]);

// Hardness map
function getHardness(k: string) {
    if (k === 'TRUNK') return 100;
    if (k === 'OBSIDIAN') return 200;
    if (k === 'RUBY' || k === 'EMERALD' || k === 'BLACK_DIAMOND') return 150;
    if (k === 'CRYSTAL') return 80;
    if (k === 'MUSHROOM_STEM' || k === 'MUSHROOM_CAP') return 20;
    if (k === 'TORCH' || k === 'CAMPFIRE') return 5;
    return 50;
}

let generatedFile = `import { BlockDef } from '../../registries/BlockRegistry';\n`;
generatedFile += `import { BlockType } from '../../constants/BlockType';\n\n`;
generatedFile += `export const CORE_BLOCKS: BlockDef[] = [\n`;

for (const [key, value] of Object.entries(enumMap)) {
    const isS = !nonSolid.has(key);
    const isInd = indestructible.has(key);
    const h = getHardness(key);
    const c = colorsObj[value];
    
    // Convert to title case for name
    const titleName = key.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

    let blockObj = `    {\n`;
    blockObj += `        id: '${key.toLowerCase()}',\n`;
    blockObj += `        name: '${titleName}',\n`;
    blockObj += `        type: BlockType.${key},\n`;
    if (!isS) blockObj += `        isSolid: false,\n`;
    if (isInd) blockObj += `        isIndestructible: true,\n`;
    if (h !== 50) blockObj += `        hardness: ${h},\n`;
    if (c) blockObj += `        color: { r: ${c.r}, g: ${c.g}, b: ${c.b} },\n`;
    blockObj += `    },\n`;
    
    generatedFile += blockObj;
}
generatedFile += `];\n`;

const outDir = path.resolve('./src/game/content/blocks');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'core_blocks.ts'), generatedFile);

console.log('Successfully generated core_blocks.ts!');
