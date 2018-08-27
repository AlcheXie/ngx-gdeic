import { Injectable } from '@angular/core';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export const GDEIC_SYS_RESOURCE = 'GDEIC_SYS_RESOURCE';

export interface GdeicSysResourceMethods {
  me: () => Observable<any>;
  myMenu: () => Observable<any>;
  getAdTree: () => Observable<any>;
  refreshAd: () => Observable<any>;
  queryAccount: () => Observable<any>;
  searchAccount: (params: { keyword: string }) => Observable<any>;
  getAccountById: (params: { id: string }) => Observable<any>;
  addAccount: (body: any) => Observable<any>;
  updateAccount: (body: any) => Observable<any>;
  lockAccount: (body: any) => Observable<any>;
  unlockAccount: (body: any) => Observable<any>;
  removeAccount: (body: any) => Observable<any>;
  queryRole: () => Observable<any>;
  queryRoleAdmin: () => Observable<any>;
  getRoleById: (params: { id: string }) => Observable<any>;
  addRole: (body: any) => Observable<any>;
  updateRole: (body: any) => Observable<any>;
  removeRole: (body: any) => Observable<any>;
  queryMenu: () => Observable<any>;
  getMenuById: (params: { id: string }) => Observable<any>;
  addMenu: (body: any) => Observable<any>;
  updateMenu: (body: any) => Observable<any>;
  removeMenu: (body: any) => Observable<any>;
}

const _actions = {
  me: {
    url: 'api/account/me',
    method: 'GET'
  },
  myMenu: {
    url: 'api/account/menu',
    method: 'GET'
  },
  getAdTree: {
    url: 'api/account/get-ad-ou',
    method: 'GET'
  },
  refreshAd: {
    url: 'api/account/refresh-ad',
    method: 'GET'
  },
  queryAccount: {
    url: 'api/account/get-accounts',
    method: 'GET'
  },
  searchAccount: {
    url: 'api/account/get-ad-accounts/search/:keyword',
    method: 'GET'
  },
  getAccountById: {
    url: 'api/account/get-ad-account/:id',
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
  },
  queryRole: {
    url: 'api/account/get-roles',
    method: 'GET'
  },
  queryRoleAdmin: {
    url: 'api/account/get-roles-admin',
    method: 'GET'
  },
  getRoleById: {
    url: 'api/account/get-role/:id',
    method: 'GET'
  },
  addRole: {
    url: 'api/account/add-role',
    method: 'POST'
  },
  updateRole: {
    url: 'api/account/update-role',
    method: 'POST'
  },
  removeRole: {
    url: 'api/account/del-role',
    method: 'POST'
  },
  queryMenu: {
    url: 'api/account/get-menus',
    method: 'GET'
  },
  getMenuById: {
    url: 'api/account/get-menu/:id',
    method: 'GET'
  },
  addMenu: {
    url: 'api/account/add-menu',
    method: 'POST'
  },
  updateMenu: {
    url: 'api/account/update-menu',
    method: 'POST'
  },
  removeMenu: {
    url: 'api/account/del-menu',
    method: 'POST'
  }
};

@Injectable()
export class GdeicSysResource implements GdeicRestfulResource, GdeicSysResourceMethods {
  readonly ResourceName = 'GdeicSysResource';
  readonly me: () => Observable<any>;
  readonly myMenu: () => Observable<any>;
  readonly getAdTree: () => Observable<any>;
  readonly refreshAd: () => Observable<any>;
  readonly queryAccount: () => Observable<any>;
  readonly searchAccount: (params: { keyword: string }) => Observable<any>;
  readonly getAccountById: (params: { id: string }) => Observable<any>;
  readonly addAccount: (body: any) => Observable<any>;
  readonly updateAccount: (body: any) => Observable<any>;
  readonly lockAccount: (body: any) => Observable<any>;
  readonly unlockAccount: (body: any) => Observable<any>;
  readonly removeAccount: (body: any) => Observable<any>;
  readonly queryRole: () => Observable<any>;
  readonly queryRoleAdmin: () => Observable<any>;
  readonly getRoleById: (params: { id: string }) => Observable<any>;
  readonly addRole: (body: any) => Observable<any>;
  readonly updateRole: (body: any) => Observable<any>;
  readonly removeRole: (body: any) => Observable<any>;
  readonly queryMenu: () => Observable<any>;
  readonly getMenuById: (params: { id: string }) => Observable<any>;
  readonly addMenu: (body: any) => Observable<any>;
  readonly updateMenu: (body: any) => Observable<any>;
  readonly removeMenu: (body: any) => Observable<any>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
    Object.defineProperty(window, GDEIC_SYS_RESOURCE, {
      value: this,
      writable: false,
      enumerable: false
    });
  }
}
