import * as Msg from './messages'
import * as ChromeUtils from './utils'
import * as log4js from 'log4js';

import {AjaxRequest} from '../../src/core/IAjax'
import {defineImplementation} from './mailman'

let logger = log4js.getLogger('Background');

defineImplementation<Msg.Protocol>("BACKGROUND_PAGE", {
	getConfig: msg => {
		return ChromeUtils.getFromConfig(msg.key)
			.then(contents => {
				if (msg.key in contents) {
					return contents[msg.key];
				} else {
					return Promise.reject('Key not found in data store');
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
			console.log('request made with ', req);
			let xhr = new XMLHttpRequest();
			xhr.open(req.type, req.url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(req.data));
			xhr.onreadystatechange = () => {
				console.log('xhr state changed', xhr);
				if (xhr.readyState == XMLHttpRequest.DONE) {
					resolve(xhr.response);
				}
			}
		});
	}
});