import {PixivRepo} from './model'
import {ActionCache} from '../utils/actionCache'

export abstract class BaseRepo implements PixivRepo {
	protected abstract getCache(): ActionCache;

	constructor(protected repoPath:string) {
		this.getCache().bind(this);
	}

	public supports(action:string) {
		return action in this.getCache().registry;
	}
	public dispatch(action:string, msg:any):any {
		return this.getCache().registry[action](msg);
	}
}