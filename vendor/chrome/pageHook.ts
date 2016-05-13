export function hijack(func: Function) {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode(`(${func})();`));
	(document.body || document.head || document.documentElement).appendChild(script);
}


export function inject(func: Function){
	console.log('yaaaaaah1');
	hijack(func);
}

export function pixivExpose(){
	console.log('pixivExpose');
	console.log((<any>window).pixiv);
	var evt = new CustomEvent('pixivExpose', { detail: (<any>window).pixiv.context });
	// var evt = document.createEvent('CustomEvent');
	// evt.initCustomEvent('pixivExpose', true, true, { data: (<any>window).pixiv });
	document.dispatchEvent(evt);
	// window.postMessage("pixivExpose", '*', JSON.stringify((<any>window).pixiv));
}

interface PixivExecDetails {
	id: number
	func: Function
}

export function pixivExec(){
	console.log('pixivExec');
	document.addEventListener('pixivExec', function(event) {
		console.log('pixivExec event received', (<any>event).detail);
		let deets:PixivExecDetails = JSON.parse((<any>event).detail);
		console.log('pixivExec deets', deets);
		let func = eval(`(${deets.func})`);
		let result = func((<any>window).pixiv);
		console.log('result', result);

		let evt = new CustomEvent('pixivExecResponse', {
			detail: {
				id: deets.id,
				response: result
			}
		});
		document.dispatchEvent(evt);
	});
}


