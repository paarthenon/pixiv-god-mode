import * as log4js from 'log4js'

import {AjaxFunction} from 'src/core/IAjax'

export class GoogleTranslateAPI {
	private logger = log4js.getLogger('GoogleTranslateAPI');

	constructor(protected ajax:AjaxFunction<any,any>) {}

	public translate(japanese:string) : Promise<string> {
		let serviceUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURI(japanese)}`;
		return this.ajax({
			type: 'GET',
			url: serviceUrl
		}).then((response:any) => {
			this.logger.fatal('response from translation', response);
			let match = response.match(/\[\[\[\"([^\"]+)\",/);
			if (match && match.length > 1) {
				return match[1];
			}
			return Promise.reject('incorrectly formatted response received');
		});
	}
}