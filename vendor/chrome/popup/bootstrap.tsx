import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {MainPanel} from './mainPanel'
import {ConfigPanel} from './configPanel'
import {Tabs} from './tabs'

ReactDOM.render(<Tabs tabs={{ config: <ConfigPanel />, test: <div></div> }} initialTab="config" /> , document.getElementById('content'));
