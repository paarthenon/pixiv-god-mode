import {IDependencyContainer} from '../../src/deps'

import * as Q from 'q'

import Config from './config'

let deps: IDependencyContainer = {
	jQ: $,
	config: undefined,
	openInTab: (url:string)=>{}
}