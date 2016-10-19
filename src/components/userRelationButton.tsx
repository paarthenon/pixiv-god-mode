import * as React from 'react'

export const UserRelationButton : React.StatelessComponent<{text:string,clickAction:Function}> = props => 
	<a onClick={() => props.clickAction()} className="follow">{props.text}</a>
