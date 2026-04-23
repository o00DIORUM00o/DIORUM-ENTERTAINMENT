import * as fs from "fs";
import * as path from "path";

const file = path.resolve("src/game/World.ts");
let content = fs.readFileSync(file, "utf8");

const chunkStart = content.indexOf("export class Chunk {");
let chunkEnd = content.indexOf("export class World {");

if (chunkStart !== -1 && chunkEnd !== -1) {
    const replacement = "import { Chunk } from './world/Chunk';\nimport { ChunkManager } from './world/ChunkManager';\nimport { TerrainGenerator } from './world/TerrainGenerator';\n\n";
    content = content.replace(content.substring(chunkStart, chunkEnd), replacement);
    fs.writeFileSync(file, content);
    console.log("Chunk removed from World.ts!");
} else {
    // If we missed it because we already did the imports earlier, we might have multiple definitions? 
    // Wait, did we actually already import Chunk in the previous script?
    console.log("Not found, checking if already replaced...");
}
