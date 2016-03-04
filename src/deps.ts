let jQuery = $;

declare var cloneInto: Function;

export var jQ:JQueryStatic = jQuery;

export function inject(f: Function){
	return cloneInto(f, unsafeWindow, { cloneFunctions: true });
}