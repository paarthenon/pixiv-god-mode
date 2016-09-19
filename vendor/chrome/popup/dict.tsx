import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
import * as ChromeUtils from '../utils'

import {cachedDictionary, cachedDictionaryEntry} from '../../../src/core/dictionaryManagementService'
import {DictionaryAdd} from './components/DictionaryAdd'

let InfiniteScroll = require('react-infinite-scroller');

type paDict = { [id:string]:string };

interface DictViewerProps {
	cachedDict: cachedDictionary
	getTranslation: (key:string) => Promise<string>
	onUpdate: (key:string, value:string) => any
	onDelete: (key:string) => any
	onAdd: (key:string, value:string) => any
}

interface DictViewerState {
	currentSearch:string
	loadCount:number
	hasMore:boolean
	visibleItems: cachedDictionaryEntry[]
}

export class DictViewer extends React.Component<DictViewerProps,DictViewerState> {
	state = { 
		currentSearch: '', 
		loadCount: 0, 
		hasMore: true, 
		visibleItems: [] as cachedDictionaryEntry[],
	};

	public get filteredData() {
		return this.props.cachedDict.cache
			.filter(entry => {
				return entry.key.toLocaleLowerCase().includes(this.state.currentSearch) 
					|| entry.value.toLocaleLowerCase().includes(this.state.currentSearch)
			})
	}
	public handleImport(japanese:string, translation:string) {
		this.props.onAdd(japanese, translation);
	}
	protected setSearch(value:string) {
		this.setState(Object.assign(this.state, {
			currentSearch:value.toLocaleLowerCase(),
		}));
		this.updateVisible();
	}
	protected updateVisible() {
		this.setState(Object.assign(this.state, {
			hasMore: this.state.loadCount < this.filteredData.length,
			visibleItems: this.filteredData.slice(0, this.state.loadCount),
		}))
	}
	protected loadMore(page:number) {
		let newCount = page * 20;
		let stateChanges = {
			loadCount: newCount,
			hasMore: newCount < this.filteredData.length,
			visibleItems: this.filteredData.slice(0, newCount),
		};
		this.setState(Object.assign(this.state, stateChanges));
	}

	public render() {
		return (
			<div>
				<DictionaryAdd onAdd={this.props.onAdd} getTranslation={this.props.getTranslation}/>
				<Bootstrap.Panel>
				<Search onChange={(value:any) => this.setSearch(value)} />
				{(this.filteredData.length > 0) ? 
					<div style={{height: '300px', overflow: 'auto'}}>
					<InfiniteScroll
						pageStart={0}
						loadMore={this.loadMore.bind(this)}
						hasMore = {this.state.hasMore}
						loader={<div>Loading</div>}
						useWindow={false}
					>
					{this.state.visibleItems.map(entry => {
						return (entry.local) ?
								<DictEntry 
									key={entry.key}
									japanese={entry.key} 
									translation={entry.value}
									hasGlobalDef={entry.hasGlobalDef}
									onUpdate={this.props.onUpdate}
									onDelete={this.props.onDelete}
								/>
							:
								<ReadOnlyDictEntry
									key={entry.key}
									japanese={entry.key}
									translation={entry.value}
									onImport={this.handleImport.bind(this)}
								/>
					})}
					</InfiniteScroll>
					</div>
				: null }
				</Bootstrap.Panel>
			</div>
		);
	}
}

let FormControl: React.ComponentClass<any> = (Bootstrap as any).FormControl;
let FormGroup: React.ComponentClass<any> = (Bootstrap as any).FormGroup;
let Form: React.ComponentClass<any> = (Bootstrap as any).Form;

class Search extends React.Component<{ onChange: (search: string) => any }, { current: string }> {
	state = { current: '' };

	public handleChange(event:React.FormEvent) {
		let newValue = (event.target as any).value;
		this.setState({ current: newValue });
		this.props.onChange(newValue);
	}
	public render() {
		return <FormControl type="text"
					placeholder="search" 
					value={this.state.current} 
					onChange={this.handleChange.bind(this)} 
				/>
	}
}

interface DictEntryPair {
	japanese:string
	translation:string
}
interface DictEntryProps extends DictEntryPair {
	hasGlobalDef?: boolean
	onUpdate:(key:string, value:string) => any
	onDelete:(key:string) => any
}
interface ReadOnlyDictEntryProps extends DictEntryPair {
	onImport:(key:string, value:string) => any
}

class DictEntry extends React.Component<DictEntryProps,{editOpen:boolean}> {
	state = { editOpen: false };
	public handleUpdate() {
		let translationInput :any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onUpdate(this.props.japanese, translationInput.value);
		this.setState({editOpen: false});
	}
	public handleDelete() {
		this.props.onDelete(this.props.japanese);
	}
	public handleSearch() {
		ChromeUtils.newTab("http://www.pixiv.net/search.php?s_mode=s_tag_full&word="+this.props.japanese)
	}
	public get deleteText() {
		return (this.props.hasGlobalDef) ? 'revert' : 'delete'
	}
	public render() {
		if (!this.state.editOpen)
			return <div>
				<span onClick={this.handleSearch.bind(this)}
					style={{cursor:'pointer','padding-left':'5px'}}
					className="glyphicon glyphicon-search" aria-hidden="true"></span>
				<b>{this.props.translation}</b>
				<span>{this.props.japanese}</span>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: true }) }>edit</Bootstrap.Button></span>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)}>{this.deleteText}</Bootstrap.Button></span>
			</div>
		else return <div>
				<b><input defaultValue={this.props.translation} ref="translation"></input></b>
				<span>{this.props.japanese}</span>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this) }>update</Bootstrap.Button></span>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: false }) }>cancel</Bootstrap.Button></span>
			</div>
	}
}

class ReadOnlyDictEntry extends React.Component<ReadOnlyDictEntryProps, void> {
	public handleImport() {
		this.props.onImport(this.props.japanese, this.props.translation);
	}
	public handleSearch() {
		ChromeUtils.newTab("http://www.pixiv.net/search.php?s_mode=s_tag_full&word="+this.props.japanese)
	}
	public render() {
		return <div>
			<span onClick={this.handleSearch.bind(this)}
				style={{cursor:'pointer','padding-left':'5px'}}
				className="glyphicon glyphicon-search" aria-hidden="true"></span>
			<b>{this.props.translation}</b>
			<span>{this.props.japanese}</span>
			<span></span>
			<span><Bootstrap.Button bsSize="xsmall" onClick={this.handleImport.bind(this)}>Import</Bootstrap.Button></span>
		</div>
	}
}