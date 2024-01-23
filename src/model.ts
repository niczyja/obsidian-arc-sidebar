
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
	items: ArcSidebarItem[];
}

export interface ArcSidebarSpace {
	id: string;
	title: string;
}

export interface ArcSidebarItem {
	id: string;
	parentId: string;
	childrenIds: string[];
	title: string;
	url: string | null;
}