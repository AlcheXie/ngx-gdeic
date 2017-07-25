import { Input, OnChanges, SimpleChanges } from '@angular/core';

import { Gdeic } from '../../service/gdeic.service';
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

    ngOnChanges(changes: SimpleChanges) {
        let _currVal = changes.pagingModel.currentValue, _prevVal = changes.pagingModel.previousValue;
        if (changes.pagingModel.firstChange) {
            this.pageCount = Math.ceil(_currVal.pagingListLength / _currVal.itemsPerPage);
            this.setPage(1);
            this._isInit = true;
        } else {
            let _pageIdx = 1;
            if (this.pageCount < _prevVal.currentPage) {
                _pageIdx = this.pageCount;
            } else {
                _pageIdx = _prevVal.currentPage;
            }
            this.setPage(_pageIdx);
            this.showingPages = this._defaultShowingPages.map(x => (Math.ceil(_pageIdx / 5) - 1) * 5 + x).filter(x => x <= this.pageCount);

            if (this.editMode) {
                let _source, _aPageIdx;
                _currVal = _currVal.currentList, _prevVal = _prevVal.currentList;
                if (this.pagingModel.constructor === GdeicPage) {
                    _source = this.pagingModel.source;
                    _aPageIdx = this.pagingModel.pagingList.map(x => x.$$index);

                    if (Gdeic.toJson(_prevVal.map(x => x.$$index)) === Gdeic.toJson(_prevVal.map(x => x.$$index))) {
                        for (let item of _currVal) {
                            let _nidx = item.$$index;
                            _source[_nidx] = item;
                            this.pagingModel.pagingList[_aPageIdx.indexOf(_nidx)] = item;
                        }
                        this.pagingModel.setSource(_source);
                    }
                } 
                // else if (this.pagingModel.constructor === GdeicGroup) {
                //     for (let item of _currVal) {
                //         this.pagingModel.pagingList[item.$$index].isExpand = item.isExpand;
                //     }
                // }
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