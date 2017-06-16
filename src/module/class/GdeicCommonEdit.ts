import { NavigationEnd } from '@angular/router';

import { GdeicCommonEditGuard } from '../service/route-guard/gdeic-common-edit-guard.service';

export class GdeicCommonEdit {
  protected isMatchUrl = true;

  constructor(
    protected commonEditGuard: GdeicCommonEditGuard,
    protected url: string,
    protected callback?: Function
  ) {
    if (callback !== undefined) { callback(); }
    commonEditGuard.watchRouteChange(this.url, (data: NavigationEnd) => {
      this.isMatchUrl = data.url === this.url;
      if (this.isMatchUrl) {
        if (callback !== undefined) { callback(); }
      }
    });
  }
}
