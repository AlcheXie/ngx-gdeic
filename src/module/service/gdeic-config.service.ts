import { Injectable, Optional } from '@angular/core';

export class GdeicConfigConfig {
  APP_TITLE?: string;
  LOGIN_URL?: string;
  SUCCESS_CODE?: number;
  RESOURCE_BASE_URL?: string;
}

@Injectable()
export class GdeicConfig {
  readonly GDEIC_APP_ID: number;
  readonly APP_TITLE: string;
  readonly LOGIN_URL: string;
  readonly SUCCESS_CODE: number;
  readonly RESOURCE_BASE_URL: string;

  constructor(@Optional() config: GdeicConfigConfig) {
    this.GDEIC_APP_ID = (new Date()).getTime();
    if (config) {
      this.APP_TITLE = config.APP_TITLE;
      this.LOGIN_URL = config.LOGIN_URL;
      this.SUCCESS_CODE = config.SUCCESS_CODE !== undefined ? config.SUCCESS_CODE : 200;
      this.RESOURCE_BASE_URL = config.RESOURCE_BASE_URL || '';
    }
  }
}
