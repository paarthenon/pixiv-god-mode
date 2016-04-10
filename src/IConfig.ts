import * as Q from 'q'

type potentialData = boolean|string|number|Object;

interface IConfig {
	keys: () => Q.IPromise<string[]>
	get: (key: string) => Q.IPromise<potentialData>
	set: (key: string, data: potentialData) => Q.IPromise<void>
}

export default IConfig;