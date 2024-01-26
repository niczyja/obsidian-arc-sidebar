
// JSON model

export interface ArcJSONWrapper {
	sidebar: {
		containers: {
			items: Object[];
			spaces: Object[];
		}[];
	}
}

export interface ArcJSONSpace {
	id: string;
	title: string;
	containerIDs: string[];
}

export interface ArcJSONItem {
	id: string;
	parentID: string;
	childrenIds: string[];
	title: string;
	data: {
		tab: {
			savedTitle: string;
			savedURL: string;
		};
	};
}

// Plugin model

export interface ArcSidebarModel {
	spaces: ArcSidebarSpace[];
}

export interface ArcSidebarSpace {
	id: string;
	title: string;
	item: ArcSidebarItem;
}

export interface ArcSidebarItem {
	id: string;
	parent: ArcSidebarItem | null;
	children: ArcSidebarItem[];
	title: string;
	tag: string;
	url: string | null;
}