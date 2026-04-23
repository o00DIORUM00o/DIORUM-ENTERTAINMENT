type Listener = (...args: any[]) => void;

export class EventEmitter {
    private events: Map<string, Listener[]> = new Map();

    on(event: string, listener: Listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(listener);
    }

    off(event: string, listener: Listener) {
        if (!this.events.has(event)) return;
        const listeners = this.events.get(event)!;
        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    }

    emit(event: string, ...args: any[]) {
        if (!this.events.has(event)) return;
        for (const listener of this.events.get(event)!) {
            listener(...args);
        }
    }
}
