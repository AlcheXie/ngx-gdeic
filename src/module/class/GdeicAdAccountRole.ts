import { Gdeic } from '../service/gdeic.service';
import { GDEIC_RESTFUL, GdeicRestful } from '../service/gdeic-restful.service';
import { GDEIC_SYS_AD_ACCOUNT_RESOURCE, GdeicSysAdAccountResource } from '../service/restful-resource/gdeic-sys-ad-account.resource';
import * as GdeicSys from '../interface/GdeicSys';

export class GdeicAdAccountRole {
  Accounts: GdeicSys.GdeicAdAccount[];
  Roles: GdeicSys.GdeicRole[];
  ManageOu: GdeicSys.GdeicOu;
  LockoutEnabled: boolean;

  private _restful: GdeicRestful = window[GDEIC_RESTFUL];
  private _sysAdAccountResource: GdeicSysAdAccountResource = window[GDEIC_SYS_AD_ACCOUNT_RESOURCE];

  constructor(
    account: GdeicSys.GdeicAdAccount | GdeicSys.GdeicAdAccount[]
  ) {
    if (account.constructor === Array) {
      const _accounts = account as GdeicSys.GdeicAdAccount[];
      if (_accounts.length === 0) {
        throw new Error('No account is available.');
      }
      this.Accounts = _accounts;
      if (_accounts.length === 1) {
        const _account = _accounts[0];
        this.Roles = _accounts[0].Roles;
        this.ManageOu = _account.ManageOu;
        this.LockoutEnabled = _account.LockoutEnabled;
      }
    } else {
      const _account = account as GdeicSys.GdeicAdAccount;
      this.Accounts = [_account];
      this.Roles = _account.Roles;
      this.ManageOu = _account.ManageOu;
      this.LockoutEnabled = _account.LockoutEnabled;
    }
  }

  add(isAdmin: boolean, isUnifyManageOu: boolean = false): Promise<GdeicSys.GdeicAdAccount[]> {
    const _accounts = this._getResultAccountData(isAdmin, isUnifyManageOu);
    return Promise.all(
      _accounts.map(x => this._restful.getPromise((<GdeicSysAdAccountResource>this._sysAdAccountResource).addAccount(x)))
    );
  }

  update(isAdmin: boolean, isUnifyManageOu: boolean = false): Promise<GdeicSys.GdeicAdAccount[]> {
    const _accounts = this._getResultAccountData(isAdmin, isUnifyManageOu);
    return Promise.all(
      _accounts.map(x => this._restful.getPromise((<GdeicSysAdAccountResource>this._sysAdAccountResource).updateAccount(x)))
    );
  }

  lock(): Promise<GdeicSys.GdeicAdAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAdAccountResource>this._sysAdAccountResource).lockAccount(x)))
    );
  }

  unlock(): Promise<GdeicSys.GdeicAdAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAdAccountResource>this._sysAdAccountResource).unlockAccount(x)))
    );
  }

  remove(): Promise<GdeicSys.GdeicAdAccount[]> {
    return Promise.all(
      this.Accounts.map(x => this._restful.getPromise((<GdeicSysAdAccountResource>this._sysAdAccountResource).removeAccount(x)))
    );
  }

  private _getResultAccountData(isAdmin: boolean, isUnifyManageOu: boolean = false): GdeicSys.GdeicAdAccount[] {
    const data = Gdeic.copy(this.Accounts) as GdeicSys.GdeicAdAccount[];
    for (const account of data) {
      account.Roles = this.Roles;
      account.LockoutEnabled = this.LockoutEnabled;
      if (isAdmin) {
        if (isUnifyManageOu) {
          account.ManageOu = this.ManageOu;
        } else {
          account.ManageOu = account.Ou;
        }
      }
    }
    return data;
  }
}
