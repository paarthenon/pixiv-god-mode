import * as React from 'react';

/**
 * The extension has a custom bootstrap file to render bootstrap elements with bootstrap
 * style only inside of a '.pixiv-assistant' container.
 */
export class InjectBootstrap extends React.Component<{inline?: boolean}, {}> {
    public render() {
        let className = 'pixiv-assistant';
        if (this.props.inline) {
            return <span className={className}>{this.props.children}</span>;
        } else {
            return <div className={className}>{this.props.children}</div>;
        }
    }
}
