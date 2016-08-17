import * as Msg from './messages'
import * as ChromeUtils from './utils'
import * as log4js from 'log4js';

import {AjaxRequest} from '../../src/core/IAjax'
import ConfigKeys from '../../src/configKeys'
import Config from './config'
import {DictionaryManagementService} from '../../src/core/dictionaryManagementService'
import {GithubDictionaryUtil} from '../../src/core/githubDictionaryUtil'
import {default as Mailman, defineImplementation} from './mailman'

let logger = log4js.getLogger('Background');

let localImpl = defineImplementation<Msg.Protocol>("BACKGROUND_PAGE", {
	getConfig: msg => {
		return ChromeUtils.getFromConfig(msg.key)
			.then(contents => {
				if (msg.key in contents) {
					return contents[msg.key];
				} else {
					return Promise.reject(`Key [${msg.key}] not found in data store`);
				}
			})
			.then(contents => ChromeUtils.handleError(contents))
			.then<Msg.ConfigGetResponse>(value => ({ value }));
	},
	setConfig: msg => {
		return ChromeUtils.setConfig(msg.key, msg.value)
			.then(ChromeUtils.handleError)
	},
	listConfig: () => {
		return ChromeUtils.listConfigKeys()
			.then(ChromeUtils.handleError)
	},
	ajax: req => {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();
			xhr.open(req.type, req.url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(req.data));
			xhr.onreadystatechange = () => {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(xhr.response);
				}
			}
		});
	},
	newTab: msg => {
		return ChromeUtils.newTab(msg.url);
	},
	isPageBookmarked: msg => {
		return ChromeUtils.isPageBookmarked(msg.url);
	}
});

// Note: Must use localImpl, chrome message passing does not send message if target and sender are the same.
function firstTimeSetup(){
	let dictionaryService = new DictionaryManagementService(new Config(localImpl), 
		new GithubDictionaryUtil('pixiv-assistant/dictionary', localImpl.ajax), {
			global: ConfigKeys.official_dict,
			local: ConfigKeys.user_dict,
			cache: ConfigKeys.cached_dict,
		});

	dictionaryService.global.then(globalDict => {
		if (Object.keys(globalDict).length === 0) {
			dictionaryService.updateGlobalDictionary();
		}
	})
}

firstTimeSetup();