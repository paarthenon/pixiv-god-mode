import * as hook from 'vendor/chrome/pageHook'

hook.inject(hook.pixivExec);

export class ExecBroker {
	protected resolvers: { [id: number]: Function } = {};
	protected currentIndex = 0;

	public constructor(){
		document.addEventListener('pixivExecResponse', (event) => {
			let detail: { id: number, response: any } = (<any>event).detail;
			this.resolvers[detail.id](detail.response);
		})
	}

	private createEvent(id:number, func:(pixiv:any, props:any) => any, props:any) {
		return new CustomEvent('pixivExec', {
			detail: JSON.stringify({
				id,
				func: func.toString(),
				props: props
			})
		});
	}

	public queueExecution(func:(pixiv:any, props:any) => any, props:any) {
		return new Promise(resolve => {
			let id = this.currentIndex++;
			this.resolvers[id] = resolve;
			document.dispatchEvent(this.createEvent(id, func, props));
		});
	}
}