import * as React from 'react';

export const AddToBookmarksClone: React.FC<{
    clickAction: Function;
    text?: string;
}> = ({clickAction, text}) => (
    <a className='add-bookmark _button' onClick={() => clickAction()}>
        {text || 'Add to Bookmarks'}
    </a>
);
