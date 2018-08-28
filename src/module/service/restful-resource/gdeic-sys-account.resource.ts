import { Injectable } from '@angular/core';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export const GDEIC_SYS_ACCOUNT_RESOURCE = 'GDEIC_SYS_ACCOUNT_RESOURCE';

export interface GdeicSysAccountResourceMethods {
  queryAccount: () => Observable<any>;
  addAccount: (body: any) => Observable<any>;
  updateAccount: (body: any) => Observable<any>;
  lockAccount: (body: any) => Observable<any>;
  unlockAccount: (body: any) => Observable<any>;
  removeAccount: (body: any) => Observable<any>;
}

const _actions = {
  queryAccount: {
    url: 'api/account/get-accounts',
    method: 'GET'
  },
  addAccount: {
    url: 'api/account/add-account',
    method: 'POST'
  },
  updateAccount: {
    url: 'api/account/update-account',
    method: 'POST'
  },
  lockAccount: {
    url: 'api/account/lock-account',
    method: 'POST'
  },
  unlockAccount: {
    url: 'api/account/unlock-account',
    method: 'POST'
  },
  removeAccount: {
    url: 'api/account/del-account',
    method: 'POST'
  }
};

@Injectable()
export class GdeicSysAccountResource implements GdeicRestfulResource, GdeicSysAccountResourceMethods {
  readonly ResourceName = 'GdeicSysAccountResource';
  readonly queryAccount: () => Observable<any>;
  readonly addAccount: (body: any) => Observable<any>;
  readonly updateAccount: (body: any) => Observable<any>;
  readonly lockAccount: (body: any) => Observable<any>;
  readonly unlockAccount: (body: any) => Observable<any>;
  readonly removeAccount: (body: any) => Observable<any>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
    Object.defineProperty(window, GDEIC_SYS_ACCOUNT_RESOURCE, {
      value: this,
      writable: false,
      enumerable: false
    });
  }
}
