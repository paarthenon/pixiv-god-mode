import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

import {PopupFrame} from 'vendor/chrome/popup/components/popupFrame'
import {DictContainer} from 'vendor/chrome/popup/dict'
import {DictionaryService} from 'vendor/chrome/popup/services'


ReactDOM.render(
	<PopupFrame>
		<DictContainer dictService={DictionaryService} />
	</PopupFrame>
	, document.getElementById('content'));