import * as React from 'react';

export interface PagingButtonProps {
    anchorClass: string;
    polylineClass: string;
    href: string;
}

export const PagingButton: React.FC<PagingButtonProps> = props => {
    return (
        <a className={props.anchorClass} href={props.href}>
            <svg viewBox="0 0 10 8" width="16" height="16">
                <polyline className={props.polylineClass} stroke-width="2" points="1,2 5,6 9,2" transform="rotate(-90 5 4)"></polyline>
            </svg>
        </a>
    );
};
