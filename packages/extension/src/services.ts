import * as Deps from 'src/deps';
import ConfigKeys from 'src/configKeys';

import {PAServer} from 'src/core/paServer';
import {GoogleTranslateAPI as TranslateAPI} from 'src/core/googleTranslateAPI';

import {CachedDictionaryService} from 'src/core/dictionaryManagementService';

/**
 * No idea if this is supposed to be evil or not. This is somewhat analagous to a spring.xml,
 * I provide base instantiations of service entities. I don't have a DI framework so this seemed like
 * the convenient way of handling it without being entirely stupid.
 */

export var PixivAssistantServer = new PAServer(
    Deps.Container.config,
    Deps.Container.ajaxCall,
);

export var GoogleTranslateAPI = new TranslateAPI(Deps.Container.ajaxCall);

export var DictionaryService = new CachedDictionaryService(Deps.Container.config, {
    local: ConfigKeys.user_dict,
    global: ConfigKeys.official_dict,
    cache: ConfigKeys.cached_dict,
});
