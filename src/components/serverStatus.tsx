import * as React from 'react'

export enum ConnectionStatus {
    Connected,
    Disconnected,
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
