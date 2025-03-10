import { App, Plugin } from 'obsidian';
import { HotkeySettingsTab } from 'settingTab';
import { HotkeyHandler, } from 'hotkeyHandler';
import { HotKeyHandlerConfig } from 'hotkeyHandler';

export interface PluginSettings {
  hotkeys: HotKeyHandlerConfig[];
}

export default class HotkeyPlugin extends Plugin {
  settings: PluginSettings;

  hotkeys: HotkeyHandler[] = []

  async onload() {
    await this.loadSettings();

	this.settings.hotkeys.forEach((hotkey, index) => {
		const hotkeyHandler = new HotkeyHandler(this.app, hotkey, index);
		this.hotkeys.push(hotkeyHandler);
	});

    // Add settings tab
    this.addSettingTab(new HotkeySettingsTab(this.app, this));

  }

  

  async loadSettings() {
    const loadedSettings = await this.loadData();
	const hotkeyConfig: HotKeyHandlerConfig = {
		primaryKey: 'a',
		secondaryKey: 'b',
		ctrlKey: true,
		altKey: false,
		shiftKey: false,
		commandId: 'editor:toggle-bold',
		running: false,
	}
    this.settings = loadedSettings || {
      hotkeys: [
        hotkeyConfig
      ]
    };
  }

  async saveSettings() {
    await this.saveData(this.settings);

  }
}
