import * as React from 'react'

import {PixivAssistantServer} from 'vendor/chrome/popup/services'

enum ConnectionStatus {
    Connected,
    Disconnected,
}
export class ServerStatusContainer extends React.Component<void, {status:ConnectionStatus}> {
    state = {status: ConnectionStatus.Disconnected};

    componentWillMount() {
        PixivAssistantServer.ping().then(() => this.setState({status: ConnectionStatus.Connected}))
    }

    public render() {
        return <ServerStatus status={this.state.status} />
    }
}
export class ServerStatus extends React.Component<{status:ConnectionStatus}, void> {
    public render() {
        if (this.props.status === ConnectionStatus.Connected) {
            return <div>Server Connected</div>
        } else {
            return <div>Server Disconnected</div>
        }
    }
}