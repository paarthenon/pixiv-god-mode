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

export type Action = ActionDescriptor & HasExecutable;
