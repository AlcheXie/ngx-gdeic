import { ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GdeicPage } from '../GdeicPage';

export class GdeicPaging {
    @Input() size: string = 'sm';
    @Input() hideAlert: boolean;
    @Input() pagingModel: GdeicPage<any>;
    @Input() editMode: boolean;

    showingPages: number[];
    pageCount: number = 0;

    private _isInit: boolean = false;
    private _defaultShowingPages: number[] = [1, 2, 3, 4, 5];

    constructor(protected _elementRef: ElementRef) {
        // console.log(_elementRef.nativeElement.previousElementSibling);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.pagingModel.firstChange) {
            let currVal = changes.pagingModel.currentValue;
            if (currVal.constructor === GdeicPage) {
                this.pageCount = Math.ceil(currVal.pagingListLength / currVal.itemsPerPage);
                this.setPage(1);
                this._isInit = true;
            }
        }
    }

    setPage(pageIndex: number) {
        if (pageIndex < 1 || pageIndex > this.pageCount) { return; }
        this.pagingModel.paging(pageIndex);
        if (!this._isInit || (this._isInit && (pageIndex > this.showingPages[this.showingPages.length - 1] || pageIndex < this.showingPages[0]))) {
            this.showingPages = this._defaultShowingPages.map(x => (Math.ceil(pageIndex / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);
        }
    }
}