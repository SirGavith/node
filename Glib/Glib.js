"use strict";
BigInt.prototype.DigitCount = function () {
    return this.toString().length;
};
BigInt.prototype.IntDigits = function () {
    return [...this.toString()].map(n => parseInt(n));
};
BigInt.prototype.SumDigits = function () {
    return this.IntDigits().reduce((p, c) => p + c);
};
BigInt.prototype.SqrtDigits = function (precision) {
    if (this.valueOf() > 99 || this.valueOf() < 1) {
        throw new RangeError("n must be between 1 < n <= 99");
    }
    let result = 0n, remainder = 0n, step = 0n;
    while (step < precision) {
        let c = 100n * remainder;
        c += step == 0n ? this.valueOf() : 0n;
        let x = 0n;
        while (true) {
            if (x * (20n * result + x) > c) {
                x--;
                break;
            }
            x++;
        }
        let y = x * (20n * result + x);
        remainder = c - y;
        if (c == y) {
            // console.log('found result')
            break;
        }
        result *= 10n;
        result += x;
        step++;
    }
    return result;
};
BigInt.prototype.Exp = function (exp) {
    let x = 1n;
    for (let i = 0n; i < exp; i++) {
        x *= this.valueOf();
    }
    return x;
};
BigInt.prototype.Sq = function () {
    let n = this.valueOf();
    return n * n;
};
BigInt.prototype.Factorial = function () {
    let x = 1n;
    for (let i = this.valueOf(); i > 1; i--) {
        x *= i;
    }
    return x;
};
BigInt.prototype.RotateDigits = function () {
    let digits = [...this.toString()];
    digits.push(digits.shift() ?? '');
    return BigInt(digits.join(''));
};
BigInt.prototype.IsPrime = function () {
    let n = this.valueOf();
    for (let i = 2n; i * i <= n; i++) {
        if (n % i === 0n)
            return false;
    }
    return true;
};
Boolean.prototype.IsTrue = function (action) {
    if (this)
        action();
};
Boolean.prototype.IsFalse = function (action) {
    if (!this)
        action();
};
Boolean.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
const GeneratorPrototype = Object.getPrototypeOf(function* () { }).prototype;
GeneratorPrototype.Map = function* (mapper) {
    for (const val of this) {
        yield mapper(val);
    }
};
GeneratorPrototype.Reduce = function* (action, initialValue = 0) {
    let accumulator = initialValue;
    for (const val of this) {
        accumulator = action(accumulator, val);
        // yield accumulator;
    }
    return accumulator;
};
Number.prototype.IsInteger = function () {
    return this.valueOf() % 1 == 0;
};
Number.prototype.IntDigits = function () {
    return [...this.toString()].map(n => parseInt(n));
};
Number.prototype.InRangeEq = function (v1, v2) {
    return this >= v1 && this <= v2;
};
Number.prototype.IsEven = function () {
    return this.valueOf() % 2 === 0;
};
Number.prototype.IsOdd = function () {
    return this.valueOf() % 2 === 1;
};
Number.prototype.SumOfLess = function () {
    return this.valueOf() * (this.valueOf() + 1) * 0.5;
};
Number.prototype.Floor = function () {
    return Math.floor(this.valueOf());
};
Number.prototype.Ceil = function () {
    return Math.ceil(this.valueOf());
};
Number.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
Object.prototype.Keys = function () {
    return Object.keys(this);
};
Object.prototype.Values = function () {
    return Object.values(this);
};
Object.prototype.Entries = function () {
    return Object.entries(this);
};
Object.prototype.Copy = function () {
    return this.Entries().toObject();
};
Object.prototype.RemoveUndefinedVals = function () {
    return this.filter((_, val) => val != undefined);
};
Object.prototype.IncrementOrCreate = function (key, value = 1) {
    const t = typeof value === 'number' ? this : this;
    if (t[key])
        t[key] += value; //these assertions are lies
    else
        t[key] = value;
};
Object.prototype.filter = function (filter) {
    const out = {};
    for (const [key, val] of this.Entries()) {
        if (filter(key, val))
            out[key] = val;
    }
    return out;
};
Object.prototype.forEach = function (lambda) {
    for (const [key, val] of this.Entries()) {
        lambda(key, val);
    }
};
Object.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
String.prototype.forEach = function (lambda) {
    this.toArray().forEach((v, i) => lambda(v, i));
};
String.prototype.toIntList = function (radix, delim = '\n') {
    return this.split(delim).map(n => parseInt(n, radix));
};
String.prototype.toFloatList = function (delim = '\n') {
    return this.split(delim).map(n => parseFloat(n));
};
String.prototype.toInt = function (radix) {
    return parseInt(this.valueOf(), radix);
};
String.prototype.toFloat = function () {
    return parseFloat(this.valueOf());
};
String.prototype.toArray = function (includeNewlines = true) {
    if (!includeNewlines) {
        return [...this].filter(v => {
            return v != '\n';
        });
    }
    return [...this];
};
String.prototype.in = function (str) {
    return str.includes(this.valueOf());
};
String.prototype.SplitLines = function () {
    return this.valueOf().split('\n').map(s => s.replaceAll('\r', ''));
};
String.prototype.RegexTest = function (regex) {
    return regex.test(this.valueOf());
};
String.prototype.ReplaceMap = function (map) {
    let string = this.valueOf();
    Object.entries(map).forEach(keyval => {
        string = string.replaceAll(keyval[0], keyval[1]);
    });
    return string;
};
String.prototype.RemoveChars = function (chars) {
    let string = this.valueOf();
    chars.forEach(char => {
        string = string.replaceAll(char, '');
    });
    return string;
};
String.prototype.IsAllCapital = function () {
    return this.toArray().every(char => char === char.toUpperCase());
};
String.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
