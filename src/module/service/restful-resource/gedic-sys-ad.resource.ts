import { Injectable } from '@angular/core';

import { GdeicRestfulAction } from '../../interface/GdeicRestful';
import { GdeicRestful } from '../gdeic-restful.service';
import { GdeicAd } from '../../interface/GdeicSys';

import { Observable } from 'rxjs';

export interface GdeicSysAdResourceMethods {
  getAdInfo: () => Observable<GdeicAd>;
  getAdById: (params: { ouId: string }) => Observable<GdeicAd[]>;
  getAdOuById: (params?: { ouId: string }) => Observable<GdeicAd[]>;
  getAdAccountById: (params: { ouId: string }) => Observable<GdeicAd[]>;
  searchAd: (params: { keyword: string }) => Observable<GdeicAd[]>;
  refreshAd: () => Observable<boolean>;
}

const _actions: { [name: string]: GdeicRestfulAction } = {
  getAdInfo: {
    url: 'api/account/get-ad-ou',
    method: 'GET'
  },
  getAdById: {
    url: 'api/account/get-ad-all/:ouId',
    method: 'GET'
  },
  getAdOuById: {
    url: 'api/account/get-ad-ous/:ouId',
    method: 'GET'
  },
  getAdAccountById: {
    url: 'api/account/get-ad-accounts/:ouId',
    method: 'GET'
  },
  searchAd: {
    url: 'api/account/get-ad-accounts/search/:keyword',
    method: 'GET'
  },
  refreshAd: {
    url: 'api/account/refresh-ad',
    method: 'GET'
  },
};

@Injectable()
export class GdeicSysAdResource implements GdeicSysAdResourceMethods {
  readonly getAdInfo: () => Observable<GdeicAd>;
  readonly getAdById: (params: { ouId: string }) => Observable<GdeicAd[]>;
  readonly getAdOuById: (params?: { ouId: string }) => Observable<GdeicAd[]>;
  readonly getAdAccountById: (params: { ouId: string }) => Observable<GdeicAd[]>;
  readonly searchAd: (params: { keyword: string }) => Observable<GdeicAd[]>;
  readonly refreshAd: () => Observable<boolean>;

  constructor(
    private _gdeicRestful: GdeicRestful
  ) {
    this._gdeicRestful.make(_actions, this);
  }
}
