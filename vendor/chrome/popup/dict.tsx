import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

import * as ChromeUtils from '../utils'

type paDict = { [id:string]:string };

interface DictViewerProps {
	dict: paDict
	onUpdate: (key:string, value:string) => any
	onDelete: (key:string) => any
	onAdd: (key:string, value:string) => any
}

export class DictViewer extends React.Component<DictViewerProps,{currentSearch:string}> {
	state = { currentSearch: '' };

	public get filteredData() {
		return Object.keys(this.props.dict)
			.map(key => ({ key, value: this.props.dict[key] }))
			.filter(entry => entry.key.includes(this.state.currentSearch) || entry.value.includes(this.state.currentSearch))
			.sort((a,b) => a.value.localeCompare(b.value))
	}
	public render() {
		return (
			<div>
				<DictAdd onAdd={this.props.onAdd} />
				<Search onChange={(value) => this.setState({currentSearch:value})} />
				<Bootstrap.Table condensed>
				<colgroup>
					<col style={{ width: '50%', textAlign: 'center' }}></col>
					<col style={{ width: '50%', textAlign: 'center' }}></col>
					<col style={{ width: '62px'}}></col>
					<col style={{ width: '60px'}}></col>
				</colgroup>
				<thead>
				<tr>
					<th>Japanese</th>
					<th>English</th>
					<th></th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{this.filteredData.map(entry => 
					<DictEntry 
						key={entry.key}
						japanese={entry.key} 
						translation={entry.value}
						onUpdate={this.props.onUpdate}
						onDelete={this.props.onDelete}
					/>
				)}
				</tbody>
				</Bootstrap.Table>
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
		return <Bootstrap.Well>
				<FormControl type="text"
					placeholder="search" 
					value={this.state.current} 
					onChange={this.handleChange.bind(this)} 
				/>
			</Bootstrap.Well>
	}
}

class DictAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	public handleAdd(){
		let japaneseInput: any = ReactDOM.findDOMNode(this.refs['japanese']);
		let translationInput: any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onAdd(japaneseInput.value, translationInput.value)

		// Clear the form now that the entry has been saved.
		japaneseInput.value = '';
		translationInput.value = '';
	}
	public render() {
		return <Bootstrap.Panel header="Add Translation">
			<Form inline>
					<FormControl type="text" placeholder="japanese" ref="japanese" />
					<FormControl type="text" placeholder="translation" ref="translation" />
					<Bootstrap.Button onClick={this.handleAdd.bind(this)}>add</Bootstrap.Button>
			</Form>
		</Bootstrap.Panel>
	}
}

interface DictEntryProps {
	japanese:string
	translation:string
	onUpdate:(key:string, value:string) => any
	onDelete:(key:string) => any
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
	public render() {
		if (!this.state.editOpen)
			return <tr>
				<td>{this.props.japanese}</td>
				<td>
					{this.props.translation}
					<span onClick={this.handleSearch.bind(this)}
						style={{cursor:'pointer','padding-left':'5px'}}
						className="glyphicon glyphicon-search" aria-hidden="true"></span>
				</td>
				<td class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: true }) }>edit</Bootstrap.Button></td>
				<td class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)}>delete</Bootstrap.Button></td>
			</tr>
		else return <tr>
				<td>{this.props.japanese}</td>
				<td><input defaultValue={this.props.translation} ref="translation"></input></td>
				<td class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this) }>update</Bootstrap.Button></td>
				<td class="text-right"><Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: false }) }>cancel</Bootstrap.Button></td>
			</tr>
	}
}
