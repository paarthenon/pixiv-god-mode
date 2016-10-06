import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {SettingsPanel} from 'vendor/chrome/popup/settingsPanel'
import {DictionaryJSON} from 'vendor/chrome/popup/exportDict'

class SettingsPage extends React.Component<void, void> {
    style = {
        width: '800px'
    }
    public render() {
        return <div style={this.style}>
            <SettingsPanel />
            <DictionaryJSON />
        </div>
    }
}
ReactDOM.render(<SettingsPage />, document.getElementById('content'));
