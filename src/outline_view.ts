
import { HeaderMenu } from 'header_menu';
import ArcSidebar from 'main';
import { ArcSidebarItem, ArcSidebarSpace } from 'model';
import { getIcon, ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_OUTLINE = 'arc-sidebar-outline-view';

export class ArcSidebarOutlineView extends ItemView {
	private plugin: ArcSidebar;
	private menu: HeaderMenu;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
		this.navigation = false;
		this.menu = new HeaderMenu();
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
		this.menu.addItem((item) => {
			item
				.setIcon('search')
				.setLabel('Show search filter')
				.onClick((el) => console.log(el));
		});
		this.menu.addItem((item) => {
			item
				.setIcon('arrow-up-narrow-wide')
				.setLabel('Change sort order')
				.onClick((el) => console.log(el));
		});
		this.menu.addItem((item) => {
			item
				.setIcon('chevrons-up-down')
				.setLabel('Expand all')
				.onClick((el) => console.log(el));
		});
	}

	onunload(): void {
		this.removeChild(this.menu);
	}

	 protected async onOpen(): Promise<void> {
	 	const container = this.containerEl;

	 	container.prepend(this.menu.containerEl);
	 	container.removeChild(container.children[2]);
	 	const spacesEl = container.createDiv({ cls: 'nav-files-container' });

	 	this.plugin.data.spaces.forEach((space) => {
	 		this.addSpace(space, spacesEl);
	 	});
	 }

	 protected async onClose(): Promise<void> {
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_OUTLINE);
	 }

	 private addSpace(space: ArcSidebarSpace, spacesEl: HTMLElement) {
	 	const spaceEl = spacesEl.createDiv({ cls: 'tree-item nav-folder mod-root' });

	 	spaceEl
	 		.createDiv({ cls: 'tree-item-self nav-folder-title' })
	 		.createDiv({ cls: 'tree-item-inner nav-folder-title-content', text: space.title });
	 	const rootEl = spaceEl
	 		.createDiv({ cls: 'tree-item-children nav-folder-children' });

	 	this.addTree(space.item, rootEl);
	 }

	 private addTree(parentItem: ArcSidebarItem, rootEl: HTMLElement) {
	 	this.plugin.data.items
	 		.filter((item) => item.parentId == parentItem.id)
	 		.sort((lhs, rhs) => parentItem.childrenIds.indexOf(lhs.id) - parentItem.childrenIds.indexOf(rhs.id))
	 		.forEach((item) => {
	 			if (item.childrenIds.length == 0)
	 				this.addItem(item, rootEl);
	 			else
	 				this.addFolder(item, rootEl);
	 		});
	 }

	 private addItem(item: ArcSidebarItem, rootEl: HTMLElement) {
	 	rootEl
	 		.createDiv({ cls: 'tree-item nav-file' })
	 		.createDiv({ cls: 'tree-item-self is-clickable nav-file-title' }, (el) => {
	 			el.onClickEvent((ev) => ev.doc.win.open(item.url || undefined));
	 		})
	 		.createDiv({ cls: 'tree-item-inner nav-file-title-content', text: item.title });
	 }

	 private addFolder(item: ArcSidebarItem, rootEl: HTMLElement) {
	 	const folderEl = rootEl
	 		.createDiv({ cls: 'tree-item nav-folder' });
	 	const folderTitleEl = folderEl
	 		.createDiv({ cls: 'tree-item-self is-clickable nav-folder-title' });
	 	const folderChildrenEl = folderEl
	 		.createDiv({ cls: 'tree-item-children nav-folder-children' });

	 	folderTitleEl
	 		.createDiv({ cls: 'tree-item-icon collapse-icon nav-folder-collapse-indicator' })
	 		.appendChild(<Node>getIcon('right-triangle'));
	 	folderTitleEl
	 		.createDiv({ cls: 'tree-item-inner nav-folder-title-content', text: item.title });

	 	this.addTree(item, folderChildrenEl);
	 }
}