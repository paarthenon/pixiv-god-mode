import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export enum DownloadStates {
	LOADINGSTATUS,
	DOWNLOADAVAILABLE,
	DOWNLOADING,
	DOWNLOADED,
}

export const DownloadButton : React.StatelessComponent<{mode: DownloadStates, downloadFunc: Function}> = props => {
	switch (props.mode) {
		case DownloadStates.LOADINGSTATUS:
			return <Bootstrap.Button disabled>Loading Download Status</Bootstrap.Button>
		case DownloadStates.DOWNLOADAVAILABLE:
			return <Bootstrap.Button onClick={() => props.downloadFunc()}>Download</Bootstrap.Button>
		case DownloadStates.DOWNLOADING:
			return <Bootstrap.Button disabled>Downloading...</Bootstrap.Button>
		case DownloadStates.DOWNLOADED:
			return <Bootstrap.Button onClick={() => props.downloadFunc()}>Download Again</Bootstrap.Button>
	}
}
