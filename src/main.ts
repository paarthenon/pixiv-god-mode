import * as log4js from 'log4js'

import {dispatch} from './dispatch'
import {BasePage} from './pages/base'

import * as Dependencies from './deps'

import {DictionaryService} from './utils/dict'

import ConfigKeys from './configKeys'

let logger = log4js.getLogger('Startup');
logger.info('Bootstrapping');

function firstTimeSetup(deps: Dependencies.IDependencyContainer){
	/* Server Url */
	deps.config.get(ConfigKeys.server_url).catch(reason => {
		let url = window.prompt('url?');
		deps.config.set(ConfigKeys.server_url, url)
			.then(() => window.alert('thanks!'))
			.catch(() => window.alert('whoops... that didn\'t work. Lets try again later'));
	});

	/* Initialize Dictionary */
	deps.config.get(ConfigKeys.official_dict_hash)
		.catch(() => {
			logger.warn('Global dictionary info not found, assuming first time load and redownloading');
			DictionaryService.updateDictionary()
				.then(() => logger.info('successfully downloaded new dictionary'))
				.catch(() => logger.error('failed to download new dictionary'))
		});

	deps.config.get(ConfigKeys.user_dict)
		.catch(() => deps.config.set(ConfigKeys.user_dict, {}));

	
}
export default function Bootstrap(depsContent: Dependencies.IDependencyContainer):BasePage {
	Dependencies.load(depsContent);

	firstTimeSetup(depsContent);

	DictionaryService.initialize(depsContent.config);
	return dispatch(document.location.href, depsContent.jQ);
}
