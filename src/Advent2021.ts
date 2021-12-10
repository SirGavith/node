import { Array2D as Array2D, XY } from './lib/XY'
import { ArraySort as Sorts, Files, Range } from './main'

const UseExample = false,
    Data = Files.ReadAllLines(UseExample ? '../example.txt' : '../input.txt'),
    DataFull = Files.ReadFile(UseExample ? '../example.txt' : '../input.txt')

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
        let oxygen = Data.Copy(),
            co2 = Data.Copy()

        Data.ReduceFilter(
            (n, i) => n[i] === Data.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .MostCommon()
        ).Log()

        // for (let i = 0; oxygen.length > 1; i++) {
            
        // }
        for (let i = 0; co2.length > 1; i++) {
            const mc = co2.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .LeastCommon()
            co2 = co2.filter(n => n[i] === mc)
        }

        (oxygen[0].toInt(2) * co2[0].toInt(2)).Log()
    }

    static Day4() {
        const d = DataFull.split('\n\n'),

            randoms = d[0].split(',').toIntArray(),

            boards = d.slice(1).map(b => { return {
                bingo: false,
                board: b.SplitLines().map(l => 
                    l.replaceAll('  ', ' ').trim().split(' ')
                    .toIntArray()
                    .map(i => { return { value: i, marked: false }})
                ) } }
            )

        for (const rand of randoms) {
            for (const board of boards.filter(b => !b.bingo)) {
                //mark tiles
                board.board.forEach(row => 
                    row.forEach(t => 
                        (t.value === rand).IsTrue(() => t.marked = true)))

                //check bingos
                for (let i = 0; i < 5; i++) {
                    const row = board.board[i],
                        col = board.board.map(row => row[i])
  
                    if (col.every(t => t.marked) || row.every(t => t.marked))
                        board.bingo = true
                }

                if (boards.every(b => b.bingo))
                // if (board.bingo)
                    return (board.board.Log().flat()
                            .filter(t => !t.marked)
                            .reduce((s, c) => s + c.value, 0).Log()
                        * rand.Log()).Log()
            }
        }
    }

    static Day5() {
        const d = Data.map(d => {
                const dd = d.split(' -> ').map(a => a.split(',').toIntArray())
                return {
                    x1: dd[0][0],
                    y1: dd[0][1],
                    x2: dd[1][0],
                    y2: dd[1][1],
                }
            }).Log(),
            map: number[][] = []

        for (const p of d)
            if (p.x1 === p.x2) //vertical
                Range(p.y1, p.y2).forEach(n =>
                    map.IncrementOrCreate2D(n, p.x1))
            else if (p.y1 === p.y2) //horizontal
                Range(p.x1, p.x2).forEach(n =>
                    map.IncrementOrCreate2D(p.y1, n))
            else //diagonal
                for (let i = 0; i <= Math.abs(p.x1 - p.x2); i++)
                    map.IncrementOrCreate2D(
                        p.y1 + (p.y1 > p.y2 ? -i : i),
                        p.x1 + (p.x1 > p.x2 ? -i : i))

        const len = map.reduce((p, c) => c.length > p ? c.length : p, 0)
        map.FillEmpty([]).forEach(r =>
            r.FillEmpty(0, len)
            .map(t => t === 0 ? '.' : t.toString()).join('').Log())

        map.flat().Count(c => c >= 2).Log()
    }

    static Day6_naive() {
        let school = Data[0].split(',').toIntArray().Log()

        for (let i = 0; i < 18; i++) {
            i.Log()
            school.forEach((fish, ii) => {
                if (fish === 0) {
                    school.push(8)
                    school[ii] = 6
                }
                else school[ii]--
            })
                
            school.Log()
        }
    }
    static Day6_revised() {
        const school: bigint[] = Array(9).fill(BigInt(0))
        Data[0].split(',').toIntArray().forEach(f => school[f]++)

        for (let i = 0; i < 2560; i++) {
            let parents = school.shift()!
            school[6] += parents
            school[8] = parents
        }
        school.Sum().Log()
    }

    static Day7() {
        const d = Data[0].split(',').toIntArray().Log()

        Range(0, Math.max(...d)) //could binary search
            .map(i =>
                d.map(crab => {
                    const n = Math.abs(crab - i)
                    return n * (n + 1) / 2
                }).Sum())
            .reduce((prev:number[], cur, i) =>
                prev[0] > cur ? [cur, i] : prev,
            [Number.MAX_VALUE, 0]).Log()
    }

    static Day8() {  //1.9s
        const d = Data.map(display => display.split(' | ')
            .map(d => d.split(' ').map(a => a.toArray()))),
            sevenSegs = {
                'ABCEFG': 0,
                'CF': 1,
                'ACDEG': 2,
                'ACDFG': 3,
                'BCDF': 4,
                'ABDFG': 5,
                'ABDEFG': 6,
                'ACF': 7,
                'ABCDEFG': 8,
                'ABCDFG': 9,
            },
            validSegments = Object.keys(sevenSegs),
            wires = 'abcdefg'.toArray(),
            perms = 'ABCDEFG'.toArray().Permutations(),
            mapDigit = (d: string[], map: {[x: string]: any}) => d.map(wire => map[wire]).sort(Sorts.Alphabetical).join('')
            
        d.reduce((count, cur) => {
            const [signals, segments] = cur

            for (const perm of perms) {     //loop through all wire => segment mappings
                const map: {[key: string]: string} = perm.map((val, i) => [wires[i], val]).toObject()

                if(signals.every(digit => validSegments.includes(mapDigit(digit, map))))
                    return count + segments.map(digit =>    //count the output of those which can decode all signals into digits
                        sevenSegs[mapDigit(digit, map) as keyof typeof sevenSegs]).join('').toInt()
            }
            throw new Error('Could not find successful permutation')
        }, 0).Log()
    }

    static Day9() {
        const d = Array2D.fromArray(Data.map(d => d.toArray().toIntArray())),
            basins: XY[] = []

        d.forEach((tile, xy) => {
            if (tile != undefined && d.Neighbours(xy).Values().every(n => n > tile)) {
                basins.push(xy)
            }
        })

        basins.map(basin => {
            const b = new Set<string>().add(basin.toString())

            for (const bb of b) {
                d.Neighbours(XY.fromString(bb)).forEach((pos, height) => (height < 9).IsTrue(() => b.add(pos)))
            }

            return b.size
        }).sort(Sorts.GreatestFirst).slice(0, 3).Product().Log()
    }
}
const startTime = process.hrtime();
Advent2021.Day9();
const time = process.hrtime(startTime);
`Ran in ${time[0]}s ${time[1]/1_000_000}ms`.Log();