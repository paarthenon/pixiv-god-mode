import 'reflect-metadata'

export class ReflectProxy {
	constructor(private target: any) { }

	public define(key: string, value: any){
		Reflect.defineMetadata(key, value, this.target);
	}

	public get(key:string) {
		Reflect.getMetadata(key, this.target);
	}

	public get keys(){
		return Reflect.getMetadataKeys(this.target);
	}

	public pushTo(key:string, value:any){
		pushToMetadata(key, value, this.target);
	}
}

export function pushToMetadata(key: string, content: any, target: any) {
	let arr:any[] = [];
	if(Reflect.hasMetadata(key, target)){
		arr = <Array<any>>Reflect.getMetadata(key, target);
	}
	arr.push(content);
	Reflect.defineMetadata(key, arr, target);
}
