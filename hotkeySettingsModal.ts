import { HotkeyHandler, HotKeyHandlerConfig } from "hotkeyHandler";
import { App, Hotkey, Modal, Setting, Command } from "obsidian";

export class HotKeySettingsModal extends Modal {
    private hotkey: HotKeyHandlerConfig;

    constructor(app: App, hotkey: HotkeyHandler, private onSubmit: (hotkey: HotKeyHandlerConfig) => void) {
        super(app);
        this.hotkey = hotkey.getHotkeyConfig();
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "Hotkey Settings"})

        new Setting(contentEl)
                    .setName("Primary Key")
                    .addText (text => text
                        .setPlaceholder("Enter Primary Key")
                        .setValue(this.hotkey.primaryKey)
                        .onChange(value => {
                            this.hotkey.primaryKey = value;
                        })
                    )
        
        new Setting(contentEl)
            .setName('Secondary Key')
            .addText(text => text
                .setPlaceholder('Enter Secondary Key')
                .setValue(this.hotkey.secondaryKey)
                .onChange(value => {
                    this.hotkey.secondaryKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Ctrl Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .setValue(this.hotkey.ctrlKey)
                .onChange(value => {
                    this.hotkey.ctrlKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Alt Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .setValue(this.hotkey.altKey)
                .onChange(value => {
                    this.hotkey.altKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Need Shift Key')
            .addToggle(toggle => toggle
                .setTooltip('Test')
                .setValue(this.hotkey.shiftKey)
                .onChange(value => {
                    this.hotkey.shiftKey = value;
                })
            )

        new Setting(contentEl)
            .setName('Command')
            .addDropdown(dropdown => {
            const commands = (this.app as any).commands.listCommands();
            commands.forEach((command: {id: string; name: string;}) => {
                dropdown.addOption(command.id, command.name);
            });
            dropdown.setValue(this.hotkey.commandId)
            dropdown.onChange(value => {
                this.hotkey.commandId = value;
            });

            });

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Save')
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