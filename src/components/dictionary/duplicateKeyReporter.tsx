import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export const DuplicateKeyReporter : React.StatelessComponent<{dupes: string[], removeAction:Function}> = 
	({dupes, removeAction}) => (dupes === undefined) ? null : 
		<Bootstrap.InputGroup style={{width: '100%'}}>
			<Bootstrap.InputGroup.Addon style={{width: 'auto'}}>
				Found <strong>{dupes.length}</strong> duplicate entries. 
			</Bootstrap.InputGroup.Addon>
			{(dupes.length > 0) ? 
				<Bootstrap.InputGroup.Button>
					<Bootstrap.Button onClick={() => removeAction()} small>Revert Duplicates</Bootstrap.Button>
				</Bootstrap.InputGroup.Button> 
			: null }
		</Bootstrap.InputGroup>