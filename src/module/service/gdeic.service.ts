import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

const _finishInit$ = new Subject<boolean>();

let _isFinishInit = false;
const _remove$Char = (data: any): void => {
  if (data === undefined || data === null) { return; }
  if (data.constructor === Array) {
    for (const value of data) {
      if (value.constructor === Object || value.constructor === Array) {
        _remove$Char(value);
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
        _remove$Char(_value);
      }
    }
  }
};

@Injectable()
export class Gdeic {
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
    _remove$Char(source);
    return JSON.stringify(source);
  }

  static fromJson(json: string): any {
    const result = JSON.parse(json);
    _remove$Char(result);
    return result;
  }

  static finishInit(): void {
    _isFinishInit = true;
    _finishInit$.next(true);
  }

  static doAfterInit(callback: Function = Gdeic.noop): void {
    if (!_isFinishInit) {
      _finishInit$.subscribe(data => {
        if (data === true) {
          callback();
          _finishInit$.unsubscribe();
        }
      });
    } else {
      callback();
    }
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
}
