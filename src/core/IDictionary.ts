export interface IDictionary {
	keys: Promise<string[]>
	get: (key: string) => Promise<string>
	set: (key: string, value: string) => void
}

export default IDictionary;