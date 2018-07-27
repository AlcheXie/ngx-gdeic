import { Injectable } from '@angular/core';
import {
  ActivatedRoute, ActivatedRouteSnapshot, CanActivate, CanDeactivate,
  NavigationEnd, Router, RouterStateSnapshot
} from '@angular/router';

import { Gdeic } from '../gdeic.service';
import { GdeicCache } from '../gdeic-cache.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const _editItemCacheName = 'coreEditItem';
const _routerEventMap = new Map();

export interface GdeicCanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class GdeicCommonEditGuard implements CanActivate, CanDeactivate<GdeicCanComponentDeactivate> {
  private readonly _submit$ = new Subject<boolean>();
  private _successCallback: Function;

  constructor(
    private _router: Router,
    private _cache: GdeicCache
  ) {
    this._submit$.subscribe(() => this._successCallback());
  }

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const _cache = this.getData();
    if (_cache === undefined) {
      const _paths = state.url.split('/').reverse();
      _paths.shift();
      this._router.navigate(_paths.reverse());
      return false;
    } else {
      if (state.url.indexOf(this._router.url) < 0) {
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
    if (component.canDeactivate) {
      if (component.canDeactivate()) {
        return true;
      } else {
        return window.confirm('是否放弃编辑？');
      }
    } else {
      return true;
    }
  }

  new(currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop): void {
    this.edit({}, 'new', currentRoute, successCallback);
  }

  edit(editItem: any, url: string, currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop): void {
    this._cache.put(_editItemCacheName, Gdeic.copy(editItem));
    this._router.navigate([url], { relativeTo: currentRoute });
    this._successCallback = successCallback;
  }

  multiEdit(editItems: any[], currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop): void {
    this.edit(editItems, 'multi', currentRoute, successCallback);
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
    return this._cache.get(_editItemCacheName);
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
          } else if (data.url.indexOf(url) < 0) {
            _subscription.unsubscribe();
            _routerEventMap.delete(url);
            this._cache.remove(_editItemCacheName);
          } else {
            callback(data);
          }
        }
      });
    _routerEventMap.set(url, _subscription);
  }
}
