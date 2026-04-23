import { BLOCK_COLORS } from './Constants';

export type ThemeColors = Record<number, { r: number, g: number, b: number }>;

export const THEMES: Record<string, { name: string, colors: ThemeColors }> = {
    'classic': {
        name: 'Classic (Default)',
        colors: { ...BLOCK_COLORS } // Store the original colors
    },
    'fall': {
        name: 'Fall Earth Tones',
        colors: {} // We'll populate this below
    },
    'retro': {
        name: 'GameBoy Retro',
        colors: {}
    },
    'detailed_retro': {
        name: 'Detailed Retro',
        colors: {}
    },
    'neon': {
        name: 'Neon Synthwave',
        colors: {}
    },
    'dark': {
        name: 'Dark Fantasy',
        colors: {}
    },
    'detailed_dark': {
        name: 'Detailed Dark Fantasy',
        colors: {}
    },
    'pastel': {
        name: 'Cozy Pastel',
        colors: {}
    }
};

// Generate Fall Earth Tones - warmer, desaturated, autumnal modifications
const fallColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in fallColors) {
    const k = parseInt(key);
    const color = { ...fallColors[k] };
    
    // Shift greens (grass, leaves, bushes) to oranges/reds/browns
    if (color.g > color.r && color.g > color.b) {
        if (color.g > 100) { // bright greens
            color.r = Math.min(255, color.g + 50); // make it orange/red
            color.g = Math.floor(color.g * 0.6); // reduce green
            color.b = Math.floor(color.b * 0.4);
        } else { // dark greens (pine leaves)
            color.r = Math.min(255, color.g + 40);
            color.g = Math.floor(color.g * 0.5);
            color.b = Math.floor(color.b * 0.5);
        }
    } 
    // Shift blue water slightly more teal/grey for autumn chill
    else if (color.b > color.r && color.b > color.g) {
        color.r = Math.min(255, color.r + 20);
        color.g = Math.min(255, color.g + 40);
        color.b = Math.min(255, Math.floor(color.b * 0.9));
    }
    // Shift dirts/browns to warmer golden-brown
    else if (color.r > color.b && color.g < color.r && color.r < 200) {
        color.r = Math.min(255, color.r + 10);
        color.g = Math.min(255, color.g + 15);
    }
    fallColors[k] = color;
}
THEMES['fall'].colors = fallColors;

// Generate GameBoy Retro (4 colors: #0f380f, #306230, #8bac0f, #9bbc0f)
const gbPalette = [
    {r: 15, g: 56, b: 15},
    {r: 48, g: 98, b: 48},
    {r: 139, g: 172, b: 15},
    {r: 155, g: 188, b: 15}
];

const retroColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in retroColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    // Calculate brightness of original color
    const brightness = (orig.r * 0.299 + orig.g * 0.587 + orig.b * 0.114) / 255;
    
    // Map to one of the 4 gameboy colors based on brightness
    let idx = 0; // darkest
    if (brightness > 0.75) idx = 3;
    else if (brightness > 0.5) idx = 2;
    else if (brightness > 0.25) idx = 1;
    
    retroColors[k] = { ...gbPalette[idx] };
}
THEMES['retro'].colors = retroColors;

// Generate Neon Synthwave
const neonColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in neonColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    const color = { ...orig };

    if (orig.g > orig.r + 20) {
        // Greens to Neon Pink / Magenta
        color.r = Math.min(255, orig.g + 50);
        color.g = 20;
        color.b = Math.min(255, orig.g + 100);
    } else if (orig.b > orig.r + 20) {
        // Blues to Cyan
        color.r = 0;
        color.g = 255;
        color.b = 255;
    } else if (orig.r > 100 && orig.g < 100 && orig.b < 100) {
        // Reds to bright red
        color.r = 255;
        color.g = 0;
        color.b = 0;
    } else {
        // Everything else pushed towards dark blues/purples
        color.r = Math.floor(orig.r * 0.4);
        color.g = Math.floor(orig.g * 0.3);
        color.b = Math.floor(orig.b * 0.5) + 30;
    }
    neonColors[k] = color;
}
THEMES['neon'].colors = neonColors;


// Dark Fantasy (Grimdark desaturated)
const darkColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in darkColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    // Desaturate and darken
    const lum = (orig.r + orig.g + orig.b) / 3;
    darkColors[k] = {
        r: Math.floor(orig.r * 0.6 + lum * 0.4) * 0.6,
        g: Math.floor(orig.g * 0.6 + lum * 0.4) * 0.6,
        b: Math.floor(orig.b * 0.6 + lum * 0.4) * 0.6
    };
    
    // Water gets murky green-brown
    if (orig.b > orig.r + 30 && orig.b > orig.g + 30) {
        darkColors[k] = { r: 40, g: 60, b: 50 };
    }
    // Lava/fire remains bright, maybe redder
    if (orig.r > 150 && orig.g < 100) {
        darkColors[k].r = Math.min(255, orig.r * 1.2);
    }
}
THEMES['dark'].colors = darkColors;

// Detailed Retro (PICO-8 16-color palette)
const pico8Palette = [
    {r: 0, g: 0, b: 0}, {r: 29, g: 43, b: 83}, {r: 126, g: 37, b: 83}, {r: 0, g: 135, b: 81},
    {r: 171, g: 82, b: 54}, {r: 95, g: 87, b: 79}, {r: 194, g: 195, b: 199}, {r: 255, g: 241, b: 232},
    {r: 255, g: 0, b: 77}, {r: 255, g: 163, b: 0}, {r: 255, g: 236, b: 39}, {r: 0, g: 228, b: 54},
    {r: 41, g: 173, b: 255}, {r: 131, g: 118, b: 156}, {r: 255, g: 119, b: 168}, {r: 255, g: 204, b: 170}
];

const detailedRetroColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in detailedRetroColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    // Find closest color in PICO-8 palette
    let closestColor = pico8Palette[0];
    let minDist = Infinity;
    
    for (const pcolor of pico8Palette) {
        // Simple euclidean distance in RGB space
        const dist = Math.pow(orig.r - pcolor.r, 2) + Math.pow(orig.g - pcolor.g, 2) + Math.pow(orig.b - pcolor.b, 2);
        if (dist < minDist) {
            minDist = dist;
            closestColor = pcolor;
        }
    }
    detailedRetroColors[k] = { ...closestColor };
}
THEMES['detailed_retro'].colors = detailedRetroColors;


// Detailed Dark Fantasy (Dark, rich colors, high contrast)
const detailedDarkColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in detailedDarkColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    // Increase contrast: push darks darker, lights slightly brighter but desaturated
    const lum = (orig.r + orig.g + orig.b) / 3;
    const isDark = lum < 128;
    
    // Shift factor
    const factor = isDark ? 0.7 : 1.1; 
    
    // Shift hue slightly towards purple/red for dramatic gothic feel
    detailedDarkColors[k] = {
        r: Math.min(255, Math.max(0, Math.floor(orig.r * factor * 1.1))), // boost reds slightly
        g: Math.min(255, Math.max(0, Math.floor(orig.g * factor * 0.9))), // cut greens
        b: Math.min(255, Math.max(0, Math.floor(orig.b * factor * 1.05)))  // boost blues slightly
    };
    
    // Special case for Water (Deep abyss blue)
    if (orig.b > orig.r + 30 && orig.b > orig.g + 30) {
        detailedDarkColors[k] = { r: 10, g: 20, b: 60 };
    }
    // Lava/Fire (Vibrant crimson/orange stark against the darkness)
    if (orig.r > 150 && orig.g < 100) {
        detailedDarkColors[k] = { r: 255, g: 80, b: 20 };
    }
    // Poison/Acid/Swamp (Sickly bright green)
    if (orig.g > 150 && orig.r < 100 && orig.b < 100) {
        detailedDarkColors[k] = { r: 50, g: 180, b: 40 };
    }
}
THEMES['detailed_dark'].colors = detailedDarkColors;

// Cozy Pastel
const pastelColors: ThemeColors = { ...BLOCK_COLORS };
for (const key in pastelColors) {
    const k = parseInt(key);
    const orig = BLOCK_COLORS[k];
    
    // Mix with white to make pastels
    pastelColors[k] = {
        r: Math.floor((orig.r + 255 * 1.5) / 2.5),
        g: Math.floor((orig.g + 255 * 1.5) / 2.5),
        b: Math.floor((orig.b + 255 * 1.5) / 2.5)
    };
}
THEMES['pastel'].colors = pastelColors;

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
