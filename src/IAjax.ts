export interface AjaxRequest<T> {
	type: "GET" | "POST"
	url: string
	data?: T
}
