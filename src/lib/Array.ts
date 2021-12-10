interface Array<T> {
    /** returns a shallow copy of an array */
    Copy(): T[]
    forEachPair(action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    forEachGroup(groupSize: number, action: (value: T[], index: number[]) => void, allowDuplicates?: boolean, allowDoubles?: boolean): void
    Uniques(): T[]
    IsUnique(): boolean
    MostCommon(): T
    LeastCommon(): T
    /** loops until the list has one element, which it returns. 
     in each iteration, it filters the list by the filter */
    ReduceFilter(filter: (value: T, index: number, array: T[]) => boolean): T
    FillEmpty(value: T, pad?: number): Array<T>
    Count(predicate: (value: T, index: number, array: T[]) => boolean): number
    IncrementOrCreate (index: number): void
    BinarySearch(search: (value: T, index: number) => boolean): T
    Permutations(): T[][]
    RemoveUndefined(): NonNullable<T>[]
    Median(): T
    Log(): Array<T>

    //String
    toIntArray(radix?: number): number[]
}

Array.prototype.Copy = function() {
    let a: any[] = []
    this.forEach((val, i) => {
        a[i] = val
    })
    a.length = this.length
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
            const svals = vals.Copy().sort((a, b) => a - b).toString()
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
Array.prototype.ReduceFilter = function(filter: (value: any, index: number, array: any[]) => boolean) {
    //loops until the list has one element, which it returns; 
    // in each iteration, it filters the list by the filter
    let arr = this.Copy()
    let i = 0
    while (true) {
        arr = arr.filter(filter)
        if (arr.length === 1) return arr[0]
        i++
    }
}
Array.prototype.FillEmpty = function<T>(fillValue: T, pad?: number) {
    const arr: Array<T> = [],
        len = pad ?? this.length
    for (let i = 0; i < len; i++) {
        arr[i] = this[i] ?? fillValue
    }
    return arr
}
Array.prototype.Count = function(predicate: (value: any, index: number, array: any[]) => boolean) {
    return this.filter(predicate).length
}
Array.prototype.IncrementOrCreate = function(index: number) {
    if (this[index]) this[index]++
    else this[index] = 1
}
Array.prototype.BinarySearch = function<T>(search: (value: T, index: number) => boolean) {
    let index = this.length / 2,
        prevVal
    for (let i = this.length; true; i++) {
        if (search(this[index], index))
            index += index / 2
        else index /= 2
        prevVal = index
    }
}

Array.prototype.Permutations = function<T>() {
    let result: T[][] = [];

    const permute = (arr: T[], m: T[] = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }

    permute(this)

    return result;
}
Array.prototype.RemoveUndefined = function<T>() {
    const arr: NonNullable<T>[] = []
    for (const v of this as T[]) {
        if (v != undefined && v != null) arr.push(v as NonNullable<T>)
    }
    return arr
}
Array.prototype.Median = function() {
    const arr = this.sort((a, b) => a - b),
        len = arr.length / 2
    if (this.length.IsEven()) {
        return (arr[Math.floor(len)] + arr[Math.ceil(len)]) / 2
    }
    else {
        return this.at(arr.length / 2)
    } 
}
Array.prototype.Log = function() {
    console.log(this)
    return this
}

type numericals = number | bigint
interface Array<T> {//<T extends numericals> {
    Sum(): T
    Product(): T
    toInt(radix?: number): number
}
Array.prototype.Sum = function() {
    return this.reduce((p,c) => p+c)
}
Array.prototype.Product = function() {
    return this.reduce((p, c) => p * c)
}
Array.prototype.toInt = function(radix = 10) {
    return this.join('').toInt()
}

interface Array<T> {//<T extends Array> {
    IncrementOrCreate2D(val1: number, val2: number): void
    toObject(): {}
}

Array.prototype.IncrementOrCreate2D = function(val1: number, val2: number) {
    if (this[val1]) {
        if (this[val1][val2]) this[val1][val2]++
        else this[val1][val2] = 1
    }
    else {
        this[val1] = []
        this[val1][val2] = 1
    }
}
Array.prototype.toObject = function() {
    return Object.fromEntries(this)
}
