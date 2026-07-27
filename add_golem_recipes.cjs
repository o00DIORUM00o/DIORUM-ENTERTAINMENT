const fs = require('fs');

const path = 'src/game/content/recipes/core_recipes.ts';
let content = fs.readFileSync(path, 'utf8');

const golems = [
    { color: 'red', name: 'Red' },
    { color: 'green', name: 'Green' },
    { color: 'blue', name: 'Blue' },
    { color: 'yellow', name: 'Yellow' },
    { color: 'orange', name: 'Orange' },
    { color: 'purple', name: 'Purple' },
    { color: 'black', name: 'Black' }
];

let newRecipes = '';

golems.forEach(g => {
    newRecipes += `
    {
        id: 'recipe_${g.color}_metal_golem',
        name: '${g.name} Metal Golem',
        description: 'Craft ${g.name} Metal Golem',
        ingredients: [
            { id: '${g.color}_metal_block', quantity: 5 },
        ],
        result: { id: '${g.color}_metal_golem_spawner', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },`;
});

// Also add regular metal golems
const regGolems = [
    { color: 'copper', name: 'Copper' },
    { color: 'gold', name: 'Gold' },
    { color: 'silver', name: 'Silver' }
];

regGolems.forEach(g => {
    newRecipes += `
    {
        id: 'recipe_${g.color}_golem',
        name: '${g.name} Golem',
        description: 'Craft ${g.name} Golem',
        ingredients: [
            { id: '${g.color}_block', quantity: 5 },
        ],
        result: { id: '${g.color}_golem_spawner', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },`;
});

const target = `export const CORE_RECIPES: CraftingRecipe[] = [`;
if (content.indexOf(target) !== -1) {
    content = content.replace(target, target + newRecipes);
    fs.writeFileSync(path, content);
    console.log("Golem Recipes added!");
} else {
    console.log("Could not find target!");
}
