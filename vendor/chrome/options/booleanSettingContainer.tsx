import * as React from 'react'

import {getSetting, setSetting} from 'vendor/chrome/userSettings'
import {BooleanSetting} from 'src/components/settings/booleanSetting'

interface BooleanSettingContainerProps {
	settingKey:string
	label:string
}

export class BooleanSettingContainer extends React.Component<BooleanSettingContainerProps, {currentValue:boolean}> {
	state = { currentValue: false };

	componentDidMount() {
		this.state = { currentValue: undefined };
		getSetting(this.props.settingKey)
			.then(currentValue => this.setState({currentValue}))
			.catch(() => this.setState({currentValue: false}))
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