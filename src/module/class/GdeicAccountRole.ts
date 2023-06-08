import { inject } from '@angular/core';

import { Gdeic } from '../service/gdeic.service';
import { GdeicRestful } from '../service/gdeic-restful.service';
import { GdeicSysAccountResource } from '../service/restful-resource/gdeic-sys-account.resource';
import * as GdeicSys from '../interface/GdeicSys';

export class GdeicAccountRole {
  Accounts: GdeicSys.GdeicAccount[];
  Roles: GdeicSys.GdeicRole[];
  LockoutEnabled: boolean;

  private _restful: GdeicRestful = inject(GdeicRestful);
  private _sysAccountResource: GdeicSysAccountResource = inject(GdeicSysAccountResource);

  constructor(
    account: GdeicSys.GdeicAccount | GdeicSys.GdeicAccount[]
  ) {
    if (account.constructor === Array) {
      const _accounts = account as GdeicSys.GdeicAccount[];
      if (_accounts.length === 0) {
        throw new Error('No account is available.');
      }
      this.Accounts = _accounts;
      if (_accounts.length === 1) {
        const _account = _accounts[0];
        this.Roles = _accounts[0].Roles;
        this.LockoutEnabled = _account.LockoutEnabled;
      }
    } else {
      const _account = account as GdeicSys.GdeicAccount;
      this.Accounts = [_account];
      this.Roles = _account.Roles;
      this.LockoutEnabled = _account.LockoutEnabled;
    }
  }

  add(): Promise<GdeicSys.GdeicAccount[]> {
    return Promise.all(
      this._getResultAccountData()
        .map(x => this._restful.getPromise((<GdeicSysAccountResource>this._sysAccountResource).addAccount(x)))
    );
  }

  update(): Promise<GdeicSys.GdeicAccount[]> {
    return Promise.all(
      this._getResultAccountData()
        .map(x => this._restful.getPromise((<GdeicSysAccountResource>this._sysAccountResource).updateAccount(x)))
    );
  }

  lock(): Promise<GdeicSys.GdeicAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAccountResource>this._sysAccountResource).lockAccount(x)))
    );
  }

  unlock(): Promise<GdeicSys.GdeicAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAccountResource>this._sysAccountResource).unlockAccount(x)))
    );
  }

  remove(): Promise<GdeicSys.GdeicAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAccountResource>this._sysAccountResource).removeAccount(x)))
    );
  }

  private _getResultAccountData(): GdeicSys.GdeicAccount[] {
    const data = Gdeic.copy(this.Accounts) as GdeicSys.GdeicAccount[];
    for (const account of data) {
      account.Roles = this.Roles;
      account.LockoutEnabled = this.LockoutEnabled;
    }
    return data;
  }
}
