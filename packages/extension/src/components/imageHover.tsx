import * as React from 'react';
import {DownloadStates, DownloadButton} from 'src/components/downloadButton';
import {InjectBootstrap} from 'src/components/util/injectBootstrap';

export const containerClass = 'pa-img-hover-container';
export const contentClass = 'pa-img-hover-content';

export const Container: React.FC<{}> = () => <div className={containerClass}></div>;

interface ContentProps {
    clickAction: Function;
}
// The naming here is pretty terrible. TODO: split concerns properly.
export const Content: React.FC<ContentProps> = props => (
    <div className={contentClass}>
        <InjectBootstrap>
            <DownloadButton
                mode={DownloadStates.DOWNLOADAVAILABLE}
                downloadFunc={props.clickAction}
            />
        </InjectBootstrap>
    </div>
);
