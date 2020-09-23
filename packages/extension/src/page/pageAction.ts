export interface Executable {
    execute: () => void;
}

export interface Conditional {
    if?: () => boolean | Promise<boolean>;
}

export type PageAction = Executable & Conditional;
