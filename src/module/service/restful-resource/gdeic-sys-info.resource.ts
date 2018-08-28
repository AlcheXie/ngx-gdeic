import { Injectable } from '@angular/core';

import { GdeicRestfulAction, GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';
import { GdeicAccount, GdeicLoginAccount, GdeicMenu, GdeicRegisterAccount } from '../../interface/GdeicSys';

import { Observable } from 'rxjs/Observable';

export interface GdeicSysInfoResourceMethods {
  register: (body: GdeicRegisterAccount) => Observable<GdeicAccount>;
  login: (body: { UserName: string; PassWord: string; CheckCode: string }) => Observable<any>;
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
  readonly me: () => Observable<GdeicLoginAccount>;
  readonly myMenu: () => Observable<GdeicMenu[]>;
  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
