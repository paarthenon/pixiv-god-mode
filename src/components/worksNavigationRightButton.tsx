import * as React from 'react';

export const WorksNavbarRightButton: React.FC<{
    text: string;
    clickAction: Function;
}> = props => (
    <ul style={{float: 'right', borderLeft: '1px solid rgba(37, 143, 184, 0.3)'}}>
        <li>
            <a
                onClick={() => props.clickAction()}
                style={{cursor: 'pointer', padding: '0 20px', backgroundColor: '#eaedf1'}}
            >
                {props.text}
                <i
                    className='_icon sprites-next-linked'
                    style={{marginLeft: '2px', verticalAlign: 'auto'}}
                ></i>
            </a>
        </li>
    </ul>
);
