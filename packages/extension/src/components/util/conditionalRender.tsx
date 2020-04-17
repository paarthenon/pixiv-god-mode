import * as React from 'react';

export interface ConditionalRenderProps {
    predicate: () => boolean | Promise<boolean>;
    default?: boolean;
}

/**
 * Wrapper component that evaluates a predicate to judge whether or not to render.
 */
export class ConditionalRender extends React.Component<
    ConditionalRenderProps,
    {render: boolean}
> {
    state = {render: this.props.default};

    componentDidMount() {
        Promise.resolve(this.props.predicate()).then(render => this.setState({render}));
    }

    public render() {
        return this.state.render ? <div>{this.props.children}</div> : null;
    }
}
