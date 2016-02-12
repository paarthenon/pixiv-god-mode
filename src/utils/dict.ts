type stringMap = { [id: string]: string }

let globalDict: stringMap = {
	'眼鏡': 'glasses'
}

export function getTranslation(tag:string):string {
	return globalDict[tag];
}