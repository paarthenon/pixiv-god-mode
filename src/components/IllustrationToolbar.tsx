import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'

import {InjectBootstrap} from 'src/components/util/injectBootstrap'
import {DownloadButton, DownloadStates} from 'src/components/downloadButton'
import {ImageOpenFolderButton} from 'src/components/imageOpenFolderButton'

interface IllustrationToolbarProps {
    mode :DownloadStates
    downloadInBrowser :Function
    downloadUsingServer :Function
    openToImage :Function
    serverConnected :boolean
    progressText :string
}
export class IllustrationToolbar extends React.Component<IllustrationToolbarProps, void> {
    public render() {
        return <InjectBootstrap>
            <Bootstrap.InputGroup style={{width: 'auto', margin: 'auto', marginBottom: '20px'}}>
                <Bootstrap.InputGroup.Button style={{width: 'auto'}}>
                    <Bootstrap.Dropdown id="pa-download-dropdown">
                        {(this.props.serverConnected)?
                            <DownloadButton downloadFunc={this.props.downloadUsingServer} mode={this.props.mode} />
                            :
                            <Bootstrap.Button onClick={() => this.props.downloadInBrowser()}>Download</Bootstrap.Button>
                        }
                        <Bootstrap.Dropdown.Toggle/>
                        <Bootstrap.Dropdown.Menu>
                            <Bootstrap.MenuItem eventKey="1" onClick={() => this.props.downloadInBrowser()}>Download w/ Chrome</Bootstrap.MenuItem>
                            <Bootstrap.MenuItem eventKey="2" disabled={!this.props.serverConnected} onClick={() => this.props.downloadUsingServer()}>Download w/ Server</Bootstrap.MenuItem>
                        </Bootstrap.Dropdown.Menu>
                    </Bootstrap.Dropdown>
                    <Bootstrap.Button 
                        disabled={!(this.props.serverConnected && this.props.mode === DownloadStates.DOWNLOADED)} 
                        onClick={() => this.props.openToImage()}
                    >Open</Bootstrap.Button>
                </Bootstrap.InputGroup.Button>
                <Bootstrap.InputGroup.Addon style={{width: 'auto'}}>{this.props.progressText}</Bootstrap.InputGroup.Addon>
            </Bootstrap.InputGroup>
        </InjectBootstrap>
    }
}

export interface IllustrationToolbarContainerProps {
    existsFunc :() => Promise<boolean>
    downloadInBrowser :() => Promise<void>
    downloadUsingServer :() => Promise<void>
    openToImage :() => Promise<void>
}
interface ContainerState {
    serverConnected :boolean
    mode :DownloadStates
    progressText :string
}
export class IllustrationToolbarContainer extends React.Component<IllustrationToolbarContainerProps, ContainerState> {

    protected patchState<Sub, Full extends Sub & ContainerState>(original:Full, sub:Sub) {
        this.setState(Object.assign(original, sub));
    }

	componentWillMount() {
        this.state = {
            serverConnected: false,
            mode: DownloadStates.LOADINGSTATUS,
            progressText: 'Ready (Checking for server connection)',
        }
        
		this.props.existsFunc().then(result => {
            let dState = {
                // If we got a result, the server connected.
                serverConnected: true,
                // Set image downloaded state.
                mode: (result) ? DownloadStates.DOWNLOADED : DownloadStates.DOWNLOADAVAILABLE,
                progressText: (result) ? 'Image is already downloaded' : 'Ready (Connected)'
            }
            
            this.patchState(this.state, dState);
		}).catch(() => {
            this.patchState(this.state, {
                progressText: 'Ready (Browser Only)'
            })
        })
	}

    protected updateProgress(progressText?:string) {
        if (progressText != undefined) {
            this.patchState(this.state, {progressText});
        }
    }

    public handleBrowserDownload() {
        this.props.downloadInBrowser();
    }
    public handleServerDownload() {
        this.patchState(this.state, {mode: DownloadStates.DOWNLOADING});
        this.props.downloadUsingServer().then(() => {
            this.patchState(this.state, {mode: DownloadStates.DOWNLOADED});
        });
    }

	public render() {
		return <IllustrationToolbar
            mode={this.state.mode}
            progressText={this.state.progressText}
            serverConnected={this.state.serverConnected}

            downloadInBrowser={this.handleBrowserDownload.bind(this)}
            downloadUsingServer={this.handleServerDownload.bind(this)}
            openToImage={this.props.openToImage}
        />
	}
}
