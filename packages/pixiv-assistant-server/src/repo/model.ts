export interface PixivRepo {
	supports: (action: string) => boolean
	dispatch: (action: string, message: any, callback:Function) => any
}
