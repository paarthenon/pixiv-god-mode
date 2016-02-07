//TODO: Create actual logger
let debugMode:boolean = true;

export function log(content:string):void {
	if(debugMode){
		(<any>unsafeWindow).console.log(content);
	}
}
