import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

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
				return <Bootstrap.Button disabled>Loading Download Status</Bootstrap.Button>
			case DownloadStates.DOWNLOADAVAILABLE:
				return <Bootstrap.Button onClick={() => this.props.downloadFunc()}>Download</Bootstrap.Button>
			case DownloadStates.DOWNLOADING:
				return <Bootstrap.Button disabled>Downloading...</Bootstrap.Button>
			case DownloadStates.DOWNLOADED:
				return <Bootstrap.Button onClick={() => this.props.downloadFunc()}>Download Again</Bootstrap.Button>
		}
	}
}
