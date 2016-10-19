import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Bootstrap from 'react-bootstrap'

import {TranslationSettingsPanel} from 'vendor/chrome/options/translationSettingsPanel'
import {ServerSettingsPanel} from 'vendor/chrome/options/serverSettingsPanel'

import {GlobalSettingsPanel} from 'vendor/chrome/options/globalSettingsPanel'
import {BookmarkIllustrationSettingsPanel} from 'vendor/chrome/options/bookmarkIllustrationSettingsPanel'
import {IllustrationSettingsPanel} from 'vendor/chrome/options/illustrationSettingsPanel'
import {MangaSettingsPanel} from 'vendor/chrome/options/mangaSettingsPanel'
import {WorksSettingsPanel} from 'vendor/chrome/options/worksSettingsPanel'

import {DictionaryJSON} from 'vendor/chrome/popup/exportDict'

class SettingsPage extends React.Component<void, void> {
    public render() {
        return <Bootstrap.Grid>
            <TranslationSettingsPanel />
            <ServerSettingsPanel />
            <GlobalSettingsPanel />
            <IllustrationSettingsPanel />
            <MangaSettingsPanel />
            <WorksSettingsPanel />
            <BookmarkIllustrationSettingsPanel />
            <DictionaryJSON />
        </Bootstrap.Grid>
    }
}
ReactDOM.render(<SettingsPage />, document.getElementById('content'));
