import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

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
	}
	public render() {
		return (
			<div>
				<DictAdd onAdd={this.props.onAdd} />
				<Search onChange={(value) => this.setState({currentSearch:value})} />
				{this.filteredData.map(entry => 
					<DictEntry 
						key={entry.key}
						japanese={entry.key} 
						translation={entry.value}
						onUpdate={this.props.onUpdate}
						onDelete={this.props.onDelete}
					/>
				)}
			</div>
		);
	}
}

let FormControl: React.ComponentClass<any> = (Bootstrap as any).FormControl;
let FormGroup: React.ComponentClass<any> = (Bootstrap as any).FormGroup;
let Form: React.ComponentClass<any> = (Bootstrap as any).Form;

export class Search extends React.Component<{ onChange: (search: string) => any }, { current: string }> {
	state = { current: '' };

	public handleChange(event:React.FormEvent) {
		let newValue = (event.target as any).value;
		this.setState({ current: newValue });
		this.props.onChange(newValue);
	}
	public render() {
		return <div>
				<FormControl type="text"
					placeholder="search" 
					value={this.state.current} 
					onChange={this.handleChange.bind(this)} 
				/>
			</div>
	}
}

export class DictAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	public handleAdd(){
		let japaneseInput: any = ReactDOM.findDOMNode(this.refs['japanese']);
		let translationInput: any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onAdd(japaneseInput.value, translationInput.value)
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

export class DictEntry extends React.Component<DictEntryProps,{editOpen:boolean}> {
	state = { editOpen: false };
	public handleUpdate() {
		let translationInput :any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onUpdate(this.props.japanese, translationInput.value);
		this.setState({editOpen: false});
	}
	public handleDelete() {
		this.props.onDelete(this.props.japanese);
	}
	public render() {
		return <div> {(!this.state.editOpen) ? (
				<div>
					<span>{this.props.japanese}</span>
					<span>{this.props.translation}</span>
					<Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({ editOpen: true })}>edit</Bootstrap.Button>
					<Bootstrap.Button bsSize="xsmall" onClick={this.handleDelete.bind(this)}>delete</Bootstrap.Button>
				</div>
			):(
				<div>
					<span>{this.props.japanese}</span>
					<input defaultValue={this.props.translation} ref="translation"></input>
					<Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this)}>update</Bootstrap.Button>
					<Bootstrap.Button bsSize="xsmall" onClick={() => this.setState({editOpen: false})}>cancel</Bootstrap.Button>
				</div>
			)
		}</div>
	}
}
