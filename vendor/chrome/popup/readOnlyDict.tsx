import * as React from 'react'
import * as ReactDOM from 'react-dom'

type paDict = { [id:string]:string };

interface DictViewerProps {
	dict: paDict
}

export class ReadOnlyDictViewer extends React.Component<DictViewerProps,void> {
	public render() {
		console.log('dict',this.props.dict);
		return (
			<div>
				{Object.keys(this.props.dict).map(key => 
					<DictEntry 
						key={key}
						japanese={key} 
						translation={this.props.dict[key]}
					/>
				)}
			</div>
		);
	}
}

interface DictEntryProps {
	japanese:string
	translation:string
}

export class DictEntry extends React.Component<DictEntryProps,void> {
	public render() {
		return <div>
			<span>{ this.props.japanese } </span>
			<span> { this.props.translation } </span>
			</div>
	}
}
