import * as Msg from './messages'


class DispatchMap {
	private map: { [id: string]: (msg: Msg.Message) => any } = {};

	public register<T extends Msg.Message>(msg: new () => T, func:(msg:T) => any) {
		this.map[msg.name] = func;
	}
	public dispatch<T extends Msg.Message>(msg: T) {
		this.map[msg.constructor.name](msg);
	}
}

let dispatcher = new DispatchMap();

dispatcher.register(Msg.ConfigGetMessage, msg => {
	msg.nonce;
})

chrome.runtime.onMessage.addListener((msg:Msg.Message) => {
	dispatcher.dispatch(msg);
});
