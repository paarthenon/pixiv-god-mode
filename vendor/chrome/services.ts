import ConfigObj from 'vendor/chrome/config';
import ConfigKeys from 'src/configKeys';

import {DictionaryManagementService} from 'src/core/dictionaryManagementService';
import {GithubDictionaryUtil} from 'src/core/githubDictionaryUtil';
import {PAServer} from 'src/core/paServer';

import Mailman from 'vendor/chrome/mailman';

export var Config = new ConfigObj();

export var DictionaryService = new DictionaryManagementService(
    Config,
    new GithubDictionaryUtil('pixiv-assistant/dictionary', Mailman.Background.ajax),
    {
        local: ConfigKeys.user_dict,
        global: ConfigKeys.official_dict,
        cache: ConfigKeys.cached_dict,
    },
);

export var PixivAssistantServer = new PAServer(Config, Mailman.Background.ajax);
