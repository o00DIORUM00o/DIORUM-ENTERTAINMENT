import { ITEMS } from '../../Inventory';
import { CraftingRecipe } from '../../registries/RecipeRegistry';

export const CORE_RECIPES: CraftingRecipe[] = [];

// A basic procedural recipe generator for all items
for (const [id, item] of Object.entries(ITEMS)) {
    if (id === 'wood' || id === 'stone' || id === 'dirt' || id === 'copper_ore' || id === 'iron_ore' || id === 'green_metal_ore' || id === 'red_metal_ore' || id === 'mithril_ore' || id === 'diamond' || id === 'ruby' || id === 'emerald' || id === 'black_diamond' || id === 'coal_ore' || id.includes('seed')) {
        continue; // Uncraftable raw materials
    }
    
    let ingredients = [];
    let requiredStation = null;
    let requiredTalent = null;
    
    if (id === 'void_lord_altar') {
        ingredients.push({ id: 'obsidian', quantity: 20 });
        ingredients.push({ id: 'black_diamond', quantity: 5 });
        requiredStation = 'masonry_table';
    }
    else if (id === 'yeti_fur_coat') {
        ingredients.push({ id: 'yeti_fur', quantity: 15 });
        ingredients.push({ id: 'string', quantity: 5 });
        requiredStation = 'leather_station';
        requiredTalent = { id: 'leather_crafting', level: 2 };
    }
    else if (id === 'staff_glacial') {
        ingredients.push({ id: 'frozen_wood', quantity: 10 });
        ingredients.push({ id: 'glacial_crystal', quantity: 3 });
        requiredStation = 'carpenters_bench';
    }
    else if (id === 'amber_sword') {
        ingredients.push({ id: 'amber', quantity: 12 });
        ingredients.push({ id: 'tropical_wood', quantity: 3 });
        requiredStation = 'anvil';
        requiredTalent = { id: 'smithing', level: 3 };
    }
    else if (id === 'amber_greatsword') {
        ingredients.push({ id: 'amber', quantity: 24 });
        ingredients.push({ id: 'tropical_wood', quantity: 5 });
        requiredStation = 'anvil';
        requiredTalent = { id: 'smithing', level: 3 };
    }
    else if (id === 'amber_amulet') {
        ingredients.push({ id: 'amber', quantity: 5 });
        ingredients.push({ id: 'gold_ingot', quantity: 1 });
        requiredStation = 'anvil';
    }
    else if (id === 'amber_ring') {
        ingredients.push({ id: 'amber', quantity: 3 });
        ingredients.push({ id: 'gold_ingot', quantity: 1 });
        requiredStation = 'anvil';
    }
    else if (id === 'bone_club') {
        ingredients.push({ id: 'fossil', quantity: 15 });
        requiredStation = 'carpenters_bench';
    }
    else if (id === 'dino_helmet') {
        ingredients.push({ id: 'dino_scale', quantity: 5 });
        ingredients.push({ id: 'leather', quantity: 2 });
        requiredStation = 'leather_station';
        requiredTalent = { id: 'leather_crafting', level: 2 };
    }
    else if (id === 'dino_chestplate') {
        ingredients.push({ id: 'dino_scale', quantity: 15 });
        ingredients.push({ id: 'leather', quantity: 5 });
        requiredStation = 'leather_station';
        requiredTalent = { id: 'leather_crafting', level: 2 };
    }
    else if (id === 'dino_leggings') {
        ingredients.push({ id: 'dino_scale', quantity: 10 });
        ingredients.push({ id: 'leather', quantity: 4 });
        requiredStation = 'leather_station';
        requiredTalent = { id: 'leather_crafting', level: 2 };
    }
    else if (id === 'fossil_pickaxe') {
        ingredients.push({ id: 'fossil', quantity: 5 });
        ingredients.push({ id: 'amber', quantity: 2 });
        ingredients.push({ id: 'tropical_wood', quantity: 3 });
        requiredStation = 'anvil';
    }
    else if (id === 'ptero_cloak') {
        ingredients.push({ id: 'ptero_wing', quantity: 8 });
        ingredients.push({ id: 'string', quantity: 5 });
        requiredStation = 'leather_station';
    }
    else if (id === 'amber_staff_dino') {
        ingredients.push({ id: 'amber', quantity: 10 });
        ingredients.push({ id: 'fossil', quantity: 2 });
        ingredients.push({ id: 'tropical_wood', quantity: 5 });
        requiredStation = 'carpenters_bench';
    }
    else if (id === 'raptor_sickle') {
        ingredients.push({ id: 'dino_scale', quantity: 2 });
        ingredients.push({ id: 'tropical_wood', quantity: 2 });
        requiredStation = 'carpenters_bench';
    }
    // Ingot processing
    else if (id.includes('ingot')) {
        requiredStation = 'furnace';
        if (id.includes('copper')) ingredients.push({ id: 'copper_ore', quantity: 2 }, { id: 'coal_ore', quantity: 1 });
        else if (id.includes('iron')) { ingredients.push({ id: 'iron_ore', quantity: 2 }, { id: 'coal_ore', quantity: 1 }); requiredTalent = { id: 'smithing', level: 1 }; }
        else if (id.includes('green_metal')) { ingredients.push({ id: 'green_metal_ore', quantity: 2 }, { id: 'coal_ore', quantity: 1 }); requiredTalent = { id: 'smithing', level: 2 }; }
        else if (id.includes('red_metal')) { ingredients.push({ id: 'red_metal_ore', quantity: 2 }, { id: 'coal_ore', quantity: 1 }); requiredTalent = { id: 'smithing', level: 3 }; }
        else if (id.includes('mithril')) { ingredients.push({ id: 'mithril_ore', quantity: 3 }, { id: 'coal_ore', quantity: 2 }); requiredTalent = { id: 'smithing', level: 4 }; }
        else if (id.includes('star_metal')) { ingredients.push({ id: 'star_metal_ore', quantity: 3 }, { id: 'coal_ore', quantity: 3 }); requiredTalent = { id: 'smithing', level: 4 }; }
        else { ingredients.push({ id: 'stone', quantity: 2 }); }
    }
    // Weapons and Tools
    else if (item.category === 'WEAPON' || item.category === 'TOOL' || item.category === 'AMMO' || id.includes('armor') || id.includes('helm') || id.includes('legs') || id.includes('shield')) {
        let mat = 'wood';
        let matQuant = 5;
        requiredStation = 'carpenters_bench';
        
        if (id.includes('copper')) { mat = 'copper_ingot'; requiredStation = 'anvil'; }
        if (id.includes('iron')) { mat = 'iron_ingot'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        if (id.includes('green_metal')) { mat = 'green_metal_ingot'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 2 }; }
        if (id.includes('red_metal')) { mat = 'red_metal_ingot'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 3 }; }
        if (id.includes('mithril')) { mat = 'mithril_ingot'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 4 }; }
        if (id.includes('star_metal')) { mat = 'star_metal_ingot'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 4 }; }
        if (id.includes('obsidian')) { mat = 'obsidian'; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 3 }; }
        if (id.includes('stone')) { mat = 'stone'; requiredStation = 'masonry_table'; requiredTalent = { id: 'masonry', level: 1 }; }
        if (id.includes('bone')) { mat = 'bone'; requiredStation = 'carpenters_bench'; requiredTalent = { id: 'carpentry', level: 1 }; }
        if (id.includes('wooden')) { mat = 'wood'; requiredStation = 'carpenters_bench'; requiredTalent = { id: 'carpentry', level: 1 }; }
        if (id.includes('leather')) { mat = 'leather'; requiredStation = 'leather_station'; requiredTalent = { id: 'leather_crafting', level: 1 }; }
        if (id.includes('cloth') || id.includes('fabric')) { mat = 'cloth'; requiredStation = 'fabric_station'; requiredTalent = { id: 'fabric_crafting', level: 1 }; }
        
        if (id.includes('greatsword') || id.includes('chest')) matQuant = 12;
        if (id.includes('bow')) { matQuant = 8; ingredients.push({ id: 'string', quantity: 2 }); }
        if (id.includes('boomerang')) {
            matQuant = 5;
            if (id === 'bone_boomerang') { mat = 'bone'; matQuant = 5; requiredStation = 'carpenters_bench'; requiredTalent = { id: 'carpentry', level: 1 }; }
            if (id === 'ice_boomerang') { mat = 'iron_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'emerald', quantity: 1 }); requiredTalent = { id: 'smithing', level: 2 }; }
            if (id === 'magma_boomerang') { mat = 'iron_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'ruby', quantity: 1 }); requiredTalent = { id: 'smithing', level: 2 }; }
            if (id === 'void_boomerang') { mat = 'mithril_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'black_diamond', quantity: 2 }); requiredTalent = { id: 'smithing', level: 4 }; }
            if (id === 'cactus_boomerang') { mat = 'wood'; matQuant = 5; requiredStation = 'carpenters_bench'; requiredTalent = { id: 'carpentry', level: 1 }; }
            if (id === 'lightning_boomerang') { mat = 'green_metal_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'diamond', quantity: 1 }); requiredTalent = { id: 'smithing', level: 3 }; }
            if (id === 'crystal_boomerang') { mat = 'diamond'; matQuant = 5; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 3 }; }
            if (id === 'obsidian_boomerang') { mat = 'obsidian'; matQuant = 5; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 4 }; }
            if (id === 'blood_boomerang') { mat = 'red_metal_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'ruby', quantity: 2 }); requiredTalent = { id: 'smithing', level: 4 }; }
            if (id === 'splitting_boomerang') { mat = 'green_metal_ingot'; matQuant = 5; requiredStation = 'anvil'; ingredients.push({ id: 'emerald', quantity: 2 }); requiredTalent = { id: 'smithing', level: 3 }; }
            if (id === 'dragon_boomerang') { mat = 'red_metal_ingot'; matQuant = 10; requiredStation = 'anvil'; ingredients.push({ id: 'obsidian', quantity: 5 }, { id: 'ruby', quantity: 5 }); requiredTalent = { id: 'smithing', level: 4 }; }
        }
        
        if (id.includes('arrow')) { 
            matQuant = 1; 
            ingredients.push({ id: 'wood', quantity: 1 }); 
            if (mat === 'wood') mat = 'stone'; // basic arrow is wood + stone 
            requiredStation = 'carpenters_bench'; 
        }
        
        if (id === 'chisel') { mat = 'iron_ingot'; matQuant = 2; requiredStation = 'anvil'; }
        
        if (id === 'shortbow_1') { mat = 'wood'; matQuant = 5; requiredStation = 'carpenters_bench'; }
        if (id === 'dagger_1') { mat = 'iron_ingot'; matQuant = 2; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        if (id === 'sword_1') { mat = 'iron_ingot'; matQuant = 5; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        if (id === 'greatsword_1') { mat = 'iron_ingot'; matQuant = 12; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        if (id === 'pickaxe_1' || id === 'shovel_1' || id === 'axe_1') { mat = 'iron_ingot'; matQuant = 3; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        if (id === 'dwarven_pickaxe') { mat = 'iron_ingot'; matQuant = 10; requiredStation = 'anvil'; ingredients.push({ id: 'obsidian', quantity: 2 }); requiredTalent = { id: 'smithing', level: 3 }; }
        if (id === 'hoe_1') { mat = 'wood'; matQuant = 3; requiredStation = 'carpenters_bench'; }
        if (id === 'golden_shovel') { mat = 'gold_ingot'; matQuant = 3; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 2 }; }
        if (id === 'watering_can') { mat = 'iron_ingot'; matQuant = 3; requiredStation = 'anvil'; requiredTalent = { id: 'smithing', level: 1 }; }
        
        ingredients.push({ id: mat, quantity: matQuant });
    }
    // Furniture / blocks
    else if (id.includes('wall') || id.includes('floor') || id.includes('staircase') || id.includes('bench') || id.includes('table') || id.includes('tent') || id.includes('furnace') || id.includes('anvil') || id.includes('door') || id.includes('torch') || id.includes('campfire') || id.includes('chest') || id.includes('block') || id.includes('glass') || id.includes('statue') || id.includes('shrine') || id.includes('turret') || id.includes('hopper') || id.includes('dropper') || id.includes('miner') || id.includes('bell') || id.includes('plate') || id.includes('lever') || id.includes('wire')) {
        if (id.includes('stone') || id.includes('furnace') || id.includes('heavy') || id.includes('marble') || id.includes('brick') || id.includes('statue') || id.includes('shrine')) {
            ingredients.push({ id: 'stone', quantity: 10 });
            requiredStation = 'masonry_table';
        } else if (id.includes('iron') || id.includes('anvil') || id.includes('bell') || id.includes('miner') || id.includes('dropper') || id.includes('hopper') || id.includes('turret')) {
            ingredients.push({ id: 'iron_ingot', quantity: 10 });
            requiredStation = 'anvil';
        } else if (id.includes('glass')) {
            ingredients.push({ id: 'sand', quantity: 10 });
            requiredStation = 'furnace';
        } else {
            ingredients.push({ id: 'wood', quantity: 10 }); // doors, benches, wooden floors, tents, etc
            
            // Basic items craftable by hand
            if (id === 'carpenters_bench' || id === 'torch' || id === 'campfire' || id === 'wood_wall' || id === 'wooden_floor') {
                requiredStation = null;
            } else {
                requiredStation = 'carpenters_bench';
            }
        }
    }
    // Consumables logic (potions)
    else if (item.category === 'CONSUMABLE' && id.includes('potion')) {
        requiredStation = 'alchemy_table';
        if (id.includes('health')) ingredients.push({ id: 'red_berry', quantity: 2 }, { id: 'wood', quantity: 1 });
        else if (id.includes('mana')) ingredients.push({ id: 'blue_berry', quantity: 2 }, { id: 'wood', quantity: 1 });
        else ingredients.push({ id: 'weed', quantity: 2 }, { id: 'wood', quantity: 1 });
    }
    // Materials
    else if (id === 'cloth' || id === 'string' || id === 'leather') {
        if (id === 'cloth') {
            ingredients.push({ id: 'string', quantity: 2 });
            requiredStation = 'fabric_station';
        } else if (id === 'string') {
            ingredients.push({ id: 'spider_web', quantity: 1 });
            requiredStation = null;
        } else if (id === 'leather') {
            ingredients.push({ id: 'meat', quantity: 2 }); // hide/meat to leather
            requiredStation = 'leather_station';
        }
    }

    if (ingredients.length > 0) {
        CORE_RECIPES.push({
            id: 'recipe_' + id,
            name: item.name,
            description: `Craft ${item.name}`,
            ingredients: ingredients,
            result: {
                id: id,
                quantity: id.includes('arrow') ? 10 : 1
            },
            requiredStation: requiredStation || undefined,
            requiredTalent: requiredTalent || undefined
        });
    }
}
