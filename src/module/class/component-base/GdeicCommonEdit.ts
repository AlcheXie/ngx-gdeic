import { NavigationEnd } from '@angular/router';

import { GdeicCommonEditGuard } from '../../service/route-guard/gdeic-common-edit-guard.service';

export class GdeicCommonEdit {
    isMatchUrl: boolean = true;

    constructor(
        protected gdeicCommonEditGuard: GdeicCommonEditGuard,
        protected url: string,
        protected callback?: Function) {
        if (callback !== undefined) { callback(); }
        gdeicCommonEditGuard.watchRouteChange(this.url, (data: NavigationEnd) => {
            this.isMatchUrl = data.url === this.url;
            if (this.isMatchUrl) {
                if (callback !== undefined) { callback(); }
            }
        });
    }
}