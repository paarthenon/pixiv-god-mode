import {TriggeredPageAction} from 'page/pageAction';

/**
 * This is a quick and dirty implementaton that's used to store the registered actions for a page class.
 * I created this when the extension was a greasemonkey script and I wanted to avoid the thousands of
 * lines of code that reflect-metadata would inject into my final distibution. At this point the
 * extension has enough dependencies that reflect-metadata would barely be noticed.
 *
 * Another option would be to adopt the pattern in paarthenon/pixiv-assistant-server where each
 * page class has a static registry that it references.
 *
 * That said, as stupid as this is it's also an isolated case of stupidity that has few faults besides
 * intellectual ugliness.
 */
// export module CacheRegistry {
// }

const cache: {[id: string]: TriggeredPageAction[]} = {};

export function pushToArrayCache<T>(cache: {[id: string]: T[]}, key: string, value: T) {
    let arr = cache[key];
    if (arr) {
        arr.push(value);
    } else {
        arr = [value];
    }
    cache[key] = arr;
}

export function gracefullyCache(key: string, value: TriggeredPageAction) {
    pushToArrayCache(cache, key, value);
}

export function gracefullyGet(key: string): TriggeredPageAction[] {
    return cache[key] ?? [];
}