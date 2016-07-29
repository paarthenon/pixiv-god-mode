export function hijack(func: Function) {
	var script = document.createElement('script');
	script.appendChild(document.createTextNode(`(${func})();`));
	(document.body || document.head || document.documentElement).appendChild(script);
}


export function inject(func: Function){
	hijack(func);
}

export function pixivExpose(){
	var evt = new CustomEvent('pixivExpose', { detail: (<any>window).pixiv.context });
	document.dispatchEvent(evt);
}

interface PixivExecDetails {
	id: number
	func: (pixiv:any, props:any) => any
	props: any
}

export function pixivExec(){
	document.addEventListener('pixivExec', function(event) {
		let deets:PixivExecDetails = JSON.parse((<any>event).detail);
		console.log('deets', deets);
		let func = eval(`(${deets.func})`);
		let result = func((<any>window).pixiv, deets.props);

		Promise.resolve(result).then(result => {
			let evt = new CustomEvent('pixivExecResponse', {
				detail: {
					id: deets.id,
					response: result
				}
			});
			document.dispatchEvent(evt);
		});
	});
}


