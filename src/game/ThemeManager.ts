import { BLOCK_COLORS } from './Constants';
import { BlockType } from './constants/BlockType';

export type ThemeColors = Record<number, { r: number, g: number, b: number }>;

export const THEMES: Record<string, { name: string, colors: ThemeColors }> = {
    'classic': {
        name: 'Classic (Default)',
        colors: { ...BLOCK_COLORS } // Store the original colors
    },
    'zelda_sprites': {
        name: 'Retro Quest (Nearly Sprites)',
        colors: {}
    },
    'dark_fantasy_sprites': {
        name: 'Dark Fantasy (Nearly Sprites)',
        colors: {}
    }
};

// Retro Quest (Soft greens/browns, retro 8/16-bit vibe)
const zeldaColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in zeldaColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    if (orig.r > 150 && orig.g < 100 && orig.b < 100) { // bright red/lava
        zeldaColors[k] = { r: 216, g: 40, b: 0 };
    } else if (orig.g > orig.r && orig.g > orig.b) { // greens (grass/trees)
        zeldaColors[k] = { r: 60, g: 170, b: 60 }; // Zelda style grassy
    } else if (k === BlockType.WATER || k === BlockType.POISON_WATER || k === BlockType.SWAMP_WATER || (orig.b > Math.max(orig.r, orig.g) && k !== BlockType.BLUE_DIRT && k !== BlockType.BLUE_CLAY && k !== BlockType.BLUE_STONE)) { // water
        zeldaColors[k] = { r: 32, g: 60, b: 232 }; // Sharp blue water
    } else {
        // Stone and dirt to a warmer, softer beige/brown
        const lum = (orig.r + orig.g + orig.b) / 3;
        zeldaColors[k] = { 
            r: Math.floor(lum * 1.1 + 10), 
            g: Math.floor(lum * 0.95 + 5), 
            b: Math.floor(lum * 0.7) 
        };
    }
}
THEMES['zelda_sprites'].colors = zeldaColors;

// Dark Fantasy (Desaturated, dark, gritty, blood red accents)
const darkFantasyColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in darkFantasyColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    const lum = Math.floor((orig.r * 0.3 + orig.g * 0.59 + orig.b * 0.11));
    
    if (orig.r > 150 && orig.g < 80 && orig.b < 80) { // bright red/fire
        darkFantasyColors[k] = { r: 180, g: 10, b: 10 }; // dark blood red
    } else if (orig.g > orig.r && orig.g > orig.b) { // greens (grass/trees)
        darkFantasyColors[k] = { r: 30, g: 50, b: 30 }; // swampy green
    } else if (k === BlockType.WATER || k === BlockType.POISON_WATER || k === BlockType.SWAMP_WATER || (orig.b > Math.max(orig.r, orig.g) && k !== BlockType.BLUE_DIRT && k !== BlockType.BLUE_CLAY && k !== BlockType.BLUE_STONE)) { // water
        darkFantasyColors[k] = { r: 15, g: 25, b: 40 }; // deep dark water
    } else {
        // Stone and dirt to dark gritty greys/browns
        darkFantasyColors[k] = { 
            r: Math.floor(lum * 0.6), 
            g: Math.floor(lum * 0.5), 
            b: Math.floor(lum * 0.5) 
        };
    }
}
THEMES['dark_fantasy_sprites'].colors = darkFantasyColors;

export class ThemeManager {
    static currentThemeId: string = 'classic';
    static customPackStr: string = '';

    static applyTheme(themeId: string, customBase64?: string) {
        this.currentThemeId = themeId;
        
        let targetColors = THEMES['classic'].colors;

        if (customBase64) {
            try {
                const jsonStr = atob(customBase64);
                const parsed = JSON.parse(jsonStr);
                targetColors = parsed;
                this.customPackStr = customBase64;
                localStorage.setItem('antigravity_custom_pack', customBase64);
            } catch (e) {
                console.error("Failed to parse custom texture pack base64.", e);
                targetColors = THEMES[themeId]?.colors || THEMES['classic'].colors;
            }
        } else if (THEMES[themeId]) {
            targetColors = THEMES[themeId].colors;
        }

        // We MUST directly mutate the BLOCK_COLORS object so the Renderer sees it without refactoring imports
        for (const key in targetColors) {
            const k = parseInt(key);
            if (BLOCK_COLORS[k]) {
                BLOCK_COLORS[k].r = targetColors[k].r;
                BLOCK_COLORS[k].g = targetColors[k].g;
                BLOCK_COLORS[k].b = targetColors[k].b;
            } else {
                BLOCK_COLORS[k] = { ...targetColors[k] };
            }
        }

        localStorage.setItem('antigravity_theme', themeId);
    }

    static loadSavedTheme() {
        const saved = localStorage.getItem('antigravity_theme');
        const custom = localStorage.getItem('antigravity_custom_pack') || undefined;
        if (saved) {
            this.applyTheme(saved, saved === 'custom' ? custom : undefined);
        } else {
            // Apply classic initially strictly to fill out missing blocks if we need to?
            // Already loaded from Constants.
        }
    }
}
