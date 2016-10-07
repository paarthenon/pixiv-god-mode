import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export enum GlobalDictUpdateState {
	LOADING,
	AVAILABLE,
	UPTODATE,
	DOWNLOADING
}

interface GlobalDictUpdaterProps {
	updateAvailable :boolean
	updateAction :Function
}

export class GlobalDictionaryUpdater extends React.Component<{mode: GlobalDictUpdateState, updateAction:Function}, void> {
	public render(){
		switch (this.props.mode) {
			case GlobalDictUpdateState.LOADING:
				return <div>Waiting on dictionary details</div>
			case GlobalDictUpdateState.UPTODATE:
				return <div>Dictionary is up to date</div>
			case GlobalDictUpdateState.AVAILABLE:
				return <div>Update available. <Bootstrap.Button onClick={() => this.props.updateAction()}>Update Dictionary</Bootstrap.Button></div>
			case GlobalDictUpdateState.DOWNLOADING:
				return <div>Downloading an update.</div>
		}
	}
}