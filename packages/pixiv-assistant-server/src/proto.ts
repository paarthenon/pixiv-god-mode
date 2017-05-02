export interface IServerConfig {
	path? :string
	port? :number
	verboseLogging? :boolean
}

export interface IServerConfigProtocol {
	initialize :(config:IServerConfig) => Promise<void>
	close :() => Promise<void>
	openFolderDialog :() => Promise<string>
}
