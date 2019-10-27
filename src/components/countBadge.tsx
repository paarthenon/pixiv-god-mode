import * as React from 'react';

export const CountBadge: React.FC<{text: string}> = ({text}) => (
    <span className='count-badge'>{text}</span>
);
