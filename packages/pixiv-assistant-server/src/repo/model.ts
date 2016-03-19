export interface PixivRepo {
	supports: (action: string) => boolean
	dispatch: <T> (action: string, message: any) => Q.IPromise<T>
	teardown: () => void
}
