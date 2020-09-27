import React, {useState} from 'react'
import $ from 'cash-dom';
import {GenerateElement} from 'util/page';
import log from './log';

interface IllustTrayButtonProps {
    text: string;
    onClick?: () => void;
}
export const IllustTrayButton: React.FC<IllustTrayButtonProps> = props => {
    const [style, setStyle] = useState<React.CSSProperties>({});
    function click() {
        setStyle({
            color: 'red',
        });
        props.onClick?.();
    }
    return (
        <div className="sc-181ts2x-2 fBUtmk">
            <button type="button" className="l6avS_e _1W1yk-M" aria-haspopup="true" onClick={click}>
               <b style={style}>{props.text}</b>
            </button>
        </div>
    )
}

export function injectTrayButton(label = '(?)', onClick = () => {}) {
    const elem = GenerateElement(<IllustTrayButton text={label} onClick={onClick}/>);
    const tray = $('.sc-181ts2x-0.jPZrYy');
    tray.append(elem);
}