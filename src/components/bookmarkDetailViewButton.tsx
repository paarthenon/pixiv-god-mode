import * as React from 'react'

interface BookmarkDetailViewButtonProps {
	id? :string
	text :string
	clickAction :Function
}

export const BookmarkDetailViewButton : React.StatelessComponent<BookmarkDetailViewButtonProps> = props =>
	<div id={props.id} 
		className="_button-lite-large" 
		onClick={() => props.clickAction()}
	>
		{props.text}
	</div>
