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

export class SettingsPanel extends React.Component<void,{userSettings: {[id:string]:boolean}}> {
	public render() {
		return (
			<div>
			<Bootstrap.Grid>
				<Bootstrap.Row>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Global Dictionary Status">
						<GlobalDictUpdaterContainer/>
					</Bootstrap.Panel>
					</Bootstrap.Col>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Server Url">
						<TextSettingContainer label="Server Url" settingKey={ConfigKeys.server_url} />
					</Bootstrap.Panel>
					</Bootstrap.Col>
				</Bootstrap.Row>
				<Bootstrap.Row>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Illustration Page">
						<SettingContainer 
							settingKey={SettingKeys.pages.illust.autoOpen} 
							label={'Automatically zoom into image'}/>
						<SettingContainer 
							settingKey={SettingKeys.pages.illust.boxImage} 
							label={'Limit image size to the window (illustration)'}/>
					</Bootstrap.Panel>
					</Bootstrap.Col>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Manga Page">
						<SettingContainer 
							settingKey={SettingKeys.pages.manga.loadFullSize} 
							label={'Load full size versions of manga images'}/>
						<SettingContainer 
							settingKey={SettingKeys.pages.manga.boxImages} 
							label={'Limit image size to the window (manga)'}/>
					</Bootstrap.Panel>
					</Bootstrap.Col>
				</Bootstrap.Row>
				<Bootstrap.Row>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Works Page">
						<SettingContainer 
							settingKey={SettingKeys.pages.works.autoDarken} 
							label={'Fade out downloaded images'}/>
						<SettingContainer 
							settingKey={SettingKeys.pages.works.directToManga} 
							label={'Link directly to manga'}/>
					</Bootstrap.Panel>
					</Bootstrap.Col>
					<Bootstrap.Col xs={6} md={6}>
					<Bootstrap.Panel header="Bookmark Illustration Page">
						<SettingContainer 
							settingKey={SettingKeys.pages.bookmarkIllustration.fadeDownloaded} 
							label={'Fade out downloaded images'}/>
						<SettingContainer 
							settingKey={SettingKeys.pages.bookmarkIllustration.fadeBookmarked} 
							label={'Fade out images from bookmarked artists'}/>
					</Bootstrap.Panel>
					</Bootstrap.Col>
				</Bootstrap.Row>
			</Bootstrap.Grid>
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
			}).catch(() => true);
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
					Update available. <Bootstrap.Button onClick={this.props.updateAction}>Update Dictionary</Bootstrap.Button>
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
			.then(currentValue => this.setState({currentValue: currentValue.value as string}))
			.catch(() => this.setState({currentValue: ''}))
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
