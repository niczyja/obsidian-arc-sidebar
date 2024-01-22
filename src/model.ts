
// Arc JSON model

export interface ArcSidebarWrapper {
	sidebar: {
		containers: {
			items: Object[];
			spaces: Object[];
		}[];
	}
}

export interface ArcSidebarSpace {
	id: string;
	title: string;
}

export interface ArcSidebarItem {
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



// export interface ArcSidebarJSON {
// 	sidebarSyncState: {
// 		container: {
// 			value: {
// 				orderedSpaceIDs: string[];
// 				topAppsContainerID: string;
// 				topAppsContainerIDs: Object[];
// 				version: number;
// 			};
// 		};
// 		items: Object[];
// 		spaceModels: Object[];
// 		lastSuccessfulSyncDate: number;
// 	};
// 	firebaseSyncState: Object;
// 	sidebar: Object;
// 	version: number;
// }

// export interface ArcSidebarSpaceModel {
// 	encodedCKRecordFields: string;
// 	value: {
// 		containerIDs: string[];
// 		customInfo: {
// 			iconType: { icon: string };
// 		};
// 		id: string;
// 		isPinnedSectionExpanded: boolean;
// 		newContainerIDs: Object[];
// 		profile: Object;
// 		title: string;
// 	};
// }

// Plugin model

// export interface Sidebar {
// 	spaces: Space[];
// }

// export interface Space {
// 	id: string;
// 	name: string;
// }