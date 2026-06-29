export interface NPC {
    id: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    health: number;
    maxHealth: number;
    type: 'VILLAGER' | 'OLD_WIZARD' | 'DRACONIC_MERCHANT' | 'SLUG_FOLK_MERCHANT' | 'DARK_ELF' | 'DWARF' | 'GNOME' | 'HALFLING' | 'PIT_BULL_FOLK' | 'POMERANIAN_FOLK' | 'TERRIER_FOLK' | 'WOLF_FOLK' | 'SQUIRREL_FOLK' | 'BEAST_TAMER' | 'HUMAN_KNIGHT' | 'HUMAN_PALADIN' | 'HUMAN_RANGER' | 'QUEST_GIVER' | 'WANDERING_BARD' | 'NPC_KING' | 'NPC_WIZARD' | 'BOUNTY_HUNTER';
    state: 'IDLE' | 'WANDER' | 'COMBAT' | 'TALKING' | 'FLEE' | 'PATROL' | 'CARAVAN_LEADER' | 'CARAVAN_FOLLOWER';
    disposition: number;
    aimAngle: number;
    attackTimer: number;
    attackCooldown: number;
    stunTimer?: number;
    merchantType?: string;
    tradeInventory?: any[]; // TradeListing[]
    lastRestockDay?: number;
    profession?: string;
    homeX?: number;
    homeY?: number;
    homeZ?: number;
}