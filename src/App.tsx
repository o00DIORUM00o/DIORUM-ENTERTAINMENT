import { useEffect, useRef, useState } from 'react';
import { Engine, NPC } from './game/Engine';
import { EquipmentSlot, EQUIPMENT_SLOTS, Item, SPELLS, ITEMS } from './game/Inventory';
import { RARITY_COLORS } from './game/ItemGenerator';
import { TALENTS } from './game/Talents';
import { RecipeRegistry } from './game/registries/RecipeRegistry';
import { NPCChat } from './components/NPCChat';
import { ShopUI } from './components/ShopUI';
import { audioEngine } from './game/AudioEngine';
import { ThemeManager, THEMES } from './game/ThemeManager';
import { SaveManager } from './game/SaveManager';
import { formatZodiacStats } from './game/StarSigns';
import { STARTING_PACKS } from './game/content/packs/core_packs';
import { PlanetRegistry } from './game/registries/PlanetRegistry';

const TABS = ['CHARACTER', 'INVENTORY', 'EQUIPMENT', 'SPELLS', 'TALENTS', 'CRAFTING', 'DEITY', 'MOUNTS', 'COMPANIONS', 'JOURNAL', 'MAP', 'SETTINGS'];
const CREATION_TABS = ['RACE', 'COLOR', 'HOMEWORLD', 'ZODIAC', 'STARTING PACK', 'PANTHEON'];

import { HOMEWORLDS, RACES, RACE_COLORS, DEITIES } from './game/constants/CharacterCreation';

export default function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<Engine | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeTab, setActiveTab] = useState('INVENTORY');
    const [customTexturePack, setCustomTexturePack] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<{type: 'inventory', index: number} | {type: 'equipment', slot: EquipmentSlot} | {type: 'spell', id: string} | {type: 'chest', index: number} | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [isChestOpen, setIsChestOpen] = useState(false);
    const [currentChestPos, setCurrentChestPos] = useState<{x: number, y: number, z: number} | null>(null);
    const [isNPCChatOpen, setIsNPCChatOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [currentNPC, setCurrentNPC] = useState<NPC | null>(null);
    const [activeShrinePos, setActiveShrinePos] = useState<{x: number, y: number, z: number} | null>(null);
    const [shrineSelectedDeity, setShrineSelectedDeity] = useState<string | null>(null);
    const [activePortalMenu, setActivePortalMenu] = useState<string | null>(null);
    const [isArcaneGateOpen, setIsArcaneGateOpen] = useState(false);
    const [portalSelectedIndex, setPortalSelectedIndex] = useState(0);
    const portalSelectedIndexRef = useRef(0);
    const [gameState, setGameState] = useState<'TITLE_1' | 'TITLE_2' | 'TITLE_3' | 'TITLE_4' | 'TITLE_5' | 'CREATION' | 'PLAYING'>('TITLE_1');
    const [creationTab, setCreationTab] = useState('RACE');
    const [selectedRace, setSelectedRace] = useState<string>('HUMAN');
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedHomeworld, setSelectedHomeworld] = useState<string | null>(null);
    const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
    const [selectedStartingPack, setSelectedStartingPack] = useState<string | null>(null);
    const [selectedDeity, setSelectedDeity] = useState<string | null>(null);
    const gameStateRef = useRef(gameState);

    const [hud, setHud] = useState<{
        health: number; maxHealth: number;
        mana: number; maxMana: number;
        stamina: number; maxStamina: number;
        xp: number; xpToNextLevel: number;
        level: number; defense: number;
        isDead: boolean;
        activeBoss?: { name: string; health: number; maxHealth: number; state: string; } | null;
        locationName?: string;
    }>({
        health: 100, maxHealth: 100,
        mana: 100, maxMana: 100,
        stamina: 100, maxStamina: 100,
        xp: 0, xpToNextLevel: 100,
        level: 1, defense: 0,
        isDead: false,
        activeBoss: null,
        locationName: "Origin Crossroads"
    });

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        const handleInteraction = () => {
            audioEngine.startIntro();
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    useEffect(() => {
        portalSelectedIndexRef.current = portalSelectedIndex;
    }, [portalSelectedIndex]);

    const handleEquip = (slot: EquipmentSlot) => {
        if (selectedSlot?.type === 'inventory' && engineRef.current) {
            const success = engineRef.current.player.equipItem(selectedSlot.index, slot);
            if (success) {
                setSelectedSlot({ type: 'equipment', slot });
                setUpdateTrigger(prev => prev + 1);
            }
        }
    };

    const handleUnequip = () => {
        if (selectedSlot?.type === 'equipment' && engineRef.current) {
            const success = engineRef.current.player.unequipItem(selectedSlot.slot);
            if (success) {
                setSelectedSlot(null);
                setUpdateTrigger(prev => prev + 1);
            }
        }
    };

    const handleTransferItem = () => {
        if (!engineRef.current || !currentChestPos) return;
        
        const chestInventory = engineRef.current.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z);
        if (!chestInventory) return;

        if (selectedSlot?.type === 'inventory') {
            // Move from player to chest
            const item = engineRef.current.player.inventory[selectedSlot.index];
            if (item) {
                // Find empty slot in chest
                const emptySlot = chestInventory.findIndex(i => i === null);
                if (emptySlot !== -1) {
                    chestInventory[emptySlot] = item;
                    engineRef.current.player.inventory[selectedSlot.index] = null;
                    setSelectedSlot(null);
                    setUpdateTrigger(prev => prev + 1);
                }
            }
        } else if (selectedSlot?.type === 'chest') {
            // Move from chest to player
            const item = chestInventory[selectedSlot.index];
            if (item) {
                // Find empty slot in player inventory
                const emptySlot = engineRef.current.player.inventory.findIndex(i => i === null);
                if (emptySlot !== -1) {
                    engineRef.current.player.inventory[emptySlot] = item;
                    chestInventory[selectedSlot.index] = null;
                    setSelectedSlot(null);
                    setUpdateTrigger(prev => prev + 1);
                }
            }
        }
    };

    const handleOfferItem = () => {
        if (!shrineSelectedDeity || !engineRef.current || selectedSlot?.type !== 'inventory') return;
        const item = engineRef.current.player.inventory[selectedSlot.index];
        if (!item) return;

        // Consume item
        if (item.quantity && item.quantity > 1) {
            item.quantity--;
        } else {
            engineRef.current.player.inventory[selectedSlot.index] = null;
            setSelectedSlot(null);
        }

        if (!engineRef.current.player.deityStandings[shrineSelectedDeity]) {
            engineRef.current.player.deityStandings[shrineSelectedDeity] = { standing: 0, favored: false, blessings: [] };
        }
        
        let standingGain = 0;
        
        // Define affinities
        const natureGods = ['FUNGAL WARPED', 'DI', 'SYLVARI'];
        const warGods = ['TELUM', 'RIULIRI'];
        const magicGods = ['ARCANIS', 'UMBRIX', 'DORIM', 'UMBI'];
        const wealthGods = ['RANA', 'PRIMORDIAL', 'FIDIRI'];
        
        if (item.category === 'WEAPON' || item.category === 'ARMOR') {
            standingGain = warGods.includes(shrineSelectedDeity) ? 15 : -5;
        } else if (item.id === 'magic_core' || item.id?.startsWith('book_')) {
            standingGain = magicGods.includes(shrineSelectedDeity) ? 20 : (natureGods.includes(shrineSelectedDeity) ? -10 : 2);
        } else if (item.id === 'gold_ingot' || item.id === 'ruby' || item.id === 'emerald' || item.id === 'black_diamond') {
            standingGain = wealthGods.includes(shrineSelectedDeity) ? 25 : 5;
        } else if (item.id === 'wood' || item.id === 'stone' || item.id === 'red_berry' || item.id === 'blue_berry' || item.id?.endsWith('_meat')) {
            standingGain = natureGods.includes(shrineSelectedDeity) ? 10 : -2;
        } else if (item.id === 'magma_core') {
            standingGain = shrineSelectedDeity === 'RAGI' || shrineSelectedDeity === 'TELUM' ? 30 : -10;
        } else {
            standingGain = 1; // Generic small offering
        }
        
        engineRef.current.player.deityStandings[shrineSelectedDeity].standing += standingGain;
        
        if (engineRef.current.player.onMessage) {
            if (standingGain > 10) engineRef.current.player.onMessage(`${shrineSelectedDeity} is greatly pleased by the offering!`);
            else if (standingGain > 0) engineRef.current.player.onMessage(`${shrineSelectedDeity} accepts your offering.`);
            else if (standingGain < 0) engineRef.current.player.onMessage(`${shrineSelectedDeity} is offended by this offering!`);
        }
        
        // Cap
        if (engineRef.current.player.deityStandings[shrineSelectedDeity].standing > 100) {
            engineRef.current.player.deityStandings[shrineSelectedDeity].standing = 100;
        }
        if (engineRef.current.player.deityStandings[shrineSelectedDeity].standing < -100) {
            engineRef.current.player.deityStandings[shrineSelectedDeity].standing = -100;
        }

        // Check favored status
        if (engineRef.current.player.deityStandings[shrineSelectedDeity].standing >= 50) {
            if (!engineRef.current.player.deityStandings[shrineSelectedDeity].favored) {
                engineRef.current.player.deityStandings[shrineSelectedDeity].favored = true;
                if (engineRef.current.player.onMessage) {
                    engineRef.current.player.onMessage(`You are now FAVORED by ${shrineSelectedDeity}!`);
                }
            }
        } else {
            engineRef.current.player.deityStandings[shrineSelectedDeity].favored = false;
        }

        setUpdateTrigger(prev => prev + 1);
    };

    const handlePray = () => {
        if (!shrineSelectedDeity || !engineRef.current) return;
        
        // Costs 10 mana, gives +1 standing
        if (engineRef.current.player.mana >= 10) {
            engineRef.current.player.mana -= 10;
            if (!engineRef.current.player.deityStandings[shrineSelectedDeity]) {
                engineRef.current.player.deityStandings[shrineSelectedDeity] = { standing: 0, favored: false, blessings: [] };
            }
            engineRef.current.player.deityStandings[shrineSelectedDeity].standing += 1;
            
            // Cap at 100
            if (engineRef.current.player.deityStandings[shrineSelectedDeity].standing > 100) {
                engineRef.current.player.deityStandings[shrineSelectedDeity].standing = 100;
            }
            
            if (engineRef.current.player.deityStandings[shrineSelectedDeity].standing >= 50) {
                engineRef.current.player.deityStandings[shrineSelectedDeity].favored = true;
            }
            
            setUpdateTrigger(prev => prev + 1);
        }
    };

    useEffect(() => {
        setSelectedSlot(null);
    }, [activeTab, isChestOpen, activeShrinePos]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const engine = new Engine(canvasRef.current);
        engineRef.current = engine;
        
        engine.events.on('HUD_UPDATE', (data: any) => {
            setHud(prev => ({ ...prev, ...data }));
        });
        
        engine.events.on('PLAYER_DEATH', () => {
            setHud(prev => ({ ...prev, isDead: true }));
            setTimeout(() => {
                setHud(prev => ({ ...prev, isDead: false }));
            }, 3000);
        });
        
        engine.onPauseToggle = () => {
            if (gameStateRef.current !== 'PLAYING') return;
            setIsPaused(prev => !prev);
        };
        engine.onOpenChest = (x, y, z) => {
            if (gameStateRef.current !== 'PLAYING') return;
            setCurrentChestPos({x, y, z});
            setIsChestOpen(true);
            setIsPaused(true);
        };
        engine.onInteractNPC = (npc) => {
            if (gameStateRef.current !== 'PLAYING') return;
            engine.restockNPC(npc);
            npc.state = 'TALKING';
            setCurrentNPC(npc);
            setIsNPCChatOpen(true);
            setIsPaused(true);
        };
        engine.onOpenShrine = (x, y, z) => {
            if (gameStateRef.current !== 'PLAYING') return;
            setActiveShrinePos({x, y, z});
            setIsPaused(true);
        };
        engine.onOpenPortalMenu = (color) => {
            if (gameStateRef.current !== 'PLAYING') return;
            setActivePortalMenu(color);
            setIsPaused(true);
        };
        engine.onOpenArcaneGate = () => {
            if (gameStateRef.current !== 'PLAYING') return;
            setIsArcaneGateOpen(true);
            setIsPaused(true);
        };
        (window as any).openArcaneGateMenu = engine.onOpenArcaneGate;
        ThemeManager.loadSavedTheme();
            engine.start();

        const handleFullscreenChange = () => {
            setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement));
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);

        return () => {
            engine.stop();
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameState !== 'PLAYING') return;
            if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
                setIsPaused(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState]);

    useEffect(() => {
        if (!activePortalMenu) return;
        setPortalSelectedIndex(0);

        let animationFrameId: number;
        let prevA = false;
        let prevB = false;
        let prevX = false;
        let prevUp = false;
        let prevDown = false;
        let prevLeft = false;
        let prevRight = false;
        let prevLB = false;
        let prevRB = false;

        // Initialize prev states to prevent input bleed from the button press that opened the menu
        const initialGamepads = navigator.getGamepads();
        for (const gp of initialGamepads) {
            if (gp) {
                if (gp.buttons[0]?.pressed) prevA = true;
                if (gp.buttons[1]?.pressed) prevB = true;
                if (gp.buttons[2]?.pressed) prevX = true;
                if (gp.buttons[12]?.pressed || gp.axes[1] < -0.5) prevUp = true;
                if (gp.buttons[13]?.pressed || gp.axes[1] > 0.5) prevDown = true;
                if (gp.buttons[14]?.pressed || gp.axes[0] < -0.5) prevLeft = true;
                if (gp.buttons[15]?.pressed || gp.axes[0] > 0.5) prevRight = true;
                if (gp.buttons[4]?.pressed) prevLB = true;
                if (gp.buttons[5]?.pressed) prevRB = true;
            }
        }

        const pollGamepad = () => {
            const gamepads = navigator.getGamepads();
            for (const gp of gamepads) {
                if (!gp) continue;
                
                const aPressed = gp.buttons[0]?.pressed; // A button
                const bPressed = gp.buttons[1]?.pressed; // B button
                const xPressed = gp.buttons[2]?.pressed; // X button
                const upPressed = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
                const downPressed = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;

                if (upPressed && !prevUp) {
                    if (activePortalMenu) {
                        setPortalSelectedIndex(prev => Math.max(0, prev - 1));
                    } else if (isChestOpen) {
                        if (selectedSlot?.type === 'inventory') {
                            setSelectedSlot({ type: 'chest', index: selectedSlot.index });
                        }
                    }
                }

                if (downPressed && !prevDown) {
                    if (activePortalMenu && engineRef.current) {
                        const availablePortals = Object.entries(engineRef.current.player.portals).filter(([color]) => color !== activePortalMenu);
                        setPortalSelectedIndex(prev => Math.min(availablePortals.length - 1, prev + 1));
                    } else if (isChestOpen) {
                        if (selectedSlot?.type === 'chest') {
                            setSelectedSlot({ type: 'inventory', index: selectedSlot.index });
                        }
                    }
                }
                
                const leftPressed = gp.buttons[14]?.pressed || gp.axes[0] < -0.5;
                const rightPressed = gp.buttons[15]?.pressed || gp.axes[0] > 0.5;
                const lbPressed = gp.buttons[4]?.pressed;
                const rbPressed = gp.buttons[5]?.pressed;
                
                if (lbPressed && !prevLB) {
                    if (activeShrinePos || isChestOpen) {
                        if (selectedSlot?.type === 'inventory') {
                            const newIndex = Math.max(0, selectedSlot.index - 1);
                            setSelectedSlot({ type: 'inventory', index: newIndex });
                        } else {
                            setSelectedSlot({ type: 'inventory', index: 0 });
                        }
                    }
                }

                if (rbPressed && !prevRB) {
                    if (activeShrinePos || isChestOpen) {
                        if (selectedSlot?.type === 'inventory') {
                            const newIndex = Math.min(39, selectedSlot.index + 1);
                            setSelectedSlot({ type: 'inventory', index: newIndex });
                        } else {
                            setSelectedSlot({ type: 'inventory', index: 0 });
                        }
                    }
                }

                if (leftPressed && !prevLeft) {
                    if (activeShrinePos) {
                        const currentIndex = shrineSelectedDeity ? DEITIES.findIndex(d => d.name === shrineSelectedDeity) : 0;
                        const newIndex = Math.max(0, currentIndex - 1);
                        setShrineSelectedDeity(DEITIES[newIndex].name);
                    }
                }
                
                if (rightPressed && !prevRight) {
                    if (activeShrinePos) {
                        const currentIndex = shrineSelectedDeity ? DEITIES.findIndex(d => d.name === shrineSelectedDeity) : -1;
                        const newIndex = Math.min(DEITIES.length - 1, currentIndex + 1);
                        setShrineSelectedDeity(DEITIES[newIndex].name);
                    }
                }

                if (aPressed && !prevA) {
                    // Teleport to selected portal
                    if (activePortalMenu && engineRef.current) {
                        const availablePortals = Object.entries(engineRef.current.player.portals).filter(([color]) => color !== activePortalMenu) as [string, {x: number, y: number, z: number, planet?: string}][];
                        const dest = availablePortals[portalSelectedIndexRef.current];
                        if (dest) {
                            if (dest[1].planet && dest[1].planet !== engineRef.current.world.activePlanet) {
                                engineRef.current.resetWorld(dest[1].planet);
                            }
                            engineRef.current.player.x = dest[1].x;
                            engineRef.current.player.y = dest[1].y;
                            engineRef.current.player.z = dest[1].z;
                            setActivePortalMenu(null);
                            setIsPaused(false);
                        }
                    } else if (activeShrinePos && shrineSelectedDeity) {
                        // Pray
                        handlePray();
                    }
                }
                
                if (bPressed && !prevB) {
                    // Close menus
                    if (activePortalMenu) {
                        setActivePortalMenu(null);
                        setIsPaused(false);
                    } else if (isArcaneGateOpen) {
                        setIsArcaneGateOpen(false);
                        setIsPaused(false);
                    } else if (isChestOpen) {
                        setIsChestOpen(false);
                        setIsPaused(false);
                    } else if (activeShrinePos) {
                        setActiveShrinePos(null);
                        setShrineSelectedDeity(null);
                        setIsPaused(false);
                    } else if (isNPCChatOpen) {
                        if (currentNPC) currentNPC.state = 'IDLE';
                        setIsNPCChatOpen(false);
                        setCurrentNPC(null);
                        setIsPaused(false);
                    } else if (isShopOpen) {
                        if (currentNPC) currentNPC.state = 'IDLE';
                        setIsShopOpen(false);
                        setCurrentNPC(null);
                        setIsPaused(false);
                    } else if (isPaused) {
                        setIsPaused(false);
                    }
                }

                if (xPressed && !prevX) {
                    // Dispel portal
                    if (activePortalMenu && engineRef.current) {
                        delete engineRef.current.player.portals[activePortalMenu];
                        setActivePortalMenu(null);
                        setIsPaused(false);
                    } else if (activeShrinePos && shrineSelectedDeity && selectedSlot?.type === 'inventory') {
                        // Offer Item
                        handleOfferItem();
                    } else if (isChestOpen && selectedSlot) {
                        handleTransferItem();
                    }
                }

                prevA = aPressed;
                prevB = bPressed;
                prevX = xPressed;
                prevUp = upPressed;
                prevDown = downPressed;
                prevLeft = leftPressed;
                prevRight = rightPressed;
                prevLB = lbPressed;
                prevRB = rbPressed;
            }
            animationFrameId = requestAnimationFrame(pollGamepad);
        };

        animationFrameId = requestAnimationFrame(pollGamepad);
        return () => cancelAnimationFrame(animationFrameId);
    }, [activePortalMenu, isArcaneGateOpen, isChestOpen, activeShrinePos, isPaused]);

    useEffect(() => {
        if (engineRef.current) {
            engineRef.current.paused = isPaused || gameState !== 'PLAYING';
            if (!isPaused && gameState === 'PLAYING') {
                setIsChestOpen(false);
                setActivePortalMenu(null);
                setIsArcaneGateOpen(false);
            }
        }
    }, [isPaused, gameState]);

    const toggleFullscreen = () => {
        const docElCap = document.documentElement as any;
        if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).mozFullScreenElement) {
            const requestFS = docElCap.requestFullscreen || docElCap.webkitRequestFullscreen || docElCap.mozRequestFullScreen || docElCap.msRequestFullscreen;
            if (requestFS) {
                const promise = requestFS.call(docElCap);
                if (promise) {
                    promise.catch((err: Error) => {
                        console.error(`Error attempting to enable fullscreen: ${err.message}`);
                        if (engineRef.current && engineRef.current.player && engineRef.current.player.onMessage) {
                            engineRef.current.player.onMessage("Fullscreen blocked. Try opening in a New Tab.");
                        }
                    });
                } else {
                    // For browsers that don't return a promise from webkitRequestFullscreen
                    setTimeout(() => {
                        if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
                            if (engineRef.current && engineRef.current.player && engineRef.current.player.onMessage) {
                                engineRef.current.player.onMessage("Fullscreen blocked. Try opening in a New Tab.");
                            }
                        }
                    }, 500);
                }
            } else {
                if (engineRef.current && engineRef.current.player && engineRef.current.player.onMessage) {
                    engineRef.current.player.onMessage("Fullscreen not supported by this browser.");
                }
            }
        } else {
            const docCap = document as any;
            const exitFS = docCap.exitFullscreen || docCap.webkitExitFullscreen || docCap.mozCancelFullScreen || docCap.msExitFullscreen;
            if (exitFS) {
                exitFS.call(docCap);
            }
        }
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-black relative">
            <canvas ref={canvasRef} className="block w-full h-full" />
            
            <div id="death-screen" className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-red-600 font-bold text-6xl pointer-events-none transition-opacity duration-1000 z-50 ${hud.isDead ? 'opacity-100' : 'opacity-0'}`}>
                <div style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>YOU DIED</div>
                <div className="text-white text-xl mt-4 font-normal">Respawning...</div>
            </div>

            {/* Sandstorm Effect Overlay */}
            {hud.activeBoss?.name === 'The Sphinx' && hud.activeBoss.state === 'ATTACK_SANDSTORM' && (
                <div className="absolute inset-0 bg-[#daa520]/20 pointer-events-none mix-blend-color-burn z-[40]" style={{ animation: 'sandstorm 0.5s infinite alternate' }}>
                    <style>{`
                        @keyframes sandstorm {
                            0% { opacity: 0.8; transform: scale(1.02) translateX(-10px); }
                            100% { opacity: 1; transform: scale(1.0) translateX(10px); }
                        }
                        .scanline {
                            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(218, 165, 32, 0.2) 50%, rgba(218, 165, 32, 0.2));
                            background-size: 100% 4px;
                            animation: scrollDown 10s linear infinite;
                        }
                        @keyframes scrollDown {
                            from { background-position: 0 0; }
                            to { background-position: 0 100%; }
                        }
                    `}</style>
                    <div className="scanline absolute inset-0"></div>
                </div>
            )}

            {/* Atmospheric Boss Vignette */}
            {hud.activeBoss && (
                <div 
                    className="absolute inset-0 pointer-events-none z-[30] transition-opacity duration-1000" 
                    style={{ 
                        opacity: 0.6,
                        background: hud.activeBoss.name === 'The Sphinx' ? 'radial-gradient(circle, transparent 40%, rgba(218,165,32,0.6) 120%)' :
                                   hud.activeBoss.name === 'Fire Dragon' ? 'radial-gradient(circle, transparent 40%, rgba(255,69,0,0.6) 120%)' : 'none'
                    }}
                ></div>
            )}

            {/* Boss Bar */}
            {hud.activeBoss && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-96 flex flex-col items-center pointer-events-none z-[60]">
                    <div className="text-red-500 font-serif font-bold text-lg mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest">
                        {hud.activeBoss.name.toUpperCase()}
                    </div>
                    <div className="w-full h-4 bg-[#0f0805] border-2 border-[#5c3a21] shadow-[0_0_10px_rgba(255,0,0,0.5)] relative">
                        <div className="h-full bg-red-600 border-r border-red-800 transition-all duration-300 ease-out" style={{ width: `${Math.max(0, (hud.activeBoss.health / hud.activeBoss.maxHealth) * 100)}%` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-80">
                            <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md pb-[1px]">{Math.floor(hud.activeBoss.health)} / {hud.activeBoss.maxHealth}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Display */}
            {hud.locationName && (
                <div className="absolute top-2 right-2 pointer-events-none select-none z-[50]">
                    <div className="text-white font-serif font-bold text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide bg-gradient-to-b from-[#fcd34d] to-[#b45309] text-transparent bg-clip-text" style={{ WebkitTextStroke: '0.5px #451a03' }}>
                        {hud.locationName.toUpperCase()}
                    </div>
                </div>
            )}

            {/* Top UI Overlay */}
            <div className="absolute top-2 left-2 pointer-events-none select-none bg-[#1a0f0a] border-2 border-[#5c3a21] p-1 shadow-2xl rounded-sm">
                <div className="border border-[#8b5a33] p-1 bg-[#2a1b14] flex flex-row items-start gap-1">
                    {/* Left Slots (Equipped) */}
                    <div className="flex gap-1">
                        <div className="w-6 h-6 bg-[#0f0805] border border-[#4a2e1b] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center text-[10px] relative">
                            <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            ⚔️
                        </div>
                        <div className="w-12 h-6 bg-[#0f0805] border border-[#4a2e1b] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center text-[10px] relative">
                            <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                            <span className="mr-1">🛡️</span> <span className="text-gray-300 font-bold">{hud.defense}</span>
                        </div>
                    </div>

                    {/* Status Bars */}
                    <div className="flex flex-col gap-1 w-24">
                        {/* Level Text */}
                        <div className="text-[10px] text-yellow-500 font-bold text-center leading-none drop-shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95" onClick={() => { setIsPaused(true); setActiveTab('TALENTS'); }}>
                            Lvl {hud.level}
                        </div>
                        {/* Health Bar */}
                        <div className="h-2.5 bg-[#0f0805] border border-[#4a2e1b] w-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative group">
                            <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                            <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                            <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                            <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                            <div className="h-full bg-red-600 border-r border-red-800 transition-all duration-100 ease-out" style={{ width: `${Math.max(0, (hud.health / hud.maxHealth) * 100)}%` }}></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                <span className="text-[8px] font-bold text-white shadow-black drop-shadow-md">{Math.floor(hud.health)}/{Math.floor(hud.maxHealth)}</span>
                            </div>
                        </div>
                        {/* Magica & Stamina Bars */}
                        <div className="flex gap-1 w-full">
                            <div className="h-2.5 bg-[#0f0805] border border-[#4a2e1b] flex-1 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative group">
                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="h-full bg-blue-600 border-r border-blue-800 transition-all duration-100 ease-out" style={{ width: `${(hud.mana / hud.maxMana) * 100}%` }}></div>
                            </div>
                            <div className="h-2.5 bg-[#0f0805] border border-[#4a2e1b] flex-1 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative group">
                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50 z-10"></div>
                                <div className="h-full bg-green-600 border-r border-green-800 transition-all duration-100 ease-out" style={{ width: `${(hud.stamina / hud.maxStamina) * 100}%` }}></div>
                            </div>
                        </div>
                        {/* XP Bar */}
                        <div className="h-1.5 bg-[#0f0805] border border-[#4a2e1b] w-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative group">
                            <div className="h-full bg-yellow-500 border-r border-yellow-700 transition-all duration-100 ease-out" style={{ width: `${(hud.xp / hud.xpToNextLevel) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Quick Use Slots */}
                    <div className="flex gap-1">
                        {[0, 1].map((i) => {
                            const item = engineRef.current?.player.quickSlots[i];
                            return (
                                <div key={i} className="w-8 h-8 bg-[#0f0805] border border-[#4a2e1b] shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative flex items-center justify-center cursor-pointer hover:border-orange-500/50"
                                    onClick={() => {
                                        if (engineRef.current) {
                                            if (i === 0) engineRef.current.input.triggerQuickSlot1();
                                            else if (i === 1) engineRef.current.input.triggerQuickSlot2();
                                            else if (i === 2) engineRef.current.input.triggerQuickSlot3();
                                        }
                                    }}
                                >
                                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                                    <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                                    <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                                    <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-[#5c3a21] rounded-full opacity-50"></div>
                                    
                                    {/* Key hints */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-[#8b5a33] font-bold">
                                        {i === 0 ? 'LB' : 'RB'}
                                    </div>
                                    
                                    {item && (
                                        <div className="text-orange-200 text-[8px] font-bold text-center px-0.5 truncate w-full" style={{ textShadow: '1px 1px 1px black' }}>
                                            {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Portal Menu Overlay */}
            {activePortalMenu && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-8 overflow-hidden">
                    <div className="w-full max-w-md flex flex-col font-serif select-none" style={{ textShadow: '1px 1px 2px black' }}>
                        
                        {/* Title */}
                        <div className="flex justify-center gap-1 z-10 translate-y-2 pb-2 px-2 shrink-0">
                            <div 
                                className="px-8 pt-1 pb-2 border-2 text-xs font-bold tracking-widest bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-[#8b5a33] text-[#d4b499]"
                                style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
                            >
                                {activePortalMenu.toUpperCase()} PORTAL
                            </div>
                        </div>

                        {/* Menu Content */}
                        <div className="bg-[#1a0f0a] border-[4px] md:border-[8px] border-[#5c3a21] p-4 shadow-2xl relative rounded-sm flex flex-col gap-4">
                            <div className="text-center text-orange-200 text-sm md:text-base mb-2">
                                Select a destination or dispel this portal.
                            </div>

                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto no-scrollbar">
                                {engineRef.current && Object.entries(engineRef.current.player.portals)
                                    .filter(([color]) => color !== activePortalMenu)
                                    .map(([color, pos]: [string, any], index) => {
                                    const isSelected = index === portalSelectedIndex;
                                    return (
                                        <button
                                            key={color}
                                            onMouseEnter={() => setPortalSelectedIndex(index)}
                                            onClick={() => {
                                                if (engineRef.current) {
                                                    if (pos.planet && pos.planet !== engineRef.current.world.activePlanet) {
                                                        engineRef.current.resetWorld(pos.planet);
                                                    }
                                                    engineRef.current.player.x = pos.x;
                                                    engineRef.current.player.y = pos.y;
                                                    engineRef.current.player.z = pos.z;
                                                    setActivePortalMenu(null);
                                                    setIsPaused(false);
                                                }
                                            }}
                                            className={`w-full p-3 border-2 transition-colors flex justify-between items-center ${
                                                isSelected 
                                                ? 'bg-[#2a1b14] border-orange-500 text-orange-200' 
                                                : 'bg-[#0f0805] border-[#4a2e1b] text-orange-300 hover:border-orange-500 hover:bg-[#2a1b14]'
                                            }`}
                                        >
                                            <span className="font-bold">{color.toUpperCase()} PORTAL</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Teleport</span>
                                                {isSelected && <span className="bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded border border-gray-600">A</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                                {engineRef.current && Object.keys(engineRef.current.player.portals).length <= 1 && (
                                    <div className="text-center text-gray-500 italic py-4">No other active portals.</div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#5c3a21] flex flex-col gap-2">
                                <button
                                    onClick={() => {
                                        if (engineRef.current) {
                                            delete engineRef.current.player.portals[activePortalMenu];
                                            setActivePortalMenu(null);
                                            setIsPaused(false);
                                        }
                                    }}
                                    className="w-full p-3 bg-red-900/30 border-2 border-red-900 text-red-400 hover:bg-red-900/50 hover:border-red-500 transition-colors font-bold flex justify-between items-center"
                                >
                                    <span>DISPEL PORTAL</span>
                                    <span className="bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded border border-gray-600">X</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setActivePortalMenu(null);
                                        setIsPaused(false);
                                    }}
                                    className="w-full p-3 bg-[#0f0805] border-2 border-[#4a2e1b] text-gray-400 hover:border-gray-300 hover:bg-[#2a1b14] transition-colors flex justify-between items-center"
                                >
                                    <span>CLOSE</span>
                                    <span className="bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded border border-gray-600">B</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chest UI Overlay */}
            {isChestOpen && currentChestPos && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-8 overflow-hidden">
                    <div className="w-full max-w-6xl h-full flex flex-col font-serif select-none" style={{ textShadow: '1px 1px 2px black' }}>
                        
                        {/* Title */}
                        <div className="flex justify-center gap-1 z-10 translate-y-2 pb-2 px-2 shrink-0">
                            <div 
                                className="px-8 pt-1 pb-2 border-2 text-xs font-bold tracking-widest bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-[#8b5a33] text-[#d4b499]"
                                style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
                            >
                                STORAGE CHEST
                            </div>
                        </div>

                        {/* Split View */}
                        <div className="bg-[#1a0f0a] border-[4px] md:border-[8px] border-[#5c3a21] p-1 md:p-2 shadow-2xl relative rounded-sm flex-1 min-h-0 flex flex-col md:flex-row gap-2">
                            
                            {/* Chest Inventory */}
                            <div className="flex-1 border-2 border-[#8b5a33] p-1 md:p-2 bg-[#2a1b14] flex flex-col min-h-0">
                                <h3 className="text-orange-300 text-center text-xs md:text-sm mb-2 border-b border-[#5c3a21] pb-1">CHEST</h3>
                                <div className="grid grid-cols-5 gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner overflow-y-auto no-scrollbar flex-1">
                                    {engineRef.current?.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z)?.map((item, i) => {
                                        const isSelected = selectedSlot?.type === 'chest' && selectedSlot.index === i;
                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedSlot({type: 'chest', index: i})}
                                                className={`aspect-square bg-[#0f0805] border-2 ${isSelected ? 'border-orange-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-orange-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center justify-center`}
                                            >
                                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                
                                                {item && (
                                                    <div className="text-orange-200 text-[10px] md:text-xs font-bold text-center px-1 truncate w-full" style={{ textShadow: '1px 1px 1px black' }}>
                                                        {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                                        {item.quantity && item.quantity > 1 && (
                                                            <span className="absolute bottom-0.5 right-1 text-white font-bold text-[8px] md:text-[10px]">
                                                                x{item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Player Inventory */}
                            <div className="flex-1 border-2 border-[#8b5a33] p-1 md:p-2 bg-[#2a1b14] flex flex-col min-h-0">
                                <h3 className="text-orange-300 text-center text-xs md:text-sm mb-2 border-b border-[#5c3a21] pb-1">YOUR INVENTORY</h3>
                                <div className="grid grid-cols-5 gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner overflow-y-auto no-scrollbar flex-1">
                                    {engineRef.current?.player.inventory.slice(0, engineRef.current.player.inventoryCapacity).map((item, i) => {
                                        const isSelected = selectedSlot?.type === 'inventory' && selectedSlot.index === i;
                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedSlot({type: 'inventory', index: i})}
                                                className={`aspect-square bg-[#0f0805] border-2 ${isSelected ? 'border-orange-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-orange-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center justify-center`}
                                            >
                                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                
                                                {item && (
                                                    <div className="text-orange-200 text-[10px] md:text-xs font-bold text-center px-1 truncate w-full" style={{ textShadow: '1px 1px 1px black' }}>
                                                        {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                                        {item.quantity && item.quantity > 1 && (
                                                            <span className="absolute bottom-0.5 right-1 text-white font-bold text-[8px] md:text-[10px]">
                                                                x{item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Panel */}
                        <div className="mt-1 md:mt-2 h-20 md:h-24 bg-[#1a0f0a] border-[4px] md:border-[8px] border-[#5c3a21] relative rounded-sm shrink-0">
                            <div className="absolute inset-1 border-2 border-[#8b5a33] bg-[#2a1b14] shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] flex items-center justify-between px-4">
                                <div className="flex-1 text-xs md:text-sm">
                                    {selectedSlot?.type === 'inventory' && engineRef.current?.player.inventory[selectedSlot.index] && (
                                        <span style={{ color: engineRef.current.player.inventory[selectedSlot.index]?.rarity ? RARITY_COLORS[engineRef.current.player.inventory[selectedSlot.index]!.rarity!] : '#fdba74' }}>Selected: {engineRef.current.player.inventory[selectedSlot.index]?.name}</span>
                                    )}
                                    {selectedSlot?.type === 'chest' && engineRef.current?.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z)?.[selectedSlot.index] && (
                                        <span style={{ color: engineRef.current.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z)?.[selectedSlot.index]?.rarity ? RARITY_COLORS[engineRef.current.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z)![selectedSlot.index]!.rarity!] : '#fdba74' }}>Selected: {engineRef.current.world.getChest(currentChestPos.x, currentChestPos.y, currentChestPos.z)?.[selectedSlot.index]?.name}</span>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleTransferItem}
                                        disabled={!selectedSlot || (selectedSlot.type !== 'inventory' && selectedSlot.type !== 'chest')}
                                        className="px-6 py-2 bg-gradient-to-b from-orange-600 to-red-900 border-2 border-orange-400 text-orange-100 font-bold text-xs md:text-sm hover:from-orange-500 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(234,88,12,0.4)]"
                                    >
                                        TRANSFER
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsChestOpen(false);
                                            setIsPaused(false);
                                        }}
                                        className="px-6 py-2 bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-2 border-[#8b5a33] text-[#d4b499] font-bold text-xs md:text-sm hover:text-orange-200 hover:from-[#7c4a2a]"
                                    >
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Shrine UI Overlay */}
            {activeShrinePos && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 md:p-8 overflow-hidden">
                    <div className="w-full max-w-6xl h-full flex flex-col font-serif select-none" style={{ textShadow: '1px 1px 2px black' }}>
                        
                        {/* Title */}
                        <div className="flex justify-center gap-1 z-10 translate-y-2 pb-2 px-2 shrink-0">
                            <div 
                                className="px-8 pt-1 pb-2 border-2 text-xs font-bold tracking-widest bg-gradient-to-b from-yellow-700 to-yellow-900 border-yellow-500 text-yellow-100"
                                style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
                            >
                                SACRED SHRINE
                            </div>
                        </div>

                        {/* Split View */}
                        <div className="bg-[#1a0f0a] border-[4px] md:border-[8px] border-yellow-900 p-1 md:p-2 shadow-2xl relative rounded-sm flex-1 min-h-0 flex flex-col md:flex-row gap-2">
                            
                            {/* Deity Selection & Info */}
                            <div className="flex-1 border-2 border-yellow-700 p-1 md:p-2 bg-[#2a1b14] flex flex-col min-h-0">
                                <h3 className="text-yellow-400 text-center text-xs md:text-sm mb-2 border-b border-yellow-900 pb-1">COMMUNE WITH THE GODS</h3>
                                
                                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
                                    {/* Deity List (Horizontal Scroll) */}
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
                                        {DEITIES.map(deity => {
                                            const isSelected = shrineSelectedDeity === deity.name;
                                            return (
                                                <div 
                                                    key={deity.name}
                                                    onClick={() => setShrineSelectedDeity(deity.name)}
                                                    className={`px-3 py-2 border-2 cursor-pointer whitespace-nowrap text-xs md:text-sm font-bold transition-colors ${isSelected ? 'border-yellow-400 bg-yellow-900/50 text-yellow-200' : 'border-[#4a2e1b] bg-[#0f0805] text-gray-400 hover:border-yellow-700 hover:text-yellow-500'}`}
                                                >
                                                    {deity.name}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Selected Deity Info */}
                                    {shrineSelectedDeity ? (() => {
                                        const deity = DEITIES.find(d => d.name === shrineSelectedDeity);
                                        const standingData = engineRef.current?.player.deityStandings[shrineSelectedDeity] || { standing: 0, favored: false, blessings: [] };
                                        const isFavored = standingData.favored;
                                        const isUnfavored = standingData.standing < -50;

                                        return (
                                            <div className="flex-1 flex flex-col bg-[#0f0805] border border-[#3a2214] p-4 relative">
                                                <div className="text-center mb-4">
                                                    <h2 className={`text-xl md:text-3xl font-bold ${isFavored ? 'text-yellow-400' : isUnfavored ? 'text-red-500' : 'text-[#d4c4a8]'}`}>{deity?.name}</h2>
                                                    <p className="text-gray-500 text-xs md:text-sm italic mt-1">{deity?.description}</p>
                                                </div>

                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[#8b5a33] text-xs uppercase tracking-widest">Current Standing</span>
                                                    <span className={`font-bold text-lg ${standingData.standing > 0 ? 'text-green-400' : standingData.standing < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                        {standingData.standing > 0 ? '+' : ''}{standingData.standing}
                                                    </span>
                                                </div>

                                                {/* Standing Bar */}
                                                <div className="w-full h-3 bg-black border border-[#3a2214] mb-4 relative overflow-hidden">
                                                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#5c3a21] z-10"></div>
                                                    {standingData.standing > 0 && (
                                                        <div className="absolute top-0 bottom-0 left-1/2 bg-green-600/80" style={{ width: `${Math.min(50, (standingData.standing / 100) * 50)}%` }}></div>
                                                    )}
                                                    {standingData.standing < 0 && (
                                                        <div className="absolute top-0 bottom-0 right-1/2 bg-red-600/80" style={{ width: `${Math.min(50, (Math.abs(standingData.standing) / 100) * 50)}%` }}></div>
                                                    )}
                                                </div>

                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {standingData.blessings.map((blessing, idx) => (
                                                            <span key={idx} className="text-[10px] px-2 py-1 bg-yellow-900/30 text-yellow-200 border border-yellow-700/50 rounded-sm">
                                                                {blessing}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {isFavored && <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest animate-pulse">Favored</span>}
                                                    {isUnfavored && <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Unfavored</span>}
                                                </div>

                                                <div className="mt-auto flex gap-2 justify-center">
                                                    <button 
                                                        onClick={handlePray}
                                                        className="px-8 py-3 bg-gradient-to-b from-blue-800 to-blue-900 border-2 border-blue-500 text-blue-100 font-bold hover:from-blue-700 hover:to-blue-800 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                                    >
                                                        PRAY (10 Mana)
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })() : (
                                        <div className="flex-1 flex items-center justify-center text-[#8b5a33] italic">
                                            Select a deity to commune with...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Player Inventory */}
                            <div className="flex-1 border-2 border-[#8b5a33] p-1 md:p-2 bg-[#2a1b14] flex flex-col min-h-0">
                                <h3 className="text-orange-300 text-center text-xs md:text-sm mb-2 border-b border-[#5c3a21] pb-1">YOUR INVENTORY</h3>
                                <div className="grid grid-cols-5 gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner overflow-y-auto no-scrollbar flex-1">
                                    {engineRef.current?.player.inventory.slice(0, engineRef.current.player.inventoryCapacity).map((item, i) => {
                                        const isSelected = selectedSlot?.type === 'inventory' && selectedSlot.index === i;
                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => setSelectedSlot({type: 'inventory', index: i})}
                                                className={`aspect-square bg-[#0f0805] border-2 ${isSelected ? 'border-yellow-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-yellow-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center justify-center`}
                                            >
                                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                
                                                {item && (
                                                    <div className="text-orange-200 text-[10px] md:text-xs font-bold text-center px-1 truncate w-full" style={{ textShadow: '1px 1px 1px black' }}>
                                                        {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                                        {item.quantity && item.quantity > 1 && (
                                                            <span className="absolute bottom-0.5 right-1 text-white font-bold text-[8px] md:text-[10px]">
                                                                x{item.quantity}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Panel */}
                        <div className="mt-1 md:mt-2 h-20 md:h-24 bg-[#1a0f0a] border-[4px] md:border-[8px] border-yellow-900 relative rounded-sm shrink-0">
                            <div className="absolute inset-1 border-2 border-yellow-700 bg-[#2a1b14] shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] flex items-center justify-between px-4">
                                <div className="flex-1 text-yellow-200 text-xs md:text-sm">
                                    {selectedSlot?.type === 'inventory' && engineRef.current?.player.inventory[selectedSlot.index] && (
                                        <span>Selected: {engineRef.current.player.inventory[selectedSlot.index]?.name}</span>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={handleOfferItem}
                                        disabled={!selectedSlot || selectedSlot.type !== 'inventory' || !shrineSelectedDeity}
                                        className="px-6 py-2 bg-gradient-to-b from-yellow-600 to-yellow-900 border-2 border-yellow-400 text-yellow-100 font-bold text-xs md:text-sm hover:from-yellow-500 hover:to-yellow-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                                    >
                                        OFFER ITEM
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setActiveShrinePos(null);
                                            setShrineSelectedDeity(null);
                                            setIsPaused(false);
                                        }}
                                        className="px-6 py-2 bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-2 border-[#8b5a33] text-[#d4b499] font-bold text-xs md:text-sm hover:text-orange-200 hover:from-[#7c4a2a]"
                                    >
                                        LEAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Title Screens */}
            {gameState.startsWith('TITLE_') && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none font-serif">
                    <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
                        {gameState === 'TITLE_1' && (
                            <div className="flex flex-col items-center gap-8">
                                <h1 className="text-2xl md:text-4xl text-gray-300 tracking-widest">
                                    For the best experience, please play in Fullscreen.
                                </h1>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => {
                                            const docElCap = document.documentElement as any;
                                            if (!document.fullscreenElement && !(document as any).webkitFullscreenElement && !(document as any).mozFullScreenElement) {
                                                const requestFS = docElCap.requestFullscreen || docElCap.webkitRequestFullscreen || docElCap.mozRequestFullScreen || docElCap.msRequestFullscreen;
                                                if (requestFS) {
                                                    const promise = requestFS.call(docElCap);
                                                    if (promise) promise.catch(e => console.error(e));
                                                }
                                            }
                                            setGameState('TITLE_2');
                                        }}
                                        className="px-8 py-3 bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors tracking-widest"
                                    >
                                        ENTER FULLSCREEN & CONTINUE
                                    </button>
                                    <button 
                                        onClick={() => setGameState('TITLE_2')}
                                        className="px-8 py-3 bg-transparent border border-gray-800 text-gray-500 hover:text-gray-300 transition-colors tracking-widest"
                                    >
                                        CONTINUE
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {gameState === 'TITLE_2' && (
                            <div className="flex flex-col items-center gap-12">
                                <img src={new URL('./assets/images/deorum_logo_1782589787632.jpg', import.meta.url).href} alt="DEORUM ENTERTAINMENT" className="w-[80vw] max-w-[600px] shadow-2xl rounded-sm" />
                                <button 
                                    onClick={() => setGameState('TITLE_3')}
                                    className="px-8 py-2 text-gray-500 hover:text-white transition-colors tracking-widest text-sm"
                                >
                                    CONTINUE
                                </button>
                            </div>
                        )}

                        {gameState === 'TITLE_3' && (
                            <div className="flex flex-col items-center gap-12">
                                <h1 className="text-2xl md:text-4xl text-gray-400 tracking-[0.5em] font-light italic">
                                    PRESENTS
                                </h1>
                                <button 
                                    onClick={() => setGameState('TITLE_4')}
                                    className="px-8 py-2 text-gray-600 hover:text-gray-300 transition-colors tracking-widest text-sm"
                                >
                                    CONTINUE
                                </button>
                            </div>
                        )}

                        {gameState === 'TITLE_4' && (
                            <div className="flex flex-col items-center gap-16">
                                <h1 className="text-6xl md:text-9xl font-bold text-orange-500 tracking-widest" style={{ textShadow: '0 0 40px rgba(234,88,12,0.8), 0 0 10px rgba(255,255,255,0.5)' }}>
                                    DEORUM
                                </h1>
                                <button 
                                    onClick={() => setGameState('TITLE_5')}
                                    className="px-8 py-2 text-orange-900 hover:text-orange-400 transition-colors tracking-widest text-sm"
                                >
                                    CONTINUE
                                </button>
                            </div>
                        )}

                        {gameState === 'TITLE_5' && (
                            <div className="flex flex-col items-center gap-12">
                                <h1 className="text-3xl md:text-5xl text-orange-200 tracking-[0.4em] font-light" style={{ textShadow: '0 0 15px rgba(234,88,12,0.5)' }}>
                                    THE FIRST CHAPTER
                                </h1>
                                <button 
                                    onClick={() => setGameState('CREATION')}
                                    className="px-8 py-2 text-orange-900 hover:text-orange-400 transition-colors tracking-widest text-sm"
                                >
                                    CONTINUE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Character Creation Overlay */}
            {gameState === 'CREATION' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-1 md:p-2 overflow-hidden">
                    <div className="w-full max-w-6xl h-full flex flex-col font-serif select-none" style={{ textShadow: '1px 1px 2px black' }}>
                        
                        {/* Header */}
                        <div className="text-center mb-1">
                            <h1 className="text-xl md:text-3xl font-bold text-orange-400 tracking-widest" style={{ textShadow: '0 0 20px rgba(234,88,12,0.8)' }}>
                                CREATE YOUR HERO
                            </h1>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-start gap-1 z-10 translate-y-1 overflow-x-auto no-scrollbar pb-1 px-1 shrink-0">
                            {CREATION_TABS.map(tab => (
                                <div 
                                    key={tab}
                                    onClick={() => setCreationTab(tab)}
                                    className={`shrink-0 px-2 py-0.5 border-2 cursor-pointer text-[10px] md:text-xs font-bold tracking-widest transition-all flex items-center justify-center ${
                                        creationTab === tab 
                                        ? 'bg-gradient-to-b from-orange-600 to-red-950 border-orange-400 text-orange-100 shadow-[0_0_20px_rgba(234,88,12,0.6)] z-20 scale-105' 
                                        : 'bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-[#8b5a33] text-[#d4b499] hover:text-orange-200 hover:from-[#7c4a2a]'
                                    }`}
                                    style={{
                                        clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)',
                                        borderBottom: creationTab === tab ? '2px solid #fb923c' : 'none'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="bg-[#1a0f0a] border-[4px] md:border-[8px] border-[#5c3a21] p-1 md:p-2 shadow-2xl relative rounded-sm flex-1 min-h-0 flex flex-col">
                            <div className="border-2 border-[#8b5a33] p-2 md:p-4 bg-[#2a1b14] flex-1 min-h-0 overflow-y-auto no-scrollbar">
                                {creationTab === 'RACE' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Race</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {RACES.map(race => (
                                                <div 
                                                    key={race}
                                                    onClick={() => setSelectedRace(race)}
                                                    className={`p-1 md:p-2 border cursor-pointer transition-colors text-sm text-center ${
                                                        selectedRace === race 
                                                        ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
                                                        : 'bg-[#0f0805] border-[#4a2e1b] text-gray-400 hover:border-orange-700 hover:text-gray-200'
                                                    }`}
                                                >
                                                    {race}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {creationTab === 'COLOR' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Color</div>
                                        {!selectedRace ? (
                                            <div className="text-gray-500 italic p-4 text-center">Please select a Race first to see available colors.</div>
                                        ) : (
                                            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                                                {(RACE_COLORS[selectedRace] || ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000']).map((color, i) => (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`aspect-square rounded-full cursor-pointer transition-transform hover:scale-110 ${
                                                            selectedColor === color ? 'ring-4 ring-orange-500 scale-110 shadow-[0_0_15px_rgba(234,88,12,0.8)]' : 'ring-2 ring-[#4a2e1b]'
                                                        }`}
                                                        style={{ backgroundColor: color }}
                                                    ></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {creationTab === 'HOMEWORLD' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Homeworld</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
                                            {Object.entries(HOMEWORLDS).map(([homeworld, data]) => (
                                                <div 
                                                    key={homeworld}
                                                    onClick={() => {
                                                        setSelectedHomeworld(homeworld);
                                                        setSelectedZodiac(null); // Reset zodiac when homeworld changes
                                                    }}
                                                    className={`p-1 md:p-2 border cursor-pointer transition-colors ${
                                                        selectedHomeworld === homeworld 
                                                        ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
                                                        : 'bg-[#0f0805] border-[#4a2e1b] text-gray-400 hover:border-orange-700 hover:text-gray-200'
                                                    }`}
                                                >
                                                    <div className="font-bold text-orange-400 text-sm">{homeworld}</div>
                                                    <div className="text-[10px] md:text-xs mt-0.5 text-gray-500 leading-tight">{data.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {creationTab === 'STARTING PACK' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Starting Pack</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
                                            {STARTING_PACKS.map(pack => (
                                                <div 
                                                    key={pack.name}
                                                    onClick={() => setSelectedStartingPack(pack.name)}
                                                    className={`p-1 border cursor-pointer transition-colors ${
                                                        selectedStartingPack === pack.name 
                                                        ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
                                                        : 'bg-[#0f0805] border-[#4a2e1b] text-gray-400 hover:border-orange-700 hover:text-gray-200'
                                                    }`}
                                                >
                                                    <div className="font-bold text-orange-400 text-sm">{pack.name}</div>
                                                    <div className="text-[10px] md:text-xs mt-0.5 text-gray-500 leading-tight">
                                                        {pack.description}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {creationTab === 'ZODIAC' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Zodiac Sign</div>
                                        {!selectedHomeworld ? (
                                            <div className="text-gray-500 italic p-4 text-center">Please select a Homeworld first to see available Zodiac signs.</div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
                                                {HOMEWORLDS[selectedHomeworld].zodiacs.map(zodiac => (
                                                    <div 
                                                        key={zodiac}
                                                        onClick={() => setSelectedZodiac(zodiac)}
                                                        className={`p-2 border cursor-pointer transition-colors flex flex-col items-center justify-center ${
                                                            selectedZodiac === zodiac 
                                                            ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
                                                            : 'bg-[#0f0805] border-[#4a2e1b] text-gray-400 hover:border-orange-700 hover:text-gray-200'
                                                        }`}
                                                    >
                                                        <div className="font-bold text-center text-sm md:text-base text-orange-300">{zodiac}</div>
                                                        {selectedZodiac === zodiac && (
                                                            <div className="text-[10px] text-green-300 mt-1 text-center leading-tight">
                                                                {formatZodiacStats(zodiac)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {creationTab === 'PANTHEON' && (
                                    <div className="flex flex-col gap-2">
                                        <div className="text-orange-300 font-bold mb-2">Select your Deity</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2">
                                            {DEITIES.map(deity => (
                                                <div 
                                                    key={deity.name}
                                                    onClick={() => setSelectedDeity(deity.name)}
                                                    className={`p-1 border cursor-pointer transition-colors ${
                                                        selectedDeity === deity.name 
                                                        ? 'bg-orange-900/50 border-orange-500 text-orange-200 shadow-[0_0_10px_rgba(234,88,12,0.3)]' 
                                                        : 'bg-[#0f0805] border-[#4a2e1b] text-gray-400 hover:border-orange-700 hover:text-gray-200'
                                                    }`}
                                                >
                                                    <div className="font-bold text-orange-400 text-sm">{deity.name}</div>
                                                    <div className="text-[10px] md:text-xs mt-0.5 text-gray-500 leading-tight">{deity.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="mt-2 flex justify-center shrink-0">
                            <button 
                                onClick={() => {
                                    if (engineRef.current) {
                                        // Set homeworld
                                        const homeworldId = selectedHomeworld || 'HERAT';
                                        engineRef.current.resetWorld(homeworldId);
                                        
                                        // Re-apply player settings after reset
                                        engineRef.current.player.color = selectedColor || '#ffffff';
                                        if (selectedZodiac) {
                                            engineRef.current.player.starSign = selectedZodiac;
                                        }
                                        if (selectedRace) {
                                            engineRef.current.player.applyRacialBenefits(selectedRace);
                                        }
                                        engineRef.current.player.applyStartingPack(selectedStartingPack || STARTING_PACKS[0].name);
                                        
                                        if (selectedDeity) {
                                            engineRef.current.player.initDeity(selectedDeity);
                                        }

                                        // Add starting quest
                                        engineRef.current.player.quests = [{
                                            id: `start_${homeworldId}`,
                                            title: `Welcome to ${homeworldId}`,
                                            description: `Head South-East to find the capital city and speak to the King. The city begins around X: 16, Y: 16 blocks away.`,
                                            completed: false
                                        }];
                                    }
                                    setGameState('PLAYING');
                                }}
                                className="px-6 py-2 bg-gradient-to-b from-orange-600 to-red-900 border-2 border-orange-400 text-orange-100 font-bold text-sm tracking-widest hover:from-orange-500 hover:to-red-800 shadow-[0_0_20px_rgba(234,88,12,0.6)] transition-all transform hover:scale-105"
                                style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)' }}
                            >
                                START YOUR ADVENTURE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NPC Chat Overlay */}
            {isNPCChatOpen && currentNPC && engineRef.current && (
                <NPCChat 
                    npc={currentNPC} 
                    engine={engineRef.current}
                    locationName={hud.locationName}
                    onClose={() => {
                        currentNPC.state = 'IDLE';
                        setIsNPCChatOpen(false);
                        setCurrentNPC(null);
                        setIsPaused(false);
                    }} 
                    playerInventory={engineRef.current?.player.inventory || []}
                    onTrade={() => {
                        setIsNPCChatOpen(false);
                        setIsShopOpen(true);
                    }}
                    onGiveItem={(itemId) => {
                        if (engineRef.current && ITEMS[itemId]) {
                            engineRef.current.player.inventory.push({ ...ITEMS[itemId] });
                            setUpdateTrigger(prev => prev + 1);
                        }
                    }}
                    onHostile={() => {
                        if (currentNPC) {
                            currentNPC.disposition = -100;
                            currentNPC.state = 'COMBAT';
                        }
                        setIsNPCChatOpen(false);
                        setCurrentNPC(null);
                        setIsPaused(false);
                    }}
                />
            )}

            {/* Arcane Gate UI Overlay */}
            {isArcaneGateOpen && engineRef.current && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
                    <div className="w-full max-w-2xl bg-[#1a0f0a] border-4 border-indigo-900 shadow-[0_0_50px_rgba(75,0,130,0.6)] p-6">
                        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-6 drop-shadow-[0_0_10px_rgba(75,0,130,0.8)] tracking-widest">ARCANE GATE</h2>
                        <div className="text-center text-indigo-200 mb-8 max-w-md mx-auto italic opacity-80 uppercase text-sm">
                            The gateway pulses with astral energy, waiting for a Rune Key to chart a course through the void.
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto no-scrollbar pb-4 pr-2">
                            {(() => {
                                const keyIndex = engineRef.current!.player.inventory.findIndex(item => item && item.id === 'arcane_rune_key');
                                const hasKey = keyIndex !== -1;
                                
                                return PlanetRegistry.getAll().map((planet) => {
                                    const isCurrentWorld = planet.id === engineRef.current!.world.activePlanet;
                                    
                                    return (
                                        <div 
                                            key={planet.id} 
                                            className={`p-4 border-2 transition-all ${
                                                isCurrentWorld 
                                                ? 'bg-[#0f0805] border-gray-700 opacity-50 cursor-not-allowed'
                                                : hasKey
                                                    ? 'bg-[#0f0805] border-indigo-800 hover:border-indigo-400 hover:bg-[#2a1744] hover:shadow-[0_0_15px_rgba(75,0,130,0.5)] cursor-pointer'
                                                    : 'bg-[#0f0805] border-gray-800 opacity-70 cursor-not-allowed'
                                            }`}
                                            onClick={() => {
                                                if (!isCurrentWorld && hasKey && engineRef.current) {
                                                    const targetWorld = planet.id;
                                                    engineRef.current.resetWorld(targetWorld);
                                                    engineRef.current.player.x = 0;
                                                    engineRef.current.player.y = 0;
                                                    engineRef.current.player.z = engineRef.current.world.getElevation(0, 0) + 1;
                                                    
                                                    // Consume one key
                                                    const keyItem = engineRef.current.player.inventory[keyIndex];
                                                    if (keyItem && keyItem.quantity && keyItem.quantity > 1) {
                                                        keyItem.quantity -= 1;
                                                    } else {
                                                        engineRef.current.player.inventory[keyIndex] = null;
                                                    }
                                                    
                                                    setIsArcaneGateOpen(false);
                                                    setIsPaused(false);
                                                    setUpdateTrigger(prev => prev + 1);
                                                    
                                                    if (engineRef.current.player.onMessage) {
                                                        engineRef.current.player.onMessage(`Traveled to ${targetWorld}. Welcome.`);
                                                    }
                                                } else if (!hasKey && !isCurrentWorld && engineRef.current) {
                                                    engineRef.current.player.onMessage("You need an Arcane Rune Key.");
                                                }
                                            }}
                                        >
                                            <div className="font-bold text-indigo-300 text-lg">{planet.name}</div>
                                            <div className="text-gray-400 text-xs mt-1">{planet.description}</div>
                                            {isCurrentWorld && <div className="text-red-500 text-[10px] uppercase font-bold mt-2">You are already here</div>}
                                            {!isCurrentWorld && hasKey && <div className="text-indigo-500 text-[10px] uppercase font-bold mt-2 text-right">INSERT KEY</div>}
                                            {!isCurrentWorld && !hasKey && <div className="text-red-500 text-[10px] uppercase font-bold mt-2 text-right">KEY REQUIRED</div>}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                        
                        <div className="mt-8 flex justify-center">
                            <button 
                                onClick={() => {
                                    setIsArcaneGateOpen(false);
                                    setIsPaused(false);
                                }}
                                className="px-8 py-2 bg-[#0f0805] border-2 border-[#5c3a21] text-[#9e6b42] hover:bg-[#2a1b14] hover:text-orange-200 transition-colors font-bold tracking-wider text-sm"
                            >
                                CLOSE GATE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shop UI Overlay */}
            {isShopOpen && currentNPC && engineRef.current && (
                <ShopUI 
                    npc={currentNPC}
                    player={engineRef.current.player}
                    onClose={() => {
                        currentNPC.state = 'IDLE';
                        setIsShopOpen(false);
                        setCurrentNPC(null);
                        setIsPaused(false);
                    }}
                />
            )}

            {/* Pause Menu Overlay */}
            {isPaused && !isChestOpen && !activePortalMenu && !isArcaneGateOpen && !isNPCChatOpen && !isShopOpen && gameState === 'PLAYING' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-1 md:p-2 overflow-hidden">
                    <div className="w-full max-w-6xl h-full flex flex-col font-serif select-none" style={{ textShadow: '1px 1px 2px black' }}>
                        
                        {/* Tabs */}
                        <div className="flex justify-start gap-1 z-10 translate-y-1 overflow-x-auto no-scrollbar pb-1 px-1 shrink-0">
                            {TABS.map(tab => (
                                <div 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`shrink-0 px-2 py-0.5 border-2 cursor-pointer text-[10px] md:text-xs font-bold tracking-widest transition-all flex items-center justify-center ${
                                        activeTab === tab 
                                        ? 'bg-gradient-to-b from-orange-600 to-red-950 border-orange-400 text-orange-100 shadow-[0_0_20px_rgba(234,88,12,0.6)] z-20 scale-105' 
                                        : 'bg-gradient-to-b from-[#5c3a21] to-[#2a1b14] border-[#8b5a33] text-[#d4b499] hover:text-orange-200 hover:from-[#7c4a2a]'
                                    }`}
                                    style={{
                                        clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0% 100%)',
                                        borderBottom: activeTab === tab ? '2px solid #fb923c' : 'none'
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="bg-[#1a0f0a] border-2 md:border-4 border-[#5c3a21] p-1 shadow-2xl relative rounded-sm flex-1 min-h-0 flex flex-col">
                            {/* Inner metallic border effect */}
                            <div className="border border-[#8b5a33] p-1 md:p-2 bg-[#2a1b14] flex-1 min-h-0 overflow-y-auto no-scrollbar">
                                
                                {activeTab === 'CHARACTER' && engineRef.current && (
                                    <div className="flex flex-col md:flex-row gap-4 p-2 h-full">
                                        <div className="flex-1 bg-[#1a0f0a] border-2 border-[#5c3a21] p-4 flex flex-col gap-4 shadow-inner relative">
                                            <div className="text-center border-b-2 border-[#3a2214] pb-4 mb-2">
                                                <h2 className="text-xl md:text-3xl font-bold text-orange-200 tracking-widest drop-shadow-md">THE ADVENTURER</h2>
                                                <p className="text-[#8b5a33] text-xs md:text-sm tracking-widest uppercase font-bold mt-1">Level {engineRef.current.player.level}</p>
                                            </div>
                                            
                                            <div className="flex justify-center mb-2">
                                                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#0f0805] border-4 border-[#3a2214] shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center justify-center">
                                                    <div 
                                                        className="w-12 h-12 md:w-16 md:h-16" 
                                                        style={{ backgroundColor: engineRef.current.player.color, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', border: '2px solid white' }}
                                                    ></div>
                                                </div>
                                                <div className="bg-[#1a0f0a] border-2 border-[#5c3a21] p-2 flex flex-col items-center justify-center shadow-inner mt-2">
                                                    <span className="text-orange-400 font-bold text-sm tracking-widest">{engineRef.current.player.starSign || 'NO SIGN'}</span>
                                                    <span className="text-[#8b5a33] text-[10px] uppercase font-bold tracking-widest mt-1 text-center">
                                                        Zodiac Star Sign
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 mt-2 flex-1">
                                                <div className="bg-[#2a1b14] p-2 border border-[#4a2e1b] flex flex-col">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-orange-200 font-bold text-sm tracking-wider">EXPERIENCE</span>
                                                        <span className="text-orange-100 text-xs">{Math.floor(engineRef.current.player.xp)} / {engineRef.current.player.xpToNextLevel}</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-[#0f0805] overflow-hidden border border-[#1a0f0a]">
                                                        <div className="h-full bg-gradient-to-r from-orange-600 to-yellow-400" style={{ width: `${(engineRef.current.player.xp / engineRef.current.player.xpToNextLevel) * 100}%` }}></div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-[#2a1b14] p-2 border border-[#4a2e1b] flex flex-col justify-center items-center">
                                                        <span className="text-[#d4b499] text-[10px] uppercase font-bold tracking-widest mb-1">Health</span>
                                                        <span className="text-red-400 font-bold text-lg">{Math.floor(engineRef.current.player.health)} <span className="text-xs text-gray-500">/ {engineRef.current.player.effectiveMaxHealth}</span></span>
                                                    </div>
                                                    <div className="bg-[#2a1b14] p-2 border border-[#4a2e1b] flex flex-col justify-center items-center">
                                                        <span className="text-[#d4b499] text-[10px] uppercase font-bold tracking-widest mb-1">Mana</span>
                                                        <span className="text-blue-400 font-bold text-lg">{Math.floor(engineRef.current.player.mana)} <span className="text-xs text-gray-500">/ {engineRef.current.player.effectiveMaxMana}</span></span>
                                                    </div>
                                                    <div className="bg-[#2a1b14] p-2 border border-[#4a2e1b] flex flex-col justify-center items-center">
                                                        <span className="text-[#d4b499] text-[10px] uppercase font-bold tracking-widest mb-1">Stamina</span>
                                                        <span className="text-green-400 font-bold text-lg">{Math.floor(engineRef.current.player.stamina)} <span className="text-xs text-gray-500">/ {engineRef.current.player.effectiveMaxStamina}</span></span>
                                                    </div>
                                                    <div className="bg-[#2a1b14] p-2 border border-[#4a2e1b] flex flex-col justify-center items-center">
                                                        <span className="text-[#d4b499] text-[10px] uppercase font-bold tracking-widest mb-1">Defense</span>
                                                        <span className="text-gray-300 font-bold text-lg">{engineRef.current.player.getEquipmentStats().defense}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 bg-[#2a1b14] p-3 border border-[#4a2e1b] flex justify-between items-center">
                                                    <span className="text-[#d4b499] text-xs uppercase font-bold tracking-widest">Gold Wealth</span>
                                                    <span className="text-yellow-400 font-bold text-xl flex items-center gap-1">
                                                        🪙 {engineRef.current.player.inventory.filter(i => i?.id === 'gold_piece').reduce((sum, i) => sum + (i?.quantity || 1), 0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-[#1a0f0a] border-2 border-[#5c3a21] p-4 flex flex-col gap-4 shadow-inner">
                                            <h3 className="text-orange-300 font-bold tracking-widest border-b-2 border-[#3a2214] pb-2 mb-2">ATTRIBUTES & COMBAT</h3>
                                            
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Health Regen</span>
                                                    <span className="text-red-300 font-bold text-sm">+{engineRef.current.player.getEquipmentStats().healthRegen}/s</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Mana Regen</span>
                                                    <span className="text-blue-300 font-bold text-sm">+{engineRef.current.player.manaRegen + engineRef.current.player.getEquipmentStats().manaRegen}/s</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Stamina Regen</span>
                                                    <span className="text-green-300 font-bold text-sm">+{engineRef.current.player.staminaRegen}/s</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Lifesteal</span>
                                                    <span className="text-purple-400 font-bold text-sm">{engineRef.current.player.getEquipmentStats().lifesteal * 100}%</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Speed Bonus</span>
                                                    <span className="text-cyan-300 font-bold text-sm">+{engineRef.current.player.getEquipmentStats().speedBonus}</span>
                                                </div>
                                                <div className="flex justify-between items-center p-2 bg-[#2a1b14] border border-[#3a2214]">
                                                    <span className="text-[#d4b499] text-xs font-bold uppercase">Bonus Damage</span>
                                                    <span className="text-orange-400 font-bold text-sm">+{engineRef.current.player.getEquipmentStats().bonusDamage}</span>
                                                </div>
                                            </div>

                                            {Object.entries(engineRef.current.player.buffs).filter(([_, val]) => (val as number) > 0).length > 0 && (
                                                <div className="mt-2 text-[10px] bg-[#1a0f0a] border border-[#3a2214] p-2">
                                                    <div className="text-orange-400 font-bold mb-1 tracking-widest uppercase">Active Buffs</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(engineRef.current.player.buffs).filter(([_, val]) => (val as number) > 0).map(([key, val]) => (
                                                            <div key={key} className="bg-[#2a1b14] border border-[#4a2e1b] px-2 py-0.5 rounded text-[#d4b499]">
                                                                {key.toUpperCase()}: <span className="text-white">{Math.ceil(val as number)}s</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto">
                                                <h3 className="text-orange-300 text-xs font-bold tracking-widest border-b border-[#3a2214] pb-1 mb-2 mt-4">CURRENT WEAPON</h3>
                                                {engineRef.current.player.equipment['MAIN_HAND'] ? (
                                                    <div className="p-3 bg-gradient-to-r from-[#2a1b14] to-[#1a0f0a] border border-[#4a2e1b] flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#0f0805] border border-[#5c3a21] flex justify-center items-center text-xl shadow-inner">
                                                            ⚔️
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-orange-200 font-bold">{engineRef.current.player.equipment['MAIN_HAND'].name}</span>
                                                            <div className="flex gap-3 text-[10px] uppercase tracking-wider text-gray-400 mt-1">
                                                                <span>DMG: {(engineRef.current.player.equipment['MAIN_HAND'].damage || 0) + engineRef.current.player.getEquipmentStats().bonusDamage}</span>
                                                                <span>TYPE: {engineRef.current.player.equipment['MAIN_HAND'].damageType || 'PHYSICAL'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-[#0f0805] border border-[#3a2214] text-[#8b5a33] italic text-center text-sm">
                                                        Unarmed (No weapon equipped)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {activeTab === 'INVENTORY' && (
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-5 md:grid-cols-10 gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner">
                                            {engineRef.current?.player.inventory.slice(0, engineRef.current.player.inventoryCapacity).map((item, i) => {
                                                const isSelected = selectedSlot?.type === 'inventory' && selectedSlot.index === i;
                                                return (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => setSelectedSlot({type: 'inventory', index: i})}
                                                        className={`aspect-square bg-[#0f0805] border-2 ${isSelected ? 'border-orange-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-orange-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center justify-center`}
                                                    >
                                                        {/* Fake rivets in corners */}
                                                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        
                                                        {item && (
                                                            <div className="text-[10px] md:text-xs font-bold text-center px-1 truncate w-full" style={{ textShadow: '1px 1px 1px black', color: item.rarity ? RARITY_COLORS[item.rarity] : '#fdba74' }}>
                                                                {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                                                {item.quantity && item.quantity > 1 && (
                                                                    <span className="absolute bottom-0.5 right-1 text-white font-bold text-[8px] md:text-[10px]">
                                                                        x{item.quantity}
                                                                    </span>
                                                                )}
                                                                {item.defense && (
                                                                    <span className="absolute top-0.5 left-1 text-gray-400 font-bold text-[8px] md:text-[10px]">
                                                                        🛡️{item.defense}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-[#8b5a33] text-xs font-bold tracking-widest">QUICK SLOTS</div>
                                            <div className="flex gap-4">
                                                {[0, 1, 2].map((i) => {
                                                    const item = engineRef.current?.player.quickSlots[i];
                                                    return (
                                                        <div key={i} className="w-16 h-16 bg-[#0f0805] border-2 border-[#4a2e1b] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative flex items-center justify-center cursor-pointer hover:border-orange-500/50"
                                                            onClick={() => {
                                                                if (selectedSlot?.type === 'inventory' && engineRef.current) {
                                                                    const selectedItem = engineRef.current.player.inventory[selectedSlot.index];
                                                                    if (selectedItem) {
                                                                        engineRef.current.player.quickSlots[i] = selectedItem;
                                                                        setUpdateTrigger(prev => prev + 1);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <div className="absolute top-1 left-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                            <div className="absolute top-1 right-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                            <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                            
                                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-[#8b5a33] font-bold">
                                                                {i === 0 ? 'LB' : i === 1 ? 'RB' : 'TOUCH'}
                                                            </div>
                                                            
                                                            {item && (
                                                                <div className="text-xs font-bold text-center px-1 truncate w-full" style={{ textShadow: '1px 1px 1px black', color: item.rarity ? RARITY_COLORS[item.rarity] : '#fdba74' }}>
                                                                    {item.name ? (item.name.split(' ')[1] || item.name) : 'Unknown'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="text-gray-500 text-[10px] italic">Select an item above, then click a slot to assign</div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'EQUIPMENT' && (
                                    <div className="flex flex-col gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner">
                                        {EQUIPMENT_SLOTS.map((slot) => {
                                            const item = engineRef.current?.player.equipment[slot];
                                            const isSelected = selectedSlot?.type === 'equipment' && selectedSlot.slot === slot;
                                            return (
                                                <div 
                                                    key={slot}
                                                    onClick={() => setSelectedSlot({type: 'equipment', slot})}
                                                    className={`w-full h-10 md:h-14 bg-[#0f0805] border-2 ${isSelected ? 'border-orange-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-orange-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center px-2 md:px-4`}
                                                >
                                                    <span className="text-[#8b5a33] font-bold w-24 md:w-32 text-[10px] md:text-sm">{slot.replace('_', ' ')}</span>
                                                    <div className="flex-1 border-l border-[#3a2214] pl-2 md:pl-4 ml-2 md:ml-4 h-full flex items-center justify-between">
                                                        <span className="text-xs md:text-sm" style={{ color: item ? (item.rarity ? RARITY_COLORS[item.rarity] : '#fdba74') : '#4b5563', fontStyle: item ? 'normal' : 'italic' }}>
                                                            {item ? (item.name || 'Unknown') : 'Empty'}
                                                            {item && item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : ''}
                                                        </span>
                                                        {item && item.defense && (
                                                            <span className="text-gray-400 text-xs font-bold">
                                                                🛡️ {item.defense}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'SPELLS' && (
                                    <div className="flex flex-col gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner">
                                        {engineRef.current?.player.knownSpells.length === 0 && (
                                            <div className="text-gray-500 italic text-center py-4">No spells known. Find spell books to learn magic.</div>
                                        )}
                                        {engineRef.current?.player.knownSpells.map((spellId) => {
                                            const spell = SPELLS[spellId];
                                            const isSelected = selectedSlot?.type === 'spell' && selectedSlot.id === spellId;
                                            const isActive = engineRef.current?.player.activeSpell === spellId;
                                            return (
                                                <div 
                                                    key={spellId}
                                                    onClick={() => setSelectedSlot({type: 'spell', id: spellId})}
                                                    className={`w-full h-10 md:h-14 bg-[#0f0805] border-2 ${isSelected ? 'border-orange-500 bg-[#2a1b14]' : 'border-[#4a2e1b] hover:border-orange-500/50 hover:bg-[#1a0f0a]'} shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] transition-colors cursor-pointer relative flex items-center px-2 md:px-4`}
                                                >
                                                    <span className="text-[#8b5a33] font-bold w-24 md:w-32 text-[10px] md:text-sm">{spell ? spell.name : 'Unknown Spell'}</span>
                                                    <div className="flex-1 border-l border-[#3a2214] pl-2 md:pl-4 ml-2 md:ml-4 h-full flex items-center justify-between">
                                                        <span className="text-xs md:text-sm text-orange-200">
                                                            {spell ? `${spell.manaCost} Mana | ${spell.type === 'UTILITY' ? 'Utility' : `${spell.damageType} Damage`}` : 'Unknown'}
                                                        </span>
                                                        {isActive && <span className="text-green-400 text-xs font-bold">ACTIVE</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'TALENTS' && (
                                    <div className="flex flex-col h-full">
                                        <div className="text-yellow-500 font-bold mb-2 text-sm md:text-base border-b border-[#3a2214] pb-1">
                                            Skill Points: {engineRef.current?.player.skillPoints || 0}
                                        </div>
                                        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2">
                                            {Object.values(TALENTS).map(talent => {
                                                const currentLevel = engineRef.current?.player.talents[talent.id] || 0;
                                                const isMax = currentLevel >= talent.maxLevel;
                                                const nextLevelDesc = isMax ? talent.descriptions[talent.maxLevel - 1] : talent.descriptions[currentLevel];
                                                
                                                return (
                                                    <div key={talent.id} className="bg-[#0f0805] border border-[#4a2e1b] p-2 flex flex-col gap-1 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] relative">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[#d4c4a8] font-bold text-xs md:text-sm">{talent.name}</span>
                                                            <span className="text-yellow-600 text-[10px] md:text-xs">Lvl {currentLevel}/{talent.maxLevel}</span>
                                                        </div>
                                                        <div className="text-gray-400 text-[10px] md:text-xs leading-tight">
                                                            <span className={isMax ? "text-orange-400" : "text-gray-500"}>{isMax ? 'MAX LEVEL: ' : 'Next Level: '}</span> 
                                                            {nextLevelDesc}
                                                        </div>
                                                        {!isMax && (
                                                            <button 
                                                                className={`mt-1 py-1 px-2 text-[10px] md:text-xs font-bold border transition-colors ${
                                                                    (engineRef.current?.player.skillPoints || 0) > 0 
                                                                    ? 'bg-[#2a1810] border-[#5c3a21] text-yellow-500 hover:bg-[#3a2820] hover:text-yellow-400 cursor-pointer' 
                                                                    : 'bg-[#0f0805] border-[#2a1810] text-gray-600 cursor-not-allowed'
                                                                }`}
                                                                onClick={() => {
                                                                    if (engineRef.current?.player.upgradeTalent(talent.id)) {
                                                                        setUpdateTrigger(prev => prev + 1);
                                                                    }
                                                                }}
                                                                disabled={!(engineRef.current?.player.skillPoints && engineRef.current.player.skillPoints > 0)}
                                                            >
                                                                Upgrade
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'CRAFTING' && (
                                    <div className="flex flex-col gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner">
                                        {RecipeRegistry.getAll().filter(recipe => {
                                            if (recipe.requiresLearning && !engineRef.current?.player.learnedRecipes.includes(recipe.id)) {
                                                return false;
                                            }
                                            if (!recipe.requiredTalent) return true;
                                            const playerLevel = engineRef.current?.player.talents[recipe.requiredTalent.id] || 0;
                                            return playerLevel >= recipe.requiredTalent.level;
                                        }).map((recipe) => {
                                            let canCraft = true;
                                            for (const ing of recipe.ingredients) {
                                                if (!engineRef.current?.player.hasItem(ing.id, ing.quantity)) {
                                                    canCraft = false;
                                                    break;
                                                }
                                            }
                                            
                                            let stationMissing = false;
                                            if (recipe.requiredStation && engineRef.current) {
                                                if (!engineRef.current.player.isNearStation(recipe.requiredStation, engineRef.current.world)) {
                                                    canCraft = false;
                                                    stationMissing = true;
                                                }
                                            }

                                            return (
                                                <div 
                                                    key={recipe.id}
                                                    className={`w-full bg-[#0f0805] border-2 border-[#4a2e1b] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative flex flex-col p-2 md:p-4`}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[#d4c4a8] font-bold text-sm md:text-base">{recipe.name}</span>
                                                        <button 
                                                            className={`py-1 px-3 text-[10px] md:text-xs font-bold border transition-colors ${
                                                                canCraft 
                                                                ? 'bg-[#2a1810] border-[#5c3a21] text-yellow-500 hover:bg-[#3a2820] hover:text-yellow-400 cursor-pointer' 
                                                                : 'bg-[#0f0805] border-[#2a1810] text-gray-600 cursor-not-allowed'
                                                            }`}
                                                            onClick={() => {
                                                                if (canCraft && engineRef.current?.player.craftRecipe(recipe.id, engineRef.current.world)) {
                                                                    setUpdateTrigger(prev => prev + 1);
                                                                }
                                                            }}
                                                            disabled={!canCraft}
                                                        >
                                                            Craft
                                                        </button>
                                                    </div>
                                                    <div className="text-gray-400 text-[10px] md:text-xs mb-2">
                                                        {recipe.description}
                                                        {stationMissing && (
                                                            <span className="text-red-500 ml-2">(Requires {recipe.requiredStation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})</span>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {recipe.ingredients.map(ing => {
                                                            const hasIng = engineRef.current?.player.hasItem(ing.id, ing.quantity);
                                                            return (
                                                                <div key={ing.id} className={`text-[10px] md:text-xs px-2 py-1 border ${hasIng ? 'border-green-800 text-green-400 bg-green-900/20' : 'border-red-800 text-red-400 bg-red-900/20'}`}>
                                                                    {ing.quantity}x {ing.id}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'DEITY' && (
                                    <div className="flex flex-col gap-2 md:gap-4 bg-[#1a0f0a] p-2 md:p-4 border border-[#3a2214] shadow-inner h-full overflow-y-auto no-scrollbar">
                                        <div className="text-center mb-2 md:mb-4">
                                            <h2 className="text-orange-400 font-bold text-lg md:text-2xl tracking-widest" style={{ textShadow: '2px 2px 4px black' }}>THE PANTHEON</h2>
                                            <p className="text-[#8b5a33] text-xs md:text-sm italic">Your standing with the gods.</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                                            {DEITIES.map(deity => {
                                                const standingData = engineRef.current?.player.deityStandings[deity.name] || { standing: 0, favored: false, blessings: [] };
                                                const isFavored = standingData.favored;
                                                const isUnfavored = standingData.standing < -50; // Arbitrary threshold for unfavored
                                                
                                                return (
                                                    <div key={deity.name} className={`bg-[#0f0805] border-2 ${isFavored ? 'border-yellow-600' : isUnfavored ? 'border-red-900' : 'border-[#4a2e1b]'} p-2 md:p-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative flex flex-col gap-2`}>
                                                        {/* Corner rivets */}
                                                        <div className="absolute top-1 left-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute top-1 right-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute bottom-1 left-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                        <div className="absolute bottom-1 right-1 w-1 h-1 bg-[#5c3a21] rounded-full opacity-50"></div>

                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className={`font-bold text-sm md:text-base ${isFavored ? 'text-yellow-400' : isUnfavored ? 'text-red-500' : 'text-[#d4c4a8]'}`}>
                                                                    {deity.name}
                                                                </div>
                                                                <div className="text-[9px] md:text-[10px] text-gray-500 italic mt-0.5 leading-tight">
                                                                    {deity.description}
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0 ml-2">
                                                                <div className={`text-xs md:text-sm font-bold ${standingData.standing > 0 ? 'text-green-400' : standingData.standing < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                                                                    {standingData.standing > 0 ? '+' : ''}{standingData.standing}
                                                                </div>
                                                                <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-[#8b5a33]">Standing</div>
                                                            </div>
                                                        </div>

                                                        {/* Standing Bar */}
                                                        <div className="w-full h-1.5 md:h-2 bg-black border border-[#3a2214] mt-1 relative overflow-hidden">
                                                            {/* Center line */}
                                                            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#5c3a21] z-10"></div>
                                                            
                                                            {standingData.standing > 0 && (
                                                                <div 
                                                                    className="absolute top-0 bottom-0 left-1/2 bg-green-600/80" 
                                                                    style={{ width: `${Math.min(50, (standingData.standing / 100) * 50)}%` }}
                                                                ></div>
                                                            )}
                                                            {standingData.standing < 0 && (
                                                                <div 
                                                                    className="absolute top-0 bottom-0 right-1/2 bg-red-600/80" 
                                                                    style={{ width: `${Math.min(50, (Math.abs(standingData.standing) / 100) * 50)}%` }}
                                                                ></div>
                                                            )}
                                                        </div>

                                                        {/* Status & Blessings */}
                                                        <div className="flex justify-between items-end mt-1">
                                                            <div className="flex gap-1 flex-wrap">
                                                                {standingData.blessings.length > 0 ? (
                                                                    standingData.blessings.map((blessing, idx) => (
                                                                        <span key={idx} className="text-[8px] md:text-[10px] px-1 py-0.5 bg-yellow-900/30 text-yellow-200 border border-yellow-700/50 rounded-sm">
                                                                            {blessing}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-[8px] md:text-[10px] text-gray-600 italic">No active blessings</span>
                                                                )}
                                                            </div>
                                                            
                                                            {isFavored && <span className="text-[9px] md:text-[10px] font-bold text-yellow-500 uppercase tracking-widest animate-pulse">Favored</span>}
                                                            {isUnfavored && <span className="text-[9px] md:text-[10px] font-bold text-red-600 uppercase tracking-widest">Unfavored</span>}
                                                            {!isFavored && !isUnfavored && <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">Neutral</span>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'MOUNTS' && (
                                    <div className="flex flex-col gap-4 bg-[#1a0f0a] p-2 md:p-4 border border-[#3a2214] shadow-inner h-full overflow-y-auto no-scrollbar">
                                        <div className="text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Your Mounts</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {engineRef.current?.player.mounts?.map((mount: any, i: number) => (
                                                <div key={i} className="bg-[#0f0805] border-2 border-[#4a2e1b] p-4 flex flex-col gap-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative">
                                                    <div className="text-orange-300 font-bold text-xl">{mount.name}</div>
                                                    <div className="text-gray-400 text-sm">Type: {mount.type}</div>
                                                    <div className="text-gray-400 text-sm">Speed: {mount.speed}</div>
                                                    <div className="text-gray-400 text-sm">Jump: {mount.jumpPower}</div>
                                                    <div className="text-gray-400 text-sm">Stamina: {mount.maxStamina}</div>
                                                    <button 
                                                        className="mt-2 bg-[#3a2214] hover:bg-[#5c3a21] text-orange-200 py-1 px-2 border border-[#8b5a33] rounded-sm text-xs font-bold transition-colors"
                                                        onClick={() => {
                                                            if (engineRef.current) {
                                                                if (engineRef.current.player.activeMount?.id === mount.id) {
                                                                    engineRef.current.player.activeMount = null;
                                                                    engineRef.current.player.isMounted = false;
                                                                } else {
                                                                    engineRef.current.player.activeMount = mount;
                                                                    engineRef.current.player.isMounted = true;
                                                                }
                                                                setUpdateTrigger(prev => prev + 1);
                                                            }
                                                        }}
                                                    >
                                                        {engineRef.current?.player.activeMount?.id === mount.id ? 'DISMOUNT' : 'MOUNT'}
                                                    </button>
                                                </div>
                                            ))}
                                            {(!engineRef.current?.player.mounts || engineRef.current.player.mounts.length === 0) && (
                                                <div className="text-gray-500 italic col-span-full text-center py-8">You have no mounts. Craft a saddle and use it near a wild animal to tame it.</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'COMPANIONS' && (
                                    <div className="flex flex-col gap-4 bg-[#1a0f0a] p-2 md:p-4 border border-[#3a2214] shadow-inner h-full overflow-y-auto no-scrollbar">
                                        <div className="text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Your Companions ({engineRef.current?.player.companions?.length || 0})</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {engineRef.current?.player.companions?.map((companion: any, i: number) => (
                                                <div key={i} className="bg-[#0f0805] border-2 border-[#4a2e1b] p-4 flex flex-col gap-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative">
                                                    {engineRef.current?.player.activeCompanion?.id === companion.id && (
                                                        <div className="absolute top-2 right-2 flex gap-1">
                                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                        </div>
                                                    )}
                                                    <div className="text-orange-300 font-bold text-xl">{companion.name || companion.type} (Lv. {companion.level || 1})</div>
                                                    <div className="text-gray-400 text-sm">Type: {companion.type}</div>
                                                    <div className="mt-2 bg-[#3a2214] border border-[#5c3a21] p-2">
                                                        <div className="text-xs text-gray-400 mb-1">Health: {Math.floor(companion.health || companion.maxHealth)}/{companion.maxHealth}</div>
                                                        <div className="w-full h-1 bg-black overflow-hidden m-0 p-0 mb-2">
                                                            <div className="h-full bg-red-600" style={{ width: `${((companion.health || companion.maxHealth) / companion.maxHealth) * 100}%` }}></div>
                                                        </div>
                                                        <div className="text-xs text-blue-300 mb-1">XP: {Math.floor(companion.xp || 0)}/{(companion.level || 1) * 100}</div>
                                                        <div className="w-full h-1 bg-black overflow-hidden m-0 p-0">
                                                            <div className="h-full bg-blue-500" style={{ width: `${((companion.xp || 0) / ((companion.level || 1) * 100)) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-red-400 text-sm mt-1">Damage: {companion.damage}</div>
                                                    
                                                    {engineRef.current?.player.activeCompanion?.id === companion.id && (
                                                        <div className="flex flex-col gap-1 mt-2">
                                                            <div className="text-xs text-gray-400">Stance:</div>
                                                            <div className="flex gap-1">
                                                                {['AGGRESSIVE', 'DEFENSIVE', 'PASSIVE'].map((stance) => (
                                                                    <button
                                                                        key={stance}
                                                                        className={`flex-1 text-[10px] py-1 border ${companion.stance === stance || (!companion.stance && stance === 'AGGRESSIVE') ? 'bg-orange-600 border-orange-400 text-white font-bold' : 'bg-[#2a1204] border-[#4a2e1b] text-gray-400 hover:bg-[#3a2214]'}`}
                                                                        onClick={() => {
                                                                            if (engineRef.current) {
                                                                                companion.stance = stance;
                                                                                setUpdateTrigger(prev => prev + 1);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {stance.substring(0, 3)}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2 w-full mt-auto pt-2">
                                                        <button 
                                                            className="flex-1 bg-[#3a2214] hover:bg-[#5c3a21] text-orange-200 py-1 px-2 border border-[#8b5a33] rounded-sm text-xs font-bold transition-colors"
                                                            onClick={() => {
                                                                if (engineRef.current) {
                                                                    if (engineRef.current.player.inventory.some(i => i?.id === 'meat')) {
                                                                        engineRef.current.player.removeItem('meat', 1);
                                                                        companion.health = companion.maxHealth;
                                                                        engineRef.current.particles.push({
                                                                            x: engineRef.current.player.x, y: engineRef.current.player.y, z: engineRef.current.player.z + 1,
                                                                            text: 'Healed Companion!', color: '#00ff00',
                                                                            life: 2.0, maxLife: 2.0, vx: 0, vy: 0, vz: 1
                                                                        });
                                                                        setUpdateTrigger(prev => prev + 1);
                                                                    } else {
                                                                        engineRef.current.events.emit('HUD_UPDATE');
                                                                        // Could show toast but this is fine
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            FEED (1 Meat)
                                                        </button>
                                                        <button 
                                                            className="flex-1 bg-[#3a2214] hover:bg-[#5c3a21] text-orange-200 py-1 px-2 border border-[#8b5a33] rounded-sm text-xs font-bold transition-colors"
                                                            onClick={() => {
                                                                if (engineRef.current) {
                                                                    if (engineRef.current.player.activeCompanion?.id === companion.id) {
                                                                    // Unsummon logic
                                                                    const idx = engineRef.current.entities.findIndex((e: any) => e.id === companion.id);
                                                                    if (idx !== -1) {
                                                                        engineRef.current.entities.splice(idx, 1);
                                                                    }
                                                                    engineRef.current.player.activeCompanion = null;
                                                                } else {
                                                                    // Summon logic
                                                                    if (engineRef.current.player.activeCompanion) {
                                                                        // Remove old active companion from entities
                                                                        const oldId = engineRef.current.player.activeCompanion.id;
                                                                        const idx = engineRef.current.entities.findIndex((e: any) => e.id === oldId);
                                                                        if (idx !== -1) {
                                                                            engineRef.current.entities.splice(idx, 1);
                                                                        }
                                                                    }
                                                                    engineRef.current.player.activeCompanion = companion;
                                                                    // We will need to inject it into world entities if needed.
                                                                    companion.x = engineRef.current.player.x;
                                                                    companion.y = engineRef.current.player.y;
                                                                    companion.z = engineRef.current.player.z;
                                                                    companion.isCompanion = true;
                                                                    engineRef.current.entities.push(companion);
                                                                }
                                                                setUpdateTrigger(prev => prev + 1);
                                                            }
                                                        }}
                                                    >
                                                        {engineRef.current?.player.activeCompanion?.id === companion.id ? 'UNSUMMON' : 'SUMMON'}
                                                    </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!engineRef.current?.player.companions || engineRef.current.player.companions.length === 0) && (
                                                <div className="text-gray-500 italic col-span-full text-center py-8">You have no companions yet. Speak to Beast Tamers or defeat bosses to acquire them!</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'JOURNAL' && (
                                    <div className="flex flex-col gap-4 bg-[#1a0f0a] p-2 md:p-4 border border-[#3a2214] shadow-inner h-full overflow-y-auto no-scrollbar">
                                        <div className="text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Your Quests</div>
                                        <div className="flex flex-col gap-4">
                                            {engineRef.current?.player.quests?.map((quest: any, i: number) => (
                                                <div key={i} className={`bg-[#0f0805] border-2 ${quest.state === 'COMPLETED' ? 'border-green-800' : quest.state === 'TURNED_IN' ? 'border-gray-800 opacity-50' : 'border-[#4a2e1b]'} p-4 flex flex-col gap-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative`}>
                                                    <div className={`font-bold text-xl ${quest.state === 'COMPLETED' ? 'text-green-500' : quest.state === 'TURNED_IN' ? 'text-gray-500' : 'text-orange-300'}`}>{quest.title}</div>
                                                    <div className="text-gray-400 text-sm">{quest.description}</div>
                                                    {(quest.type === 'FETCH' || quest.type === 'DESTROY_SPAWNER') && quest.state !== 'TURNED_IN' && (
                                                        <div className="text-gray-300 text-xs mt-1">Progress: {quest.currentCount} / {quest.requiredCount}</div>
                                                    )}
                                                    <div className={`text-xs font-bold mt-2 ${quest.state === 'COMPLETED' ? 'text-green-600' : quest.state === 'TURNED_IN' ? 'text-gray-500' : 'text-orange-600'}`}>
                                                        {quest.state === 'COMPLETED' ? 'READY TO TURN IN' : quest.state === 'TURNED_IN' ? 'COMPLETED' : 'IN PROGRESS'}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!engineRef.current?.player.quests || engineRef.current.player.quests.length === 0) && (
                                                <div className="text-gray-500 italic text-center py-8">You have no active quests.</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                
                                {activeTab === 'SETTINGS' && (
                                    <div className="flex flex-col gap-4 bg-[#1a0f0a] p-2 md:p-4 border border-[#3a2214] shadow-inner h-full overflow-y-auto no-scrollbar">

                                        <div className="text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Game State</div>
                                        <div className="text-gray-400 text-xs md:text-sm mb-2">Save your progress offline in your browser.</div>
                                        
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => {
                                                    if (engineRef.current) {
                                                        const result = SaveManager.saveGame(engineRef.current);
                                                        engineRef.current.particles.push({
                                                            x: engineRef.current.player.x, y: engineRef.current.player.y, z: engineRef.current.player.z,
                                                            text: result, color: '#fb923c', life: 2.0, maxLife: 2.0, vy: -1
                                                        });
                                                    }
                                                }}
                                                className="flex-1 p-3 border-2 border-[#8b5a33] bg-[#2a1b14] hover:bg-[#3a2214] hover:border-orange-400 text-orange-200 font-bold transition-all"
                                            >
                                                SAVE GAME
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (engineRef.current) {
                                                        const result = SaveManager.loadGame(engineRef.current);
                                                        engineRef.current.particles.push({
                                                            x: engineRef.current.player.x, y: engineRef.current.player.y, z: engineRef.current.player.z,
                                                            text: result, color: '#32cd32', life: 2.0, maxLife: 2.0, vy: -1
                                                        });
                                                    }
                                                }}
                                                className="flex-1 p-3 border-2 border-[#8b5a33] bg-[#2a1b14] hover:bg-[#3a2214] hover:border-orange-400 text-orange-200 font-bold transition-all"
                                            >
                                                LOAD GAME
                                            </button>
                                        </div>

                                        <div className="mt-4 text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Texture Packs</div>
                                        <div className="text-gray-400 text-xs md:text-sm mb-2">Instantly change the entire color palette of the world.</div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(THEMES).map(([id, theme]) => (
                                                <button 
                                                    key={id}
                                                    onClick={() => {
                                                        ThemeManager.applyTheme(id);
                                                        // Force a redraw
                                                        if (engineRef.current) {
                                                            engineRef.current.particles.push({
                                                                x: engineRef.current.player.x, y: engineRef.current.player.y, z: engineRef.current.player.z,
                                                                text: 'Theme Applied!', color: '#fb923c', life: 2.0, maxLife: 2.0, vy: -1
                                                            });
                                                        }
                                                        // Using setCustomTexturePack just to force a React re-render of this button state
                                                        setCustomTexturePack(customTexturePack);
                                                    }}
                                                    className={`p-4 border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${ThemeManager.currentThemeId === id ? 'border-[#fb923c] bg-[#3a2214]' : 'border-[#4a2e1b] bg-[#0f0805] hover:border-[#8b5a33]'}`}
                                                >
                                                    <div className="font-bold text-orange-200">{theme.name}</div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="mt-8 text-orange-400 text-lg font-bold border-b border-[#5c3a21] pb-2">Community Pack</div>
                                        <div className="text-gray-400 text-xs md:text-sm mb-2">Paste a Base64 string from another player to apply their custom theme.</div>
                                        <div className="flex flex-col gap-2">
                                            <textarea 
                                                value={customTexturePack}
                                                onChange={(e) => setCustomTexturePack(e.target.value)}
                                                placeholder="Paste Base64 texture pack code here..."
                                                className="w-full bg-[#0f0805] border-2 border-[#4a2e1b] p-2 text-gray-300 font-mono text-xs h-24 focus:outline-none focus:border-[#fb923c]"
                                            />
                                            <button 
                                                onClick={() => {
                                                    if (customTexturePack.trim() !== '') {
                                                        ThemeManager.applyTheme('custom', customTexturePack);
                                                        if (engineRef.current) {
                                                            engineRef.current.particles.push({
                                                                x: engineRef.current.player.x, y: engineRef.current.player.y, z: engineRef.current.player.z,
                                                                text: 'Custom Pack Loaded!', color: '#fb923c', life: 2.0, maxLife: 2.0, vy: -1
                                                            });
                                                        }
                                                        setCustomTexturePack(customTexturePack); // Force re-render
                                                    }
                                                }}
                                                className="bg-[#2a1b14] border-2 border-[#4a2e1b] hover:border-[#fb923c] text-orange-300 font-bold py-2 w-full transition-colors"
                                            >
                                                Apply Custom Pack
                                            </button>
                                        </div>

                                    </div>
                                )}

                                {activeTab === 'MAP' && (
                                    <div className="flex flex-col items-center justify-center h-full bg-[#1a0f0a] border border-[#3a2214] p-8 shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
                                        <div className="text-orange-500 font-bold text-3xl tracking-widest text-center" style={{ textShadow: '2px 2px 4px black' }}>
                                            I FORGOT MY MAP
                                        </div>
                                    </div>
                                )}

                                {activeTab !== 'CHARACTER' && activeTab !== 'INVENTORY' && activeTab !== 'EQUIPMENT' && activeTab !== 'SPELLS' && activeTab !== 'TALENTS' && activeTab !== 'CRAFTING' && activeTab !== 'DEITY' && activeTab !== 'MOUNTS' && activeTab !== 'COMPANIONS' && activeTab !== 'JOURNAL' && activeTab !== 'SETTINGS' && activeTab !== 'MAP' && (
                                    <div className="grid grid-cols-5 md:grid-cols-10 gap-1 md:gap-2 bg-[#1a0f0a] p-1 md:p-2 border border-[#3a2214] shadow-inner">
                                        {/* Fallback empty grid for other tabs for now */}
                                        {[...Array(80)].map((_, i) => (
                                            <div key={i} className="aspect-square bg-[#0f0805] border-2 border-[#4a2e1b] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] relative">
                                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 left-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                                <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 md:w-1 md:h-1 bg-[#5c3a21] rounded-full opacity-50"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom Panel */}
                        {['INVENTORY', 'EQUIPMENT', 'SPELLS'].includes(activeTab) && (
                            <div className="mt-1 md:mt-2 h-28 md:h-32 bg-[#1a0f0a] border-[4px] md:border-[8px] border-[#5c3a21] relative rounded-sm shrink-0">
                            <div className="absolute inset-1 border-2 border-[#8b5a33] bg-[#2a1b14] shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] flex flex-col px-2 pt-2 pb-1 md:px-4 md:pt-4 md:pb-1.5 overflow-hidden">
                                {(() => {
                                    let selectedItem: Item | null = null;
                                    let selectedSpell = null;
                                    if (selectedSlot?.type === 'inventory') {
                                        selectedItem = engineRef.current?.player.inventory[selectedSlot.index] || null;
                                    } else if (selectedSlot?.type === 'equipment') {
                                        selectedItem = engineRef.current?.player.equipment[selectedSlot.slot] || null;
                                    } else if (selectedSlot?.type === 'spell') {
                                        selectedSpell = SPELLS[selectedSlot.id];
                                    }

                                    if (!selectedItem && !selectedSpell) {
                                        return (
                                            <div className="flex items-center justify-center h-full">
                                                <span className="text-[#8b5a33] italic tracking-widest text-xs md:text-base text-center">Select an item or spell to view details...</span>
                                            </div>
                                        );
                                    }

                                    if (selectedSpell) {
                                        return (
                                            <div className="flex flex-col h-full">
                                                <div className="flex justify-between items-start overflow-y-auto no-scrollbar pb-2">
                                                    <div>
                                                        <h3 className="text-orange-300 font-bold text-sm md:text-lg">{selectedSpell.name || 'Unknown Spell'}</h3>
                                                        <p className="text-[#d4b499] text-[10px] md:text-sm italic mt-1">{selectedSpell.description || 'No description'}</p>
                                                    </div>
                                                    <div className="text-right text-[10px] md:text-xs text-gray-400 flex flex-col gap-0.5 shrink-0 ml-4">
                                                        {selectedSpell.type !== 'UTILITY' && <div>DMG: <span className="text-white">{selectedSpell.damage} ({selectedSpell.damageType})</span></div>}
                                                        <div>MANA: <span className="text-blue-400">{selectedSpell.manaCost}</span></div>
                                                        <div>CD: <span className="text-white">{selectedSpell.cooldown}s</span></div>
                                                        {selectedSpell.castTime && <div>CAST: <span className="text-white">{selectedSpell.castTime}s</span></div>}
                                                    </div>
                                                </div>
                                                <div className="mt-auto flex gap-1 md:gap-2 overflow-x-auto no-scrollbar pt-1 shrink-0 border-t border-[#3a2214]">
                                                    <button onClick={() => {
                                                        if (engineRef.current) {
                                                            engineRef.current.player.activeSpell = selectedSpell.id;
                                                            setUpdateTrigger(prev => prev + 1);
                                                        }
                                                    }} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">SET AS ACTIVE</button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="flex flex-col h-full">
                                            <div className="flex justify-between items-start overflow-y-auto no-scrollbar pb-2">
                                                <div>
                                                    <h3 className="font-bold text-sm md:text-lg" style={{ color: selectedItem.rarity ? RARITY_COLORS[selectedItem.rarity] : '#fdba74' }}>{selectedItem.name || 'Unknown'}</h3>
                                                    {selectedItem.rarity && <div className="text-[10px] md:text-xs font-bold mt-0.5" style={{ color: RARITY_COLORS[selectedItem.rarity] }}>{selectedItem.rarity}</div>}
                                                    <p className="text-[#d4b499] text-[10px] md:text-sm italic mt-1">{selectedItem.description || 'No description'}</p>
                                                    {selectedItem.affixes && selectedItem.affixes.map((affix, idx) => (
                                                        <div key={idx} className="text-[#a3e635] text-[10px] md:text-xs mt-1">• {affix}</div>
                                                    ))}
                                                </div>
                                                {selectedItem.category === 'WEAPON' && (
                                                    <div className="text-right text-[10px] md:text-xs text-gray-400 flex flex-col gap-0.5 shrink-0 ml-4">
                                                        <div>DMG: <span className="text-white">{selectedItem.damage}</span></div>
                                                        <div>REACH: <span className="text-white">{selectedItem.reach}</span></div>
                                                        <div>SPD: <span className="text-white">{selectedItem.cooldown}s</span></div>
                                                        <div className="text-orange-400">{selectedItem.twoHanded ? 'Two-Handed' : 'One-Handed'}</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-auto flex gap-1 md:gap-2 overflow-x-auto no-scrollbar pt-1 shrink-0 border-t border-[#3a2214]">
                                                {selectedSlot?.type === 'inventory' && selectedItem.category === 'ARMOR' && selectedItem.equipmentSlot && (
                                                    <button onClick={() => handleEquip(selectedItem.equipmentSlot)} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">EQUIP</button>
                                                )}
                                                {selectedSlot?.type === 'inventory' && selectedItem.category === 'WEAPON' && !selectedItem.twoHanded && (
                                                    <>
                                                        <button onClick={() => handleEquip('MAIN_HAND')} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">EQUIP MAIN HAND</button>
                                                        <button onClick={() => handleEquip('OFF_HAND')} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">EQUIP OFF HAND</button>
                                                    </>
                                                )}
                                                {selectedSlot?.type === 'inventory' && selectedItem.category === 'WEAPON' && selectedItem.twoHanded && (
                                                    <button onClick={() => handleEquip('MAIN_HAND')} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">EQUIP</button>
                                                )}
                                                {selectedSlot?.type === 'inventory' && selectedItem.category === 'AMMO' && (
                                                    <button onClick={() => handleEquip('AMMO')} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">EQUIP AMMO</button>
                                                )}
                                                {selectedSlot?.type === 'equipment' && (
                                                    <button onClick={handleUnequip} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">UNEQUIP</button>
                                                )}
                                                {selectedSlot?.type === 'inventory' && (selectedItem.category === 'CONSUMABLE' && !selectedItem.id?.includes('seed') && !selectedItem.id?.includes('recipe') && selectedItem.id !== 'alchemy_table_recipe_scroll' && selectedItem.id !== 'rune_key_areth' && selectedItem.id !== 'rune_key_tarhe' && selectedItem.id !== 'bomb') && (
                                                    <button onClick={() => {
                                                        if (engineRef.current) {
                                                            const p = engineRef.current.player;
                                                            const original0 = p.quickSlots[0];
                                                            p.quickSlots[0] = p.inventory[selectedSlot.index];
                                                            const success = p.handleQuickSlot(0);
                                                            if (p.quickSlots[0] === null) {
                                                                p.inventory[selectedSlot.index] = null;
                                                                if (success) setSelectedSlot(null);
                                                            } else {
                                                                p.inventory[selectedSlot.index] = p.quickSlots[0];
                                                            }
                                                            p.quickSlots[0] = original0;
                                                            setUpdateTrigger(prev => prev + 1);
                                                        }
                                                    }} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">CONSUME</button>
                                                )}
                                                {selectedSlot?.type === 'inventory' && (selectedItem.spellId || selectedItem.spellIds || ITEMS[selectedItem.id]?.spellId || ITEMS[selectedItem.id]?.spellIds) && (
                                                    <button onClick={() => {
                                                        if (engineRef.current) {
                                                            engineRef.current.player.learnSpell(selectedSlot.index);
                                                            setSelectedSlot(null);
                                                            setIsPaused(false);
                                                            setUpdateTrigger(prev => prev + 1);
                                                        }
                                                    }} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">READ</button>
                                                )}
                                                {selectedSlot?.type === 'inventory' && (
                                                    <>
                                                        <button onClick={() => {
                                                            if (engineRef.current) {
                                                                const item = engineRef.current.player.inventory[selectedSlot.index];
                                                                if (item) {
                                                                    engineRef.current.dropItem(
                                                                        engineRef.current.player.x,
                                                                        engineRef.current.player.y,
                                                                        engineRef.current.player.z,
                                                                        item
                                                                    );
                                                                    engineRef.current.player.inventory[selectedSlot.index] = null;
                                                                    setSelectedSlot(null);
                                                                    setUpdateTrigger(prev => prev + 1);
                                                                }
                                                            }
                                                        }} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">DROP</button>
                                                        <button onClick={() => {
                                                            if (engineRef.current) {
                                                                engineRef.current.player.inventory[selectedSlot.index] = null;
                                                                setSelectedSlot(null);
                                                                setUpdateTrigger(prev => prev + 1);
                                                            }
                                                        }} className="px-2 py-0.5 md:px-3 md:py-1 bg-[#3a2214] border border-[#8b5a33] text-[#d4b499] text-[9px] md:text-[10px] font-bold hover:bg-[#5c3a21] hover:text-orange-200 transition-colors whitespace-nowrap">DESTROY</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            )}

            {!isFullscreen && (
                <button 
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-mono text-sm backdrop-blur-sm transition-colors cursor-pointer"
                >
                    Enter Full Screen
                </button>
            )}
        </div>
    );
}
