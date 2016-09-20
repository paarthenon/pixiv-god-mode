import * as log4js from 'log4js'

import * as Deps from './deps'
import ConfigKeys from './configKeys'

import {PAServer} from './core/paServer'
import {GoogleTranslateAPI as TranslateAPI} from './core/googleTranslateAPI'

import {CachedDictionaryService} from './core/dictionaryManagementService'

let logger = log4js.getLogger('Services');

export var PixivAssistantServer = new PAServer(Deps.Container.config, Deps.Container.ajaxCall);

export var GoogleTranslateAPI = new TranslateAPI(Deps.Container.ajaxCall);

export var DictionaryService = new CachedDictionaryService(Deps.Container.config, {
	local: ConfigKeys.user_dict,
	global: ConfigKeys.official_dict,
	cache: ConfigKeys.cached_dict,
});
