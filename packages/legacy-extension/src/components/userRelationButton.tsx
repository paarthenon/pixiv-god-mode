import * as React from 'react';

/**
 * Copies the style of the 'Follow Artist' button in the profile context container.
 */
export const UserRelationButton: React.FC<{
    text: string;
    clickAction: Function;
}> = props => (
    <a onClick={() => props.clickAction()} className='follow'>
        {props.text}
    </a>
);
