import * as React from 'react'

export enum ConnectionStatus {
    Connected,
    Disconnected,
}

export const ServerStatus : React.StatelessComponent<{status:ConnectionStatus}> =
    ({status}) => (status === ConnectionStatus.Connected) ? <div>Server Connected</div> : <div>Server Disconnected</div>
