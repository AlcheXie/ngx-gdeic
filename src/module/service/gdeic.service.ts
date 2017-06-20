import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

const _FINISH_INIT$ = new Subject<boolean>();

let _isFinishInit = false;
let _remove$Char = (data: any) => {
    if (data === undefined || data === null) { return; }
    if (data.constructor === Array) {
        for (let value of data) {
            if (value.constructor === Object || value.constructor === Array) {
                _remove$Char(value);
            }
        }
    } else if (data.constructor === Object) {
        for (let key of Object.keys(data)) {
            if (/^\$/.test(key)) {
                delete data[key];
                continue;
            }
            let value = data[key];
            if (value === undefined || value === null) { continue; }
            if (value.constructor === Object || value.constructor === Array) {
                _remove$Char(value);
            }
        }
    }
}

@Injectable()
export class Gdeic {
    constructor() { }

    static noop: Function = function () { };

    static copy(source: any): any {
        let json = JSON.stringify(source);
        if (source.constructor === Date) {
            return new Date(JSON.parse(json));
        } else {
            return JSON.parse(json);
        }
    }

    static toJson(source: any): string {
        source = Gdeic.copy(source);
        _remove$Char(source);
        return JSON.stringify(source);
    }

    static fromJson(json: string): any {
        let result = JSON.parse(json);
        _remove$Char(result)
        return result;
    }

    static get isFinishInit() {
        return _isFinishInit;
    }

    static finishInit() {
        _isFinishInit = true;
        _FINISH_INIT$.next(true);
    }

    static doAfterInit(callback: Function = Gdeic.noop) {
        if (!_isFinishInit) {
            _FINISH_INIT$.subscribe(data => {
                if (data === true) {
                    callback();
                    _FINISH_INIT$.unsubscribe();
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
            _nIdx = source.map(item => Gdeic.toJson(item)).indexOf(Gdeic.toJson(_oToggle));
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

    static getControlsConfig(controlsConfig: { [name: string]: any }, initialValues?: { [name: string]: any }) {
        controlsConfig = Gdeic.copy(controlsConfig);
        for (let key of Object.keys(initialValues)) {
            let _config = controlsConfig[key], _value = initialValues[key];
            if (_config) {
                if (_config.constructor === Array) {
                    _config[0] = _value;
                } else {
                    _config = _value;
                }
            }
        }
        return controlsConfig;
    }
}