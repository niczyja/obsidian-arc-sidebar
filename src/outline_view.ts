
import ArcSidebar from 'main';
import { getIcon, ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_OUTLINE = 'arc-sidebar-outline-view';

export class ArcSidebarOutlineView extends ItemView {
	private plugin: ArcSidebar;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
		this.navigation = false;
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

	 protected async onOpen(): Promise<void> {
	 	const container = this.containerEl;

	 	const menuEl = container
	 		.createDiv({ cls: 'nav-header', prepend: true })
	 		.createDiv({ cls: 'nav-buttons-container' });

	 	menuEl
	 		.createDiv({
	 			cls: 'clickable-icon nav-action-button',
	 			attr: { 'aria-label': 'Show search filter' } 
	 		}, (el) => el.onClickEvent((ev) => {
	 			console.log(el, ev);
	 		}))
	 		.appendChild(<Node>getIcon('search'));

	 	menuEl
	 		.createDiv({
	 			cls: 'clickable-icon nav-action-button',
	 			attr: { 'aria-label': 'Change sort order' }
	 		}, (el) => el.onClickEvent((ev) => {
	 			console.log(el, ev);
	 		}))
	 		.appendChild(<Node>getIcon('arrow-up-narrow-wide'));

	 	menuEl
	 		.createDiv({
	 			cls: 'clickable-icon nav-action-button',
	 			attr: { 'aria-label': 'Expand all' }
	 		}, (el) => el.onClickEvent((ev) => {
	 			console.log(el, ev);
	 		}))
	 		.appendChild(<Node>getIcon('chevrons-up-down'));

	 	container.removeChild(container.children[2]);
	 	const explorerEl = container.createDiv({ cls: 'nav-files-container' });

	 	// for each space
	 	const spaceEl = explorerEl
	 		.createDiv({ cls: 'tree-item nav-folder mod-root' });
	 	spaceEl
	 		.createDiv({ cls: 'tree-item-self nav-folder-title' })
	 		.createDiv({ cls: 'tree-item-inner nav-folder-title-content', text: 'Space name' });
	 	const rootEl = spaceEl
	 		.createDiv({ cls: 'tree-item-children nav-folder-children' })

	 	// folder example
	 	const folderEl = rootEl
	 		.createDiv({ cls: 'tree-item nav-folder is-collapsed' });

	 	const folderTitleEl = folderEl
	 		.createDiv({ cls: 'tree-item-self is-clickable nav-folder-title' });

	 	folderTitleEl
	 		.createDiv({ cls: 'tree-item-icon collapse-icon nav-folder-collapse-indicator is-collapsed' })
	 		.appendChild(<Node>getIcon('right-triangle'));
	 	folderTitleEl
	 		.createDiv({ cls: 'tree-item-inner nav-folder-title-content', text: 'Folder name' });

	 	const folderChildrenEl = folderEl
	 		.createDiv({ cls: 'tree-item-children nav-folder-children' });

	 	// folder item example
	 	folderChildrenEl
	 		.createDiv({ cls: 'tree-item nav-file' })
	 		.createDiv({ cls: 'tree-item-self is-clickable nav-file-title' })
	 		.createDiv({ cls: 'tree-item-inner nav-file-title-content', text: 'Child item name' })

	 	// root item example
	 	rootEl
	 		.createDiv({ cls: 'tree-item nav-file' })
	 		.createDiv({ cls: 'tree-item-self is-clickable nav-file-title' })
	 		.createDiv({ cls: 'tree-item-inner nav-file-title-content', text: 'Root item name' })

	 }

	 protected async onClose(): Promise<void> {
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_OUTLINE);
	 }
}