interface Array<T>{
    last(): T;
}

(function (_) {
    Object.defineProperties(_.prototype, {
        last: {
            value: function last() {
                return this[this.length - 1];
            },
            writable: false,
            enumerable: false
        }
    });
}(Array));