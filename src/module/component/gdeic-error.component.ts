import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  HostListener, Input, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';

import { GdeicConfig } from '../service/gdeic-config.service';
import { GdeicRestful } from '../service/gdeic-restful.service';
import { GdeicResultError } from '../interface/GdeicRestful';

import { Subject } from 'rxjs/Subject';
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
    this._closeByBackdrop = value;
  }
  @Input()
  set gdeicErrorSubject(value: Subject<GdeicResultError>) {
    this._errorSubject = value;
  }
  @Output() gdeicErrorChange = new EventEmitter<GdeicResultError>();

  isShowError = false;
  private _closeByBackdrop = false;
  private _errorSubject: Subject<GdeicResultError>;
  private _subscription: Subscription;
  private _error: GdeicResultError;

  constructor(
    private _elementRef: ElementRef,
    private _config: GdeicConfig
  ) {
    const _subject = this._errorSubject || GdeicRestful.error$;
    this._subscription = _subject
      .subscribe(data => {
        if (this.isShowError) { return; }
        this.isShowError = true;
        this._error = data;
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
    this._subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  onClick($event) {
    if (!this._closeByBackdrop) { return; }
    if ($event.target.className !== 'backdrop') { return; }
    this._clearMsg();
  }

  private _clearMsg(): void {
    if (this._error.StatusCode === -1 && this._config.loginUrl !== undefined) {
      window.location.href = this._config.loginUrl;
    } else if (this._error.StatusCode === 500) {
      window.location.reload();
    }
    this.isShowError = false;
  }
}
