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

  has(item: T): boolean {
    return this.items.some(x => Gdeic.toJson(x) === Gdeic.toJson(item));
  }

  toggle(item: T | T[]): void {
    const _toggleItem = (itemToToggle: T) => {
      Gdeic.toggleItem(this.items, itemToToggle);
    };
    if (item.constructor === Array) {
      (item as T[]).forEach(Gdeic.copy(item), x => _toggleItem(x));
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
      this.items = itemList;
    } else {
      for (const item of itemList) {
        if (!this.has(item)) {
          this.toggle(item);
        }
      }
    }
  }

  clear(): void {
    this.items = [];
  }
}
