import { Component, Input } from '@angular/core';

import { GdeicRestful } from '../service/gdeic-restful.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'gdeic-hold-on',
  template: `
    <div class="backdrop" [hidden]="!isHoldingOn">
      <ng-content select="[gdeic-hold-on-content]"></ng-content>
    </div>
  `
})
export class GdeicHoldOnComponent {
  @Input()
  set gdeicLoadingSubject(value: Subject<boolean>) {
    this._loadingSubject = value;
  }

  isHoldingOn: boolean;
  private _loadingSubject: Subject<boolean>;

  constructor(private _restful: GdeicRestful) {
    const _subject = this._loadingSubject || this._restful.loading$;
    _subject.subscribe(data => this.isHoldingOn = data);
  }
}
