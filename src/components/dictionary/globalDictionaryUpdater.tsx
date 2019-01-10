import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

export enum GlobalDictUpdateState {
	LOADING,
	AVAILABLE,
	UPTODATE,
	DOWNLOADING
}

export class GlobalDictionaryUpdater extends React.Component<{mode: GlobalDictUpdateState, updateAction:Function}, {}> {
	protected dictionaryStatusText(){
		switch (this.props.mode) {
			case GlobalDictUpdateState.LOADING:
				return <div>Waiting on dictionary details</div>
			case GlobalDictUpdateState.UPTODATE:
				return <div>Dictionary is up to date</div>
			case GlobalDictUpdateState.AVAILABLE:
				return <div>Update available. </div>
			case GlobalDictUpdateState.DOWNLOADING:
				return <div>Downloading an update.</div>
		}
	}
	public render() {
		return <Bootstrap.InputGroup>
			<Bootstrap.InputGroup.Addon>
				{this.dictionaryStatusText()}
			</Bootstrap.InputGroup.Addon>
			{(this.props.mode === GlobalDictUpdateState.AVAILABLE) ? 
				<Bootstrap.InputGroup.Button>
					<Bootstrap.Button onClick={() => this.props.updateAction()}>Update Dictionary</Bootstrap.Button>
				</Bootstrap.InputGroup.Button> 
			: null }
		</Bootstrap.InputGroup>
	}
}