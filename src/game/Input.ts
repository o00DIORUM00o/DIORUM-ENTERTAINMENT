export class InputManager {
    keys: Set<string> = new Set();
    gamepadIndex: number | null = null;

    constructor() {
        window.addEventListener('keydown', e => this.keys.add(e.code));
        window.addEventListener('keyup', e => this.keys.delete(e.code));
        window.addEventListener('gamepadconnected', e => {
            this.gamepadIndex = e.gamepad.index;
            console.log('Gamepad connected:', e.gamepad.id);
        });
        window.addEventListener('gamepaddisconnected', e => {
            if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = null;
        });
    }

    getMovement() {
        let dx = 0, dy = 0;
        if (this.keys.has('KeyW')) dy -= 1;
        if (this.keys.has('KeyS')) dy += 1;
        if (this.keys.has('KeyA')) dx -= 1;
        if (this.keys.has('KeyD')) dx += 1;

        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp) {
                const ax = gp.axes[0];
                const ay = gp.axes[1];
                if (Math.abs(ax) > 0.1) dx = ax;
                if (Math.abs(ay) > 0.1) dy = ay;
            }
        }

        // Normalize keyboard
        if (dx !== 0 && dy !== 0 && this.gamepadIndex === null) {
            const len = Math.sqrt(dx*dx + dy*dy);
            dx /= len;
            dy /= len;
        }
        return { dx, dy };
    }

    getAim() {
        let ax = 0, ay = 0;
        if (this.keys.has('ArrowUp')) ay -= 1;
        if (this.keys.has('ArrowDown')) ay += 1;
        if (this.keys.has('ArrowLeft')) ax -= 1;
        if (this.keys.has('ArrowRight')) ax += 1;

        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp) {
                const gx = gp.axes[2];
                const gy = gp.axes[3];
                if (Math.abs(gx) > 0.1) ax = gx;
                if (Math.abs(gy) > 0.1) ay = gy;
            }
        }
        return { ax, ay };
    }

    isAttacking() {
        if (this.keys.has('Space')) return true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[7].pressed) return true; // RT
        }
        return false;
    }

    isCasting() {
        if (this.keys.has('ShiftLeft') || this.keys.has('ShiftRight')) return true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[6].pressed) return true; // LT
        }
        return false;
    }

    private prevInteractPressed = false;
    private prevJumpPressed = false;
    private prevDashPressed = false;
    private prevQuick1Pressed = false;
    private prevQuick2Pressed = false;
    private prevQuick3Pressed = false;
    private touchQuick1Triggered = false;
    private touchQuick2Triggered = false;
    private touchQuick3Triggered = false;

    triggerQuickSlot1() {
        this.touchQuick1Triggered = true;
    }

    triggerQuickSlot2() {
        this.touchQuick2Triggered = true;
    }

    triggerQuickSlot3() {
        this.touchQuick3Triggered = true;
    }

    isInteracting() {
        let pressed = false;
        if (this.keys.has('KeyE')) pressed = true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[0].pressed) pressed = true; // A
        }
        
        if (pressed && !this.prevInteractPressed) {
            this.prevInteractPressed = true;
            return true;
        } else if (!pressed) {
            this.prevInteractPressed = false;
        }
        return false;
    }

    isJumping() {
        let pressed = false;
        if (this.keys.has('Space')) pressed = true; // Use Space for jump too
        if (this.keys.has('KeyY')) pressed = true; // Keyboard Y for testing
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[3].pressed) pressed = true; // Y button
        }
        
        if (pressed && !this.prevJumpPressed) {
            this.prevJumpPressed = true;
            return true;
        } else if (!pressed) {
            this.prevJumpPressed = false;
        }
        return false;
    }

    isJumpDown() {
        let pressed = false;
        if (this.keys.has('Space')) pressed = true;
        if (this.keys.has('KeyY')) pressed = true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[3].pressed) pressed = true; // Y button
        }
        return pressed;
    }

    isDashing() {
        let pressed = false;
        if (this.keys.has('KeyB')) pressed = true; // Keyboard B for testing
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[1].pressed) pressed = true; // B button
        }
        
        if (pressed && !this.prevDashPressed) {
            this.prevDashPressed = true;
            return true;
        } else if (!pressed) {
            this.prevDashPressed = false;
        }
        return false;
    }

    isQuickSlot1() {
        let pressed = false;
        if (this.keys.has('Digit1')) pressed = true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[4].pressed) pressed = true; // LB
        }
        if (this.touchQuick1Triggered) {
            pressed = true;
            this.touchQuick1Triggered = false;
        }
        
        if (pressed && !this.prevQuick1Pressed) {
            this.prevQuick1Pressed = true;
            return true;
        } else if (!pressed) {
            this.prevQuick1Pressed = false;
        }
        return false;
    }

    isQuickSlot2() {
        let pressed = false;
        if (this.keys.has('Digit2')) pressed = true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[5].pressed) pressed = true; // RB
        }
        if (this.touchQuick2Triggered) {
            pressed = true;
            this.touchQuick2Triggered = false;
        }
        
        if (pressed && !this.prevQuick2Pressed) {
            this.prevQuick2Pressed = true;
            return true;
        } else if (!pressed) {
            this.prevQuick2Pressed = false;
        }
        return false;
    }

    isQuickSlot3() {
        let pressed = false;
        if (this.keys.has('Digit3')) pressed = true;
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[2].pressed) pressed = true; // X button
        }
        if (this.touchQuick3Triggered) {
            pressed = true;
            this.touchQuick3Triggered = false; // Consume trigger
        }
        
        if (pressed && !this.prevQuick3Pressed) {
            this.prevQuick3Pressed = true;
            return true;
        } else if (!pressed) {
            this.prevQuick3Pressed = false;
        }
        return false;
    }

    private prevPausePressed = false;
    isPausePressed() {
        let pressed = false;
        if (this.keys.has('Escape') || this.keys.has('Enter') || this.keys.has('KeyP')) {
            pressed = true;
        }
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[9]?.pressed) { // 9 is Start/Menu on standard gamepad
                pressed = true;
            }
        }

        if (pressed && !this.prevPausePressed) {
            this.prevPausePressed = true;
            return true;
        } else if (!pressed) {
            this.prevPausePressed = false;
        }
        return false;
    }

    private prevSneakPressed = false;
    isSneakPressed() {
        let pressed = false;
        if (this.keys.has('KeyC') || this.keys.has('ControlLeft')) {
            pressed = true;
        }
        if (this.gamepadIndex !== null) {
            const gp = navigator.getGamepads()[this.gamepadIndex];
            if (gp && gp.buttons[11]?.pressed) { // 11 is R3 (Right Joystick Click)
                pressed = true;
            }
        }

        if (pressed && !this.prevSneakPressed) {
            this.prevSneakPressed = true;
            return true;
        } else if (!pressed) {
            this.prevSneakPressed = false;
        }
        return false;
    }
}
