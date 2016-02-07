let debugMode:boolean = true;

export function log(content:string):void {
	if(debugMode){
		console.log(content);
	}
}
