import {dispatch} from './dispatch'
import {BasePage} from './pages/base'

import * as log4js from 'log4js'
import * as Dependencies from './deps'

import {DictionaryService} from './utils/dict'

import ConfigKeys from './configKeys'

function firstTimeSetup(deps: Dependencies.IDependencyContainer){
	/* Server Url */
	deps.config.get(ConfigKeys.server_url).catch(reason => {
		let url = window.prompt('url?');
		deps.config.set(ConfigKeys.server_url, url)
			.then(() => window.alert('thanks!'))
			.catch(() => window.alert('whoops... that didn\'t work. Lets try again later'));
	})

	
}
export default function Bootstrap(depsContent: Dependencies.IDependencyContainer):BasePage {
	let logger = log4js.getLogger('Startup');
	logger.info('Bootstrapping');
	Dependencies.load(depsContent);

	firstTimeSetup(depsContent);

	DictionaryService.initialize(depsContent.config);
	return dispatch(document.location.href, depsContent.jQ);
}
