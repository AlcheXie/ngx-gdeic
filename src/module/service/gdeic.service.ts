import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class Gdeic {
  private _finishInit$ = new Subject<boolean>();
  private _isFinishInit = false;

  static noop = function () { };

  static copy(source: any): any {
    const _json = JSON.stringify(source);
    if (source.constructor === Date) {
      return new Date(JSON.parse(_json));
    } else {
      return JSON.parse(_json);
    }
  }

  static toJson(source: any): string {
    source = Gdeic.copy(source);
    Gdeic._remove$Char(source);
    return JSON.stringify(source);
  }

  static fromJson(json: string): any {
    const result = JSON.parse(json);
    Gdeic._remove$Char(result);
    return result;
  }

  static getContextFunction(context: any, callbackName: string): ((...values: any[]) => any) {
    return function (...values) {
      context[callbackName](...values);
    };
  }

  static toggleItem(source: any[] = [], item: any, property?: string): boolean {
    let _nIdx, _oToggle;
    if (property === undefined) {
      _oToggle = item;
      _nIdx = source.map(x => Gdeic.toJson(x)).indexOf(Gdeic.toJson(_oToggle));
    } else {
      if (item.hasOwnProperty(property)) {
        _oToggle = item[property];
        _nIdx = source.indexOf(_oToggle);
      } else {
        return false;
      }
    }

    if (_nIdx > -1) {
      source.splice(_nIdx, 1);
    } else {
      source.push(_oToggle);
    }
    return true;
  }

  private static _remove$Char = (data: any): void => {
    if (data === undefined || data === null) { return; }
    if (data.constructor === Array) {
      for (const value of data) {
        if (value.constructor === Object || value.constructor === Array) {
          Gdeic._remove$Char(value);
        }
      }
    } else if (data.constructor === Object) {
      for (const key of Object.keys(data)) {
        if (/^\$/.test(key)) {
          delete data[key];
          continue;
        }
        const _value = data[key];
        if (_value === undefined || _value === null) { continue; }
        if (_value.constructor === Object || _value.constructor === Array) {
          Gdeic._remove$Char(_value);
        }
      }
    }
  }

  finishInit(): void {
    this._isFinishInit = true;
    this._finishInit$.next(true);
  }

  doAfterInit(callback: Function = Gdeic.noop): void {
    if (!this._isFinishInit) {
      this._finishInit$.subscribe(data => {
        if (data === true) {
          callback();
          this._finishInit$.unsubscribe();
        }
      });
    } else {
      callback();
    }
  }
}
