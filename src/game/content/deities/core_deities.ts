import { DeityDef } from '../../registries/DeityRegistry';
import { DEITIES } from '../../constants/CharacterCreation';

export const CORE_DEITIES: DeityDef[] = DEITIES.map(d => ({
    id: d.name,
    name: d.name,
    description: d.description
}));
