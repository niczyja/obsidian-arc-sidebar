
import ArcSidebar from "main";
import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_OUTLINE = 'arc-sidebar-outline-view';

export class ArcSidebarOutlineView extends ItemView {
	private plugin: ArcSidebar;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
	    return VIEW_TYPE_OUTLINE;
	}

	getDisplayText(): string {
	    return "Arc Sidebar Outline";
	}

	getIcon(): string {
	    return 'arc';
	}

	 protected async onOpen(): Promise<void> {
	 	const container = this.containerEl.children[1];
	 	container.empty();
	 	container.createEl("h4", { text: "Arc Sidebar Outline" });
	 }

	 protected async onClose(): Promise<void> {
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_OUTLINE);
	 }
}