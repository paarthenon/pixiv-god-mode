import * as log4js from 'log4js'

import ConfigObj from '../config'
import ConfigKeys from '../../../src/configKeys'

import {DictionaryManagementService} from '../../../src/core/dictionaryManagementService'
import {GithubDictionaryUtil} from '../../../src/core/githubDictionaryUtil'
import {PAServer} from '../../../src/core/paServer'

import Mailman from '../mailman'

let logger = log4js.getLogger('Services');

export var Config = new ConfigObj();

export var DictionaryService = new DictionaryManagementService(Config,
	new GithubDictionaryUtil('pixiv-assistant/dictionary', Mailman.Background.ajax),
	{
		local: ConfigKeys.user_dict,
		global: ConfigKeys.official_dict,
		cache: ConfigKeys.cached_dict,
	});

export var PixivAssistantServer = new PAServer(Config, Mailman.Background.ajax);
