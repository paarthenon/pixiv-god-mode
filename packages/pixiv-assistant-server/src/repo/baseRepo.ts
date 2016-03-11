import {PixivRepo} from './model'
import {ActionCache} from '../utils/actionCache'

export abstract class BaseRepo implements PixivRepo {
	protected abstract getCache(): ActionCache;

	public supports(action:string) {
		return action in this.getCache().registry;
	}
	public dispatch(action:string, msg:any, callback:Function) {
		this.getCache().registry[action](msg, callback);
	}
}
