import { Injectable } from '@angular/core';

import { GdeicRestfulAction } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../gdeic-restful.service';
import { GdeicAccount } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export const GDEIC_SYS_ACCOUNT_RESOURCE = 'GDEIC_SYS_ACCOUNT_RESOURCE';

export interface GdeicSysAccountResourceMethods {
  queryAccount: () => Observable<GdeicAccount[]>;
  addAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  updateAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  lockAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  unlockAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  removeAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
}

const _actions: { [name: string]: GdeicRestfulAction } = {
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
export class GdeicSysAccountResource implements GdeicSysAccountResourceMethods {
  readonly queryAccount: () => Observable<GdeicAccount[]>;
  readonly addAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  readonly updateAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  readonly lockAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  readonly unlockAccount: (body: GdeicAccount) => Observable<GdeicAccount>;
  readonly removeAccount: (body: GdeicAccount) => Observable<GdeicAccount>;

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
