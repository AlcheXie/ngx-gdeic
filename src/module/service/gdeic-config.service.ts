import { Injectable, Optional } from '@angular/core';

export class GdeicConfigConfig {
    appTitle: string;
    loginUrl?: string;
}

@Injectable()
export class GdeicConfig {
    _appTitle: string;
    _loginUrl: string;

    get appTitle() {
        return this._appTitle;
    }

    get loginUrl(){
        return this._loginUrl;
    }

    constructor( @Optional() config: GdeicConfigConfig) {
        if (config) {
            this._appTitle = config.appTitle;
            this._loginUrl = config.loginUrl;
        }
    }
}