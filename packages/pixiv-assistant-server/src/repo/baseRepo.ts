import {PixivRepo} from './model'
import {ActionCache} from '../utils/actionCache'

import * as log4js from 'log4js'

let logger = log4js.getLogger('Repo');

export abstract class BaseRepo implements PixivRepo {
	protected abstract getCache(): ActionCache;

	constructor(protected repoPath:string) {
		this.getCache().bind(this);
	}

	public supports(action:string) {
		return action in this.getCache().registry;
	}
	public dispatch(action:string, msg:any):any {
		let actionFunc = this.getCache().registry[action];
		logger.debug('Dispatching on ', action, ' method found', action != undefined);
		return actionFunc(msg);
	}

	public teardown():void { }
}
