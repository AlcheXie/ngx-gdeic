import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  HostListener, Input, OnDestroy, Output, ViewEncapsulation
} from '@angular/core';

import { GdeicRestful } from '../service/gdeic-restful.service';
import { GdeicResultError } from '../interface/GdeicRestful';

import { fromEvent, Subject, Subscription } from 'rxjs';

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
    private _restful: GdeicRestful
  ) {
    const _subject = this._errorSubject || this._restful.error$;
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
      fromEvent(_closeElem, 'click')
        .subscribe(() => this._clearMsg());
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
    this.isShowError = false;
  }
}
