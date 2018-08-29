import { Injectable } from '@angular/core';

import { GdeicRestfulAction, GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';
import { GdeicRole } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export interface GdeicSysRoleResourceMethods {
  queryRole: () => Observable<GdeicRole[]>;
  queryRoleAdmin: () => Observable<GdeicRole[]>;
  getRoleById: (params: { id: string }) => Observable<GdeicRole>;
  addRole: (body: GdeicRole) => Observable<GdeicRole>;
  updateRole: (body: GdeicRole) => Observable<GdeicRole>;
  removeRole: (body: GdeicRole) => Observable<GdeicRole>;
}

const _actions: { [name: string]: GdeicRestfulAction } = {
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
  readonly queryRole: () => Observable<GdeicRole[]>;
  readonly queryRoleAdmin: () => Observable<GdeicRole[]>;
  readonly getRoleById: (params: { id: string }) => Observable<GdeicRole>;
  readonly addRole: (body: GdeicRole) => Observable<GdeicRole>;
  readonly updateRole: (body: GdeicRole) => Observable<GdeicRole>;
  readonly removeRole: (body: GdeicRole) => Observable<GdeicRole>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
