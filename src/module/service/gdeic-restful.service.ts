import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { GdeicResultError, GdeicRestfulResource } from '../interface/GdeicRestful';

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

export let GDEIC_RESTFUL: GdeicRestful;

@Injectable()
export class GdeicRestful {
  private static _timeDiff = -((new Date()).getTimezoneOffset() / 60);
  private static _paramMethodSet: Set<string> = new Set(['get', 'delete', 'head', 'options']);
  private static _bodyMethodSet: Set<string> = new Set(['post', 'put', 'patch']);

  get loading$(): Subject<boolean> {
    return this._loading$;
  }
  get error$(): Subject<GdeicResultError> {
    return this._error$;
  }

  private _loading$: Subject<boolean> = new Subject<boolean>();
  private _error$: Subject<GdeicResultError> = new Subject<GdeicResultError>();

  static make(actions: { [name: string]: Action }, instance: GdeicRestfulResource, http: Http): void {
    const _makeResourceMethod = (action: Action): ((...values: any[]) => Observable<Response>) => {
      let _method = action.method || 'get';
      _method = _method.toLowerCase();
      if (!GdeicRestful._paramMethodSet.has(_method) && !GdeicRestful._bodyMethodSet.has(_method)) {
        _method = 'get';
      }

      if (GdeicRestful._paramMethodSet.has(_method)) {
        return (search: { [name: string]: any } = null): Observable<Response> => {
          let _url = action.url;
          if (search) {
            for (const key of Object.keys(search)) {
              _url = _url.replace(`:${key}`, search[key]);
            }
          }
          return http[_method](_url, search);
        };
      } else if (GdeicRestful._bodyMethodSet.has(_method)) {
        return (data: any, search: { [name: string]: any } = null): Observable<Response> => {
          let _url = action.url;
          if (data.constructor === Object || data.constructor === Array) {
            GdeicRestful._formatRequestData(data);
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

  private static _formatResponseData(data: any): void {
    if (data === undefined || data === null) { return; }
    if (data.constructor === Array) {
      for (const value of data) {
        if (value.constructor === Object || value.constructor === Array) {
          GdeicRestful._formatResponseData(value);
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
            data[key] = (new Date(value)).addHours(-GdeicRestful._timeDiff);
          }
        } else if (value.constructor === Object || value.constructor === Array) {
          GdeicRestful._formatResponseData(value);
        }
      }
    }
  }

  private static _formatRequestData(data: any): void {
    if (data === undefined || data === null) { return; }
    if (data.constructor === Array) {
      for (const value of data) {
        if (value.constructor === Object || value.constructor === Array) {
          GdeicRestful._formatRequestData(value);
        }
      }
    } else if (data.constructor === Object) {
      for (const key of Object.keys(data)) {
        const _value = data[key];
        if (_value === undefined || _value === null) { continue; }
        if (_value.constructor === Date) {
          data[key] = _value.addHours(GdeicRestful._timeDiff);
        } else if (_value.constructor === Object || _value.constructor === Array) {
          GdeicRestful._formatRequestData(_value);
        }
      }
    }
  }

  constructor() { GDEIC_RESTFUL = this; }

  getObservable(observable: Observable<Response>, isHoldOn: boolean = false): Observable<any> {
    if (isHoldOn) { this._loading$.next(true); }
    return observable
      .map(this._extractData(Observable.throw))
      .catch(this._handleError(Observable.throw));
  }

  getPromise(observable: Observable<Response>, isHoldOn: boolean = false): Promise<any> {
    if (isHoldOn) { this._loading$.next(true); }
    return observable.toPromise()
      .then(this._extractData(Promise.reject))
      .catch(this._handleError(Promise.reject));
  }

  private _extractData(rejectMethod: Function): ((res: Response) => any) {
    return (res: Response) => {
      const _body = res.json();
      if (_body.StatusCode === 0) {
        GdeicRestful._formatResponseData(_body.Data);
        this._loading$.next(false);
        return _body.Data || {};
      } else {
        this._error$.next({ StatusCode: _body.StatusCode, ErrorMsg: _body.ErrorMsg });
        this._loading$.next(false);
        return rejectMethod(_body.ErrorMsg);
      }
    };
  }

  private _handleError(rejectMethod: Function): ((res: Response) => any) {
    return (res: Response) => {
      this._loading$.next(false);
      let _message;
      try {
        _message = res.json().Message;
      } catch (error) {
        _message = res.statusText;
      }
      const _error = { StatusCode: +res.status, ErrorMsg: _message };
      this._error$.next(_error);
      return rejectMethod(_error);
    };
  }
}
