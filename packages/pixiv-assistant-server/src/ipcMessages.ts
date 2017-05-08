export type BackendTarget = 'ServerConfiguration'

export interface RequestWrapper<T> {
	id: string
	name: string
	body: T
}

export interface ResponseMessage {
	success: boolean
}
export interface SuccessfulResponse<T> extends ResponseMessage {
	data:T
}
export interface FailedResponse extends ResponseMessage {
	errors: any
}
export function isSuccessfulResponse<T>(msg: ResponseMessage): msg is SuccessfulResponse<T> { return msg.success }
export function isFailedResponse(msg: ResponseMessage): msg is FailedResponse { return !msg.success }
