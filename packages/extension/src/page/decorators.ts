import {gracefullyCache} from 'util/terribleCache';

import {RootPage} from './root';

export function IfThen(predicate: () => boolean | Promise<boolean>) {
    return (
        target: RootPage,
        _propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>,
    ) => {
        const name = (<any>target)['constructor']['name'];

        const onload = {
            if: predicate,
            execute: descriptor.value,
        };

        gracefullyCache(name, onload);
        return descriptor;
    };
}

export var OnLoad = IfThen(() => true);


// NOTE: from the old version.
// import {Container as Deps} from 'src/deps';
// export var IfSetting = (key: string) => IfThen(() => Deps.getSetting(key));
