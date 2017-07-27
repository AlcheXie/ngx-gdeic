import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Gdeic } from './gdeic.service';
import { GdeicRestful } from './gdeic-restful.service';

let _cacheKeyList = [],
    _cacheMap = new Map();

@Injectable()
export class GdeicCache {
    constructor() { }

    static put(key: string, value: any) {
        _cacheMap.set(key, value);
        Gdeic.toggleItem(_cacheKeyList, key);
    }

    static putAsync(key: string, promise: Promise<any>, isAlways: boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            promise
                .then(data => {
                    GdeicCache.put(key, data);
                    resolve(data);
                }, reject)
        });
    }

    static get(key: string): any {
        return _cacheMap.get(key);
    }

    static has(key: string): boolean {
        return _cacheMap.has(key);
    }

    static remove(key: string) {
        _cacheMap.delete(key);
        Gdeic.toggleItem(_cacheKeyList, key);
    }

    static removeAll() {
        _cacheMap.clear();
        _cacheKeyList = [];
    }

    static info() {
        return {
            size: _cacheMap.size,
            keys: _cacheKeyList
        }
    }
}