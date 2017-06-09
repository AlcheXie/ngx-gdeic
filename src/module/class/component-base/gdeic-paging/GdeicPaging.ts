import { ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GdeicPage } from '../../GdeicPage';

export class GdeicPaging {
    @Input() size: string = 'sm';
    @Input() hideAlert: boolean;
    @Input() pagingModel: GdeicPage<any>;
    @Input() editMode: boolean;

    protected showingPages: number[] = [1, 2, 3, 4, 5];
    protected pageCount: number = 0;

    private _isInit: boolean = false;

    constructor(protected _elementRef: ElementRef) {
        // console.log(_elementRef.nativeElement.previousElementSibling);
    }

    ngOnChanges(changes: SimpleChanges) {
        // console.log(changes);
    }
}