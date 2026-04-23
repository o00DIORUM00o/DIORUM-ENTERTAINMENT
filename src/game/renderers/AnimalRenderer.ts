import { RenderRegistry, RenderContext } from '../registries/RenderRegistry';
import { TILE_SIZE, BLOCK_COLORS } from '../Constants';

export function defineAnimalRenderers() {
    RenderRegistry.register('GIANT_EAGLE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);

            // Tail feathers
            c.fillStyle = '#78350f'; // Dark brown
            c.beginPath();
            c.moveTo(-TILE_SIZE * 0.3, -TILE_SIZE * 0.2);
            c.lineTo(-TILE_SIZE * 0.7, 0);
            c.lineTo(-TILE_SIZE * 0.3, TILE_SIZE * 0.2);
            c.fill();

            // Huge wingspan (flap slightly with time)
            const time = Date.now() / 150;
            const wingExtension = Math.sin(time) * 0.2 + 0.8; // oscillates 0.6 to 1.0
            
            c.fillStyle = '#92400e'; // Brown body/wings
            
            // Left Wing
            c.beginPath();
            c.moveTo(-TILE_SIZE * 0.1, -TILE_SIZE * 0.2);
            c.lineTo(TILE_SIZE * 0.2, -TILE_SIZE * 0.6 * wingExtension);
            c.lineTo(-TILE_SIZE * 0.3, -TILE_SIZE * 0.8 * wingExtension);
            c.fill();
            
            // Right Wing
            c.beginPath();
            c.moveTo(-TILE_SIZE * 0.1, TILE_SIZE * 0.2);
            c.lineTo(TILE_SIZE * 0.2, TILE_SIZE * 0.6 * wingExtension);
            c.lineTo(-TILE_SIZE * 0.3, TILE_SIZE * 0.8 * wingExtension);
            c.fill();
            
            // Feather detals on wings
            c.strokeStyle = '#b45309';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(0, -TILE_SIZE * 0.3); c.lineTo(TILE_SIZE * 0.1, -TILE_SIZE * 0.7 * wingExtension);
            c.moveTo(0, TILE_SIZE * 0.3); c.lineTo(TILE_SIZE * 0.1, TILE_SIZE * 0.7 * wingExtension);
            c.stroke();

            // Main Body (Round oval)
            c.fillStyle = '#78350f';
            c.beginPath();
            c.ellipse(0, 0, TILE_SIZE * 0.4, TILE_SIZE * 0.25, 0, 0, Math.PI * 2);
            c.fill();

            // Head (White feathers)
            c.fillStyle = '#f8fafc';
            c.beginPath();
            c.ellipse(TILE_SIZE * 0.4, 0, TILE_SIZE * 0.2, TILE_SIZE * 0.15, 0, 0, Math.PI * 2);
            c.fill();

            // Beak (Sharp, golden/yellow)
            c.fillStyle = '#fbbf24';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.5, -TILE_SIZE * 0.08);
            c.lineTo(TILE_SIZE * 0.7, 0);
            c.lineTo(TILE_SIZE * 0.5, TILE_SIZE * 0.08);
            c.fill();
            
            // Eyes
            c.fillStyle = '#000000';
            c.beginPath();
            c.arc(TILE_SIZE * 0.45, -TILE_SIZE * 0.05, 2, 0, Math.PI * 2);
            c.arc(TILE_SIZE * 0.45, TILE_SIZE * 0.05, 2, 0, Math.PI * 2);
            c.fill();
        }
    });

    RenderRegistry.register('DEER', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B4513';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.25, TILE_SIZE * 0.8, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.strokeStyle = '#D2B48C';
            c.lineWidth = 2;
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.6, -TILE_SIZE * 0.3);
            c.moveTo(TILE_SIZE * 0.4, TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.6, TILE_SIZE * 0.3);
            c.stroke();
        }
    });

    RenderRegistry.register('WOLF', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#4a4a4a';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.2, TILE_SIZE * 0.8, TILE_SIZE * 0.4);
            c.fillStyle = '#333333';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#222222';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.2, -TILE_SIZE * 0.15);
            c.lineTo(TILE_SIZE * 0.3, -TILE_SIZE * 0.25);
            c.lineTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.15);
            c.fill();
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.2, TILE_SIZE * 0.15);
            c.lineTo(TILE_SIZE * 0.3, TILE_SIZE * 0.25);
            c.lineTo(TILE_SIZE * 0.4, TILE_SIZE * 0.15);
            c.fill();
            c.fillStyle = '#333333';
            c.fillRect(-TILE_SIZE * 0.6, -TILE_SIZE * 0.05, TILE_SIZE * 0.2, TILE_SIZE * 0.1);
        }
    });

    RenderRegistry.register('SHEEP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#ffcccc';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
        }
    });

    RenderRegistry.register('BEAR', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#5C4033';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.4, TILE_SIZE * 1.0, TILE_SIZE * 0.8);
            c.fillStyle = '#3E2723';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.25, TILE_SIZE * 0.4, TILE_SIZE * 0.5);
        }
    });

    RenderRegistry.register('HORSE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#A0522D';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
        }
    });

    RenderRegistry.register('TURTLE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#228B22';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            c.fillStyle = '#006400';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#32CD32';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
        }
    });

    RenderRegistry.register('UNICORN', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FFD700';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.6, 0);
            c.lineTo(TILE_SIZE * 1.0, 0);
            c.lineTo(TILE_SIZE * 0.6, -TILE_SIZE * 0.1);
            c.fill();
        }
    });

    RenderRegistry.register('BOAT', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B4513';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.8, 0); 
            c.lineTo(TILE_SIZE * 0.4, TILE_SIZE * 0.5);
            c.lineTo(-TILE_SIZE * 0.6, TILE_SIZE * 0.5);
            c.lineTo(-TILE_SIZE * 0.6, -TILE_SIZE * 0.5);
            c.lineTo(TILE_SIZE * 0.4, -TILE_SIZE * 0.5);
            c.closePath();
            c.fill();
            
            c.fillStyle = '#654321'; 
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.6, 0);
            c.lineTo(TILE_SIZE * 0.3, TILE_SIZE * 0.4);
            c.lineTo(-TILE_SIZE * 0.5, TILE_SIZE * 0.4);
            c.lineTo(-TILE_SIZE * 0.5, -TILE_SIZE * 0.4);
            c.lineTo(TILE_SIZE * 0.3, -TILE_SIZE * 0.4);
            c.closePath();
            c.fill();
        }
    });

    RenderRegistry.register('SKYSHIP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#D2B48C'; 
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            
            c.fillStyle = 'rgba(200, 50, 50, 0.9)'; 
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 1.0, 0, Math.PI * 2);
            c.fill();
            
            c.strokeStyle = '#FFD700';
            c.lineWidth = 4;
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 1.0, 0, Math.PI * 2);
            c.stroke();
            
            c.beginPath();
            c.moveTo(-TILE_SIZE * 1.0, 0);
            c.lineTo(TILE_SIZE * 1.0, 0);
            c.stroke();
            
            c.fillStyle = '#808080';
            c.fillRect(-TILE_SIZE * 1.2, -TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
        }
    });

    RenderRegistry.register('MAGITECH_MECH', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.scale(1.5, 1.5);
            c.fillStyle = '#4a4a52';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            c.fillStyle = '#cca300';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, 4);
            c.fillRect(-TILE_SIZE * 0.4, TILE_SIZE * 0.3, TILE_SIZE * 0.8, 4);
            c.fillStyle = '#303030';
            c.fillRect(-TILE_SIZE * 0.6, -TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
            c.fillStyle = '#00ffff';
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.2);
            c.fillStyle = '#222';
            c.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.6, TILE_SIZE * 0.6, TILE_SIZE * 0.2);
            c.fillRect(TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.6, TILE_SIZE * 0.2);
            c.fillStyle = 'rgba(0, 200, 255, 0.4)';
            c.beginPath();
            c.arc(TILE_SIZE * 0.1, 0, TILE_SIZE * 0.3, 0, Math.PI * 2);
            c.fill();
        }
    });

    RenderRegistry.register('GNOME_BUGGY', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.scale(1.3, 1.3);
            
            // Buggy chassis
            c.fillStyle = '#b22222'; // Firebrick red body
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            
            // Gnome engineering details (brass pipes)
            c.fillStyle = '#daa520'; // Goldenrod brass
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.2, TILE_SIZE * 0.1, TILE_SIZE * 0.4);
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.15, TILE_SIZE * 0.1, TILE_SIZE * 0.3);
            
            // Wheels
            c.fillStyle = '#111'; // Dark wheels
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.4, TILE_SIZE * 0.25, TILE_SIZE * 0.15);
            c.fillRect(-TILE_SIZE * 0.3, TILE_SIZE * 0.25, TILE_SIZE * 0.25, TILE_SIZE * 0.15);
            c.fillRect(TILE_SIZE * 0.15, -TILE_SIZE * 0.4, TILE_SIZE * 0.25, TILE_SIZE * 0.15);
            c.fillRect(TILE_SIZE * 0.15, TILE_SIZE * 0.25, TILE_SIZE * 0.25, TILE_SIZE * 0.15);
            
            // Windshield and seat
            c.fillStyle = 'rgba(173, 216, 230, 0.6)'; // Light blue windshield
            c.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.2, TILE_SIZE * 0.1, TILE_SIZE * 0.4);
            c.fillStyle = '#4a2f1d'; // Leather seat
            c.fillRect(-TILE_SIZE * 0.15, -TILE_SIZE * 0.2, TILE_SIZE * 0.2, TILE_SIZE * 0.4);
        }
    });

    RenderRegistry.register('GIANT_CHICKEN', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffffff';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            c.fillStyle = '#ff0000';
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.1, TILE_SIZE * 0.2, TILE_SIZE * 0.2);
            c.fillStyle = '#ffa500';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.5, 0);
            c.lineTo(TILE_SIZE * 0.7, 0);
            c.lineTo(TILE_SIZE * 0.5, TILE_SIZE * 0.1);
            c.fill();
        }
    });

    RenderRegistry.register('GIANT_FROG', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#32cd32';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.4, TILE_SIZE * 0.8, TILE_SIZE * 0.8);
            c.fillStyle = '#006400';
            c.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.3, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
            c.fillRect(TILE_SIZE * 0.1, TILE_SIZE * 0.1, TILE_SIZE * 0.3, TILE_SIZE * 0.2);
        }
    });

    RenderRegistry.register('CAPYBARA', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B5A2B';
            c.fillRect(-TILE_SIZE * 0.4, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            c.fillStyle = '#5C4033';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#000000';
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.1, 4, 4);
        }
    });

    RenderRegistry.register('DRAGON_HORSE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#8B0000'; 
            c.fillRect(-TILE_SIZE * 0.5, -TILE_SIZE * 0.25, TILE_SIZE * 1.0, TILE_SIZE * 0.5);
            c.fillRect(TILE_SIZE * 0.3, -TILE_SIZE * 0.15, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FF4500'; 
            c.fillRect(TILE_SIZE * 0.5, -TILE_SIZE * 0.15, 6, 6);
        }
    });

    RenderRegistry.register('DRAGON_TURTLE', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#2F4F4F'; 
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.8, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = '#8B0000'; 
            c.fillRect(-TILE_SIZE * 0.2, -TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
            c.fillStyle = '#556B2F'; 
            c.fillRect(TILE_SIZE * 0.6, -TILE_SIZE * 0.2, TILE_SIZE * 0.4, TILE_SIZE * 0.4);
        }
    });

    RenderRegistry.register('GIANT_TOAD', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#006400';
            c.fillRect(-TILE_SIZE * 0.6, -TILE_SIZE * 0.6, TILE_SIZE * 1.2, TILE_SIZE * 1.2);
            c.fillStyle = '#8FBC8F';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.4, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillRect(TILE_SIZE * 0.2, TILE_SIZE * 0.1, TILE_SIZE * 0.4, TILE_SIZE * 0.3);
            c.fillStyle = '#FFD700';
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.3, 8, 8);
            c.fillRect(TILE_SIZE * 0.4, TILE_SIZE * 0.2, 8, 8);
        }
    });

    RenderRegistry.register('OBSIDIAN_SHEEP', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#111111';
            c.fillRect(-TILE_SIZE * 0.3, -TILE_SIZE * 0.3, TILE_SIZE * 0.6, TILE_SIZE * 0.6);
            c.fillStyle = '#333333';
            c.fillRect(TILE_SIZE * 0.2, -TILE_SIZE * 0.15, TILE_SIZE * 0.3, TILE_SIZE * 0.3);
            c.fillStyle = '#8B0000'; // Red glowing eyes
            c.fillRect(TILE_SIZE * 0.4, -TILE_SIZE * 0.1, 4, 4);
        }
    });

    RenderRegistry.register('FAIRY', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#ffb6c1';
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.1, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = 'rgba(255, 182, 193, 0.5)';
            c.beginPath();
            c.arc(0, 0, TILE_SIZE * 0.25, 0, Math.PI * 2);
            c.fill();
        }
    });

    RenderRegistry.register('GRYPHON', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            c.fillStyle = '#daa520'; 
            c.fillRect(-TILE_SIZE * 0.6, -TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.6);
            c.fillStyle = '#f5deb3'; 
            c.fillRect(TILE_SIZE * 0.1, -TILE_SIZE * 0.25, TILE_SIZE * 0.5, TILE_SIZE * 0.5);
            c.fillStyle = '#ff8c00';
            c.beginPath();
            c.moveTo(TILE_SIZE * 0.6, -TILE_SIZE * 0.1);
            c.lineTo(TILE_SIZE * 0.8, 0);
            c.lineTo(TILE_SIZE * 0.6, TILE_SIZE * 0.1);
            c.fill();
            c.fillStyle = '#cfb53b';
            c.beginPath();
            c.moveTo(-TILE_SIZE * 0.2, -TILE_SIZE * 0.3);
            c.lineTo(0, -TILE_SIZE * 1.0);
            c.lineTo(TILE_SIZE * 0.2, -TILE_SIZE * 0.3);
            c.fill();
            c.beginPath();
            c.moveTo(-TILE_SIZE * 0.2, TILE_SIZE * 0.3);
            c.lineTo(0, TILE_SIZE * 1.0);
            c.lineTo(TILE_SIZE * 0.2, TILE_SIZE * 0.3);
            c.fill();
        }
    });

    RenderRegistry.register('FIRE_DRAGON', {
        draw: (ctx) => {
            const { ctx: c, TILE_SIZE, entity } = ctx;
            c.rotate(entity?.aimAngle || 0);
            const t = performance.now() / 200;
            const wingFlap = Math.sin(t) * 0.5 + 0.5;

            // Tail
            c.fillStyle = '#8a0303';
            c.beginPath();
            c.moveTo(-TILE_SIZE*0.4, 0);
            c.lineTo(-TILE_SIZE*1.2, Math.sin(t*1.5)*TILE_SIZE*0.2);
            c.lineTo(-TILE_SIZE*0.4, TILE_SIZE*0.1);
            c.fill();

            // Wings
            c.fillStyle = '#b31212';
            c.beginPath(); // Left wing
            c.moveTo(0, 0);
            c.lineTo(-TILE_SIZE*0.5, -TILE_SIZE*(1 + wingFlap));
            c.lineTo(TILE_SIZE*0.4, -TILE_SIZE*(0.8 + wingFlap));
            c.fill();
            c.beginPath(); // Right wing
            c.moveTo(0, 0);
            c.lineTo(-TILE_SIZE*0.5, TILE_SIZE*(1 + wingFlap));
            c.lineTo(TILE_SIZE*0.4, TILE_SIZE*(0.8 + wingFlap));
            c.fill();

            // Body
            c.fillStyle = '#8a0303';
            c.beginPath();
            c.ellipse(0, 0, TILE_SIZE * 0.6, TILE_SIZE * 0.4, 0, 0, Math.PI*2);
            c.fill();

            // Head and Neck
            c.beginPath();
            c.moveTo(TILE_SIZE*0.4, -TILE_SIZE*0.1);
            c.lineTo(TILE_SIZE*0.9, -TILE_SIZE*0.2);
            c.lineTo(TILE_SIZE*1.2, 0);
            c.lineTo(TILE_SIZE*0.9, TILE_SIZE*0.2);
            c.lineTo(TILE_SIZE*0.4, TILE_SIZE*0.1);
            c.fill();

            // Eyes
            c.fillStyle = '#FFA500';
            c.fillRect(TILE_SIZE*0.9, -TILE_SIZE*0.15, 3, 3);
            c.fillRect(TILE_SIZE*0.9, TILE_SIZE*0.1, 3, 3);
        }
    });
}
