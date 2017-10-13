import { Injectable, Optional } from '@angular/core';

export class GdeicConfigConfig {
  appTitle: string;
  loginUrl?: string;
}

@Injectable()
export class GdeicConfig {
  get GDEIC_APP_ID(): number {
    return this._GDEIC_APP_ID;
  }
  get appTitle(): string {
    return this._appTitle;
  }
  get loginUrl(): string {
    return this._loginUrl;
  }

  private _GDEIC_APP_ID: number;
  private _appTitle: string;
  private _loginUrl: string;

  constructor( @Optional() config: GdeicConfigConfig) {
    this._GDEIC_APP_ID = (new Date()).getTime();
    if (config) {
      this._appTitle = config.appTitle;
      this._loginUrl = config.loginUrl;
    }
  }
}
