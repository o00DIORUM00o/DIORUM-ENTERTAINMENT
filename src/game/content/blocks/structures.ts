import { BlockDef } from '../../registries/BlockRegistry';
import { BlockType } from '../../constants/BlockType';

export const STRUCTURES_BLOCKS: BlockDef[] = [
    {
        id: 'demon_portal',
        name: 'Demon Portal',
        type: BlockType.DEMON_PORTAL,
        isIndestructible: true,
        color: { r: 139, g: 0, b: 0 },
    },{
        id: 'goblin_camp',
        name: 'Goblin Camp',
        type: BlockType.GOBLIN_CAMP,
        color: { r: 100, g: 50, b: 20 },
    },{
        id: 'tent',
        name: 'Tent',
        type: BlockType.TENT,
        color: { r: 100, g: 50, b: 20 },
    },{
        id: 'bone_pile_spawner',
        name: 'Bone Pile Spawner',
        type: BlockType.BONE_PILE_SPAWNER,
        isSolid: false,
        color: { r: 240, g: 240, b: 230 },
    },{
        id: 'shrine',
        name: 'Shrine',
        type: BlockType.SHRINE,
        color: { r: 218, g: 165, b: 32 },
    },{
        id: 'orc_tent',
        name: 'Orc Tent',
        type: BlockType.ORC_TENT,
        color: { r: 80, g: 30, b: 30 },
    },{
        id: 'goblin_shaman_tent',
        name: 'Goblin Shaman Tent',
        type: BlockType.GOBLIN_SHAMAN_TENT,
        color: { r: 120, g: 30, b: 120 },
    },{
        id: 'campfire',
        name: 'Campfire',
        type: BlockType.CAMPFIRE,
        hardness: 5,
        color: { r: 255, g: 140, b: 0 },
    },{
        id: 'abyssal_spawner',
        name: 'Abyssal Spawner',
        type: BlockType.ABYSSAL_SPAWNER,
        color: { r: 150, g: 0, b: 50 },
    },{
        id: 'observer_spawner',
        name: 'Observer Spawner',
        type: BlockType.OBSERVER_SPAWNER,
        isSolid: false,
        color: { r: 80, g: 0, b: 80 },
    },{
        id: 'horde_spawner',
        name: 'Horde Spawner',
        type: BlockType.HORDE_SPAWNER,
        color: { r: 180, g: 0, b: 0 },
    },{
        id: 'areth_spawner',
        name: 'Areth Spawner',
        type: BlockType.ARETH_SPAWNER,
        color: { r: 150, g: 20, b: 20 },
    },{
        id: 'kobold_tent',
        name: 'Kobold Tent',
        type: BlockType.KOBOLD_TENT,
        color: { r: 170, g: 120, b: 80 },
    },{
        id: 'drake_nest',
        name: 'Drake Nest',
        type: BlockType.DRAKE_NEST,
        color: { r: 130, g: 50, b: 20 },
    },{
        id: 'fairy_spawner',
        name: 'Fairy Pool',
        type: BlockType.FAIRY_SPAWNER,
        color: { r: 255, g: 100, b: 220 }, // Pink
    },{
        id: 'dark_elf_spawner',
        name: 'Dark Elf Spawner',
        type: BlockType.DARK_ELF_SPAWNER,
        color: { r: 80, g: 60, b: 120 }, // Purple/Dark
    },{
        id: 'gryphon_nest',
        name: 'Gryphon Nest',
        type: BlockType.GRYPHON_NEST,
        color: { r: 160, g: 150, b: 100 },
    },{
        id: 'gnome_spawner',
        name: 'Gnome Spawner',
        type: BlockType.GNOME_SPAWNER,
        color: { r: 100, g: 150, b: 150 }, // Invisible generally, but editor color
    },{
        id: 'dwarf_spawner',
        name: 'Dwarf Spawner',
        type: BlockType.DWARF_SPAWNER,
        color: { r: 120, g: 100, b: 80 },
    },{
        id: 'rock_golem_spawner',
        name: 'Rock Golem Spawner',
        type: BlockType.ROCK_GOLEM_SPAWNER,
        color: { r: 100, g: 100, b: 100 },
    },{ id: 'goblin_tent_rockhurler', name: 'Goblin Rockhurler Tent', type: BlockType.GOBLIN_TENT_ROCKHURLER, color: { r: 100, g: 120, b: 80 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'goblin_tent_gardener', name: 'Goblin Gardener Tent', type: BlockType.GOBLIN_TENT_GARDENER, color: { r: 80, g: 140, b: 80 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'goblin_tent_boomeranger', name: 'Goblin Boomeranger Tent', type: BlockType.GOBLIN_TENT_BOOMERANGER, color: { r: 120, g: 100, b: 60 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'goblin_tent_alchemist', name: 'Goblin Alchemist Tent', type: BlockType.GOBLIN_TENT_ALCHEMIST, color: { r: 60, g: 80, b: 140 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'goblin_tent_miner', name: 'Goblin Miner Tent', type: BlockType.GOBLIN_TENT_MINER, color: { r: 90, g: 90, b: 100 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'orc_tent_brute', name: 'Orc Brute Tent', type: BlockType.ORC_TENT_BRUTE, color: { r: 140, g: 80, b: 60 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'orc_tent_shaman', name: 'Orc Shaman Tent', type: BlockType.ORC_TENT_SHAMAN, color: { r: 160, g: 60, b: 160 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'orc_tent_hunter', name: 'Orc Hunter Tent', type: BlockType.ORC_TENT_HUNTER, color: { r: 120, g: 140, b: 60 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'kobold_tent_trapper', name: 'Kobold Trapper Tent', type: BlockType.KOBOLD_TENT_TRAPPER, color: { r: 180, g: 140, b: 60 }, isSolid: true, hardness: 50, isIndestructible: true },{ id: 'kobold_tent_warrior', name: 'Kobold Warrior Tent', type: BlockType.KOBOLD_TENT_WARRIOR, color: { r: 200, g: 60, b: 60 }, isSolid: true, hardness: 50, isIndestructible: true },{ id: 'kobold_tent_shaman', name: 'Kobold Shaman Tent', type: BlockType.KOBOLD_TENT_SHAMAN, color: { r: 60, g: 100, b: 200 }, isSolid: true, hardness: 50, isIndestructible: true },{ id: 'kobold_tent_bomber', name: 'Kobold Bomber Tent', type: BlockType.KOBOLD_TENT_BOMBER, color: { r: 250, g: 100, b: 0 }, isSolid: true, hardness: 50, isIndestructible: true },{ id: 'kobold_tent_dragonkeeper', name: 'Kobold Dragonkeeper Shrine', type: BlockType.KOBOLD_TENT_DRAGONKEEPER, color: { r: 212, g: 175, b: 55 }, isSolid: true, hardness: 50, isIndestructible: true },{ id: 'dark_elf_tent', name: 'Dark Elf Tent', type: BlockType.DARK_ELF_TENT, color: { r: 60, g: 40, b: 80 }, isSolid: true, hardness: 120, isIndestructible: true },{ id: 'giant_camp', name: 'Giant Camp', type: BlockType.GIANT_CAMP, color: { r: 80, g: 70, b: 60 }, isSolid: true, hardness: 200, isIndestructible: true },{ id: 'titan_nest', name: 'Titan Nest', type: BlockType.TITAN_NEST, color: { r: 120, g: 160, b: 80 }, isSolid: true, hardness: 250, isIndestructible: true },{ id: 'observer_spawner', name: 'Observer Spawner', type: BlockType.OBSERVER_SPAWNER, color: { r: 150, g: 50, b: 250 }, isSolid: true, isIndestructible: true },{ id: 'djinn_lamp_shrine', name: 'Djinn Lamp Shrine', type: BlockType.DJINN_LAMP_SHRINE, color: { r: 255, g: 215, b: 0 }, isSolid: true, hardness: 200 },{ id: 'gremlin_camp', name: 'Gremlin Camp', type: BlockType.GREMLIN_CAMP, color: { r: 60, g: 100, b: 60 }, isSolid: true, hardness: 150 },{ id: 'sphynx_spawner', name: 'Sphinx Spawner', type: BlockType.SPHINX_SPAWNER, color: { r: 218, g: 165, b: 32 }, isSolid: true, isIndestructible: true },{ id: 'tricera_tent', name: 'Tricera Folk Tent', type: BlockType.TRICERA_TENT, color: { r: 140, g: 160, b: 120 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'raptor_tent', name: 'Raptor Folk Tent', type: BlockType.RAPTOR_TENT, color: { r: 180, g: 100, b: 60 }, isSolid: true, hardness: 80, isIndestructible: true },{ id: 'frog_tent', name: 'Frog Folk Hut', type: BlockType.FROG_TENT, color: { r: 40, g: 140, b: 100 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'fungi_folk_tent', name: 'Fungi Folk Hut', type: BlockType.FUNGI_FOLK_TENT, color: { r: 160, g: 80, b: 80 }, isSolid: true, hardness: 60, isIndestructible: true },{ id: 'halfling_house_spawner', name: 'Halfling House', type: BlockType.HALFLING_HOUSE_SPAWNER, color: { r: 180, g: 140, b: 80 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'pit_bull_tent', name: 'Pit Bull Tent', type: BlockType.PIT_BULL_TENT, color: { r: 120, g: 100, b: 80 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'pomeranian_wagon', name: 'Pomeranian Wagon', type: BlockType.POMERANIAN_WAGON, color: { r: 200, g: 180, b: 140 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'terrier_tent', name: 'Terrier Tent', type: BlockType.TERRIER_TENT, color: { r: 140, g: 120, b: 90 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'wolf_folk_camp', name: 'Wolf Folk Camp', type: BlockType.WOLF_FOLK_CAMP, color: { r: 100, g: 110, b: 120 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'human_castle_spawner', name: 'Human Castle Spawner', type: BlockType.HUMAN_CASTLE_SPAWNER, color: { r: 150, g: 150, b: 160 }, isSolid: true, hardness: 150, isIndestructible: true },{ id: 'human_outpost_spawner', name: 'Human Outpost Spawner', type: BlockType.HUMAN_OUTPOST_SPAWNER, color: { r: 160, g: 140, b: 120 }, isSolid: true, hardness: 120, isIndestructible: true },{ id: 'archer_tent', name: 'Archer Tent', type: BlockType.ARCHER_TENT, color: { r: 160, g: 120, b: 80 }, isSolid: true, hardness: 50 },{ id: 'dark_knight_tent', name: 'Dark Knight Spawner', type: BlockType.DARK_KNIGHT_TENT, color: { r: 30, g: 30, b: 40 }, isSolid: true, hardness: 80 },{ id: 'quest_dungeon_spawner', name: 'Quest Dungeon', type: BlockType.QUEST_DUNGEON_SPAWNER, color: { r: 0, g: 0, b: 0 }, isSolid: true, isIndestructible: true },{ id: 'quest_npc_spawner', name: 'Quest NPC Spawner', type: BlockType.QUEST_NPC_SPAWNER, color: { r: 0, g: 0, b: 0 }, isSolid: true, isIndestructible: true },{ id: 'beast_camp', name: 'Beast Camp', type: BlockType.BEAST_CAMP, color: { r: 70, g: 50, b: 20 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'beast_tamer_camp', name: 'Beast Tamer Camp', type: BlockType.BEAST_TAMER_CAMP, color: { r: 180, g: 150, b: 100 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'loyal_knight_tent', name: 'Loyal Knight Tent', type: BlockType.LOYAL_KNIGHT_TENT, color: { r: 50, g: 100, b: 200 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'loyal_archer_tent', name: 'Loyal Archer Tent', type: BlockType.LOYAL_ARCHER_TENT, color: { r: 50, g: 200, b: 100 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'escalation_spawner', name: 'Escalation Spawner', type: BlockType.ESCALATION_SPAWNER, color: { r: 255, g: 50, b: 50 }, isSolid: true, hardness: 500, isIndestructible: false }, { id: 'lava_golem_spawner', name: 'Lava Golem Spawner', type: BlockType.LAVA_GOLEM_SPAWNER, color: { r: 200, g: 50, b: 0 }, isSolid: true, hardness: 200 }, { id: 'gargoyle_spawner', name: 'Gargoyle Pedestal', type: BlockType.GARGOYLE_SPAWNER, color: { r: 100, g: 100, b: 100 }, isSolid: true, hardness: 250 }, { id: 'phantom_wizard_spawner', name: 'Phantom Wizard Spawner', type: BlockType.PHANTOM_WIZARD_SPAWNER, color: { r: 150, g: 50, b: 255 }, isSolid: true, hardness: 300 }, { id: 'frost_caster_tent', name: 'Frost Caster Tent', type: BlockType.FROST_CASTER_TENT, color: { r: 100, g: 200, b: 255 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'loyal_frost_caster_tent', name: 'Loyal Frost Caster Tent', type: BlockType.LOYAL_FROST_CASTER_TENT, color: { r: 100, g: 200, b: 255 }, isSolid: true, hardness: 100, isIndestructible: true },{ id: 'merchant_tent', name: 'Merchant Tent', type: BlockType.MERCHANT_TENT, color: { r: 180, g: 150, b: 80 }, isSolid: true, hardness: 100, isIndestructible: false }, { id: 'priest_tent', name: 'Priest Tent', type: BlockType.PRIEST_TENT, color: { r: 240, g: 240, b: 250 }, isSolid: true, hardness: 100, isIndestructible: false }, { id: 'wandering_bard_tent', name: 'Wandering Bard Tent', type: BlockType.WANDERING_BARD_TENT, color: { r: 180, g: 100, b: 200 }, isSolid: true, hardness: 100, isIndestructible: false }, { id: 'throne_block', name: 'Throne', type: BlockType.THRONE_BLOCK, color: { r: 255, g: 215, b: 0 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'king_spawner', name: 'King Spawner', type: BlockType.KING_SPAWNER, color: { r: 255, g: 215, b: 0 }, isSolid: true, hardness: 100, isIndestructible: true }, { id: 'dungeon_stairs', name: 'Dungeon Stairs', type: BlockType.DUNGEON_STAIRS, color: { r: 30, g: 30, b: 30 }, isSolid: false, hardness: 200, isIndestructible: true } ];
