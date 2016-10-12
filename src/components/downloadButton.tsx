import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {InjectBootstrap} from 'src/components/util/injectBootstrap'

export enum DownloadStates {
	LOADINGSTATUS,
	DOWNLOADAVAILABLE,
	DOWNLOADING,
	DOWNLOADED,
}

export class DownloadButton extends React.Component<{mode: DownloadStates, downloadFunc: Function},void> {
	public renderButton() {
		switch (this.props.mode) {
			case DownloadStates.LOADINGSTATUS:
				return <Bootstrap.Button disabled>Loading Download Status</Bootstrap.Button>
			case DownloadStates.DOWNLOADAVAILABLE:
				return <Bootstrap.Button onClick={() => this.props.downloadFunc()}>Download</Bootstrap.Button>
			case DownloadStates.DOWNLOADING:
				return <Bootstrap.Button disabled>Downloading...</Bootstrap.Button>
			case DownloadStates.DOWNLOADED:
				return <Bootstrap.Button disabled>Downloaded</Bootstrap.Button>
		}
	}
	public render() {
		let style = {
			textAlign: 'center',
			marginBottom: '20px',
		}
		return <div style={style}><InjectBootstrap>{this.renderButton()}</InjectBootstrap></div>
	}
}

export class DownloadButtonContainer extends React.Component<{existsFunc: () => Promise<boolean>, downloadFunc: () => Promise<void>}, {mode: DownloadStates}> {
	state = {mode: DownloadStates.LOADINGSTATUS}
	componentDidMount() {
		this.props.existsFunc().then(result => {
			if (result) {
				this.setState({mode: DownloadStates.DOWNLOADED})
			} else {
				this.setState({mode: DownloadStates.DOWNLOADAVAILABLE})
			}
		});
	}

	handleDownload(){
		this.setState({mode: DownloadStates.DOWNLOADING});
		this.props.downloadFunc().then(() => this.setState({mode: DownloadStates.DOWNLOADED}))
	}
	public render() {
		return <DownloadButton mode={this.state.mode} downloadFunc={this.handleDownload.bind(this)}/>
	}
}