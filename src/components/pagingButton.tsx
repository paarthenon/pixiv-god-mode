import * as React from 'react'

export interface PagingButtonProps {
	className :string
	tooltip :string
	rel :string
	href :string
}

export const PagingButton : React.StatelessComponent<PagingButtonProps> = props => {
	const fontSize = {
		fontSize: '.8em'
	};
	return (
		<a href={props.href} rel={props.rel} className="_button" title={props.tooltip} style={fontSize}>
			<span className={'pixiv-assistant'}><span className={`glyphicon ${props.className}`}></span></span>
		</a>
	)
}
