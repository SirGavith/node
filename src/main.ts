type numericals = number | bigint

const range = (start: number, stop: number) => Array.from({length: stop - start}, (_, i) => start + i)

class GMath {
    /**
     * Generates an array composed of the action called for each value in the range.
     * @param action The id of the employee.
     * @param range The range of values.
     * @returns The array of the action called for each value in the range.
     */
    static Comprehend<T extends numericals>(action: (i: T) => T, range: GRange<T>) {
        return range.Array.map(i => action(i))
    }
}

class GRange<T extends numericals> {
    Min: T
    Max: T
    constructor(min: T, max: T) {
        this.Min = min
        this.Max = max
    }

    get Array() {
        let out: Array<T> = []
        for (let i = this.Min; i < this.Max; i++) {
            out.push(i)
        }
        return out
    }

    *YArray() {
        for (let i = this.Min; i < this.Max; i++) {
            yield i
        }
    }

    static DoubleForRange<T extends numericals>(r1: GRange<T>, r2: GRange<T>, action: (a: T, b: T) => void) {
        for (let a = r1.Min; a <= r1.Max; a++) {
            for (let b = r2.Min; b <= r2.Max; b++) {
                action(a, b)
            }
        }
    }
}


require('./lib/Array')
require('./lib/Bigint')
require('./lib/Boolean')
require('./lib/Generator')
require('./lib/Number')
require('./lib/String')



// require('./ProjectEuler')
// require('./Advent2020')
require('./Advent2021')
// require('./Linguistics')