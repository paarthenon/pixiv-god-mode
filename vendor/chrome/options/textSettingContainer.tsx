import * as React from 'react';

import {Config} from 'vendor/chrome/services';
import {TextSetting} from 'src/components/settings/textSetting';

export interface TextSettingsContainerProps {
    label: string;
    settingKey: string;
}

export class TextSettingContainer extends React.Component<
    TextSettingsContainerProps,
    {currentValue: string}
> {
    state = {currentValue: undefined as string};
    componentDidMount() {
        Config.get(this.props.settingKey)
            .then(settingValue => this.setState({currentValue: settingValue as string}))
            .catch(() => this.setState({currentValue: ''}));
    }
    public handleUpdate(value: string) {
        Config.set(this.props.settingKey, value);
    }
    public render() {
        if (this.state.currentValue !== undefined) {
            return (
                <TextSetting
                    label={this.props.label}
                    text={this.state.currentValue}
                    onUpdate={this.handleUpdate.bind(this)}
                />
            );
        } else {
            return <div>Loading</div>;
        }
    }
}
