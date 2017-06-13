import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[gdeic-prevent-propagation]' })
export class GdeicPreventPropagationDirective implements OnInit {
  @Input()
  set gdeicEventName(value: string) {
    if (typeof value !== 'string') { return; }
    this._eventName = value;
  }

  private _eventName = '';

  constructor(private _elementRef: ElementRef) { }

  ngOnInit() {
    const _eventTypes = this._eventName.split(',');
    for (let type of _eventTypes) {
      type = type.trim();
      this._elementRef.nativeElement.addEventListener(type, event => event.stopPropagation());
    }
  }
}
