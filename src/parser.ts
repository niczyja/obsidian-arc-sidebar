
import { access, constants, readFile } from 'fs/promises';
import { normalize } from 'path';

export async function parseArcJson(jsonPath: string): Promise<Object> {
	try {
		const data = await readFile(jsonPath, 'utf8');
		const jsonObject = JSON.parse(data);
		console.log('reading arc sidebar json');
		console.log(jsonObject);
		return jsonObject;
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
