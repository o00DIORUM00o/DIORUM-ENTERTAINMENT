import type { Item } from '../../registries/ItemRegistry';

export const CONSUMABLE_ITEMS: Record<string, Item> = {
    'cooked_fish': {
        id: "cooked_fish",
        name: "Cooked Fish",
        description: "A nicely roasted piece of fish. Restores 30 HP and grants slight health regen.",
        category: "CONSUMABLE",
        maxStack: 20,
        healing: 30,
        buff: { healthRegen: 1, duration: 60 }
    },
    'cooked_meat': {
        id: "cooked_meat",
        name: "Cooked Meat",
        description: "A hearty steak. Restores 50 HP and buffs maximum health temporarily.",
        category: "CONSUMABLE",
        maxStack: 20,
        healing: 50,
        buff: { maxHealth: 1, duration: 120 }
    },
    'carrot_soup': {
        id: "carrot_soup",
        name: "Carrot Soup",
        description: "A warm, rejuvenating bowl of soup. Restores mana and grants mana regen.",
        category: "CONSUMABLE",
        maxStack: 10,
        manaRestore: 50,
        buff: { manaRegen: 1, duration: 180 }
    },
    'berry_pie': {
        id: "berry_pie",
        name: "Mixed Berry Pie",
        description: "A delicious baked treat. Grants swiftness and stamina regeneration.",
        category: "CONSUMABLE",
        maxStack: 10,
        staminaRestore: 100,
        buff: { speed: 1, duration: 120 }
    },
    'golden_feast': {
        id: "golden_feast",
        name: "Golden Feast",
        description: "A luxurious grand meal fit for a King. Massive buffs.",
        category: "CONSUMABLE",
        maxStack: 5,
        healing: 1000,
        manaRestore: 1000,
        buff: { maxHealth: 1, maxMana: 1, healthRegen: 1, manaRegen: 1, speed: 1, duration: 600 }
    },
    'raw_fish': {
        id: "raw_fish",
        name: "Raw Fish",
        description: "A slippery, silver fish. Heals 10 HP. Better cooked.",
        category: "CONSUMABLE",
        maxStack: 20,
        quantity: 1,
        healing: 10
    },
    'golden_fish': {
        id: "golden_fish",
        name: "Golden Fish",
        description: "A rare, shimmering fish! Sells for a lot, heals fully.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1,
        healing: 1000
    },
    'health_potion': {
        id: "health_potion",
        name: "Health Potion",
        description: "A glowing red vial. Restores 100 health.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1,
        healing: 100
    },
    'mana_potion': {
        id: "mana_potion",
        name: "Mana Potion",
        description: "A vibrant blue vial. Restores 100 mana.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
    'swiftness_potion': {
        id: "swiftness_potion",
        name: "Potion of Swiftness",
        description: "A frothy yellow brew. Grants incredible speed for 60 seconds.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
    'fire_vial': {
        id: "fire_vial",
        name: "Vial of Liquid Fire",
        description: "A dangerous volatile vial. Explodes upon use.",
        category: "CONSUMABLE",
        maxStack: 10,
        quantity: 1
    },
    'mushroom': {
        id: "mushroom",
        name: "Mushroom",
        description: "A large, slightly glowing mushroom. Restores some health when eaten, but might cause hallucinations.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 25
    },
    'alchemy_table_recipe_scroll': {
        id: "alchemy_table_recipe_scroll",
        name: "Recipe: Alchemy Table",
        description: "Learn to build an Alchemy Table. Requires Carpentry Level 2.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'bomb': {
        id: "bomb",
        name: "Bomb",
        description: "Highly explosive. Blows up cracked walls. Handle with care.",
        category: "CONSUMABLE",
        twoHanded: false,
        stackable: true
    },
    'rune_key_areth': {
        id: "rune_key_areth",
        name: "Rune Key of Areth",
        description: "Unlocks the Arcane Gate to Areth, world of dragons.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_tarhe': {
        id: "rune_key_tarhe",
        name: "Rune Key of Tarhe",
        description: "Unlocks the Arcane Gate to Tarhe, the mountain homes.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_terha': {
        id: "rune_key_terha",
        name: "Rune Key of Terha",
        description: "Unlocks the Arcane Gate to Terha, world of titans.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_heart': {
        id: "rune_key_heart",
        name: "Rune Key of Heart",
        description: "Unlocks the Arcane Gate to Heart, the elven spires.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_rathe': {
        id: "rune_key_rathe",
        name: "Rune Key of Rathe",
        description: "Unlocks the Arcane Gate to Rathe, world of sphinxes.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_thaer': {
        id: "rune_key_thaer",
        name: "Rune Key of Thaer",
        description: "Unlocks the Arcane Gate to Thaer, world of beasts.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_thera': {
        id: "rune_key_thera",
        name: "Rune Key of Thera",
        description: "Unlocks the Arcane Gate to Thera, land of swamps.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_ather': {
        id: "rune_key_ather",
        name: "Rune Key of Ather",
        description: "Unlocks the Arcane Gate to Ather, world of giants.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_threa': {
        id: "rune_key_threa",
        name: "Rune Key of Threa",
        description: "Unlocks the Arcane Gate to Threa.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_thrae': {
        id: "rune_key_thrae",
        name: "Rune Key of Thrae",
        description: "Unlocks the Arcane Gate to Thrae, world of humans.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'rune_key_raeth': {
        id: "rune_key_raeth",
        name: "Rune Key of Raeth",
        description: "Unlocks the Arcane Gate to Raeth, the black dunes.",
        category: "CONSUMABLE",
        twoHanded: false,
        damage: 0,
        reach: 0,
        cooldown: 0,
        spread: 0
    },
    'wooden_staircase_recipe_scroll': {
        id: "wooden_staircase_recipe_scroll",
        name: "Recipe: Wooden Staircase",
        description: "A scroll detailing how to build a wooden staircase. Requires Carpentry Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'shrine_recipe_scroll': {
        id: "shrine_recipe_scroll",
        name: "Recipe: Shrine",
        description: "A scroll detailing how to carve a sacred shrine. Requires Masonry Level 2. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'storage_chest_recipe_scroll': {
        id: "storage_chest_recipe_scroll",
        name: "Recipe: Storage Chest",
        description: "A scroll detailing how to build a storage chest. Requires Carpentry Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'furnace_recipe_scroll': {
        id: "furnace_recipe_scroll",
        name: "Recipe: Furnace",
        description: "A scroll detailing how to build a furnace. Requires Masonry Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'anvil_recipe_scroll': {
        id: "anvil_recipe_scroll",
        name: "Recipe: Anvil",
        description: "A scroll detailing how to forge an anvil. Requires Smithing Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'dungeon_blocks_recipe_scroll': {
        id: "dungeon_blocks_recipe_scroll",
        name: "Recipe: Dungeon Blocks",
        description: "A scroll detailing how to craft dungeon mechanisms and blocks. Requires Masonry Level 2 and Smithing Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'wooden_boomerang_recipe_scroll': {
        id: "wooden_boomerang_recipe_scroll",
        name: "Recipe: Wooden Boomerang",
        description: "A scroll detailing how to carve a wooden boomerang. Requires Carpentry Level 1. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'meat': {
        id: "meat",
        name: "Raw Meat",
        description: "Fresh meat from a wild animal. Can be cooked or eaten raw (if you are brave).",
        category: "CONSUMABLE",
        quantity: 1,
        maxStack: 64,
        healing: 10
    },
    'book_blink': {
        id: "book_blink",
        name: "Spell Book: Blink",
        description: "Read to learn Blink.",
        category: "CONSUMABLE",
        spellId: "blink",
        quantity: 1,
        maxStack: 1
    },
    'book_levitate': {
        id: "book_levitate",
        name: "Spell Book: Levitate",
        description: "Read to learn Levitate.",
        category: "CONSUMABLE",
        spellId: "levitate",
        quantity: 1,
        maxStack: 1
    },
    'book_speed': {
        id: "book_speed",
        name: "Spell Book: Speed",
        description: "Read to learn Speed.",
        category: "CONSUMABLE",
        spellId: "speed",
        quantity: 1,
        maxStack: 1
    },
    'book_heal': {
        id: "book_heal",
        name: "Spell Book: Heal",
        description: "Read to learn Heal.",
        category: "CONSUMABLE",
        spellId: "heal",
        quantity: 1,
        maxStack: 1
    },
    'book_major_heal': {
        id: "book_major_heal",
        name: "Spell Book: Major Heal",
        description: "Read to learn Major Heal.",
        category: "CONSUMABLE",
        spellId: "major_heal",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_wolf': {
        id: "book_summon_wolf",
        name: "Spell Book: Summon Wolf",
        description: "Read to learn Summon Wolf.",
        category: "CONSUMABLE",
        spellId: "summon_wolf",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_bear': {
        id: "book_summon_bear",
        name: "Spell Book: Summon Bear",
        description: "Read to learn Summon Bear.",
        category: "CONSUMABLE",
        spellId: "summon_bear",
        quantity: 1,
        maxStack: 1
    },
    'book_magic_block': {
        id: "book_magic_block",
        name: "Spell Book: Magic Block",
        description: "Read to learn Magic Block.",
        category: "CONSUMABLE",
        spellId: "magic_block",
        quantity: 1,
        maxStack: 1
    },
    'book_invisibility': {
        id: "book_invisibility",
        name: "Spell Book: Invisibility",
        description: "Read to learn Invisibility.",
        category: "CONSUMABLE",
        spellId: "invisibility",
        quantity: 1,
        maxStack: 1
    },
    'book_fear': {
        id: "book_fear",
        name: "Spell Book: Fear",
        description: "Read to learn Fear.",
        category: "CONSUMABLE",
        spellId: "fear",
        quantity: 1,
        maxStack: 1
    },
    'book_arcane_light': {
        id: "book_arcane_light",
        name: "Spell Book: Arcane Light",
        description: "Read to learn Arcane Light.",
        category: "CONSUMABLE",
        spellId: "arcane_light",
        quantity: 1,
        maxStack: 1
    },
    'book_exploding_rune': {
        id: "book_exploding_rune",
        name: "Spell Book: Exploding Rune",
        description: "Read to learn Exploding Rune.",
        category: "CONSUMABLE",
        spellId: "exploding_rune",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_wyrmling': {
        id: "book_summon_wyrmling",
        name: "Spell Book: Summon Wyrmling",
        description: "Read to learn Summon Wyrmling.",
        category: "CONSUMABLE",
        spellId: "summon_wyrmling",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_skeleton': {
        id: "book_summon_skeleton",
        name: "Spell Book: Summon Skeleton",
        description: "Read to learn Summon Skeleton.",
        category: "CONSUMABLE",
        spellId: "summon_skeleton",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_zombie': {
        id: "book_summon_zombie",
        name: "Spell Book: Summon Zombie",
        description: "Read to learn Summon Zombie.",
        category: "CONSUMABLE",
        spellId: "summon_zombie",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_bone_pile': {
        id: "book_summon_bone_pile",
        name: "Spell Book: Summon Bone Pile",
        description: "Read to learn Summon Bone Pile.",
        category: "CONSUMABLE",
        spellId: "summon_bone_pile",
        quantity: 1,
        maxStack: 1
    },
    'book_animate_stone': {
        id: "book_animate_stone",
        name: "Spell Book: Animate Stone",
        description: "Read to learn Animate Stone.",
        category: "CONSUMABLE",
        spellId: "animate_stone",
        quantity: 1,
        maxStack: 1
    },
    'book_mark_return': {
        id: "book_mark_return",
        name: "Spell Book: Mark and Return",
        description: "Read to learn the Mark and Return spells.",
        category: "CONSUMABLE",
        spellIds: [
            "mark",
            "return"
        ],
        quantity: 1,
        maxStack: 1
    },
    'book_color_portals': {
        id: "book_color_portals",
        name: "Spell Book of Color Portals",
        description: "Read to learn the 6 Color Portal spells.",
        category: "CONSUMABLE",
        spellIds: [
            "portal_red",
            "portal_blue",
            "portal_yellow",
            "portal_green",
            "portal_purple",
            "portal_orange"
        ],
        quantity: 1,
        maxStack: 1
    },
    'book_burning_hands': {
        id: "book_burning_hands",
        name: "Spell Book: Burning Hands",
        description: "Read to learn the Burning Hands spell.",
        category: "CONSUMABLE",
        spellId: "burning_hands",
        quantity: 1,
        maxStack: 1
    },
    'book_fire_bolt': {
        id: "book_fire_bolt",
        name: "Spell Book: Fire Bolt",
        description: "Read to learn the Fire Bolt spell.",
        category: "CONSUMABLE",
        spellId: "fire_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_summon_rat': {
        id: "book_summon_rat",
        name: "Spell Book: Summon Rat",
        description: "Read to learn the Summon Rat spell.",
        category: "CONSUMABLE",
        spellId: "summon_rat",
        quantity: 1,
        maxStack: 1
    },
    'book_ice_bolt': {
        id: "book_ice_bolt",
        name: "Spell Book: Ice Bolt",
        description: "Read to learn the Ice Bolt spell.",
        category: "CONSUMABLE",
        spellId: "ice_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_lightning_bolt': {
        id: "book_lightning_bolt",
        name: "Spell Book: Lightning Bolt",
        description: "Read to learn the Lightning Bolt spell.",
        category: "CONSUMABLE",
        spellId: "lightning_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_arcane_bolt': {
        id: "book_arcane_bolt",
        name: "Spell Book: Arcane Bolt",
        description: "Read to learn the Arcane Bolt spell.",
        category: "CONSUMABLE",
        spellId: "arcane_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_acid_bolt': {
        id: "book_acid_bolt",
        name: "Spell Book: Acid Bolt",
        description: "Read to learn the Acid Bolt spell.",
        category: "CONSUMABLE",
        spellId: "acid_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_force_bolt': {
        id: "book_force_bolt",
        name: "Spell Book: Force Bolt",
        description: "Read to learn the Force Bolt spell.",
        category: "CONSUMABLE",
        spellId: "force_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_fire_ball': {
        id: "book_fire_ball",
        name: "Spell Book: Fire Ball",
        description: "Read to learn the Fire Ball spell.",
        category: "CONSUMABLE",
        spellId: "fire_ball",
        quantity: 1,
        maxStack: 1
    },
    'book_ice_ball': {
        id: "book_ice_ball",
        name: "Spell Book: Ice Ball",
        description: "Read to learn the Ice Ball spell.",
        category: "CONSUMABLE",
        spellId: "ice_ball",
        quantity: 1,
        maxStack: 1
    },
    'book_lightning_ball': {
        id: "book_lightning_ball",
        name: "Spell Book: Lightning Ball",
        description: "Read to learn the Lightning Ball spell.",
        category: "CONSUMABLE",
        spellId: "lightning_ball",
        quantity: 1,
        maxStack: 1
    },
    'book_arcane_ball': {
        id: "book_arcane_ball",
        name: "Spell Book: Arcane Ball",
        description: "Read to learn the Arcane Ball spell.",
        category: "CONSUMABLE",
        spellId: "arcane_ball",
        quantity: 1,
        maxStack: 1
    },
    'book_acid_ball': {
        id: "book_acid_ball",
        name: "Spell Book: Acid Ball",
        description: "Read to learn the Acid Ball spell.",
        category: "CONSUMABLE",
        spellId: "acid_ball",
        quantity: 1,
        maxStack: 1
    },
    'book_force_ball': {
        id: "book_force_ball",
        name: "Spell Book: Force Ball",
        description: "Read to learn the Force Ball spell.",
        category: "CONSUMABLE",
        spellId: "force_ball",
        quantity: 1,
        maxStack: 1
    },
    'dragon_egg_mount': {
        id: "dragon_egg_mount",
        name: "Dragon Egg",
        description: "A radiating large egg. Hatching it summons a loyalty-bound Fire Dragon mount.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1,
        summonsMount: 'FIRE_DRAGON'
    },
    'book_dig_bolt': {
        id: "book_dig_bolt",
        name: "Spell Book: Dig Bolt",
        description: "Read to learn the Dig Bolt spell.",
        category: "CONSUMABLE",
        spellId: "dig_bolt",
        quantity: 1,
        maxStack: 1
    },
    'book_meteor_shower': {
        id: "book_meteor_shower",
        name: "Spell Book: Meteor Shower",
        description: "Read to learn the Meteor Shower spell, an ancient draconian magic.",
        category: "CONSUMABLE",
        spellId: "meteor_shower",
        quantity: 1,
        maxStack: 1
    },
    'campfire_recipe_scroll': {
        id: "campfire_recipe_scroll",
        name: "Recipe: Campfire",
        description: "A scroll detailing how to build a campfire. Use to learn.",
        category: "CONSUMABLE",
        maxStack: 1,
        quantity: 1
    },
    'red_berry': {
        id: "red_berry",
        name: "Red Berry",
        description: "A juicy red berry. Restores 10 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'blue_berry': {
        id: "blue_berry",
        name: "Blue Berry",
        description: "A plump blue berry. Restores 10 mana.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'black_berry': {
        id: "black_berry",
        name: "Black Berry",
        description: "A tart black berry. Restores 10 stamina.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'yellow_berry': {
        id: "yellow_berry",
        name: "Yellow Berry",
        description: "A sweet yellow berry. Restores 5 health, mana, and stamina.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1
    },
    'carrot': {
        id: "carrot",
        name: "Carrot",
        description: "A crunchy vegetable. Restores 20 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 20
    },
    'carrot_seed': {
        id: "carrot_seed",
        name: "Carrot Seed",
        description: "Plant in Tilled Soil to grow carrots.",
        category: "MISC",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent': {
        id: "kobold_tent",
        name: "Kobold Worker Tent",
        description: "A tent used by Kobold Workers.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent_trapper': {
        id: "kobold_tent_trapper",
        name: "Kobold Trapper Tent",
        description: "A tent used by Kobold Trappers.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent_warrior': {
        id: "kobold_tent_warrior",
        name: "Kobold Warrior Tent",
        description: "A tent used by Kobold Warriors.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent_shaman': {
        id: "kobold_tent_shaman",
        name: "Kobold Shaman Tent",
        description: "A tent used by Kobold Shamans.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent_bomber': {
        id: "kobold_tent_bomber",
        name: "Kobold Bomber Tent",
        description: "A tent used by Kobold Bombers.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'kobold_tent_dragonkeeper': {
        id: "kobold_tent_dragonkeeper",
        name: "Kobold Dragonkeeper Shrine",
        description: "A shrine inhabited by Kobold Dragonkeepers.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'honeycomb': {
        id: "honeycomb",
        name: "Honeycomb",
        description: "Sticky and sweet. Can be eaten to restore 50 health.",
        category: "CONSUMABLE",
        maxStack: 99,
        quantity: 1,
        healing: 50
    },
    'gargoyle_pedestal': {
        id: "gargoyle_pedestal",
        name: "Gargoyle Pedestal",
        description: "A stone pedestal where a Gargoyle might awaken.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'djinn_lamp_shrine': {
        id: "djinn_lamp_shrine",
        name: "Djinn Lamp Shrine",
        description: "A glowing golden shrine housing a Djinn's lamp.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'gremlin_camp': {
        id: "gremlin_camp",
        name: "Gremlin Camp",
        description: "A chaotic camp packed with scrap metal and tools.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'sphinx_spawner': {
        id: "sphinx_spawner",
        name: "Sphinx Spawner",
        description: "An ancient desert monument resonating with arcane, sand-swept energy.",
        category: "MATERIAL",
        maxStack: 99,
        quantity: 1
    },
    'pipe': {
        id: 'pipe',
        name: 'Smoking Pipe',
        description: 'A beautifully crafted wooden pipe. Used to smoke pipe weed.',
        category: 'MISC',
        maxStack: 1,
        quantity: 1
    },
    'pipe_weed_green': {
        id: 'pipe_weed_green',
        name: 'Green Pipe Weed',
        description: 'A classic smooth smoke. Restores 20 Stamina and slightly increases Stamina Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        staminaRestore: 20,
        buff: { duration: 60 }
    },
    'pipe_weed_blue': {
        id: 'pipe_weed_blue',
        name: 'Blue Pipe Weed',
        description: 'A cool, minty smoke. Restores 20 Mana and slightly increases Mana Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        manaRestore: 20,
        buff: { manaRegen: 1, duration: 60 }
    },
    'pipe_weed_red': {
        id: 'pipe_weed_red',
        name: 'Red Pipe Weed',
        description: 'A spicy, warm smoke. Restores 20 HP and slightly increases HP Regen.',
        category: 'CONSUMABLE',
        maxStack: 99,
        healing: 20,
        buff: { healthRegen: 1, duration: 60 }
    },
    'pipe_weed_purple': {
        id: 'pipe_weed_purple',
        name: 'Purple Pipe Weed',
        description: 'A mystical, mind-expanding smoke. Grants temporary swiftness and increased maximum mana.',
        category: 'CONSUMABLE',
        maxStack: 99,
        manaRestore: 50,
        buff: { speed: 1, maxMana: 1, duration: 120 }
    }
};
