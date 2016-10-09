import * as React from 'react'

export class InjectBootstrap extends React.Component<{inline?:boolean}, void> {
    public render() {
        let className = 'pixiv-assistant';
        if (this.props.inline) {
            return <span className={className}>{this.props.children}</span>
        } else {
            return <div className={className}>{this.props.children}</div>
        }
    }
}
