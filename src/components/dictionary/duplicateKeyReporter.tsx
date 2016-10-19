import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export class DuplicateKeyReporter extends React.Component<{dupes: string[], removeAction:Function}, void> {
	public render() {
		return (this.props.dupes === undefined) ? null : <Bootstrap.InputGroup style={{width: '100%'}}>
			<Bootstrap.InputGroup.Addon style={{width: 'auto'}}>
				Found <strong>{this.props.dupes.length}</strong> duplicate entries. 
			</Bootstrap.InputGroup.Addon>
			{(this.props.dupes.length > 0) ? 
				<Bootstrap.InputGroup.Button>
					<Bootstrap.Button onClick={() => this.props.removeAction()} small>Revert Duplicates</Bootstrap.Button>
				</Bootstrap.InputGroup.Button> 
			: null }
		</Bootstrap.InputGroup>
	}
}