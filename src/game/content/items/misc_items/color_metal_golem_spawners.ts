import type { Item } from '../../../registries/ItemRegistry';

export const COLOR_METAL_GOLEM_SPAWNERS: Record<string, Item> = {
    // Enemy Bosses
    'red_metal_golem_spawner': {
        id: "red_metal_golem_spawner", name: "Red Metal Golem", description: "A dormant construct of Red Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'RED_METAL_GOLEM'
    },
    'green_metal_golem_spawner': {
        id: "green_metal_golem_spawner", name: "Green Metal Golem", description: "A dormant construct of Green Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'GREEN_METAL_GOLEM'
    },
    'blue_metal_golem_spawner': {
        id: "blue_metal_golem_spawner", name: "Blue Metal Golem", description: "A dormant construct of Blue Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'BLUE_METAL_GOLEM'
    },
    'yellow_metal_golem_spawner': {
        id: "yellow_metal_golem_spawner", name: "Yellow Metal Golem", description: "A dormant construct of Yellow Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'YELLOW_METAL_GOLEM'
    },
    'orange_metal_golem_spawner': {
        id: "orange_metal_golem_spawner", name: "Orange Metal Golem", description: "A dormant construct of Orange Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'ORANGE_METAL_GOLEM'
    },
    'purple_metal_golem_spawner': {
        id: "purple_metal_golem_spawner", name: "Purple Metal Golem", description: "A dormant construct of Purple Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'PURPLE_METAL_GOLEM'
    },
    'black_metal_golem_spawner': {
        id: "black_metal_golem_spawner", name: "Black Metal Golem", description: "A dormant construct of Black Metal. Summons a hostile boss.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsBoss: 'BLACK_METAL_GOLEM'
    },
    
    // Allies/NPCs
    'copper_golem_spawner': {
        id: "copper_golem_spawner", name: "Copper Golem", description: "A dormant construct of Copper. Summons a loyal companion.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsCompanion: 'COPPER_GOLEM'
    },
    'gold_golem_spawner': {
        id: "gold_golem_spawner", name: "Gold Golem", description: "A dormant construct of Gold. Summons a wealthy merchant.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsNPC: 'GOLD_GOLEM'
    },
    'silver_golem_spawner': {
        id: "silver_golem_spawner", name: "Silver Golem", description: "A dormant construct of Silver. Summons a healing companion.", category: "MATERIAL", maxStack: 1, quantity: 1, summonsCompanion: 'SILVER_GOLEM'
    }
};
