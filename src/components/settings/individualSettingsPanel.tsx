import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export class IndividualSettingsPanel extends React.Component<{header:string}, void> {
	public render() {
		return <Bootstrap.Panel header={this.props.header}>
			{this.props.children}
		</Bootstrap.Panel>;
	}
}