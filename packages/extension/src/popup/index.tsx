import 'regenerator-runtime/runtime.js';
import {Button, ButtonGroup, Callout, Card, H4, Icon, Navbar} from '@blueprintjs/core';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {browser} from 'webextension-polyfill-ts';
import './index.scss';

import log from './log';
import {CurrentTab} from './tabReporter';
import {getUserFollowers} from 'core/API';
import {BGCommand, KamiSettings} from 'core/message';
import {ArtworkAction} from 'page/artwork';

log.trace('Init - Popup page');

interface SaveActionSelectorProps {
    selected: string;
    onSelect: (key: string) => void;
}
export const SaveActionSelector: React.FC<SaveActionSelectorProps> = props => {
    const options = [
        {
            key: ArtworkAction.Download,
            label: 'browser download' ,
        },
        {
            key: ArtworkAction.SendToBloom,
            label: 'save to bloom',
        },
    ]
    return (
        <div>
            <span>Default <b>save</b> action: </span>
            <ButtonGroup>
                {options.map(opt => {
                    return <Button outlined active={opt.key === props.selected} text={opt.label} onClick={() => props.onSelect(opt.key)} />
                })}
            </ButtonGroup>
        </div>
    )
}

interface HelloProps {

}
export const Hello: React.FC<HelloProps> = props => {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<KamiSettings>();

    function getRealSettings() {
        browser.runtime.sendMessage(BGCommand.getSettings())
            .then(setSettings);
    }
    function setRealSettings(dSettings: Partial<KamiSettings>) {
        browser.runtime.sendMessage(BGCommand.setSettings(dSettings))
            .then(() => getRealSettings())
    }
    useEffect(() => {
        getRealSettings();
    }, []);
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

                    <Button large minimal icon='cog' style={{marginLeft: '5px'}} active={showSettings} intent={showSettings ? 'primary' : 'none'} onClick={() => setShowSettings(!showSettings)} />
                </Navbar.Group>
            </Navbar>
            <Callout style={{flexGrow: 1}}>
                {showSettings ?
                    <>
                        <H4>Settings</H4>
                        <Card>
                            <SaveActionSelector selected={settings?.saveAction ?? ArtworkAction.Download} onSelect={key => setRealSettings({saveAction: key as any})} />
                        </Card>
                    </>
                :
                    <CurrentTab />
                }
            </Callout>
        </div>
    )
}

ReactDOM.render(React.createElement(Hello, {}), document.getElementById('container'));

async function messageTab() {
    const [tab] = await browser.tabs.query({active: true, currentWindow: true});
}
