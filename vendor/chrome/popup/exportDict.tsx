import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {CachedDictionaryService, cachedDictionary} from '../../../src/core/dictionaryManagementService'
import Config from '../config'
import ConfigKeys from '../../../src/configKeys'

let dict = new CachedDictionaryService(new Config(), {
	global: ConfigKeys.official_dict,
	local: ConfigKeys.user_dict,
	cache: ConfigKeys.cached_dict
});

export class DictionaryJSON extends React.Component<void,cachedDictionary> {
	state :cachedDictionary = {cache: []};
	constructor(){
		super();
		dict.cache.then(cache => this.setState(cache));
	}
	public render() {
		return <DictJSON cache={this.state.cache} />
	}
}

class DictJSON extends React.Component<cachedDictionary,void> {
	protected get formattedCache() {
		let contents = this.props.cache.map(entry => `"${entry.key}":"${entry.value}"`).join(',');
		return `{${contents}}`
	}
	public render() {
		return <div>
				{this.formattedCache}
			</div>
	}
}
