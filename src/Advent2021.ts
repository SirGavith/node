import fs from 'fs'
import path from 'path'

class Advent2021 {
    static get Data() {
        return fs.readFileSync(path.join(__dirname, '../input.txt'), 'utf8')
    }
    static get Data2() {
        return `forward 5
down 5
forward 8
up 3
down 8
forward 2`
    }
    static Day1(data: string) {
        data.toIntList()
            .reduce((p, _, i, a) => {
                const c = a.slice(i, i+3).Sum()
                return [p[0] + (c > p[1] ? 1 : 0), c]
            }, [0, Number.MAX_VALUE])[0].Log()
    }
    static Day2() {
        Advent2021.Data.SplitLines().map(s => s.split(' '))
            .reduce((p: number[], v) => {
                const val = v[1].toInt()
                return [
                    p[0] + (v[0] === 'forward' ? val : 0),
                    p[1] + (v[0] === 'forward' ? p[2] * val : 0),
                    p[2] + (v[0] !== 'forward' ? (v[0] === 'down' ? 1 : -1) * val : 0)
                ]
            }, [0, 0, 0]).Log().slice(0, 2).Product().Log()
    }
}
Advent2021.Day2()