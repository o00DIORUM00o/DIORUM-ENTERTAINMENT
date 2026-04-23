import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/World.ts");
let content = fs.readFileSync(file, "utf8");

const chunkStart = content.indexOf("export class Chunk {");
const worldStart = content.indexOf("export class World {");

if (chunkStart !== -1 && worldStart !== -1) {
    let chunkClassStr = content.substring(chunkStart, worldStart);
    
    // Convert chunkClassStr into TerrainGenerator methods.
    let tgStr = chunkClassStr.replace(/export class Chunk \{/, "export class TerrainGenerator {");
    
    // constructor -> generate(chunk: Chunk)
    tgStr = tgStr.replace(/constructor\(public cx: number, public cy: number, public activePlanet: string = 'THRAE'\) \{[\s\S]*?generate\(\) \{/, "static generate(chunk: Chunk) {\n        const { cx, cy, activePlanet } = chunk;");
    
    // Replace all instances of `this.` with `chunk.` EXCEPT inside generate where we might want chunk.cx
    tgStr = tgStr.replace(/this\./g, "chunk.");
    tgStr = tgStr.replace(/chunk\.cx/g, "cx");
    tgStr = tgStr.replace(/chunk\.cy/g, "cy");
    tgStr = tgStr.replace(/chunk\.activePlanet/g, "activePlanet");
    
    tgStr = tgStr.replace(/chunk\.applyDungeons/g, "TerrainGenerator.applyDungeons");
    tgStr = tgStr.replace(/chunk\.generateAbyssalRealm/g, "TerrainGenerator.generateAbyssalRealm");
    tgStr = tgStr.replace(/chunk\.carveCorridor/g, "TerrainGenerator.carveCorridor");
    tgStr = tgStr.replace(/chunk\.carveAbyssalCorridor/g, "TerrainGenerator.carveAbyssalCorridor");
    tgStr = tgStr.replace(/chunk\.buildStructureLocal/g, "TerrainGenerator.buildStructureLocal");
    
    // Fix method parameters for the static methods
    // Wait, adding chunk explicitly is error-friendly, let's just do it with regex
    tgStr = tgStr.replace(/generateAbyssalRealm\(\)/, "static generateAbyssalRealm(chunk: Chunk)");
    tgStr = tgStr.replace(/applyDungeons\(\)/, "static applyDungeons(chunk: Chunk)");
    tgStr = tgStr.replace(/buildStructureLocal\(/, "static buildStructureLocal(chunk: Chunk, ");
    tgStr = tgStr.replace(/carveCorridor\(/, "static carveCorridor(chunk: Chunk, ");
    tgStr = tgStr.replace(/carveAbyssalCorridor\(/, "static carveAbyssalCorridor(chunk: Chunk, ");
    
    // Also we need `const { cx, cy, activePlanet } = chunk;` at the start of these methods
    const unpackStr = "{\n        const { cx, cy, activePlanet } = chunk;\n";
    tgStr = tgStr.replace(/static generateAbyssalRealm\(chunk: Chunk\) \{/g, "static generateAbyssalRealm(chunk: Chunk) " + unpackStr);
    tgStr = tgStr.replace(/static applyDungeons\(chunk: Chunk\) \{/g, "static applyDungeons(chunk: Chunk) " + unpackStr);
    
    // carveCorridor, carveAbyssalCorridor, buildStructureLocal don't use 'activePlanet' much but `cx`, `cy` yes.
    tgStr = tgStr.replace(/static carveCorridor\(chunk: Chunk, (.*?)\) \{/g, "static carveCorridor(chunk: Chunk, $1) " + unpackStr);
    tgStr = tgStr.replace(/static carveAbyssalCorridor\(chunk: Chunk, (.*?)\) \{/g, "static carveAbyssalCorridor(chunk: Chunk, $1) " + unpackStr);
    tgStr = tgStr.replace(/static buildStructureLocal\(chunk: Chunk, (.*?)\) \{/g, "static buildStructureLocal(chunk: Chunk, $1) " + unpackStr);

    
    // Remove getBlock and setBlock from TG since they belong to Chunk
    tgStr = tgStr.replace(/chunk\.getBlock\(/g, "TerrainGenerator.getBlock(chunk, ");
    tgStr = tgStr.replace(/chunk\.setBlock\(/g, "chunk.setBlock("); // Chunk still has setBlock
    tgStr = tgStr.replace(/chunk\.setBlockSafe\(/g, "TerrainGenerator.setBlockSafe(chunk, ");
    
    // setBlockSafe definition needs chunk arg
    tgStr = tgStr.replace(/setBlockSafe\(/, "static setBlockSafe(chunk: Chunk, ");
    
    // Strip trailing getBlock/setBlock 
    const gbIndex = tgStr.indexOf("getBlock(x: number");
    if(gbIndex !== -1) {
        tgStr = tgStr.substring(0, gbIndex) + "}\n";
    }

    // Write TerrainGenerator.ts
    const imports = `import { PlanetRegistry } from '../registries/PlanetRegistry';
import { StructureRegistry } from '../registries/StructureRegistry';
import { createNoise2D } from 'simplex-noise';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { BlockType } from '../constants/BlockType';
import { Chunk } from './Chunk';

const noise2D = createNoise2D();

function getBlock(chunk: Chunk, x: number, y: number, z: number): BlockType {
    return chunk.getBlock(x, y, z) as BlockType;
}

`;
    
    tgStr = tgStr.replace(/TerrainGenerator\.getBlock\(chunk, /g, "getBlock(chunk, ");

    fs.writeFileSync(path.resolve("src/game/world/TerrainGenerator.ts"), imports + tgStr);

    console.log("Extracted TerrainGenerator.ts");
}
