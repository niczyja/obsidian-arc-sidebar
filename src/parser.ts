
import { ArcJSONItem, ArcJSONSpace, ArcJSONWrapper, ArcSidebarItem, ArcSidebarModel, ArcSidebarSpace } from 'model';
import { access, constants, readFile } from 'fs/promises';
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
      spaceItemJson.title = spaceJson.title;

      spaces.push({
        id: spaceJson.id,
        title: spaceJson.title,
        item: createItem(spaceItemJson, <ArcJSONItem[]>wrapper.sidebar.containers[1].items, null)
      });
    });

    return { spaces: spaces };
  } catch(err) {
    console.log('error parsing json', err);
    return { spaces: [] };
  }
}

function createItem(itemJson: ArcJSONItem, allItemsJson: ArcJSONItem[], parentItem: ArcSidebarItem | null): ArcSidebarItem {
  let itemTitle = itemJson.title;
  let itemUrl: string | null = null;
  if (itemJson.data.tab) {
    itemUrl = itemJson.data.tab.savedURL;
    if (!itemTitle)
      itemTitle = itemJson.data.tab.savedTitle;
  }
  const tag: string = (itemTitle || '').toLowerCase().replace(/\W+/g, '');

  const newItem = {
    id: itemJson.id,
    parent: parentItem,
    children: <ArcSidebarItem[]>[],
    title: itemTitle,
    tag: (parentItem?.tag || 'arc') + '-' + tag,
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

export function filterItems(items: ArcSidebarItem[], key: keyof ArcSidebarItem, query: string | string[], exact = true) {
  const matchingItems = (result: ArcSidebarItem[], item: ArcSidebarItem) => {
    const queries: string[] = Array.isArray(query) ? query : [query];

    if (exact) {
      const isMatching = (query: string) => item[key] === query;
      if (queries.some(isMatching)) {
        result.push(item);
        return result;
      }
    } else {
      const isMatching = (query: string) => item[key]?.toString().contains(query);
      if (queries.some(isMatching)) {
        result.push(item);
        return result;
      }
    }

    const childItems = item.children.reduce(matchingItems, []);
    if (childItems?.length) {
      item.children = childItems;
      result.push(item);
    }

    return result;
  }

  return items.reduce(matchingItems, []);
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
