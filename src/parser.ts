
import { access, constants, readFile } from 'fs/promises';
import { ArcJSONItem, ArcJSONSpace, ArcJSONWrapper, ArcSidebarItem, ArcSidebarModel, ArcSidebarSpace } from 'model';
import { normalize } from 'path';

export async function parseArcJson(jsonPath: string): Promise<ArcSidebarModel> {
	try {
		const data = await readFile(jsonPath, 'utf8');
		const wrapper: ArcJSONWrapper = JSON.parse(data);
		const spaces: ArcSidebarSpace[] = [];
		const items: ArcSidebarItem[] = [];

		wrapper.sidebar.containers[1].spaces.forEach((value, index) => {
			if (index % 2 == 0)
				return;

			const spaceJson = <ArcJSONSpace>value;
			const pinnedId = spaceJson.containerIDs[spaceJson.containerIDs.indexOf('pinned') + 1];
			const spaceItem = <ArcJSONItem>wrapper.sidebar.containers[1].items.find((value) => (<ArcJSONItem>value).id == pinnedId);
			spaces.push({
				id: spaceJson.id,
				title: spaceJson.title,
				item: {
					id: spaceItem.id,
					parentId: spaceItem.parentID,
					childrenIds: spaceItem.childrenIds,
					title: spaceItem.title,
					url: null
				}
			});
		});

		wrapper.sidebar.containers[1].items.forEach((value, index) => {
			if (index % 2 == 0)
				return;

			const itemJson = <ArcJSONItem>value;
			let itemTitle = itemJson.title;
			let itemUrl = null;
			if (itemJson.data.tab) {
				itemUrl = itemJson.data.tab.savedURL;
				if (!itemTitle)
					itemTitle = itemJson.data.tab.savedTitle;
			}

			items.push({
				id: itemJson.id,
				parentId: itemJson.parentID,
				childrenIds: itemJson.childrenIds,
				title: itemTitle,
				url: itemUrl
			});
		});

		// console.log(wrapper);
		// console.log(spaces);
		// console.log(items);

		return { spaces: spaces, items: items };
	} catch(err) {
		console.log('error parsing json', err);
		return { spaces: [], items: [] };
	}
}

export async function validateArcJsonPath(): Promise<boolean> {
	const jsonPath = normalize(this.settings.jsonPath);
	try {
		await access(jsonPath, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
