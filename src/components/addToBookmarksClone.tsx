import * as React from 'react'


export class AddToBookmarksClone extends React.Component<{clickAction:Function}, void> {
    public render() {
        return <a className="add-bookmark _button" onClick={() => this.props.clickAction()}>Add to Bookmarks</a>;
    }
}