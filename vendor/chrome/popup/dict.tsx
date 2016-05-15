import * as React from 'react'
import * as ReactDOM from 'react-dom'

type paDict = { [id:string]:string };

interface DictViewerProps {
	dict: paDict
	onUpdate: (key:string, value:string) => any
	onDelete: (key:string) => any
	onAdd: (key:string, value:string) => any
}

export class DictViewer extends React.Component<DictViewerProps,void> {
	public handleUpdate(key:string, newValue:string) {
		console.log('updated', key, newValue)
		this.props.onUpdate(key, newValue);
	}

	public handleDelete(key:string) {
		console.log('deleted', key);
		this.props.onDelete(key);
	}
	public handleAdd(key:string, newValue: string) {
		console.log('adding', key, newValue);
		this.props.onAdd(key, newValue);
	}
	public render() {
		return (
			<div>
				<DictAdd onAdd={this.handleAdd.bind(this)} />
				{Object.keys(this.props.dict).map(key => 
					<DictEntry 
						key={key}
						japanese={key} 
						translation={this.props.dict[key]}
						onUpdate={this.handleUpdate.bind(this)}
						onDelete={this.handleDelete.bind(this)}
					/>
				)}
			</div>
		);
	}
}

export class DictAdd extends React.Component<{onAdd:(key:string,value:string)=>any},void> {
	public handleAdd(){
		console.log('adder working');
		let japaneseInput: any = ReactDOM.findDOMNode(this.refs['japanese']);
		let translationInput: any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onAdd(japaneseInput.value, translationInput.value)
	}
	public render() {
		return <div>
			<input placeholder="japanese" ref="japanese"></input>
			<input placeholder="translation" ref="translation"></input>
			<button onClick={(e) => this.handleAdd()}>add</button>
		</div>
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
					<button onClick={() => this.setState({editOpen: true})}>edit</button>
					<button onClick={this.handleDelete.bind(this)}>delete</button>
				</div>
			):(
				<div>
					<span>{this.props.japanese}</span>
					<input defaultValue={this.props.translation} ref="translation"></input>
					<button onClick={this.handleUpdate.bind(this)}>update</button>
					<button onClick={() => this.setState({editOpen: false})}>cancel</button>
				</div>
			)
		}</div>
	}
}
