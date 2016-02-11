export function avoidTrailingDot(path:string): string {
	return (path[path.length - 1] === '.') ? path.substr(0, path.length - 1) : path
}