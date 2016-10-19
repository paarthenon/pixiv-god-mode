import * as React from 'react'

export const WorksNavbarRightButton : React.StatelessComponent<{text:string,clickAction:Function}> = props => 
	<ul style={{float: 'right'}}>
		<li>
			<a onClick={() => props.clickAction()} style={{cursor: 'pointer'}}>
				{props.text}
			</a>
		</li>
	</ul>
