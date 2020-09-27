import {Callout, Card, H3} from '@blueprintjs/core';
import {BGCommand, PageCommand} from 'core/message';
import {PageContext} from 'page/context';
import log from 'page/log';
import {PageAction} from 'page/pageAction';
import React, {useEffect, useState} from 'react'
import {browser, Tabs} from 'webextension-polyfill-ts'
import {ActionList} from './actionList';
import {PageContextReport} from './pageContext';

interface WiredActionListProps {
    tab: Tabs.Tab;
}
export const TabReporter: React.FC<WiredActionListProps> = ({tab}) => {
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
            <Card className='v-spaced'>
                <H3>Info</H3>
                <Callout>
                    {context != undefined ?
                        <PageContextReport ctx={context} />
                    : 
                        <p>No context object for this page.</p>
                    }
                </Callout>
            </Card>
        </div>
    )
}

interface WiredActionListProps {
    tab: Tabs.Tab;
}
export const WiredActionList: React.FC<WiredActionListProps> = ({tab}) => {
    const [actions, setActions] = useState<PageAction[]>([]);

    useEffect(() => {
        browser.tabs.sendMessage(tab.id!, PageCommand.GetActions())
            .then(reply => {
                log.info('Reply was', reply);
                setActions(reply);
            })
    }, []);

    function actionClicked(action: PageAction) {
        browser.tabs.sendMessage(tab.id!, PageCommand.PerformAction(action))
            .then(reply => {
                log.info('Action reply was', reply);
            });
    }
    return (
        <div>
            <Card className='v-spaced'>
                <H3>Actions</H3>
                {actions != undefined ?
                    <ActionList actions={actions} onClick={actionClicked} />
                : 
                    <p>No actions defined for this page.</p>
                }
            </Card>
        </div>
    )
}

interface CurrentTabProps {

}
export const CurrentTab: React.FC<CurrentTabProps> = props => {
    const [currentTab, setCurrentTab] = useState<Tabs.Tab>();
    useEffect(() => {
        browser.tabs.query({active: true, currentWindow: true})
            .then(([tab]) => {
                setCurrentTab(tab);
            });
    }, [])
    return (
        currentTab != undefined ? <>
            <TabReporter tab={currentTab} />
            <WiredActionList tab={currentTab} />
        </>: null
    )
}
