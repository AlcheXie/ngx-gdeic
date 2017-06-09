import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

interface Action {
  url: string;
  method?: string;
}

export interface GdeicRestfulResource {
  ResourceName: string;
}

export interface ResultError {
  StatusCode: number;
  ErrorMsg?: string;
}

const _timeDiff = -((new Date()).getTimezoneOffset() / 60);
const _paramMethodSet = new Set(['get', 'delete', 'head', 'options']),
  _bodyMethodSet = new Set(['post', 'put', 'patch']);

const _loading$ = new Subject<boolean>(),
  _error$ = new Subject<ResultError>();

const _formatResponseData = (data: any) => {
  if (data === undefined || data === null) { return; }
  if (data.constructor === Array) {
    for (const value of data) {
      if (value.constructor === Object || value.constructor === Array) {
        _formatResponseData(value);
      }
    }
  } else if (data.constructor === Object) {
    for (const key of Object.keys(data)) {
      let value = data[key];
      if (value === undefined || value === null) { continue; }
      if (value.constructor === String && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        if (value === '1900-01-01T00:00:00' || value === '0001-01-01T00:00:00') {
          delete data[key];
        } else {
          if (/T\d{2}:\d{2}:\d{2}$/.test(value)) {
            value = `${value}.000Z`;
          }
          data[key] = (new Date(value)).addHours(-_timeDiff);
        }
      } else if (value.constructor === Object || value.constructor === Array) {
        _formatResponseData(value);
      }
    }
  }
};
const _formatRequestData = (data: any) => {
  if (data === undefined || data === null) { return; }
  if (data.constructor === Array) {
    for (const value of data) {
      if (value.constructor === Object || value.constructor === Array) {
        _formatRequestData(value);
      }
    }
  } else if (data.constructor === Object) {
    for (const key of Object.keys(data)) {
      const _value = data[key];
      if (_value === undefined || _value === null) { continue; }
      if (_value.constructor === Date) {
        data[key] = _value.addHours(_timeDiff);
      } else if (_value.constructor === Object || _value.constructor === Array) {
        _formatRequestData(_value);
      }
    }
  }
};

const _extractData = (rejectMethod: Function) => ((res: Response) => {
  const _body = res.json();
  if (_body.StatusCode === 0) {
    _formatResponseData(_body.Data);
    _loading$.next(false);
    return _body.Data || {};
  } else {
    _error$.next({ StatusCode: _body.StatusCode, ErrorMsg: _body.ErrorMsg });
    _loading$.next(false);
    return rejectMethod(_body.ErrorMsg);
  }
});
const _handleError = (rejectMethod: Function) => ((res: Response) => {
  _loading$.next(false);
  let _message;
  try {
    _message = res.json().Message;
  } catch (error) {
    _message = res.statusText;
  }
  const _error = { StatusCode: +res.status, ErrorMsg: _message };
  _error$.next(_error);
  return rejectMethod(_error);
});

@Injectable()
export class GdeicRestful {
  constructor() { }

  static get loading$() {
    return _loading$;
  }

  static get error$() {
    return _error$;
  }

  static make(actions: Object, instance: GdeicRestfulResource, http: Http) {
    const _makeResourceMethod = (action: Action): Function => {
      let _method = action.method || 'get';
      _method = _method.toLowerCase();
      if (!_paramMethodSet.has(_method) && !_bodyMethodSet.has(_method)) {
        _method = 'get';
      }

      if (_paramMethodSet.has(_method)) {
        return (search: Object = null): Observable<Response> => {
          let _url = action.url;
          if (search) {
            for (const key of Object.keys(search)) {
              _url = _url.replace(`:${key}`, search[key]);
            }
          }
          return http[_method](_url, search);
        };
      } else if (_bodyMethodSet.has(_method)) {
        return (data: any, search: Object = null): Observable<Response> => {
          let _url = action.url;
          if (data.constructor === Object || data.constructor === Array) {
            _formatRequestData(data);
          }
          if (search) {
            for (const key of Object.keys(search)) {
              _url = _url.replace(`:${key}`, search[key]);
            }
          }
          return http[_method](_url, data, search);
        };
      }
    };

    for (const key of Object.keys(actions)) {
      instance[key] = _makeResourceMethod(actions[key]);
    }
  }

  static getObservable(observable: Observable<Response>, isHoldOn: boolean = false): Observable<any> {
    if (isHoldOn) { _loading$.next(true); }
    return observable
      .map(_extractData(Observable.throw))
      .catch(_handleError(Observable.throw));
  }

  static getPromise(observable: Observable<Response>, isHoldOn: boolean = false): Promise<any> {
    if (isHoldOn) { _loading$.next(true); }
    return observable.toPromise()
      .then(_extractData(Promise.reject))
      .catch(_handleError(Promise.reject));
  }
}
