import log from 'daslog'
import {ActionCache} from '../utils/actionCache'

const logger = log.prefix('Repo');

export interface PixivRepo {
	supports: (action: string) => boolean
	dispatch: <T> (action: string, message: any) => Promise<T> | T
	teardown: () => void
}

// Registers dispatching and decorator details (the mechanics of a repo)
export abstract class BaseRepo implements PixivRepo {
	protected abstract getCache(): ActionCache;

	constructor() {
		this.getCache().bind(this);
	}

	public supports(action:string) {
		return action in this.getCache().registry;
	}
	public dispatch(action:string, msg:any):any {
		let actionFunc = this.getCache().registry[action];
		logger.debug('Dispatching on ', action, ' method found', actionFunc !== undefined);
		if (actionFunc !== undefined) {
			return actionFunc(msg);
		} else {
			return Promise.reject('Action not valid for this server');
		}
	}

	public teardown():void {
		// Nothing
	}
}
