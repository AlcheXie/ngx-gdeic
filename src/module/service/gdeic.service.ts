import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

const _FINISH_INIT$ = new Subject<boolean>();

let _isFinishInit = false;
let _remove$Char = (data: any) => {
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
        source = _remove$Char(Gdeic.copy(source));
        return JSON.stringify(source);
    }

    static fromJson(json: string): any {
        return JSON.parse(json);
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
                    callback()
                }
            });
        } else {
            callback();
        }
    }

    static toggleItem(source: any[] = [], item: any, property: string) {

    }
}