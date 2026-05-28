import { Chunk } from './Chunk';
import { BlockType } from '../constants/BlockType';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../Constants';
import { PlanetDef } from '../registries/PlanetRegistry';

export class CityGenerator {
    static isCityRegion(wx: number, wy: number): boolean {
        // Shift city so it starts at wx=16, wy=16 to cleanly dodge buildSpawn area!
        // City will be 128x128 from (16, 16) to (143, 143)
        return wx >= 16 && wx <= 143 && wy >= 16 && wy <= 143;
    }

    static generate(chunk: Chunk, planetDef: PlanetDef, baseElev: number) {
        if (planetDef.id === 'TARHE') return;
        
        const cx = chunk.cx;
        const cy = chunk.cy;
        const minWx = cx * CHUNK_SIZE;
        const minWy = cy * CHUNK_SIZE;
        
        // Quick AABB check to skip chunks completely outside
        if (minWx > 143 || (minWx + CHUNK_SIZE - 1) < 16 || minWy > 143 || (minWy + CHUNK_SIZE - 1) < 16) {
            return;
        }

        const targetElev = baseElev + 1; // Flatten city to +1 above base

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                const wx = minWx + x;
                const wy = minWy + y;

                if (!this.isCityRegion(wx, wy)) continue;

                // local coordinates relative to city start
                const wxMod = wx - 16;
                const wyMod = wy - 16;

                // City bounds interior
                // Roads are at 0, 1, 127
                // Walls are at 2, 126
                // Inside is 3 to 125.
                
                // Clear sky above
                for (let z = targetElev + 1; z < WORLD_HEIGHT; z++) {
                    chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
                }
                
                // Floor defaults to PAVED_ROAD or DIRT_PATH
                chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.COBBLESTONE_ROAD;
                chunk.heightMap[x + y * CHUNK_SIZE] = targetElev;

                // -------------------------
                // 1. OUTER WALLS & GATES
                // -------------------------
                const isWall = (wxMod === 2 || wxMod === 126 || wyMod === 2 || wyMod === 126) && (wxMod > 1 && wxMod < 127 && wyMod > 1 && wyMod < 127);
                const isGate = isWall && (Math.abs(wxMod - 64) <= 3 || Math.abs(wyMod - 64) <= 3);
                
                if (isWall && !isGate) {
                    for (let h = 1; h <= 10; h++) {
                        chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                    }
                    chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 10;
                }
                
                if (isGate) {
                   chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
                   // Gate archway top
                   if (Math.abs(wxMod - 64) === 3 || Math.abs(wyMod - 64) === 3) {
                       for (let h = 1; h <= 10; h++) {
                           chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                       }
                       chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
                       chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                       chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 10;
                   } else if (Math.abs(wxMod - 64) < 3 || Math.abs(wyMod - 64) < 3) {
                       for (let h = 7; h <= 10; h++) {
                           chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
                       }
                       chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 10;
                   }
                }

                // Guard Tents (at entrances inside)
                if ((wxMod === 6 && (wyMod === 61 || wyMod === 67)) || 
                    (wxMod === 122 && (wyMod === 61 || wyMod === 67)) || 
                    (wyMod === 6 && (wxMod === 61 || wxMod === 67)) || 
                    (wyMod === 122 && (wxMod === 61 || wxMod === 67))) {
                     chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_KNIGHT_TENT;
                     chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
                     chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 2;
                }

                // -------------------------
                // 2. MAIN ROADS (Cross at 64)
                // -------------------------
                const isMainRoadX = Math.abs(wyMod - 64) <= 2;
                const isMainRoadY = Math.abs(wxMod - 64) <= 2;
                if (isMainRoadX || isMainRoadY) {
                    let onRoadEdge = ((isMainRoadX && Math.abs(wyMod - 64) === 2) || (isMainRoadY && Math.abs(wxMod - 64) === 2));
                    chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = onRoadEdge ? BlockType.STONE : BlockType.PAVED_ROAD;
                    
                    if (onRoadEdge) {
                       // Every 8 blocks place a lantern
                       if ((wxMod % 8 === 0 && isMainRoadX) || (wyMod % 8 === 0 && isMainRoadY)) {
                           chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                           chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
                       }
                       // Place Road Sign at crossroads (just outside the moat 23 units from center)
                       if ((Math.abs(wxMod - 64) === 23 && Math.abs(wyMod - 64) === 2) || (Math.abs(wyMod - 64) === 23 && Math.abs(wxMod - 64) === 2)) {
                           chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ROAD_SIGN;
                           if (targetElev + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
                       }
                    }

                    continue; // Leave roads empty above ground
                }

                if (wxMod <= 2 || wxMod >= 126 || wyMod <= 2 || wyMod >= 126) continue; // Ignore outer rim for features

                // -------------------------
                // 3. CENTRAL CASTLE
                // -------------------------
                const distToCenter = Math.max(Math.abs(wxMod - 64), Math.abs(wyMod - 64));
                if (distToCenter <= 18) {
                    this.buildCastle(chunk, x, y, wxMod, wyMod, targetElev);
                    continue;
                }
                
                // Moat
                if (distToCenter > 18 && distToCenter <= 21) {
                    chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                    for (let z = targetElev - 1; z >= targetElev - 3; z--) {
                         chunk.blocks[x + y * CHUNK_SIZE + z * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
                    }
                    continue;
                }

                // -------------------------
                // 4. DISTRICTS (16 Grid System)
                // -------------------------
                const gridX = Math.floor((wxMod - 3) / 30.5); // roughly maps 3..125 to 0..3
                const gridY = Math.floor((wyMod - 3) / 30.5);
                const localX = wxMod % 31;
                const localY = wyMod % 31;
                const gridID = Math.min(3, Math.max(0, gridY)) * 4 + Math.min(3, Math.max(0, gridX));
                
                // Secondary Roads (crossing at ~33 and ~95)
                const isSecondaryRoadX = Math.abs(wyMod - 33) <= 1 || Math.abs(wyMod - 95) <= 1;
                const isSecondaryRoadY = Math.abs(wxMod - 33) <= 1 || Math.abs(wxMod - 95) <= 1;
                
                if (isSecondaryRoadX || isSecondaryRoadY) {
                    chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PAVED_ROAD;
                    // Occasional lamp
                    if (Math.abs(wxMod - 33) === 1 || Math.abs(wxMod - 95) === 1 || Math.abs(wyMod - 33) === 1 || Math.abs(wyMod - 95) === 1) {
                        if (wxMod % 12 === 0 || wyMod % 12 === 0) {
                             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                             if (targetElev + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
                        }
                    }
                    continue;
                }

                this.buildDistrictCell(chunk, x, y, localX, localY, targetElev, gridID);
            }
        }
    }

    private static buildCastle(chunk: Chunk, x: number, y: number, wxMod: number, wyMod: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MARBLE;
        
        const isCastleWall = Math.max(Math.abs(wxMod - 64), Math.abs(wyMod - 64)) === 18;
        const isCastleGate = isCastleWall && (Math.abs(wxMod - 64) <= 2 || Math.abs(wyMod - 64) <= 2);
        
        if (isCastleWall && !isCastleGate) {
             for (let h = 1; h <= 15; h++) {
                  chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
             }
             if (Math.abs(wxMod - 64) === 18 && Math.abs(wyMod - 64) === 18) {
                  chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 16) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GARGOYLE_SPAWNER;
                  chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 16;
             } else {
                  chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 15;
             }
        } else if (isCastleGate) { // Gate
             for (let h = 6; h <= 15; h++) {
                  chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
             }
             if (Math.abs(wxMod - 64) === 2 || Math.abs(wyMod - 64) === 2) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_KNIGHT_TENT;
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 6) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
             }
             chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 15;
        } else {
            // Castle Interior
            // Red carpet leading to the throne
            if (wxMod >= 63 && wxMod <= 65 && wyMod >= 56 && wyMod <= 64) {
                 chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.RED_MARBLE;
            }
            
            // Place Dungeon Stairs at very center
            if (wxMod === 64 && wyMod === 64) {
                 chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOODEN_STAIRCASE;
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev - 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOODEN_STAIRCASE;
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.AIR;
            } else if (wxMod === 64 && wyMod === 56) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.THRONE_BLOCK;
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.KING_SPAWNER;
                 chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 2);
            } else if (Math.max(Math.abs(wxMod - 64), Math.abs(wyMod - 64)) === 2 && (wxMod === 62 || wxMod === 66 || wyMod === 62 || wyMod === 66)) {
                 if (Math.abs(wxMod - 64) === 2 && Math.abs(wyMod - 64) === 2) {
                     // four pillars
                     for(let h = 1; h <= 6; h++) {
                         chunk.blocks[x + y * CHUNK_SIZE + (targetElev + h) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GOLD_BLOCK;
                     }
                     chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 7) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
                     chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 7;
                 }
            } else if (Math.abs(wxMod - 64) === 16 && Math.abs(wyMod - 64) === 16) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_FROST_CASTER_TENT;
            } else if (Math.random() < 0.05) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_KNIGHT_TENT;
                 if (targetElev + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
            } else if (Math.random() < 0.02) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_ARCHER_TENT;
                 if (targetElev + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
            } else if (Math.random() < 0.01) {
                 chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
                 if (targetElev + 1 > chunk.heightMap[x + y * CHUNK_SIZE]) chunk.heightMap[x + y * CHUNK_SIZE] = targetElev + 1;
            }
        }
    }

    private static buildDistrictCell(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number, gridID: number) {
        switch (gridID) {
            case 0: this.buildShrineDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 1: this.buildNobleDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 2: this.buildQuestDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 3: this.buildCommonerDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 4: this.buildArtisanDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 5: this.buildGardenDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 6: this.buildMarketDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 7: this.buildMerchantDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 8: this.buildSlumDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 9: this.buildMilitaryDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 10: this.buildMageDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 11: this.buildTavernDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 12: this.buildGraveyardDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 13: this.buildFarmDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 14: this.buildWarehouseDistrict(chunk, x, y, localX, localY, targetElev); break;
            case 15: this.buildGuestDistrict(chunk, x, y, localX, localY, targetElev); break;
            default: this.buildCommonerDistrict(chunk, x, y, localX, localY, targetElev); break;
        }
    }

    private static buildShrineDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
        if (localX === 16 && localY === 16) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.SHRINE;
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MITHRIL_BLOCK;
        } else if (localX === 8 && localY === 8) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PRIEST_TENT;
        } else if (localX === 24 && localY === 24) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PRIEST_TENT;
        } else if ((localX === 16 && (localY === 8 || localY === 24)) || (localY === 16 && (localX === 8 || localX === 24))) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
        } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 2);
    }

    private static buildNobleDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
        if (localX === 16 && localY === 16) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.HUMAN_CASTLE_SPAWNER;
        } else if ((localX === 8 || localX === 24) && (localY === 8 || localY === 24)) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
        } else if (Math.abs(localX - 16) === 2 && Math.abs(localY - 16) === 2) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GOLD_BLOCK;
        } else if (localX % 4 === 0 && localY % 4 === 0 && Math.random() < 0.2) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildQuestDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
        if (localX === 16 && localY === 16) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.QUEST_NPC_SPAWNER;
        } else if (localX === 16 && (localY === 14 || localY === 18)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
        } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildCommonerDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
        if (localX % 8 === 0 && localY % 8 === 0) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TENT;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
        } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.VILLAGE_BELL;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
        }
    }

    private static buildArtisanDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
        if (localX === 16 && localY === 16) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CARPENTERS_BENCH;
        } else if (localX === 12 && localY === 12) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MASONRY_TABLE;
        } else if (localX === 20 && localY === 12) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ANVIL;
        } else if (localX === 12 && localY === 20) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.FABRIC_STATION;
        } else if (localX === 20 && localY === 20) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LEATHER_STATION;
        } else if (localX === 16 && localY === 24) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT;
        } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildGardenDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRASS;
        
        if (localX === 16 && localY === 16) {
            chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.FAIRY_SPAWNER;
        } else if (Math.abs(localX - 16) <= 2 && Math.abs(localY - 16) <= 2) {
            chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
        } else if (localX % 4 === 0 && localY % 4 === 0) {
            const types = [BlockType.LEAVES, BlockType.RED_BERRY_BUSH, BlockType.BLUE_BERRY_BUSH, BlockType.YELLOW_BERRY_BUSH];
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = types[Math.floor(Math.random() * types.length)];
        } else if (Math.random() < 0.1) {
            chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.FERN;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildMarketDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.COBBLESTONE_ROAD;
         if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MITHRIL_BELL;
         } else if (localX === 10 && localY === 10) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_BOOKS;
         } else if (localX === 10 && localY === 22) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_POTIONS;
         } else if (localX === 22 && localY === 10) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_SWORDS;
         } else if (localX === 22 && localY === 22) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_INGOTS;
         } else if (localX === 16 && localY === 10) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_SEEDS;
         } else if (localX === 16 && localY === 22) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_FABRIC;
         } else if (localX === 10 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_RUNE_KEYS;
         } else if (localX === 22 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.STALL_LEATHER;
         }
         chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildMerchantDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
        chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
        if ((localX === 10 || localX === 22) && (localY === 10 || localY === 22)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT_TENT;
        } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
        } else if (localX % 10 === 0 && localY % 10 === 0) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
        }
        chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildSlumDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
         if (localX % 6 === 0 && localY % 6 === 0) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TENT;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WEED;
         }
    }

    private static buildMilitaryDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CASTLE_STONE;
         if ((localX === 8 || localX === 24) && (localY === 8 || localY === 24)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.5 ? BlockType.LOYAL_KNIGHT_TENT : BlockType.LOYAL_ARCHER_TENT;
         } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DUMMY;
         } else if (localX === 16 && (localY === 10 || localY === 22)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LANTERN_BLOCK;
         } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
         }
         chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildMageDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.OBSIDIAN;
         if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.PHANTOM_WIZARD_SPAWNER;
         } else if (localX === 12 && localY === 12) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.ALCHEMY_TABLE;
         } else if (localX === 20 && localY === 20) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WIZARD_TOWER_WALL;
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 2) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WIZARD_TOWER_WALL;
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 3) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WIZARD_TOWER_WALL;
         } else if (localX === 16 && (localY === 8 || localY === 24)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.LOYAL_FROST_CASTER_TENT;
         } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MAGIC_BLOCK;
         }
         chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 3);
    }

    private static buildTavernDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
         if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
         } else if (localX === 16 && localY === 14) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.COOKING_POT;
         } else if (localX === 10 && localY === 10) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.MERCHANT; // Barkeep
         } else if (localX === 22 && localY === 22) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WANDERING_BARD_TENT;
         } else if (localX % 4 === 0 && localY % 4 === 0 && Math.random() < 0.5) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BED;
         } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.POT;
         }
         chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildGraveyardDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRASS;
         if (localX % 6 === 0 && localY % 6 === 0 && (localX !== 16 || localY !== 16)) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GRAVESTONE; // Gravestone
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.QUEST_DUNGEON_SPAWNER;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (Math.random() < 0.05) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = Math.random() < 0.5 ? BlockType.WEED : BlockType.BONE_PILE_SPAWNER;
         }
    }

    private static buildFarmDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT;
         if (localX % 2 === 0) {
             chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.TILLED_SOIL_WET;
         }
         if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WATER;
         } else if (localX % 2 === 0 && localY % 2 !== 0 && Math.random() < 0.6) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CROP_STAGE_3;
         }
         chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
    }

    private static buildWarehouseDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.WOOD_FLOOR;
         if (localX % 6 === 0 && localY % 6 !== 0) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CHEST;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.GUARD_MERCENARY;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         }
    }

    private static buildGuestDistrict(chunk: Chunk, x: number, y: number, localX: number, localY: number, targetElev: number) {
         chunk.blocks[x + y * CHUNK_SIZE + targetElev * CHUNK_SIZE * CHUNK_SIZE] = BlockType.DIRT_PATH;
         if (localX % 10 === 0 && localY % 10 === 0) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.BED;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         } else if (localX === 16 && localY === 16) {
             chunk.blocks[x + y * CHUNK_SIZE + (targetElev + 1) * CHUNK_SIZE * CHUNK_SIZE] = BlockType.CAMPFIRE;
             chunk.heightMap[x + y * CHUNK_SIZE] = Math.max(chunk.heightMap[x + y * CHUNK_SIZE], targetElev + 1);
         }
    }
}
