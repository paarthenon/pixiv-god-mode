import {IconName} from '@blueprintjs/core';

export interface Executable {
    execute: () => void;
}

export interface Conditional {
    if?: () => boolean | Promise<boolean>;
}

export type TriggeredPageAction = Executable & Conditional;

export interface PageAction {
    type: string;
    label: string;
    icon?: IconName;
    subtitle?: string;
}
