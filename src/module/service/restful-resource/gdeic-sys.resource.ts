import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class GdeicSysResource implements GdeicRestfulResource {
  ResourceName = 'GdeicSysResource';
  getAccountInfo: (...values: any[]) => Observable<Response>;
  getHeader: (...values: any[]) => Observable<Response>;
  queryAccount: (...values: any[]) => Observable<Response>;
  queryAccountByKeyword: (...values: any[]) => Observable<Response>;
  saveAccount: (...values: any[]) => Observable<Response>;
  lockAccount: (...values: any[]) => Observable<Response>;
  deleteAccount: (...values: any[]) => Observable<Response>;
  queryRole: (...values: any[]) => Observable<Response>;
  queryRoleAdmin: (...values: any[]) => Observable<Response>;
  saveRole: (...values: any[]) => Observable<Response>;
  lockRole: (...values: any[]) => Observable<Response>;
  deleteRole: (...values: any[]) => Observable<Response>;
  queryMenu: (...values: any[]) => Observable<Response>;
  getMenuById: (...values: any[]) => Observable<Response>;
  saveMenu: (...values: any[]) => Observable<Response>;
  lockMenu: (...values: any[]) => Observable<Response>;
  deleteMenu: (...values: any[]) => Observable<Response>;
  getOuTree: (...values: any[]) => Observable<Response>;
  initOutree: (...values: any[]) => Observable<Response>;
  queryOuAccounts: (...values: any[]) => Observable<Response>;

  constructor(private _http: Http) {
    GdeicRestful.make({
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
    }, this, _http);
  }
}
