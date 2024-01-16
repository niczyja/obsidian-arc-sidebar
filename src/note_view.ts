
import ArcSidebar from "main";
import { ItemView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_NOTE = 'arc-sidebar-note-view';

export class ArcSidebarNoteView extends ItemView {
	private plugin: ArcSidebar;

	constructor(plugin: ArcSidebar, leaf: WorkspaceLeaf) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
	    return VIEW_TYPE_NOTE;
	}

	getDisplayText(): string {
	    return "Arc Sidebar Note";
	}

	getIcon(): string {
	    return 'arc';
	}

	 protected async onOpen(): Promise<void> {
	 	const container = this.containerEl.children[1];
	 	container.empty();
	 	container.createEl("h4", { text: "Arc Sidebar Note" });
	 }

	 protected async onClose(): Promise<void> {
	 	this.app.workspace.detachLeavesOfType(VIEW_TYPE_NOTE);
	 }
}