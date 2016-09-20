import * as React from 'react'

export enum DownloadStates {
	LOADINGSTATUS,
	DOWNLOADAVAILABLE,
	DOWNLOADING,
	DOWNLOADED,
}

export class DownloadButton extends React.Component<{mode: DownloadStates, downloadFunc: Function},void> {
	public render() {
		switch (this.props.mode) {
			case DownloadStates.LOADINGSTATUS:
				return <p>Loading Download Status</p>
			case DownloadStates.DOWNLOADAVAILABLE:
				return <p><a href="#" onClick={this.props.downloadFunc.bind(this)}>Download</a></p>
			case DownloadStates.DOWNLOADING:
				return <p>Downloading</p>
			case DownloadStates.DOWNLOADED:
				return <p>Downloaded</p>
		}
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