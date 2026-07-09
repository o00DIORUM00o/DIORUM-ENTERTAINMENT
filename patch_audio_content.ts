export class AudioEngine {
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;
    masterFilter: BiquadFilterNode | null = null;
    
    private nextNoteTime = 0;
    private currentBeat = 0;
    private isPlaying = false;
    private timerID: number | null = null;
    private initialized = false;

    init() {
        if (this.initialized) return;
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.6; // Master volume

        // Lowpass filter to make it sound gentle, warm, and cinematic
        this.masterFilter = this.ctx.createBiquadFilter();
        this.masterFilter.type = 'lowpass';
        this.masterFilter.frequency.value = 1500; // Cut off harsh highs
        
        this.masterGain.connect(this.masterFilter);
        this.masterFilter.connect(this.ctx.destination);

        this.initialized = true;
    }

    // --- SOUND EFFECTS ---
    playHit() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        // Low noisy thump
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(10, time + 0.1);
        
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.1);
    }
    
    playShoot() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.15);
    }

    playSandstorm() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, time);
        filter.frequency.linearRampToValueAtTime(2000, time + 0.7);
        filter.frequency.linearRampToValueAtTime(100, time + 1.5);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.3);
        gain.gain.linearRampToValueAtTime(0, time + 1.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(time);
        noise.stop(time + 1.5);
    }

    playLaser() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, time);
        osc.frequency.exponentialRampToValueAtTime(200, time + 0.3);
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(time);
        osc.stop(time + 0.3);
    }

    playMelee() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.1);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    playThrowBush() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        // Use noise for a rustle/whoosh
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, time);
        filter.frequency.linearRampToValueAtTime(100, time + 0.2);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        noiseSource.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noiseSource.start(time);
        noiseSource.stop(time + 0.2);
    }

    playBreakBlock() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        // Use an oscillator for a quick pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(20, time + 0.05);
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.05);
    }

    playHeal() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.exponentialRampToValueAtTime(1200, time + 0.5);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 1.0);

        osc.start(time);
        osc.stop(time + 1.0);
    }

    playJump() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, time);
        osc.frequency.exponentialRampToValueAtTime(500, time + 0.15);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.15);
    }
    
    playSplash() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const ctx = this.ctx;
        const time = ctx.currentTime;
        
        // Use noise for splash sound
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, time);
        filter.frequency.linearRampToValueAtTime(100, time + 0.3);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(time);
        noise.stop(time + 0.3);
    }


    playLevelUp() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const time = this.ctx.currentTime;
        this.playTone('C', 4, 'square', 0.2, 0.2, time);
        this.playTone('E', 4, 'square', 0.2, 0.2, time + 0.2);
        this.playTone('G', 4, 'square', 0.2, 0.2, time + 0.4);
        this.playTone('C', 5, 'square', 0.6, 0.2, time + 0.6);
    }
    
    playChestOpen() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const time = this.ctx.currentTime;
        // Creak sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.linearRampToValueAtTime(50, time + 0.5);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.5);
    }

    playPortal() {
        if (!this.initialized) this.init();
        if (!this.ctx || !this.masterGain) return;
        const time = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(800, time + 1.5);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.5);
        gain.gain.linearRampToValueAtTime(0, time + 1.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 1.5);
    }

    startIntro() {
        if (!this.initialized) this.init();
        if (this.ctx?.state === 'suspended') this.ctx.resume();
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentBeat = 0;
        this.nextNoteTime = this.ctx!.currentTime + 0.1;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.timerID !== null) {
            window.clearTimeout(this.timerID);
            this.timerID = null;
        }
    }

    private scheduler() {
        if (!this.isPlaying || !this.ctx) return;
        
        // Schedule notes for the next 100ms
        while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
            this.playBeat(this.currentBeat, this.nextNoteTime);
            this.nextNote();
        }
        this.timerID = window.setTimeout(() => this.scheduler(), 25);
    }

    private nextNote() {
        const bpm = 60; // Slow, cinematic tempo
        const secondsPerBeat = 60.0 / bpm;
        this.nextNoteTime += secondsPerBeat;
        this.currentBeat++;
        if (this.currentBeat >= 32) { // 8 bars of 4/4
            this.currentBeat = 0;
        }
    }

    private playTone(note: string, octave: number, type: OscillatorType, duration: number, volume: number, time: number) {
        if (!this.ctx || !this.masterGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteIndex = notes.indexOf(note);
        const freq = 440 * Math.pow(2, (noteIndex - 9) / 12 + (octave - 4));
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);
        
        // Envelope
        gain.gain.setValueAtTime(0, time);
        // Gentle attack
        gain.gain.linearRampToValueAtTime(volume, time + 0.1);
        // Long release
        gain.gain.setTargetAtTime(0, time + duration - 0.1, 0.3);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(time);
        osc.stop(time + duration + 2); // Extra time for release tail
    }

    private playBeat(beat: number, time: number) {
        const bar = Math.floor(beat / 4);
        const beatInBar = beat % 4;

        // Chord Progression: Dm -> Bb -> F -> A (Epic harmonic minor lift)
        const bassNotes = [
            {n: 'D', o: 2}, {n: 'A#', o: 1}, {n: 'F', o: 1}, {n: 'A', o: 1},
            {n: 'D', o: 2}, {n: 'A#', o: 1}, {n: 'F', o: 1}, {n: 'A', o: 1}
        ];
        
        if (beatInBar === 0) {
            const bass = bassNotes[bar];
            // Deep triangle bass
            this.playTone(bass.n, bass.o, 'triangle', 3.8, 0.7, time);
        }

        // Arpeggio (Square) - Gentle rolling chords
        const chords = [
            ['D', 'F', 'A'], // Dm
            ['A#', 'D', 'F'], // Bb
            ['F', 'A', 'C'], // F
            ['A', 'C#', 'E'], // A major
            ['D', 'F', 'A'], // Dm
            ['A#', 'D', 'F'], // Bb
            ['F', 'A', 'C'], // F
            ['A', 'C#', 'E'] // A major
        ];
        
        const chord = chords[bar];
        
        // Play 8th notes (2 per beat)
        const arp1 = chord[beatInBar % 3];
        const arp2 = chord[(beatInBar + 1) % 3];
        
        const beatDuration = 60.0 / 60; // 60 BPM
        this.playTone(arp1, 3, 'square', 0.4, 0.05, time);
        this.playTone(arp2, 4, 'square', 0.4, 0.04, time + beatDuration / 2);

        // Melody (Square) - Epic, slow, echoing
        const melody: Record<number, {n: string, o: number, d: number}> = {
            0: {n: 'A', o: 4, d: 3},
            3: {n: 'G', o: 4, d: 1},
            4: {n: 'F', o: 4, d: 3},
            7: {n: 'E', o: 4, d: 1},
            8: {n: 'F', o: 4, d: 2},
            10: {n: 'G', o: 4, d: 2},
            12: {n: 'E', o: 4, d: 4},
            
            16: {n: 'A', o: 4, d: 3},
            19: {n: 'C', o: 5, d: 1},
            20: {n: 'D', o: 5, d: 3},
            23: {n: 'C', o: 5, d: 1},
            24: {n: 'A', o: 4, d: 2},
            26: {n: 'G', o: 4, d: 2},
            28: {n: 'A', o: 4, d: 4},
        };

        if (melody[beat]) {
            const m = melody[beat];
            this.playTone(m.n, m.o, 'square', m.d * beatDuration * 0.9, 0.15, time);
            
            // Add a slight echo (delay) for cinematic feel
            this.playTone(m.n, m.o, 'square', m.d * beatDuration * 0.9, 0.05, time + 0.3);
        }
    }
}

export const audioEngine = new AudioEngine();
