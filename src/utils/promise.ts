/**
 * Executes tasks sequentially. See paarthenon/pixiv-assistant-server for a far more interesting version
 * called promise pool.
 */
export function execSequentially<T>(arr: T[], func: (x: T) => any) {
    return arr.reduce((acc, cur) => acc.then(() => func(cur)), Promise.resolve());
}

/**
 * Include side effects in the promise chain. Mainly used for inserting log statements without being obnoxious.
 */
export function tap(func: Function) {
    return (x: any) => {
        func();
        return x;
    };
}
