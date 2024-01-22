
import { access, constants, readFile } from 'fs/promises';
import { ArcSidebarItem, ArcSidebarSpace, ArcSidebarWrapper } from 'model';
import { normalize } from 'path';

export async function parseArcJson(jsonPath: string): Promise<Object> {
	try {
		const data = await readFile(jsonPath, 'utf8');
		const wrapper: ArcSidebarWrapper = JSON.parse(data);
		const spaces: ArcSidebarSpace[] = [];
		const items: ArcSidebarItem[] = [];

		wrapper.sidebar.containers[1].spaces.forEach((space, index) => {
			if (index % 2 == 0)
				return;

			spaces.push(<ArcSidebarSpace>space);
		});

		wrapper.sidebar.containers[1].items.forEach((item, index) => {
			if (index % 2 == 0)
				return;

			items.push(<ArcSidebarItem>item);
		});

		console.log(wrapper);
		console.log(spaces);
		console.log(items);

		return {};
	} catch(err) {
		console.log('error parsing json', err);
		return {};
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
