import { Injectable } from '@angular/core';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export interface GdeicSysRoleResourceMethods {
  queryRole: () => Observable<any>;
  queryRoleAdmin: () => Observable<any>;
  getRoleById: (params: { id: string }) => Observable<any>;
  addRole: (body: any) => Observable<any>;
  updateRole: (body: any) => Observable<any>;
  removeRole: (body: any) => Observable<any>;
}

const _actions = {
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
  }
};

@Injectable()
export class GdeicSysRoleResource implements GdeicRestfulResource, GdeicSysRoleResourceMethods {
  readonly ResourceName = 'GdeicSysRoleResource';
  readonly queryRole: () => Observable<any>;
  readonly queryRoleAdmin: () => Observable<any>;
  readonly getRoleById: (params: { id: string }) => Observable<any>;
  readonly addRole: (body: any) => Observable<any>;
  readonly updateRole: (body: any) => Observable<any>;
  readonly removeRole: (body: any) => Observable<any>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
