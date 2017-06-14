import { Gdeic } from '../service/gdeic.service';

export class GdeicToggle<T> {
    items: T[];

    get source() {
        return this._source;
    }

    constructor(
        private _source?: T[]) {
        _source = _source || [];
        this.items = [];
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

    all(itemList: T[], isCover: boolean = false) {
        itemList = Gdeic.copy(itemList);

        if (isCover) {
            this.clear();
            this.items = itemList;
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
        return this;
    }
}