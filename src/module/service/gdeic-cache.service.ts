import { Injectable } from '@angular/core';

import { Gdeic } from './gdeic.service';

@Injectable()
export class GdeicCache {
  private _cacheKeys: string[] = [];
  private _cacheMap: Map<string, any> = new Map();

  put(key: string, value: any): any {
    this._cacheMap.set(key, value);
    Gdeic.toggleItem(this._cacheKeys, key);
    return value;
  }

  putAsync(key: string, promise: Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      promise
        .then(data => {
          this.put(key, data);
          resolve(data);
        }, reject);
    });
  }

  get(key: string): any {
    return this._cacheMap.get(key);
  }

  has(key: string): boolean {
    return this._cacheMap.has(key);
  }

  remove(key: string): void {
    this._cacheMap.delete(key);
    Gdeic.toggleItem(this._cacheKeys, key);
  }

  removeAll(): void {
    this._cacheMap.clear();
    this._cacheKeys.splice(0, this._cacheKeys.length);
  }

  info(): { size: number, keys: string[] } {
    return {
      size: this._cacheMap.size,
      keys: this._cacheKeys
    };
  }
}
