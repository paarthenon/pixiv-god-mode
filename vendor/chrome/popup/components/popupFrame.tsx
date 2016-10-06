import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

class Navigation extends React.Component<void, void> {
	public render() {
		let noBottomMargin = {
			marginBottom: '0'
		}
		return <Bootstrap.Navbar staticTop style={noBottomMargin}>
			<Bootstrap.Navbar.Header>
				<Bootstrap.Navbar.Brand>
					<a>Pixiv Assistant</a>
				</Bootstrap.Navbar.Brand>
			</Bootstrap.Navbar.Header>
			<Bootstrap.Nav pullRight>
				<Bootstrap.NavItem>Settings</Bootstrap.NavItem>
			</Bootstrap.Nav>
		</Bootstrap.Navbar>
	}
}

export class PopupFrame extends React.Component<void, void> {
	protected style = {
		width: '800px',
		height: '600px',
		display: 'flex',
		'flex-direction': 'column',
	};

	public render() {
		let navStyle = {
			flex: 1,
		}
		let contentStyle = {
			flex: 1,
			background: '#f5f5f5',
			padding: '15px',
			display: 'flex',
			'flex-direction': 'column',
		};
		let innerStyle = {
			flex: 1,
			display: 'flex',
			'flex-direction': 'column',
		}

		return (
			<div style={this.style}>
				<Navigation/>
				<div style={contentStyle}>
					<div style={innerStyle}>{this.props.children}</div>
				</div>
			</div>
			);
	}
}
