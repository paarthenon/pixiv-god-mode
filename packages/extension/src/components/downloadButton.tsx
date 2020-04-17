import * as React from 'react';
import * as Bootstrap from 'react-bootstrap';

export enum DownloadStates {
    LOADINGSTATUS,
    DOWNLOADAVAILABLE,
    DOWNLOADING,
    DOWNLOADED,
}

export const DownloadButton: React.FC<{
    mode: DownloadStates;
    downloadFunc: Function;
    bsStyle?: string;
}> = props => {
    switch (props.mode) {
        case DownloadStates.LOADINGSTATUS:
            return (
                <Bootstrap.Button disabled bsStyle={props.bsStyle}>
                    Loading Download Status
                </Bootstrap.Button>
            );
        case DownloadStates.DOWNLOADAVAILABLE:
            return (
                <Bootstrap.Button
                    onClick={() => props.downloadFunc()}
                    bsStyle={props.bsStyle}
                >
                    Download
                </Bootstrap.Button>
            );
        case DownloadStates.DOWNLOADING:
            return (
                <Bootstrap.Button disabled bsStyle={props.bsStyle}>
                    Downloading...
                </Bootstrap.Button>
            );
        case DownloadStates.DOWNLOADED:
            return (
                <Bootstrap.Button
                    onClick={() => props.downloadFunc()}
                    bsStyle={props.bsStyle}
                >
                    Download Again
                </Bootstrap.Button>
            );
    }
};
