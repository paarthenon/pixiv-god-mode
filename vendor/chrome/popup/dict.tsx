import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

import * as ChromeUtils from 'vendor/chrome/utils'
import {CachedDictionaryService, cachedDictionary, EntryType} from 'src/core/dictionaryManagementService'
import {DictionaryAdd} from 'vendor/chrome/popup/components/DictionaryAdd'
import {ConditionalRender} from 'vendor/chrome/popup/components/conditionalRender'

let InfiniteScroll = require('react-infinite-scroller'); //TODO: create typing
let removeDiacritics = require('diacritics').remove; //TODO: create typing

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
				</Bootstrap.Panel>				
				<Bootstrap.Panel>
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
						return (
							<DictEntry 
								key={entry.key}
								original={entry.key} 
								translation={entry.value}
								entryType={entry.type}
								onUpdate={this.props.onUpdate}
								onDelete={this.props.onDelete}
							/>
						);
							
					})}
					</InfiniteScroll>
					</div>
				: null }
				</Bootstrap.Panel>
			</div>
		);
	}
}

class Search extends React.Component<{ onChange: (search: string) => any }, { current: string }> {
	state = { current: '' };

	public handleChange(event:React.FormEvent) {
		let newValue = (event.target as any).value;
		this.setState({ current: newValue });
		this.props.onChange(newValue);
	}
	public render() {
		return <Bootstrap.FormControl type="text"
					placeholder="Search" 
					value={this.state.current} 
					onChange={this.handleChange.bind(this)} 
				/>
	}
}

interface DictEntryProps {
	original:string
	translation:string
	entryType: EntryType
	onUpdate:(key:string, value:string) => any
	onDelete:(key:string) => any
}

class DictEntry extends React.Component<DictEntryProps,{editOpen:boolean}> {
	state = { editOpen: false };
	public handleUpdate() {
		let translationInput :any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onUpdate(this.props.original, translationInput.value);
		this.setState({editOpen: false});
	}
	public handleDelete() {
		this.props.onDelete(this.props.original);
	}
	public handleSearch() {
		ChromeUtils.newTab("http://www.pixiv.net/search.php?s_mode=s_tag_full&word="+this.props.original)
	}
	public renderButton(type:EntryType) {
		switch (type) {
			case EntryType.GLOBAL:
				return <Bootstrap.Button bsSize="xsmall" disabled title="This entry is from the global dictionary and cannot be deleted">delete</Bootstrap.Button>;
			case EntryType.LOCAL:
				return <Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)}>delete</Bootstrap.Button>
			case EntryType.BOTH:
				return <Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)} title="This entry is also in the global dictionary. The local definition can be reverted after which the global definition will be used">revert</Bootstrap.Button>;
		}
	}

	public render() {
		let divStyle = {
			position: 'relative',
			padding: '3px',
		}
		let buttonStyle = {
			position: 'absolute',
			right: '0px',
			padding: '3px',
		}
		let iconStyle = {
			cursor:'pointer',
			'padding-right':'5px',
		}

		return <div style={divStyle}>
			<big><span onClick={this.handleSearch.bind(this)}
					style={iconStyle}
					className="glyphicon glyphicon-search" aria-hidden="true"></span></big>

			{ (!this.state.editOpen)?
				<big>{this.props.translation}</big>
				:
				<input defaultValue={this.props.translation} ref="translation"></input>
			}

			<small style={{color:'#999', marginLeft:'5px'}}>{this.props.original}</small>

			{ (!this.state.editOpen) ?
				<span style={buttonStyle}>
					<Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: true }) }>edit</Bootstrap.Button>
					{this.renderButton(this.props.entryType)}
				</span>
			:
				<span style={buttonStyle}>
					<Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this) }>update</Bootstrap.Button>
					<Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: false }) }>cancel</Bootstrap.Button>
				</span>
			}
		</div>
	}
}
