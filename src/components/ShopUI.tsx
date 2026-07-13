import React, { useState, useEffect } from 'react';
import { NPC } from '../game/Engine';
import { Player } from '../game/Player';
import { ITEMS, TradeListing } from '../game/Inventory';

interface ShopUIProps {
    npc: NPC;
    player: Player;
    onClose: () => void;
}

export const ShopUI: React.FC<ShopUIProps> = ({ npc, player, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inventory = npc.tradeInventory || [];

    // Gamepad support
    useEffect(() => {
        let animationFrameId: number;
        let prevUp = false;
        let prevDown = false;
        let prevA = false;
        let prevB = false;

        const pollGamepad = () => {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[0];
            if (gp) {
                const upPressed = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
                const downPressed = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
                const aPressed = gp.buttons[0]?.pressed;
                const bPressed = gp.buttons[1]?.pressed;

                if (upPressed && !prevUp) {
                    setSelectedIndex(prev => Math.max(0, prev - 1));
                }
                if (downPressed && !prevDown) {
                    setSelectedIndex(prev => Math.min(inventory.length - 1, prev + 1));
                }
                if (aPressed && !prevA && inventory.length > 0) {
                    handleTrade(inventory[selectedIndex]);
                }
                if (bPressed && !prevB) {
                    onClose();
                }

                prevUp = upPressed;
                prevDown = downPressed;
                prevA = aPressed;
                prevB = bPressed;
            }
            animationFrameId = requestAnimationFrame(pollGamepad);
        };

        animationFrameId = requestAnimationFrame(pollGamepad);
        return () => cancelAnimationFrame(animationFrameId);
    }, [inventory, selectedIndex]);

    const getDiscountedCost = (cost: number) => {
        const tradingLevel = player.talents['trading'] || 0;
        if (tradingLevel === 0) return cost;
        let discount = 0;
        if (tradingLevel >= 1) discount = 0.30;
        if (player.hasFavoredDeity && player.hasFavoredDeity('RANA')) discount += 0.20;
        return Math.max(1, Math.ceil(cost * (1 - discount)));
    };

    const canAfford = (listing: TradeListing) => {
        for (const cost of listing.cost) {
            const playerHas = player.inventory.filter(i => i && i.id === cost.id).reduce((sum, i) => sum + (i!.quantity || 1), 0);
            if (playerHas < getDiscountedCost(cost.quantity)) return false;
        }
        return true;
    };

    const handleTrade = (listing: TradeListing) => {
        if (!canAfford(listing)) return;

        // Deduct cost
        for (const cost of listing.cost) {
            player.removeItem(cost.id, getDiscountedCost(cost.quantity));
        }

        // Give item
        const itemDef = ITEMS[listing.itemToGive.id];
        if (itemDef) {
            player.addToInventory({ ...itemDef, quantity: listing.itemToGive.quantity });
        }

        // Remove from NPC inventory
        const idx = npc.tradeInventory?.indexOf(listing);
        if (idx !== undefined && idx > -1) {
            npc.tradeInventory?.splice(idx, 1);
        }
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm pointer-events-auto select-none font-serif">
            <div className="w-[450px] max-h-[85vh] flex flex-col bg-[#1a0f0a] border-2 border-[#5c3a21] rounded-sm shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-b from-[#3e2718] to-[#1a0f0a] border-b-2 border-[#5c3a21] p-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0f0805] border border-[#5c3a21] flex items-center justify-center text-lg rounded-sm shrink-0">
                            💰
                        </div>
                        <h2 className="text-lg font-bold text-orange-400 leading-tight">Trade</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-[#d4b499] hover:text-orange-400 text-lg px-2 rounded hover:bg-[#2a1b14] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#0f0805]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4a2e1b #0f0805' }}>
                    {inventory.length === 0 ? (
                        <div className="text-center text-[#d4b499] italic p-4 text-sm bg-[#2a1b14] border border-[#4a2e1b] rounded-sm">
                            "I have nothing left to trade today. Come back tomorrow."
                        </div>
                    ) : (
                        inventory.map((listing, idx) => {
                            const itemDef = ITEMS[listing.itemToGive.id];
                            const affordable = canAfford(listing);
                            
                            return (
                                <div 
                                    key={idx}
                                    onClick={() => {
                                        setSelectedIndex(idx);
                                        handleTrade(listing);
                                    }}
                                    className={`flex justify-between items-center p-2 border rounded-sm transition-all cursor-pointer ${
                                        selectedIndex === idx 
                                            ? 'bg-[#3e2718] border-orange-500 shadow-[inset_0_0_8px_rgba(234,88,12,0.2)]' 
                                            : 'bg-[#1a0f0a] border-[#4a2e1b] hover:border-[#5c3a21]'
                                    } ${!affordable ? 'opacity-50' : ''}`}
                                >
                                    {/* Left: Item to receive */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#0f0805] border border-[#5c3a21] flex items-center justify-center text-base rounded-sm shrink-0">
                                            {itemDef?.name.charAt(0) || '?'}
                                        </div>
                                        <div className="leading-tight">
                                            <div className="text-orange-200 font-bold text-sm">
                                                {itemDef?.name || 'Unknown Item'}
                                                <span className="ml-1 text-orange-400/80 text-[10px]">x{listing.itemToGive.quantity}</span>
                                            </div>
                                            {listing.cost.length > 0 && (
                                                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                                    {listing.cost.map((c, cIdx) => {
                                                        const costDef = ITEMS[c.id];
                                                        const discountedQty = getDiscountedCost(c.quantity);
                                                        const playerHas = player.inventory.filter(i => i && i.id === c.id).reduce((sum, i) => sum + (i!.quantity || 1), 0);
                                                        const hasEnough = playerHas >= discountedQty;
                                                        return (
                                                            <div key={cIdx} className={`flex items-center gap-1 text-[10px] ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                                                                <span className="font-bold">{discountedQty}</span>
                                                                <span className="truncate max-w-[60px]" title={costDef?.name}>{costDef?.name || c.id}</span>
                                                                <span className="opacity-60">({playerHas})</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Buy action */}
                                    <div className="shrink-0 flex items-center justify-center w-6 text-center">
                                        <span className={`text-[10px] uppercase font-bold ${selectedIndex === idx ? 'text-orange-500' : 'text-transparent'}`}>
                                            BUY
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* Footer Guide */}
                <div className="bg-[#1a0f0a] border-t-2 border-[#5c3a21] p-1.5 flex justify-between text-[10px] text-[#d4b499] uppercase tracking-wider opacity-80 shrink-0">
                    <span>[D-Pad] Select</span>
                    <span>[A] Trade • [B] Close</span>
                </div>
            </div>
        </div>
    );
};
