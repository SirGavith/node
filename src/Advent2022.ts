const UseExample = false
import { Stack } from './Glib/Stack'
import { Array2D, XY } from './Glib/XY'
import { Filer } from './Glib/Filer'
import { Sorts } from './Glib/Sort'
import * as GArray from './Glib/Array'
import * as Console from './Glib/Console'
import { BigSet } from './Glib/BigSet'

const Data = Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt')

export function Day15() {
    const sensors = Data.map(l => {
        const a = l.RemoveChars([',', ':']).split(' ').map(w => w.slice(2))
        return [new XY(a[2].toInt(), a[3].toInt()),
                new XY(a[8].toInt(), a[9].toInt())] as [XY, XY]
    }).Log()

    const rowY = 3249595

    const squares: BigSet<number> = new BigSet

    sensors.forEach(([s, b], i) => {
        const dist = s.minus(b).TaxicabNorm
        const dy = Math.abs(s.Y - rowY)
        const xHorizon = dist - dy
        if (xHorizon < 0) return
        const range = GArray.Range(s.X - xHorizon, s.X + xHorizon + 1)
        console.log(i.toString().padStart(4),
            'Dist', dist, '\tOverlap:', range.length, '\tFrom:', s.X - xHorizon, '\tTo', s.X + xHorizon + 1)
        range.forEach(x => squares.add(x))
    })

    sensors.forEach(([_, b]) => {
        if (b.Y === rowY) {
            squares.delete(b.X)
        }
    })

    for (let i = 0; i < 4000000; i++) {
        if (!squares.has(i)) {
            i.Log()
            throw new Error()
        }
    }

    // squares.Log()
    squares.size.Log() 
}
export function Day15_2() {

    // example:
    const maxRange = 4000000

    const sensors = Data.map(l => {
        const a = l.RemoveChars([',', ':']).split(' ').map(w => w.slice(2))
        const s = new XY(a[2].toInt(), a[3].toInt())
        const b = new XY(a[8].toInt(), a[9].toInt())

        return [s, s.minus(b).TaxicabNorm] as [XY, number]
    }).Log()

 
    for (let row = 0; row < maxRange; row++) {

        const ranges = sensors.map(([s, dist], i) => {

            const xHorizon = dist - Math.abs(s.Y - row)

            if (xHorizon < 0) return undefined
            return [s.X - xHorizon, s.X + xHorizon] as [number, number]
        }).RemoveUndefined()


        ranges.sort(([a, _], [b, __]) => a - b)

        if (ranges[0][0] > 0) throw new Error()

        const r = ranges.reduce(([a, aa], [b, bb]) => {
            if (aa + 1 >= b) {
                return [a, aa > bb ? aa : bb]
            }
            throw new Error()
        })

        if (r[1] < maxRange) throw new Error()


        if (row % 10000 === 0) row.Log()

    }
}

export function Day14() {
    const lines = Data.map(l => l.split(' -> ')
        .map(xy => new XY(...xy.split(',').toIntArray() as [number, number])))

    const max = lines.flat().reduce((max, xy) => new XY(xy.X > max.X ? xy.X : max.X, xy.Y > max.Y ? xy.Y : max.Y), new XY)
    const min = lines.flat().reduce((min, xy) => new XY(xy.X < min.X ? xy.X : min.X, xy.Y < min.Y ? xy.Y : min.Y), new XY(Number.POSITIVE_INFINITY))
    // const shift = new XY(-min.X, 0)
    const sandPos = new XY(500, 0)

    const arr = new Array2D<boolean>(max.plus(500, 3))
    // rock
    lines.forEach(l => {
        l.reduce((p, c) => {
            if (p.X > c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i <= p.X; i++)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.X < c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i >= p.X; i--)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.Y > c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i <= p.Y; i++)
                    arr.set(new XY(c.X, i), true)
            }
            else if (p.Y < c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i >= p.Y; i--)
                    arr.set(new XY(c.X, i), true)
            }

            return c
        })
    })

    // sand   
    let i = 0 
    let b = true
    while (true) {
        const pos = sandPos.Copy()
        while (true) {
            if (arr.get(pos.plus(0, 1)) === undefined) {
                pos.plusEQ(0, 1)
            }
            else if (arr.get(pos.plus(-1, 1)) === undefined) {
                pos.plusEQ(-1, 1)
            }
            else if (arr.get(pos.plus(1, 1)) === undefined) {
                pos.plusEQ(1, 1)
            }
            else {
                break
            }
            if (pos.IsGreaterEQEither(arr.Size)) {
                b = false
                break
            }
        }
        if (!b) break
        arr.set(pos, false)
        i++
    }


    arr.Log()
    i.Log()
}
export function Day14_2() {
    const lines = Data.map(l => l.split(' -> ')
        .map(xy => new XY(...xy.split(',').toIntArray() as [number, number])))

    const max = lines.flat().reduce((max, xy) => new XY(xy.X > max.X ? xy.X : max.X, xy.Y > max.Y ? xy.Y : max.Y), new XY)
    const min = lines.flat().reduce((min, xy) => new XY(xy.X < min.X ? xy.X : min.X, xy.Y < min.Y ? xy.Y : min.Y), new XY(Number.POSITIVE_INFINITY))
    // const shift = new XY(-min.X, 0)
    const sandPos = new XY(500, 0)

    const arr = new Array2D<boolean>(max.plus(500, 3))
    // rock
    lines.forEach(l => {
        l.reduce((p, c) => {
            if (p.X > c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i <= p.X; i++)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.X < c.X) {
                if (p.Y !== c.Y) throw new Error()
                for (let i = c.X; i >= p.X; i--)
                    arr.set(new XY(i, c.Y), true)
            }
            else if (p.Y > c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i <= p.Y; i++)
                    arr.set(new XY(c.X, i), true)
            }
            else if (p.Y < c.Y) {
                if (p.X !== c.X) throw new Error()
                for (let i = c.Y; i >= p.Y; i--)
                    arr.set(new XY(c.X, i), true)
            }

            return c
        })
    })

    arr.Array.at(-1)?.fill(true)

    // sand   
    let i = 0
    while (true) {
        const pos = sandPos.Copy()
        while (true) {
            if (arr.get(pos.plus(0, 1)) === undefined) {
                pos.plusEQ(0, 1)
            }
            else if (arr.get(pos.plus(-1, 1)) === undefined) {
                pos.plusEQ(-1, 1)
            }
            else if (arr.get(pos.plus(1, 1)) === undefined) {
                pos.plusEQ(1, 1)
            }
            else {
                break
            }
        }
        arr.set(pos, false)
        i++
        if (pos.EQ(sandPos)) break
    }


    arr.Log()
    i.Log()
}

export function Day13() {
    type List = (number | List)[]

    function parseList(l: string): List {
        const list: List = []

        if (!l.startsWith('[') && l.endsWith(']')) 
            throw new Error('bad list')
        let start = 1
        let depth = 0
        for (let i = 0; i < l.length; i++) {
            const char = l.charAt(i)
            if (depth === 1 && (char === ',' || char === ']')) {
                //delim

                if (start !== i) {
                    const e = l.slice(start, i)

                    const intE = parseInt(e)
                    if (!isNaN(intE)) {
                        list.push(e.toInt())
                    }
                    else {
                        //NaN
                        list.push(parseList(e))
                    }
                }


                start = i + 1
            }
            else if (char === '[') depth++
            else if (char === ']') depth--
        }

        return list
    }
    function compare(left: List, right: List): boolean | undefined {
        for (let i = 0; i < left.length && i < right.length; i++) {
            let lVal = left[i]
            let rVal = right[i]

            if (typeof lVal === 'number' && typeof rVal === 'number') {
                //lower int comes first
                if (lVal < rVal) return true
                else if (rVal < lVal) return false
                else continue
            }
            if (typeof lVal === 'number') {
                lVal = [lVal] as List
            }
            if (typeof rVal === 'number') {
                rVal = [rVal] as List
            }
            //both arrs
            const comp = compare(lVal, rVal)
            if (comp !== undefined) return comp
            else continue
        }
        //ran out of items
        if (left.length < right.length)
            return true // correct order
        else if (right.length < left.length)
            return false // wrong order
        return undefined // no determination

    }

    parseList(Data[3])

    DataFull.Split2Lines().map(lines => {
        const [pleft, pright] = lines.SplitLines().map(l => parseList(l))

        return compare(pleft, pright)
    }).Log().reduce((sum, a, i) => sum + (a ? i + 1 : 0), 0).Log()
}
export function Day13_2() {
    type List = (number | List)[]

    function parseList(l: string): List {
        const list: List = []
        let start = 1
        let depth = 0
        for (let i = 0; i < l.length; i++) {
            const char = l.charAt(i)
            
            if (depth === 1 && (char === ',' || char === ']')) {
                //delim

                if (start !== i) {
                    const e = l.slice(start, i)

                    const intE = parseInt(e)
                    if (!isNaN(intE)) {
                        list.push(e.toInt())
                    }
                    else {//NaN
                        list.push(parseList(e))
                    }
                }
                start = i + 1
            }
            else if (char === '[') depth++
            else if (char === ']') depth--
        }
        return list
    }
    function compare(left: List, right: List): boolean | undefined {
        for (let i = 0; i < left.length && i < right.length; i++) {
            let lVal = left[i]
            let rVal = right[i]

            if (typeof lVal === 'number' && typeof rVal === 'number') {
                //lower int comes first
                if (lVal < rVal) return true
                else if (rVal < lVal) return false
                else continue
            }
            if (typeof lVal === 'number') {
                lVal = [lVal] as List
            }
            if (typeof rVal === 'number') {
                rVal = [rVal] as List
            }
            //both arrs
            const comp = compare(lVal, rVal)
            if (comp !== undefined) return comp
            else continue
        }
        //ran out of items
        if (left.length < right.length)
            return true // correct order
        else if (right.length < left.length)
            return false // wrong order
        return undefined // no determination

    }


    const packets = Data.filter(l => l !== '').map((l, i) => [parseList(l), i] as [List, number])

    packets.sort((a, b) => {
        const comp = compare(a[0], b[0])
        if (comp === undefined) return 0
        if (comp === false) return 1
        return -1
    })

    packets.map(p => p[0]).Log();

    const a = packets.findIndex(e => e[1] === 0) + 1,
          b = packets.findIndex(e => e[1] === 1) + 1

    console.log(a, b, a * b)


}

export function Day12() {
    interface Square {
        height: number
        neighbors: XY[]
    }
    
    let start: XY = new XY,
        end: XY = new XY

    let d = Array2D.fromArray(Data.map(l => l.toArray()))
        .map((h, xy) => {
            if (h === 'S') {
                start = xy;
                return 'a'
            }
            else if (h === 'E') {
                end = xy
                return 'z'
            }
            return h
        }).map(e =>
                ({ height: e!.charCodeAt(0) - ('a').charCodeAt(0) } as Square))

    d.forEach((node, xy) => {
        node!.neighbors = xy.Neighbours(false).filter(nxy => d.get(nxy) && d.get(nxy)!.height <= node!.height + 1 )
    })

    d.map(h => h?.height).Log()

    const pathlen = (s: XY) => {
        // Dijkstra's Algorithm

        interface Node {
            square: Square
            distance: number
            visited: boolean
        }

        const dd = new Array2D<Node>(d.Size).map((_, xy) => ({
            square: d.get(xy)!,
            distance: Number.POSITIVE_INFINITY,
            visited: false
        }))

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(s)!.distance = 0
        let currXY: XY = s

        for (let i = 0; ; i++) {
            if (currXY.EQ(end)) break

            const node = dd.get(currXY)!;

            node.square.neighbors.forEach(neighbour => {
                const n = dd.get(neighbour)
                if (n && !n.visited) {
                    n.distance = [n.distance, node.distance + 1].Min()
                }
            })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currXY)), 1)

            currXY = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, { distance: Number.MAX_VALUE }] as [XY, Node])[0]
        }

        return dd.get(currXY)!.distance
    }

    pathlen(start).Log()
}
export function Day12_2() {
    interface Square {
        height: number
        neighbors: XY[]
    }
    let end: XY = new XY

    let d = Array2D.fromArray(Data.map(l => l.toArray()))
        .map((h, xy) => {
            if (h === 'S') return 'a'
            else if (h === 'E') {
                end = xy
                return 'z'
            }
            return h
        }).map(e =>
            ({ height: e!.charCodeAt(0) - ('a').charCodeAt(0) } as Square))

    d.forEach((node, xy) => {
        node!.neighbors = xy.Neighbours(false).filter(nxy => d.get(nxy) && d.get(nxy)!.height >= node!.height - 1)
    })

    d.map(h => h?.height).Log()


    // const starts = d.Entries().filter(s => s[1].height === 0).map(s => s[0])


    const pathlen = (s: XY) => {
        // Dijkstra's Algorithm backwards

        interface Node {
            square: Square
            distance: number
            visited: boolean
        }

        const dd = new Array2D<Node>(d.Size).map((_, xy) => ({
            square: d.get(xy)!,
            distance: Number.POSITIVE_INFINITY,
            visited: false
        }))

        const unvistied = dd.Entries().filter(n => !n[1].visited)
        dd.get(s)!.distance = 0
        let currXY: XY = s

        for (let i = 0; ; i++) {
            const node = dd.get(currXY)!;

            if (node.square.height === 0) break

            node.square.neighbors.forEach(neighbour => {
                const n = dd.get(neighbour)
                if (n && !n.visited) {
                    n.distance = [n.distance, node.distance + 1].Min()
                }
            })
            node.visited = true
            unvistied.splice(unvistied.findIndex(val => val[0].EQ(currXY)), 1)

            currXY = unvistied.reduce((least, val) => {
                if (val[1].distance < least[1].distance) least = val
                return least
            }, [new XY, { distance: Number.MAX_VALUE }] as [XY, Node])[0]
        }

        return dd.get(currXY)!.distance
    }

    pathlen(end).Log()
}

export function Day11() {

    class Monkey {
        Items: number[] = []
        private Operator: '*' | '+'
        private Operand: number
        Test: number
        IfTrue: number
        IfFalse: number

        Inspected = 0

        Operation() {
            this.Inspected++
            if (this.Operator === '+')
                this.Items[0] += this.Operand
            else if (this.Operator === '*')
                this.Items[0] *= this.Operand
            else 
                this.Items[0] **= this.Operand
        }

        Bore() {
            this.Items[0] = (this.Items[0] / 3).Floor()
        }

        TestItem() {
            const Item = this.Items[0]
            if (Item % this.Test === 0) {
                monkeys[this.IfTrue].Items.push(this.Items.shift()!)
            }
            else {
                monkeys[this.IfFalse].Items.push(this.Items.shift()!)
            }
        }

        constructor(i: string, op: string, te: string, t: string, f: string) {
            this.Items = i.slice(16).split(', ').toIntArray()
            const o = op.slice(21).replace('* old', '^ 2').split(' ')
            this.Operator = o[0] as typeof this.Operator
            this.Operand = o[1].toInt()
            this.Test = te.slice(19)!.toInt()
            this.IfTrue = t.at(-1)!.toInt()
            this.IfFalse = f.at(-1)!.toInt()
        }
    }

    const monkeys = DataFull.Split2Lines().map(m => 
        new Monkey (...m.SplitLines().map(l => l.trim()).slice(1) as [string, string, string, string, string])
    )


    GArray.Range(0, 20).forEach(I =>
        monkeys.forEach(m => {
            while (m.Items.length > 0) {
                m.Operation()
                m.Bore()
                m.TestItem()
            }
        })
    )


    monkeys.map(m => m.Inspected).sort(Sorts.GreatestFirst).slice(0, 2).Product().Log()
}
export function Day11_2() {

    class Monkey {
        Items: number[] = []
        private Operator: '*' | '+' | '^'
        private Operand: number
        Test: number
        IfTrue: number
        IfFalse: number

        Inspected = 0

        Operation(prod: number) {
            this.Inspected++
            if (this.Operator === '+')
                this.Items[0] += this.Operand
            else if (this.Operator === '*')
                this.Items[0] *= this.Operand
            else
                this.Items[0] **= this.Operand

            this.Items[0] %= prod
        }

        TestItem() {
            const Item = this.Items[0]
            if (Item % this.Test === 0) {
                monkeys[this.IfTrue].Items.push(this.Items.shift()!)
            }
            else {
                monkeys[this.IfFalse].Items.push(this.Items.shift()!)
            }
        }

        constructor(i: string, op: string, te: string, t: string, f: string) {
            this.Items = i.slice(16).split(', ').toIntArray()
            const o = op.slice(21).replace('* old', '^ 2').split(' ')
            this.Operator = o[0] as typeof this.Operator
            this.Operand = o[1].toInt()
            this.Test = te.slice(19)!.toInt()
            this.IfTrue = t.at(-1)!.toInt()
            this.IfFalse = f.at(-1)!.toInt()
        }
    }

    const monkeys = DataFull.Split2Lines().map(m =>
        new Monkey(...m.SplitLines().map(l => l.trim()).slice(1) as [string, string, string, string, string])
    )

    const prod = monkeys.map(m => m.Test).Product()


    GArray.Range(0, 10_000).forEach(I =>
        monkeys.forEach((m, i) => {
            while (m.Items.length > 0) {
                m.Operation(prod)
                m.TestItem()
            }
        })
    )
    
    monkeys.map(m => m.Inspected).Log()
    monkeys.map(m => m.Inspected).sort(Sorts.GreatestFirst).slice(0, 2).Product().Log()
}

export function Day10() {
    let X = 1
    let cycle = 0
    let strengths = 0

    const Cycle = () => {
        cycle++
        if (cycle % 40 === 20) {
            strengths += cycle * X
            console.log(cycle, X)
        }
    }

    Data.forEach(instruction => {
        const i = instruction.split(' ')
        Cycle()
        if (i[0] === 'addx') {
            Cycle()
            X += i[1].toInt()
        }
    })

    strengths.Log()
}
export function Day10_2() {
    let X = 1
    let cycle = 0
    const screen: string[] = [] // 240

    const Cycle = () => {
        screen[cycle] = (X - (cycle % 40)).InRangeEq(-1, 1) ? '#' : '.'
        cycle++
    }

    Data.forEach(instruction => {
        const i = instruction.split(' ')
        Cycle()
        if (i[0] === 'addx') {
            Cycle()
            X += i[1].toInt()
        }
    })

    GArray.Range(0, 6).map(i => {
        screen.slice(i * 40, (i + 1) * 40).join('').Log()
    })
}

export function Day9() {

    let head = new XY,
        tail = new XY,
        tailPath = [new XY]

    const getPos = (follower: XY, leader: XY): XY => {
        const n = leader.Neighbourhood(true)
        if (!n.some(e => e.EQ(follower))) {

            //move tail
            const diff = follower.minus(leader)

            const d = diff.div(2)

            if (d.X < 0.9 && d.X > -0.9) d.X = 0
            if (d.Y < 0.9 && d.Y > -0.9) d.Y = 0

            return leader.plus(d)
        }
        return follower
    }

    Data.flatMap(l => GArray.Range(0, l.split(' ')[1].toInt()).map(_ => new XY(
        (l.startsWith('R') ? 1 : l.startsWith('L') ? -1 : 0),
        (l.startsWith('U') ? 1 : l.startsWith('D') ? -1 : 0))))
    .forEach((motion, i, a) => {

        // if (i % 50 === 0) {
        //     const arr = new Array2D(new XY(250))
        //     tailPath.forEach(xy => arr.set(xy.plus(15), '#'))
        //     arr.set(tail.plus(15), 'T')
        //     arr.set(head.plus(15), 'H')
        //     Array2D.fromArray(arr.Array.Reverse()).Log()

        //     console.log('Path: ', tailPath.length, 'Progress: ', (i / a.length * 100) + '%')
        // }

        head.plusEQ(motion)

        tail = getPos(tail, head)

        if(tailPath.every(p => !p.EQ(tail)))
            tailPath.push(tail.Copy())
        
        console.log(i, head.toString(), tail.toString())

    })

    console.log(head.toString(), tail.toString())

    tailPath.length.Log()


    // const arr = new Array2D(new XY(250))
    // arr.set(new XY(15), 's')
    // tailPath.forEach(xy => arr.set(xy.plus(15), '#'))
    // Array2D.fromArray(arr.Array.Reverse()).Log()
   
}
export function Day9_2() {

    let snake = GArray.Range(0, 10).map(_ => new XY),
        tailPath = [new XY]

    const getPos = (follower: XY, leader: XY): XY => {
        return (!leader.Neighbourhood(true).some(e => e.EQ(follower))) ?
            leader.plus(follower.minus(leader).div(2).Trunc()) :
            follower
    }

    Data.flatMap(l => GArray.Range(0, l.split(' ')[1].toInt()).map(_ => new XY(
        (l.startsWith('R') ? 1 : l.startsWith('L') ? -1 : 0),
        (l.startsWith('U') ? 1 : l.startsWith('D') ? -1 : 0))))
        .forEach((motion, i) => {
            snake[0].plusEQ(motion)

            snake.slice(1).reduce((leader, follower, ii) => {
                snake[ii + 1] = getPos(follower, leader)
                return snake[ii + 1]
            }, snake[0])

            if (tailPath.every(p => !p.EQ(snake.at(-1)!)))
                tailPath.push(snake.at(-1)!.Copy())

            console.log(i.toString().padEnd(4).AsColor(Console.Yellow), snake.map(r => r.toString()).join('\t'))
        })

    tailPath.length.Log()
}

export function Day8() {
    Array2D.fromArray(Data.map(l => l.toArray().toIntArray())).Log().map((tree, xy, a) => {
        if (tree === undefined) throw new Error()
        //check 
        const col = a.getCol(xy.X)
        const row = a.getRow(xy.Y)

        const n = col.slice(0, xy.Y),
            w = row.slice(0, xy.X),
            s = col.slice(xy.Y + 1),
            e = row.slice(xy.X + 1);

        return ([n, w, s, e]).some(dir => dir.every(t => t! < tree))
        
    }).Log().Flatten().Count().Log()
}   
export function Day8_2() {
    Array2D.fromArray(Data.map(l => l.toArray().toIntArray()))
    .map((tree, xy, a) =>
        [
            a.getCol(xy.X).slice(0, xy.Y).Reverse(), // n
            a.getRow(xy.Y).slice(0, xy.X).Reverse(), // w
            a.getCol(xy.X).slice(xy.Y + 1),          // s
            a.getRow(xy.Y).slice(xy.X + 1)           // e
        ].map(dir => 
            dir.Reduce((s, t) => [s! + 1, t! >= tree!], 0)
        ).Product()
    ).Flatten().Max().Log()
}

export function Day7() {
    class Directory {
        constructor(public Name: string, public Parent: null | Directory = null) {}
        Children: Array<Directory | File> = []

        GetSize(): number {
            return this.Children.map(c => c.GetSize()).Sum()
        }
    }
    class File {
        public Size: number
        constructor (size: string, public Name: string) {
            this.Size = size.toInt()
        }
        GetSize() { return this.Size }
    }

    const system = new Directory('/')

    const stack = Data.reduce((path, l) => {
        if (l.startsWith('$')) {
            l = l.slice(2)
            if (l.startsWith('cd')) {
                l = l.slice(3)
                if (l.startsWith('..')) {
                    path.Pop()
                }
                else {
                    // cd into dir
                    const child = path.Peek()!.Children.find(c => c.Name === l) as Directory | undefined
                    if (!child) throw new Error('could not find dir of name ' + l)
                    path.Push(child)

                }
            }
        }
        else {
            if (l.startsWith('dir')) {
                l = l.slice(4)
                path.Peek()!.Children.push(new Directory(l, path.Peek()!))
            }
            else {
                // file
                path.Peek()!.Children.push(new File(...l.split(' ') as [string, string]))
            }
        }
        return path
    }, new Stack<Directory>([system])).Log()

    system.Log()

    const reqSize = system.GetSize().Log() - 40_000_000

    const n: number[] = []
    
    function func(d: Directory) {
        d.Children.forEach(c => {
            if ((c as Directory).Children) {
                const s = c.GetSize()
                if (s >= reqSize) {
                    n.push(s)
                }
                func(c as Directory)
            }
        })
    }
    func(system)

    n.Min().Log()
}
export function Day7_2() {
    class Directory {
        Children: Directory[] = []
        Parent: Directory | null

        constructor(public Name: string, Parent: null | Directory) {
            this.Parent = Parent
        }

        protected Size?: number
        GetSize(): number | undefined {
            return this.Children.flatMap(c => c.Size ?? c.GetSize()).UndefinedIfEmpty()?.Sum() 
        }

        GetMin = (min?: number) => min ?? ((this.GetSize() ?? Number.MAX_VALUE) - 40_000_000)

        Part1(): number {
            return this.Children.flatMap(c => 
                (c.GetSize() && c.GetSize()! <= 100_000) ? c.GetSize()! : 0
            ).concat(
                this.Children.flatMap(c => c.Part1())
            ).UndefinedIfEmpty()?.Sum() ?? 0
        }

        Part2(min?: number): number | undefined {
            return this.Children.flatMap(c =>
                (c.GetSize() && (c.GetSize()! >= this.GetMin(min))) ? c.GetSize() : []
            ).concat(
                this.Children.flatMap(c => c.Part2(this.GetMin(min)) ?? [])
            ).UndefinedIfEmpty()?.Min() 
        }
    }
    class File extends Directory {
        constructor(Size: string, Name: string) {
            super(Name, null)
            this.Size = Size.toInt()
        }
    }

    Data.reduce(([system, path], l) => {
        if (l.startsWith('$ cd')) {
            if (l.includes('..'))
                path.Pop()
            else // cd into dir
                path.Push(l.slice(5) === '/' ? system : path.Peek()!.Children.find(c => c.Name === l.slice(5))!)
        }
        else if (!l.startsWith('$ ls')) { // part of an ls
            path.Peek()!.Children.push(l.startsWith('dir') ? 
                new Directory(l.slice(4), path.Peek()!) :      // dir
                new File(...l.split(' ') as [string, string]))  // file
        }
        return [system, path] as [Directory, Stack<Directory>]
    }, [new Directory('/', null), new Stack<Directory>()] as [Directory, Stack<Directory>])[0]
    .Part1()?.Log()
}

export function Day6() {
    (Data[0].toArray().findIndex((_, i, a) => 
        a.slice(i, i + 4).Uniques().length == 4
    ) + 4).Log()
}
export function Day6_2() {
    (Data[0].toArray().findIndex((_, i, a) =>
        a.slice(i, i + 14).Uniques().length == 14
    ) + 14).Log()
}

export function Day5() {
    const [t, m] = DataFull.Split2Lines().map(a => a.SplitLines())
    const count = ((t.at(-1)!.length + 1) / 4).Log()
    const towers: Stack<string>[] = GArray.Range(0, count).map(_ => new Stack)
    const l = t.slice(0, -1)
    l.reverse()
    l.Log()
    l.forEach(line => {
        GArray.Range(0, count).forEach(i => {
            const char = line.charAt(i * 4 + 1)
            if (char !== ' ') towers[i].Push(char)
        })
    })
    const moves = m.map(m => {
        const a = m.split(' ')
        return [a[1], a[3], a[5]].toIntArray()
    })


    //towers & moves

    towers.Log()
    moves.Log()


    moves.forEach(m => {
        const [count, from, to] = m;
        GArray.Range(1, count + 1).forEach(_ => {
            towers[to - 1].Push(towers[from - 1].Pop()!)
        })
    })

    towers.map(t => t.Peek()).join('').Log()
}
export function Day5_2() {
    const [t, m] = DataFull.Split2Lines().map(a => a.SplitLines())
    const count = ((t.at(-1)!.length + 1) / 4)
    const towers: Stack<string>[] = GArray.Range(0, count).map(_ => new Stack)
    t.slice(0, -1).Reverse().forEach(line => {
        GArray.Range(0, count).forEach(i => {
            const char = line.charAt(i * 4 + 1)
            if (char !== ' ') towers[i].Push(char)
        })
    })

    m.map(m => {
        const a = m.split(' ')
        return [a[1], a[3], a[5]].toIntArray()
    }).forEach(m => {
        const [count, from, to] = m;

        GArray.Range(1, count + 1).map(_ =>
            towers[from - 1].Pop()!
        ).Reverse().forEach(t => {
            towers[to - 1].Push(t)
        })
    })

    towers.map(t => t.Peek()).join('').Log()
}

export function Day4() {
    Data.map(l => {
        const [d1, d2] = l.split(',').map(r => GArray.Range(...r.split('-').toIntArray() as [number, number])) as [number[], number[]]

        return d1.every(n => d2.includes(n)) || d2.every(n => d1.includes(n)) ? 1 : 0
    }).Sum().Log()
}
export function Day4_2() {
    Data.Count(l => {
        const [d1, d2] = l.split(',').map(r => GArray.Range(...r.split('-').toIntArray() as [number, number])) as [number[], number[]]

        return d1.Intersect(d2).length > 0

        // return d1.some(n => d2.includes(n)) || d2.some(n => d1.includes(n))
    }).Log()
}

export function Day3() {
    Data.map(sack => {
        const s = sack.toArray()
        const c1 = s.slice(0,s.length / 2),
            c2 = s.slice(s.length / 2)
        // c1.Log()
        // c2.Log()

        const code = c1.filter(c => c2.includes(c))[0].charCodeAt(0)
        return code - (code > 90 ? 96 : 38)

    }).Log().Sum().Log()
}
export function Day3_2() {
    const out: string[] = []
    for (let i = 0; i < Data.length; i += 3) {
        const arr = [Data[i].toArray(), Data[i + 1].toArray(), Data[i + 2].toArray()]

        // out.push(arr[0].filter(c => arr[1].includes(c)).filter(c => arr[2].includes(c))[0])

        out.push(arr[0].Intersect(arr[1]).Intersect(arr[2])[0])

    }

    out.Log()

    out.map(char => {
        const code = char.charCodeAt(0)
        return code - (code > 90 ? 96 : 38)
    }).Sum().Log()
}

export function Day2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors

            'X': '0', // rock
            'Y': '1', // paper
            'Z': '2'  // scissors
        }).split(' ').toIntArray().Log()
        let score = p[1] + 1

        if (p[0] === p[1]) return score + 3

        if ((p[0] + 1) % 3 === p[1]) return score + 6
        
        return score;
    }).Log().Sum().Log()
}
export function Day2_2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors
        }).split(' ').Log()
        let score = p[0].toInt().Log()

        if (p[1] === 'X') {
            //lose
            return 1 + ((score + 2) % 3)
        } else if (p[1] === 'Y') {
            //draw
            return 1 + score + 3
        } else {
            //win
            return 1 + ((score + 1) % 3) + 6
        }


    }).Log().Sum().Log()
}

export function Day1() {
    let max = 0
    let e: number | undefined = undefined;
    DataFull.split('\n\n').forEach((v,i) => {
        const sum = v.toIntList().Sum()
        if (sum > max) {
            max = sum
            e = i
        }
    })
    console.log(e)
    max.Log()
}
export function Day1_2() {
    DataFull.Split2Lines().map(v =>
        v.toIntList().Sum())
    .Sort(Sorts.GreatestFirst)
    .slice(0,3).Sum().Log()
}
