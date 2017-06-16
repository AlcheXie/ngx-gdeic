import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';

import { Gdeic, GdeicCache } from 'ngx-gdeic';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

const _EDIT_ITEM_CACHE_NAME = 'coreEditItem';
let _routerEventMap = new Map();

@Injectable()
export class GdeicCommonEditGuard implements CanActivate {
    private _isNewItem: any;

    constructor(
        private _router: Router) { }

    canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let _cache = GdeicCache.get(_EDIT_ITEM_CACHE_NAME);
        if (_cache === undefined) {
            let _paths = state.url.split('/').reverse();
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
                    for (let key of Object.keys(childRoute.params)) {
                        if (_cache[key] != childRoute.params[key]) { return false; }
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

    goNew(currentRoute: ActivatedRoute) {
        this.goEdit({}, 'new', currentRoute);
    }

    goEdit(editItem: any, url: string, currentRoute: ActivatedRoute) {
        GdeicCache.put(_EDIT_ITEM_CACHE_NAME, Gdeic.copy(editItem));
        this._router.navigate([url], { relativeTo: currentRoute });
    }

    watchRouteChange(url: string, callback: Function) {
        let _subscription = _routerEventMap.get(url);
        if (_subscription) {
            _subscription.unsubscribe();
        }
        _subscription = this._router.events
            .subscribe(data => {
                if (data instanceof NavigationEnd) {
                    if (data.url === undefined) { return; }
                    else if (data.url.indexOf(url) < 0) {
                        _subscription.unsubscribe();
                        _routerEventMap.delete(url);
                        GdeicCache.remove(_EDIT_ITEM_CACHE_NAME);
                    } else {
                        callback(data);
                    }
                }
            });
        _routerEventMap.set(url, _subscription);
    }
}