import { Gdeic } from '../service/gdeic.service';
import { GDEIC_RESTFUL } from '../service/gdeic-restful.service';
import { GDEIC_SYS_RESOURCE } from '../service/restful-resource/gdeic-sys.resource';
import * as GdeicSys from '../interface/GdeicSys';

export class GdeicAccountRole {
  Accounts: GdeicSys.GdeicAccount[];
  Roles: GdeicSys.GdeicRole[];
  ManageOu: GdeicSys.GdeicManageOu;
  LockoutEnabled: boolean;

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
        this.ManageOu = _account.ManageOu;
        this.LockoutEnabled = _account.LockoutEnabled;
      }
    } else {
      const _account = account as GdeicSys.GdeicAccount;
      this.Accounts = [_account];
      this.Roles = _account.Roles;
      this.ManageOu = _account.ManageOu;
      this.LockoutEnabled = _account.LockoutEnabled;
    }
  }

  save(isAdmin: boolean, isUnifyManageOu: boolean = false): Promise<any> {
    const _accounts = Gdeic.copy(this.Accounts);
    for (const account of _accounts) {
      account.roles = this.Roles;
      if (isAdmin) {
        if (isUnifyManageOu) {
          account.ManageOu = this.ManageOu;
        } else {
          account.ManageOu = account.Ou;
        }
        account.LockoutEnabled = this.LockoutEnabled;
      }
    }
    return GDEIC_RESTFUL.getPromise(GDEIC_SYS_RESOURCE.saveAccount(_accounts));
  }
}
