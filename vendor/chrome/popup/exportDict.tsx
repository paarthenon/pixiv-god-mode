import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {CachedDictionaryService, cachedDictionary, naiveDictionary} from '../../../src/core/dictionaryManagementService'
import Config from '../config'
import ConfigKeys from '../../../src/configKeys'

let dict = new CachedDictionaryService(new Config(), {
	global: ConfigKeys.official_dict,
	local: ConfigKeys.user_dict,
	cache: ConfigKeys.cached_dict
});

interface DictStates {
	global: naiveDictionary
	local: naiveDictionary
	cache: cachedDictionary
}

export class DictionaryJSON extends React.Component<void,DictStates> {
	state :DictStates = {global: {}, local: {}, cache: {cache: []}};

	style = {
		display: 'flex',
		'flex-direction': 'column',
	};

	constructor(){
		super();

		dict.cache.then(cache =>
			dict.global.then(global =>
				dict.local.then(local => this.setState({cache, global, local}))));
	}
	public render() {
		return <div style={this.style}>
			<DictStats
				globalCount={Object.keys(this.state.global).length}
				localCount={Object.keys(this.state.local).length}
				cacheCount={this.state.cache.cache.length}
			/>
			<DictJSON cache={this.state.cache.cache} />
		</div>
	}
}

class DictStats extends React.Component<{globalCount: number, localCount: number, cacheCount: number}, void> {
	public render() {
		return <div>
			<p>Global dictionary: {this.props.globalCount}</p>
			<p>User dictionary: {this.props.localCount}</p>
			<p>Combined dictionary: {this.props.cacheCount}</p>
		</div>
	}
}

class DictJSON extends React.Component<cachedDictionary,void> {
	protected get formattedCache() {
		let contents = this.props.cache.map(entry => `\t"${entry.key}":"${entry.value}"`).join(',\n');
		return `{\n${contents}\n}\n`
	}
	public render() {
		return <textarea rows="20" value={this.formattedCache}></textarea>
	}
}
