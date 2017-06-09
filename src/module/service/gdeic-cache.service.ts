import { Injectable } from '@angular/core';

import { Gdeic } from './gdeic.service';

const _cacheKeyList = [],
  _cacheMap = new Map();

@Injectable()
export class GdeicCache {
  static put(key: string, value: any): void {
    _cacheMap.set(key, value);
    Gdeic.toggleItem(_cacheKeyList, key);
  }

  static putAsync(key: string, promise: Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      promise
        .then(data => {
          GdeicCache.put(key, data);
          resolve(data);
        }, reject);
    });
  }

  static get(key: string): any {
    return _cacheMap.get(key);
  }

  static has(key: string): boolean {
    return _cacheMap.has(key);
  }

  static remove(key: string): void {
    _cacheMap.delete(key);
    Gdeic.toggleItem(_cacheKeyList, key);
  }

  static removeAll(): void {
    _cacheMap.clear();
    _cacheKeyList.splice(0, _cacheKeyList.length);
  }

  static info(): { size: number, keys: string[] } {
    return {
      size: _cacheMap.size,
      keys: _cacheKeyList
    };
  }
}
