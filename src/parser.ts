
import { access, constants, readFile } from 'fs/promises';
import { ArcJSONItem, ArcJSONSpace, ArcJSONWrapper, ArcSidebarItem, ArcSidebarModel, ArcSidebarSpace } from 'model';
import { normalize } from 'path';

export async function parseArcJson(jsonPath: string): Promise<ArcSidebarModel> {
	try {
		const data = await readFile(jsonPath, 'utf8');
		const wrapper: ArcJSONWrapper = JSON.parse(data);
		const spaces: ArcSidebarSpace[] = [];

		wrapper.sidebar.containers[1].spaces.forEach((value, index) => {
			if (index % 2 == 0)
				return;

			const spaceJson = <ArcJSONSpace>value;
			const pinnedId = spaceJson.containerIDs[spaceJson.containerIDs.indexOf('pinned') + 1];
			const spaceItemJson = <ArcJSONItem>wrapper.sidebar.containers[1].items.find((value) => (<ArcJSONItem>value).id == pinnedId);
			const spaceItem = createItem(spaceItemJson, <ArcJSONItem[]>wrapper.sidebar.containers[1].items, null);

			spaceItem.title = spaceJson.title;
			spaces.push({
				id: spaceJson.id,
				title: spaceJson.title,
				item: spaceItem
			});
		});

		console.log(spaces);

		return { spaces: spaces };
	} catch(err) {
		console.log('error parsing json', err);
		return { spaces: [] };
	}
}

function createItem(itemJson: ArcJSONItem, allItemsJson: ArcJSONItem[], parentItem: ArcSidebarItem | null): ArcSidebarItem {
	let itemTitle = itemJson.title;
	let itemUrl = null;
	if (itemJson.data.tab) {
		itemUrl = itemJson.data.tab.savedURL;
		if (!itemTitle)
			itemTitle = itemJson.data.tab.savedTitle;
	}

	const newItem = {
		id: itemJson.id,
		parent: parentItem,
		children: <ArcSidebarItem[]>[],
		title: itemTitle,
		url: itemUrl
	}

	newItem.children = itemJson.childrenIds.reduce((acc, childId) => {
		const childItemJson = allItemsJson.find((item) => item.id == childId);
		if (childItemJson != null) {
			acc.push(createItem(childItemJson, allItemsJson, newItem));
		}
		return acc;
	}, <ArcSidebarItem[]>[]);

	return newItem;
}

export async function validatePath(path: string): Promise<boolean> {
	const normalizedPath = normalize(path);
	try {
		await access(normalizedPath, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
