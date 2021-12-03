interface Array<T> {
    /** returns a shallow copy of an array */
    copy(): T[]
    forEachPair(action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    forEachGroup(groupSize: number, action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    Uniques(): T[]
    IsUnique(): boolean
    MostCommon(): T
    LeastCommon(): T
    Log(): Array<T>

    //String
    toIntArray(radix?: number): number[]
}
Array.prototype.copy = function() {
    let a: any[] = []
    this.forEach(val => {
        a.push(val)
    })
    return a
}
Array.prototype.forEachPair = function(action: (value: any[], index: number[]) => void, allowDuplicates = true, allowDoubles = true) {
    const pairs: string[] = []
    this.forEach((val, i) => {
        this.forEach((val2, ii) => {
            if (allowDoubles ||  i != ii) {
                const svals = [val, val2].sort((a, b) => a - b).toString()
                if (allowDuplicates || !pairs.includes(svals)) action([val, val2], [i, ii])
                pairs.push(svals)
            }
        })
    })
}
Array.prototype.forEachGroup = function(groupSize: number, action: (value: any[], index: number[]) => void, allowDuplicates = true, allowDoubles = true) {
    const pairs: string[] = []
    forEachRecursive(this, groupSize, (vals, inds) => {
        if (allowDoubles || inds.IsUnique()) {
            const svals = vals.copy().sort((a, b) => a - b).toString()
            if (allowDuplicates || !pairs.includes(svals)) action(vals, inds)
            pairs.push(svals)
        }
    })
}

function forEachRecursive(array: any[], times: number, action: (values: any[], indices: number[]) => void, values: any[] = [], indices: number[] = []) {
    if (times == 0) {
        action(values, indices)
    } else {
        array.forEach((val, i) => {
            let newvals = [...values, val],
                newinds = [...indices, i]
            forEachRecursive(array, times - 1, action, newvals, newinds)
        });
    }
}
Array.prototype.MostCommon = function() {
    return this.sort((a,b) =>
          this.filter(v => v === a).length
        - this.filter(v => v === b).length
    ).pop()
}
Array.prototype.LeastCommon = function() {
    return this.sort((a,b) =>
          this.filter(v => v === a).length
        - this.filter(v => v === b).length
    ).shift()
}
Array.prototype.Uniques = function() {
    return this.filter((value, i) => this.indexOf(value) === i)
}
Array.prototype.IsUnique = function() {
    return this.Uniques().length == this.length
}
Array.prototype.toIntArray = function(radix = 10) {
    return this.map(n => parseInt(n, radix))
}
Array.prototype.Log = function() {
    console.log(this)
    return this
}

type numericals = number | bigint
interface Array<T extends numericals> {
    Sum(): T
    Product(): T
}
Array.prototype.Sum = function() {
    return this.reduce((p,c) => p+c)
}
Array.prototype.Product = function() {
    return this.reduce((p, c) => p * c)
}