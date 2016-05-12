import * as Msg from './messages'


class DispatchMap {
	private map: { [id: string]: (msg: Msg.Message<any>) => any } = {};

	public register<T extends Msg.Message<V>,V>(msg: new (...args:any[]) => T, func:(msg:T) => any) {
		this.map[msg.name] = func;
	}
	public dispatch<T extends Msg.Message<V>,V>(msg: T) {
		this.map[msg.constructor.name](msg);
	}
}

let dispatcher = new DispatchMap();

dispatcher.register(Msg.ConfigGetMessage, msg => {
	return new Msg.SuccessResponse(undefined);
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	sendResponse(dispatcher.dispatch(msg));
});
