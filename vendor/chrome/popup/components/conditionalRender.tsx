import * as React from 'react'
import * as log4js from 'log4js'

export class ConditionalRender extends React.Component<{predicate: () => boolean | Promise<boolean>}, {render:boolean}> {
	state = {render: false}

	constructor(props:any){
		super(props);
		Promise.resolve(this.props.predicate()).then(render => this.setState({render}));
	}

	public render() {
		return (this.state.render)? <div>{this.props.children}</div> : null
	}
}