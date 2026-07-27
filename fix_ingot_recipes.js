const fs = require('fs');

const path = 'src/game/content/recipes/core_recipes.ts';
let content = fs.readFileSync(path, 'utf8');

const ingotRegex = /id:\s*'recipe_([a-zA-Z0-9_]+)_ingot',[\s\S]*?ingredients:\s*\[[\s\S]*?\],/g;

content = content.replace(ingotRegex, (match, type) => {
    // some types have weird casing like plUTONIUM
    const oreId = type + '_ore';
    
    // find the ingredients section and replace it
    const ingredientsRegex = /ingredients:\s*\[[\s\S]*?\],/;
    
    const newIngredients = `ingredients: [
            { id: '${oreId}', quantity: 1 },
            { id: 'coal', quantity: 1 },
        ],`;
        
    return match.replace(ingredientsRegex, newIngredients);
});

fs.writeFileSync(path, content);
console.log('Fixed ingot recipes');
