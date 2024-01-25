
import { ArcSidebarItem } from 'model';
import { Component, getIcon } from 'obsidian';

export class LinkTree extends Component {
	containerEl: HTMLElement;
	items: ArcSidebarItem[];
	title: string;

	constructor(items: ArcSidebarItem[], title: string) {
        super();
        this.containerEl = createDiv({ cls: 'nav-files-container' });
		this.items = items;
		this.title = title;
	}

	onload(): void {
	 	const rootEl = this.containerEl.createDiv({ cls: 'tree-item nav-folder mod-root' });
	 	rootEl
	 		.createDiv({ cls: 'tree-item-self nav-folder-title' })
	 		.createDiv({ cls: 'tree-item-inner nav-folder-title-content', text: this.title });
	 	const itemsEl = rootEl.createDiv({ cls: 'tree-item-children nav-folder-children' });

	 	this.items.forEach((item) => this.addItem(item, itemsEl));
	}

	onunload(): void {
	    this.containerEl.empty();
	}

	private addItem(item: ArcSidebarItem, rootEl: HTMLElement) {
		const isFolder: boolean = item.children.length != 0;
		const cls: string = isFolder ? 'nav-folder' : 'nav-file';

		const itemEl = rootEl.createDiv({ cls: 'tree-item ' + cls })
		const titleEl = itemEl.createDiv({ cls: 'tree-item-self ' + cls + '-title' }, (el) => {
			if (!isFolder)
				el.onClickEvent((ev) => ev.doc.win.open(item.url || undefined));
		});

		if (isFolder) {
			const childrenEl = rootEl.createDiv({ cls: 'tree-item-children nav-folder-children' });
			item.children.forEach((child) => this.addItem(child, childrenEl));

			titleEl
				.createDiv({ cls: 'tree-item-icon collapse-icon nav-folder-collapse-indicator' })
				.appendChild(<Node>getIcon('right-triangle'));
		}

		titleEl.createDiv({ cls: 'tree-item-inner ' + cls + '-title-content', text: item.title });
	}
}