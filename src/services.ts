import * as Deps from 'src/deps'
import ConfigKeys from 'src/configKeys'

import {PAServer} from 'src/core/paServer'
import {GoogleTranslateAPI as TranslateAPI} from 'src/core/googleTranslateAPI'

import {CachedDictionaryService} from 'src/core/dictionaryManagementService'

export var PixivAssistantServer = new PAServer(Deps.Container.config, Deps.Container.ajaxCall);

export var GoogleTranslateAPI = new TranslateAPI(Deps.Container.ajaxCall);

export var DictionaryService = new CachedDictionaryService(Deps.Container.config, {
	local: ConfigKeys.user_dict,
	global: ConfigKeys.official_dict,
	cache: ConfigKeys.cached_dict,
});
