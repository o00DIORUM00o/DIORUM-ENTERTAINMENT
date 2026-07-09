import { RecipeRegistry } from './registries/RecipeRegistry';
import { Updater } from "./Updater";
import { Renderer } from "./Renderer";
import { BlockType } from './constants/BlockType';
import { World, isSolid, isIndestructible, getLootForBlock } from './World';;
import { defineBlocks, BlockRegistry } from './registries/BlockRegistry';
import { CORE_BLOCKS } from './content/blocks/core_blocks';
import { defineEntities } from './registries/EntityRegistry';
import { CORE_ENTITIES } from './content/entities/core_entities';
import { defineRecipes } from './registries/RecipeRegistry';
import { CORE_RECIPES } from './content/recipes/core_recipes';

import { definePlanets } from './registries/PlanetRegistry';
import { CORE_PLANETS } from './content/planets/core_planets';

import { defineStructures } from './registries/StructureRegistry';
import { CORE_STRUCTURES } from './content/structures/core_structures';

import { defineCoreAbilities } from './content/abilities/index';

import { defineRaces } from './registries/RaceRegistry';
import { CORE_RACES } from './content/races/core_races';
import { defineDeities } from './registries/DeityRegistry';
import { CORE_DEITIES } from './content/deities/core_deities';
import { defineStarSigns } from './registries/StarSignRegistry';
import { CORE_STAR_SIGNS } from './content/starsigns/core_starsigns';


defineBlocks(CORE_BLOCKS);
defineEntities(CORE_ENTITIES);
defineRecipes(CORE_RECIPES);
definePlanets(CORE_PLANETS);
defineStructures(CORE_STRUCTURES);
defineCoreAbilities();

defineRaces(CORE_RACES);
defineDeities(CORE_DEITIES);
defineStarSigns(CORE_STAR_SIGNS);


import { Player } from './Player';
import { audioEngine } from './AudioEngine';
import { InputManager } from './Input';
import { TILE_SIZE, CHUNK_SIZE, BLOCK_COLORS, WORLD_HEIGHT } from './Constants';
import { SPELLS, ITEMS, Item, MERCHANT_TABLES } from './Inventory';

function removeFromArray<T>(array: T[], index: number) {
    if (index === array.length - 1) {
        array.pop();
    } else {
        array[index] = array.pop()!;
    }
}

import { Particle, Projectile, Bomb, AoEEffect, ConeEffect, Bee, AbyssalKnight, LavaGolem, GiantAnt, Goblin, FrostCaster, Rat, NPC, Orc, Archer, DarkKnight, Drake, RockGolem, Kobold, Skeleton, SkeletonRemains, Deer, Wolf, AnimalType, Mount, Animal, DroppedItem, FireDragonBoss, Gargoyle, Djinn, Gremlin, Sphinx, SandTerror, PhantomWizard, VoidLord } from './types/EntityTypes';

export * from './types/EntityTypes';

import { EventEmitter } from './EventEmitter';
import { ArenaManager } from './ArenaManager';

import { AutomationSystem } from './systems/AutomationSystem';
export class Engine {
    events = new EventEmitter();
    world = new World();
    player = new Player();
    arena = new ArenaManager();
    input = new InputManager();
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    running = false;
    mechanismTimer = 0;
    particles: Particle[] = [];
    projectiles: Projectile[] = [];
    aoeEffects: AoEEffect[] = [];
    coneEffects: ConeEffect[] = [];
    persistentAoEs: any[] = [];
    bees: Bee[] = [];
    ants: GiantAnt[] = [];
    goblins: Goblin[] = [];
    frostCasters: FrostCaster[] = [];
    orcs: Orc[] = [];
    archers: Archer[] = [];
    darkKnights: DarkKnight[] = [];
    npcs: NPC[] = [];
    rats: Rat[] = [];
    abyssalKnights: AbyssalKnight[] = [];
    lavaGolems: LavaGolem[] = [];
    rockGolems: any[] = [];
    skeletons: Skeleton[] = [];
    skeletonRemains: SkeletonRemains[] = [];
    fireDragonBosses: FireDragonBoss[] = [];
    animals: any[] = [];
    sheeps: any[] = [];
    bears: any[] = [];
    horses: any[] = [];
    turtles: any[] = [];
    unicorns: any[] = [];
    giantChickens: any[] = [];
    giantFrogs: any[] = [];
    drakes: Drake[] = [];
    kobolds: Kobold[] = [];
    gargoyles: Gargoyle[] = [];
    djinns: Djinn[] = [];
    gremlins: Gremlin[] = [];
    sphinxs: Sphinx[] = [];
    sandTerrors: SandTerror[] = [];
    phantomWizards: PhantomWizard[] = [];
    voidLords: VoidLord[] = [];
    shadowWizards: any[] = [];
    entities: any[] = [];
    bombs: Bomb[] = [];
    droppedItems: DroppedItem[] = [];
    hiveSpawnTimers: Map<string, number> = new Map();
    automationTimer: number = 0;
    hiveScanTimer = 0;
    campSpawnTimers: Map<string, number> = new Map();
    bonePileSpawnTimers: Map<string, number> = new Map();
    abyssalSpawnerTimers: Map<string, number> = new Map();
    golemSpawnTimer = 0;
    campScanTimer = 0;
    bonePileScanTimer = 0;
    deerSpawnTimer = 0;
    lastWolfPackDay = 0;
    villageTimer = 0;
    spawnerTimer = 0;
    
    lightCanvas: HTMLCanvasElement;
    lightCtx: CanvasRenderingContext2D;

    forEachEntity(callback: (entity: any, type: string) => void) {
        for (let i = 0; i < this.bees.length; i++) callback(this.bees[i], 'bee');
        for (let i = 0; i < this.ants.length; i++) callback(this.ants[i], 'ant');
        for (let i = 0; i < this.goblins.length; i++) callback(this.goblins[i], 'goblin');
        for (let i = 0; i < this.orcs.length; i++) callback(this.orcs[i], 'orc');
        for (let i = 0; i < this.skeletons.length; i++) callback(this.skeletons[i], 'skeleton');
        for (let i = 0; i < this.skeletonRemains.length; i++) callback(this.skeletonRemains[i], 'skeletonRemains');
        for (let i = 0; i < this.lavaGolems.length; i++) callback(this.lavaGolems[i], 'lavaGolem');
        for (let i = 0; i < this.rats.length; i++) callback(this.rats[i], 'rat');
        for (let i = 0; i < this.animals.length; i++) callback(this.animals[i], 'animal');
        for (let i = 0; i < this.abyssalKnights.length; i++) callback(this.abyssalKnights[i], 'abyssalKnight');
        for (let i = 0; i < this.frostCasters.length; i++) callback(this.frostCasters[i], 'frostCaster');
        for (let i = 0; i < this.npcs.length; i++) callback(this.npcs[i], 'npc');
        for (let i = 0; i < this.drakes.length; i++) callback(this.drakes[i], 'drake');
        for (let i = 0; i < this.kobolds.length; i++) callback(this.kobolds[i], 'kobold');
        for (let i = 0; i < this.gargoyles.length; i++) callback(this.gargoyles[i], 'gargoyle');
        for (let i = 0; i < this.djinns.length; i++) callback(this.djinns[i], 'djinn');
        for (let i = 0; i < this.gremlins.length; i++) callback(this.gremlins[i], 'gremlin');
        for (let i = 0; i < this.sphinxs.length; i++) callback(this.sphinxs[i], 'sphinx');
        for (let i = 0; i < this.fireDragonBosses.length; i++) callback(this.fireDragonBosses[i], 'fireDragonBoss');
        for (let i = 0; i < this.shadowWizards.length; i++) callback(this.shadowWizards[i], 'shadowWizard');
        for (let i = 0; i < this.archers.length; i++) callback(this.archers[i], 'archer');
        for (let i = 0; i < this.darkKnights.length; i++) callback(this.darkKnights[i], 'darkKnight');
        for (let i = 0; i < this.sandTerrors.length; i++) callback(this.sandTerrors[i], 'sandTerror');
        for (let i = 0; i < this.phantomWizards.length; i++) callback(this.phantomWizards[i], 'phantomWizard');
        for (let i = 0; i < this.voidLords.length; i++) callback(this.voidLords[i], 'voidLord');
        for (let i = 0; i < this.entities.length; i++) callback(this.entities[i], 'entity');
    }

    worlds: Map<string, World> = new Map();

    resetWorld(homeworld: string = 'HERAT') {
        if (!this.worlds.has(homeworld)) {
            const newWorld = new World();
            newWorld.activePlanet = homeworld;
            this.worlds.set(homeworld, newWorld);
        }
        this.world = this.worlds.get(homeworld)!;
        
        this.particles = [];
        this.projectiles = [];
        this.aoeEffects = [];
        this.persistentAoEs = [];
        this.coneEffects = [];
        this.bees = [];
        this.ants = [];
        this.goblins = [];
        this.kobolds = [];
        this.orcs = [];
        this.archers = [];
        this.darkKnights = [];
        this.npcs = [];
        this.rats = [];
        this.lavaGolems = [];
        this.rockGolems = [];
        this.skeletons = [];
        this.skeletonRemains = [];
        this.fireDragonBosses = [];
        this.animals = [];
        this.sheeps = [];
        this.bears = [];
        this.horses = [];
        this.turtles = [];
        this.unicorns = [];
        this.giantChickens = [];
        this.giantFrogs = [];
        this.drakes = [];
        this.kobolds = [];
        this.gargoyles = [];
        this.djinns = [];
        this.gremlins = [];
        this.sphinxs = [];
        this.sandTerrors = [];
        this.phantomWizards = [];
        this.voidLords = [];
        this.shadowWizards = [];
        this.entities = [];
        this.bombs = [];
        this.droppedItems = [];
        this.hiveSpawnTimers.clear();
        this.campSpawnTimers.clear();
        this.bonePileSpawnTimers.clear();
        this.abyssalSpawnerTimers.clear();
        
        // Reset player position
        this.player.x = 0;
        this.player.y = 8;
        this.player.z = this.world.getElevation(0, 8) + 1;
        this.player.spawnX = 0;
        this.player.spawnY = 8;
        this.player.spawnZ = this.player.z;
        this.player.vz = 0;
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        
        this.lightCanvas = document.createElement('canvas');
        this.lightCtx = this.lightCanvas.getContext('2d')!;

        this.player.onMessage = (text) => {
            this.particles.push({
                x: this.player.x,
                y: this.player.y,
                z: this.player.z + 1,
                text: text,
                color: '#fff',
                life: 2.0,
                maxLife: 2.0,
                vy: -1
            });
        };

        // Spawn player near the starting area
        this.player.x = 0;
        this.player.y = 8; // Spawn a bit south of the entrance
        this.player.z = this.world.getElevation(0, 8) + 1;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.lightCanvas) {
            this.lightCanvas.width = window.innerWidth;
            this.lightCanvas.height = window.innerHeight;
        }
    }

    lastTime = 0;
    paused = false;
    onPauseToggle?: () => void;
    onOpenChest?: (x: number, y: number, z: number) => void;
    onOpenShrine?: (x: number, y: number, z: number) => void;
    onOpenPortalMenu?: (color: string) => void;
    onOpenArcaneGate?: () => void;
    onInteractNPC?: (npc: NPC) => void;

    spawnEntity(type: string, x: number, y: number, z: number) {
        let ent: any = {
            id: type + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            x, y, z,
            vx: 0, vy: 0, vz: 0,
            health: 100, maxHealth: 100, damage: 10,
            state: 'CHASE', attackCooldown: 1.5, attackTimer: 0, aimAngle: 0
        };
        
        let targetArray = this.entities;
        if (type === 'goblin') { targetArray = this.goblins as any; ent.health = 30; ent.maxHealth = 30; ent.damage = 5; }
        else if (type === 'skeleton') { targetArray = this.skeletons as any; ent.health = 40; ent.maxHealth = 40; ent.damage = 15; }
        else if (type === 'abyssal_knight') { targetArray = this.abyssalKnights as any; ent.health = 150; ent.maxHealth = 150; ent.damage = 35; }
        else if (type === 'ogre') { targetArray = this.entities as any; ent.hp = 400; ent.maxHp = 400; ent.damage = 40; } // Note: generic entities use hp/maxHp
        else {
            ent.hp = ent.health;
            ent.maxHp = ent.maxHealth;
        }

        targetArray.push(ent);
        return ent;
    }

    dropItem(x: number, y: number, z: number, item: Item) {
        this.droppedItems.push({
            x, y, z,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            vz: 5 + Math.random() * 5,
            item,
            life: 300 // 5 minutes
        });
    }

    breakBlock(bx: number, by: number, bz: number, sourceBlock: BlockType, dropLoot: boolean = true) {
        if (sourceBlock === BlockType.AIR) return;
        
        this.world.setBlock(bx, by, bz, BlockType.AIR);
        const key = `${bx},${by},${bz}`;
        this.world.blockHealth.delete(key);
        
        if (!dropLoot) return;

        if (sourceBlock === BlockType.CHEST) {
            const chestInv = this.world.getChest(bx, by, bz);
            this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...ITEMS['storage_chest'], chestInventory: chestInv });
            this.world.chestData.delete(this.world.getChestKey(bx, by, bz));
            return;
        }

        if (sourceBlock === BlockType.TRUNK || sourceBlock === BlockType.TROPICAL_WOOD) {
            const woodType = sourceBlock === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
            this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...ITEMS[woodType], quantity: Math.floor(Math.random() * 3) + 1 });
            let currentZ = bz + 1;
            while (currentZ < WORLD_HEIGHT) {
                const aboveBlock = this.world.getBlock(bx, by, currentZ);
                if (aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.LEAVES || aboveBlock === BlockType.PINE_LEAVES || aboveBlock === BlockType.TROPICAL_WOOD || aboveBlock === BlockType.TROPICAL_LEAVES) {
                    this.world.setBlock(bx, by, currentZ, BlockType.AIR);
                    if ((aboveBlock === BlockType.TRUNK || aboveBlock === BlockType.TROPICAL_WOOD) && Math.random() < 0.5) {
                        const woodTypeAbove = aboveBlock === BlockType.TROPICAL_WOOD ? 'tropical_wood' : 'wood';
                        this.dropItem(bx + 0.5, by + 0.5, currentZ + 0.5, { ...ITEMS[woodTypeAbove], quantity: 1 });
                    }
                    for (let lx = -2; lx <= 2; lx++) {
                        for (let ly = -2; ly <= 2; ly++) {
                            if (lx === 0 && ly === 0) continue;
                            const leafBlock = this.world.getBlock(bx + lx, by + ly, currentZ);
                            if (leafBlock === BlockType.LEAVES || leafBlock === BlockType.PINE_LEAVES || leafBlock === BlockType.TROPICAL_LEAVES) {
                                this.world.setBlock(bx + lx, by + ly, currentZ, BlockType.AIR);
                            }
                        }
                    }
                    currentZ++;
                } else {
                    break;
                }
            }
            return;
        }

        if (sourceBlock === BlockType.POT) {
            if (Math.random() < 0.5) {
                const randomLoot = ['gold_piece', 'copper_piece', 'health_potion', 'red_berry', 'slime'];
                const itemToDrop = randomLoot[Math.floor(Math.random() * randomLoot.length)];
                if (ITEMS[itemToDrop]) {
                    this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...ITEMS[itemToDrop], quantity: 1 });
                }
            }
            return;
        }
        
        if (sourceBlock === BlockType.BONE_PILE_SPAWNER) {
            this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...ITEMS['bone'], quantity: 5 });
            return;
        }
        
        if (sourceBlock === BlockType.DUMMY) {
            this.world.respawningBlocks.set(key, { type: BlockType.DUMMY, timer: 30.0 });
        }

        const genericDrops = getLootForBlock(sourceBlock);
        if (genericDrops && genericDrops.length > 0) {
            for (const drop of genericDrops) {
                this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...drop.item, quantity: drop.quantity ?? 1 });
            }
        } else {
            const blockDef = BlockRegistry.getBlock(sourceBlock);
            if (blockDef && ITEMS[blockDef.id]) {
                 this.dropItem(bx + 0.5, by + 0.5, bz + 0.5, { ...ITEMS[blockDef.id], quantity: 1 });
            }
        }
    }

    restockNPC(npc: NPC) {
        if (!npc.merchantType) return;
        
        const currentDay = this.world.dayCount;
        if (npc.lastRestockDay === undefined || npc.lastRestockDay < currentDay) {
            npc.lastRestockDay = currentDay;
            npc.tradeInventory = [];
            
            const table = MERCHANT_TABLES[npc.merchantType];
            if (table) {
                // Add guaranteed items
                for (const g of table.guaranteed) {
                    npc.tradeInventory.push(JSON.parse(JSON.stringify(g)));
                }
                // Add random items
                for (let i = 0; i < table.random.rolls; i++) {
                    const totalWeight = table.random.pool.reduce((sum, item) => sum + item.weight, 0);
                    let roll = Math.random() * totalWeight;
                    for (const item of table.random.pool) {
                        roll -= item.weight;
                        if (roll <= 0) {
                            // Check if already in inventory to stack
                            const existing = npc.tradeInventory.find(t => t.itemToGive.id === item.listing.itemToGive.id && JSON.stringify(t.cost) === JSON.stringify(item.listing.cost));
                            if (existing) {
                                existing.itemToGive.quantity += item.listing.itemToGive.quantity;
                            } else {
                                npc.tradeInventory.push(JSON.parse(JSON.stringify(item.listing)));
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    stop() {
        this.running = false;
    }

    loop(time: number) {
        if (!this.running) return;
        
        // Calculate delta time in seconds (cap at 0.1s to prevent huge jumps if tab is inactive)
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        if (this.input.isPausePressed()) {
            this.onPauseToggle?.();
        }

        if (!this.paused) {
            this.update(dt);
        }
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    }

    checkCollision(x: number, y: number, z: number, radius: number, height: number): boolean {
        const minX = Math.floor(x - radius);
        const maxX = Math.floor(x + radius);
        const minY = Math.floor(y - radius);
        const maxY = Math.floor(y + radius);
        const minZ = Math.floor(z);
        const maxZ = Math.floor(z + height - 0.01);

        for (let bx = minX; bx <= maxX; bx++) {
            for (let by = minY; by <= maxY; by++) {
                for (let bz = minZ; bz <= maxZ; bz++) {
                    const block = this.world.getBlock(bx, by, bz);
                    if (isSolid(block)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    updateAutomation(dt: number) {
        AutomationSystem.update(this, dt);
    }

    update(dt: number) {
        Updater.update(this, dt);

        if (this.player.equipment['NECKLACE']?.id === 'antigravity_artifact') {
            if (this.input.isJumpDown()) {
                this.particles.push({
                    x: this.player.x + (Math.random() - 0.5) * 0.8,
                    y: this.player.y + (Math.random() - 0.5) * 0.8,
                    z: this.player.z - 0.2, // Below player feet
                    text: '✨',
                    color: '#00FFFF', // Cyan glow
                    life: 0.5,
                    maxLife: 0.5,
                    vx: 0,
                    vy: 0,
                    vz: -4.0,
                    speed: 0
                });
            }
        }
    }

    render() {
        Renderer.render(this);
    }
}
