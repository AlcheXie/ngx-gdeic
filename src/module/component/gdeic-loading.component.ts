import { Component, Input } from '@angular/core';

@Component({
  selector: 'gdeic-loading',
  template: `
    <div>
      <ng-content select="[gdeic-loading-info]" *ngIf="gdeicIsLoading"></ng-content>
      <ng-content select="[gdeic-loading-content]" *ngIf="!gdeicIsLoading"></ng-content>
    </div>
  `
})
export class GdeicLoadingComponent {
  @Input() gdeicIsLoading: boolean;
}
