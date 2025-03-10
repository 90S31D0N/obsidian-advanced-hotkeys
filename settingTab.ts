import { App, PluginSettingTab, Setting } from "obsidian";
import { HotkeyHandler, HotKeyHandlerConfig } from "hotkeyHandler"; // Import your HotkeyConfig interface
import { NewHotkeyModal } from "newHotkeyModal";
import { HotKeySettingsModal } from "hotkeySettingsModal";

export class HotkeySettingsTab extends PluginSettingTab {
	constructor(app: App, private plugin: any) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty(); // Clear previous content

		containerEl.createEl("h2", { text: "Hotkey Settings" });

		this.plugin.hotkeys.forEach(
			(hotkey: HotkeyHandler, index: number) => {
				new Setting(this.containerEl)
					.setName(`Hotkey ${index + 1}`)
					.addButton((button) =>
						button
							.setButtonText(`${hotkey.getRunning() ? '✅': '❌'}`)
							.setTooltip("Execute")
							.onClick(() => {
								hotkey.toggleRunning();
                                this.updateHotkey(hotkey.getHotkeyConfig(), hotkey);
                                this.display();
							})
					)
					.addButton((button) =>
						button
							.setButtonText("⚙️")
							.setTooltip("Settings")
							.onClick(() => {
								new HotKeySettingsModal(this.app, hotkey, (newhotkey) => {
                                    this.updateHotkey(newhotkey, hotkey)
                                    // console.log("Hotkeyconfig" + newhotkey)
                                    // console.log("HotkeyObject" + hotkey)
                                }).open()
							})
					)
					.addButton((button) =>
						button
							.setButtonText("🗑️")
							.setTooltip("Delete")
							.onClick(() => {
								this.deleteHotkey(hotkey, index)
								this.display();
							})
					)
			}
		);

        new Setting(this.containerEl)
            .addButton(button => button
                .setButtonText('New Hotkey')
                .setTooltip('Hotkey')
                .onClick(() => {
                    new NewHotkeyModal(this.app, (hotkey) => {
                        this.addNewHotkey(hotkey)
                        this.display();
                    }).open();
                })
            )
	}

    addNewHotkey(hotkey: HotKeyHandlerConfig) {
        this.plugin.settings.hotkeys.push(hotkey);
        this.plugin.saveSettings();
        const n = this.plugin.settings.hotkeys.length;
        const hotKeyObject: HotkeyHandler = new HotkeyHandler(this.app, this.plugin.settings.hotkeys[n-1], n-1);
        this.plugin.hotkeys.push(hotKeyObject);
    }

    deleteHotkey(hotkey: HotkeyHandler, index: number) {
        this.plugin.settings.hotkeys.splice(hotkey.getStorageIndex(),1)
        this.plugin.saveSettings();
        this.plugin.hotkeys.splice(index, 1);
    }

    updateHotkey(hotkeyConfig: HotKeyHandlerConfig, hotkey:HotkeyHandler) {
        // console.log(hotkeyConfig)
        hotkey.setHotkeyConfig(hotkeyConfig)
        this.plugin.settings.hotkeys[hotkey.getStorageIndex()] = hotkey.getHotkeyConfig();
        this.plugin.saveSettings();
    }
}
