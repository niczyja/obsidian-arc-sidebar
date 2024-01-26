
import { getAllTags, ItemView, TFile, WorkspaceLeaf } from 'obsidian';
import { HeaderMenu } from 'header_menu';
import { LinkTree } from 'link_tree';
import { filterItems } from 'parser';
import ArcSidebar from 'main';

export const VIEW_TYPE_NOTE = 'arc-sidebar-note-view';

export class ArcSidebarNoteView extends ItemView {
	private plugin: ArcSidebar;
	private menu: HeaderMenu;
	private tree: LinkTree;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
		this.navigation = false;
		this.menu = new HeaderMenu();
		this.tree = new LinkTree([], 'Matching sidebar items');
	}

	getViewType(): string {
	    return VIEW_TYPE_NOTE;
	}

	getDisplayText(): string {
	    return 'Arc Sidebar Note';
	}

	getIcon(): string {
	    return 'arc';
	}

	onload(): void {
		this.addChild(this.menu);
		this.addChild(this.tree);

		this.plugin.registerEvent(this.plugin.app.workspace.on('active-leaf-change', (leaf) => {
			this.updateTreeItems();
		}));

		this.plugin.registerEvent(this.plugin.app.workspace.on('editor-change', (editor, info) => {
			this.updateTreeItems();
		}));

		this.updateTreeItems();
	}

	onunload(): void {
		this.removeChild(this.tree);
		this.removeChild(this.menu);
	}

	 protected async onOpen(): Promise<void> {
	 	const container = this.containerEl;

	 	container.prepend(this.menu.containerEl);
	 	container.removeChild(container.children[2]);
	 	container.append(this.tree.containerEl);
	 }

	 protected async onClose(): Promise<void> {
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_NOTE);
	 }

	 private updateTreeItems() {
	 	const tags = this.getActiveFileTags();
	 	if (tags.length)
		 	this.tree.items = filterItems(this.plugin.data.spaces.map((space) => space.item), 'tag', tags);
		else
			this.tree.items = [];
	 }

	 private getActiveFileTags(): string[] {
	 	const file = this.plugin.app.workspace.getActiveFile();
	 	if (file == null)
	 		return [];

		const cache = this.plugin.app.metadataCache.getFileCache(file);
		return []
			.concat(cache?.frontmatter?.tags)
			.concat(cache?.tags?.map((t) => t.tag.substring(1)))
			.filter((v, i, a) => a.indexOf(v) === i && (<string>v)?.startsWith('arc'));
	 }
}