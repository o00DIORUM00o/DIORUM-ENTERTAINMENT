import * as fs from 'fs';
import * as path from 'path';

const craftingPath = path.resolve('./src/game/Crafting.ts');
const craftingText = fs.readFileSync(craftingPath, 'utf8');

const regex = /export const RECIPES: Record<string, CraftingRecipe> = ({[\s\S]*?\n});/;

const match = craftingText.match(regex);
if (match) {
    const recipesObjectString = match[1];
    
    // Create 'core_recipes.ts'
    const outPath = path.resolve('./src/game/content/recipes/core_recipes.ts');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    
    const coreRecipesContent = `import { CraftingRecipe } from '../../registries/RecipeRegistry';\n\nexport const CORE_RECIPES: CraftingRecipe[] = Object.values(${recipesObjectString});\n`;
    
    fs.writeFileSync(outPath, coreRecipesContent);
    console.log('Successfully extracted recipes to core_recipes.ts');
    
    // Now replace the Crafting.ts content
    let newCraftingText = craftingText.replace(regex, `import { RecipeRegistry } from './registries/RecipeRegistry';\n\n// We maintain a dummy export that dynamically queries the registry to preserve backward compatibility during refactoring.\nexport const RECIPES: Record<string, CraftingRecipe> = new Proxy({}, {\n    get: (target, prop: string) => {\n        if (prop === 'all') return RecipeRegistry.getAllAsRecord();\n        return RecipeRegistry.get(prop);\n    },\n    ownKeys: () => Object.keys(RecipeRegistry.getAllAsRecord()),\n    getOwnPropertyDescriptor: (target, key) => ({\n        enumerable: true,\n        configurable: true,\n        value: RecipeRegistry.get(key as string)\n    })\n}) as any;\n`);
    
    // It's probably easier if we just remove the old interface definitions from Crafting.ts too since they are in the registry now
    newCraftingText = newCraftingText.replace(/export interface CraftingIngredient {[\s\S]*?}\n\nexport interface CraftingRecipe {[\s\S]*?}\n\n/, `import { CraftingRecipe, CraftingIngredient } from './registries/RecipeRegistry';\nexport { CraftingRecipe, CraftingIngredient };\n\n`);

    fs.writeFileSync(craftingPath, newCraftingText);
    console.log('Successfully refactored Crafting.ts');
} else {
    console.error('Could not find RECIPES object in Crafting.ts');
}
