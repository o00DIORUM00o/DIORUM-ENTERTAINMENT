export class LocationManager {
    static REGION_SIZE = 128;

    static getRegionCoords(x: number, y: number) {
        return {
            rx: Math.round(x / this.REGION_SIZE),
            ry: Math.round(y / this.REGION_SIZE)
        };
    }

    static getCrossroadName(rx: number, ry: number): string {
        if (rx === 0 && ry === 0) return "Origin Crossroads";
        
        // Simple hash
        const seed = Math.abs(Math.sin(rx * 12.9898 + ry * 78.233) * 43758.5453);
        const prefixes = ["Oak", "Dread", "Ash", "Storm", "Frost", "Iron", "Rose", "Shadow", "Light", "Mud", "Gloom", "Sun", "Moon", "Star", "Rock", "Wind", "Crystal", "Dragon", "Goblin", "Slime"];
        const suffixes = ["haven", "peak", "fall", "wood", "bridge", "fort", "keep", "town", "ville", "gate", "watch", "post", "mill", "stone", "water", "cliff", " Hollow", " Gulch", " Pass"];
        
        const pIdx = Math.floor((seed * 13) % prefixes.length);
        const sIdx = Math.floor((seed * 17) % suffixes.length);
        
        return prefixes[pIdx] + suffixes[sIdx] + " Crossroads";
    }

    static getRelativeDirection(startX: number, startY: number, targetRX: number, targetRY: number): string {
        const tx = targetRX * this.REGION_SIZE;
        const ty = targetRY * this.REGION_SIZE;
        
        const dx = tx - startX;
        const dy = ty - startY;
        
        const angle = Math.atan2(dy, dx);
        const deg = angle * 180 / Math.PI;
        
        if (deg > -22.5 && deg <= 22.5) return "East";
        if (deg > 22.5 && deg <= 67.5) return "South-East";
        if (deg > 67.5 && deg <= 112.5) return "South";
        if (deg > 112.5 && deg <= 157.5) return "South-West";
        if (deg > 157.5 || deg <= -157.5) return "West";
        if (deg > -157.5 && deg <= -112.5) return "North-West";
        if (deg > -112.5 && deg <= -67.5) return "North";
        if (deg > -67.5 && deg <= -22.5) return "North-East";
        
        return "Somewhere";
    }
}
