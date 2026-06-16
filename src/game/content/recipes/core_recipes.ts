import { CraftingRecipe } from '../../registries/RecipeRegistry';

export const CORE_RECIPES: CraftingRecipe[] = [
    {
        id: 'recipe_infernal_sword',
        name: 'Infernal Greatsword',
        description: 'Craft Infernal Greatsword',
        ingredients: [
            { id: 'obsidian', quantity: 15 },
            { id: 'ruby', quantity: 5 },
        ],
        result: { id: 'infernal_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_frostmourne_sword',
        name: 'Glacial Blade',
        description: 'Craft Glacial Blade',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 15 },
            { id: 'emerald', quantity: 5 },
        ],
        result: { id: 'frostmourne_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_stormcaller_sword',
        name: 'Thunder Edge',
        description: 'Craft Thunder Edge',
        ingredients: [
            { id: 'mithril_ingot', quantity: 15 },
            { id: 'diamond', quantity: 5 },
        ],
        result: { id: 'stormcaller_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_void_sword',
        name: 'Void Cleaver',
        description: 'Craft Void Cleaver',
        ingredients: [
            { id: 'mithril_ingot', quantity: 20 },
            { id: 'black_diamond', quantity: 5 },
        ],
        result: { id: 'void_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_excalibur_sword',
        name: 'Excalibur',
        description: 'Craft Excalibur',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 20 },
            { id: 'diamond', quantity: 10 },
        ],
        result: { id: 'excalibur_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_abyssal_sword',
        name: 'Abyssal Greatsword',
        description: 'Craft Abyssal Greatsword',
        ingredients: [
            { id: 'obsidian', quantity: 20 },
            { id: 'black_diamond', quantity: 10 },
        ],
        result: { id: 'abyssal_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_wooden_sword',
        name: 'Wooden Sword',
        description: 'Craft Wooden Sword',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'wooden_sword', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_copper_broadsword',
        name: 'Copper Broadsword',
        description: 'Craft Copper Broadsword',
        ingredients: [
            { id: 'copper_ingot', quantity: 5 },
            { id: 'wood', quantity: 2 },
        ],
        result: { id: 'copper_broadsword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_longsword',
        name: 'Iron Longsword',
        description: 'Craft Iron Longsword',
        ingredients: [
            { id: 'iron_ingot', quantity: 8 },
            { id: 'wood', quantity: 2 },
        ],
        result: { id: 'iron_longsword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_flame_blade',
        name: 'Flame Blade',
        description: 'Craft Flame Blade',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'flame_blade', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_mithril_greatsword',
        name: 'Mithril Greatsword',
        description: 'Craft Mithril Greatsword',
        ingredients: [
            { id: 'mithril_ingot', quantity: 12 },
        ],
        result: { id: 'mithril_greatsword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_sword_1',
        name: 'Steel Sword',
        description: 'Craft Steel Sword',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'sword_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_greatsword_1',
        name: 'Iron Greatsword',
        description: 'Craft Iron Greatsword',
        ingredients: [
            { id: 'iron_ingot', quantity: 12 },
        ],
        result: { id: 'greatsword_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_obsidian_sword',
        name: 'Obsidian Greatsword',
        description: 'Craft Obsidian Greatsword',
        ingredients: [
            { id: 'obsidian', quantity: 5 },
        ],
        result: { id: 'obsidian_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_dark_elf_blade',
        name: 'Dark Elf Blade',
        description: 'Craft Dark Elf Blade',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'dark_elf_blade', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_troll_tusk_sword',
        name: 'Troll Tusk Sword',
        description: 'Craft Troll Tusk Sword',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'troll_tusk_sword', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_shadow_blade',
        name: 'Phantom Shadow Blade',
        description: 'Craft Phantom Shadow Blade',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'shadow_blade', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_astral_edge',
        name: 'Astral Edge',
        description: 'Craft Astral Edge',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'astral_edge', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_bloodletter',
        name: 'Bloodletter',
        description: 'Craft Bloodletter',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'bloodletter', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_sword_of_creator',
        name: 'Sword of the Creator',
        description: 'Craft Sword of the Creator',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'sword_of_creator', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_blightbringer',
        name: 'Blightbringer',
        description: 'Craft Blightbringer',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'blightbringer', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_tempest_render',
        name: 'Tempest Render',
        description: 'Craft Tempest Render',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'tempest_render', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dragon_fang_sword',
        name: 'Dragon Fang Blade',
        description: 'Craft Dragon Fang Blade',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'dragon_fang_sword', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_star_metal_sword',
        name: 'Star Metal Sword',
        description: 'Craft Star Metal Sword',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 5 },
        ],
        result: { id: 'star_metal_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_star_metal_greatsword',
        name: 'Star Metal Greatsword',
        description: 'Craft Star Metal Greatsword',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 12 },
        ],
        result: { id: 'star_metal_greatsword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_amber_sword',
        name: 'Amber Sword',
        description: 'Craft Amber Sword',
        ingredients: [
            { id: 'amber', quantity: 12 },
            { id: 'tropical_wood', quantity: 3 },
        ],
        result: { id: 'amber_sword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_amber_greatsword',
        name: 'Amber Greatsword',
        description: 'Craft Amber Greatsword',
        ingredients: [
            { id: 'amber', quantity: 24 },
            { id: 'tropical_wood', quantity: 5 },
        ],
        result: { id: 'amber_greatsword', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_dagger_1',
        name: 'Iron Dagger',
        description: 'Craft Iron Dagger',
        ingredients: [
            { id: 'iron_ingot', quantity: 2 },
        ],
        result: { id: 'dagger_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_kobold_dagger',
        name: 'Kobold Dagger',
        description: 'Craft Kobold Dagger',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'kobold_dagger', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_spear',
        name: 'Kobold Spear',
        description: 'Craft Kobold Spear',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'kobold_spear', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_tusk_spear',
        name: 'Boar Tusk Spear',
        description: 'Craft Boar Tusk Spear',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'tusk_spear', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_moose_antler_bow',
        name: 'Antler Bow',
        description: 'Craft Antler Bow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'wood', quantity: 8 },
        ],
        result: { id: 'moose_antler_bow', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_shortbow_1',
        name: 'Wooden Shortbow',
        description: 'Craft Wooden Shortbow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'shortbow_1', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_shortbow',
        name: 'Iron Shortbow',
        description: 'Craft Iron Shortbow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'iron_ingot', quantity: 8 },
        ],
        result: { id: 'iron_shortbow', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_elven_longbow',
        name: 'Elven Longbow',
        description: 'Craft Elven Longbow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'wood', quantity: 8 },
        ],
        result: { id: 'elven_longbow', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dragon_bone_bow',
        name: 'Dragon Bone Bow',
        description: 'Craft Dragon Bone Bow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'bone', quantity: 8 },
        ],
        result: { id: 'dragon_bone_bow', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_wooden_boomerang',
        name: 'Wooden Boomerang',
        description: 'Craft Wooden Boomerang',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'wooden_boomerang', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_green_metal_boomerang',
        name: 'Green Metal Boomerang',
        description: 'Craft Green Metal Boomerang',
        ingredients: [
            { id: 'green_metal_ingot', quantity: 5 },
        ],
        result: { id: 'green_metal_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 2 }
    },
    {
        id: 'recipe_red_metal_boomerang',
        name: 'Red Metal Boomerang',
        description: 'Craft Red Metal Boomerang',
        ingredients: [
            { id: 'red_metal_ingot', quantity: 5 },
        ],
        result: { id: 'red_metal_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_bone_boomerang',
        name: 'Bone Boomerang',
        description: 'Craft Bone Boomerang',
        ingredients: [
            { id: 'bone', quantity: 5 },
        ],
        result: { id: 'bone_boomerang', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_copper_boomerang',
        name: 'Copper Boomerang',
        description: 'Craft Copper Boomerang',
        ingredients: [
            { id: 'copper_ingot', quantity: 5 },
        ],
        result: { id: 'copper_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_boomerang',
        name: 'Iron Boomerang',
        description: 'Craft Iron Boomerang',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'iron_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_mithril_boomerang',
        name: 'Mithril Boomerang',
        description: 'Craft Mithril Boomerang',
        ingredients: [
            { id: 'mithril_ingot', quantity: 5 },
        ],
        result: { id: 'mithril_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_ice_boomerang',
        name: 'Ice Boomerang',
        description: 'Craft Ice Boomerang',
        ingredients: [
            { id: 'emerald', quantity: 1 },
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'ice_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 2 }
    },
    {
        id: 'recipe_magma_boomerang',
        name: 'Magma Boomerang',
        description: 'Craft Magma Boomerang',
        ingredients: [
            { id: 'ruby', quantity: 1 },
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'magma_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 2 }
    },
    {
        id: 'recipe_cactus_boomerang',
        name: 'Cactus Boomerang',
        description: 'Craft Cactus Boomerang',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'cactus_boomerang', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_lightning_boomerang',
        name: 'Lightning Boomerang',
        description: 'Craft Lightning Boomerang',
        ingredients: [
            { id: 'mithril_ingot', quantity: 15 },
            { id: 'diamond', quantity: 5 },
        ],
        result: { id: 'lightning_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_crystal_boomerang',
        name: 'Crystal Boomerang',
        description: 'Craft Crystal Boomerang',
        ingredients: [
            { id: 'diamond', quantity: 5 },
        ],
        result: { id: 'crystal_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_obsidian_boomerang',
        name: 'Obsidian Boomerang',
        description: 'Craft Obsidian Boomerang',
        ingredients: [
            { id: 'obsidian', quantity: 5 },
        ],
        result: { id: 'obsidian_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_splitting_boomerang',
        name: 'Splitting Boomerang',
        description: 'Craft Splitting Boomerang',
        ingredients: [
            { id: 'emerald', quantity: 2 },
            { id: 'green_metal_ingot', quantity: 5 },
        ],
        result: { id: 'splitting_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_dragon_boomerang',
        name: 'Dragon Boomerang',
        description: 'Craft Dragon Boomerang',
        ingredients: [
            { id: 'obsidian', quantity: 5 },
            { id: 'ruby', quantity: 5 },
            { id: 'red_metal_ingot', quantity: 10 },
        ],
        result: { id: 'dragon_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_blood_boomerang',
        name: 'Blood Boomerang',
        description: 'Craft Blood Boomerang',
        ingredients: [
            { id: 'ruby', quantity: 2 },
            { id: 'red_metal_ingot', quantity: 5 },
        ],
        result: { id: 'blood_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_void_boomerang',
        name: 'Void Boomerang',
        description: 'Craft Void Boomerang',
        ingredients: [
            { id: 'mithril_ingot', quantity: 20 },
            { id: 'black_diamond', quantity: 5 },
        ],
        result: { id: 'void_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_dark_elf_bow',
        name: 'Dark Elf Bow',
        description: 'Craft Dark Elf Bow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'wood', quantity: 8 },
        ],
        result: { id: 'dark_elf_bow', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_gnomish_crossbow',
        name: 'Gnomish Repeater Crossbow',
        description: 'Craft Gnomish Repeater Crossbow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'wood', quantity: 8 },
        ],
        result: { id: 'gnomish_crossbow', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_star_metal_bow',
        name: 'Star Metal Bow',
        description: 'Craft Star Metal Bow',
        ingredients: [
            { id: 'string', quantity: 2 },
            { id: 'star_metal_ingot', quantity: 8 },
        ],
        result: { id: 'star_metal_bow', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_star_metal_boomerang',
        name: 'Star Metal Boomerang',
        description: 'Craft Star Metal Boomerang',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 5 },
        ],
        result: { id: 'star_metal_boomerang', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_travelers_staff_acid',
        name: 'Traveler\'s Staff of Acid',
        description: 'Craft Traveler\'s Staff of Acid',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'travelers_staff_acid', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_fire_ranged',
        name: 'Staff of Firebolts',
        description: 'Craft Staff of Firebolts',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_fire_ranged', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_ice_aoe',
        name: 'Staff of Frost Nova',
        description: 'Craft Staff of Frost Nova',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_ice_aoe', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_lightning_ranged',
        name: 'Staff of Sparks',
        description: 'Craft Staff of Sparks',
        ingredients: [
            { id: 'mithril_ingot', quantity: 15 },
            { id: 'diamond', quantity: 5 },
        ],
        result: { id: 'staff_lightning_ranged', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_arcane_aoe',
        name: 'Staff of Arcane Burst',
        description: 'Craft Staff of Arcane Burst',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_arcane_aoe', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_inferno',
        name: 'Staff of the Inferno',
        description: 'Craft Staff of the Inferno',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_inferno', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_necromancer',
        name: 'Necromancer\'s Crook',
        description: 'Craft Necromancer\'s Crook',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_necromancer', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_amber_staff_dino',
        name: 'Amber Staff of Thera',
        description: 'Craft Amber Staff of Thera',
        ingredients: [
            { id: 'amber', quantity: 10 },
            { id: 'fossil', quantity: 2 },
            { id: 'tropical_wood', quantity: 5 },
        ],
        result: { id: 'amber_staff_dino', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_grove',
        name: 'Staff of the Grove',
        description: 'Craft Staff of the Grove',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_grove', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_heavens',
        name: 'Staff of the Heavens',
        description: 'Craft Staff of the Heavens',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_heavens', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_magma',
        name: 'Magma Channeler',
        description: 'Craft Magma Channeler',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_magma', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_glacial',
        name: 'Glacial Staff',
        description: 'Craft Glacial Staff',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 15 },
            { id: 'emerald', quantity: 5 },
        ],
        result: { id: 'staff_glacial', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_void',
        name: 'Void Staff',
        description: 'Craft Void Staff',
        ingredients: [
            { id: 'mithril_ingot', quantity: 20 },
            { id: 'black_diamond', quantity: 5 },
        ],
        result: { id: 'staff_void', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_druid',
        name: 'Staff of the Druid',
        description: 'Craft Staff of the Druid',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_druid', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_time',
        name: 'Time-Mender\'s Staff',
        description: 'Craft Time-Mender\'s Staff',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_time', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_staff_wind',
        name: 'Staff of the Wind',
        description: 'Craft Staff of the Wind',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'staff_wind', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_volcano_wand',
        name: 'Volcano Wand',
        description: 'Craft Volcano Wand',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'volcano_wand', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dwarven_hammer',
        name: 'Dwarven Warhammer',
        description: 'Craft Dwarven Warhammer',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'dwarven_hammer', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_bone_club',
        name: 'Giant Bone Club',
        description: 'Craft Giant Bone Club',
        ingredients: [
            { id: 'fossil', quantity: 15 },
        ],
        result: { id: 'bone_club', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_ogre_club',
        name: 'Ogre Splinter Club',
        description: 'Craft Ogre Splinter Club',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'ogre_club', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_gargoyle_hammer',
        name: 'Gargoyle Demolisher',
        description: 'Craft Gargoyle Demolisher',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'gargoyle_hammer', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_chisel',
        name: 'Runecrafter\'s Chisel',
        description: 'Craft Runecrafter\'s Chisel',
        ingredients: [
            { id: 'iron_ingot', quantity: 2 },
        ],
        result: { id: 'chisel', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_shovel_1',
        name: 'Iron Shovel',
        description: 'Craft Iron Shovel',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
        ],
        result: { id: 'shovel_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_pickaxe_1',
        name: 'Iron Pickaxe',
        description: 'Craft Iron Pickaxe',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
        ],
        result: { id: 'pickaxe_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_axe_1',
        name: 'Iron Axe',
        description: 'Craft Iron Axe',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
        ],
        result: { id: 'axe_1', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_hoe_1',
        name: 'Wooden Hoe',
        description: 'Craft Wooden Hoe',
        ingredients: [
            { id: 'wood', quantity: 3 },
        ],
        result: { id: 'hoe_1', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dwarven_pickaxe',
        name: 'Dwarven Pickaxe',
        description: 'Craft Dwarven Pickaxe',
        ingredients: [
            { id: 'obsidian', quantity: 2 },
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'dwarven_pickaxe', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_watering_can',
        name: 'Watering Can',
        description: 'Craft Watering Can',
        ingredients: [
            { id: 'iron_ingot', quantity: 3 },
        ],
        result: { id: 'watering_can', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_golden_shovel',
        name: 'Golden Shovel',
        description: 'Craft Golden Shovel',
        ingredients: [
            { id: 'gold_ingot', quantity: 3 },
        ],
        result: { id: 'golden_shovel', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 2 }
    },
    {
        id: 'recipe_raptor_sickle',
        name: 'Raptor Sickle',
        description: 'Craft Raptor Sickle',
        ingredients: [
            { id: 'dino_scale', quantity: 2 },
            { id: 'tropical_wood', quantity: 2 },
        ],
        result: { id: 'raptor_sickle', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_fossil_pickaxe',
        name: 'Fossil Pickaxe',
        description: 'Craft Fossil Pickaxe',
        ingredients: [
            { id: 'fossil', quantity: 5 },
            { id: 'amber', quantity: 2 },
            { id: 'tropical_wood', quantity: 3 },
        ],
        result: { id: 'fossil_pickaxe', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_star_metal_pickaxe',
        name: 'Star Metal Pickaxe',
        description: 'Craft Star Metal Pickaxe',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 5 },
        ],
        result: { id: 'star_metal_pickaxe', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_star_metal_axe',
        name: 'Star Metal Axe',
        description: 'Craft Star Metal Axe',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 5 },
        ],
        result: { id: 'star_metal_axe', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_iron_helmet',
        name: 'Iron Helmet',
        description: 'Craft Iron Helmet',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'iron_helmet', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_iron_chestplate',
        name: 'Iron Chestplate',
        description: 'Craft Iron Chestplate',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'iron_chestplate', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_shield',
        name: 'Iron Shield',
        description: 'Craft Iron Shield',
        ingredients: [
            { id: 'iron_ingot', quantity: 5 },
        ],
        result: { id: 'iron_shield', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_dino_helmet',
        name: 'Dino Scale Helmet',
        description: 'Craft Dino Scale Helmet',
        ingredients: [
            { id: 'dino_scale', quantity: 5 },
            { id: 'leather', quantity: 2 },
        ],
        result: { id: 'dino_helmet', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: { id: 'leather_crafting', level: 2 }
    },
    {
        id: 'recipe_dino_chestplate',
        name: 'Dino Scale Chestplate',
        description: 'Craft Dino Scale Chestplate',
        ingredients: [
            { id: 'dino_scale', quantity: 15 },
            { id: 'leather', quantity: 5 },
        ],
        result: { id: 'dino_chestplate', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: { id: 'leather_crafting', level: 2 }
    },
    {
        id: 'recipe_dino_leggings',
        name: 'Dino Scale Leggings',
        description: 'Craft Dino Scale Leggings',
        ingredients: [
            { id: 'dino_scale', quantity: 10 },
            { id: 'leather', quantity: 4 },
        ],
        result: { id: 'dino_leggings', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: { id: 'leather_crafting', level: 2 }
    },
    {
        id: 'recipe_ptero_cloak',
        name: 'Pterodactyl Wing Cloak',
        description: 'Craft Pterodactyl Wing Cloak',
        ingredients: [
            { id: 'ptero_wing', quantity: 8 },
            { id: 'string', quantity: 5 },
        ],
        result: { id: 'ptero_cloak', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: undefined
    },
    {
        id: 'recipe_acorn_helmet',
        name: 'Acorn Helmet',
        description: 'Craft Acorn Helmet',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'acorn_helmet', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_fungal_shield',
        name: 'Fungal Shield',
        description: 'Craft Fungal Shield',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'fungal_shield', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_abyssal_armor',
        name: 'Abyssal Plate Armor',
        description: 'Craft Abyssal Plate Armor',
        ingredients: [
            { id: 'obsidian', quantity: 20 },
            { id: 'black_diamond', quantity: 10 },
        ],
        result: { id: 'abyssal_armor', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dragon_scale_armor',
        name: 'Dragon Scale Armor',
        description: 'Craft Dragon Scale Armor',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'dragon_scale_armor', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_wooden_shield',
        name: 'Wooden Shield',
        description: 'Craft Wooden Shield',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'wooden_shield', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'carpentry', level: 1 }
    },
    {
        id: 'recipe_star_metal_armor',
        name: 'Star Metal Armor',
        description: 'Craft Star Metal Armor',
        ingredients: [
            { id: 'star_metal_ingot', quantity: 5 },
        ],
        result: { id: 'star_metal_armor', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_yeti_fur_coat',
        name: 'Yeti Fur Coat',
        description: 'Craft Yeti Fur Coat',
        ingredients: [
            { id: 'yeti_fur', quantity: 15 },
            { id: 'string', quantity: 5 },
        ],
        result: { id: 'yeti_fur_coat', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: { id: 'leather_crafting', level: 2 }
    },
    {
        id: 'recipe_amber_amulet',
        name: 'Amber Amulet',
        description: 'Craft Amber Amulet',
        ingredients: [
            { id: 'amber', quantity: 5 },
            { id: 'gold_ingot', quantity: 1 },
        ],
        result: { id: 'amber_amulet', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_amber_ring',
        name: 'Amber Ring',
        description: 'Craft Amber Ring',
        ingredients: [
            { id: 'amber', quantity: 3 },
            { id: 'gold_ingot', quantity: 1 },
        ],
        result: { id: 'amber_ring', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_health_potion',
        name: 'Health Potion',
        description: 'Craft Health Potion',
        ingredients: [
            { id: 'red_berry', quantity: 2 },
            { id: 'wood', quantity: 1 },
        ],
        result: { id: 'health_potion', quantity: 1 },
        requiredStation: 'alchemy_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_mana_potion',
        name: 'Mana Potion',
        description: 'Craft Mana Potion',
        ingredients: [
            { id: 'blue_berry', quantity: 2 },
            { id: 'wood', quantity: 1 },
        ],
        result: { id: 'mana_potion', quantity: 1 },
        requiredStation: 'alchemy_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_swiftness_potion',
        name: 'Potion of Swiftness',
        description: 'Craft Potion of Swiftness',
        ingredients: [
            { id: 'weed', quantity: 2 },
            { id: 'wood', quantity: 1 },
        ],
        result: { id: 'swiftness_potion', quantity: 1 },
        requiredStation: 'alchemy_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_alchemy_table_recipe_scroll',
        name: 'Recipe: Alchemy Table',
        description: 'Craft Recipe: Alchemy Table',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'alchemy_table_recipe_scroll', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_wooden_staircase_recipe_scroll',
        name: 'Recipe: Wooden Staircase',
        description: 'Craft Recipe: Wooden Staircase',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'wooden_staircase_recipe_scroll', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_shrine_recipe_scroll',
        name: 'Recipe: Shrine',
        description: 'Craft Recipe: Shrine',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'shrine_recipe_scroll', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_storage_chest_recipe_scroll',
        name: 'Recipe: Storage Chest',
        description: 'Craft Recipe: Storage Chest',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'storage_chest_recipe_scroll', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_furnace_recipe_scroll',
        name: 'Recipe: Furnace',
        description: 'Craft Recipe: Furnace',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'furnace_recipe_scroll', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_anvil_recipe_scroll',
        name: 'Recipe: Anvil',
        description: 'Craft Recipe: Anvil',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'anvil_recipe_scroll', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dungeon_blocks_recipe_scroll',
        name: 'Recipe: Dungeon Blocks',
        description: 'Craft Recipe: Dungeon Blocks',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'dungeon_blocks_recipe_scroll', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_campfire_recipe_scroll',
        name: 'Recipe: Campfire',
        description: 'Craft Recipe: Campfire',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'campfire_recipe_scroll', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_book_magic_block',
        name: 'Spell Book: Magic Block',
        description: 'Craft Spell Book: Magic Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'book_magic_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent',
        name: 'Kobold Worker Tent',
        description: 'Craft Kobold Worker Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent_trapper',
        name: 'Kobold Trapper Tent',
        description: 'Craft Kobold Trapper Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent_trapper', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent_warrior',
        name: 'Kobold Warrior Tent',
        description: 'Craft Kobold Warrior Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent_warrior', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent_shaman',
        name: 'Kobold Shaman Tent',
        description: 'Craft Kobold Shaman Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent_shaman', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent_bomber',
        name: 'Kobold Bomber Tent',
        description: 'Craft Kobold Bomber Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent_bomber', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_kobold_tent_dragonkeeper',
        name: 'Kobold Dragonkeeper Shrine',
        description: 'Craft Kobold Dragonkeeper Shrine',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'kobold_tent_dragonkeeper', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_djinn_lamp_shrine',
        name: 'Djinn Lamp Shrine',
        description: 'Craft Djinn Lamp Shrine',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'djinn_lamp_shrine', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_door',
        name: 'Wooden Door',
        description: 'Craft Wooden Door',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'door', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_stone_door',
        name: 'Stone Door',
        description: 'Craft Stone Door',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'stone_door', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_village_bell',
        name: 'Village Bell',
        description: 'Craft Village Bell',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'village_bell', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_alchemy_table',
        name: 'Alchemy Table',
        description: 'Craft Alchemy Table',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'alchemy_table', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_carpenters_bench',
        name: 'Carpenter\'s Bench',
        description: 'Craft Carpenter\'s Bench',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'carpenters_bench', quantity: 1 },
        requiredStation: undefined,
        requiredTalent: undefined
    },
    {
        id: 'recipe_wooden_staircase',
        name: 'Wooden Staircase',
        description: 'Craft Wooden Staircase',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'wooden_staircase', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_stone_staircase',
        name: 'Stone Staircase',
        description: 'Craft Stone Staircase',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'stone_staircase', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_masonry_table',
        name: 'Masonry Table',
        description: 'Craft Masonry Table',
        ingredients: [
            { id: 'stone', quantity: 15 },
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'masonry_table', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_shrine',
        name: 'Shrine',
        description: 'Craft Shrine',
        ingredients: [
            { id: 'stone', quantity: 10 },
        ],
        result: { id: 'shrine', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_storage_chest',
        name: 'Storage Chest',
        description: 'Craft Storage Chest',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'storage_chest', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_furnace',
        name: 'Furnace',
        description: 'Craft Furnace',
        ingredients: [
            { id: 'stone', quantity: 15 },
        ],
        result: { id: 'furnace', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_anvil',
        name: 'Anvil',
        description: 'Craft Anvil',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'anvil', quantity: 1 },
        requiredStation: 'masonry_table',
        requiredTalent: undefined
    },
    {
        id: 'recipe_campfire',
        name: 'Campfire',
        description: 'Craft Campfire',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'campfire', quantity: 1 },
        requiredStation: undefined,
        requiredTalent: undefined
    },
    {
        id: 'recipe_torch',
        name: 'Torch',
        description: 'Craft Torch',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'torch', quantity: 1 },
        requiredStation: undefined,
        requiredTalent: undefined
    },
    {
        id: 'recipe_arcane_turret',
        name: 'Arcane Turret',
        description: 'Craft Arcane Turret',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'arcane_turret', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_spike_floor',
        name: 'Spike Floor',
        description: 'Craft Spike Floor',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'spike_floor', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_pressure_plate',
        name: 'Pressure Plate',
        description: 'Craft Pressure Plate',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'pressure_plate', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_lever',
        name: 'Lever',
        description: 'Craft Lever',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'lever', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_wire',
        name: 'Gnomish Wire',
        description: 'Craft Gnomish Wire',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'wire', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_arrow_turret',
        name: 'Arrow Turret',
        description: 'Craft Arrow Turret',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'arrow_turret', quantity: 10 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_wandering_bard_tent',
        name: 'Wandering Bard Tent',
        description: 'Craft Wandering Bard Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'wandering_bard_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_frost_caster_tent',
        name: 'Frost Caster Tent',
        description: 'Craft Frost Caster Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'frost_caster_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_loyal_frost_caster_tent',
        name: 'Loyal Frost Caster Tent',
        description: 'Craft Loyal Frost Caster Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'loyal_frost_caster_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_tent',
        name: 'Tent',
        description: 'Craft Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_archer_tent',
        name: 'Archer Tent',
        description: 'Craft Archer Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'archer_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dark_knight_tent',
        name: 'Dark Knight Spawner',
        description: 'Craft Dark Knight Spawner',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'dark_knight_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_pit_bull_tent',
        name: 'Pit Bull Tent',
        description: 'Craft Pit Bull Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'pit_bull_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_terrier_tent',
        name: 'Terrier Tent',
        description: 'Craft Terrier Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'terrier_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_void_lord_altar',
        name: 'Void Lord Altar',
        description: 'Craft Void Lord Altar',
        ingredients: [
            { id: 'mithril_ingot', quantity: 20 },
            { id: 'black_diamond', quantity: 5 },
        ],
        result: { id: 'void_lord_altar', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_miner_contract',
        name: 'Miner Contract',
        description: 'Craft Miner Contract',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'miner_contract', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_block',
        name: 'Iron Block',
        description: 'Craft Iron Block',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'iron_block', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_glass_block',
        name: 'Glass Block',
        description: 'Craft Glass Block',
        ingredients: [
            { id: 'sand', quantity: 10 },
        ],
        result: { id: 'glass_block', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_glowing_mushroom_block',
        name: 'Glowing Mushroom Block',
        description: 'Craft Glowing Mushroom Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'glowing_mushroom_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_lantern_block',
        name: 'Lantern',
        description: 'Craft Lantern',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'lantern_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_copper_ingot',
        name: 'Copper Ingot',
        description: 'Craft Copper Ingot',
        ingredients: [
            { id: 'copper_ore', quantity: 2 },
            { id: 'coal_ore', quantity: 1 },
        ],
        result: { id: 'copper_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_ingot',
        name: 'Iron Ingot',
        description: 'Craft Iron Ingot',
        ingredients: [
            { id: 'iron_ore', quantity: 2 },
            { id: 'coal_ore', quantity: 1 },
        ],
        result: { id: 'iron_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_green_metal_ingot',
        name: 'Green Metal Ingot',
        description: 'Craft Green Metal Ingot',
        ingredients: [
            { id: 'green_metal_ore', quantity: 2 },
            { id: 'coal_ore', quantity: 1 },
        ],
        result: { id: 'green_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: { id: 'smithing', level: 2 }
    },
    {
        id: 'recipe_red_metal_ingot',
        name: 'Red Metal Ingot',
        description: 'Craft Red Metal Ingot',
        ingredients: [
            { id: 'red_metal_ore', quantity: 2 },
            { id: 'coal_ore', quantity: 1 },
        ],
        result: { id: 'red_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: { id: 'smithing', level: 3 }
    },
    {
        id: 'recipe_mithril_ingot',
        name: 'Mithril Ingot',
        description: 'Craft Mithril Ingot',
        ingredients: [
            { id: 'mithril_ore', quantity: 3 },
            { id: 'coal_ore', quantity: 2 },
        ],
        result: { id: 'mithril_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_silver_ingot',
        name: 'Silver Ingot',
        description: 'Craft Silver Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'silver_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_platinum_ingot',
        name: 'Platinum Ingot',
        description: 'Craft Platinum Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'platinum_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_adamantium_ingot',
        name: 'Adamantium Ingot',
        description: 'Craft Adamantium Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'adamantium_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_eternium_ingot',
        name: 'Eternium Ingot',
        description: 'Craft Eternium Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'eternium_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_black_metal_ingot',
        name: 'Black Metal Ingot',
        description: 'Craft Black Metal Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'black_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_blue_metal_ingot',
        name: 'Blue Metal Ingot',
        description: 'Craft Blue Metal Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'blue_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_orange_metal_ingot',
        name: 'Orange Metal Ingot',
        description: 'Craft Orange Metal Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'orange_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_purple_metal_ingot',
        name: 'Purple Metal Ingot',
        description: 'Craft Purple Metal Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'purple_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_yellow_metal_ingot',
        name: 'Yellow Metal Ingot',
        description: 'Craft Yellow Metal Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'yellow_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_plUTONIUM_ingot',
        name: 'Plutonium Ingot',
        description: 'Craft Plutonium Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'plUTONIUM_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_copper_block',
        name: 'Copper Block',
        description: 'Craft Copper Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'copper_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_silver_block',
        name: 'Silver Block',
        description: 'Craft Silver Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'silver_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_gold_block',
        name: 'Gold Block',
        description: 'Craft Gold Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'gold_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_platinum_block',
        name: 'Platinum Block',
        description: 'Craft Platinum Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'platinum_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_mithril_block',
        name: 'Mithril Block',
        description: 'Craft Mithril Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'mithril_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_adamantium_block',
        name: 'Adamantium Block',
        description: 'Craft Adamantium Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'adamantium_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_eternium_block',
        name: 'Eternium Block',
        description: 'Craft Eternium Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'eternium_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_black_metal_block',
        name: 'Black Metal Block',
        description: 'Craft Black Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'black_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_blue_metal_block',
        name: 'Blue Metal Block',
        description: 'Craft Blue Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'blue_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_green_metal_block',
        name: 'Green Metal Block',
        description: 'Craft Green Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'green_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_red_metal_block',
        name: 'Red Metal Block',
        description: 'Craft Red Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'red_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_orange_metal_block',
        name: 'Orange Metal Block',
        description: 'Craft Orange Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'orange_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_purple_metal_block',
        name: 'Purple Metal Block',
        description: 'Craft Purple Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'purple_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_yellow_metal_block',
        name: 'Yellow Metal Block',
        description: 'Craft Yellow Metal Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'yellow_metal_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_plUTONIUM_block',
        name: 'Plutonium Block',
        description: 'Craft Plutonium Block',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'plUTONIUM_block', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_star_metal_ingot',
        name: 'Star Metal Ingot',
        description: 'Craft Star Metal Ingot',
        ingredients: [
            { id: 'star_metal_ore', quantity: 3 },
            { id: 'coal_ore', quantity: 3 },
        ],
        result: { id: 'star_metal_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: { id: 'smithing', level: 4 }
    },
    {
        id: 'recipe_arrow_1',
        name: 'Wooden Arrow',
        description: 'Craft Wooden Arrow',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'stone', quantity: 1 },
        ],
        result: { id: 'arrow_1', quantity: 10 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_iron_arrow',
        name: 'Iron Arrow',
        description: 'Craft Iron Arrow',
        ingredients: [
            { id: 'wood', quantity: 1 },
            { id: 'iron_ingot', quantity: 1 },
        ],
        result: { id: 'iron_arrow', quantity: 10 },
        requiredStation: 'carpenters_bench',
        requiredTalent: { id: 'smithing', level: 1 }
    },
    {
        id: 'recipe_wood_floor',
        name: 'Wood Floor',
        description: 'Craft Wood Floor',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'wood_floor', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_auto_miner',
        name: 'Auto Miner',
        description: 'Craft Auto Miner',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'auto_miner', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_auto_dropper',
        name: 'Auto Dropper',
        description: 'Craft Auto Dropper',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'auto_dropper', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_vacuum_hopper',
        name: 'Vacuum Hopper',
        description: 'Craft Vacuum Hopper',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'vacuum_hopper', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_goblin_tent_rockhurler',
        name: 'Goblin Rockhurler Tent',
        description: 'Craft Goblin Rockhurler Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'goblin_tent_rockhurler', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_goblin_tent_gardener',
        name: 'Goblin Gardener Tent',
        description: 'Craft Goblin Gardener Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'goblin_tent_gardener', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_goblin_tent_boomeranger',
        name: 'Goblin Boomeranger Tent',
        description: 'Craft Goblin Boomeranger Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'goblin_tent_boomeranger', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_goblin_tent_alchemist',
        name: 'Goblin Alchemist Tent',
        description: 'Craft Goblin Alchemist Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'goblin_tent_alchemist', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_goblin_tent_miner',
        name: 'Goblin Miner Tent',
        description: 'Craft Goblin Miner Tent',
        ingredients: [
            { id: 'iron_ingot', quantity: 10 },
        ],
        result: { id: 'goblin_tent_miner', quantity: 1 },
        requiredStation: 'anvil',
        requiredTalent: undefined
    },
    {
        id: 'recipe_orc_tent_brute',
        name: 'Orc Brute Tent',
        description: 'Craft Orc Brute Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'orc_tent_brute', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_orc_tent_shaman',
        name: 'Orc Shaman Tent',
        description: 'Craft Orc Shaman Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'orc_tent_shaman', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_orc_tent_hunter',
        name: 'Orc Hunter Tent',
        description: 'Craft Orc Hunter Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'orc_tent_hunter', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_dark_elf_tent',
        name: 'Dark Elf Tent',
        description: 'Craft Dark Elf Tent',
        ingredients: [
            { id: 'wood', quantity: 10 },
        ],
        result: { id: 'dark_elf_tent', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_leather',
        name: 'Leather',
        description: 'Craft Leather',
        ingredients: [
            { id: 'meat', quantity: 2 },
        ],
        result: { id: 'leather', quantity: 1 },
        requiredStation: 'leather_station',
        requiredTalent: undefined
    },
    {
        id: 'recipe_gold_ingot',
        name: 'Gold Ingot',
        description: 'Craft Gold Ingot',
        ingredients: [
            { id: 'stone', quantity: 2 },
        ],
        result: { id: 'gold_ingot', quantity: 1 },
        requiredStation: 'furnace',
        requiredTalent: undefined
    },
    {
        id: 'recipe_grappling_hook',
        name: 'Grappling Hook',
        description: 'Craft Grappling Hook',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'grappling_hook', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_fishing_pole',
        name: 'Fishing Pole',
        description: 'Craft Fishing Pole',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'fishing_pole', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_key_small',
        name: 'Small Key',
        description: 'Craft Small Key',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'key_small', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
    {
        id: 'recipe_key_boss',
        name: 'Boss Key',
        description: 'Craft Boss Key',
        ingredients: [
            { id: 'wood', quantity: 5 },
        ],
        result: { id: 'key_boss', quantity: 1 },
        requiredStation: 'carpenters_bench',
        requiredTalent: undefined
    },
];
