import IConfig from '../../src/core/IConfig'
import Mailman from './mailman'
import * as Msg from './messages'

import * as log4js from 'log4js'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

let logger = log4js.getLogger('Config');

function handleError<T>(value: T) {
	return new Promise((resolve, reject) => {
		if (!chrome.runtime.lastError) {
			resolve(value);
		} else {
			reject(chrome.runtime.lastError.message);
		}
	});
}
export default class ContentConfig implements IConfig {
	public keys(): Promise<string[]> {
		return Mailman.Background.listConfig();
	}

	public get(key: string): Promise<potentialData> {
		return Mailman.Background.getConfig({ key })
			.then(msg => msg.value);
	}

	public set(key: string, value: potentialData) {
		return Mailman.Background.setConfig({ key, value });
	}
}
