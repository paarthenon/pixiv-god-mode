import 'regenerator-runtime/runtime.js';
import {Callout, Card, Icon, Navbar} from '@blueprintjs/core';
import React from 'react';
import ReactDOM from 'react-dom';
import {browser} from 'webextension-polyfill-ts';
import './index.scss';

import log from './log';
import {CurrentTab} from './tabReporter';

log.trace('Init - Popup page');

interface HelloProps {

}
export const Hello: React.FC<HelloProps> = props => {
    return (
        <div className='popup-container fill flex-col'>
            <Navbar>
                <Navbar.Group>
                    <Navbar.Heading>
                        <img src='icons/kami-32.png' />
                    </Navbar.Heading>
                    <Navbar.Heading>
                        <span className='navbar-header'>Kami-sama</span>
                    </Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align='right'>
                    <div className='gh-button'>
                        <a className="github-button"
                            href="https://github.com/paarthenon/kami-sama"
                            data-size="large"
                            data-show-count="true"
                            aria-label="Star paarthenon/kami-sama on GitHub">
                                Star
                        </a>
                    </div>
                </Navbar.Group>
            </Navbar>
            <Callout style={{flexGrow: 1}}>
                <CurrentTab />
            </Callout>
        </div>
    )
}

ReactDOM.render(React.createElement(Hello, {}), document.getElementById('container'));

async function messageTab() {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});
}
