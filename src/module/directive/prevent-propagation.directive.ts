import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: '[preventPropagation]' })
export class PreventPropagationDirective {
    @Input() preventPropagation: string;

    constructor(private _elementRef: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.preventPropagation.firstChange) {
            let _eventTypes = this.preventPropagation.split(',');
            for (let type of _eventTypes) {
                type = type.trim();
                this._elementRef.nativeElement.addEventListener(type, event => { event.stopPropagation(); })
            }
        }
    }
}