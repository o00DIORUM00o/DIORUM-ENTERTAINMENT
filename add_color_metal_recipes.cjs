const fs = require('fs');

const path = 'src/game/content/recipes/core_recipes.ts';
let content = fs.readFileSync(path, 'utf8');

const colors = [
    { color: 'green', name: 'Green' },
    { color: 'red', name: 'Red' },
    { color: 'blue', name: 'Blue' },
    { color: 'yellow', name: 'Yellow' },
    { color: 'orange', name: 'Orange' },
    { color: 'purple', name: 'Purple' },
    { color: 'black', name: 'Black' }
];

let newRecipes = '';

colors.forEach(c => {
    const ingot = `${c.color}_metal_ingot`;

    // Weapons
    // Boomerang (Green and Red are already there, we can just skip or redefine them, redefine might cause duplicate keys. Let's check)
    // Dagger
    // Staff
    // Sword (already there, wait let me check if they exist)
    
    // Armors
    // Helmet
    // Chestplate
    // Greaves
    
    if (c.color !== 'green' && c.color !== 'red') {
        newRecipes += `
    {
        id: 'recipe_${c.color}_metal_boomerang',
        name: '${c.name} Metal Boomerang',
        description: 'Craft ${c.name} Metal Boomerang',
        ingredients: [
            { id: '${ingot}', quantity: 5 },
        ],
        result: { id: '${c.color}_metal_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },`;
    }

    newRecipes += `
    {
        id: 'recipe_${c.color}_metal_dagger',
        name: '${c.name} Metal Dagger',
        description: 'Craft ${c.name} Metal Dagger',
        ingredients: [
            { id: '${ingot}', quantity: 3 },
            { id: 'wood', quantity: 1 }
        ],
        result: { id: '${c.color}_metal_dagger', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_${c.color}_metal_staff',
        name: '${c.name} Metal Staff',
        description: 'Craft ${c.name} Metal Staff',
        ingredients: [
            { id: '${ingot}', quantity: 5 },
            { id: 'wood', quantity: 2 }
        ],
        result: { id: '${c.color}_metal_staff', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_${c.color}_metal_helmet',
        name: '${c.name} Metal Helmet',
        description: 'Craft ${c.name} Metal Helmet',
        ingredients: [
            { id: '${ingot}', quantity: 5 },
        ],
        result: { id: '${c.color}_metal_helmet', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_${c.color}_metal_chestplate',
        name: '${c.name} Metal Chestplate',
        description: 'Craft ${c.name} Metal Chestplate',
        ingredients: [
            { id: '${ingot}', quantity: 8 },
        ],
        result: { id: '${c.color}_metal_chestplate', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_${c.color}_metal_greaves',
        name: '${c.name} Metal Greaves',
        description: 'Craft ${c.name} Metal Greaves',
        ingredients: [
            { id: '${ingot}', quantity: 6 },
        ],
        result: { id: '${c.color}_metal_greaves', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },`;
});

const target = `export const CORE_RECIPES: CraftingRecipe[] = [`;
if (content.indexOf(target) !== -1) {
    content = content.replace(target, target + newRecipes);
    fs.writeFileSync(path, content);
    console.log("Recipes added!");
} else {
    console.log("Could not find target!");
}
