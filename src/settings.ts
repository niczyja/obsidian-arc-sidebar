
import ArcSidebar from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
import { TextInputModal } from 'text_input_modal';
import { validateArcJsonPath } from 'parser';
import { homedir } from 'os';

export interface ArcSidebarSettings {
	jsonPath: string;
}

export const DEFAULT_SETTINGS: ArcSidebarSettings = {
	jsonPath: homedir() + '/Library/Application Support/Arc/StorableSidebar.json',
}

export class ArcSidebarSettingsTab extends PluginSettingTab {
	plugin: ArcSidebar;

	constructor(app: App, plugin: ArcSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): Promise<void> {
		this.containerEl.empty();

		const jsonExists = await validateArcJsonPath();

		new Setting(this.containerEl)
			.setName('Sidebar JSON file location')
			.setDesc(this.plugin.settings.jsonPath)
			.addExtraButton(cb => cb
				.setIcon('edit')
				.setTooltip('Change file location')
				.onClick(async () => {
					new TextInputModal(this.app, 'Set JSON file path', this.plugin.settings.jsonPath, async (value) => {
						this.plugin.settings.jsonPath = value;
						this.save();
					}).open();
				}))
			.addExtraButton(cb => cb
				.setIcon('reset')
				.setTooltip('Reset to default')
				.onClick(async () => {
					this.plugin.settings.jsonPath = DEFAULT_SETTINGS.jsonPath;
					this.save();
				}))
			.descEl.setAttribute('style', jsonExists ? 'color: var(--color-green);' : 'color: var(--color-red);');
	}

	async save(): Promise<void> {
		await this.plugin.saveSettings();
		await this.display();
	}
}