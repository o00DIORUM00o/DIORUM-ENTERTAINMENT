
export const HOMEWORLDS: Record<string, { description: string, zodiacs: string[] }> = {
    'ARETH': {
        description: 'HOMEWORLD OF THE DRAGONS, KOBOLDS, DRAGON FOLK, & DRAKKEN',
        zodiacs: ['THE DRAGON', 'THE EGG', 'THE DIAMOND', 'THE CAVE', 'THE COIN', 'THE TROVE', 'THE FLAME', 'THE CLOUD', 'THE DISK']
    },
    'TARHE': {
        description: 'THE MOUNTAIN HOMES. HOMEWORLD OF THE DWARVES & GNOMES',
        zodiacs: ['THE MOUNTAIN', 'THE HILL', 'THE GATE', 'THE AXE', 'THE PICK AXE', 'THE ANVIL', 'THE STONE', 'THE COG', 'THE GEM', 'THE FORGE', 'THE MUG']
    },
    'TERHA': {
        description: 'HOMEWORLD OF THE ORCS, GOBLINS, & GODZILLA TITANS. The godzilla patrol & protect their sacred land. The orcs & goblins live in the shadows of these massive creatures & revere them as living gods.',
        zodiacs: ['THE TITAN', 'THE TENT', 'THE MARCHING', 'THE BATTLE', 'THE BEAST', 'THE RAIN', 'THE HAMMER', 'THE LINK', 'THE BONE']
    },
    'HEART': {
        description: 'HOMEWORLD OF THE ELVES, FAIRIES, GRYPHONS, GRYPHON FOLK, TURTLE FOLK, & FEY FOLK. MARBLE MOUNTAINS & CRYSTAL SPIRES. THE ELVEN RACES INCLUDES, THE HIGH BORN ELVES, THE WOOD ELVES, THE DARK ELVES, & THE WINTER ELVES',
        zodiacs: ['THE SPIRE', 'THE ROSE', 'THE CARRIAGE', 'THE WATERFALL', 'THE GRYPHON', 'THE EAGLE', 'THE QUILL', 'THE SCROLL', 'THE LION', 'THE WAND', 'THE BOW']
    },
    'RATHE': {
        description: 'HOMEWORLD OF THE SPHINX, GARGOYLES, GREMLINS, & DJINN',
        zodiacs: ['THE PUZZLE', 'THE CUBE', 'THE LOCK', 'THE KEY', 'THE LAMP', 'THE BOTTLE', 'THE RIDDLE', 'THE HOURGLASS', 'THE TRIANGLE']
    },
    'THAER': {
        description: 'HOMEWORLD OF THE TREE FOLK, THE IMPS, & BEAST RACES. RABBIT FOLK, SQUARREL FOLK, ELEPHANT FOLK, DEER FOLK, & BEAR KIN',
        zodiacs: ['THE OAK', 'THE DEER', 'THE PINE', 'THE MOUSE', 'THE LEAF', 'THE ORNAMENT', 'THE SHOVEL', 'THE ACORN', 'THE BRANCH', 'THE SEED', 'THE APPLE']
    },
    'THERA': {
        description: 'HOMEWORLD OF THE FROG FOLK, DINO FOLK, & GLOW FOLK. LAND OF SWAMPS & TROPICAL CANYONS',
        zodiacs: ['THE FROG', 'THE LEDGE', 'THE FIRN', 'THE LOG', 'THE MORTAR', 'THE PESTLE', 'THE SUNDIAL', 'THE POND', 'THE SPEAR', 'THE WEED']
    },
    'ATHER': {
        description: 'HOMEWORLD OF THE FUNGI FOLK, THE GIANTS, OGRES, & TROLLS',
        zodiacs: ['THE SHROOM', 'THE CAP', 'THE BOULDER', 'THE HORN', 'THE FIELD', 'THE SLUG', 'THE MOTH', 'THE CLUB', 'THE HOOK', 'THE CLEAVER']
    },
    'THREA': {
        description: 'BIODIVERSE MELTING POT',
        zodiacs: ['THE SHIP', 'THE WAGON', 'THE BAG', 'THE THRONE', 'THE CROWN', 'THE RING', 'THE BOOK', 'THE CASTLE', 'THE BLADE']
    },
    'HERAT': {
        description: 'HOMEWORLD OF THE HUMANS, THE DOG FOLK, & HALFLINGS (HOBBITS, LITTLE FOLK)',
        zodiacs: ['THE ARMOR', 'THE WHEEL', 'THE STAFF', 'THE RAM', 'THE BAT', 'THE TURTLE', 'THE SCEPTER', 'THE ORACLE', 'THE BEAR']
    },
    'RAETH': {
        description: 'THE BLACK DUNES. HOMEWORLD OF THE SLUG FOLK, BEHOLDERS, RUNE WALKERS, & SCORPION FOLK',
        zodiacs: ['THE EYE', 'THE CHISEL', 'THE DRUM', 'THE GHOST', 'THE CHEST', 'THE PEARL', 'THE DUNE', 'THE RIVER', 'THE ROAD', 'THE TRAVELER']
    }
};

export const RACES = [
    'HUMAN', 'HILL DWARF', 'MOUNTAIN DWARF', 'HIGH ELF', 'WOOD ELF', 'DARK ELF', 'RED ELF', 'TIGER ELF', 'WINTER ELF', 'SEA ELF', 'HALF ELF', 'TINKER GNOME', 'GLOW GNOME', 'WOOD GOBLIN', 'SWAMP GOBLIN', 'ORC', 'DARK ORC', 'HALFLING', 'COPPER DRAGON FOLK', 'COPPER KOBOLD', 'COPPER DRAKKEN', 'RAT FOLK', 'SHROOM FOLK', 'SQUARREL FOLK', 'RABBIT FOLK', 'GREEN ALIEN', 'RED ALIEN', 'LIZARD ALIEN', 'BEAR FOLK', 'DEER FOLK', 'PIT BULL FOLK', 'PALMERAGIAN', 'WOLF FOLK', 'OGRE', 'RUNE FOLK', 'TURTLE FOLK', 'NAGA', 'IMP', 'GREMLIN', 'TROLL', 'LEPRACHAN', 'TRICERA FOLK', 'HIGH MIND', 'YETTI', 'CYCLOPSE DWARF'
];

export const RACE_COLORS: Record<string, string[]> = {
    'HUMAN': ['#ffdfc4', '#f0d5be', '#eebb94', '#d2a17c', '#b5815c', '#8d5524', '#c68642', '#3d2c23', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'HILL DWARF': ['#d2a17c', '#b5815c', '#8d5524', '#c68642', '#9e6b42', '#7a4b31', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'MOUNTAIN DWARF': ['#b5815c', '#8d5524', '#7a4b31', '#5c3a21', '#4a2e1b', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'HIGH ELF': ['#fff5e6', '#ffe4c4', '#ffdead', '#f5deb3', '#e6e6fa', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'WOOD ELF': ['#d2b48c', '#c19a6b', '#a67b5b', '#8b5a2b', '#6b8e23', '#556b2f', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'DARK ELF': ['#4b0082', '#483d8b', '#2f4f4f', '#191970', '#000000', '#36454f', '#ffffff', '#e0e0e0', '#888888', '#222222', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RED ELF': ['#cd5c5c', '#f08080', '#fa8072', '#e9967a', '#8b0000', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'TIGER ELF': ['#ff8c00', '#ffa500', '#ff7f50', '#d2691e', '#8b4513', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'WINTER ELF': ['#e0ffff', '#afeeee', '#add8e6', '#87ceeb', '#b0e0e6', '#f0f8ff', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SEA ELF': ['#20b2aa', '#48d1cc', '#40e0d0', '#00ced1', '#5f9ea0', '#4682b4', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'HALF ELF': ['#ffdfc4', '#f0d5be', '#eebb94', '#d2a17c', '#b5815c', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'TINKER GNOME': ['#f5deb3', '#deb887', '#d2b48c', '#bc8f8f', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'GLOW GNOME': ['#ffff00', '#adff2f', '#7fff00', '#00ff00', '#32cd32', '#ff00ff', '#00ffff', '#39ff14', '#ff3131', '#ff0099', '#9d00ff', '#7df9ff', '#ff5e00', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#888800', '#ffff88', '#880088', '#ff88ff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'WOOD GOBLIN': ['#228b22', '#008000', '#006400', '#556b2f', '#808000', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SWAMP GOBLIN': ['#556b2f', '#6b8e23', '#808000', '#2f4f4f', '#4a5d23', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'ORC': ['#32cd32', '#228b22', '#008000', '#006400', '#8b4513', '#a0522d', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'DARK ORC': ['#006400', '#004d00', '#2f4f4f', '#1a331a', '#3e2723', '#212121', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'HALFLING': ['#ffdfc4', '#f0d5be', '#eebb94', '#d2a17c', '#b5815c', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'COPPER DRAGON FOLK': ['#b87333', '#d2691e', '#cd853f', '#a0522d', '#8b4513', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'COPPER KOBOLD': ['#b87333', '#cd853f', '#d2691e', '#8b4513', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'COPPER DRAKKEN': ['#b87333', '#a0522d', '#8b4513', '#5c4033', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RAT FOLK': ['#a9a9a9', '#808080', '#696969', '#778899', '#708090', '#d3d3d3', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SHROOM FOLK': ['#f5f5dc', '#fff8dc', '#ffebcd', '#ffe4c4', '#ffb6c1', '#db7093', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SQUARREL FOLK': ['#8b4513', '#a0522d', '#cd853f', '#d2691e', '#b8860b', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RABBIT FOLK': ['#ffffff', '#f5f5f5', '#dcdcdc', '#d3d3d3', '#a9a9a9', '#8b4513', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'GREEN ALIEN': ['#00ff00', '#32cd32', '#00fa9a', '#00ff7f', '#7fff00', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RED ALIEN': ['#ff0000', '#dc143c', '#b22222', '#8b0000', '#ff4500', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'LIZARD ALIEN': ['#3cb371', '#2e8b57', '#228b22', '#008000', '#556b2f', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'BEAR FOLK': ['#8b4513', '#a0522d', '#5c4033', '#3e2723', '#000000', '#ffffff', '#e0e0e0', '#888888', '#222222', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'DEER FOLK': ['#d2b48c', '#deb887', '#cd853f', '#8b4513', '#a0522d', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'PIT BULL FOLK': ['#808080', '#a9a9a9', '#696969', '#8b4513', '#d2b48c', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'PALMERAGIAN': ['#ffb6c1', '#ff69b4', '#ff1493', '#db7093', '#c71585', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'WOLF FOLK': ['#808080', '#a9a9a9', '#696969', '#ffffff', '#000000', '#2f4f4f', '#e0e0e0', '#888888', '#222222', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'OGRE': ['#556b2f', '#8b4513', '#a0522d', '#696969', '#808000', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RUNE FOLK': ['#4682b4', '#5f9ea0', '#708090', '#778899', '#b0c4de', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'TURTLE FOLK': ['#228b22', '#008000', '#556b2f', '#6b8e23', '#2e8b57', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'NAGA': ['#3cb371', '#20b2aa', '#48d1cc', '#00ced1', '#5f9ea0', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'IMP': ['#ff0000', '#dc143c', '#b22222', '#8b0000', '#800000', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'GREMLIN': ['#556b2f', '#6b8e23', '#808000', '#bdb76b', '#a9a9a9', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'TROLL': ['#006400', '#228b22', '#556b2f', '#2f4f4f', '#696969', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'LEPRACHAN': ['#32cd32', '#228b22', '#008000', '#ff8c00', '#ffa500', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'TRICERA FOLK': ['#8fbc8f', '#66cdaa', '#3cb371', '#20b2aa', '#778899', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'HIGH MIND': ['#e6e6fa', '#d8bfd8', '#dda0dd', '#ee82ee', '#da70d6', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'YETTI': ['#ffffff', '#f0f8ff', '#f5f5f5', '#e0ffff', '#afeeee', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'CYCLOPSE DWARF': ['#b5815c', '#8d5524', '#7a4b31', '#5c3a21', '#4a2e1b', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88']
};

export const DEITIES = [
    { name: 'PRIMORDIAL', description: 'FIRST BORN OF THE DRAGON GODS. GOD OF AMBITION & GREAT THINGS. CAUSE OF THE COSMOS.' },
    { name: 'ARCANIS', description: 'SECOND BORN OF THE DRAGON GODS. GOD OF ARCANE SECRETS.' },
    { name: 'FUNGAL WARPED', description: 'MUSHROOM DRAGON GOD. SURVIVOR OF THE OLD CREATION. NEUTRAL.' },
    { name: 'UMBRIX', description: 'DRAGON GOD OF SHADOWS & SECRETS.' },
    { name: 'RAGI', description: 'DRAGON GOD OF STORMS.' },
    { name: 'TELUM', description: 'DRAGON GOD OF COMBAT, WEAPON OF THE GODS.' },
    { name: 'DORIM', description: 'DRAGON GOD OF DREAMS.' },
    { name: 'RANA', description: 'DRAGON GOD OF WEALTH.' },
    { name: 'RIULIRI', description: 'DRAGON GOD OF TACTICS & WAR.' },
    { name: 'VERI', description: 'UNICORN GOD OF TRUTH.' },
    { name: 'UMBI', description: 'UNICORN GOD OF TIME & PROPHECY.' },
    { name: 'HALO', description: 'UNICORN GOD OF THE HIGHER HEAVENS.' },
    { name: 'FIDIRI', description: 'UNICORN GOD OF LUCK & GOOD FORTUNE.' },
    { name: 'DI', description: 'THE RABBIT GODDESS.' },
    { name: 'SYLVARI', description: 'GODDESS OF THE WOODS.' },
    { name: 'ERUDI', description: 'GOD OF EDUCATION.' },
    { name: 'RUINA', description: 'DEMIGODDESS OF CHAOS.' },
    { name: 'ANIMA', description: 'GODDESS OF LIFE.' },
    { name: 'OBITU', description: 'GOD OF DEATH.' },
    { name: 'INANIS', description: 'GODDESS OF DARKNESS.' },
    { name: 'INMORI', description: 'GOD OF THE UNDEAD.' },
    { name: 'DERGU', description: 'OLDEST AND WISEST OF THE TREE FOLK.' }
];

