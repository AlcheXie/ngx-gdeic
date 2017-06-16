import { Input } from '@angular/core';

import { GdeicConfig } from '../../service/gdeic-config.service';
import { GdeicRestful, ResultError } from '../../service/gdeic-restful.service';

export class GdeicError {
    error: ResultError;
    isShowError: boolean = false;

    constructor(protected _config: GdeicConfig) {
        console.log(this.isShowError);
        GdeicRestful.error$.subscribe(data => {
            console.log(data);
            if (this.isShowError) { return }
            this.isShowError = true;
            this.error = data;
        });
    }

    clearMsg() {
        if (this.error.StatusCode === -1 && this._config.loginUrl !== undefined) {
            window.location.href = this._config.loginUrl;
        } else if (this.error.StatusCode === 500) {
            window.location.reload();
        }
        this.isShowError = false;
    }
}