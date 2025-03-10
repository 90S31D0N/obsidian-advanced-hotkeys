import { App, Notice } from "obsidian";

export interface HotKeyHandlerConfig {
	primaryKey: string;
	secondaryKey: string;
	ctrlKey: boolean;
	altKey: boolean;
	shiftKey: boolean;
	commandId: string;
    running: boolean;
}

export class HotkeyHandler {
    private hotkey: HotKeyHandlerConfig;
    private storageIndex: number;

	private keydownHandler: (event: KeyboardEvent) => void;
	private keydownHandler2: (event: KeyboardEvent) => void;
	private timeoutId: number | undefined;

	constructor(private app: App, hotkey: HotKeyHandlerConfig, storageIndex: number) {
        this.hotkey = hotkey;
        this.storageIndex = storageIndex;
        if (this.hotkey.running) {
            this.start();
        }
    }

	start() {
		this.keydownHandler = (event: KeyboardEvent) => {
			if (
				event.shiftKey === this.hotkey.shiftKey &&
				event.ctrlKey === this.hotkey.ctrlKey &&
				event.altKey === this.hotkey.altKey &&
				event.key === this.hotkey.primaryKey
			) {
				event.preventDefault();
				this.keydownHandler2 = (event: KeyboardEvent) => {
					if (event.key === this.hotkey.secondaryKey) {
						event.preventDefault();
						this.executeCommand();
						document.removeEventListener(
							"keydown",
							this.keydownHandler2
						);
						// Timeout zurücksetzen, um versehentliches Entfernen zu verhindern
						if (this.timeoutId) {
							clearTimeout(this.timeoutId);
							this.timeoutId = undefined;
						}
					}
				};
				document.addEventListener("keydown", this.keydownHandler2);
				this.timeoutId = window.setTimeout(() => {
					document.removeEventListener(
						"keydown",
						this.keydownHandler2
					);
				}, 3000);
			}
		};

		document.addEventListener("keydown", this.keydownHandler);
	}

	stop() {
		document.removeEventListener("keydown", this.keydownHandler);
		document.removeEventListener("keydown", this.keydownHandler2);
	}

	reset() {
		this.stop();
		this.start();
	}

    getHotkeyConfig(): HotKeyHandlerConfig {
        return this.hotkey;
    }

    getStorageIndex(): number {
        return this.storageIndex;
    }

    setHotkeyConfig(hotkey: HotKeyHandlerConfig) {
        this.hotkey = hotkey;
    }

    getRunning(): boolean {
        return this.hotkey.running;
    }

    toggleRunning() {
        if (this.hotkey.running) {
            this.stop();
        } else {
            this.start();
        }
        this.hotkey.running = !this.hotkey.running;
    }

	private executeCommand() {
		const commandId = this.hotkey.commandId; // Beispielbefehl
		const command = (this.app as any).commands.commands[commandId];

		if (command) {
			(this.app as any).commands.executeCommandById(commandId);
			new Notice(`Befehl "${command.name}" ausgeführt.`);
		} else {
			new Notice(`Befehl mit ID "${commandId}" nicht gefunden.`);
		}
	}
}
