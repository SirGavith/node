const UseExample = false
import { BigMap } from './Glib/BigMap'
import { LinkedList, LinkedNode } from './Glib/LinkedList'
import { Stack } from './Glib/Stack'
import { Array2D as Array2D, XY } from './Glib/XY'
import { Array3D, XYZ } from './Glib/XYZ'
import { Filer } from './Glib/Filer'
import { Sorts } from './Glib/Sort'
import * as GArray from './Glib/Array'
import * as Console from './Glib/Console'

const Data = Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt')

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
