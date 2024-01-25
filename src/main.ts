
import { addIcon, Plugin, WorkspaceLeaf } from 'obsidian';
import { ArcSidebarSettings, ArcSidebarSettingsTab, DEFAULT_SETTINGS } from 'settings';
import { ArcSidebarOutlineView, VIEW_TYPE_OUTLINE } from 'outline_view';
import { ArcSidebarNoteView, VIEW_TYPE_NOTE } from 'note_view';
import { parseArcJson } from 'parser';
import { ArcSidebarModel } from 'model';

export default class ArcSidebar extends Plugin {
	settings: ArcSidebarSettings;
	data: ArcSidebarModel;

	async onload(): Promise<void> {
		const { workspace } = this.app;

		addIcon('arc', `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-drafting-compass"><circle cx="12" cy="5" r="2"/><path d="m3 21 8.02-14.26"/><path d="m12.99 6.74 1.93 3.44"/><path d="M19 12c-3.87 4-10.13 4-14 0"/><path d="m21 21-2.16-3.84"/></svg>`);

		await this.loadSettings();
		this.addSettingTab(new ArcSidebarSettingsTab(this.app, this));
		this.data = await parseArcJson(this.settings.jsonPath);

		this.registerView(VIEW_TYPE_OUTLINE, (leaf) => new ArcSidebarOutlineView(this, leaf));
		this.registerView(VIEW_TYPE_NOTE, (leaf) => new ArcSidebarNoteView(this, leaf));

		workspace.onLayoutReady(() => {
			this.initView(VIEW_TYPE_OUTLINE, workspace.getLeftLeaf(false));
			this.initView(VIEW_TYPE_NOTE, workspace.getRightLeaf(false));

			workspace.rootSplit.win.addEventListener('focus', async (_event) => {
				this.data = await parseArcJson(this.settings.jsonPath);
			});
		});

		this.addCommand({
			id: 'open-arc-sidebar-outline',
			name: 'Open outline view',
			callback: async () => {
				await this.revealOutlineView();
			}
		});
		this.addCommand({
			id: 'open-arc-sidebar-note',
			name: 'Open note view',
			callback: async () => {
				await this.revealNoteView();
			}
		});

		this.registerEvent(workspace.on('editor-menu', (menu, editor, view) => {
			menu.addItem((item) => {
				item
					.setTitle('Open Arc Note View')
					.setIcon('arc')
					.onClick(async () => {
						await this.revealNoteView();
					});
			});
		}));
	}

	async onunload(): Promise<void> {
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async initView(viewType: string, leaf: WorkspaceLeaf): Promise<void> {
		this.app.workspace.detachLeavesOfType(viewType);
		await leaf.setViewState({ type: viewType, active: true }); //TODO: change active to false for prod
	}

	async revealOutlineView(): Promise<void> {
		const { workspace } = this.app;

		const leaves = workspace.getLeavesOfType(VIEW_TYPE_OUTLINE);
		if (leaves.length > 0) {
			workspace.revealLeaf(leaves[0]);
		} else {
			const left = workspace.getLeftLeaf(false);
			await left.setViewState({ type: VIEW_TYPE_OUTLINE, active: true });
			workspace.revealLeaf(left);
		}
	}

	async revealNoteView(): Promise<void> {
		const { workspace } = this.app;

		const leaves = workspace.getLeavesOfType(VIEW_TYPE_NOTE);
		if (leaves.length > 0) {
			workspace.revealLeaf(leaves[0]);
		} else {
			const right = workspace.getRightLeaf(false);
			await right.setViewState({ type: VIEW_TYPE_NOTE, active: true });
			workspace.revealLeaf(right);
		}
	}
}