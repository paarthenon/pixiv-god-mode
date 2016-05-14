import * as React from 'react'

type paDict = { [id:string]:string };
export class DictViewer extends React.Component<{dictConfigKey:string},{dict:paDict}> {

	constructor(props:any) {
		super(props);
		this.state.dict = {};
	}

	public handleUpdate(key:string, newValue:string) {

	}

	public render() {
		return (
			<div>
				{Object.keys(this.state.dict).map(key => 
					<DictEntry 
							japanese={key} 
							translation={this.state.dict[key]}
							onUpdate = {this.handleUpdate}
					/>) }
			</div>
			);
	}
}

interface DictEntryProps {
	japanese:string
	translation:string
	onUpdate:(key:string, value:string) => any
}
export class DictEntry extends React.Component<DictEntryProps,void> {
	public handleUpdate() {
		this.props.onUpdate(this.props.japanese, this.props.translation);
	}
	public render() {
		return <div>
				<span>{this.props.japanese}</span>
				<input value={this.props.translation}></input>
				<button onClick={this.handleUpdate}>update</button>
			</div>
	}
}
