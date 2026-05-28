import { ITEMS, Item } from '../../Inventory';
import { Player } from '../../Player';

export interface StartingPack {
    name: string;
    description?: string;
    apply(player: Player): void;
}

export const STARTING_PACKS: StartingPack[] = [
    {
        name: "Mage's Satchel",
        description: "Contains two random spell books, two random staves, and mana potions. Also unlocks reading.",
        apply: (p: Player) => {
            p.talents['reading'] = 1;
            const allStaves = Object.values(ITEMS).filter(i => i.id.includes('staff'));
            const allSpellbooks = Object.values(ITEMS).filter(i => i.id.includes('book_'));
            
            p.inventory[2] = { ...allStaves[Math.floor(Math.random() * allStaves.length)] };
            p.inventory[3] = { ...allStaves[Math.floor(Math.random() * allStaves.length)] };
            p.inventory[4] = { ...allSpellbooks[Math.floor(Math.random() * allSpellbooks.length)] };
            p.inventory[5] = { ...allSpellbooks[Math.floor(Math.random() * allSpellbooks.length)] };
            p.inventory[6] = { ...ITEMS['mana_potion'], quantity: 20 };
        }
    },
    {
        name: "Master Sword Satchel",
        description: "Contains two random swords, random chest, legs, and feet armor. Maxes out the swords talent.",
        apply: (p: Player) => {
            p.talents['swords'] = 3;
            const allSwords = Object.values(ITEMS).filter(i => i.id.includes('sword'));
            const allChest = Object.values(ITEMS).filter(i => i.equipmentSlot === 'BODY');
            const allLegs = Object.values(ITEMS).filter(i => i.equipmentSlot === 'LEGS');
            const allFeet = Object.values(ITEMS).filter(i => i.equipmentSlot === 'FEET');

            p.inventory[2] = { ...allSwords[Math.floor(Math.random() * allSwords.length)] };
            p.inventory[3] = { ...allSwords[Math.floor(Math.random() * allSwords.length)] };
            p.inventory[4] = { ...allChest[Math.floor(Math.random() * allChest.length)] };
            p.inventory[5] = { ...allLegs[Math.floor(Math.random() * allLegs.length)] };
            p.inventory[6] = { ...allFeet[Math.floor(Math.random() * allFeet.length)] };
        }
    },
    {
        name: "Boomerang Bag",
        description: "Contains two random boomerangs, two random items, and maxes out the boomerang talent.",
        apply: (p: Player) => {
            p.talents['boomerang'] = 3;
            const allBoomerangs = Object.values(ITEMS).filter(i => i.id.includes('boomerang'));
            const allItems = Object.values(ITEMS);

            if (allBoomerangs.length > 0) {
                p.inventory[2] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
                p.inventory[3] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
            }
            
            const rItem1 = allItems[Math.floor(Math.random() * allItems.length)];
            const rItem2 = allItems[Math.floor(Math.random() * allItems.length)];
            
            p.inventory[4] = { ...rItem1, quantity: rItem1.maxStack ? Math.floor(Math.random() * rItem1.maxStack) + 1 : 1 };
            p.inventory[5] = { ...rItem2, quantity: rItem2.maxStack ? Math.floor(Math.random() * rItem2.maxStack) + 1 : 1 };
        }
    },
    {
        name: "Boomeranger Pack",
        description: "Contains three random boomerangs, two random items, and starts with a point in the Boomerang talent.",
        apply: (p: Player) => {
            p.talents['boomerang'] = 1;
            const allBoomerangs = Object.values(ITEMS).filter(i => i.id.includes('boomerang'));
            const allItems = Object.values(ITEMS);

            if (allBoomerangs.length > 0) {
                p.inventory[2] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
                p.inventory[3] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
                p.inventory[4] = { ...allBoomerangs[Math.floor(Math.random() * allBoomerangs.length)] };
            }
            
            const rItem1 = allItems[Math.floor(Math.random() * allItems.length)];
            const rItem2 = allItems[Math.floor(Math.random() * allItems.length)];
            
            p.inventory[5] = { ...rItem1, quantity: rItem1.maxStack ? Math.floor(Math.random() * rItem1.maxStack) + 1 : 1 };
            p.inventory[6] = { ...rItem2, quantity: rItem2.maxStack ? Math.floor(Math.random() * rItem2.maxStack) + 1 : 1 };
        }
    },
    {
        name: "Archer's Pack",
        description: "Contains two random bows, four stacks of arrows, a random hands piece, and maxes out the archery talent.",
        apply: (p: Player) => {
            p.talents['archery'] = 3;
            const allBows = Object.values(ITEMS).filter(i => i.id.includes('bow'));
            const allHands = Object.values(ITEMS).filter(i => i.equipmentSlot === 'HANDS');

            if (allBows.length > 0) {
                p.inventory[2] = { ...allBows[Math.floor(Math.random() * allBows.length)] };
                p.inventory[3] = { ...allBows[Math.floor(Math.random() * allBows.length)] };
            }
            
            p.inventory[4] = { ...ITEMS['arrow_1'], quantity: 99 };
            p.inventory[5] = { ...ITEMS['arrow_1'], quantity: 99 };
            p.inventory[6] = { ...ITEMS['arrow_1'], quantity: 99 };
            p.inventory[7] = { ...ITEMS['arrow_1'], quantity: 99 };

            if (allHands.length > 0) {
                p.inventory[8] = { ...allHands[Math.floor(Math.random() * allHands.length)] };
            }
        }
    }
];

export function getStartingPackNames(): string[] {
    const packs = new Set<string>();
    STARTING_PACKS.forEach(p => {
        packs.add(p.name);
    });
    return Array.from(packs);
}
