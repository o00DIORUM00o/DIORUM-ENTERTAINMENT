import { BlockType } from '../../constants/BlockType';
import { SchematicDef } from '../../registries/StructureRegistry';

export const CORE_STRUCTURES: SchematicDef[] = [
    {
        id: 'DUNGEON_ENTRANCE',
        anchorX: 2,
        anchorY: 2,
        anchorZ: 4, 
        palette: {
            // Space (' ') means NO-OP (don't overwrite this block) if we want, or AIR.
            // Let's use '_' for AIR, and ' ' for NO-OP. Actually, changing the ground below might be bad if we overwrite it with air.
            // Wait, for 3D structures we often want to "skip" setting blocks outside the footprint.
            // A space ' ' will mean "Skip / Do not mutate", so the terrain remains untouched.
            // '_' will explicitly place AIR.
            '_': { block: BlockType.AIR },
            'X': { block: BlockType.HEAVY_STONE },
            'D': { block: BlockType.DOOR_CLOSED },
            'P': { block: BlockType.POT },
            'S': { block: BlockType.WOODEN_STAIRCASE }
        },
        layers: [
            // Z = -4
            ["     ", "     ", "  S  ", "  _  ", "     "],
            // Z = -3
            ["     ", "     ", "  S  ", "  _  ", "     "],
            // Z = -2
            ["     ", "     ", "  S  ", "  _  ", "     "],
            // Z = -1
            ["     ", "     ", "  S  ", "  _  ", "     "],
            // Z = 0 (Floor)
            ["XXXXX", "XXXXX", "XXSXX", "XX_XX", "XXXXX"],
            // Z = 1 (Wall 1)
            ["XXXXX", "XP PX", "X _ X", "X _ X", "XXDXX"],
            // Z = 2 (Wall 2)
            ["XXXXX", "X _ X", "X _ X", "X _ X", "XX_XX"],
            // Z = 3 (Roof)
            ["XXXXX", "XXXXX", "XXXXX", "XXXXX", "XXXXX"]
        ]
    },
    {
        id: 'WIZARD_TOWER',
        anchorX: 4,
        anchorY: 4,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR }, // For the tower area, we want to clear a big bounding box? No, wait. Just use '_' for explicit air.
            '_': { block: BlockType.AIR },
            'W': { block: BlockType.WIZARD_TOWER_WALL },
            'F': { block: BlockType.WIZARD_TOWER_FLOOR },
            'D': { block: BlockType.DOOR_CLOSED },
            'C': { block: BlockType.CARPENTERS_BENCH },
            'B': { block: BlockType.BED },
            'X': { block: BlockType.CHEST },
            'T': { block: BlockType.TORCH },
            '.': { block: BlockType.AIR } // 'skip' isn't needed here if we use a bounding box of air. Let's use ' ' for skip, '_' for air
        },
        // Old wizard tower logic: radius 3. So diameter 7. Let's make an 9x9 grid to accommodate roof (radius+1)
        layers: [
            // Z = 0 (Floor)
            [
                "         ",
                "   FFF   ",
                "  FFFFF  ",
                " FFFFFFF ",
                " FFFFFFF ",
                " FFFFFFF ",
                "  FFFFF  ",
                "   FFF   ",
                "         "
            ],
            // Z = 1 (Wall 1 + Interior)
            [
                "         ",
                "   WDW   ",
                "  W___W  ",
                " W_____W ",
                " W__T__W ",
                " W_C_X_W ",
                "  W_B_W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 2 (Wall 2)
            [
                "         ",
                "   W_W   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 3 (Wall 3 + Windows)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " _______ ",
                " W_____W ",
                "  W___W  ",
                "   W_W   ",
                "         "
            ],
            // Z = 4 (Wall 4)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 5 (Wall 5)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 6 (Wall 6)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 7 (Wall 7)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 8 (Wall 8)
            [
                "         ",
                "   WWW   ",
                "  W___W  ",
                " W_____W ",
                " W_____W ",
                " W_____W ",
                "  W___W  ",
                "   WWW   ",
                "         "
            ],
            // Z = 9 (Roof 1)
            [
                "  WWWWW  ",
                " WWWWWWW ",
                "WWWWWWWWW",
                "WWWWWWWWW",
                "WWWWWWWWW",
                "WWWWWWWWW",
                "WWWWWWWWW",
                " WWWWWWW ",
                "  WWWWW  "
            ],
            // Z = 10 (Roof 2)
            [
                "         ",
                "  WWWWW  ",
                " WWWWWWW ",
                " WWWWWWW ",
                " WWWWWWW ",
                " WWWWWWW ",
                " WWWWWWW ",
                "  WWWWW  ",
                "         "
            ]
        ]
    },
    {
        id: 'VILLAGE_HOUSE',
        anchorX: 2,
        anchorY: 2,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR }, 
            '_': { block: BlockType.AIR },
            'F': { block: BlockType.WOOD_FLOOR },
            'W': { block: BlockType.WOOD_WALL },
            'D': { block: BlockType.DOOR_CLOSED }
        },
        layers: [
            // Z = 0 (Floor)
            [
                "FFFFF",
                "FFFFF",
                "FFFFF",
                "FFFFF",
                "FFFFF"
            ],
            // Z = 1 (Wall 1)
            [
                "WWDWW",
                "W___W",
                "W___W",
                "W___W",
                "WWDWW"
            ],
            // Z = 2 (Wall 2)
            [
                "WWWWW",
                "W___W",
                "W___W",
                "W___W",
                "WWWWW"
            ],
            // Z = 3 (Roof)
            [
                "FFFFF",
                "FFFFF",
                "FFFFF",
                "FFFFF",
                "FFFFF"
            ]
        ]
    },
    {
        id: 'VILLAGE_WELL',
        anchorX: 1,
        anchorY: 1,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR },
            '_': { block: BlockType.AIR },
            'S': { block: BlockType.STONE },
            'W': { block: BlockType.WATER }
        },
        layers: [
            // Z = 0
            [
                "SSS",
                "SWS",
                "SSS"
            ],
            // Z = 1
            [
                "SSS",
                "S_S",
                "SSS"
            ]
        ]
    },
    {
        id: 'DRAGON_LAIR',
        anchorX: 4,
        anchorY: 4,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR }, // air space around
            '_': { block: BlockType.AIR }, // explicitly set to air inside
            'O': { block: BlockType.OBSIDIAN },
            'B': { block: BlockType.DRAGON_BONE },
            'L': { block: BlockType.LAVA }
        },
        layers: [
            // Z = 0 - Ground layer (Lava and obsidian crater)
            [
                " OOOOOOO ",
                "OOOOOOOOO",
                "OOLLLLLOO",
                "OOLLLLLOO",
                "OOLLLLLOO",
                "OOLLLLLOO",
                "OOLLLLLOO",
                "OOOOOOOOO",
                " OOOOOOO "
            ],
            // Z = 1 - Rim of the crater with some dragon bones sticking up
            [
                " OOOOOOO ",
                "OO_____OO",
                "O_______O",
                "O_______O",
                "O_______O",
                "O_______O",
                "O_______O",
                "OO_____OO",
                " OOBBOOO "
            ],
            // Z = 2 - The boss spawn zone and top edge
            [
                " O   O O ",
                "O       O",
                "         ",
                "         ",
                "         ",
                "         ",
                "         ",
                "O       O",
                " O B B O "
            ]
        ]
    },
    {
        id: 'DRACONIC_SHRINE',
        anchorX: 2,
        anchorY: 2,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR },
            '_': { block: BlockType.AIR },
            'O': { block: BlockType.OBSIDIAN },
            'G': { block: BlockType.GOLD_ORE },
            'S': { block: BlockType.DRACONIC_MERCHANT }
        },
        layers: [
            // Z = 0
            [
                "OOOOO",
                "OGGGO",
                "OG_GO",
                "OGGGO",
                "OOOOO"
            ],
            // Z = 1
            [
                "O   O",
                "     ",
                "  S  ",
                "     ",
                "O   O"
            ],
            // Z = 2
            [
                "O   O",
                "     ",
                "     ",
                "     ",
                "O   O"
            ]
        ]
    },
    {
        id: 'ARENA',
        anchorX: 6,
        anchorY: 6,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR },
            '_': { block: BlockType.AIR },
            'B': { block: BlockType.BLACK_MARBLE },
            'P': { block: BlockType.GREEN_MARBLE },
            'F': { block: BlockType.OBSIDIAN },
            'A': { block: BlockType.BLOOD_ALTAR }
        },
        layers: [
            // Z = 0 (Floor)
            [
                "BBBBBBBBBBBBB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BPPPPPPPPPPPB",
                "BBBBBBBBBBBBB"
            ],
            // Z = 1 (Walls/Altar)
            [
                "FFFFF   FFFFF",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "             ",
                "      A      ",
                "             ",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "FFFFF   FFFFF"
            ],
            // Z = 2
            [
                "FFFFF   FFFFF",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "             ",
                "             ",
                "             ",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "FFFFF   FFFFF"
            ],
            // Z = 3
            [
                "FFFFF   FFFFF",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "             ",
                "             ",
                "             ",
                "F           F",
                "F           F",
                "F           F",
                "F           F",
                "FFFFF   FFFFF"
            ]
        ]
    },
    {
        id: 'ARENA_WORM',
        anchorX: 6,
        anchorY: 6,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR },
            '_': { block: BlockType.AIR },
            'B': { block: BlockType.SAND },
            'P': { block: BlockType.SAND },
            'S': { block: BlockType.STONE },
            'A': { block: BlockType.SAND_TERROR_ALTAR }
        },
        layers: [
            // Z = 0 (Floor)
            [
                "SSSSSSSSSSSSS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SSSSSSSSSSSSS"
            ],
            // Z = 1 (Walls/Altar)
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "      A      ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ],
            // Z = 2
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "             ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ],
            // Z = 3
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "             ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ]
        ]
    },
    {
        id: 'ARENA_WIZARD',
        anchorX: 6,
        anchorY: 6,
        anchorZ: 0,
        palette: {
            ' ': { block: BlockType.AIR },
            '_': { block: BlockType.AIR },
            'B': { block: BlockType.BLACK_MARBLE },
            'P': { block: BlockType.BLACK_MARBLE },
            'S': { block: BlockType.OBSIDIAN },
            'A': { block: BlockType.PHANTOM_WIZARD_ALTAR }
        },
        layers: [
            // Z = 0 (Floor)
            [
                "SSSSSSSSSSSSS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SBBBBBBBBBBBS",
                "SSSSSSSSSSSSS"
            ],
            // Z = 1 (Walls/Altar)
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "      A      ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ],
            // Z = 2
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "             ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ],
            // Z = 3
            [
                "SSSSS   SSSSS",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "             ",
                "             ",
                "             ",
                "S           S",
                "S           S",
                "S           S",
                "S           S",
                "SSSSS   SSSSS"
            ]
        ]
    }
];
