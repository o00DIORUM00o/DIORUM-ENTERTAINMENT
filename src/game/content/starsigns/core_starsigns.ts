import { StarSignRegistryDef } from '../../registries/StarSignRegistry';
import { HOMEWORLDS } from '../../constants/CharacterCreation';
import { getZodiacStats } from '../../StarSigns';

export const CORE_STAR_SIGNS: StarSignRegistryDef[] = [];

const added = new Set<string>();

Object.values(HOMEWORLDS).forEach(hw => {
    hw.zodiacs.forEach(z => {
        if (!added.has(z)) {
            added.add(z);
            CORE_STAR_SIGNS.push({
                id: z,
                name: z,
                stats: getZodiacStats(z)
            });
        }
    });
});
