interface String {
    toIntList(radix?: number): number[]
    toInt(radix?: number): number
    toArray(includeNewlines?: boolean): string[]
    SplitLines(): string[]
    RegexTest(regex: RegExp): boolean
    ReplaceMap(map: { [key: string]: string }): string
    RemoveChars(chars: string[]): string
    Log(): string
}

String.prototype.toIntList = function(radix = 10) {
    return this.split('\n').map(n => parseInt(n, radix))
}
String.prototype.toInt = function(radix = 10) {
    return parseInt(this.valueOf(), radix)
}
String.prototype.toArray = function(includeNewlines = true) {
    if (!includeNewlines) {
        return [...this].filter(v => {
            return v != '\n'
        })
    }
    return [...this]
}
String.prototype.SplitLines = function() {
    return this.valueOf().split('\n').map(s => s.replaceAll('\r', ''))
}
String.prototype.RegexTest = function(regex: RegExp) {
    return regex.test(this.valueOf())
}
String.prototype.ReplaceMap = function(map: { [key: string]: string }) {
    let string = this.valueOf()
    Object.entries(map).forEach(keyval => {
        string = string.replaceAll(keyval[0], keyval[1])
    })
    return string
}
String.prototype.RemoveChars = function(chars: string[]) {
    let string = this.valueOf()
    chars.forEach(char => {
        string = string.replaceAll(char, '')
    })
    return string
}
String.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}