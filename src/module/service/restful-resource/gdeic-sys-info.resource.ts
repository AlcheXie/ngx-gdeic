import { Injectable } from '@angular/core';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export interface GdeicSysInfoResourceMethods {
  register: (body: any) => Observable<any>;
  login: (body: { UserName: string; PassWord: string; CheckCode: string }) => Observable<any>;
  me: () => Observable<any>;
  myMenu: () => Observable<any>;
}

const _actions = {
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
  readonly register: (body: any) => Observable<any>;
  readonly login: (body: { UserName: string; PassWord: string; CheckCode: string }) => Observable<any>;
  readonly me: () => Observable<any>;
  readonly myMenu: () => Observable<any>;
  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
