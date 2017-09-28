import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({ selector: '[gdeic-slide-up]' })
export class GdeicSlideUpDirective {
  @Input()
  set gdeicNearBottomheight(value: number) {
    if (typeof value === 'number') {
      this._nearBottomHeight = value;
    }
  }
  @Output() gdeicSlideUp = new EventEmitter<any>();

  private _isSinlgeTouch: boolean;
  private _nearBottomHeight = 150;

  @HostListener('touchstart', ['$event'])
  ontouchstart($event) {
    this._isSinlgeTouch = $event.targetTouches.length === 1;
  }

  @HostListener('touchend', ['$event'])
  ontouchend($event) {
    if (!this._isSinlgeTouch) { return; }

    const _scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const _scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (_scrollTop > _scrollHeight - screen.height - this._nearBottomHeight) {
      this.gdeicSlideUp.emit();
    }
  }
}
