
import { getAllTags, ItemView, WorkspaceLeaf } from 'obsidian';
import { HeaderMenu } from 'header_menu';
import { LinkTree } from 'link_tree';
import ArcSidebar from 'main';
import { filterItems } from 'parser';

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

		const cache = this.plugin.app.metadataCache.getFileCache(this.plugin.app.workspace.getActiveFile());
		const tags: string[] = []
			.concat(cache?.frontmatter['tags'])
			.concat(cache?.tags?.map((t) => t.tag.substring(1)))
			.filter((v, i, a) => a.indexOf(v) === i && (<string>v).startsWith('arc'));
		const allItems = this.plugin.data.spaces.map((space) => space.item);
		const matchingItems = filterItems(allItems, 'tag', tags);

		this.tree = new LinkTree(matchingItems, 'Matching items');
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
}