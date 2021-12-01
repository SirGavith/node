"use strict";
String.prototype.toIntList = function (radix = 10) {
    return this.split('\n').map(n => parseInt(n, radix));
};
String.prototype.toInt = function (radix = 10) {
    return parseInt(this.valueOf(), radix);
};
String.prototype.toCharArray = function (includeNewlines = true) {
    if (!includeNewlines) {
        return [...this].filter(v => {
            return v != '\n';
        });
    }
    return [...this];
};
String.prototype.SplitLines = function () {
    return this.valueOf().split('\n');
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
String.prototype.Log = function () {
    console.log(this);
    return this.valueOf();
};
