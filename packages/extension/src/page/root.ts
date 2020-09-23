import {gracefullyGet} from 'util/terribleCache';
import {PageAction} from './pageAction';

export class RootPage {
    protected get pageActions(): PageAction[] {
        const name = (<any>this)['constructor']['name'];
        const actions = gracefullyGet(name) ?? [];
        return actions;
    }

    /**
     * Trigger the 'OnLoad' and 'IfThen' and such.
     */
    private executePageActions() {
        // Need to bind these functions to the 'this' object, they were stored at design time
        // when no instance existed
        this.pageActions.forEach(action => {
            Promise.resolve(action.if?.call(this) ?? false).then(predicateResult => {
                if (predicateResult) {
                    action.execute.call(this);
                }
            });
        });
    }
    
    constructor(protected url: string) {
        this.executePageActions();
    }
}