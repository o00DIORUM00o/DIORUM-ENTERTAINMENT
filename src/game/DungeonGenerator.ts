import { BlockType } from "./constants/BlockType";
import { World } from "./World";
import { ITEMS } from "./Inventory";

interface Room {
  type:
    | "START"
    | "NORMAL"
    | "TREASURY"
    | "BOSS"
    | "STAIRS"
    | "ALTAR"
    | "TRAP_ROOM"
    | "WATER_ROOM"
    | "LAVA_ROOM"
    | "LIBRARY"
    | "GARDEN"
    | "MAZE"
    | "ARMORY"
    | "PRISON"
    | "IRON_PUZZLE";
  cx: number;
  cy: number;
  w: number;
  h: number;
  connections: { dir: number; to: number }[];
}

export function fillDungeonChest(
  world: World,
  x: number,
  y: number,
  z: number,
  tier: number = 1,
) {
  const inv = world.getChest(x, y, z);

  // Add gold/iron pieces
  const coins = Math.floor(Math.random() * 20 * tier) + 5;
  inv[0] = {
    ...ITEMS[tier >= 3 ? "gold_piece" : "iron_piece"],
    quantity: coins,
  } as any;

  // Random loot pool based on ITEMS
  const keys = Object.keys(ITEMS);
  const numItems = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
  let slot = 1;

  for (let i = 0; i < numItems; i++) {
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const item = ITEMS[randomKey];
    if (
      item &&
      (item as any).category !== "BLOCK" &&
      item.id !== "village_bell"
    ) {
      const quantity =
        item.maxStack && item.maxStack > 1
          ? Math.floor(Math.random() * 5) + 1
          : 1;
      inv[slot] = { ...item, quantity } as any;
      slot++;
    }
  }
  world.setChest(x, y, z, inv);
}

export function generateProceduralDungeon(
  world: World,
  startX: number,
  startY: number,
  dungeonZ: number,
  surfaceZ: number,
  depthLevel: number = 1,
  maxDepth: number = 3,
) {
  const gridW = 5;
  const gridH = 5;
  const cellSize = 16;

  // Bounds check to avoid generating off bottom mapping
  if (dungeonZ < 2) return;

  const grid: Room[] = new Array(gridW * gridH).fill(null);
  const getIdx = (x: number, y: number) => y * gridW + x;

  // Start at bottom middle
  let currX = 2;
  let currY = 4;
  let roomsCount = 1;

  grid[getIdx(currX, currY)] = {
    type: "START",
    cx: startX,
    cy: startY, // We place start exactly where the stairs came down
    w: 9,
    h: 9,
    connections: [],
  };

  const path = [{ x: currX, y: currY }];

  while (roomsCount < 12) {
    const dir = Math.floor(Math.random() * 4);
    let nx = currX;
    let ny = currY;
    if (dir === 0) nx++;
    else if (dir === 1) nx--;
    else if (dir === 2) ny++;
    else ny--;

    if (nx >= 0 && nx < gridW && ny >= 0 && ny < gridH) {
      if (!grid[getIdx(nx, ny)]) {
        const w = 7 + Math.floor(Math.random() * 6);
        const h = 7 + Math.floor(Math.random() * 6);
        grid[getIdx(nx, ny)] = {
          type: "NORMAL",
          // Calculate relative to START's local position
          cx: startX + (nx - 2) * cellSize,
          cy: startY + (ny - 4) * cellSize,
          w,
          h,
          connections: [],
        };
        roomsCount++;
      }

      // Add connection if missing
      const fromRoom = grid[getIdx(currX, currY)];
      const toRoom = grid[getIdx(nx, ny)];

      if (!fromRoom.connections.find((c) => c.to === getIdx(nx, ny))) {
        fromRoom.connections.push({ dir, to: getIdx(nx, ny) });
        toRoom.connections.push({ dir: dir ^ 1, to: getIdx(currX, currY) }); // Opposite direction
      }

      currX = nx;
      currY = ny;
      path.push({ x: currX, y: currY });
    }
  }

  // Last room is BOSS or STAIRS
  if (depthLevel < maxDepth) {
    grid[getIdx(currX, currY)].type = "STAIRS";
  } else {
    grid[getIdx(currX, currY)].type = "BOSS";
  }

  // Sprinkle specials
  let hasTreasury = false;
  let hasAltar = false;
  let hasGarden = false;
  let hasLibrary = false;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] && grid[i].type === "NORMAL") {
      const rand = Math.random();
      if (!hasTreasury && rand < 0.1) {
        grid[i].type = "TREASURY";
        hasTreasury = true;
      } else if (!hasAltar && rand < 0.2) {
        grid[i].type = "ALTAR";
        hasAltar = true;
      } else if (!hasLibrary && rand < 0.3) {
        grid[i].type = "LIBRARY";
        hasLibrary = true;
      } else if (!hasGarden && rand < 0.4) {
        grid[i].type = "GARDEN";
        hasGarden = true;
      } else if (rand < 0.45) {
        grid[i].type = "TRAP_ROOM";
      } else if (rand < 0.5) {
        grid[i].type = "WATER_ROOM";
      } else if (rand < 0.55) {
        grid[i].type = "LAVA_ROOM";
      } else if (rand < 0.65) {
        grid[i].type = "MAZE";
      } else if (rand < 0.7) {
        grid[i].type = "ARMORY";
      } else if (rand < 0.75) {
        grid[i].type = "PRISON";
      } else if (rand < 0.85) {
        grid[i].type = "IRON_PUZZLE";
      }
    }
  }

  // Solidify entire bounds with indestructible brick first so players can't exit
  for (let x = -3 * cellSize; x <= 3 * cellSize; x++) {
    for (let y = -5 * cellSize; y <= 1 * cellSize; y++) {
      const wx = startX + x;
      const wy = startY + y;
      // Basin for liquids
      world.setBlock(
        wx,
        wy,
        dungeonZ - 2,
        BlockType.DUNGEON_BRICK_INDESTRUCTIBLE,
      );
      // Floor & ceiling
      world.setBlock(
        wx,
        wy,
        dungeonZ - 1,
        BlockType.DUNGEON_BRICK_INDESTRUCTIBLE,
      );
      world.setBlock(
        wx,
        wy,
        dungeonZ + 4,
        BlockType.DUNGEON_BRICK_INDESTRUCTIBLE,
      );

      // Solid space
      for (let z = 0; z < 4; z++) {
        world.setBlock(
          wx,
          wy,
          dungeonZ + z,
          BlockType.DUNGEON_BRICK_INDESTRUCTIBLE,
        );
      }
    }
  }

  // Carve shaft for stairs to reach down to the start room
  for (let z = dungeonZ; z <= surfaceZ + 1; z++) {
    // Clear a 3x3 footprint to ensure players don't hit their head
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        world.setBlock(startX + dx, startY + dy, z, BlockType.AIR);
      }
    }

    // Build spiral using WOODEN_STAIRCASE
    if (z < surfaceZ) {
      const step = (z - dungeonZ) % 4; // 0, 1, 2, 3
      let sx = 0,
        sy = 0;
      if (step === 0) {
        sx = -1;
        sy = -1;
      }
      if (step === 1) {
        sx = 1;
        sy = -1;
      }
      if (step === 2) {
        sx = 1;
        sy = 1;
      }
      if (step === 3) {
        sx = -1;
        sy = 1;
      }

      world.setBlock(startX + sx, startY + sy, z, BlockType.WOODEN_STAIRCASE);
      world.setBlock(
        startX + sx,
        startY + sy,
        z - 1,
        BlockType.WOODEN_STAIRCASE,
      ); // place under so it's not floating visually

      // Wall on the outside of the staircase if it breaches the surface or something
      if (z > dungeonZ + 4) {
        // optional: add block walls so it isn't an open hole in the dirt until we reach the top
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
              world.setBlock(startX + dx, startY + dy, z, BlockType.STONE);
            }
          }
        }
      }
    }
  }

  // Carve rooms
  for (let i = 0; i < grid.length; i++) {
    const r = grid[i];
    if (!r) continue;

    const hw = Math.floor(r.w / 2);
    const hh = Math.floor(r.h / 2);

    const isBoss = r.type === "BOSS";

    const wallBlock = isBoss ? BlockType.DUNGEON_BRICK_HARD : BlockType.STONE;
    let floorBlock = BlockType.HEAVY_STONE;

    if (r.type === "GARDEN") floorBlock = BlockType.GRASS;
    else if (r.type === "WATER_ROOM") floorBlock = BlockType.WATER;
    else if (r.type === "LAVA_ROOM") floorBlock = BlockType.LAVA;
    else if (r.type === "LIBRARY") floorBlock = BlockType.WOOD_WALL;

    for (let rx = -hw - 1; rx <= hw + 1; rx++) {
      for (let ry = -hh - 1; ry <= hh + 1; ry++) {
        const wx = r.cx + rx;
        const wy = r.cy + ry;

        if (
          rx === -hw - 1 ||
          rx === hw + 1 ||
          ry === -hh - 1 ||
          ry === hh + 1
        ) {
          // Outer walls
          for (let z = 0; z < 4; z++) {
            world.setBlock(wx, wy, dungeonZ + z, wallBlock);
          }
        } else {
          // Air / Floor / Ceiling
          world.setBlock(wx, wy, dungeonZ - 1, floorBlock);
          world.setBlock(wx, wy, dungeonZ + 4, BlockType.HEAVY_STONE);
          for (let z = 0; z < 4; z++) {
            world.setBlock(wx, wy, dungeonZ + z, BlockType.AIR);
          }
        }
      }
    }

    // Spawn stuff
    if (r.type === "START") {
      world.setBlock(r.cx - 2, r.cy - 2, dungeonZ, BlockType.TORCH);
      world.setBlock(r.cx + 2, r.cy - 2, dungeonZ, BlockType.TORCH);

      if (depthLevel === 1) {
        world.setBlock(r.cx, r.cy - 3, dungeonZ, BlockType.QUEST_NPC_SPAWNER);
      }
    } else if (r.type === "NORMAL") {
      const spawnerCount = Math.floor(Math.random() * 3) + 1;
      for (let s = 0; s < spawnerCount; s++) {
        const sx = r.cx + Math.floor((Math.random() - 0.5) * r.w * 0.6);
        const sy = r.cy + Math.floor((Math.random() - 0.5) * r.h * 0.6);
        const randSpawner = Math.random();
        let spawner = BlockType.BONE_PILE_SPAWNER;
        if (randSpawner < 0.2) spawner = BlockType.DARK_ELF_SPAWNER;
        else if (randSpawner < 0.4) spawner = BlockType.GOBLIN_CAMP;
        else if (randSpawner < 0.6) spawner = BlockType.HORDE_SPAWNER;

        world.setBlock(sx, sy, dungeonZ, spawner);
      }
      if (Math.random() < 0.3) {
        world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
        const chestInv = new Array(80).fill(null);
        if (Math.random() < 0.5) {
          chestInv[0] = { ...ITEMS["dungeon_key"], quantity: 1 };
        } else {
          chestInv[0] = { ...ITEMS["bomb"], quantity: 3 };
          chestInv[1] = {
            ...ITEMS["pot"],
            quantity: Math.floor(Math.random() * 3) + 1,
          };
          chestInv[2] = { ...ITEMS["health_potion"], quantity: 1 };
        }
        world.setChest(r.cx, r.cy, dungeonZ, chestInv);
      }
      // Sprinkle traps in normal rooms
      if (Math.random() < 0.4) {
        world.setBlock(
          r.cx - Math.floor(hw / 2),
          r.cy,
          dungeonZ + 1,
          BlockType.WALL_SHOOTER,
        );
      }
      if (Math.random() < 0.4) {
        world.setBlock(r.cx - 1, r.cy, dungeonZ - 1, BlockType.SPIKE_FLOOR);
        world.setBlock(r.cx + 1, r.cy, dungeonZ - 1, BlockType.SPIKE_FLOOR);
      }
    } else if (r.type === "BOSS") {
      const bossSpawners = [
        BlockType.ROCK_GOLEM_SPAWNER,
        BlockType.OBSERVER_SPAWNER,
        BlockType.SPHINX_SPAWNER,
        BlockType.HORDE_SPAWNER,
      ];
      const bossBlock =
        bossSpawners[Math.floor(Math.random() * bossSpawners.length)];
      world.setBlock(r.cx, r.cy, dungeonZ, bossBlock);
      world.setBlock(r.cx - 3, r.cy - 3, dungeonZ, BlockType.BONE_PILE_SPAWNER);
      world.setBlock(r.cx + 3, r.cy - 3, dungeonZ, BlockType.BONE_PILE_SPAWNER);
      world.setBlock(r.cx - 3, r.cy + 3, dungeonZ, BlockType.BONE_PILE_SPAWNER);
      world.setBlock(r.cx + 3, r.cy + 3, dungeonZ, BlockType.BONE_PILE_SPAWNER);

      // Big Loot
      world.setBlock(r.cx, r.cy + 2, dungeonZ, BlockType.CHEST);
      world.setBlock(r.cx, r.cy + 3, dungeonZ, BlockType.MAGIC_BLOCK);

      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["book_summon_rat"] };
      chestInv[1] = { ...ITEMS["gold_piece"], quantity: 150 };
      chestInv[2] = { ...ITEMS["emerald"], quantity: 5 };
      chestInv[3] = { ...ITEMS["pot"], quantity: 5 };
      chestInv[4] = { ...ITEMS["ruby"], quantity: 2 };
      world.setChest(r.cx, r.cy + 2, dungeonZ, chestInv);

      world.setBlock(r.cx - 2, r.cy + 2, dungeonZ, BlockType.TORCH);
      world.setBlock(r.cx + 2, r.cy + 2, dungeonZ, BlockType.TORCH);
    } else if (r.type === "STAIRS") {
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.BONE_PILE_SPAWNER);

      // Carve a spiral staircase escape route back to the surface for multiple entrances!
      const escX = r.cx;
      const escY = r.cy - 3;
      // First we need to cap the surface with a tiny hut so players can see it if we are entering here
      if (depthLevel === 1) {
        world.buildStructure("DUNGEON_ENTRANCE", escX, escY, surfaceZ);
      }

      if (depthLevel < maxDepth) {
        const nextZ = dungeonZ - 5;

        // Clear the floor above the stairs shaft for easy transition
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            world.setBlock(escX + dx, escY + dy, dungeonZ, BlockType.AIR);
            world.setBlock(escX + dx, escY + dy, dungeonZ + 1, BlockType.AIR);
            world.setBlock(escX + dx, escY + dy, dungeonZ + 2, BlockType.AIR);
            world.setBlock(escX + dx, escY + dy, dungeonZ + 3, BlockType.AIR);
          }
        }

        // Actually carve the spiral down
        for (let z = nextZ; z < dungeonZ; z++) {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              world.setBlock(escX + dx, escY + dy, z, BlockType.AIR);
            }
          }
          const step = (z - nextZ) % 4;
          let sx = 0,
            sy = 0;
          if (step === 0) {
            sx = -1;
            sy = -1;
          }
          if (step === 1) {
            sx = 1;
            sy = -1;
          }
          if (step === 2) {
            sx = 1;
            sy = 1;
          }
          if (step === 3) {
            sx = -1;
            sy = 1;
          }
          world.setBlock(escX + sx, escY + sy, z, BlockType.WOODEN_STAIRCASE);
          world.setBlock(
            escX + sx,
            escY + sy,
            Math.max(0, z - 1),
            BlockType.WOODEN_STAIRCASE,
          );

          // Surround shaft with indestructible brick
          for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
              if (Math.abs(dx) === 2 || Math.abs(dy) === 2) {
                world.setBlock(
                  escX + dx,
                  escY + dy,
                  z,
                  BlockType.DUNGEON_BRICK_INDESTRUCTIBLE,
                );
              }
            }
          }
        }

        generateProceduralDungeon(
          world,
          escX,
          escY,
          nextZ,
          dungeonZ,
          depthLevel + 1,
          maxDepth,
        );
      }
    } else if (r.type === "TREASURY") {
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["staff_fire_ranged"] };
      chestInv[1] = { ...ITEMS["boss_key"], quantity: 1 };
      chestInv[2] = { ...ITEMS["health_potion"], quantity: 2 };
      chestInv[3] = { ...ITEMS["pot"], quantity: 5 };
      world.setChest(r.cx, r.cy, dungeonZ, chestInv);

      world.setBlock(r.cx - 2, r.cy, dungeonZ, BlockType.TORCH);
      world.setBlock(r.cx + 2, r.cy, dungeonZ, BlockType.TORCH);

      // Add a bunch of pots for loot in treasury!
      world.setBlock(r.cx - 1, r.cy - 1, dungeonZ, BlockType.POT);
      world.setBlock(r.cx + 1, r.cy - 1, dungeonZ, BlockType.POT);
      world.setBlock(r.cx - 1, r.cy + 1, dungeonZ, BlockType.POT);
      world.setBlock(r.cx + 1, r.cy + 1, dungeonZ, BlockType.POT);
    } else if (r.type === "ALTAR") {
      world.setBlock(
        r.cx,
        r.cy,
        dungeonZ,
        Math.random() < 0.5
          ? BlockType.ALTAR_DIVINE
          : BlockType.ALTAR_CORRUPTED,
      );
      world.setBlock(r.cx - 2, r.cy, dungeonZ, BlockType.TORCH);
      world.setBlock(r.cx + 2, r.cy, dungeonZ, BlockType.TORCH);

      // More pots around the altar
      world.setBlock(r.cx - 3, r.cy - 1, dungeonZ, BlockType.POT);
      world.setBlock(r.cx + 3, r.cy - 1, dungeonZ, BlockType.POT);
    } else if (r.type === "TRAP_ROOM") {
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["gold_piece"], quantity: 50 };
      world.setChest(r.cx, r.cy, dungeonZ, chestInv);

      for (let rx = -hw + 1; rx <= hw - 1; rx++) {
        for (let ry = -hh + 1; ry <= hh - 1; ry++) {
          if (Math.random() < 0.4 && (rx !== 0 || ry !== 0)) {
            world.setBlock(
              r.cx + rx,
              r.cy + ry,
              dungeonZ - 1,
              BlockType.SPIKE_FLOOR,
            );
          }
        }
      }
      world.setBlock(
        r.cx - Math.floor(hw / 2),
        r.cy,
        dungeonZ + 1,
        BlockType.WALL_SHOOTER,
      );
      world.setBlock(
        r.cx + Math.floor(hw / 2),
        r.cy,
        dungeonZ + 1,
        BlockType.WALL_SHOOTER,
      );
      world.setBlock(
        r.cx,
        r.cy - Math.floor(hh / 2),
        dungeonZ + 1,
        BlockType.WALL_SHOOTER,
      );
    } else if (r.type === "WATER_ROOM" || r.type === "LAVA_ROOM") {
      // Bridge cross structure
      for (let rx = -hw; rx <= hw; rx++) {
        world.setBlock(r.cx + rx, r.cy, dungeonZ - 1, BlockType.HEAVY_STONE);
        if (Math.random() < 0.2) {
          world.setBlock(r.cx + rx, r.cy, dungeonZ, BlockType.TORCH);
        }
      }
      for (let ry = -hh; ry <= hh; ry++) {
        world.setBlock(r.cx, r.cy + ry, dungeonZ - 1, BlockType.HEAVY_STONE);
      }

      // Random spawner off bridge
      world.setBlock(
        r.cx + Math.floor(hw / 2),
        r.cy + Math.floor(hh / 2),
        dungeonZ,
        BlockType.BONE_PILE_SPAWNER,
      );
      world.setBlock(
        r.cx - Math.floor(hw / 2),
        r.cy - Math.floor(hh / 2),
        dungeonZ,
        BlockType.BONE_PILE_SPAWNER,
      );
    } else if (r.type === "LIBRARY") {
      // Rows of "bookshelves" built from wood walls
      for (let rx = -hw + 1; rx <= hw - 1; rx += 3) {
        for (let ry = -hh + 1; ry <= hh - 1; ry++) {
          if (ry !== 0) {
            // leave middle path
            world.setBlock(r.cx + rx, r.cy + ry, dungeonZ, BlockType.WOOD_WALL);
            world.setBlock(
              r.cx + rx,
              r.cy + ry,
              dungeonZ + 1,
              BlockType.WOOD_WALL,
            );
          }
        }
      }
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["book_fire_bolt"] };
      chestInv[1] = { ...ITEMS["magic_dust"], quantity: 5 };
      chestInv[2] = { ...ITEMS["dungeon_key"], quantity: 1 };
      world.setChest(r.cx, r.cy, dungeonZ, chestInv);

      world.setBlock(r.cx + 2, r.cy, dungeonZ, BlockType.TORCH);
      world.setBlock(r.cx - 2, r.cy, dungeonZ, BlockType.TORCH);
    } else if (r.type === "GARDEN") {
      // Trees and bushes
      for (let s = 0; s < 5; s++) {
        const sx = r.cx + Math.floor((Math.random() - 0.5) * r.w * 0.8);
        const sy = r.cy + Math.floor((Math.random() - 0.5) * r.h * 0.8);
        world.setBlock(sx, sy, dungeonZ, BlockType.TRUNK);
        world.setBlock(sx, sy, dungeonZ + 1, BlockType.LEAVES);
      }
      for (let s = 0; s < 8; s++) {
        const sx = r.cx + Math.floor((Math.random() - 0.5) * r.w * 0.8);
        const sy = r.cy + Math.floor((Math.random() - 0.5) * r.h * 0.8);
        if (Math.random() < 0.5)
          world.setBlock(sx, sy, dungeonZ, BlockType.RED_BERRY_BUSH);
        else world.setBlock(sx, sy, dungeonZ, BlockType.BUSH);
      }
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.BEE_HIVE);
      world.setBlock(r.cx + 2, r.cy + 2, dungeonZ, BlockType.MUSHROOM_STEM);
      world.setBlock(r.cx + 2, r.cy + 2, dungeonZ + 1, BlockType.MUSHROOM_CAP);
    } else if (r.type === "MAZE") {
      // Random walls scattered to obscure path
      for (let rx = -hw + 1; rx <= hw - 1; rx++) {
        for (let ry = -hh + 1; ry <= hh - 1; ry++) {
          if (Math.random() < 0.3) {
            for (let z = 0; z < 3; z++)
              world.setBlock(
                r.cx + rx,
                r.cy + ry,
                dungeonZ + z,
                BlockType.STONE,
              );
          }
        }
      }
      world.setBlock(r.cx + hw - 2, r.cy + hh - 2, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["bomb"], quantity: 5 };
      chestInv[1] = { ...ITEMS["health_potion"], quantity: 2 };
      world.setChest(r.cx + hw - 2, r.cy + hh - 2, dungeonZ, chestInv);
    } else if (r.type === "ARMORY") {
      // Weapon racks, a forge, an anvil
      world.setBlock(r.cx - 2, r.cy - 2, dungeonZ, BlockType.ANVIL);
      world.setBlock(r.cx + 2, r.cy - 2, dungeonZ, BlockType.FURNACE);
      world.setBlock(r.cx, r.cy + 2, dungeonZ, BlockType.DUMMY);

      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["iron_sword"] };
      chestInv[1] = { ...ITEMS["iron_shield"] };
      chestInv[2] = { ...ITEMS["iron_legs"] };
      world.setChest(r.cx, r.cy, dungeonZ, chestInv);
    } else if (r.type === "PRISON") {
      // Iron bar cells and bones
      for (let rx = -hw + 2; rx <= hw - 2; rx += 3) {
        for (let ry = -hh + 2; ry <= hh - 2; ry += 3) {
          if (Math.abs(rx) > 1 || Math.abs(ry) > 1) {
            // leave a center path
            world.setBlock(
              r.cx + rx,
              r.cy + ry,
              dungeonZ,
              BlockType.IRON_BLOCK,
            );
            world.setBlock(
              r.cx + rx,
              r.cy + ry + 1,
              dungeonZ,
              BlockType.IRON_BLOCK,
            );
            if (Math.random() < 0.5)
              world.setBlock(
                r.cx + rx + 1,
                r.cy + ry,
                dungeonZ,
                BlockType.BONE_PILE_SPAWNER,
              );
          }
        }
      }
      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.HORDE_SPAWNER);
    } else if (r.type === "IRON_PUZZLE") {
      // Room is blocked by a wall of iron blocks, lever opens it
      for (let rx = -hw; rx <= hw; rx++) {
        if (rx !== 0) {
          world.setBlock(r.cx + rx, r.cy, dungeonZ, BlockType.IRON_BLOCK);
          world.setBlock(r.cx + rx, r.cy, dungeonZ + 1, BlockType.IRON_BLOCK);
        }
      }
      for (let ry = -hh; ry <= hh; ry++) {
        if (ry !== 0) {
          world.setBlock(r.cx, r.cy + ry, dungeonZ, BlockType.IRON_BLOCK);
          world.setBlock(r.cx, r.cy + ry, dungeonZ + 1, BlockType.IRON_BLOCK);
        }
      }
      world.setBlock(r.cx - 2, r.cy - 2, dungeonZ, BlockType.LEVER);
      world.setBlock(r.cx + 2, r.cy + 2, dungeonZ, BlockType.LEVER);

      world.setBlock(r.cx, r.cy, dungeonZ, BlockType.CHEST);
      const chestInv = new Array(80).fill(null);
      chestInv[0] = { ...ITEMS["dungeon_key"], quantity: 1 };
      chestInv[1] = { ...ITEMS["gold_piece"], quantity: 150 };
      world.setChest(r.cx, r.cy, dungeonZ, chestInv);
    }
  }

  // Carve corridors
  for (let i = 0; i < grid.length; i++) {
    const fromRoom = grid[i];
    if (!fromRoom) continue;

    for (const conn of fromRoom.connections) {
      const toRoom = grid[conn.to];
      if (!toRoom) continue;

      // Only carve each connection once (when from < to)
      if (i > conn.to) continue;

      let doorBlock = BlockType.AIR;
      if (toRoom.type === "BOSS" || fromRoom.type === "BOSS")
        doorBlock = BlockType.DOOR_BOSS;
      else if (toRoom.type === "TREASURY" || fromRoom.type === "TREASURY")
        doorBlock = BlockType.DOOR_LOCKED;
      else if (Math.random() < 0.3) doorBlock = BlockType.DOOR_LOCKED;
      else if (Math.random() < 0.5) doorBlock = BlockType.DOOR_CLOSED;

      // We draw a line from fromRoom.cx, cy to toRoom.cx, cy
      const dx = Math.sign(toRoom.cx - fromRoom.cx);
      const dy = Math.sign(toRoom.cy - fromRoom.cy);
      let wx = fromRoom.cx;
      let wy = fromRoom.cy;

      let doorPlaced = false;

      while (wx !== toRoom.cx || wy !== toRoom.cy) {
        if (wx !== toRoom.cx) wx += dx;
        else if (wy !== toRoom.cy) wy += dy;

        // Clearance for corridor: 3 wide
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            for (let z = 0; z < 3; z++) {
              // Don't overwrite indestructible room corners, but we just carved them, so let's set them inside.
              world.setBlock(wx + ox, wy + oy, dungeonZ + z, BlockType.AIR);
            }
            world.setBlock(
              wx + ox,
              wy + oy,
              dungeonZ - 1,
              BlockType.HEAVY_STONE,
            );
            world.setBlock(
              wx + ox,
              wy + oy,
              dungeonZ + 3,
              BlockType.HEAVY_STONE,
            );
          }
        }

        // Place door roughly in the middle
        const midX = Math.floor((fromRoom.cx + toRoom.cx) / 2);
        const midY = Math.floor((fromRoom.cy + toRoom.cy) / 2);

        if (
          !doorPlaced &&
          wx === midX &&
          wy === midY &&
          doorBlock !== BlockType.AIR
        ) {
          world.setBlock(wx - 1, wy, dungeonZ, doorBlock);
          world.setBlock(wx, wy, dungeonZ, doorBlock);
          world.setBlock(wx + 1, wy, dungeonZ, doorBlock);
          world.setBlock(wx - 1, wy, dungeonZ + 1, doorBlock);
          world.setBlock(wx, wy, dungeonZ + 1, doorBlock);
          world.setBlock(wx + 1, wy, dungeonZ + 1, doorBlock);
          doorPlaced = true;
        }
      }
    }
  }
}
