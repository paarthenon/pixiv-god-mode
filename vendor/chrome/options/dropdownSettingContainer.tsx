import * as React from 'react';

import {getSetting, setSetting} from 'vendor/chrome/userSettings';
import {DropdownSetting} from 'src/components/settings/dropdownSetting';

export interface DropdownSettingContainerProps {
    settingKey: string;
    options: {[lable: string]: any};
    label: string;
}

export class DropdownSettingContainer extends React.Component<
    DropdownSettingContainerProps,
    {currentValue: any}
> {
    state = {currentValue: undefined as any};

    componentDidMount() {
        this.state = {currentValue: undefined};
        getSetting(this.props.settingKey).then(currentValue =>
            this.setState({currentValue}),
        );
    }

    public handleUpdate(value: any) {
        setSetting(this.props.settingKey, value);
        this.setState({currentValue: value});
    }

    public render() {
        if (this.state.currentValue !== undefined) {
            return (
                <DropdownSetting
                    options={this.props.options}
                    label={this.props.label}
                    onChange={this.handleUpdate.bind(this)}
                    selected={this.state.currentValue}
                />
            );
        } else {
            return <div>Loading</div>;
        }
    }
}
