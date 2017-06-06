interface Array<T> {
  last(): T;
}

(function (_) {
  Reflect.defineProperty(_.prototype, 'last', {
    value: function last() {
      return this[this.length - 1];
    },
    writable: false,
    enumerable: false
  });
}(Array));
