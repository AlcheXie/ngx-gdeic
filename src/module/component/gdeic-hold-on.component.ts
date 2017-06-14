import { Component } from '@angular/core';

import { GdeicRestful } from '../service/gdeic-restful.service';

@Component({
  selector: 'gdeic-hold-on',
  template: `
    <div class="backdrop" [hidden]="!isHoldingOn">
      <ng-content select="[gdeic-hold-on-content]"></ng-content>
    </div>
  `
})
export class GdeicHoldOnComponent {
  isHoldingOn: boolean;

  constructor() {
    GdeicRestful.loading$
      .subscribe(data => this.isHoldingOn = data);
  }
}
