import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

/**
 * Panel container in the options page 
 */
export class IndividualSettingsPanel extends React.Component<{header:string}, {}> {
	public render() {
		return <Bootstrap.Panel>
			<Bootstrap.Panel.Heading>{this.props.header}</Bootstrap.Panel.Heading>
			{this.props.children}
		</Bootstrap.Panel>;
	}
}