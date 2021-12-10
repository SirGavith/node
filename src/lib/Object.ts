interface Object {
    RemoveUndefinedVals(): {}
    Values(): any[]
    Keys(): string[]
    Entries(): [string, any][]
    filter(filter: (key: string, val: any) => boolean): {}
    forEach(lambda: (key: string, val: any) => void): void
    Log(): {}
}

Object.prototype.Keys = function() {
    return Object.keys(this)
}
Object.prototype.Values = function() {
    return Object.values(this)
}
Object.prototype.Entries = function() {
    return Object.entries(this)
}

Object.prototype.RemoveUndefinedVals = function() {
    return this.filter((key, val) => val != undefined)
}
Object.prototype.filter = function(filter: (key: string, val: any) => boolean) {
    const out: {[key: string]: any} = {}
    for (const [key, val] of this.Entries()) {
        if (filter(key, val)) out[key] = val
    }
    return out
}
Object.prototype.forEach = function(lambda: (key: string, val: any) => void) {
    for (const [key, val] of this.Entries()) {
        lambda(key, val)
    }
}

Object.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}