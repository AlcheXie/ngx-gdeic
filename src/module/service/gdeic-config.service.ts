import { Injectable, Optional } from '@angular/core';

export class GdeicConfigConfig {
  appTitle: string;
  loginUrl?: string;
}

@Injectable()
export class GdeicConfig {
  readonly GDEIC_APP_ID: number;
  readonly appTitle: string;
  readonly loginUrl: string;

  constructor(@Optional() config: GdeicConfigConfig) {
    this.GDEIC_APP_ID = (new Date()).getTime();
    if (config) {
      this.appTitle = config.appTitle;
      this.loginUrl = config.loginUrl;
    }
  }
}
