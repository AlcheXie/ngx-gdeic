import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { GdeicResultError, GdeicRestfulResource } from '../interface/GdeicRestful';
import { Gdeic } from '../service/gdeic.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/toPromise';

interface Action {
  url: string;
  method?: string;
  headers?: HttpHeaders | { [header: string]: string | string[]; };
  observe?: string; //'body' | 'events' | 'response';
  params?: HttpParams | { [param: string]: string | string[]; };
  reportProgress?: boolean;
  responseType?: string; //'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  callbackParam?: string;
  retry?: number;
}

export let GDEIC_RESTFUL: GdeicRestful;

@Injectable()
export class GdeicRestful {
  private static _timeDiff = -((new Date()).getTimezoneOffset() / 60);
  private static _paramMethodSet: Set<string> = new Set(['get', 'delete', 'head', 'options']);
  private static _bodyMethodSet: Set<string> = new Set(['post', 'put', 'patch']);
  private static _observeSet: Set<string> = new Set(['body', 'events', 'response']);
  private static _responseTypeSet: Set<string> = new Set(['arraybuffer', 'blob', 'json', 'text']);

  get loading$(): Subject<boolean> {
    return this._loading$;
  }
  get error$(): Subject<GdeicResultError> {
    return this._error$;
  }

  private _isLoading = false;
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
          return http[_method](_url);
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
          return http[_method](_url, data);
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

  constructor(
    private _httpClient: HttpClient
  ) { GDEIC_RESTFUL = this; }

  getObservable(observable: Observable<any>, isHoldOn: boolean = false): Observable<any> {
    if (isHoldOn) {
      this._isLoading = true;
      this._loading$.next(true);
    }
    return observable
      .map(this._extractData(Observable.throw))
      .catch(this._handleError(Observable.throw));
  }

  getPromise(observable: Observable<any>, isHoldOn: boolean = false): Promise<any> {
    if (isHoldOn) {
      this._isLoading = true;
      this._loading$.next(true);
    }
    return observable.toPromise()
      .then(this._extractData(Promise.reject))
      .catch(this._handleError(Promise.reject));
  }

  make(actions: { [name: string]: Action }, instance: GdeicRestfulResource): void {
    const _makeResourceMethod = (action: Action): ((...values: any[]) => Observable<any>) => {
      const _options = {
        observe: action.observe || 'body',
        reportProgress: action.reportProgress || false,
        responseType: action.responseType || 'json',
        withCredentials: action.withCredentials || false,
        retry: action.retry || 3
      }
      if (action.headers) { _options['headers'] = action.headers; }
      if (!GdeicRestful._observeSet.has(action.observe)) { _options['observe'] = 'body'; }
      if (action.params) { _options['params'] = action.params; }
      if (!GdeicRestful._responseTypeSet.has(action.responseType)) { _options['responseType'] = 'json'; }

      let _method = action.method || 'get';
      _method = _method.toLowerCase();
      if (!GdeicRestful._paramMethodSet.has(_method) && !GdeicRestful._bodyMethodSet.has(_method)) {
        _method = 'get';
      }

      let _function;
      if (GdeicRestful._paramMethodSet.has(_method)) {
        _function = (params: { [name: string]: any } = null): Observable<any> => {
          let _url = action.url;
          if (params) {
            for (const key of Object.keys(params)) {
              _url = _url.replace(`:${key}`, params[key]);
            }
          }
          return this._httpClient[_method](_url, _options).retry(_options.retry);
        }
      } else if (GdeicRestful._bodyMethodSet.has(_method)) {
        _function = (body: any, params: { [name: string]: any } = null): Observable<any> => {
          let _url = action.url;
          if (body.constructor === Object || body.constructor === Array) {
            GdeicRestful._formatRequestData(body);
          }
          if (params) {
            for (const key of Object.keys(params)) {
              _url = _url.replace(`:${key}`, params[key]);
            }
          }
          return this._httpClient[_method](_url, body, _options).retry(_options.retry);
        }
      } else if (_method === 'jsonp') {
        _function = (url: string, callbackParam: string): any => {
          return this._httpClient.jsonp(url, callbackParam);
        }
      }

      return _function;
    }

    for (const key of Object.keys(actions)) {
      instance[key] = _makeResourceMethod(actions[key]);
    }
  }

  private _extractData(rejectMethod: Function): ((data: any) => any) {
    const _handleBody = (data: { [name: string]: any }, rejectMethod: Function): any => {
      if (data.StatusCode === 0) {
        GdeicRestful._formatResponseData(data.Data);
        if (this._isLoading) {
          this._isLoading = false;
          this._loading$.next(false);
        }
        return data.Data || {};
      } else {
        this._error$.next({ StatusCode: data.StatusCode, ErrorMsg: data.ErrorMsg });
        if (this._isLoading) {
          this._isLoading = false;
          this._loading$.next(false);
        }
        return rejectMethod(data.ErrorMsg);
      }
    }

    return (data: any) => {
      if (data instanceof Object && Gdeic.toJson(Object.keys(data).sort()) === Gdeic.toJson(['Data', 'ErrorMsg', 'StatusCode'])) {
        return _handleBody(data, Observable.throw);
      } else if (data instanceof Response) {
        const _body = data.json();
        return _handleBody(_body, rejectMethod);
      } else {
        if (this._isLoading) {
          this._isLoading = false;
          this._loading$.next(false);
        }
        return data;
      }
    };
  }

  private _handleError(rejectMethod: Function): ((res: Response) => any) {
    return (res: Response) => {
      if (this._isLoading) {
        this._isLoading = false;
        this._loading$.next(false);
      }
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
