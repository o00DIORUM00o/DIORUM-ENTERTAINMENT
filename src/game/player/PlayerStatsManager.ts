import { Player } from '../Player';
import { BlockType } from '../constants/BlockType';
import { audioEngine } from '../AudioEngine';

export class PlayerStatsManager {
    static updateStats(player: Player, dt: number, equipStats: any, onAoE?: any, world?: any) {
        for (const buff in player.buffs) {
            if (player.buffs[buff] > 0) {
                player.buffs[buff] -= dt;
            }
        }
        
        // Deity passive blessings
        if (player.hasFavoredDeity('SYLVARI') || player.hasFavoredDeity('FUNGAL WARPED')) {
            player.health = Math.min(player.effectiveMaxHealth, player.health + dt * 0.5); // Fast HP regen
        }
        if (player.hasFavoredDeity('UMBRIX') && player.isDashing) {
            player.buffs.invisibility = 0.5; // Brief invisibility on dash
        }
        if (player.hasFavoredDeity('RAGI')) {
            if (!player.lastRagiTick) player.lastRagiTick = 0;
            player.lastRagiTick += dt;
            if (player.lastRagiTick > 5.0) {
                player.lastRagiTick = 0;
                if (onAoE) onAoE(player.x, player.y, player.z + 0.5, 3.0, 15, 'LIGHTNING');
                if (player.onMessage) player.onMessage("Ragi's storm strikes!");
            }
        }
        if (player.hasFavoredDeity('OBITU')) {
            player.buffs.poison = 0;
            player.buffs.bleed = 0;
        }

        if (equipStats.healthRegen > 0 && player.health < player.effectiveMaxHealth) {
            player.health = Math.min(player.effectiveMaxHealth, player.health + equipStats.healthRegen * dt);
        }
        
        if (player.mana < player.effectiveMaxMana) {
            const totalManaRegen = player.manaRegen + equipStats.manaRegen;
            player.mana = Math.min(player.effectiveMaxMana, player.mana + totalManaRegen * dt);
        }
        
        if (player.stamina < player.effectiveMaxStamina) {
            player.stamina = Math.min(player.effectiveMaxStamina, player.stamina + player.staminaRegen * dt);
        }

        if (player.health > player.effectiveMaxHealth) player.health = player.effectiveMaxHealth;
        if (player.mana > player.effectiveMaxMana) player.mana = player.effectiveMaxMana;
        if (player.stamina > player.effectiveMaxStamina) player.stamina = player.effectiveMaxStamina;

        player.campfireHealTimer += dt;
        if (player.campfireHealTimer >= 1.0) {
            player.campfireHealTimer = 0;
            
            if (player.buffs.healthRegen > 0) {
                player.health = Math.min(player.effectiveMaxHealth, player.health + 5); 
            }
            if (player.buffs.manaRegen > 0) {
                player.mana = Math.min(player.effectiveMaxMana, player.mana + 10); 
            }
            
            if (player.health < player.effectiveMaxHealth && world) {
                let nearCampfire = false;
                const px = Math.floor(player.x);
                const py = Math.floor(player.y);
                const pz = Math.floor(player.z);
                for (let bx = px - 2; bx <= px + 2; bx++) {
                    for (let by = py - 2; by <= py + 2; by++) {
                        for (let bz = pz - 1; bz <= pz + 1; bz++) {
                            if (world.getBlock(bx, by, bz) === BlockType.CAMPFIRE) {
                                nearCampfire = true;
                                break;
                            }
                        }
                        if (nearCampfire) break;
                    }
                    if (nearCampfire) break;
                }
                if (nearCampfire) {
                    player.health = Math.min(player.effectiveMaxHealth, player.health + 2);
                }
            }
        }
    }

    static handleDeath(player: Player) {
        if (player.z < -40) {
            player.health = 0;
        }
        
        if (player.health <= 0) {
            if (player.hasFavoredDeity('INMORI')) {
                const inmoriStanding = player.deityStandings['INMORI']?.standing || 0;
                if (inmoriStanding >= 50) {
                    player.health = player.effectiveMaxHealth;
                    player.mana = player.effectiveMaxMana;
                    player.deityStandings['INMORI'].standing -= 50; 
                    if (player.onMessage) player.onMessage("INMORI denies your death!");
                    
                    if (player.z < -40) {
                        player.x = player.spawnX;
                        player.y = player.spawnY;
                        player.z = player.spawnZ + 2;
                        player.vz = 0;
                    }
                }
            }
        }
    }

    static takeDamage(player: Player, amount: number) {
        if (player.buffs.mistForm > 0 || player.isEyeMode) return;
        if (amount <= 0) return;
        const defense = player.getDefense();
        const actualDamage = Math.max(1, amount - defense);
        player.health -= actualDamage;
        audioEngine.playHit();
        if (player.carryingPot) {
            player.carryingPot = false;
        }
    }
}
