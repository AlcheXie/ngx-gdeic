import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GdeicRestfulResource, GdeicRestful } from '../../service/gdeic-restful.service';

@Injectable()
export class GdeicSysResource implements GdeicRestfulResource {
  ResourceName = 'GdeicSysResource';
  getAccountInfo: Function;
  getHeader: Function;
  queryAccount: Function;
  queryAccountByKeyword: Function;
  saveAccount: Function;
  lockAccount: Function;
  deleteAccount: Function;
  queryRole: Function;
  queryRoleAdmin: Function;
  saveRole: Function;
  lockRole: Function;
  deleteRole: Function;
  queryMenu: Function;
  getMenuById: Function;
  saveMenu: Function;
  lockMenu: Function;
  deleteMenu: Function;
  getOuTree: Function;
  initOutree: Function;
  queryOuAccounts: Function;

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
