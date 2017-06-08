import { Gdeic } from '../service/gdeic.service';
import { List } from 'linqts';

interface SearchCondition {
    and?: any,
    or?: any
}

let _getCondition = (searchParams = {}): SearchCondition => {
    let _arrAnd = [],
        _arrOr = [],
        condition: SearchCondition = {};

    for (let key of Object.keys(searchParams)) {
        if (key.indexOf('_') < 0) {
            _arrAnd.push(key);
        } else {
            _arrOr.push(key);
        }
    }
    if (_arrAnd.length > 0) {
        condition.and = {};
        for (let p of _arrAnd) {
            condition.and[p] = searchParams[p];
        }
    }
    if (_arrOr.length > 0) {
        condition.or = [];
        for (let p of _arrOr) {
            if (searchParams[p].toString() !== '') {
                condition.or.push({
                    keys: p.replace(/_/g, ','),
                    value: searchParams[p]
                });
            }
        }
        if (condition.or.length === 0) {
            delete condition.or;
        }
    }

    return condition;
}

export class GdeicPage<T> {
    pagingList: T[];
    currentList: T[];
    pagingListLength: number;
    itemsPerPage: number;
    currentPage: number;
    searchParams: object;

    get source() {
        return this._source;
    }

    constructor(
        private _source: T[],
        itemsPerPage: number = 10) {
        _source = Gdeic.copy(_source.map((x: any, idx) => {
            x.$$index = idx;
            return x;
        }));

        this.pagingList = [];
        this.currentList = [];
        this.pagingListLength = 0;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.searchParams = {};

        this.update(this.source);
    }

    paging(pageIndex) {
        let maxPage = Math.ceil(this.pagingList.length / this.itemsPerPage),
            startPage;
        if (pageIndex > maxPage) { pageIndex = maxPage; }

        this.currentPage = pageIndex;
        startPage = pageIndex - 1 < 0 ? 0 : pageIndex - 1;
        this.currentList = Gdeic.copy(this.pagingList).splice(startPage * this.itemsPerPage, this.itemsPerPage);

        return this;
    }

    update(pagingList = this.source, isSetSource = false) {
        this.pagingList = pagingList;
        this.pagingListLength = this.pagingList.length;

        let pageCount = Math.ceil(this.pagingListLength / this.itemsPerPage);
        if (pageCount < this.currentPage && pageCount > 0) { this.currentPage = pageCount; }
        this.paging(this.currentPage);

        if (isSetSource) { this.setSource(pagingList); }

        return this;
    }

    filter(searchParams = this.searchParams) {
        let condition = _getCondition(searchParams);

        if (JSON.stringify(condition) === '{}') {
            this.update();
            return false;
        }
        condition = {
            and: condition.and || {},
            or: condition.or || {}
        }
        if (JSON.stringify(condition.and) === '{}' && condition.or.constructor !== Array) {
            this.update();
            return false;
        }

        let _linqSource = new List<T>(this.source),
            strCondition = '';

        for (let key of Object.keys(condition.and)) {
            strCondition += `x.${key}.indexOf('${condition.and[key]}') > -1 &&`;
        }
        if (condition.or.length === 0) {
            strCondition = strCondition.substr(0, strCondition.length - 2);
        } else {
            for (let or of condition.or) {
                let keys = or.keys = or.keys || '',
                    value = or.value = or.value || '',
                    arrPs = keys.replace(/\s/g, '').split(',').filter(x => x !== '');

                if (arrPs.length > 0) {
                    strCondition += '(';
                    for (let item of arrPs) {
                        strCondition += `x.${item}.indexOf('${value}') > -1 ||`;
                    }
                    strCondition = `${strCondition.substr(0, strCondition.length - 2)}) &&`;
                }
            }
            strCondition = strCondition.substr(0, strCondition.length - 2);
        }

        _linqSource = _linqSource.Where(x => eval(strCondition));
        this.update(_linqSource.ToArray());

        return this;
    }

    private setSource(newSource: T[], searchParams = this.searchParams) {
        this._source = Gdeic.copy(newSource.map((x: any, idx) => {
            x.$$index = idx;
            return x;
        }));
        this.filter(searchParams);
    }
}