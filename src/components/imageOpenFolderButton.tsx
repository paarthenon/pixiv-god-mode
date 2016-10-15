import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export class ImageOpenFolderButton extends React.Component<{openFunc: () => Promise<void>}, void> {
	handleOpen(){
		this.props.openFunc();
	}
	public render() {
        return <Bootstrap.Button onClick={() => this.handleOpen()}>Open</Bootstrap.Button>
	}
}
