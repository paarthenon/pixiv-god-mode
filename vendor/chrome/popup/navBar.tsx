import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {ServerStatusContainer} from 'vendor/chrome/popup/serverStatus'

export class PopupNavbar extends React.Component<void, void> {
	handleOpenSettings() {
		chrome.runtime.openOptionsPage();		
	}
	public render() {
		let noBottomMargin = {
			marginBottom: '0'
		}
		let componensateTitleMargin = {
			marginLeft: '-45px'
		}
		
		return <Bootstrap.Navbar staticTop style={noBottomMargin}>
			<Bootstrap.Navbar.Header>
				<Bootstrap.Navbar.Brand >
					<a style={componensateTitleMargin}>Pixiv Assistant</a>
				</Bootstrap.Navbar.Brand>
			</Bootstrap.Navbar.Header>
			<Bootstrap.Nav pullRight>
				<Bootstrap.NavItem>
					<ServerStatusContainer />
				</Bootstrap.NavItem>
				<Bootstrap.NavItem onClick={this.handleOpenSettings.bind(this)}>Settings</Bootstrap.NavItem>
			</Bootstrap.Nav>
		</Bootstrap.Navbar>
	}
}