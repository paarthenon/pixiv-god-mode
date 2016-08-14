import {AjaxFunction} from './IAjax'

export class GithubDictionaryUtil {
	constructor(
		protected githubPath:string,
		protected ajax:AjaxFunction<any,any>
	) { }
	public get masterCommit() :Promise<string> {
		return this.ajax({
			type: 'GET',
			url: `http://api.github.com/repos/${this.githubPath}/git/refs/heads/master`
		}).then((response: any) => JSON.parse(response))
		  .then((response: any) => response.object.sha);
	}

	public getDictionaryObject(commitSHA:string) :Promise<Object> {
		return this.ajax({
			type: 'GET',
			url: `https://cdn.rawgit.com/${this.githubPath}/${commitSHA}/dictionary.json`
		}).then((response: any) => JSON.parse(response));
	}

	public get newestDictionary() :Promise<Object> {
		return this.masterCommit.then(hash => this.getDictionaryObject(hash));
	}
}

