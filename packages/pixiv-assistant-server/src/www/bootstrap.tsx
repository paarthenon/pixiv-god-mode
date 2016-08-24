import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as log4js from 'log4js'

import Mailman from '../mailman'

let logger = log4js.getLogger('Bootstrap');

class Test extends React.Component<any, any> {
	public handleClick(){
		Mailman.ServerConfig.initialize({});
	}
	public render() {
		return <a onClick={this.handleClick.bind(this)}>Start Server</a>
	}
}

ReactDOM.render(<Test/>, document.getElementById('content'));

