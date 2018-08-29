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
      const result = [];
      for (const item of this) {
        if (array.indexOf(item) > -1) {
          result.push(item);
        }
      }
      return result;
    },
    writable: false,
    enumerable: false
  });
  Reflect.defineProperty(_.prototype, 'differentiate', {
    value: function differentiate(array: any[]): any[] {
      const result = [];
      for (const item of array) {
        if (this.indexOf(item) < 0) {
          result.push(item);
        }
      }
      for (const item of this.reverse()) {
        if (array.indexOf(item) < 0) {
          result.unshift(item);
        }
      }
      return result;
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
      for (const item of array) {
        if (this.indexOf(item) < 0) {
          result.push(item);
        }
      }
      return result;
    },
    writable: false,
    enumerable: false
  });
}(Array));
