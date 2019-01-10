import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

/**
 * Panel container in the options page 
 */
export class IndividualSettingsPanel extends React.Component<{header:string}, {}> {
	public render() {
		return <Bootstrap.Panel header={this.props.header}>
			{this.props.children}
		</Bootstrap.Panel>;
	}
}