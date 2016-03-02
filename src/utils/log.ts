import Config from './config'
import ConfigKeys from '../configKeys'
//TODO: Create actual logger
let debugMode:boolean = <boolean>Config.get(ConfigKeys.debug_mode);

export function log(content:string):void {
	if(debugMode){
		(<any>unsafeWindow).console.log(content);
	}
}
