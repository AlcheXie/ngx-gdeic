import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

const _FINISH_INIT$ = new Subject<boolean>()
let _isFinishInit = false;

@Injectable()
export class Gdeic {
    constructor() { }

    static noop: Function = function () { };

    static get isFinishInit() {
        return _isFinishInit;
    }

    static copy<T>(source: T): T {
        let json = JSON.stringify(source);
        return JSON.parse(json);
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
}