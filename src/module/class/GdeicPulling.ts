import { Gdeic } from '../service/gdeic.service';

export class GdeicPulling<T> {
    itemsPerTime: number;
    showingList: T[];
    hidingList: T[];
    private _tempList: T[];

    get source() {
        return this._source;
    }

    constructor(
        private _source = [],
        itemsPerTime = 20) {
        if (!(typeof _source === 'object' && _source.constructor === Array)) {
            _source = [];
        }

        this.itemsPerTime = itemsPerTime;
        this.showingList = _source.slice(0, this.itemsPerTime);
        this.hidingList = _source.slice(this.itemsPerTime, _source.length);
    }

    pulling() {
        if (this.hidingList.length > 0) {
            this._tempList = Gdeic.copy(this.hidingList);
            for (let i = 0, max = this.hidingList.length > this.itemsPerTime ? this.itemsPerTime : this.hidingList.length; i < max; i++) {
                this.showingList.push(this._tempList[i]);
            }
            this.hidingList = this._tempList.slice(this.itemsPerTime, this._tempList.length);
            this._tempList = [];
        }
        return this;
    }
}