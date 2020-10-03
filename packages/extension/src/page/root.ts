import {Tab} from '@blueprintjs/core';
import {BGCommand, PageCommand} from 'core/message';
import {gracefullyGet} from 'util/terribleCache';
import {match} from 'variant';
import {browser} from 'webextension-polyfill-ts';
import {PageContext} from './context';
import {PageAction, TriggeredPageAction} from './pageAction';

/**
 * Warning: magic.
 * 
 *  - manages actions, triggered actions, and communication with the background script.
 */
export class RootPage {
    protected get triggeredPageActions(): TriggeredPageAction[] {
        const name = (<any>this)['constructor']['name'];
        const actions = gracefullyGet(name) ?? [];
        return actions;
    }

    protected setBadgeText(text: string, timer = 0) {
        browser.runtime.sendMessage(BGCommand.setBadge(text, timer));
    }

    /**
     * Trigger the 'OnLoad' and 'IfThen' and such.
     */
    private executeTriggeredPageActions() {
        // Need to bind these functions to the 'this' object, they were stored at design time
        // when no instance existed
        this.triggeredPageActions.forEach(action => {
            Promise.resolve(action.if?.call(this) ?? false).then(predicateResult => {
                if (predicateResult) {
                    action.execute.call(this);
                }
            });
        });
    }

    public async getPageActions(): Promise<PageAction[]> {
        return [];
    }

    public handlePageAction(action: PageAction) {
        
    }

    public context = this.getContext();
    protected async getContext(): Promise<PageContext> {
        return PageContext.Default({url: this.url});
    }
    
    constructor(protected url: string) {
        this.executeTriggeredPageActions();

        this.context.then(context => {
            console.log('hahahaaaa', context);
            browser.runtime.sendMessage(BGCommand.cacheContext({
                tabId: 0,
                context,
            }))
        });

        this.getPageActions().then(actions => {
            browser.runtime.sendMessage(BGCommand.cacheActions({actions}));
        });
    }


}

