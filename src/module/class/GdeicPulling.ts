import { Gdeic } from '../service/gdeic.service';

export class GdeicPulling<T> {
  itemsPerTime: number;
  showingList: T[];
  hidingList: T[];
  private _source: T[];
  private _tempList: T[];

  constructor(
    source: T[],
    itemsPerTime?: number
  ) {
    itemsPerTime = itemsPerTime || 20;
    this._source = source;
    this.itemsPerTime = itemsPerTime;
    this.showingList = this._source.slice(0, this.itemsPerTime);
    this.hidingList = this._source.slice(this.itemsPerTime, this._source.length);
  }

  pulling(): void {
    if (this.hidingList.length > 0) {
      this._tempList = Gdeic.copy(this.hidingList);
      for (let i = 0, max = this.hidingList.length > this.itemsPerTime ? this.itemsPerTime : this.hidingList.length; i < max; i++) {
        this.showingList.push(this._tempList[i]);
      }
      this.hidingList = this._tempList.slice(this.itemsPerTime, this._tempList.length);
      this._tempList = [];
    }
  }
}
