import IConfig from 'src/core/IConfig'
import Mailman from 'vendor/chrome/mailman'
import * as Msg from 'vendor/chrome/messages'

type potentialData = boolean|string|number|Object

interface configValue {
	data: potentialData
}

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
	protected configEngine :Msg.ConfigProtocol
	constructor(engine?:Msg.ConfigProtocol) {
		if (engine) {
			this.configEngine = engine;
		} else {
			this.configEngine = Mailman.Background;
		}
	}
	public keys(): Promise<string[]> {
		return this.configEngine.listConfig();
	}

	public get(key: string): Promise<potentialData> {
		return this.configEngine.getConfig({ key })
			.then(msg => msg.value);
	}

	public set(key: string, value: potentialData) {
		return this.configEngine.setConfig({ key, value });
	}
}
