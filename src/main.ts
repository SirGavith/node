const fs = require('fs')
const path = require('path')

export function Range(start: number, stop: number) {
    const x = [start, stop].sort((a,b) => a-b)
    return Array.from({length: x[1] - x[0] + 1}, (_, i) => x[0] + i)
}



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
require('./lib/BigMap')
require('./lib/BigSet')
require('./lib/Boolean')
require('./lib/Generator')
require('./lib/Number')
require('./lib/Object')
require('./lib/String')
require('./lib/XY')
require('./lib/Stack')
require('./lib/LinkedList')

// require('./ProjectEuler')
// require('./Advent2020')
// require('./Advent2021')
require('./wordle')
// require('./Linguistics')
// require('./geology')
// require('./Lexer')
// require('./Compiler')
// require('./Emulator')