export interface ActionDescriptor extends IsConditional {
	id: string,
	label: string,
	icon?: string,
	color?: string,
	onLoad?: boolean 
}

interface HasExecutable {
	execute: () => void
}

interface IsConditional {
	if?: () => boolean
}

export type Action = ActionDescriptor & HasExecutable;
export type OnLoadFunc = HasExecutable & IsConditional;