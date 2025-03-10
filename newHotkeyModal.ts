import { HotkeyHandler, HotKeyHandlerConfig } from "hotkeyHandler";
import { App, Modal, Setting } from "obsidian";

export class NewHotkeyModal extends Modal {
    private hotkey: HotKeyHandlerConfig;

    constructor (app: App, private onSubmit: (hotkey: HotKeyHandlerConfig) => void) {
        super(app);
        const newHotkey: HotKeyHandlerConfig = {
            primaryKey: "",
            secondaryKey: "",
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            commandId: "",
            running: false,
        }
        this.hotkey = newHotkey;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "New Hotkey"})

        new Setting(contentEl)
            .setName("Primary Key")
            .addText (text => text
                .setPlaceholder("Enter Primary Key")
                .onChange(value => {
                    this.hotkey.primaryKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Secondary Key')
            .addText(text => text
                .setPlaceholder('Enter Secondary Key')
                .onChange(value => {
                    this.hotkey.secondaryKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Ctrl Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .onChange(value => {
                    this.hotkey.ctrlKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Alt Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .onChange(value => {
                    this.hotkey.altKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Shift Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .onChange(value => {
                    this.hotkey.shiftKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Command')
            .addDropdown(dropdown => {
            const commands = this.app.commands.listCommands();
            commands.forEach(command => {
                dropdown.addOption(command.id, command.name);
            });
            dropdown.onChange(value => {
                this.hotkey.commandId = value;
            });
            });

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Add')
                .setCta()
                .onClick(() => {
                    this.onSubmit(this.hotkey);
                    this.close()
                })
            )

        
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}