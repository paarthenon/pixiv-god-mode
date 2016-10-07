import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {TranslationSettingsPanel} from 'vendor/chrome/options/translationSettingsPanel'
import {ServerSettingsPanel} from 'vendor/chrome/options/serverSettingsPanel'

import {ArtistBookmarksSettingsPanel} from 'vendor/chrome/options/artistBookmarksSettingsPanel'
import {BookmarkIllustrationSettingsPanel} from 'vendor/chrome/options/bookmarkIllustrationSettingsPanel'
import {IllustrationSettingsPanel} from 'vendor/chrome/options/illustrationSettingsPanel'
import {MangaSettingsPanel} from 'vendor/chrome/options/mangaSettingsPanel'
import {SearchSettingsPanel} from 'vendor/chrome/options/searchSettingsPanel'
import {WorksSettingsPanel} from 'vendor/chrome/options/worksSettingsPanel'

import {DictionaryJSON} from 'vendor/chrome/popup/exportDict'

class SettingsPage extends React.Component<void, void> {
    style = {
        width: '800px'
    }
    public render() {
        return <div style={this.style}>
            <TranslationSettingsPanel />
            <ServerSettingsPanel />
            <IllustrationSettingsPanel />
            <MangaSettingsPanel />
            <WorksSettingsPanel />
            <BookmarkIllustrationSettingsPanel />
            <ArtistBookmarksSettingsPanel />
            <SearchSettingsPanel />
            <DictionaryJSON />
        </div>
    }
}
ReactDOM.render(<SettingsPage />, document.getElementById('content'));
