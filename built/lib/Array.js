"use strict";
Array.prototype.copy = function () {
    let a = [];
    this.forEach(val => {
        a.push(val);
    });
    return a;
};
Array.prototype.forEachPair = function (action, allowDuplicates = true, allowDoubles = true) {
    const pairs = [];
    this.forEach((val, i) => {
        this.forEach((val2, ii) => {
            if (allowDoubles || i != ii) {
                const svals = [val, val2].sort((a, b) => a - b).toString();
                if (allowDuplicates || !pairs.includes(svals))
                    action([val, val2], [i, ii]);
                pairs.push(svals);
            }
        });
    });
};
Array.prototype.forEachGroup = function (groupSize, action, allowDuplicates = true, allowDoubles = true) {
    const pairs = [];
    forEachRecursive(this, groupSize, (vals, inds) => {
        if (allowDoubles || inds.IsUnique()) {
            const svals = vals.copy().sort((a, b) => a - b).toString();
            if (allowDuplicates || !pairs.includes(svals))
                action(vals, inds);
            pairs.push(svals);
        }
    });
};
function forEachRecursive(array, times, action, values = [], indices = []) {
    if (times == 0) {
        action(values, indices);
    }
    else {
        array.forEach((val, i) => {
            let newvals = [...values, val], newinds = [...indices, i];
            forEachRecursive(array, times - 1, action, newvals, newinds);
        });
    }
}
Array.prototype.Uniques = function () {
    return this.filter((value, i) => this.indexOf(value) === i);
};
Array.prototype.IsUnique = function () {
    return this.Uniques().length == this.length;
};
Array.prototype.toIntArray = function (radix = 10) {
    return this.map(n => parseInt(n, radix));
};
Array.prototype.Log = function () {
    console.log(this);
    return this;
};
Array.prototype.Sum = function () {
    return this.reduce((p, c) => p + c);
};
Array.prototype.Product = function () {
    return this.reduce((p, c) => p * c);
};
