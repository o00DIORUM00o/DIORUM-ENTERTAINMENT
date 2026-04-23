import * as fs from 'fs';
import * as path from 'path';

const appPath = path.resolve('./src/App.tsx');
let appText = fs.readFileSync(appPath, 'utf8');

appText = appText.replace(/import \{ RECIPES \} from '\.\/game\/Crafting';/, `import { RecipeRegistry } from './game/registries/RecipeRegistry';`);
appText = appText.replace(/Object\.values\(RECIPES\)/g, `RecipeRegistry.getAll()`);

fs.writeFileSync(appPath, appText);


const enginePath = path.resolve('./src/game/Engine.ts');
let engineText = fs.readFileSync(enginePath, 'utf8');

engineText = engineText.replace(/import \{ RECIPES \} from '\.\/Crafting';\n/, '');
engineText = engineText.replace(/for \(const recipeId in RECIPES\) \{/g, `for (const recipe of RecipeRegistry.getAll()) {`);
engineText = engineText.replace(/const recipe = RECIPES\[recipeId\];/g, `// const recipe solved via loop`);

if (!engineText.includes(`import { RecipeRegistry }`)) {
    engineText = `import { RecipeRegistry } from './registries/RecipeRegistry';\n` + engineText;
}

fs.writeFileSync(enginePath, engineText);

const playerPath = path.resolve('./src/game/Player.ts');
let playerText = fs.readFileSync(playerPath, 'utf8');

playerText = playerText.replace(/import \{ RECIPES \} from '\.\/Crafting';\n/, '');
playerText = playerText.replace(/const recipe = RECIPES\[recipeId\];/g, `const recipe = RecipeRegistry.get(recipeId);`);

if (!playerText.includes(`import { RecipeRegistry }`)) {
    playerText = `import { RecipeRegistry } from './registries/RecipeRegistry';\n` + playerText;
}

fs.writeFileSync(playerPath, playerText);


const craftingPath = path.resolve('./src/game/Crafting.ts');
let craftingText = fs.readFileSync(craftingPath, 'utf8');
// remove the export RECIPES
craftingText = craftingText.replace(/\/\/ We maintain a dummy export[\s\S]*\}\) as any;\n/m, '');
fs.writeFileSync(craftingPath, craftingText);

console.log('Successfully eliminated RECIPES export and switched to RecipeRegistry.');
