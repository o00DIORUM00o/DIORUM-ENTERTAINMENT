export class OverlayRenderer {
    static draw(engine: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const { world, player } = engine;
        
        if (world.activePlanet === 'ARETH') {
             // Red/orange vignette mask for heat
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.1,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.7
             );
             vignette.addColorStop(0, 'rgba(255, 69, 0, 0)');
             vignette.addColorStop(1, 'rgba(180, 20, 0, 0.4)');
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (world.activePlanet === 'TARHE') {
             // Light blue/white frost vignette for cold
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.8
             );
             vignette.addColorStop(0, 'rgba(173, 216, 230, 0)');
             vignette.addColorStop(1, 'rgba(173, 216, 230, 0.35)');
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (world.activePlanet === 'TERHA') {
             // Green/Brown murky vignette for swamp
             const vignette = ctx.createRadialGradient(
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
                 canvas.width / 2, canvas.height / 2, canvas.width * 0.8
             );
             vignette.addColorStop(0, 'rgba(34, 139, 34, 0)'); // Forest green
             vignette.addColorStop(1, 'rgba(85, 107, 47, 0.45)'); // Dark olive green
             
             ctx.fillStyle = vignette;
             ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw Abyssal Floor UI
        if (player.x >= 60000 * 16) {
            const currentFloor = Math.floor((player.x / 16 - 60000) / 10);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(canvas.width / 2 - 100, 20, 200, 40);
            ctx.strokeStyle = '#5c3a21';
            ctx.lineWidth = 2;
            ctx.strokeRect(canvas.width / 2 - 100, 20, 200, 40);
            
            ctx.font = 'bold 20px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ff4444';
            ctx.fillText(`ABYSSAL FLOOR ${currentFloor}`, canvas.width / 2, 40);
        }
    }
}
