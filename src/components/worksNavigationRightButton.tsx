import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {InjectBootstrap} from 'src/components/util/injectBootstrap'

export const WorksNavbarRightButton : React.StatelessComponent<{text:string,clickAction:Function}> = props => 
	<ul style={{float: 'right'}}>
		<li>
			<InjectBootstrap>
			<Bootstrap.Button onClick={() => props.clickAction()} style={{cursor: 'pointer'}} small>
				{props.text}
			</Bootstrap.Button>
			</InjectBootstrap>
		</li>
	</ul>
