import { Injectable } from '@angular/core';
import {
  ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanDeactivate,
  NavigationEnd, Router, RouterStateSnapshot
} from '@angular/router';

import { Gdeic } from '../gdeic.service';
import { GdeicCache } from '../gdeic-cache.service';

import { Observable, Subject } from 'rxjs';

export const enum GdeicEditStatus {
  None,
  Edit,
  View
}

const _editItemCacheName = 'gdeicEditItem';
const _viewItemCacheName = 'gdeicViewItem';
const _routerEventMap = new Map();

export interface GdeicCanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class GdeicCommonEditGuard implements CanActivate, CanDeactivate<GdeicCanComponentDeactivate> {
  get currentStatus(): GdeicEditStatus {
    return this._currentStatus;
  }

  private readonly _submit$ = new Subject<boolean>();
  private _currentStatus = GdeicEditStatus.None;
  private _baseUrl: string;
  private _allowUrls: (string | RegExp)[];
  private _successCallback: Function;

  constructor(
    private _router: Router,
    private _cache: GdeicCache
  ) {
    this._submit$.subscribe(() => this._successCallback());
  }

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const _cache = this.getData();
    if (_cache === undefined || _cache === null) {
      const _paths = state.url.split('/').reverse();
      _paths.shift();
      this._router.navigate(_paths.reverse());
      return false;
    } else {
      if (!state.url.includes(this._router.url)) {
        this._router.navigateByUrl(this._router.url);
        history.back();
        return false;
      } else {
        if (Object.keys(_cache).length === 0) {
          return true;
        } else if (_cache.constructor === Array) {
          return true;
        } else if ((() => {
          for (const key of Object.keys(childRoute.params)) {
            if (_cache[key].toString() !== childRoute.params[key].toString()) { return false; }
          }
          return true;
        })()) {
          return true;
        } else {
          this._router.navigateByUrl(this._router.url);
          history.back();
          return false;
        }
      }
    }
  }

  canDeactivate(component: GdeicCanComponentDeactivate): boolean {
    if (this._currentStatus === GdeicEditStatus.Edit) {
      if (component.canDeactivate) {
        if (component.canDeactivate()) {
          return true;
        } else {
          return window.confirm('是否放弃编辑？');
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  new(currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop): void {
    this._currentStatus = GdeicEditStatus.Edit;
    this.edit({}, 'new', currentRoute, [], successCallback);
    this._watchRouteChangeInDetail();
  }

  edit(editItem: any, url: string, currentRoute: ActivatedRoute,
    allowChildUrls: (string | RegExp)[], successCallback: Function = Gdeic.noop): void {
    this._currentStatus = GdeicEditStatus.Edit;
    this._baseUrl = this._router.url;
    this._allowUrls = allowChildUrls;
    this._cache.put(_editItemCacheName, Gdeic.copy(editItem));
    this._router.navigate([url], { relativeTo: currentRoute });
    this._successCallback = successCallback;
    this._watchRouteChangeInDetail();
  }

  multiEdit(editItems: any[], currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop): void {
    this._currentStatus = GdeicEditStatus.Edit;
    this.edit(editItems, 'multi', currentRoute, [], successCallback);
  }

  view(viewItems: any, url: string, currentRoute: ActivatedRoute): void {
    this._currentStatus = GdeicEditStatus.View;
    this._baseUrl = this._router.url;
    this._allowUrls = [];
    this._cache.put(_viewItemCacheName, Gdeic.copy(viewItems));
    this._router.navigate([url], { relativeTo: currentRoute });
    this._watchRouteChangeInDetail();
  }

  submit(promise?: Promise<any>): void {
    if (promise === undefined) {
      this._submit$.next();
    } else {
      promise
        .then(() => this._submit$.next());
    }
  }

  getData(): any {
    switch (this._currentStatus) {
      case GdeicEditStatus.Edit:
        return this._cache.get(_editItemCacheName);
      case GdeicEditStatus.View:
        return this._cache.get(_viewItemCacheName);
      default:
        return null;
    }
  }

  watchRouteChange(url: string, callback: Function): void {
    let _subscription = _routerEventMap.get(url);
    if (_subscription) {
      _subscription.unsubscribe();
    }
    _subscription = this._router.events
      .subscribe(data => {
        if (data instanceof NavigationEnd) {
          if (data.url === undefined) {
            return;
          } else if (!data.url.includes(url)) {
            _subscription.unsubscribe();
            _routerEventMap.delete(url);
            this._removeData();
          } else {
            callback(data);
          }
        }
      });
    _routerEventMap.set(url, _subscription);
  }

  private _removeData(): void {
    this._cache.remove(_editItemCacheName);
    this._cache.remove(_viewItemCacheName);
    this._currentStatus = GdeicEditStatus.None;
    this._baseUrl = '';
    this._allowUrls = [];
  }

  private _watchRouteChangeInDetail(): void {
    let _curentUrl: string;
    const _subscription = this._router.events
      .subscribe(data => {
        if (data instanceof NavigationEnd) {
          if (!_curentUrl) {
            _curentUrl = data.url;
          }
          if ((data.url || '').indexOf(this._baseUrl) < 0 || data.url === this._baseUrl) {
            this._removeData();
            _subscription.unsubscribe();
          } else {
            const _postUrl = data.url.replace(_curentUrl, '');
            if (_postUrl.length > 0) {
              let _isAllow = false;
              for (const url of this._allowUrls) {
                if (typeof url === 'string') {
                  _isAllow = _postUrl === url;
                } else {
                  _isAllow = url.test(_postUrl);
                }
                if (_isAllow) { break; }
              }
              if (!_isAllow) {
                this._router.navigateByUrl(this._baseUrl);
                this._removeData();
                _subscription.unsubscribe();
              }
            }
          }
        }
      });
  }
}
