import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/world/TerrainGenerator.ts");
let content = fs.readFileSync(file, "utf8");

content = content.replace(/applyDungeons\(\) \{/, "static applyDungeons(chunk: Chunk) {\n        const { cx, cy, activePlanet } = chunk;");

content = content.replace(/generateAbyssalRealm\(\) \{/, "static generateAbyssalRealm(chunk: Chunk) {\n        const { cx, cy } = chunk;");

content = content.replace(/carveCorridor\(x1: number, y1: number, x2: number, y2: number, z: number\) \{/, "static carveCorridor(chunk: Chunk, x1: number, y1: number, x2: number, y2: number, z: number) {\n        const { cx, cy } = chunk;");

content = content.replace(/carveAbyssalCorridor\(x1: number, y1: number, x2: number, y2: number, z: number, localCx: number, localCy: number\) \{/, "static carveAbyssalCorridor(chunk: Chunk, x1: number, y1: number, x2: number, y2: number, z: number, localCx: number, localCy: number) {\n        const { cx, cy } = chunk;");

content = content.replace(/static setBlockSafe\(chunk: Chunk, lx: number, ly: number, z: number, type: BlockType\) \{.*?\{.*?\{.*?\{.*?\{/s, "");

content = content.replace(/setBlockSafe\(lx: number, ly: number, z: number, type: BlockType\) \{/, "static setBlockSafe(chunk: Chunk, lx: number, ly: number, z: number, type: BlockType) {");

content = content.replace(/this\.setBlock\(/g, "chunk.setBlock(");
content = content.replace(/this\.setBlockSafe\(/g, "TerrainGenerator.setBlockSafe(chunk, ");

content = content.replace(/this\.cx/g, "cx");
content = content.replace(/this\.cy/g, "cy");
content = content.replace(/this\.blocks/g, "chunk.blocks");
content = content.replace(/this\.heightMap/g, "chunk.heightMap");
content = content.replace(/this\.activePlanet/g, "activePlanet");

// For buildStructureLocal which is already static in my replace, let's fix the missing unpack
content = content.replace(/static buildStructureLocal\(chunk: Chunk, id: string, startX: number, startY: number, startZ: number\) \{/, "static buildStructureLocal(chunk: Chunk, id: string, startX: number, startY: number, startZ: number) {\n        const { cx, cy, activePlanet } = chunk;");

fs.writeFileSync(file, content);
console.log("Fixed!");
