import { EntityDef } from '../../registries/EntityRegistry';

export const CORE_ENTITIES: EntityDef[] = [
    // Enemies
    { id: 'kobold', name: 'Kobold', maxHealth: 50, damage: 15, speed: 4.0 },
    { id: 'drake', name: 'Drake', maxHealth: 100, damage: 25, speed: 5.0 },
    { id: 'lava_golem', name: 'Lava Golem', maxHealth: 150, damage: 30, speed: 2.0 },
    { id: 'giant_ant', name: 'Giant Ant', maxHealth: 30, damage: 5, speed: 3.5 },
    { id: 'rat', name: 'Rat', maxHealth: 10, damage: 2, speed: 4.5 },
    { id: 'skeleton', name: 'Skeleton', maxHealth: 40, damage: 15, speed: 3.0 },
    { id: 'goblin', name: 'Goblin', maxHealth: 30, damage: 5, speed: 3.8 },
    { id: 'goblin_shaman', name: 'Goblin Shaman', maxHealth: 20, damage: 3, speed: 3.2 },
    { id: 'orc', name: 'Orc', maxHealth: 80, damage: 20, speed: 3.5 },
    { id: 'archer', name: 'Archer', maxHealth: 45, damage: 15, speed: 4.0 },
    { id: 'dark_knight', name: 'Dark Knight', maxHealth: 120, damage: 30, speed: 3.8 },
    { id: 'dark_elf_assassin', name: 'Dark Elf Assassin', maxHealth: 90, damage: 35, speed: 5.0 },
    { id: 'abyssal_knight', name: 'Abyssal Knight', maxHealth: 150, damage: 35, speed: 4.5 },
    { id: 'bee', name: 'Bee', maxHealth: 5, damage: 1, speed: 5.0 },
    
    // Raeth Entities
    { id: 'observer_void', name: 'Void Observer', maxHealth: 200, damage: 30, speed: 1.5, attackCooldown: 2.0 },
    { id: 'observer_fire', name: 'Inferno Observer', maxHealth: 200, damage: 30, speed: 1.5, attackCooldown: 2.0 },
    { id: 'sand_worm', name: 'Dune Sand Worm', maxHealth: 50, damage: 15, speed: 0.5, attackCooldown: 3.0 },

    // NPCs
    { id: 'villager', name: 'Villager', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'wandering_bard', name: 'Wandering Bard', maxHealth: 800, damage: 5, speed: 1.5 },
    { id: 'npc_king', name: 'King', maxHealth: 1500, damage: 100, speed: 1.5 },
    { id: 'slug_folk_merchant', name: 'Slug Folk Merchant', maxHealth: 500, damage: 0, speed: 1.0 },
    { id: 'npc_merchant', name: 'Merchant', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'npc_wizard', name: 'Old Wizard', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'npc_noble', name: 'Noble', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'halfling', name: 'Halfling', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'pit_bull_folk', name: 'Pit Bull Folk', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'pomeranian_folk', name: 'Pomeranian Nomads', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'terrier_folk', name: 'Terrier Folk', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'wolf_folk', name: 'Wolf Folk', maxHealth: 500, damage: 0, speed: 2.0 },
    { id: 'squirrel_folk', name: 'Squirrel Folk', maxHealth: 400, damage: 10, speed: 5.0 },
    { id: 'beast_tamer', name: 'Beast Tamer', maxHealth: 800, damage: 0, speed: 3.0 },
    { id: 'human_knight', name: 'Human Knight', maxHealth: 200, damage: 25, speed: 3.5 },
    { id: 'human_paladin', name: 'Human Paladin', maxHealth: 250, damage: 30, speed: 3.0 },
    { id: 'human_ranger', name: 'Human Ranger', maxHealth: 150, damage: 20, speed: 4.5 },
    
    // Animals
    { id: 'dire_wolf', name: 'Dire Wolf', maxHealth: 80, damage: 25, speed: 5.5 },
    { id: 'giant_boar', name: 'Giant Boar', maxHealth: 120, damage: 15, speed: 4.8 },
    { id: 'moose', name: 'Moose', maxHealth: 150, damage: 20, speed: 4.0 },
    { id: 'deer', name: 'Deer', maxHealth: 30, damage: 0, speed: 4.5 },
    { id: 'sheep', name: 'Sheep', maxHealth: 20, damage: 0, speed: 3.0 },
    { id: 'horse', name: 'Horse', maxHealth: 50, damage: 0, speed: 6.0 },
    { id: 'turtle', name: 'Turtle', maxHealth: 100, damage: 0, speed: 1.5 },
    { id: 'giant_chicken', name: 'Giant Chicken', maxHealth: 20, damage: 0, speed: 4.0 },
    { id: 'giant_frog', name: 'Giant Frog', maxHealth: 30, damage: 0, speed: 3.0 },
    { id: 'capybara', name: 'Capybara', maxHealth: 40, damage: 0, speed: 4.0 },
    { id: 'unicorn', name: 'Unicorn', maxHealth: 60, damage: 10, speed: 7.0 },
    { id: 'bear', name: 'Bear', maxHealth: 80, damage: 20, speed: 3.5 },
    { id: 'wolf', name: 'Wolf', maxHealth: 40, damage: 12, speed: 4.0 },
    { id: 'giant_eagle', name: 'Giant Eagle', maxHealth: 200, damage: 30, speed: 9.0 },

    // THERA Entities
    { id: 'tricera_folk', name: 'Tricera Folk', maxHealth: 150, damage: 30, speed: 2.5 },
    { id: 'raptor_folk', name: 'Raptor Folk', maxHealth: 60, damage: 25, speed: 5.5 },
    { id: 'frog_folk', name: 'Frog Folk', maxHealth: 80, damage: 15, speed: 4.0 },
    { id: 'pterodactyl', name: 'Pterodactyl', maxHealth: 70, damage: 20, speed: 6.0 },
    { id: 't_rex', name: 'T-Rex', maxHealth: 500, damage: 60, speed: 4.5, attackCooldown: 1.5 },
    { id: 'raptor', name: 'Wild Raptor', maxHealth: 50, damage: 20, speed: 5.0 },

    // ATHER Entities
    { id: 'fungi_folk', name: 'Fungi Folk', maxHealth: 90, damage: 25, speed: 3.5 },
    { id: 'ogre', name: 'Ogre Bruiser', maxHealth: 400, damage: 40, speed: 3.0, attackCooldown: 2.0 },
    { id: 'troll', name: 'Cave Troll', maxHealth: 250, damage: 35, speed: 4.2 },
    { id: 'clay_golem', name: 'Clay Golem', maxHealth: 600, damage: 50, speed: 2.0, attackCooldown: 2.5 },
    
    // NORTH HEART Entities
    { id: 'winter_elf', name: 'Winter Elf', maxHealth: 200, damage: 30, speed: 4.8 },
    { id: 'yeti', name: 'Yeti', maxHealth: 350, damage: 45, speed: 3.8 },
    { id: 'frost_wolf', name: 'Frost Wolf', maxHealth: 150, damage: 25, speed: 5.5 }
];
