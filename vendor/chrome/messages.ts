
export interface Message extends Object {
	type:string
}

abstract class BaseMessage implements Message {
	protected _type: string;
	public get type():string {
		return this._type;
	}

	public isType<T>(msg: new () => T):this is T {
		return msg.name === this.constructor.name;
	}
}

export class ConfigGetMessage extends BaseMessage {
	protected _type = 'ConfigGetMessage'

	public nonce: string = 'hello';
}


interface Msg {
	type: string;
}

interface Msg2 extends Msg {
	type: 'Msg2';
}

let a: Message = undefined;

if(a instanceof ConfigGetMessage) {
}

function aaa<T>(a: new ()=>T, b:Message){

	a.name

}