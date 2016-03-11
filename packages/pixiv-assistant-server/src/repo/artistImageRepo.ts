import {BaseRepo} from './baseRepo'
import {ActionCache} from '../utils/ActionCache'

export class ArtistImageRepo extends BaseRepo {
	private static actions = new ActionCache();

	public getCache() {
		return ArtistImageRepo.actions;
	}

	@ArtistImageRepo.actions.register('action1')
	public perfromAction(msg:any, callback:any):any {
		return null;
	}
}