import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

interface Action {
    url: string,
    method?: string
}

export interface GdeicRestfulResource {
    ResourceName: string;
}

export interface ResultError {
    StatusCode: number,
    ErrorMsg?: string
}

const _TIMEDIFF = -((new Date()).getTimezoneOffset() / 60);
const _PARAM_METHOD_SET = new Set(['get', 'delete', 'head', 'options']),
    _bodyMethodSet = new Set(['post', 'put', 'patch']);

const _LOADING$ = new Subject<boolean>(),
    _ERROR$ = new Subject<ResultError>();

let _formatResponseData = (data: any) => {
    if (data.constructor === Array) {
        for (let value of data) {
            if (value.constructor === Object || value.constructor === Array) {
                _formatResponseData(value);
            }
        }
    } else if (data.constructor === Object) {
        for (let key of Object.keys(data)) {
            let value = data[key];
            if (value === undefined || value === null) { continue; }
            if (value.constructor === String && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
                if (value === '1900-01-01T00:00:00' || value === '0001-01-01T00:00:00') {
                    delete data[key];
                } else {
                    if (/T\d{2}:\d{2}:\d{2}$/.test(value)) {
                        value = `${value}.000Z`;
                    }
                    data[key] = (new Date(value)).addHours(-_TIMEDIFF);
                }
            } else if (value.constructor === Object || value.constructor === Array) {
                _formatResponseData(value);
            }
        }
    }
};
let _formatRequestData = (data: any) => {
    if (data.constructor === Array) {
        for (let value of data) {
            if (value.constructor === Object || value.constructor === Array) {
                _formatRequestData(value);
            }
        }
    } else if (data.constructor === Object) {
        for (let key of Object.keys(data)) {
            let value = data[key];
            if (value === undefined || value === null) { continue; }
            if (value.constructor === Date) {
                data[key] = value.addHours(_TIMEDIFF);
            } else if (value.constructor === Object || value.constructor === Array) {
                _formatRequestData(value);
            }
        }
    }
}

let _extractData = (rejectMethod: Function) => ((res: Response) => {
    let body = res.json();
    if (body.StatusCode === 0) {
        _ERROR$.next({ StatusCode: 0 });
        _formatResponseData(body.Data);
        _LOADING$.next(false);
        return body.Data || {};
    } else {
        _ERROR$.next({ StatusCode: body.StatusCode, ErrorMsg: body.ErrorMsg });
        _LOADING$.next(false);
        return rejectMethod(body.ErrorMsg);
    }
});
let _handleError = (rejectMethod: Function) => ((res: Response) => {
    _LOADING$.next(false);
    let error = { StatusCode: +res.status, ErrorMsg: res.json().Message };
    _ERROR$.next(error);
    return rejectMethod(error);
});

@Injectable()
export class GdeicRestful {
    constructor() { }

    static get loading$() {
        return _LOADING$;
    }

    static get error$() {
        return _ERROR$;
    }

    static make(actions: Object, instance: GdeicRestfulResource, http: Http) {
        let _makeResourceMethod = (action: Action): Function => {
            let _method = action.method || 'get';
            _method = _method.toLowerCase();
            if (!_PARAM_METHOD_SET.has(_method) && !_bodyMethodSet.has(_method)) {
                _method = 'get';
            }

            let _url = action.url;
            if (_PARAM_METHOD_SET.has(_method)) {
                return (search: Object = null): Observable<Response> => {
                    if (search) {
                        for (let key of Object.keys(search)) {
                            _url = _url.replace(`:${key}`, search[key]);
                        }
                    }
                    return http[_method](_url, search);
                }
            } else if (_bodyMethodSet.has(_method)) {
                return (data: any, search: Object = null): Observable<Response> => {
                    if (data.constructor === Object || data.constructor === Array) {
                        _formatRequestData(data);
                    }
                    if (search) {
                        for (let key of Object.keys(search)) {
                            _url = _url.replace(`:${key}`, search[key]);
                        }
                    }
                    return http[_method](_url, data, search);
                };
            }
        }

        for (let key of Object.keys(actions)) {
            instance[key] = _makeResourceMethod(actions[key]);
        }
    }

    static getObservable(observable: Observable<Response>, isHoldOn: boolean = false): Observable<any> {
        if (isHoldOn) { _LOADING$.next(true); }
        return observable
            .map(_extractData(Observable.throw))
            .catch(_handleError(Observable.throw));
    }

    static getPromise(observable: Observable<Response>, isHoldOn: boolean = false): Promise<any> {
        if (isHoldOn) { _LOADING$.next(true); }
        return observable.toPromise()
            .then(_extractData(Promise.reject))
            .catch(_handleError(Promise.reject));
    }
}