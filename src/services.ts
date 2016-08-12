import * as log4js from 'log4js'

import * as Deps from './deps'
import ConfigKeys from './configKeys'

import {PAServer} from './core/paServer'

let logger = log4js.getLogger('Services');

export var PixivAssistantServer = new PAServer(Deps.Container.config, Deps.Container.ajaxCall);

export function googleTranslate(japanese:string) : Promise<string> {
	let serviceUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURI(japanese)}`;
	return Deps.Container.ajaxCall({
		type: 'GET',
		url: serviceUrl
	}).then((response:any) => {
		logger.fatal('response from translation', response);
		let match = response.match(/\[\[\[\"([^\"]+)\",/);
		if (match && match.length > 1) {
			return match[1];
		}
		return Promise.reject('incorrectly formatted response received');
	});
}

