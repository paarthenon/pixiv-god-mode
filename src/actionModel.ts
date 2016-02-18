export interface ActionDescriptor {
	id: string,
	label: string,
	icon?: string,
	color?: string,
	onLoad?: boolean //TODO: in future blend onload and registeredaction
}

interface HasExecutable {
	execute: () => void
}

interface IsConditional {
	if?: () => boolean
}

export type Action = ActionDescriptor & HasExecutable & IsConditional;
export type OnLoadFunc = HasExecutable & IsConditional;