import {OnLoadFunc} from 'src/core/IAction';

import {CacheRegistry} from 'src/utils/terribleCache';

export class BasePage {
    protected get onLoadFunctions(): OnLoadFunc[] {
        let name = (<any>this)['constructor']['name'];
        let cache = CacheRegistry.onLoadFunctionCache[name] || [];
        // return cache.filter(func => func.if.call(this));
        return cache;
    }

    constructor(protected path: string) {
        // Need to bind these functions to the 'this' object, they were stored at design time
        // when no instance existed
        this.onLoadFunctions.forEach(f => {
            Promise.resolve(f.if.call(this)).then(predicateResult => {
                if (predicateResult) {
                    f.execute.call(this);
                }
            });
        });
    }
}
