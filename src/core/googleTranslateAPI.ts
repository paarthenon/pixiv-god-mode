import {AjaxFunction} from 'src/core/IAjax';

import log from 'src/log';
let console = log.subCategory('Google Translate API');

/**
 * Takes advantage of an undocumented API. May stop working at any point, really. Living on the edge...
 */
export class GoogleTranslateAPI {
    constructor(protected ajax: AjaxFunction<any, any>) {}

    public translate(japanese: string): Promise<string> {
        let serviceUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURI(
            japanese,
        )}`;
        return this.ajax({
            type: 'GET',
            url: serviceUrl,
        }).then((response: any) => {
            console.debug('response received');
            let match = response.match(/\[\[\[\"([^\"]+)\",/);
            if (match && match.length > 1) {
                let translation = match[1];
                console.debug(
                    `suggested translation for [${japanese}] is [${translation}]`,
                );
                return translation;
            } else {
                let message = 'unexpected response format received';
                console.debug(message);
                return Promise.reject(message);
            }
        });
    }
}
