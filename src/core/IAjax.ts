export interface AjaxRequest<T> {
	type: "GET" | "POST"
	url: string
	data?: T
}

export type AjaxFunction<T,V> = (req:AjaxRequest<T>) =>  Promise<V>