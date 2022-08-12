import { Injectable } from '@angular/core';

import { GdeicRestfulAction } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../gdeic-restful.service';
import { GdeicAdAccount, GdeicAd } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export const GDEIC_SYS_AD_ACCOUNT_RESOURCE = 'GDEIC_SYS_AD_ACCOUNT_RESOURCE';

export interface GdeicSysAdAccountResourceMethods {
  queryAccount: () => Observable<GdeicAdAccount[]>;
  addAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  updateAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  lockAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  unlockAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  removeAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
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
export class GdeicSysAdAccountResource implements GdeicSysAdAccountResourceMethods {
  readonly queryAccount: () => Observable<GdeicAdAccount[]>;
  readonly addAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  readonly updateAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  readonly lockAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  readonly unlockAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;
  readonly removeAccount: (body: GdeicAdAccount) => Observable<GdeicAdAccount>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
    Object.defineProperty(window, GDEIC_SYS_AD_ACCOUNT_RESOURCE, {
      value: this,
      writable: false,
      enumerable: false
    });
  }
}
