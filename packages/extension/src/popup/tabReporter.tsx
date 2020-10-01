import {Callout, Card, H3, H4} from '@blueprintjs/core';
import {BGCommand, PageCommand} from 'core/message';
import {PageContext} from 'page/context';
import log from 'page/log';
import {PageAction} from 'page/pageAction';
import React, {useEffect, useState} from 'react'
import { match } from 'variant';
import {browser, Tabs} from 'webextension-polyfill-ts'
import {ActionList} from './actionList';
import {ArtistCard} from './artistCard';
import {ArtworkCard} from './artworkCard';


interface ContextCardsProps {
    context: PageContext;
    checked: {[page: string]: boolean};
    setChecked: (checked: {[page: string]: boolean}) => void;
}
export const ContextCards: React.FC<ContextCardsProps> = ({context, checked, setChecked}) => {
    return (
        <>
            {match(context, {
                Artwork: ({illustInfo, artist, artistProfile, pages}) => <>
                    <H4>Artist</H4>
                    <ArtistCard info={artist} profile={artistProfile} />
                    <H4>Artwork</H4>
                    <ArtworkCard 
                        info={illustInfo}
                        pages={pages}
                        checked={checked}
                        setChecked={setChecked}
                    />
                </>,
                Default: _ => <>
                    <Card>
                        Url: {}
                    </Card>
                </>,
                User: ({user, profile}) => <>
                    <H4>Artist</H4>
                    <ArtistCard info={user} profile={profile} />
                </>,
            })}
        </>
    )
}




interface TabReporterProps {
    tab: Tabs.Tab;
    checked: {[page: string]: boolean};
    setChecked: (checked: {[page: string]: boolean}) => void;
}
export const TabReporter: React.FC<TabReporterProps> = ({tab, checked, setChecked}) => {
    const [context, setContext] = useState<PageContext>();
    useEffect(() => {
        browser.runtime.sendMessage(BGCommand.getContext({tabId: tab.id!}))
            .then(reply => {
                log.info('Reply was', reply);
                setContext(reply);
            })
    }, [])
    return ( 
        <div>
            {context != undefined ? <ContextCards context={context} checked={checked} setChecked={setChecked} /> : null}
        </div>
    )
}

interface WiredActionListProps {
    tab: Tabs.Tab;
    checked: {[page: string]: boolean};
}
export const WiredActionList: React.FC<WiredActionListProps> = ({tab, checked}) => {
    const [actions, setActions] = useState<PageAction[]>([]);

    useEffect(() => {
        browser.runtime.sendMessage(BGCommand.getActions({tabId: tab.id!}))
            .then(reply => {
                log.info('Reply was', reply);
                setActions(reply ?? []);
            })
    }, []);

    function actionClicked(action: PageAction) {
        const newAction = {
            ...action,
            extra: {checked},
        };
        browser.tabs.sendMessage(tab.id!, PageCommand.PerformAction(newAction))
            .then(reply => {
                log.info('Action reply was', reply);
            });
    }
    return (
        <div>
            <H4>Actions</H4>
            <Card className='v-spaced packed-card'>
                {actions.length > 0 ?
                    <ActionList actions={actions} onClick={actionClicked} />
                : 
                    <Callout intent='warning' style={{position: 'relative', fontWeight: 500}}>
                        <p>No actions defined for this page.</p>
                    </Callout>
                }
            </Card>
        </div>
    )
}

interface CurrentTabProps {

}
export const CurrentTab: React.FC<CurrentTabProps> = props => {
    const [currentTab, setCurrentTab] = useState<Tabs.Tab>();
    const [checked, setChecked] = useState<{[pageIndex: string]: boolean}>({});
    useEffect(() => {
        browser.tabs.query({active: true, currentWindow: true})
            .then(([tab]) => {
                setCurrentTab(tab);
            });
    }, [])
    return (
        currentTab != undefined ? <>
            <TabReporter tab={currentTab} checked={checked} setChecked={setChecked} />
            <WiredActionList tab={currentTab} checked={checked} />
        </>: null
    )
}
