import * as React from 'react'
import * as Bootstrap from 'react-bootstrap'
import * as log4js from 'log4js'

import Mailman from '../mailman'
import {Action} from '../../../src/actionModel'

let logger = log4js.getLogger('HomePanel');

export class HomePanel extends React.Component<any,any> {
	constructor() {
		super();
	}
	public render() {
		return (
			<div>
				<p>Add Dictionary</p>
				<p>?actions</p>
				<p>Server status</p>
			</div>
			);
	}
}
