import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  HostListener, Input, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';

import { GdeicConfig } from '../service/gdeic-config.service';
import { GdeicRestful, ResultError } from '../service/gdeic-restful.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gdeic-error',
  template: `
    <div class="backdrop" [hidden]="!isShowError">
      <ng-content select="[gdeic-error-content]"></ng-content>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed;
      top: 0;
      z-index: 9999;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }
  `]
})
export class GdeicErrorComponent implements AfterViewInit, OnDestroy {
  @Input()
  set gdeicCloseByBackdrop(value: boolean) {
    this._gdeicCloseByBackdrop = value;
  }
  @Output() gdeicErrorChange = new EventEmitter<ResultError>();

  error: ResultError;
  isShowError = false;
  private _gdeicCloseByBackdrop = false;
  private _subject$: Subscription;

  constructor(
    private _elementRef: ElementRef,
    private _config: GdeicConfig) {
    this._subject$ = (GdeicRestful.error$ as Observable<ResultError>)
      .subscribe(data => {
        if (this.isShowError) { return; }
        this.isShowError = true;
        this.error = data;
        this.gdeicErrorChange.emit(data);
      });
  }

  ngAfterViewInit() {
    const _closeElem = this._elementRef.nativeElement.querySelectorAll('[gdeicErrorClose]')[0];
    if (_closeElem) {
      _closeElem.addEventListener('click', () => this._clearMsg());
    }
  }

  ngOnDestroy() {
    this._subject$.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    if (!this._gdeicCloseByBackdrop) { return; }
    if ($event.target.className !== 'backdrop') { return; }
    this._clearMsg();
  }

  private _clearMsg(): void {
    if (this.error.StatusCode === -1 && this._config.loginUrl !== undefined) {
      window.location.href = this._config.loginUrl;
    } else if (this.error.StatusCode === 500) {
      window.location.reload();
    }
    this.isShowError = false;
  }
}
