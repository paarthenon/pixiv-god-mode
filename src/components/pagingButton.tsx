import * as React from 'react'

export class PagingButton extends React.Component<{text:string, tooltip:string, rel:string, href:string},any> {
	public render() {
		return (
			<a href={this.props.href} rel={this.props.rel} className="_button" title={this.props.tooltip}>
				{this.props.text}
			</a>
			);
	}
}