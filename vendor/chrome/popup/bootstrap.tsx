import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {MainPanel} from './mainPanel'
import {ConfigPanel} from './configPanel'
import {Tabs} from './tabs'
import {DictViewer} from './dict'

import configKeys from '../../../src/configKeys'

let dictionary: { [id: string]:string } = {
	jp1: 'english1',
	jp2: 'english2'
};

function updateDict(key: string, value: string) {
	dictionary[key] = value;
	render()
}

function render() {
	let tabInfo: { [id: string]: JSX.Element } = {
		config: <ConfigPanel />,
		dictionary: <DictViewer
			dict={dictionary}
			onAdd={updateDict}
			onUpdate={updateDict}
			onDelete={(key: string) => { delete dictionary[key]; render(); } }
			/>
	}

	console.log('updating with', dictionary);
	ReactDOM.render(<Tabs tabs={tabInfo} initialTab="config" />, document.getElementById('content'));
}

render();