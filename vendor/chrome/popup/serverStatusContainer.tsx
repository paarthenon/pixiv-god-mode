import * as React from 'react'

import {PixivAssistantServer} from 'vendor/chrome/services'
import {ConnectionStatus, ServerStatus} from 'src/components/serverStatus'

export class ServerStatusContainer extends React.Component<{}, {status:ConnectionStatus}> {
    state = {status: ConnectionStatus.Disconnected};

    componentWillMount() {
        PixivAssistantServer.ping().then(() => this.setState({status: ConnectionStatus.Connected}))
    }

    public render() {
        return <ServerStatus status={this.state.status} />
    }
}

