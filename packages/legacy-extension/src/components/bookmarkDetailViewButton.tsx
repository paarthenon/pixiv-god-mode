import * as React from 'react';

export interface BookmarkDetailViewButtonProps {
    id?: string;
    text: string;
    clickAction: Function;
}

export const BookmarkDetailViewButton: React.FC<
    BookmarkDetailViewButtonProps
> = props => (
    <div id={props.id} className='_button-lite-large' onClick={() => props.clickAction()}>
        {props.text}
    </div>
);
