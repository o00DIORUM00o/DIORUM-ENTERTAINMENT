
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
    'HUMAN': ['#ffe0bd', '#ffdfc4', '#fcdac1', '#f8d5c4', '#f0d5be', '#f5d0c5', '#eebb94', '#e8beac', '#f1c27d', '#e0ac69', '#d2a17c', '#d1a3a4', '#c68642', '#c58c85', '#b5815c', '#a67358', '#9c6b4b', '#9f5c59', '#8d5524', '#8b5a2b', '#7b4b3a', '#754043', '#6b4423', '#5c3a21', '#5c2a18', '#4a2e1b', '#422116', '#3d2c23', '#351c15', '#301b12', '#2a1610', '#221008', '#1a0b06', '#ff8800'],
    'HILL DWARF': ['#ffe0bd', '#ffdfc4', '#fcdac1', '#f8d5c4', '#f0d5be', '#f5d0c5', '#eebb94', '#e8beac', '#f1c27d', '#e0ac69', '#d2a17c', '#d1a3a4', '#c68642', '#c58c85', '#b5815c', '#a67358', '#9c6b4b', '#9f5c59', '#8d5524', '#8b5a2b', '#7b4b3a', '#754043', '#6b4423', '#5c3a21', '#5c2a18', '#4a2e1b', '#422116', '#3d2c23', '#351c15', '#301b12', '#2a1610', '#221008', '#1a0b06', '#ff8800'],
    'MOUNTAIN DWARF': ['#b5815c', '#af7c58', '#a97654', '#a37150', '#9d6c4c', '#986744', '#94633c', '#905f35', '#8c5b2d', '#85562a', '#7d5128', '#764b26', '#6e4624', '#694223', '#654022', '#613e22', '#5e3b21', '#5a3920', '#55361f', '#51331d', '#4d301c', '#492d1a', '#462a19', '#432817', '#3f2515', '#3c2214', '#371f13', '#331c12', '#2e1911', '#2a1610', '#27150e', '#24140d', '#22130b', '#1f120a'],
    'HIGH ELF': ['#ffffff', '#fffdfa', '#fefbf4', '#fef9ef', '#fdf7ea', '#fdf4e5', '#fcf2e2', '#fcf0df', '#fbeedc', '#faecd8', '#fbe9d2', '#fce7c9', '#fde4c0', '#fee1b7', '#ffdeae', '#fddeae', '#fbdeaf', '#f9deb1', '#f7deb2', '#f5ddb1', '#f1d7a7', '#eed19c', '#ebcb91', '#e8c586', '#e4c079', '#e1bc6a', '#ddb85a', '#d9b44b', '#d5b03b', '#d0a930', '#caa027', '#c4971e', '#be8f14', '#b8860b'],
    'WOOD ELF': ['#d2b48c', '#caaa83', '#c29f7a', '#ba9571', '#b28b68', '#aa805f', '#a47857', '#9f724e', '#9a6c45', '#95663c', '#906034', '#8b5a2b', '#85632a', '#7f6d28', '#7a7627', '#748025', '#6e8924', '#698b24', '#658426', '#617e28', '#5d782b', '#59712d', '#556b2f', '#53682d', '#51662b', '#4f6328', '#4d6126', '#4b5e24', '#495b22', '#465821', '#44541f', '#42511d', '#3f4d1c', '#3d4a1a'],
    'DARK ELF': ['#050505', '#0f0f0f', '#1c1c1c', '#2d2d2d', '#404040', '#545454', '#6b6b6b', '#858585', '#a1a1a1', '#bfbfbf', '#e0e0e0', '#ffffff', '#060b14', '#0d1627', '#15243d', '#1f3456', '#2b4773', '#3a5a8f', '#4c70b0', '#6388d4', '#0d071a', '#180d2e', '#251545', '#341f5e', '#452a7a', '#583699', '#6d45ba', '#8454de', '#1c0f1c', '#331b33', '#4d294d', '#693869', '#854785', '#a357a3'],
    'RED ELF': ['#1f0505', '#2b0909', '#380e0e', '#4d1616', '#631f1f', '#7d2929', '#963434', '#b04040', '#cc4b4b', '#e85858', '#ff6666', '#ff8080', '#ff9999', '#ffb3b3', '#2e0f0f', '#3b1616', '#4a1e1e', '#592626', '#6b3030', '#7d3a3a', '#914545', '#a65252', '#bc5f5f', '#d46d6d', '#eb7a7a', '#ff8a8a', '#3d1c1c', '#4d2626', '#5c3030', '#6e3c3c', '#804848', '#945555', '#a86262', '#bd7171'],
    'TIGER ELF': ['#ffee88', '#ffe867', '#ffe346', '#ffdd25', '#ffd804', '#ffcf00', '#ffc700', '#ffbe00', '#ffb500', '#ffb000', '#ffad00', '#ffaa00', '#ffa600', '#ffa100', '#ff9b00', '#ff9500', '#ff8f00', '#ff8700', '#ff7e00', '#ff7500', '#ff6c00', '#ff6300', '#ff5b00', '#ff5300', '#ff4b00', '#fc4702', '#f15009', '#e65910', '#dc6118', '#d0681e', '#bf5f1b', '#ad5618', '#9c4e16', '#8b4513'],
    'WINTER ELF': ['#ffffff', '#fbfdff', '#f8fcff', '#f4faff', '#f0f8ff', '#edf9ff', '#e9fbff', '#e5fdff', '#e1ffff', '#dcfcff', '#d8f8ff', '#d3f4ff', '#cef0ff', '#c7ebfb', '#c0e5f5', '#b8e0ef', '#b1dbe9', '#a8d7e7', '#9fd4e8', '#96d2e9', '#8dd0ea', '#85cae8', '#7ec1e1', '#77b7da', '#71add2', '#6aa4cb', '#609bc5', '#5792bf', '#4e8ab9', '#4580b3', '#3e70a9', '#36609f', '#2f5095', '#27408b'],
    'SEA ELF': ['#e0ffff', '#d4fbfb', '#c8f7f7', '#bcf3f3', '#b0efef', '#a5f2e8', '#99f6e2', '#8efadc', '#82fed6', '#74f9d3', '#64f2d2', '#55ead1', '#46e3d0', '#41decf', '#43dace', '#45d6cd', '#47d3cc', '#43cdc8', '#39c6c0', '#30beb7', '#26b7af', '#1daea7', '#15a5a0', '#0e9c98', '#069291', '#008a8a', '#008888', '#008585', '#008282', '#007f7f', '#007979', '#007373', '#006c6c', '#006666'],
    'HALF ELF': ['#ffe0bd', '#ffe0bf', '#ffdfc1', '#ffdfc3', '#fedec3', '#fadbc2', '#f5d9c0', '#f1d6bf', '#f0d0b6', '#efc9ab', '#efc29f', '#eebb94', '#e6b48d', '#dfad87', '#d7a680', '#d19f77', '#ce9767', '#ca9057', '#c78847', '#c38547', '#be844e', '#ba8255', '#b5815c', '#aa754d', '#9f693d', '#945d2e', '#8a5324', '#814f24', '#774a23', '#6e4623', '#654022', '#5c3a1f', '#53341d', '#4a2e1b'],
    'TINKER GNOME': ['#ffe4c4', '#fde3c0', '#fbe1bd', '#f9e0b9', '#f7dfb6', '#f4dcb0', '#efd4a7', '#eacc9e', '#e5c494', '#e0bb8b', '#ddb888', '#dab789', '#d7b68a', '#d5b58b', '#d2b48c', '#d1ab7e', '#d0a16e', '#cf985d', '#ce8e4d', '#cc833e', '#c2793b', '#b96e37', '#af6333', '#a5582f', '#9e512b', '#9a4e25', '#954b20', '#91491a', '#8c4615', '#864515', '#7f4519', '#79441c', '#724420', '#6b4423'],
    'GLOW GNOME': ['#ffffcc', '#ffffb3', '#ffff9b', '#ffff82', '#ffff69', '#ffff50', '#ffff38', '#ffff1f', '#ffff06', '#f6ff00', '#e9ff00', '#ddff00', '#d1ff00', '#c7ff07', '#c0ff13', '#b8ff1e', '#b1ff29', '#a7ff29', '#9cff1e', '#91ff13', '#86ff07', '#78fa05', '#65ee11', '#53e21d', '#40d629', '#2fd038', '#23db52', '#17e66b', '#0bf084', '#00fa9d', '#00fbb6', '#00fdce', '#00fee7', '#00ffff'],
    'WOOD GOBLIN': ['#051707', '#0a210d', '#0f2b12', '#153818', '#1a471f', '#215426', '#28632e', '#2f7336', '#37823f', '#3f9147', '#48a151', '#51b35a', '#5ac464', '#0d1a0b', '#132411', '#1a3017', '#213d1d', '#284a24', '#30592a', '#386932', '#417a3a', '#4a8a43', '#549c4c', '#5dad55', '#68bf60', '#141c0e', '#1a2412', '#212d17', '#29381c', '#314221', '#3a4d26', '#44592c', '#4d6631', '#587537'],
    'SWAMP GOBLIN': ['#556b2f', '#6b8e23', '#808000', '#2f4f4f', '#4a5d23', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'ORC': ['#b4eeb4', '#aceeac', '#a5eea5', '#9dee9d', '#95ee95', '#8aec8a', '#76e576', '#62de62', '#4ed74e', '#3bd03b', '#30c530', '#2db72d', '#29a929', '#269b26', '#228d22', '#1c891c', '#158715', '#0d840d', '#068206', '#007f00', '#007900', '#007300', '#006d00', '#006700', '#006100', '#005900', '#005100', '#004a00', '#004200', '#003b00', '#003500', '#002f00', '#002800', '#002200'],
    'DARK ORC': ['#4a5d23', '#435a2e', '#3d5638', '#365343', '#304f4e', '#2b4944', '#254237', '#203b2a', '#1b351d', '#153315', '#0f330f', '#093309', '#023302', '#002f00', '#002900', '#002300', '#001d00', '#031800', '#091500', '#101200', '#160f00', '#190d00', '#170b00', '#150a00', '#130900', '#110800', '#0f0700', '#0d0600', '#0a0500', '#080400', '#060300', '#040200', '#020100', '#000000'],
    'HALFLING': ['#ffe0bd', '#ffe0bf', '#ffdfc1', '#ffdfc3', '#fedec3', '#fadbc2', '#f5d9c0', '#f1d6bf', '#f0d0b6', '#efc9ab', '#efc29f', '#eebb94', '#e6b48d', '#dfad87', '#d7a680', '#d19f77', '#ce9767', '#ca9057', '#c78847', '#c38547', '#be844e', '#ba8255', '#b5815c', '#aa754d', '#9f693d', '#945d2e', '#8a5324', '#814f24', '#774a23', '#6e4623', '#654022', '#5c3a1f', '#53341d', '#4a2e1b'],
    'COPPER DRAGON FOLK': ['#f4a460', '#ed9752', '#e68b44', '#de7e36', '#d77228', '#d26a1f', '#d16f23', '#d07428', '#cf782c', '#cd7d30', '#ca7e32', '#c67b32', '#c27833', '#bd7633', '#b97333', '#b46d32', '#af6631', '#a95f2f', '#a4582e', '#9f522c', '#9b4f27', '#964c21', '#92491c', '#8e4716', '#874414', '#7d4217', '#733f1a', '#693d1d', '#5f3b20', '#57371f', '#51321c', '#4a2d1a', '#442817', '#3d2314'],
    'COPPER KOBOLD': ['#f4a460', '#ed9752', '#e68b44', '#de7e36', '#d77228', '#d26a1f', '#d16f23', '#d07428', '#cf782c', '#cd7d30', '#ca7e32', '#c67b32', '#c27833', '#bd7633', '#b97333', '#b46d32', '#af6631', '#a95f2f', '#a4582e', '#9f522c', '#9b4f27', '#964c21', '#92491c', '#8e4716', '#874414', '#7d4217', '#733f1a', '#693d1d', '#5f3b20', '#57371f', '#51321c', '#4a2d1a', '#442817', '#3d2314'],
    'COPPER DRAKKEN': ['#b87333', '#a0522d', '#8b4513', '#5c4033', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'RAT FOLK': ['#a9a9a9', '#808080', '#696969', '#778899', '#708090', '#d3d3d3', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SHROOM FOLK': ['#f5f5dc', '#fff8dc', '#ffebcd', '#ffe4c4', '#ffb6c1', '#db7093', '#ffffff', '#e0e0e0', '#888888', '#222222', '#000000', '#ff0000', '#880000', '#ff8888', '#00ff00', '#008800', '#88ff88', '#0000ff', '#000088', '#8888ff', '#ffff00', '#888800', '#ffff88', '#ff00ff', '#880088', '#ff88ff', '#00ffff', '#008888', '#88ffff', '#ff8800', '#884400', '#ffcc88'],
    'SQUARREL FOLK': ['#f5deb3', '#f0d6aa', '#ebcea0', '#e6c697', '#e1be8e', '#ddb887', '#dbb788', '#d8b689', '#d6b58a', '#d3b48c', '#d1ae83', '#d0a472', '#cf9a62', '#ce9052', '#cd8641', '#c57c3c', '#bb7138', '#b26634', '#a85b30', '#9f522c', '#9b4f27', '#964c21', '#92491c', '#8e4716', '#874414', '#7d4217', '#733f1a', '#693d1d', '#5f3b20', '#57371f', '#51321c', '#4a2d1a', '#442817', '#3d2314'],
    'RABBIT FOLK': ['#ffffff', '#fefefe', '#fefefe', '#fdfdfd', '#fcfcfc', '#fafafa', '#f8f8f8', '#f6f6f6', '#f3f3f3', '#f0f0f0', '#eeeeee', '#ebebeb', '#e7e7e7', '#e3e3e3', '#dfdfdf', '#dbdbdb', '#d9d9d9', '#d6d6d6', '#d4d4d4', '#d0d0d0', '#cacaca', '#c5c5c5', '#c0c0c0', '#bababa', '#b3b3b3', '#adadad', '#a5a5a5', '#9a9a9a', '#8f8f8f', '#848484', '#7c7c7c', '#767676', '#6f6f6f', '#696969'],
    'GREEN ALIEN': ['#e0ffe0', '#d4ffb5', '#c7ff8a', '#bbff5f', '#afff34', '#a3ff25', '#98ff1a', '#8dff0e', '#82ff03', '#72ff04', '#61ff08', '#50ff0d', '#3fff12', '#38f719', '#36eb20', '#35df27', '#33d32e', '#2cd32c', '#20df20', '#14eb14', '#08f708', '#00fc00', '#00f400', '#00eb00', '#00e300', '#02d802', '#0ac40a', '#13b013', '#1b9c1b', '#218a21', '#198019', '#107710', '#086d08', '#006400'],
    'RED ALIEN': ['#ffcccc', '#ffb3b3', '#ff9b9b', '#ff8282', '#ff6969', '#ff5f50', '#ff5738', '#ff4f1f', '#ff4706', '#ff3800', '#ff2800', '#ff1700', '#ff0600', '#fa0309', '#f10818', '#e90d26', '#e01235', '#d71639', '#cd1933', '#c31c2c', '#b82026', '#ae1f1f', '#a51717', '#9c0e0e', '#920606', '#890000', '#800000', '#770000', '#6e0000', '#640000', '#580000', '#4c0000', '#3f0000', '#330000'],
    'LIZARD ALIEN': ['#c1ffc1', '#b8feb8', '#b0fdb0', '#a7fca7', '#9efc9e', '#92f796', '#7fe78d', '#6bd885', '#58c97d', '#44ba75', '#3aae6e', '#37a668', '#349d63', '#31955d', '#2e8c58', '#2c8b4d', '#298b42', '#278b37', '#248b2c', '#218b21', '#1a881a', '#138613', '#0b840b', '#048104', '#007d00', '#007800', '#007200', '#006c00', '#006600', '#005f00', '#005700', '#004f00', '#004800', '#004000'],
    'BEAR FOLK': ['#cd853f', '#c2793b', '#b76c36', '#ac6032', '#a1542e', '#9c4f27', '#964c21', '#91491b', '#8c4615', '#824419', '#774321', '#6c4228', '#604030', '#593d2f', '#55392a', '#513524', '#4c301e', '#492d1c', '#462b1e', '#432a20', '#402822', '#3c2521', '#37211d', '#321d18', '#2e1913', '#29160f', '#25140b', '#211207', '#1d1003', '#1a0f00', '#160d00', '#130b00', '#100900', '#0d0700'],
    'DEER FOLK': ['#fff8dc', '#fdf2d3', '#fbedcb', '#f9e7c2', '#f7e2b9', '#f4dcb0', '#efd4a7', '#eacc9e', '#e5c494', '#e0bb8b', '#ddb888', '#dab789', '#d7b68a', '#d5b58b', '#d2b48c', '#d1ab7e', '#d0a16e', '#cf985d', '#ce8e4d', '#cc833e', '#c2793b', '#b96e37', '#af6333', '#a5582f', '#9e512b', '#9a4e25', '#954b20', '#91491a', '#8c4615', '#844315', '#7a4118', '#703f1b', '#663c1e', '#5c3a21'],
    'PIT BULL FOLK': ['#ffffff', '#fdfdfd', '#fafafa', '#f8f8f8', '#f5f5f5', '#f0f0f0', '#eaeaea', '#e4e4e4', '#dedede', '#d7d7d7', '#d0d0d0', '#c9c9c9', '#c3c3c3', '#bdbdbd', '#b7b7b7', '#b1b1b1', '#acacac', '#a4a4a4', '#9a9a9a', '#909090', '#868686', '#7e7e7e', '#787878', '#737373', '#6d6d6d', '#676767', '#606060', '#585858', '#515151', '#494949', '#424242', '#3a3a3a', '#333333', '#2b2b2b'],
    'PALMERAGIAN': ['#fff0f5', '#ffe4ea', '#ffd7df', '#ffcbd4', '#ffbfc9', '#ffb1c0', '#ffa1bd', '#ff91bb', '#ff80b8', '#ff70b5', '#ff5fb0', '#ff4da9', '#ff3ba2', '#ff299b', '#ff1794', '#f82593', '#f13893', '#e94c93', '#e25f93', '#da6d93', '#d65a90', '#d2478d', '#ce338a', '#c92087', '#c3168f', '#bb18a5', '#b31bbc', '#ab1dd3', '#a21fea', '#9d1be1', '#9814cb', '#940eb6', '#8f07a0', '#8b008b'],
    'WOLF FOLK': ['#ffffff', '#f7f7f7', '#f0f0f0', '#e8e8e8', '#e1e1e1', '#d9d9d9', '#d1d1d1', '#cacaca', '#c2c2c2', '#bcbcbc', '#b6b6b6', '#b1b1b1', '#ababab', '#a3a3a3', '#999999', '#8f8f8f', '#858585', '#7d7d7d', '#787878', '#727272', '#6c6c6c', '#666666', '#5f5f5f', '#575757', '#505050', '#484a4a', '#424c4c', '#3b4d4d', '#354e4e', '#2e4d4d', '#2a4141', '#253535', '#212828', '#1c1c1c'],
    'OGRE': ['#d2b48c', '#cca982', '#c69e78', '#c0946d', '#b98963', '#b37e59', '#aa754d', '#a26c41', '#996235', '#915929', '#895c24', '#826824', '#7a7423', '#738023', '#6c8c23', '#678825', '#628028', '#5e792a', '#59712d', '#556b2f', '#52682c', '#50652a', '#4e6227', '#4b5f24', '#485c27', '#425930', '#3c563a', '#365343', '#31504c', '#2c4b47', '#27453c', '#233f30', '#1e3925', '#1a331a'],
    'RUNE FOLK': ['#f0f8ff', '#eef4fe', '#ebeffd', '#e9ebfb', '#e6e7fa', '#dbdff4', '#cdd7ed', '#c0cee6', '#b3c6e0', '#a9c6e0', '#9fc8e4', '#95cbe7', '#8bcdea', '#7dc2e3', '#6db0d5', '#5e9ec8', '#4e8bbb', '#4985b2', '#4f8cad', '#5593a8', '#5b9aa3', '#619b9f', '#65949b', '#698d97', '#6d8593', '#6e7e8e', '#647484', '#5b6b7b', '#526272', '#495a69', '#435763', '#3c545c', '#365256', '#2f4f4f'],
    'TURTLE FOLK': ['#a2cd5a', '#9ec965', '#9ac670', '#96c27c', '#92bf87', '#8db988', '#85af72', '#7ea65b', '#769c44', '#6e922d', '#688a24', '#648227', '#5f7b2a', '#5a732c', '#566c2f', '#53682d', '#51652a', '#4e6328', '#4c6025', '#495e23', '#406823', '#387223', '#2f7c22', '#278522', '#1f871f', '#187f18', '#107710', '#096f09', '#026602', '#005d00', '#005200', '#004800', '#003d00', '#003300'],
    'NAGA': ['#afeeee', '#99e8e7', '#83e2e0', '#6ddcd8', '#58d5d1', '#48d2cc', '#46d5cd', '#44d8ce', '#42dbcf', '#41dfd0', '#3cdacb', '#35d1c3', '#2fc7bb', '#28bdb3', '#21b3ab', '#25b2a0', '#2bb294', '#31b387', '#37b37b', '#3cb270', '#39a96b', '#36a165', '#339860', '#30905a', '#2d8b52', '#2a8b47', '#288b3c', '#258b30', '#238b25', '#1d851d', '#167d16', '#0e750e', '#076c07', '#006400'],
    'IMP': ['#ff8888', '#ff7867', '#ff6846', '#ff5725', '#ff4704', '#ff3600', '#ff2600', '#ff1500', '#ff0400', '#f9040b', '#f00819', '#e80d28', '#df1237', '#d61638', '#cb1a32', '#c11d2b', '#b72025', '#ad1e1e', '#a41616', '#9a0d0d', '#910505', '#880000', '#7f0000', '#760000', '#6d0000', '#640000', '#5e0000', '#580000', '#520000', '#4c0000', '#460000', '#400000', '#390000', '#330000'],
    'GREMLIN': ['#d8d8bf', '#d2d1ad', '#cdca9b', '#c7c38a', '#c1bc78', '#b9b465', '#aca84e', '#9f9c37', '#929120', '#86850a', '#7d8204', '#79850c', '#758813', '#708b1b', '#6c8e22', '#678825', '#628028', '#5e792a', '#59712d', '#556b2f', '#52682c', '#50652a', '#4e6227', '#4b5f24', '#485c27', '#425930', '#3c563a', '#365343', '#31504c', '#2c4b47', '#27453c', '#233f30', '#1e3925', '#1a331a'],
    'TROLL': ['#8fbc8f', '#7bba88', '#67b880', '#53b579', '#3fb372', '#39ab6b', '#36a165', '#32975f', '#2f8d59', '#2c8b4d', '#298b41', '#268b34', '#238b27', '#1d891d', '#158715', '#0c840c', '#048104', '#007d00', '#007600', '#006f00', '#006800', '#006100', '#005800', '#004f00', '#004700', '#034105', '#0e4518', '#1a482b', '#254c3e', '#2e4e4d', '#294741', '#244134', '#1f3a27', '#1a331a'],
    'LEPRACHAN': ['#90ee90', '#7ce77c', '#68e068', '#54d954', '#40d240', '#31c931', '#2ebb2e', '#2aad2a', '#279f27', '#239123', '#1e8a1e', '#178717', '#0f850f', '#088308', '#018001', '#007b00', '#007500', '#006f00', '#006900', '#046301', '#225c05', '#3f5609', '#5d4f0d', '#7a4911', '#874414', '#7d4217', '#733f1a', '#693d1d', '#5f3b20', '#57371f', '#51321c', '#4a2d1a', '#442817', '#3d2314'],
    'TRICERA FOLK': ['#a2cd5a', '#9ec965', '#9ac670', '#96c27c', '#92bf87', '#8dbd91', '#84c196', '#7bc49c', '#72c8a2', '#6acba8', '#61caa3', '#58c497', '#4fbf8b', '#46b97f', '#3db473', '#39ac6c', '#36a367', '#349b61', '#31925c', '#2e8957', '#2e7c55', '#2e7053', '#2f6352', '#2f5650', '#2d4c4a', '#29473f', '#244134', '#203b28', '#1b351d', '#162f16', '#112a11', '#0b250b', '#061f06', '#001a00'],
    'HIGH MIND': ['#ffffff', '#fdfdff', '#fbfbff', '#f9f9ff', '#f6f6ff', '#f1f1fd', '#ededfc', '#e8e8fa', '#e3dff4', '#e0d4eb', '#dccae1', '#d8bfd8', '#d9b7d9', '#dbaedb', '#dca6dc', '#df9ddf', '#e395e3', '#e88de8', '#ec85ec', '#ea7fea', '#e57ae3', '#df75dd', '#da70d6', '#d169d5', '#c961d4', '#c05ad4', '#b651d4', '#a946d8', '#9b3add', '#8e2fe1', '#7f23d1', '#6d17b6', '#5c0c9c', '#4b0082'],
    'YETTI': ['#ffffff', '#ffffff', '#fefefe', '#fefefe', '#fdfdfd', '#fafcfd', '#f7fbfe', '#f4fafe', '#f1f8ff', '#edf9ff', '#e9fbff', '#e5fdff', '#e1feff', '#dffafa', '#def1f1', '#dde9e9', '#dce0e0', '#d9d9d9', '#d2d2d2', '#cbcbcb', '#c4c4c4', '#bebebe', '#b8b8b8', '#b3b3b3', '#adadad', '#a7abad', '#9fb4bd', '#96bdcd', '#8ec6dd', '#85cce9', '#75b9dc', '#66a7cf', '#5694c1', '#4682b4'],
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

