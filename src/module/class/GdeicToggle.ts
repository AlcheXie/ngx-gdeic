import { Gdeic } from '../service/gdeic.service';

export class GdeicToggle<T> {
  items: T[];

  constructor(source?: T[]) {
    source = source || [];
    this.items = [];
    for (const value of source) {
      this.toggle(value);
    }
  }

  has(item: T | T[]): boolean {
    if (item.constructor === Array) {
      const _aJson = this.items.map(x => Gdeic.toJson(x));
      return (item as T[]).map(x => _aJson.indexOf(Gdeic.toJson(x))).filter(x => x < 0).length === 0;
    } else {
      return this.items.some(x => Gdeic.toJson(x) === Gdeic.toJson(item));
    }
  }

  toggle(item: T | T[]): void {
    const _toggleItem = (itemToToggle: T) => {
      Gdeic.toggleItem(this.items, itemToToggle);
    };
    if (item.constructor === Array) {
      Gdeic.copy(item as T[]).forEach(x => {
        _toggleItem(x);
      });
    } else {
      _toggleItem(item as T);
    }
  }

  toggleAll(isSelectAll: boolean, itemList: T[], isCover: boolean = false): void {
    if (isSelectAll) {
      this.all(itemList, isCover);
    } else {
      if (isCover) {
        this.clear();
      } else {
        this.toggle(itemList);
      }
    }
  }

  all(itemList: T[], isCover: boolean = false): void {
    itemList = Gdeic.copy(itemList);

    if (isCover) {
      this.clear();
      for (const item of itemList) {
        this.items.push(item);
      }
    } else {
      for (const item of itemList) {
        if (!this.has(item)) {
          this.toggle(item);
        }
      }
    }
  }

  clear(): void {
    this.items.splice(0, this.items.length);
  }
}
