import { Injectable } from '@angular/core';
import {
  ActivatedRoute, ActivatedRouteSnapshot,
  CanActivate, NavigationEnd, Router, RouterStateSnapshot
} from '@angular/router';

import { Gdeic } from '../gdeic.service';
import { GdeicCache } from '../gdeic-cache.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const _editItemCacheName = 'coreEditItem';
const _routerEventMap = new Map();

@Injectable()
export class GdeicCommonEditGuard implements CanActivate {
  private _successCallback: Function;
  submit$ = new Subject<boolean>();

  constructor(
    private _router: Router) {
    this.submit$.subscribe(() => this._successCallback());
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
        }
        if ((() => {
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

  goNew(currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop) {
    this.goEdit({}, 'new', currentRoute, successCallback);
  }

  goEdit(editItem: any, url: string, currentRoute: ActivatedRoute, successCallback: Function = Gdeic.noop) {
    GdeicCache.put(_editItemCacheName, Gdeic.copy(editItem));
    this._router.navigate([url], { relativeTo: currentRoute });
    this._successCallback = successCallback;
  }

  submit() {
    this.submit$.next();
  }

  getData(): any {
    return GdeicCache.get(_editItemCacheName);
  }

  watchRouteChange(url: string, callback: Function) {
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
            GdeicCache.remove(_editItemCacheName);
          } else {
            callback(data);
          }
        }
      });
    _routerEventMap.set(url, _subscription);
  }
}
