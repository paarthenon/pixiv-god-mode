import * as ghUtils from './github'

function updateDictionary(){
	let ghPath:string = 'pixiv-assistant/dictionary';
	ghUtils.getMasterCommit(ghPath, (hash) => {
		ghUtils.getDictionaryObject(ghPath, hash, (object) => {
			console.log(JSON.stringify(object));
		})
	});
}