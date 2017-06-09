import { Gdeic } from '../service/gdeic.service';

export class GdeicToggle<T> {
    items: T[];

    private _properties: string[];

    get properties() {
        return this._properties;
    }

    constructor(
        private _arg1: T[] | string,
        private _arg2?: string) {
        let _source: T[] = [],
            _strProperties: string = '';

        if (_arg1.constructor === Array) {
            _source = _arg1 as T[];
            if (_arg2 !== undefined) {
                _strProperties = _arg2;
            }
        } else {
            _strProperties = _arg1 as string;
        }
        this._properties = _strProperties.trimAll().split(',');

        this.items = [];
        for (let value of this._properties) {
            this[`${value}s`] = [];
        }
        for (let value of _source) {
            this.toggle(value);
        }
    }

    has(item: T) {
        return this.items.some(x => Gdeic.toJson(x) === Gdeic.toJson(item));
    }

    toggle(item: T | T[]) {
        let _toggleItem = (item: T) => {
            Gdeic.toggleItem(this.items, item);
            for (let property of this._properties) {
                Gdeic.toggleItem(this[`${property}s`], item, property);
            }
        }
        if (item.constructor === Array) {
            (item as T[]).forEach(Gdeic.copy(item), x => _toggleItem(x));
        } else {
            _toggleItem(item as T);
        }
        return this;
    }

    toggleAll(isSelectAll: boolean, itemList: T[], isCover: boolean = false) {
        if (isSelectAll) {
            this.all(itemList, isCover);
        } else {
            if (isCover) {
                this.clear();
            } else {
                this.toggle(itemList);
            }
        }
        return this;
    }

    all(itemList, isCover = false) {
        itemList = Gdeic.copy(itemList);

        if (isCover) {
            this.clear();
            this.items = itemList;
            for (let property of this._properties) {
                this[`${property}s`] = itemList.map(x => x[property]);
            }
        } else {
            for (let item of itemList) {
                if (!this.has(item)) {
                    this.toggle(item);
                }
            }
        }
        return this;
    }

    clear() {
        this.items = [];
        for (let property of this._properties) {
            this[`${property}s`] = []
        }
        return this;
    }

    getStringByProperty(propertyName: string, splitOf: string = ',') {
        if (this.hasOwnProperty(`${propertyName}s`)) {
            return this[`${propertyName}s`].join(splitOf);
        } else {
            return this.items.map(x => eval(`x.${propertyName}`)).join(splitOf);
        }
    }
}