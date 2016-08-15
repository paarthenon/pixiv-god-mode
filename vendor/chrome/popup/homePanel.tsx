import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'

import ConfigKeys from '../../../src/configKeys'
import {CachedDictionaryService} from '../../../src/core/dictionaryManagementService'
import Config from '../config'

import {DictionaryAdd} from './components/DictionaryAdd'

let logger = log4js.getLogger('HomePanel');

let dict = new CachedDictionaryService(new Config(), {
	global: ConfigKeys.official_dict,
	local: ConfigKeys.user_dict,
	cache: ConfigKeys.cached_dict
});

export class HomePanel extends React.Component<any,any> {
	public render() {
		return (
			<div>
				<DictionaryAdd onAdd={(key,value) => dict.update(key, value)} />
				<p>Go to the settings page and update the global dictionary. This will happen automatically soon.</p>
				<p>Home screen unfinished</p>
				<p>TBD</p>
				<p>Server status: See tab for now.</p>
			</div>
			);
	}
}
