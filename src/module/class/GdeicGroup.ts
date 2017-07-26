import { Gdeic } from '../service/gdeic.service';
import { GdeicPage } from './GdeicPage';
import { List } from 'linqts';

interface GroupItem<T> {
    groupTag: string,
    source: T[],
    isExpand?: boolean,
    $$index?: number;
}

interface GroupSettings {
    key: string,
    name: string
}

export class GdeicGroup<T> extends GdeicPage<GroupItem<T>> {
    groupSettings: GroupSettings | string;
    itemsInitPerGroup: number;
    private _sourcePaging: GdeicPage<T>;

    get count() {
        return this.source.length;
    }

    constructor(source: T[] = [],
        itemsPerPage = 10,
        itemsInitPerGroup = 0) {
        super([{ groupTag: null, source: source, isExpand: false, $$index: 0 }], itemsPerPage);
        this._sourcePaging = new GdeicPage(source);
        this.itemsInitPerGroup = itemsInitPerGroup;
    }

    group(groupSettings: GroupSettings | string = undefined, isSetSource: boolean = false) {
        this.groupSettings = Gdeic.copy(groupSettings);

        let _linqSource = new List<T>(this._sourcePaging.pagingList),
            _resultList: GroupItem<T>[] = [];

        if (groupSettings === undefined) {
            _resultList.push({ groupTag: null, source: _linqSource.ToArray() });
        } else {
            let _groupKey = (groupSettings as GroupSettings).key || groupSettings;
            let _keyOrderBy = _linqSource
                .Select(x => eval(`x.${_groupKey}`))
                .Distinct()
                .OrderBy(x => x)
                .ToArray();
            let _groups = _linqSource.GroupBy(x => eval(`x.${(groupSettings as GroupSettings).key || groupSettings}`), x => x);
            let _isString = typeof groupSettings === 'string';
            for (let i = 0, max = _keyOrderBy.length; i < max; i++) {
                let _currKey = _keyOrderBy[i],
                    _currKeySource = _groups[_currKey];
                _resultList.push({
                    groupTag: _isString ? _currKey : { key: eval(`_currKeySource[0].${groupSettings['key']}`), name: eval(`_currKeySource[0].${groupSettings['name']}`) },
                    source: _currKeySource,
                    isExpand: false,
                    $$index: i
                });
            }
        }
        super.update(_resultList, isSetSource);
        return this;
    }

    refresh(pagingList: T[], isSetSource: boolean = false) {
        let _expandList = this.pagingList.map(x => x.isExpand);
        this._sourcePaging.update(pagingList, isSetSource);
        this.group(this.groupSettings);
        this.pagingList = this.pagingList.map((x, idx) => {
            x.isExpand = _expandList[idx];
            return x;
        });
        this.currentList = this.currentList.map(x => {
            x.isExpand = this.pagingList[x.$$index].isExpand;
            return x;
        });
        return this;
    }

    filter(searchParams = this.searchParams) {
        this._sourcePaging.searchParams = Gdeic.copy(searchParams);
        this._sourcePaging.filter();
        this.group(this.groupSettings);
        return this;
    }
}