interface String {
  trimAll(): string;
}

(function (_) {
  Reflect.defineProperty(_.prototype, 'trimAll', {
    value: function trimAll() {
      return this.replace(/\s/g, '');
    },
    configurable: false,
    enumerable: false,
    writable: false
  });
}(String));
