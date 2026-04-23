const fs = require('fs');
const lines = fs.readFileSync('src/game/Renderer.ts', 'utf8').split('\n');

let blockLogic = [];
let capture = false;
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('// Draw Mount First if mounted')) {
        capture = true;
        startLine = i;
    }
    if (capture) {
        blockLogic.push(line);
    }
    if (capture && line.includes('// Draw Dropped Items')) {
        capture = false;
        endLine = i;
        blockLogic.pop(); // remove the line that triggered the condition
        break;
    }
}

// Ensure PlayerRenderer has imports 
const chunk = blockLogic.join('\n');
const template = `import { TILE_SIZE, BLOCK_COLORS } from '../Constants';
import { BlockType } from '../World';
import { SPELLS } from '../Inventory';
import { RenderRegistry } from '../registries/RenderRegistry';
import { Renderer } from '../Renderer';

export class PlayerRenderer {
    static draw(ctx: CanvasRenderingContext2D, player: any, engine: any, halfW: number, halfH: number) {
${chunk}
    }
}
`;

fs.writeFileSync('src/game/renderers/PlayerRenderer.ts', template);

const newLines = [
    ...lines.slice(0, startLine),
    "        PlayerRenderer.draw(ctx, player, engine, halfW, halfH);",
    ...lines.slice(endLine)
];

const insertIdx = newLines.findIndex(l => l.includes('import { BlockRenderRegistry')) - 1;
newLines.splice(insertIdx, 0, "import { PlayerRenderer } from './renderers/PlayerRenderer';");

fs.writeFileSync('src/game/Renderer.ts', newLines.join('\n'));
console.log("Extracted player logic");
