type Action = () => any;

let cache: { [id: string]: Action[] } = {};

export module TerribleCache {
	export function get(name:string): Action[] {
		return cache[name] || [];
	}
	export function push(name:string, action:Action) {
		if (!(name in cache)){
			cache[name] = [];
		}
		cache[name].push(action);
	}
}

