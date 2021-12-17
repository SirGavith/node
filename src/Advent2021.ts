import { watchFile } from 'fs'
import { LinkedList, LinkedNode } from './lib/LinkedList'
import { Stack } from './lib/Stack'
import { Array2D as Array2D, XY } from './lib/XY'
import { Sorts, Files, Range } from './main'

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
    static Day8() { 
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
                d.Neighbours(XY.fromString(bb)).forEach(t => (t[1] < 9).IsTrue(() => b.add(t[0].toString())))
            }

            return b.size
        }).sort(Sorts.GreatestFirst).slice(0, 3).Product().Log()
    }
    static Day10() {
        const invertBracket: {[b: string]: '>'|'}'|']'|')'} = {
            '(': ')',
            '[': ']',
            '{': '}',
            '<': '>'
        }
        Data.map(line => {
            var stack = new Stack<string>()

            for (const c of line.toArray()) {
                if (c.in('([{<')) {
                    stack.Push(c)
                } else if (stack.Count === 0 || invertBracket[stack.Pop()!] !== c) {
                    return undefined //corrputed
                }
            }
            return stack.Array.reverse()
                .reduce((a, c) =>
                a * 5 + {
                    ')': 1,
                    ']': 2,
                    '}': 3,
                    '>': 4
                }[invertBracket[c]], 0)
        }).RemoveUndefined().Log().Median().Log()
    }
    static Day11() {
        interface Octopus {
            energy: number
            flashed: boolean
        }
        const octstep = (octopus : [XY, Octopus]) => {
            const o = octopus[1]
            if (!o.flashed && o.energy > 9) {
                o.flashed = true

                s.Neighbours(octopus[0], true).forEach(oo => {
                    oo[1].energy++
                    octstep(oo)
                })
            }
        }

        let s = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())).map(e => ({energy: e!, flashed: false}))

        for (let i = 1; ; i++) {
            s.forEach(octopus => {
                octopus!.flashed = false
                octopus!.energy++
            })

            s.forEach((octopus, xy) => octstep([xy, octopus!]))

            if (s.Array.flat().every(o => o?.flashed)) {
                i.Log()
                return
            }

            s.forEach(octopus => {
                if(octopus!.flashed) {
                    octopus!.energy = 0
                }
            })
        }
    }
    static Day12() {
        let d = Data.map(l => l.split('-')),
            dFull = d.flatMap(l => [l, l.Copy().reverse()]),
            adjacents: {[node: string]: string[]} = d.flat().Uniques().Log().map(node => [node, dFull.filter(edge => edge[0]===node).map(e => e[1]).filter(e => e != 'start')]).toObject().Log()

        let paths = 0,
            step = (path: string[]) => {
                for (const cave of adjacents[path.at(-1)!]) {
                    if (cave === 'end') {
                        paths++
                        continue
                    }
                    else if (cave.charCodeAt(0) <= 90 ||
                        //lower case
                        !path.includes(cave) ||
                        //already been there once
                        path.filter(c => c.charCodeAt(0) >= 97).MaxFrequency() < 2) {

                        step(path.concat(cave))
                    }
                }
            }

        step(['start'])

        paths.Log()
    }
    static Day13() {
        const [ps, fs] = DataFull.split('\n\n').map(n => n.SplitLines()),
            pairs = ps.map(d => d.split(',').toIntArray() as [number, number]),
            folds = fs.map(f => f.split(' ').at(-1)!.split('=') as [string, string])

        let paper = new Array2D<boolean>(new XY(
            pairs.map(p => p[0]).Max() + 1,
            pairs.map(p => p[1]).Max() + 1))
        
        pairs.forEach(pair => paper.set(new XY(pair[0], pair[1]), true))

        for (const fold of folds) {
            const newPaper = new Array2D<boolean>(new XY(
                fold[0]==='x'?(paper.Size.X-1)/2 : paper.Size.X,
                fold[0]==='y'?(paper.Size.Y-1)/2 : paper.Size.Y))

            paper.forEach((dot, xy) => {
                const foldPos = fold[1].toInt()
                if (dot) {
                    newPaper.set(
                        fold[0] === 'x'
                            ? (xy.X > foldPos ? new XY(foldPos-(xy.X-foldPos), xy.Y) : xy)
                            : (xy.Y > foldPos ? new XY(xy.X, foldPos-(xy.Y-foldPos)) : xy),
                        dot)
                }
            })
            paper = newPaper
        }

        paper.Log()
    }
    static Day14() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            polymer = template[0].Log().toArray(),
            rules = r.map(rule => rule.split(' -> ')).toObject().Log() as {[key: string]: string},
            freqs: {[key: string]:number} = {}

        polymer.forEach(e => {
            if(freqs[e]) freqs[e]++
            else freqs[e] = 1
        })
        for (let i = 0; i < 20; i++) {
            polymer.reduceRight((_, char, i) => {
                if (i === polymer.length - 1) return 0

                const e = rules[char+polymer[i+1]]
                polymer.splice(i+1, 0, e)

                if(freqs[e]) freqs[e]++
                else freqs[e] = 1

                return 0
            }, 0)
            console.log(i, polymer.length)
        }

        const f = freqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day14_revised() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            poly = template[0].Log().toArray(),
            rules = r.map(rule => rule.split(' -> ')).toObject().Log() as {[key: string]: string},
            polymer = new LinkedList<string>(),
            freqs: {[key: string]:number} = {}


        poly.forEach(char => {
            polymer.Push(new LinkedNode(char))
        })

        poly.forEach(e => {
            if(freqs[e]) freqs[e]++
            else freqs[e] = 1
        })

        polymer.toString().Log()

        for (let i = 0; i < 40; i++) {
            let node = polymer.Head
            while (node?.Next) {
                const e = rules[node.Value + node.Next.Value]
                if (!e) throw new Error('could not find rule')
                node.InsertAfter(new LinkedNode(e))
                node = node.Next.Next

                if(freqs[e]) freqs[e]++
                else freqs[e] = 1
            }
            i.Log()
            freqs.Log()
        }

        const f = freqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day14_revised_revised() {
        const [template, r] = DataFull.split('\n\n').map(p => p.SplitLines()),
            rules = r.map(rule => rule.split(' -> ')).toObject() as {[key: string]: string},
            emptyFreqs = rules.Keys().map(v => [v, 0]),
            letterfreqs: {[key: string]: number} = {}

        let freqs: {[key: string]:number} = emptyFreqs.toObject()

        template[0].toArray().forEach((e, i, a) => {
            letterfreqs.IncrementOrCreate(e)
            if (i+1!==a.length)
                freqs.IncrementOrCreate(e+a[i+1])
        })

        const time = process.hrtime(startTime)
        console.log(`half in ${time[0]}s ${time[1]/1_000_000}ms`)

        for (let i = 0; i < 40; i++) {
            const newFreqs = emptyFreqs.toObject() as {[key: string]: number}
            for (const [pair, count] of freqs.Entries().filter(t => t[1] > 0)) {
                const e = rules[pair]
                newFreqs[pair.charAt(0)+e] += count
                newFreqs[e+pair.charAt(1)] += count

                letterfreqs.IncrementOrCreate(e, count)
            }
            freqs = newFreqs
        }

        const time2 = process.hrtime(startTime)
        console.log(`looped in ${time2[0]}s ${time2[1]/1_000_000}ms`)

        const f = letterfreqs.Values();
        (f.Max() - f.Min()).Log()
    }
    static Day15() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            lastE = d.Size.minus(1)
        let smallestPath = Number.MAX_VALUE,
            steps = 0
        const bestRoute = (xy: XY, score = 0) => {
            if (score > smallestPath) return
        
            if (xy.EQ(lastE)) {
                if (score < smallestPath) {
                    smallestPath = score
                    console.log('Smallest:', score)
                    steps++
                }
                return
            }

            const xp = xy.plus(1, 0),
                yp = xy.plus(0, 1),

                xVal = d.get(xp),
                yVal = d.get(yp)

            if (xVal && yVal) {
                if (xVal > yVal) {
                    bestRoute(yp, score + yVal)
                    bestRoute(xp, score + xVal)
                } 
                else {
                    bestRoute(xp, score + xVal)
                    bestRoute(yp, score + yVal)
                }
            }
            else {
                if (xVal) bestRoute(xp, score + xVal)
                if (yVal) bestRoute(yp, score + yVal)
            }            
        }


        d.Log()    
        bestRoute(new XY)
        console.log(steps, 'steps')   

    }
    static Day15_revised() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            bestScore: Array2D<number> = new Array2D(d.Size),
            lastE = d.Size.minus(1)

        let n = [lastE.minus(1, 0), lastE.minus(0, 1)]

        bestScore.set(lastE, d.get(lastE))

        // d.Log() 
        // bestScore.Log()

        main_loop: while (true) {
            const newN: XY[] = []
            for (const xy of n) {
                bestScore.set(xy, [
                    bestScore.get(xy.plus(1, 0)),
                    bestScore.get(xy.plus(0, 1))]
                        .RemoveUndefined().Min() + d.get(xy)!
                )
                const left = xy.minus(1, 0)
                if (left.X >= 0) newN.push(left)
                else if (xy.EQ(new XY)) break main_loop
            }
            const up = n.at(-1)!.minus(0, 1)
            if (up.Y >= 0) newN.push(up)

            n = newN
            bestScore.Log()
        }

        [bestScore.get(new XY(1, 0)),
        bestScore.get(new XY(0, 1))].Min()?.Log()
    }
    static Day15_revised_revised() {
        const d = Array2D.fromArray(Data.map(l => l.toArray().toIntArray())),
            bestScore: Array2D<number> = new Array2D(d.Size),
            lastE = d.Size.minus(1)

        bestScore.set(new XY, 0)

        d.Log()

        // for (let i = 1; ; i++) {
        //     for (let j = 0; j < i + 1; j++) {
        //         const xy = new XY(i - j, j),
        //             val = d.get(xy)!
        //         if (!val) continue

        //         const min = [
        //             bestScore.get(xy.minus(1, 0)),
        //             bestScore.get(xy.minus(0, 1)),
        //         ].RemoveUndefined().Min()

        //         bestScore.set(xy, val + min)
        //         if (xy.EQ(lastE)) {
        //             bestScore.Log()

        //             console.log(val + min)
        //             return
        //         }
        //     }
        //     bestScore.Log()
        // }
    }
    static Day15_revised_revised_revised() {

        interface Node {
            distance: number
            visited: boolean
            weight: number
        }

        const d = Array2D.fromArray(
            Data.map(l =>
                l.toArray().toIntArray().map(e =>
                    ({weight: e, visited: false, distance: Number.POSITIVE_INFINITY} as Node))))
            
        
        const dd = new Array2D<Node>(d.Size.times(5)),
            lastE = dd.Size.minus(1)

        d.forEach((val, xy) => {
            if (!val) return

            for (let i = 0; ; i++) {

                for (let j = 0; j < i + 1; j++) {
                    const newxy = new XY(i - j, j)
                    
                    if (newxy.IsLessBoth(new XY(5))) {
                        dd.set(newxy.times(d.Size).plus(xy), val.Copy() as Node)
                        if (newxy.EQ(new XY(4))) return
                    }
                }
                // dd.map(val => val?.weight).Log()

                val.weight++
                if (val.weight % 10 === 0)
                    val.weight = 1

            }
        })

        dd.map(val => val?.weight).Log()

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(new XY)!.distance = 0
        
        let currentNode = new XY
        for (let i = 0; ; i++) {
            if (currentNode.EQ(lastE)) {
                dd.get(currentNode)!.distance.Log()
                break
            }

            const node = dd.get(currentNode)!;

            [currentNode.plus( 1, 0),
            currentNode.plus(-1,  0),
            currentNode.plus( 0,  1),
            currentNode.plus( 0, -1)]
                .forEach(neighbour => {
                    const n = dd.get(neighbour)
                    if (n && !n.visited) {
                        n.distance = [n.distance, node.distance + n.weight].Min()
                    }
                })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currentNode)), 1)
            
            currentNode = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, {distance: Number.MAX_VALUE}] as [XY, Node])[0]


            dd.map(e => e?.distance).Log()
            if (unvistied.length % 100 === 0)
                unvistied.length.Log()
        }
    }
    static Day16() {
        const line = Data[0].toArray().map(char => char.toInt(16).toString(2).padStart(4, '0')).join('')

        class Packet {
            Version: number
            TypeId: number
            LiteralValue?: number
            SubPackets: Packet[] = []

            private Position: number

            constructor(bits: string, position = 0) {
                this.Version = bits.slice(position, position + 3).toInt(2)
                this.TypeId = bits.slice(position + 3, position + 6).toInt(2)
                this.Position = position + 6

                if (this.TypeId === 4) {
                    //literal
                    const values = []
                    do {
                        values.push(bits.slice(this.Position, this.Position += 5))
                    } while (values.at(-1)!.charAt(0) === '1')

                    this.LiteralValue = values.map(v => v.slice(1)).join('').toInt(2)
                }
                else {
                    //operator
                    const lenType = bits.charAt(this.Position++).toInt(),
                        lenTypeSize = lenType === 0 ? 15 : 11,
                        subPacketSize = bits.slice(this.Position, this.Position += lenTypeSize).toInt(2)

                    let p: Packet | undefined
                    do {
                        p = new Packet(bits, p?.Position ?? this.Position)
                        this.SubPackets.push(p)
                    } while ((lenType === 0 ? p.Position - this.Position : this.SubPackets.length) < subPacketSize)

                    this.Position = p.Position
                }
            }

            SumVersions: () => number = () => this.Version + this.SubPackets?.reduce((a, v) => a + v.SumVersions(), 0) ?? 0

            Operate(): number {
                if (this.LiteralValue) return this.LiteralValue

                const children = this.SubPackets!.map(p => p.Operate())

                switch (this.TypeId) {
                    case 0: //sum
                        return children.Sum()
                    case 1: //product
                        return children.Product()
                    case 2: //minimum
                        return children.Min()
                    case 3: //maximum
                        return children.Max()
                    case 5: //greaterThan
                        return children[0] > children[1] ? 1 : 0
                    case 6: //lessThan
                        return children[0] < children[1] ? 1 : 0
                    case 7: //equalTo
                        return children[0] === children[1] ? 1 : 0
                    default:
                        throw new Error('Bad TypeId ' + this.TypeId)
                }
            }
        }

        const packets = new Packet(line)
        packets.Log()
        packets.Operate().Log()
        packets.SumVersions().Log()
    }
}
const startTime = process.hrtime()
Advent2021.Day16()
const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1]/1_000_000}ms`)