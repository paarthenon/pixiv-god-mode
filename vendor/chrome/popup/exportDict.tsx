import * as React from 'react'
import {cachedDictionary, naiveDictionary} from 'src/core/dictionaryManagementService'
import {ConditionalRender} from 'src/components/util/conditionalRender'

import {DictionaryService} from 'vendor/chrome/services'

interface DictStates {
	global: naiveDictionary
	local: naiveDictionary
	cache: cachedDictionary
}

export class DictionaryJSON extends React.Component<void,DictStates> {
	state :DictStates = {global: {}, local: {}, cache: {cache: []}};

	componentDidMount() {
		DictionaryService.cache.then(cache =>
			DictionaryService.global.then(global =>
				DictionaryService.local.then(local => this.setState({cache, global, local}))));
	}
	public render() {
		let style = {
			display: 'flex',
			'flex-direction': 'column',
		};

		return <div>
		<ConditionalRender predicate={() => DictionaryService.globalUpdateAvailable.then(x => !x)}>
			<div style={style}>
				<DictStats
					globalCount={Object.keys(this.state.global).length}
					localCount={Object.keys(this.state.local).length}
					cacheCount={this.state.cache.cache.length}
				/>
				<DictJSON cache={this.state.cache.cache} />
			</div>
		</ConditionalRender>
		<ConditionalRender predicate={() => DictionaryService.globalUpdateAvailable} default={true}>
			<p> Please sync your dictionary with the global dictionary before proceeding </p>
		</ConditionalRender>
		</div>

	}
}

interface DictStatsProps {
	globalCount: number
	localCount: number
	cacheCount: number
}
const DictStats : React.StatelessComponent<DictStatsProps> = props =>
	<div>
		<p>Global dictionary: {props.globalCount}</p>
		<p>User dictionary: {props.localCount}</p>
		<p>Combined dictionary: {props.cacheCount}</p>
	</div>

class DictJSON extends React.Component<cachedDictionary,void> {
	protected get formattedCache() {
		let contents = this.props.cache.map(entry => `\t"${entry.key}":"${entry.value}"`).join(',\n');
		return `{\n${contents}\n}\n`
	}
	public render() {
		return <textarea rows={20} value={this.formattedCache}></textarea>
	}
}
