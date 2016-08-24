import * as Msg from './ipcMessages'

export enum RepositoryType {
	ArtistBreakdown,
	LooseImages,
}

export interface IServerConfig {
	path? :string
	repoType? :RepositoryType
	port? :number
	verboseLogging? :boolean
}

export interface IServerConfigProtocol {
	initialize :(config:IServerConfig) => Promise<void>
	close :() => Promise<void>
}