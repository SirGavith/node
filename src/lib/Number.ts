interface Number {
    IsInteger(): boolean
    /** @returns An array of the digits of the number */
    IntDigits(): number[]
    InRangeEq(v1: number, v2: number): boolean
    IsEven(): boolean
    IsOdd(): boolean
    Log(): number
}
Number.prototype.IsInteger = function() {
    return this.valueOf() % 1 == 0
}
Number.prototype.IntDigits = function() {
    return [...this.toString()].map(n => parseInt(n))
}
Number.prototype.InRangeEq = function(v1, v2) {
    return this >= v1 && this <= v2   
}
Number.prototype.IsEven = function() {
    return this.valueOf() % 2 === 0
}
Number.prototype.IsOdd = function() {
    return this.valueOf() % 2 === 1
}
Number.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}