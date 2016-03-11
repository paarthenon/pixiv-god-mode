import {PixivRepo} from './model'

class SimpleObjectRepo implements PixivRepo {
	constructor(protected repo:Object) { }

	public supports (action:string) {
		return action in this.repo;
	}

	public dispatch(action:string, msg:any, callback:Function) {
		this.repo[action](msg, callback);
	}

}
