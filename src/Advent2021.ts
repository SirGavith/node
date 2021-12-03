import { Files, PushorCreate } from './main'

const UseExample = false,
    Data = Files.ReadAllLines(UseExample ? '../example.txt' : '../input.txt')

class Advent2021 {
    static Day1() {
        Data.toIntArray()
            .reduce((p, _, i, a) => {
                const c = a.slice(i, i+3).Sum()
                return [p[0] + (c > p[1] ? 1 : 0), c]
            }, [0, Number.MAX_VALUE])[0].Log()
    }
    static Day2() {
        Data.map(s => s.split(' '))
            .reduce((p: number[], v) => {
                const val = v[1].toInt()
                return [
                    p[0] + (v[0] === 'forward' ? val : 0),
                    p[1] + (v[0] === 'forward' ? p[2] * val : 0),
                    p[2] + (v[0] !== 'forward' ? (v[0] === 'down' ? 1 : -1) * val : 0)
                ]
            }, [0, 0, 0]).Log().slice(0, 2).Product().Log()
    }
    static Day3() {
        let oxygen = Data.copy(),
            co2 = Data.copy()
        for (let i = 0; oxygen.length > 1; i++) {
            const mc = oxygen.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .MostCommon()
            oxygen = oxygen.filter(n => n[i] === mc)
        }
        for (let i = 0; co2.length > 1; i++) {
            const mc = co2.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .LeastCommon()
            co2 = co2.filter(n => n[i] === mc)
        }

        (oxygen[0].toInt(2) * co2[0].toInt(2)).Log()
    }
}
Advent2021.Day3();