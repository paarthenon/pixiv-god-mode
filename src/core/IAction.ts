export interface HasExecutable {
    execute: () => void;
}

export interface IsConditional {
    if?: () => boolean | Promise<boolean>;
}

export type OnLoadFunc = HasExecutable & IsConditional;
