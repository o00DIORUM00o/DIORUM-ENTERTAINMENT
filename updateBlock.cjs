const fs = require('fs');

const lines = fs.readFileSync('src/game/Renderer.ts', 'utf8').split('\n');

let blockLogic = [];
let capture = false;
let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('// Add stripes for bee hive')) {
        capture = true;
        startLine = i;
    }
    if (capture) {
        blockLogic.push(line);
    }
    if (capture && line.includes('// Draw grid lines for definition')) {
        capture = false;
        endLine = i;
        blockLogic.pop(); // remove the grid lines comment line
        break;
    }
}

// Write the original file back out without the chunk!
const newLines = [
    ...lines.slice(0, startLine),
    "                const renderer = BlockRenderRegistry.get(block);",
    "                if (renderer) {",
    "                    renderer.draw({ ctx, TILE_SIZE, entity: null, screenX, screenY, halfW, halfH, time: performance.now(), block, shade });",
    "                }",
    ...lines.slice(endLine)
];

// Now build BlockRenderer.ts out of the logic chunk we extracted.
// It's a bunch of "if (block === Y) { ... } else if (block === X) { ... }"
const chunk = blockLogic.join('\n');
const template = `import { BlockRenderRegistry, BlockRenderContext } from '../registries/BlockRenderRegistry';
import { BlockType } from '../World';
import { BLOCK_COLORS } from '../Constants';

export function defineBlockRenderers() {
    // A single fallback switch based block renderer for all the legacy blocks
    // Ideally these would be split by specific blocks but for now this acts as a macro-renderer
    const legacyRenderer = {
        draw: (context: BlockRenderContext) => {
            const { ctx, screenX, screenY, TILE_SIZE, block, shade } = context;
${chunk}
        }
    };

    // We'll iterate all known block types and point them to the legacy renderer
    // In the future these can be overridden independently
    Object.values(BlockType).forEach((type) => {
        BlockRenderRegistry.register(type as BlockType, legacyRenderer);
    });
}
`;

fs.writeFileSync('src/game/Renderer.ts', newLines.join('\n'));
fs.writeFileSync('src/game/renderers/BlockRenderer.ts', template);

let renderLines = fs.readFileSync('src/game/Renderer.ts', 'utf8').split('\n');
// add imports to Renderer.ts
const importsToInsert = [
    "import { BlockRenderRegistry } from './registries/BlockRenderRegistry';",
    "import { defineBlockRenderers } from './renderers/BlockRenderer';",
];

let injected = false;
for (let i = 0; i < renderLines.length; i++) {
    if (renderLines[i].includes('// Ensure all Renderers are loaded') && !injected) {
        renderLines.splice(i, 0, ...importsToInsert);
        injected = true;
        renderLines.splice(i+3, 0, "defineBlockRenderers();");
        break;
    }
}
fs.writeFileSync('src/game/Renderer.ts', renderLines.join('\n'));

console.log("Success");
