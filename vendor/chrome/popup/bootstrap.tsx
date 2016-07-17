import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {MainPanel} from './mainPanel'
import {ConfigPanel} from './configPanel'
import {Tabs} from './tabs'
import {DictViewer} from './dict'
import {ReadOnlyDictViewer} from './readOnlyDict'
import {ActionPanel} from './actionPanel'

import configKeys from '../../../src/configKeys'

let dictionary: { [id: string]:string } = {
	jp1: 'english1',
	jp2: 'english2'
};

function updateDict(key: string, value: string) {
	dictionary[key] = value;
	render()
}

let official_dict :any = {};

import Mailman from '../mailman'
Mailman.Background.getConfig({ key: configKeys.official_dict })
	.then(dict => { official_dict = dict.value; render(); });

function render() {
	let tabInfo: { [id: string]: JSX.Element } = {
		actions: <ActionPanel />,
		config: <ConfigPanel />,
		dictionary: <DictViewer
			dict={dictionary}
			onAdd={updateDict}
			onUpdate={updateDict}
			onDelete={(key: string) => { delete dictionary[key]; render(); } }
			/>,
		officialDict: <ReadOnlyDictViewer dict={official_dict}/>
	}

	ReactDOM.render(<Tabs tabs={tabInfo} initialTab="actions" />, document.getElementById('content'));
}

render();