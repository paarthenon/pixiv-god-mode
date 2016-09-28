import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
// import * as log4js from 'log4js'

import * as ChromeUtils from 'vendor/chrome/utils'
import {CachedDictionaryService, cachedDictionary} from 'src/core/dictionaryManagementService'
import {DictionaryAdd} from 'vendor/chrome/popup/components/DictionaryAdd'
import {ConditionalRender} from 'vendor/chrome/popup/components/conditionalRender'

let InfiniteScroll = require('react-infinite-scroller'); //TODO: create typing
let removeDiacritics = require('diacritics').remove; //TODO: create typing

// let logger = log4js.getLogger('Dictionary Panel');

export class DictContainer extends React.Component<{dictService: CachedDictionaryService}, cachedDictionary> {
	state :cachedDictionary = { cache: [] };

	componentDidMount() {
		this.updateDict();
	}

	updateDict() :void {
		this.props.dictService.cache
			.then(cachedDict => this.setState(cachedDict))
			.catch(error => console.error(error));
	}

	handleUpdate(key:string, value:string) :void {
		this.props.dictService.update(key, value).then(() => this.updateDict());
	}

	handleDelete(key:string) {
		this.props.dictService.delete(key).then(() => this.updateDict());
	}

	public render() {
		return <DictViewer
			cachedDict={this.state}
			getTranslation={key => this.props.dictService.getTranslation(key)}
			onAdd={this.handleUpdate.bind(this)}
			onUpdate={this.handleUpdate.bind(this)}
			onDelete={this.handleDelete.bind(this)}
		/>
	}
}

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
}

export class DictViewer extends React.Component<DictViewerProps,DictViewerState> {
	state = { 
		currentSearch: '', 
		loadCount: 0, 
		hasMore: true, 
	};

	public get filteredData() {
		return this.props.cachedDict.cache
			.filter(entry => {
				let latinKey = removeDiacritics(entry.key.toLocaleLowerCase());
				let latinValue = removeDiacritics(entry.value.toLocaleLowerCase());
				let latinSearch = removeDiacritics(this.state.currentSearch);
				return latinKey.includes(latinSearch)
					|| latinValue.includes(latinSearch)
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
		}))
	}
	protected loadMore(page:number) {
		let newCount = page * 20;
		let stateChanges = {
			loadCount: newCount,
			hasMore: newCount < this.filteredData.length,
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
					<div style={{height: '320px', overflow: 'auto'}}>
					<InfiniteScroll
						pageStart={0}
						loadMore={this.loadMore.bind(this)}
						hasMore = {this.state.hasMore}
						loader={<div>Loading</div>}
						useWindow={false}
						className="striped"
					>
					{this.filteredData.slice(0, this.state.loadCount).map(entry => {
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
				<big><span onClick={this.handleSearch.bind(this)}
					style={{cursor:'pointer','padding-left':'5px'}}
					className="glyphicon glyphicon-search" aria-hidden="true"></span>
				{this.props.translation}</big>
				<small style={{color:'#999'}}>{this.props.japanese}</small>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: true }) }>edit</Bootstrap.Button></span>
				<span class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)}>{this.deleteText}</Bootstrap.Button></span>
			</div>
		else return <div>
				<big><input defaultValue={this.props.translation} ref="translation"></input></big>
				<small style={{color:'#999'}}>{this.props.japanese}</small>
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
			<big><span onClick={this.handleSearch.bind(this)}
				style={{cursor:'pointer','padding-right':'5px'}}
				className="glyphicon glyphicon-search" aria-hidden="true"></span>
			{this.props.translation}</big>
			<small style={{color:'#999'}}>{this.props.japanese}</small>
			<span><Bootstrap.Button bsSize="xsmall" onClick={this.handleImport.bind(this)}>Import</Bootstrap.Button></span>
		</div>
	}
}
