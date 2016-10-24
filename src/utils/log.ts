/**
 * console.log(message, message2) => "message message2"
 * prefixedConsole.log(message, message2) => "category | message message2"
 */
export function prefix(category:string, target=console) :Console {
    let logFuncs = new Set(['fatal','error','warn','log','info','debug','trace']);
	return new Proxy<Console>(target, {
		get: (target:any, name:string) => (...args:any[]) => {
			if (category != undefined && logFuncs.has(name)) {
				target[name].apply(target, [category, '|', ...args]);
			} else {
				target[name].apply(target, args);
			}
		}
	});
}
