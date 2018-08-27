import { Injectable } from '@angular/core';

import { GdeicRestfulResource } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';

export interface GdeicSysMenuResourceMethods {
  queryMenu: () => Observable<any>;
  getMenuById: (params: { id: string }) => Observable<any>;
  addMenu: (body: any) => Observable<any>;
  updateMenu: (body: any) => Observable<any>;
  removeMenu: (body: any) => Observable<any>;
}

const _actions = {
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
export class GdeicSysMenuResource implements GdeicRestfulResource, GdeicSysMenuResourceMethods {
  readonly ResourceName = 'GdeicSysMenuResource';
  readonly queryMenu: () => Observable<any>;
  readonly getMenuById: (params: { id: string }) => Observable<any>;
  readonly addMenu: (body: any) => Observable<any>;
  readonly updateMenu: (body: any) => Observable<any>;
  readonly removeMenu: (body: any) => Observable<any>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
