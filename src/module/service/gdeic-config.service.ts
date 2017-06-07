import { Injectable, Optional } from '@angular/core';

export class GdeicConfigConfig {
    appTitle: string;
}

@Injectable()
export class GdeicConfig {
    _appTitle: string;

    get appTitle() {
        return this._appTitle;
    }

    constructor( @Optional() config: GdeicConfigConfig) {
        if (config) {
            this._appTitle = config.appTitle;
        }
    }
}