
import { App, Plugin, PluginSettingTab, Setting, Modal, FileSystemAdapter, normalizePath, TFolder } from 'obsidian';
import { homedir } from 'os';
import { normalize, resolve } from 'path';
import { access, constants } from 'fs/promises';

interface ArcSidebarSettings {
	jsonPath: string;
}

const DEFAULT_SETTINGS: ArcSidebarSettings = {
	jsonPath: homedir() + '/Library/Application Support/Arc/StorableSidebar.json',
	folderName: 'Arc Sidebar'
}

export default class ArcSidebar extends Plugin {
	settings: ArcSidebarSettings;
	folder: TFolder;

	async onload() {


//<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-drafting-compass"><circle cx="12" cy="5" r="2"/><path d="m3 21 8.02-14.26"/><path d="m12.99 6.74 1.93 3.44"/><path d="M19 12c-3.87 4-10.13 4-14 0"/><path d="m21 21-2.16-3.84"/></svg>

		await this.loadSettings();
		this.addSettingTab(new ArcSidebarSettingsTab(this.app, this));

		const statusBarItemEl = this.addStatusBarItem();
 		statusBarItemEl.setText('Arc Sidebar loaded');

 		this.addRibbonIcon("dice", "Print leaf types", () => {
 			console.log(this.app.workspace.leftRibbon, this.app.workspace.rightRibbon);


 			// this.app.workspace.iterateAllLeaves((leaf) => {
 			// 	console.log(leaf.getViewState().type);
 			// });
 		});
	}

	async onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async validateJsonPath(): bool {
		const jsonPath = normalize(this.settings.jsonPath);
		try {
			await access(jsonPath, constants.R_OK);
			return true;
		} catch {
			return false;
		}
	}
}

class ArcSidebarSettingsTab extends PluginSettingTab {
	plugin: ArcSidebar;

	constructor(app: App, plugin: ArcSidebar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async display(): void {
		this.containerEl.empty();

		const jsonExists = await this.plugin.validateJsonPath();

		new Setting(this.containerEl)
			.setName('Sidebar JSON file location')
			.setDesc(this.plugin.settings.jsonPath)
			.addExtraButton(cb => cb
				.setIcon('edit')
				.setTooltip('Change file location')
				.onClick(async () => {
					new TextInputModal(this.app, 'Set JSON file path', this.plugin.settings.jsonPath, async (value) => {
						this.plugin.settings.jsonPath = value;
						await this.save();
					}).open();
				}))
			.addExtraButton(cb => cb
				.setIcon('reset')
				.setTooltip('Reset to default')
				.onClick(async () => {
					this.plugin.settings.jsonPath = DEFAULT_SETTINGS.jsonPath;
					await this.save();
				}))
			.descEl.setAttribute('style', jsonExists ? 'color: var(--color-green);' : 'color: var(--color-red);');

		new Setting(this.containerEl)
			.setName('Default folder name')
			.setDesc('Set name of the folder containing Arc Sidebar structure')
			.addText(ct => ct
				.setValue(this.plugin.settings.folderName)
				.onChange(async (value) => {
					this.plugin.settings.folderName = value;
					await this.plugin.saveSettings();
				}))
			.addExtraButton(cb => cb
				.setIcon('reset')
				.setTooltip('Reset to default')
				.onClick(async () => {
					this.plugin.settings.folderName = DEFAULT_SETTINGS.folderName;
					await this.save();
				}));
	}

	async save(): void {
		await this.plugin.saveSettings();
		await this.display();
	}
}

class TextInputModal extends Modal {
	name: string;
	value: string;
	save: (value: string) => void

	constructor(app: App, name: string, value: string, save: (value: string) => void) {
		super(app);
		this.name = name;
		this.value = value;
		this.save = save;
	}

	display(): void {
		this.titleEl.setText(this.name);
		new Setting(this.contentEl)
			.addText(ct => ct
				.setValue(this.value)
				.onChange(value =>
					this.value = value
				)
				.inputEl.setAttribute('size', 60)
			)
			.addButton(cb => cb
				.setButtonText('Save')
				.onClick(async () => {
					this.save(this.value);
					this.close();
				}));
	}

	onOpen() {
		this.display();
	}

	onClose() {
		this.contentEl.empty();
	}
}



// import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// // Remember to rename these classes and interfaces!

// interface MyPluginSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

// export default class MyPlugin extends Plugin {
// 	settings: MyPluginSettings;

// 	async onload() {
// 		await this.loadSettings();

// 		// This creates an icon in the left ribbon.
// 		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
// 			// Called when the user clicks the icon.
// 			new Notice('This is a notice!');
// 		});
// 		// Perform additional things with the ribbon
// 		ribbonIconEl.addClass('my-plugin-ribbon-class');

// 		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
// 		const statusBarItemEl = this.addStatusBarItem();
// 		statusBarItemEl.setText('Status Bar Text');

// 		// This adds a simple command that can be triggered anywhere
// 		this.addCommand({
// 			id: 'open-sample-modal-simple',
// 			name: 'Open sample modal (simple)',
// 			callback: () => {
// 				new SampleModal(this.app).open();
// 			}
// 		});
// 		// This adds an editor command that can perform some operation on the current editor instance
// 		this.addCommand({
// 			id: 'sample-editor-command',
// 			name: 'Sample editor command',
// 			editorCallback: (editor: Editor, view: MarkdownView) => {
// 				console.log(editor.getSelection());
// 				editor.replaceSelection('Sample Editor Command');
// 			}
// 		});
// 		// This adds a complex command that can check whether the current state of the app allows execution of the command
// 		this.addCommand({
// 			id: 'open-sample-modal-complex',
// 			name: 'Open sample modal (complex)',
// 			checkCallback: (checking: boolean) => {
// 				// Conditions to check
// 				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 				if (markdownView) {
// 					// If checking is true, we're simply "checking" if the command can be run.
// 					// If checking is false, then we want to actually perform the operation.
// 					if (!checking) {
// 						new SampleModal(this.app).open();
// 					}

// 					// This command will only show up in Command Palette when the check function returns true
// 					return true;
// 				}
// 			}
// 		});

// 		// This adds a settings tab so the user can configure various aspects of the plugin
// 		this.addSettingTab(new SampleSettingTab(this.app, this));

// 		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
// 		// Using this function will automatically remove the event listener when this plugin is disabled.
// 		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
// 			console.log('click', evt);
// 		});

// 		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// 		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
// 	}

// 	onunload() {

// 	}

// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
// 	}

// 	async saveSettings() {
// 		await this.saveData(this.settings);
// 	}
// }

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
