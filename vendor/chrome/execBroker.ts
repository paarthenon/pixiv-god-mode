import * as hook from 'vendor/chrome/pageHook'

hook.inject(hook.pixivExec);

/**
 * A message broker. This gets instantiated inside the web page sandbox and then
 * listens for events, executes functions that are passed to it, and returns the result.
 * There is only a single exec broker per page and messages are async so there may be
 * a number of waiting callers and their responses need to be returned correctly.
 * A dirt simple incrementing [id]:callback map handles this perfectly, and promises
 * provide a clean UI to consumers.
 * 
 * This is primarily used to give access to the pixiv god object (tapping into pixiv's own JS)
 * which enables more efficient and effective access to metadata.
 */
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