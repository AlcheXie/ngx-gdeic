import { Gdeic } from '../service/gdeic.service';
import { List } from 'linqts';

interface SearchCondition {
    and?: any,
    or?: any
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
        protected _source: T[],
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

        this.update(_source);
    }

    paging(pageIndex) {
        let _maxPage = Math.ceil(this.pagingList.length / this.itemsPerPage);
        if (pageIndex > _maxPage) { pageIndex = _maxPage; }
        this.currentPage = pageIndex;

        let _startPage = pageIndex - 1 < 0 ? 0 : pageIndex - 1;
        this.currentList = Gdeic.copy(this.pagingList).splice(_startPage * this.itemsPerPage, this.itemsPerPage);

        return this;
    }

    update(pagingList = this._source, isSetSource = false) {
        this.pagingList = pagingList;
        this.pagingListLength = this.pagingList.length;

        let _pageCount = Math.ceil(this.pagingListLength / this.itemsPerPage);
        if (_pageCount < this.currentPage && _pageCount > 0) { this.currentPage = _pageCount; }
        if (this.currentPage === 0) { this.currentPage = 1; }
        this.paging(this.currentPage);

        if (isSetSource) { this.setSource(pagingList); }

        return this;
    }

    filter(searchParams = this.searchParams) {
        let _condition = GdeicPage.getCondition(searchParams);

        if (JSON.stringify(_condition) === '{}') {
            this.update();
            return false;
        }
        _condition = {
            and: _condition.and || {},
            or: _condition.or || []
        }
        if (JSON.stringify(_condition.and) === '{}' && _condition.or.constructor !== Array) {
            this.update();
            return false;
        }

        let _linqSource = new List<T>(this.source),
            strCondition = '';

        for (let key of Object.keys(_condition.and)) {
            if (_condition.and[key] === undefined || _condition.and[key] === null || _condition.and[key] === '') { continue; }
            strCondition += `x.${key}.toString().indexOf('${_condition.and[key]}') > -1 &&`;
        }
        if (_condition.or.length === 0) {
            strCondition = strCondition.substr(0, strCondition.length - 2);
        } else {
            for (let or of _condition.or) {
                let _keys = or.keys = or.keys || '',
                    _value = or.value = or.value || '',
                    _arrPs = _keys.replace(/\s/g, '').split(',').filter(x => x !== '');

                if (_arrPs.length > 0) {
                    strCondition += '(';
                    for (let item of _arrPs) {
                        if (_value === undefined || _value === null || _value === '') { continue; }
                        strCondition += `x.${item}.toString().indexOf('${_value}') > -1 ||`;
                    }
                    strCondition = `${strCondition.substr(0, strCondition.length - 2)}) &&`;
                }
            }
            strCondition = strCondition.substr(0, strCondition.length - 2);
        }

        _linqSource = _linqSource.Where(x => eval(strCondition));
        if (strCondition !== '') {
            _linqSource = _linqSource.Where(x => eval(strCondition));
        }
        this.update(_linqSource.ToArray());

        return this;
    }

    setSource(newSource: T[], searchParams = this.searchParams) {
        this._source = Gdeic.copy(newSource.map((x: any, idx) => {
            x.$$index = idx;
            return x;
        }));
        this.filter(searchParams);
    }

    private static getCondition(searchParams = {}): SearchCondition {
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
}