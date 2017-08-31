import { Gdeic } from '../module/service/gdeic.service';

interface Array<T> {
  last(): T;
  intersect(array: T[]): T[];
  differentiate(array: T[]): T[];
  union(array: T[]): T[];
}

(function (_) {
  Reflect.defineProperty(_.prototype, 'last', {
    value: function last() {
      return this[this.length - 1];
    },
    writable: false,
    enumerable: false
  });
  Reflect.defineProperty(_.prototype, 'intersect', {
    value: function intersect(array: any[]): any[] {
      const _array = [];
      array = array.map(x => Gdeic.toJson(x));
      for (const item of this) {
        const value = Gdeic.toJson(Gdeic.copy(item));
        if (array.indexOf(value) > -1) {
          _array.push(value);
        }
      }
      return _array.map(x => Gdeic.fromJson(x));
    },
    writable: false,
    enumerable: false
  });
  Reflect.defineProperty(_.prototype, 'differentiate', {
    value: function differentiate(array: any[]): any[] {
      const _array = [];
      const that = this.map(x => Gdeic.toJson(x));
      for (const item of array) {
        const value = Gdeic.toJson(Gdeic.copy(item));
        if (that.indexOf(value) < 0) {
          _array.push(value);
        }
      }
      array = array.map(x => Gdeic.toJson(x));
      for (const item of this.reverse()) {
        const value = Gdeic.toJson(Gdeic.copy(item));
        if (array.indexOf(value) < 0) {
          _array.unshift(value);
        }
      }
      return _array.map(x => Gdeic.fromJson(x));
    },
    writable: false,
    enumerable: false
  });
  Reflect.defineProperty(_.prototype, 'union', {
    value: function union(array: any[]): any[] {
      const result = Array(this.length);
      for (let i = 0, max = this.length; i < max; i++) {
        result[i] = this[i];
      }
      const that = this.map(x => Gdeic.toJson(x));
      for (const value of array) {
        if (that.indexOf(Gdeic.toJson(value)) < 0) {
          result.push(value);
        }
      }
      return result;
    },
    writable: false,
    enumerable: false
  });
}(Array));
