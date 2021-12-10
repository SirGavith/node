const fs = require('fs')
const path = require('path')

export function Range(start: number, stop: number) {
    const x = [start, stop].sort((a,b) => a-b)
    return Array.from({length: x[1] - x[0] + 1}, (_, i) => x[0] + i)
}

// class GMath {
//     /**
//      * Generates an array composed of the action called for each value in the range.
//      * @param action The id of the employee.
//      * @param range The range of values.
//      * @returns The array of the action called for each value in the range.
//      */
//     static Comprehend<T extends numericals>(action: (i: T) => T, range: GRange<T>) {
//         return range.Array.map(i => action(i))
//     }
// }

// class GRange<T extends numericals> {
//     Min: T
//     Max: T
//     constructor(min: T, max: T) {
//         this.Min = min
//         this.Max = max
//     }

//     get Array() {
//         let out: Array<T> = []
//         for (let i = this.Min; i < this.Max; i++) {
//             out.push(i)
//         }
//         return out
//     }

//     *YArray() {
//         for (let i = this.Min; i < this.Max; i++) {
//             yield i
//         }
//     }

//     static DoubleForRange<T extends numericals>(r1: GRange<T>, r2: GRange<T>, action: (a: T, b: T) => void) {
//         for (let a = r1.Min; a <= r1.Max; a++) {
//             for (let b = r2.Min; b <= r2.Max; b++) {
//                 action(a, b)
//             }
//         }
//     }
// }

export class Files {
    static ReadFile(localpath: string): string {
        return Files.ReadAllLines(localpath).join('\n')
    }
    static ReadAllLines(localpath: string): string[] {
        return (fs.readFileSync(path.join(__dirname, localpath), 'utf8') as string)
            .replaceAll('\r', '')
            .SplitLines()
            .filter(l => !l.startsWith('//'))
            .map(l => l.trim())
    }
}

export abstract class Sorts {
    static LeastFirst = (a: number, b: number) => a - b
    static GreatestFirst = (a: number, b: number) => b - a
    static Alphabetical = (a: string, b: string) => a.localeCompare(b)
}

require('./lib/Array')
require('./lib/Bigint')
require('./lib/Boolean')
require('./lib/Generator')
require('./lib/Number')
require('./lib/Object')
require('./lib/String')
require('./lib/XY')
require('./lib/Stack')

// require('./ProjectEuler')
// require('./Advent2020')
require('./Advent2021')
// require('./Linguistics')
// require('./geology')
