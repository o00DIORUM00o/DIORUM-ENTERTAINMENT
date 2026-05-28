import { RaceDef } from '../../registries/RaceRegistry';

export const CORE_RACES: RaceDef[] = [];

function createRace(id: string, name: string, description: string, startingTalents: Record<string, number>): RaceDef {
    return { id, name, description, startingTalents };
}

// Default Fallback Talents
const defaultTalents = { vitality: 2, endurance: 1 };

const RACE_GROUPS = [
    {
        names: ['HUMAN', 'HALF ELF'],
        talents: { vitality: 2, endurance: 2, focus: 1 }
    },
    {
        names: ['HILL DWARF', 'MOUNTAIN DWARF', 'CYCLOPSE DWARF'],
        talents: { masonry: 3 }
    },
    {
        names: ['HIGH ELF', 'WOOD ELF', 'RED ELF', 'TIGER ELF', 'WINTER ELF', 'SEA ELF'],
        talents: { focus: 2, reading: 1 }
    },
    {
        names: ['DARK ELF'],
        talents: { swords: 3, focus: 2 }
    },
    {
        names: ['TINKER GNOME', 'GLOW GNOME'],
        talents: { smithing: 3 }
    },
    {
        names: ['WOOD GOBLIN', 'SWAMP GOBLIN', 'ORC', 'OGRE'],
        talents: { swords: 2, vitality: 1 }
    },
    {
        names: ['DARK ORC'],
        talents: { swords: 3, vitality: 2 }
    },
    {
        names: ['BEAR FOLK', 'DEER FOLK', 'PIT BULL FOLK', 'WOLF FOLK'],
        talents: { vitality: 3 }
    },
    {
        names: ['RABBIT FOLK'],
        talents: { jump: 2, dash: 1 }
    }
];

import { RACES } from '../../constants/CharacterCreation';

// Auto-generate full list from character creation constant
RACES.forEach(raceName => {
    let talents: Record<string, number> = defaultTalents;
    for (const group of RACE_GROUPS) {
        if (group.names.includes(raceName)) {
            talents = group.talents;
            break;
        }
    }
    CORE_RACES.push(createRace(raceName, raceName, `The ${raceName} race.`, talents));
});
