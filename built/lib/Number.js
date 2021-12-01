"use strict";
Number.prototype.IsInteger = function () {
    return this.valueOf() % 1 == 0;
};
Number.prototype.IntDigits = function () {
    return [...this.toString()].map(n => parseInt(n));
};
Number.prototype.InRangeEq = function (v1, v2) {
    return this >= v1 && this <= v2;
};
Number.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
