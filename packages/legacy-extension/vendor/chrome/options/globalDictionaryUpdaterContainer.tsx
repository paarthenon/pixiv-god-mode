import * as React from 'react';

import {
    GlobalDictUpdateState,
    GlobalDictionaryUpdater,
} from 'src/components/dictionary/globalDictionaryUpdater';
import {DuplicateKeyReporter} from 'src/components/dictionary/duplicateKeyReporter';

import {DictionaryService} from 'vendor/chrome/services';

export class GlobalDictUpdaterContainer extends React.Component<
    {},
    {mode: GlobalDictUpdateState; dupeLocalKeys: string[]}
> {
    state = {mode: GlobalDictUpdateState.LOADING, dupeLocalKeys: undefined as string[]};

    componentDidMount() {
        this.updateStatus();
    }

    protected updateMode(mode: GlobalDictUpdateState) {
        this.setState({mode, dupeLocalKeys: this.state.dupeLocalKeys});
    }
    protected updateStatus() {
        DictionaryService.globalUpdateAvailable.then(isAvailable => {
            if (isAvailable) {
                this.updateMode(GlobalDictUpdateState.AVAILABLE);
            } else {
                this.updateMode(GlobalDictUpdateState.UPTODATE);
            }
        });
        DictionaryService.getLocalDuplicates().then(dupeLocalKeys => {
            this.setState({mode: this.state.mode, dupeLocalKeys});
        });
    }
    public updateDictionary() {
        this.updateMode(GlobalDictUpdateState.DOWNLOADING);
        DictionaryService.updateGlobalDictionary().then(() => this.updateStatus());
    }
    public removeDuplicates() {
        DictionaryService.deleteLocalDuplicates().then(() => this.updateStatus());
    }
    public render() {
        return (
            <div>
                <GlobalDictionaryUpdater
                    mode={this.state.mode}
                    updateAction={this.updateDictionary.bind(this)}
                />
                <DuplicateKeyReporter
                    dupes={this.state.dupeLocalKeys}
                    removeAction={this.removeDuplicates.bind(this)}
                />
            </div>
        );
    }
}
