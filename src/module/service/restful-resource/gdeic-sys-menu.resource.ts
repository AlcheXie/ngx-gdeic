import { Injectable } from '@angular/core';

import { GdeicRestfulAction } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../../service/gdeic-restful.service';
import { GdeicMenu } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export interface GdeicSysMenuResourceMethods {
  queryMenu: () => Observable<GdeicMenu[]>;
  getMenuById: (params: { id: string }) => Observable<GdeicMenu>;
  addMenu: (body: GdeicMenu) => Observable<GdeicMenu>;
  updateMenu: (body: GdeicMenu) => Observable<GdeicMenu>;
  removeMenu: (body: GdeicMenu) => Observable<GdeicMenu>;
}

const _actions: { [name: string]: GdeicRestfulAction } = {
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
export class GdeicSysMenuResource implements GdeicSysMenuResourceMethods {
  readonly queryMenu: () => Observable<GdeicMenu[]>;
  readonly getMenuById: (params: { id: string }) => Observable<GdeicMenu>;
  readonly addMenu: (body: GdeicMenu) => Observable<GdeicMenu>;
  readonly updateMenu: (body: GdeicMenu) => Observable<GdeicMenu>;
  readonly removeMenu: (body: GdeicMenu) => Observable<GdeicMenu>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
