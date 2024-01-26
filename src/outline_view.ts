
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { HeaderMenu } from 'header_menu';
import { LinkTree } from 'link_tree';
import ArcSidebar from 'main';

export const VIEW_TYPE_OUTLINE = 'arc-sidebar-outline-view';

export class ArcSidebarOutlineView extends ItemView {
	private plugin: ArcSidebar;
	private menu: HeaderMenu;
	private tree: LinkTree;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
		this.navigation = false;
		this.menu = new HeaderMenu();
		this.tree = new LinkTree(this.plugin.data.spaces.map((space) => space.item), 'Spaces');
	}

	getViewType(): string {
	    return VIEW_TYPE_OUTLINE;
	}

	getDisplayText(): string {
	    return 'Arc Sidebar Outline';
	}

	getIcon(): string {
	    return 'arc';
	}

	onload(): void {
		this.addChild(this.menu);
		this.addChild(this.tree);

		// this.menu.addItem((item) => {
		// 	item
		// 		.setIcon('search')
		// 		.setLabel('Show search filter')
		// 		.onClick((el) => console.log(el));
		// });
		// this.menu.addItem((item) => {
		// 	item
		// 		.setIcon('arrow-up-narrow-wide')
		// 		.setLabel('Change sort order')
		// 		.onClick((el) => console.log(el));
		// });
		// this.menu.addItem((item) => {
		// 	item
		// 		.setIcon('chevrons-up-down')
		// 		.setLabel('Expand all')
		// 		.onClick((el) => console.log(el));
		// });
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
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_OUTLINE);
	 }
}