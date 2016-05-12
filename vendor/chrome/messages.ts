
export abstract class Message<Payload> {
	public isType<T>(msg: new (...args:any[]) => T):this is T {
		return msg.name === this.constructor.name;
	}
	constructor(
		public data: Payload
	){}
}

export class ConfigGetMessage extends Message<{ key: string }> { }
export class ConfigSetMessage extends Message<{ key: string, value: string }> { }
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