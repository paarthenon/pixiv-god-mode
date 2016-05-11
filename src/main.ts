// import * as DomUtils from './utils/dom'
// import * as PathUtils from './utils/path'

import {dispatch} from './dispatch'
import {BasePage} from './pages/base'

import * as log4js from 'log4js'
import * as Dependencies from './deps'

import {DictionaryService} from './utils/dict'

export default function Bootstrap(depsContent: Dependencies.IDependencyContainer):BasePage {
	let logger = log4js.getLogger('Startup');
	logger.info('Bootstrapping');
	Dependencies.load(depsContent);
	DictionaryService.initialize(depsContent.config);
	return dispatch(document.location.href, depsContent.jQ);
}
