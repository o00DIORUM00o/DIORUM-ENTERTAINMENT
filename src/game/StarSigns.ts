export interface StarSignDef {
    stats: {
        maxHealth?: number;
        maxMana?: number;
        maxStamina?: number;
        healthRegen?: number;
        manaRegen?: number;
        staminaRegen?: number;
        defense?: number;
        lifesteal?: number;
        speedBonus?: number;
        bonusDamage?: number;
    }
}

export function getZodiacStats(zodiacName: string): StarSignDef['stats'] {
    const stats: StarSignDef['stats'] = {};
    const name = zodiacName.toUpperCase();

    // Combat / Damage
    if (name.includes('DRAGON') || name.includes('TITAN') || name.includes('BEAST') || name.includes('BLADE')) {
        stats.bonusDamage = 3;
        stats.maxHealth = 20;
    } else if (name.includes('AXE') || name.includes('SPEAR') || name.includes('CLUB') || name.includes('CLEAVER')) {
        stats.bonusDamage = 2;
        stats.speedBonus = 0.5;
    } else if (name.includes('BATTLE') || name.includes('HAMMER') || name.includes('MORTAR')) {
        stats.bonusDamage = 4;
        stats.defense = 1;
    }
    // Defense / Tank
    else if (name.includes('MOUNTAIN') || name.includes('STONE') || name.includes('BOULDER') || name.includes('ANVIL')) {
        stats.defense = 2;
        stats.maxHealth = 25;
    } else if (name.includes('CAVE') || name.includes('HILL') || name.includes('CASTLE') || name.includes('THRONE')) {
        stats.defense = 1;
        stats.maxHealth = 15;
        stats.maxStamina = 15;
    }
    // Magic / Mana
    else if (name.includes('FLAME') || name.includes('LAMP') || name.includes('HORNG')) {
        stats.bonusDamage = 1;
        stats.maxMana = 20;
    } else if (name.includes('BOOK') || name.includes('SCROLL') || name.includes('QUILL') || name.includes('RIDDLE')) {
        stats.maxMana = 30;
        stats.manaRegen = 2;
    } else if (name.includes('GEM') || name.includes('DIAMOND') || name.includes('CRYSTAL')) {
        stats.maxMana = 20;
        stats.speedBonus = 0.5;
    }
    // Agility / Speed
    else if (name.includes('EAGLE') || name.includes('GRYPHON') || name.includes('CLOUD') || name.includes('BOW')) {
        stats.speedBonus = 1.5;
        stats.maxStamina = 20;
    } else if (name.includes('WAGON') || name.includes('SHIP') || name.includes('WAND')) {
        stats.speedBonus = 1.0;
        stats.manaRegen = 1;
    }
    // Sustain / Regen
    else if (name.includes('EGG') || name.includes('SEED') || name.includes('APPLE') || name.includes('POND') || name.includes('WATERFALL')) {
        stats.healthRegen = 2;
        stats.manaRegen = 1;
    } else if (name.includes('OAK') || name.includes('PINE') || name.includes('TREE') || name.includes('LEAF') || name.includes('SHROOM')) {
        stats.maxHealth = 15;
        stats.healthRegen = 1;
    } else if (name.includes('BLOOD') || name.includes('BONE') || name.includes('SLUG')) {
        stats.lifesteal = 0.05;
        stats.maxHealth = 10;
    }
    // Gold / Utility (converted to some stats since gold isn't a stat)
    else if (name.includes('COIN') || name.includes('TROVE') || name.includes('CROWN')) {
        stats.maxHealth = 10;
        stats.maxMana = 10;
        stats.maxStamina = 10;
    }
    // Generic fallback
    else {
        const hash = name.length;
        if (hash % 3 === 0) { stats.maxHealth = 15; stats.defense = 1; }
        else if (hash % 3 === 1) { stats.speedBonus = 1.0; stats.maxStamina = 20; }
        else { stats.maxMana = 15; stats.manaRegen = 1; }
    }

    return stats;
}

export function formatZodiacStats(zodiacName: string): string {
    const stats = getZodiacStats(zodiacName);
    const effects = [];
    if (stats.maxHealth) effects.push(`+${stats.maxHealth} Max Health`);
    if (stats.maxMana) effects.push(`+${stats.maxMana} Max Mana`);
    if (stats.maxStamina) effects.push(`+${stats.maxStamina} Max Stamina`);
    if (stats.healthRegen) effects.push(`+${stats.healthRegen} Health Regen/s`);
    if (stats.manaRegen) effects.push(`+${stats.manaRegen} Mana Regen/s`);
    if (stats.defense) effects.push(`+${stats.defense} Defense`);
    if (stats.lifesteal) effects.push(`+${stats.lifesteal * 100}% Lifesteal`);
    if (stats.speedBonus) effects.push(`+${stats.speedBonus} Speed`);
    if (stats.bonusDamage) effects.push(`+${stats.bonusDamage} Bonus Damage`);
    return effects.join(' | ');
}
