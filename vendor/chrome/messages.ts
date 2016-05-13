import {potentialData as IConfigValue} from '../../src/IConfig'

export abstract class Message<Payload> {
	public type: string;

	public isType<T>(msg: new (...args:any[]) => T):this is T {
		return msg.name === this.type;
	}
	constructor(
		public data: Payload
	){
		this.type = this.constructor.name;
	}
}

/*
	Config Messages
*/
export class ConfigGetMessage extends Message<{ key: string }> { }
export class ConfigSetMessage extends Message<{ key: string, value: IConfigValue }> { }
export class ConfigGetResponse extends Message<{ value: IConfigValue }> { }
export class ConfigSetResponse extends Message<boolean> { }

export abstract class ResponseMessage<T> extends Message<T> {
	public success: boolean;
	public errors: string[] = [];
}
export class FailureResponse extends ResponseMessage<void> {
	constructor(public errors: string[]) {
		super(undefined);
		this.success = false;
	}
}
export class SuccessResponse<T> extends ResponseMessage<T> {
	constructor(public data: T){
		super(data);
		this.success = true;
	}
}