import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import {Action} from '../../../src/core/IAction'
import {getUserSettings, getSetting, setSetting} from '../userSettings'
import SettingKeys from '../../../src/settingKeys'
import ConfigKeys from '../../../src/configKeys'
import * as ghUtils from '../ghUtils'


let logger = log4js.getLogger('ActionPanel');

let mapping : { [id:string]: string } = {
	[SettingKeys.pages.illust.autoOpen]: 'Automatically zoom into image',
	[SettingKeys.pages.illust.boxImage]: 'Limit image size to the window (illustration)',
	[SettingKeys.pages.manga.boxImages]: 'Limit image size to the window (manga)',
	[SettingKeys.pages.manga.loadFullSize]: 'Load full size versions of manga images',
	[SettingKeys.pages.works.autoDarken]: 'Fade out downloaded images',
	[SettingKeys.pages.works.directToManga]: 'Link directly to manga',
	[SettingKeys.pages.works.mangaLinkToFull]: 'No idea'
};

export class SettingsPanel extends React.Component<void,{userSettings: {[id:string]:boolean}}> {
	public render() {
		return (
			<div>
				{Object.keys(mapping).map(key => <SettingContainer key={key} settingKey={key} label={mapping[key]}/>)}
				<GlobalDictUpdaterContainer/>
				<TextSettingContainer label="Server Url" settingKey={ConfigKeys.server_url} />
			</div>
		);
	}
}


module DictionaryUtils {
	let ghPath = 'pixiv-assistant/dictionary'
	export function updateAvailable() : Promise<boolean> {
		logger.debug('DictionaryService.updateAvailable | entered');
		return ghUtils.getMasterCommit(ghPath).then(commitHash => {
			return Mailman.Background.getConfig({key:ConfigKeys.official_dict_hash}).then(currentHash => {
				let isNewer: boolean = !currentHash || currentHash.value !== commitHash;
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}] is ${(isNewer) ? '' : 'not '} newer than [${currentHash}]`);
				return isNewer;
			});
		});
	}

	export function updateDictionary() : Promise<void> {
		logger.debug('DictionaryService.updateDictionary | entered');
		return ghUtils.getMasterCommit(ghPath).then(commitHash => {
			return ghUtils.getDictionaryObject(ghPath, commitHash).then(obj => {
				logger.debug(`DictionaryService.updateAvailable | commit has been received: [${commitHash}]`);
				Mailman.Background.setConfig({key:ConfigKeys.official_dict, value:obj});
				Mailman.Background.setConfig({key:ConfigKeys.official_dict_hash, value: commitHash});
			});
		});
	}
}

interface GlobalDictUpdaterProps {
	updateAvailable :boolean
	updateAction :Function
}
class GlobalDictUpdaterContainer extends React.Component<void, {resolved:boolean, updateAvailable?: boolean}> {
	state = {resolved:false, updateAvailable: false};
	constructor() {
		super();
		DictionaryUtils.updateAvailable().then(isAvailable => {
			this.setState({
				resolved: true,
				updateAvailable: isAvailable
			});
		});
	}
	public updateDictionary(){
		DictionaryUtils.updateDictionary();
	}
	public render() {
		if (this.state.resolved) {
			return <GlobalDictUpdater updateAvailable={this.state.updateAvailable} updateAction={this.updateDictionary.bind(this)}/>
		} else {
			return <div> Waiting on dictionary details </div>
		}
	}
}


class GlobalDictUpdater extends React.Component<GlobalDictUpdaterProps, void> {
	public render(){
		if (this.props.updateAvailable) {
			return (
				<div>
					Update available. <a onClick={this.props.updateAction}> Click to update </a>
				</div>
				);
		} else {
			return <div>No update available</div>
		}
	}
}

interface SettingContainerProps {
	settingKey:string
	label:string
}
class SettingContainer extends React.Component<SettingContainerProps, {currentValue:boolean}> {
	constructor(props:SettingContainerProps) {
		super(props);
		this.state = { currentValue: undefined };
		getSetting(props.settingKey)
			.then(currentValue => this.setState({currentValue}));
	}
	public handleUpdate(value:boolean){
		setSetting(this.props.settingKey, value);
	}
	public render() {
		if(this.state.currentValue !== undefined) {
			return <BooleanSetting label={this.props.label} onToggle={this.handleUpdate.bind(this)} checked={this.state.currentValue}/>
		} else {
			return <div>Loading</div>
		}
	}
}
class BooleanSetting extends React.Component<{label:string, onToggle:(value:boolean) => any, checked:boolean}, void> {
	private inputElement : HTMLInputElement;
	
	handleExecute() {
		console.log('Value:', this.inputElement.checked);
		this.props.onToggle(this.inputElement.checked);
	}

	initializeElement(ref:HTMLInputElement){
		if(ref) {
			ref.checked = this.props.checked;
			this.inputElement = ref;
		}
	}
	public render() {
		return <div>
				<Bootstrap.Checkbox inputRef={this.initializeElement.bind(this)} onClick={this.handleExecute.bind(this)}>
						{this.props.label}
				</Bootstrap.Checkbox>
			</div>;
	}
}

class TextSettingContainer extends React.Component<{label:string, settingKey:string}, {currentValue:string}> {
	constructor(props:{label:string, settingKey:string}) {
		super(props);
		this.state = { currentValue: undefined };
		Mailman.Background.getConfig({key: props.settingKey})
			.then(currentValue => this.setState({currentValue: currentValue.value as string}));
	}
	public handleUpdate(value:string){
		Mailman.Background.setConfig({key: this.props.settingKey, value});
	}
	public render() {
		if(this.state.currentValue !== undefined) {
			return <TextSetting label={this.props.label} text={this.state.currentValue} onUpdate={this.handleUpdate.bind(this)}/>
		} else {
			return <div>Loading</div>
		}
	}
}
class TextSetting extends React.Component<{label:string, text:string, onUpdate:(val:string)=>any},{editOpen:boolean}> {
	state = { editOpen: false };
	public handleUpdate() {
		let translationInput :any = ReactDOM.findDOMNode(this.refs['translation']);
		this.props.onUpdate(translationInput.value);
	}
	public render() {
		return (
			<tr>
				<label> {this.props.label} </label>
				<input defaultValue={this.props.text} ref="translation"></input>
				<Bootstrap.Button bsSize="xsmall" onClick={this.handleUpdate.bind(this)}>update</Bootstrap.Button>
			</tr>
		);
	}
}
