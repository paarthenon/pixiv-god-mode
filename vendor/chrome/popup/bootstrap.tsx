import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {MainPanel} from './mainPanel'
import {ConfigPanel} from './configPanel'
import {Tabs} from './tabs'
import {DictViewer} from './dict'

let tabInfo: { [id: string]: JSX.Element } = {
	config: <ConfigPanel />, 
	test: <div></div>
}
ReactDOM.render(<Tabs tabs={tabInfo} initialTab="config" /> , document.getElementById('content'));
