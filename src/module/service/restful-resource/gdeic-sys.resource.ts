import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export let GDEIC_SYS_RESOURCE: GdeicSysResource | GdeicSysNewResource;

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

@Injectable()
export class GdeicSysResource implements GdeicRestfulResource, GdeicSysResourceMethods {
  ResourceName = 'GdeicSysResource';
  getAccountInfo: () => Observable<Response>;
  getHeader: () => Observable<Response>;
  queryAccount: () => Observable<Response>;
  queryAccountByKeyword: (params: { keyword: string }) => Observable<Response>;
  saveAccount: (body: any) => Observable<Response>;
  lockAccount: (params: { uid: number }) => Observable<Response>;
  deleteAccount: (params: { uid: number }) => Observable<Response>;
  queryRole: () => Observable<Response>;
  queryRoleAdmin: () => Observable<Response>;
  saveRole: (body: any) => Observable<Response>;
  lockRole: (params: { roleId: number }) => Observable<Response>;
  deleteRole: (params: { roleId: number }) => Observable<Response>;
  queryMenu: () => Observable<Response>;
  getMenuById: (params: { menuId: number }) => Observable<Response>;
  saveMenu: (body: any) => Observable<Response>;
  lockMenu: (params: { menuId: number }) => Observable<Response>;
  deleteMenu: (params: { menuId: number }) => Observable<Response>;
  getOuTree: () => Observable<Response>;
  initOutree: () => Observable<Response>;
  queryOuAccounts: (params: { ouId: number }) => Observable<Response>;

  constructor(
    private _http: Http
  ) {
    GdeicRestful.make(_actions, this, _http);
    GDEIC_SYS_RESOURCE = this;
  }
}

@Injectable()
export class GdeicSysNewResource implements GdeicRestfulResource {
  ResourceName = 'GdeicSysNewResource';
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

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    _gdeicRestful.make(_actions, this);
    GDEIC_SYS_RESOURCE = this;
  }
}
