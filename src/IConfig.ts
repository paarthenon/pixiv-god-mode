type potentialData = boolean|string|number|Object;

interface IConfig {
	keys: () => string[]
	get: (key: string) => potentialData
	set: (key: string, data: potentialData) => void
}

export default IConfig;