import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import {Action} from '../../../src/actionModel'
import {getUserSettings, getSetting, setSetting} from '../userSettings'
import SettingKeys from '../../../src/settingKeys'


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
			</div>
		);
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
