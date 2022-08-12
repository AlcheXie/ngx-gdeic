import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GdeicRestfulAction, GdeicResult } from '../interface/GdeicRestful';
import { GdeicConfig } from './gdeic-config.service';

import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

export let GDEIC_RESTFUL = 'GDEIC_RESTFUL';

@Injectable()
export class GdeicRestful {
  private static _timeDiff = -((new Date()).getTimezoneOffset() / 60);
  private static _paramMethodSet: Set<string> = new Set(['get', 'delete', 'head', 'options']);
  private static _bodyMethodSet: Set<string> = new Set(['post', 'put', 'patch']);
  private static _observeSet: Set<string> = new Set(['body', 'events', 'response']);
  private static _responseTypeSet: Set<string> = new Set(['arraybuffer', 'blob', 'json', 'text']);

  readonly loading$: Subject<boolean> = new Subject<boolean>();
  readonly error$: Subject<GdeicResult> = new Subject<GdeicResult>();

  private _isLoading = false;

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
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
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

  constructor(
    private _httpClient: HttpClient,
    private _config: GdeicConfig
  ) {
    Object.defineProperty(window, GDEIC_RESTFUL, {
      value: this,
      writable: false,
      enumerable: false
    });
  }

  getObservable(observable: Observable<any>, isHoldOn: boolean = false): Observable<any> {
    if (isHoldOn) {
      this._isLoading = true;
      this.loading$.next(true);
    }
    return observable.pipe(
      map(this._extractData(throwError)),
      catchError(this._handleError(throwError))
    );
  }

  getPromise(observable: Observable<any>, isHoldOn: boolean = false): Promise<any> {
    if (isHoldOn) {
      this._isLoading = true;
      this.loading$.next(true);
    }
    return observable.toPromise()
      .then(this._extractData(Promise.reject))
      .catch(this._handleError(Promise.reject));
  }

  make(actions: { [name: string]: GdeicRestfulAction }, instance: { [name: string]: any }): void {
    const _makeResourceMethod = (action: GdeicRestfulAction): ((...values: any[]) => Observable<any>) => {
      const _options = {
        observe: action.observe || 'body',
        reportProgress: action.reportProgress || false,
        responseType: action.responseType || 'json',
        withCredentials: action.withCredentials || false,
        retry: action.retry || 3
      };
      if (!!action.headers) { _options['headers'] = action.headers; }
      if (!GdeicRestful._observeSet.has(action.observe)) { _options['observe'] = 'body'; }
      if (!!action.params) { _options['params'] = action.params; }
      if (!GdeicRestful._responseTypeSet.has(action.responseType)) { _options['responseType'] = 'json'; }

      let _method = action.method || 'get';
      _method = _method.toLowerCase();
      if (!GdeicRestful._paramMethodSet.has(_method) && !GdeicRestful._bodyMethodSet.has(_method)) {
        _method = 'get';
      }

      let _function;
      if (GdeicRestful._paramMethodSet.has(_method)) {
        _function = (params: { [name: string]: any } = null): Observable<any> => {
          let _url = this._config.RESOURCE_BASE_URL + action.url;
          if (!!params) {
            if (!action.isSearch) {
              for (const key of Object.keys(params)) {
                _url = _url.replace(`:${key}`, params[key]);
              }
            } else {
              _url += '?';
              for (const key of Object.keys(params)) {
                let value = params[key];
                if (!value) { value = ''; }
                _url += `${key}=${value}&`;
              }
            }
          }
          return this._httpClient[_method](_url, _options).pipe(
            retry(_options.retry)
          );
        };
      } else if (GdeicRestful._bodyMethodSet.has(_method)) {
        _function = (body: any, params: { [name: string]: any } = null): Observable<any> => {
          let _url = this._config.RESOURCE_BASE_URL + action.url;
          if (body.constructor === Object || body.constructor === Array) {
            GdeicRestful._formatRequestData(body);
          }
          if (params) {
            for (const key of Object.keys(params)) {
              _url = _url.replace(`:${key}`, params[key]);
            }
          }
          return this._httpClient[_method](_url, body, _options).pipe(
            retry(_options.retry)
          );
        };
      } else if (_method === 'jsonp') {
        _function = (url: string, callbackParam: string): any => {
          return this._httpClient.jsonp(url, callbackParam);
        };
      }

      return _function;
    };

    for (const key of Object.keys(actions)) {
      instance[key] = _makeResourceMethod(actions[key]);
    }
  }

  private _extractData(rejectMethod: Function): ((data: any) => any) {
    return (data: any) => {
      const _dataKeys = Object.keys(data).sort();
      if (data instanceof Object
        && (() => {
          for (const x of ['Data', 'ErrorMsg', 'StatusCode']) {
            if (_dataKeys.indexOf(x) < 0) { return false; }
          }
          return true;
        })()) {
        if (data.StatusCode === this._config.SUCCESS_CODE) {
          GdeicRestful._formatResponseData(data.Data);
          if (this._isLoading) {
            this._isLoading = false;
            this.loading$.next(false);
          }
          return data.Data || {};
        } else {
          this.error$.next({ StatusCode: data.StatusCode, ErrorMsg: data.ErrorMsg });
          if (this._isLoading) {
            this._isLoading = false;
            this.loading$.next(false);
          }
          return rejectMethod(data.ErrorMsg);
        }
      } else {
        if (_dataKeys.includes('StatusCode') && _dataKeys.includes('ErrorMsg')) {
          this.error$.next(data);
        }
        if (this._isLoading) {
          this._isLoading = false;
          this.loading$.next(false);
        }
        return data;
      }
    };
  }

  private _handleError(rejectMethod: Function): ((res: Response) => any) {
    return (res: Response) => {
      if (this._isLoading) {
        this._isLoading = false;
        this.loading$.next(false);
      }
      const _error = { StatusCode: +res.status, ErrorMsg: res.statusText };
      this.error$.next(_error);
      return rejectMethod(_error);
    };
  }
}
