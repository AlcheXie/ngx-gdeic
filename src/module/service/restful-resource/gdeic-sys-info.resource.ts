import { Injectable } from '@angular/core';

import { GdeicRestfulAction, GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';
import { GdeicAccount, GdeicLoginAccount, GdeicMenu, GdeicRegisterAccount } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export interface GdeicSysInfoResourceMethods {
  register: (body: GdeicRegisterAccount) => Observable<GdeicAccount>;
  login: (body: { UserName: string; PassWord: string; CheckCode: string }) => Observable<any>;
  changePassword: (body: { AccountId: string, OldPassword: string, NewPassword: string }) => Observable<boolean>;
  resetPassword: (body: { AccountId: string, NewPassword: string }) => Observable<boolean>;
  me: () => Observable<GdeicLoginAccount>;
  myMenu: () => Observable<GdeicMenu[]>;
}

const _actions: { [name: string]: GdeicRestfulAction } = {
  register: {
    url: 'api/account/reg',
    method: 'POST'
  },
  login: {
    url: 'api/account/login',
    method: 'POST',
    observe: 'response',
    responseType: 'text'
  },
  changePassword: {
    url: 'api/account/change-pwd',
    method: 'POST'
  },
  resetPassword: {
    url: 'api/account/reset-pwd',
    method: 'POST'
  },
  me: {
    url: 'api/account/me',
    method: 'GET'
  },
  myMenu: {
    url: 'api/account/menu',
    method: 'GET'
  }
};

@Injectable()
export class GdeicSysInfoResource implements GdeicRestfulResource, GdeicSysInfoResourceMethods {
  readonly ResourceName = 'GdeicSysInfoResource';
  readonly register: (body: GdeicRegisterAccount) => Observable<GdeicAccount>;
  readonly login: (body: { UserName: string; PassWord: string; CheckCode: string }) => Observable<any>;
  readonly changePassword: (body: { AccountId: string, OldPassword: string, NewPassword: string }) => Observable<boolean>;
  readonly resetPassword: (body: { AccountId: string, NewPassword: string }) => Observable<boolean>;
  readonly me: () => Observable<GdeicLoginAccount>;
  readonly myMenu: () => Observable<GdeicMenu[]>;
  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
