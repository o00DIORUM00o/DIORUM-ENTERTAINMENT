import * as fs from 'fs';
import * as path from 'path';

const playerPath = path.resolve('./src/game/Player.ts');
let text = fs.readFileSync(playerPath, 'utf8');

const targetToReplace = `block === BlockType.TRUNK ? 100 :
                                            block === BlockType.OBSIDIAN ? 200 :
                                            (block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) ? 150 :
                                            block === BlockType.CRYSTAL ? 80 :
                                            (block === BlockType.MUSHROOM_STEM || block === BlockType.MUSHROOM_CAP) ? 20 :
                                            (block === BlockType.TORCH || block === BlockType.CAMPFIRE) ? 5 : 50`;

const target1 = `block === BlockType.TRUNK ? 100 :
                                    block === BlockType.OBSIDIAN ? 200 :
                                    (block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) ? 150 :
                                    block === BlockType.CRYSTAL ? 80 :
                                    (block === BlockType.MUSHROOM_STEM || block === BlockType.MUSHROOM_CAP) ? 20 :
                                    (block === BlockType.TORCH || block === BlockType.CAMPFIRE) ? 5 : 50`;

const target2 = `block === BlockType.TRUNK ? 100 :
                                                block === BlockType.OBSIDIAN ? 200 :
                                                (block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) ? 150 :
                                                block === BlockType.CRYSTAL ? 80 :
                                                (block === BlockType.MUSHROOM_STEM || block === BlockType.MUSHROOM_CAP) ? 20 :
                                                (block === BlockType.TORCH || block === BlockType.CAMPFIRE) ? 5 : 50`;

const target3 = `block === BlockType.TRUNK ? 100 :
                                                block === BlockType.OBSIDIAN ? 200 :
                                                (block === BlockType.RUBY || block === BlockType.EMERALD || block === BlockType.BLACK_DIAMOND) ? 150 :
                                                block === BlockType.CRYSTAL ? 80 :
                                                (block === BlockType.MUSHROOM_STEM || block === BlockType.MUSHROOM_CAP) ? 20 :
                                                (block === BlockType.TORCH || block === BlockType.CAMPFIRE) ? 5 : 50`;


text = text.replace(targetToReplace, 'BlockRegistry.getHardness(block)');
text = text.replace(targetToReplace, 'BlockRegistry.getHardness(block)');
text = text.replace(target1, 'BlockRegistry.getHardness(block)');
text = text.replace(target2, 'BlockRegistry.getHardness(block)');
text = text.replace(target3, 'BlockRegistry.getHardness(block)');

// Also make sure Player.ts imports BlockRegistry
if (!text.includes('BlockRegistry')) {
    text = text.replace(/import \{ World, BlockType, isSolid, isIndestructible, getLootForBlock \} from '\.\/World';/, `import { World, BlockType, isSolid, isIndestructible, getLootForBlock } from './World';\nimport { BlockRegistry } from './registries/BlockRegistry';`);
}

fs.writeFileSync(playerPath, text);

console.log('Successfully applied hardness registry to player');
