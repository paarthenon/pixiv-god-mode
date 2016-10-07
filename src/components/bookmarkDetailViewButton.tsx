import * as React from 'react'

interface BookmarkDetailViewButtonProps {
	id? :string
	text :string
	clickAction :Function
}

export class BookmarkDetailViewButton extends React.Component<BookmarkDetailViewButtonProps,any> {
	public render() {
		return (
			<div id={this.props.id} 
				className="_button-lite-large" 
				onClick={() => this.props.clickAction()}
			>
				{this.props.text}
			</div>
			);
	}
}
