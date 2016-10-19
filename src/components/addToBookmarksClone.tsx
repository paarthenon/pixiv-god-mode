import * as React from 'react'

export const AddToBookmarksClone : React.StatelessComponent<{clickAction:Function}> = 
    ({clickAction}) => <a className="add-bookmark _button" onClick={() => clickAction()}>Add to Bookmarks</a>
