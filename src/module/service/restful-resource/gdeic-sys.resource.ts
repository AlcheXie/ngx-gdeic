import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export const GDEIC_SYS_RESOURCE = 'GDEIC_SYS_RESOURCE';

interface GdeicSysResourceMethods {
  getAccountInfo: () => Observable<any>;
  getHeader: () => Observable<any>;
  queryAccount: () => Observable<any>;
  queryAccountByKeyword: (params: { keyword: string }) => Observable<any>;
  saveAccount: (body: any) => Observable<any>;
  lockAccount: (params: { uid: number }) => Observable<any>;
  deleteAccount: (params: { uid: number }) => Observable<any>;
  queryRole: () => Observable<any>;
  queryRoleAdmin: () => Observable<any>;
  saveRole: (body) => Observable<any>;
  lockRole: (params: { roleId: number }) => Observable<any>;
  deleteRole: (params: { roleId: number }) => Observable<any>;
  queryMenu: () => Observable<any>;
  getMenuById: (params: { menuId: number }) => Observable<any>;
  saveMenu: (body) => Observable<any>;
  lockMenu: (params: { menuId: number }) => Observable<any>;
  deleteMenu: (params: { menuId: number }) => Observable<any>;
  getOuTree: () => Observable<any>;
  initOutree: () => Observable<any>;
  queryOuAccounts: (params: { ouId: number }) => Observable<any>;
}

interface GdeicSysNewResourceMethods extends GdeicSysResourceMethods {
  me: () => Observable<any>;
  myMenu: () => Observable<any>;
  getAdTree: () => Observable<any>;
  refreshAd: () => Observable<any>;
  searchAccount: (params: { keyword: string }) => Observable<any>;
  addAccount: (body: any) => Observable<any>;
  updateAccount: (body: any) => Observable<any>;
  lockUpAccount: (body: any) => Observable<any>;
  unlockAccount: (body: any) => Observable<any>;
  removeAccount: (body: any) => Observable<any>;
  addRole: (body: any) => Observable<any>;
  updateRole: (body: any) => Observable<any>;
  removeRole: (body: any) => Observable<any>;
  addMenu: (body: any) => Observable<any>;
  updateMenu: (body: any) => Observable<any>;
  removeMenu: (body: any) => Observable<any>;
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}

const _actions = {
  getAccountInfo: {
    url: 'api/account/account',
    method: 'GET'
  },
  getHeader: {
    url: 'api/account/header',
    method: 'GET'
  },
  queryAccount: {
    url: 'api/account/get-accounts',
    method: 'GET'
  },
  queryAccountByKeyword: {
    url: 'api/account/ou-accounts/search/:keyword',
    method: 'GET'
  },
  saveAccount: {
    url: 'api/account/add-accounts',
    method: 'POST'
  },
  lockAccount: {
    url: 'api/account/lock-account/:uid',
    method: 'GET'
  },
  deleteAccount: {
    url: 'api/account/del-account/:uid',
    method: 'GET'
  },
  queryRole: {
    url: 'api/account/get-roles',
    method: 'GET'
  },
  queryRoleAdmin: {
    url: 'api/account/get-roles-admin',
    method: 'GET'
  },
  saveRole: {
    url: 'api/account/add-role',
    method: 'POST'
  },
  lockRole: {
    url: 'api/account/remove-role/:roleId',
    method: 'GET'
  },
  deleteRole: {
    url: 'api/account/del-role/:roleId',
    method: 'GET'
  },
  queryMenu: {
    url: 'api/account/get-menus',
    method: 'GET'
  },
  getMenuById: {
    url: 'api/account/get-menu/:menuId',
    method: 'GET'
  },
  saveMenu: {
    url: 'api/account/add-menu',
    method: 'POST'
  },
  lockMenu: {
    url: 'api/account/remove-menu/:menuId',
    method: 'GET'
  },
  deleteMenu: {
    url: 'api/account/del-menu/:menuId',
    method: 'GET'
  },
  getOuTree: {
    url: 'api/account/ou-tree',
    method: 'GET'
  },
  initOutree: {
    url: 'api/account/init-ou',
    method: 'GET'
  },
  queryOuAccounts: {
    url: 'api/account/ou-accounts/:ouId',
    method: 'GET'
  }
};
const _newActions = {
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
  searchAccount: {
    url: 'api/account/get-ad-accounts/search/:keyword',
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
  lockUpAccount: {
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
}

@Injectable()
export class GdeicSysResource implements Readonly<GdeicRestfulResource>, Readonly<GdeicSysResourceMethods> {
  // old
  readonly ResourceName = 'GdeicSysResource';
  readonly getAccountInfo: () => Observable<Response>;
  readonly getHeader: () => Observable<Response>;
  readonly queryAccount: () => Observable<Response>;
  readonly queryAccountByKeyword: (params: { keyword: string }) => Observable<Response>;
  readonly saveAccount: (body: any) => Observable<Response>;
  readonly lockAccount: (params: { uid: number }) => Observable<Response>;
  readonly deleteAccount: (params: { uid: number }) => Observable<Response>;
  readonly queryRole: () => Observable<Response>;
  readonly queryRoleAdmin: () => Observable<Response>;
  readonly saveRole: (body: any) => Observable<Response>;
  readonly lockRole: (params: { roleId: number }) => Observable<Response>;
  readonly deleteRole: (params: { roleId: number }) => Observable<Response>;
  readonly queryMenu: () => Observable<Response>;
  readonly getMenuById: (params: { menuId: number }) => Observable<Response>;
  readonly saveMenu: (body: any) => Observable<Response>;
  readonly lockMenu: (params: { menuId: number }) => Observable<Response>;
  readonly deleteMenu: (params: { menuId: number }) => Observable<Response>;
  readonly getOuTree: () => Observable<Response>;
  readonly initOutree: () => Observable<Response>;
  readonly queryOuAccounts: (params: { ouId: number }) => Observable<Response>;

  constructor(
    private _http: Http
  ) {
    GdeicRestful.make(_actions, this, _http);
    Object.defineProperty(window, GDEIC_SYS_RESOURCE, {
      value: this,
      writable: false,
      enumerable: false
    });
  }
}

@Injectable()
export class GdeicSysNewResource implements Readonly<GdeicRestfulResource>, Readonly<GdeicSysNewResourceMethods> {
  readonly ResourceName = 'GdeicSysNewResource';
  //#region  old
  readonly getAccountInfo: () => Observable<any>;
  readonly getHeader: () => Observable<any>;
  readonly queryAccount: () => Observable<any>;
  readonly queryAccountByKeyword: (params: { keyword: string }) => Observable<any>;
  readonly saveAccount: (body: any) => Observable<any>;
  readonly lockAccount: (params: { uid: number }) => Observable<any>;
  readonly deleteAccount: (params: { uid: number }) => Observable<any>;
  readonly queryRole: () => Observable<any>;
  readonly queryRoleAdmin: () => Observable<any>;
  readonly saveRole: (body) => Observable<any>;
  readonly lockRole: (params: { roleId: number }) => Observable<any>;
  readonly deleteRole: (params: { roleId: number }) => Observable<any>;
  readonly queryMenu: () => Observable<any>;
  readonly getMenuById: (params: { menuId: number }) => Observable<any>;
  readonly saveMenu: (body) => Observable<any>;
  readonly lockMenu: (params: { menuId: number }) => Observable<any>;
  readonly deleteMenu: (params: { menuId: number }) => Observable<any>;
  readonly getOuTree: () => Observable<any>;
  readonly initOutree: () => Observable<any>;
  readonly queryOuAccounts: (params: { ouId: number }) => Observable<any>;
  //#endregion
  readonly me: () => Observable<any>;
  readonly myMenu: () => Observable<any>;
  readonly getAdTree: () => Observable<any>;
  readonly refreshAd: () => Observable<any>;
  readonly searchAccount: (params: { keyword: string }) => Observable<any>;
  readonly addAccount: (body: any) => Observable<any>;
  readonly updateAccount: (body: any) => Observable<any>;
  readonly lockUpAccount: (body: any) => Observable<any>;
  readonly unlockAccount: (body: any) => Observable<any>;
  readonly removeAccount: (body: any) => Observable<any>;
  readonly addRole: (body: any) => Observable<any>;
  readonly updateRole: (body: any) => Observable<any>;
  readonly removeRole: (body: any) => Observable<any>;
  readonly addMenu: (body: any) => Observable<any>;
  readonly updateMenu: (body: any) => Observable<any>;
  readonly removeMenu: (body: any) => Observable<any>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    _gdeicRestful.make({ ..._actions, ..._newActions }, this);
    Object.defineProperty(window, GDEIC_SYS_RESOURCE, {
      value: this,
      writable: false,
      enumerable: false
    });
  }
}
