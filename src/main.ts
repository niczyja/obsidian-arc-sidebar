
import { Plugin } from 'obsidian';
import { ArcSidebarSettings, ArcSidebarSettingsTab, DEFAULT_SETTINGS } from 'settings';
import { access, constants } from 'fs/promises';
import { normalize } from 'path';

export default class ArcSidebar extends Plugin {
	settings: ArcSidebarSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ArcSidebarSettingsTab(this.app, this));
	}

	async onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async validateJsonPath(): Promise<boolean> {
		const jsonPath = normalize(this.settings.jsonPath);
		try {
			await access(jsonPath, constants.R_OK);
			return true;
		} catch {
			return false;
		}
	}
}