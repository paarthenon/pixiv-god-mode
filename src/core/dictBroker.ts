import IDictionary from './IDictionary'

export default class DictBroker {
	constructor(protected dictionaries: IDictionary[]) { }
	get(key: string): Promise<string> {
		return this.dictionaries.reduce(
			(acc, current) => 
				acc.then(null, reject => 
						current.get(key).then(value => value || Promise.reject<string>('Not found'))),
			Promise.reject<string>(undefined));
	}
}