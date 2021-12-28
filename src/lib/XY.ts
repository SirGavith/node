type nXY = number | XY
export class XY {
    X: number
    Y: number

    constructor()
    constructor(size: number)
    constructor(X: number, Y: number)

    constructor(X?: number, Y?: number) {
        this.X = X ?? 0
        this.Y = Y ?? this.X
    }

    private static parseInput(n: nXY, n2?: number): XY {
        return typeof n === "number" ? new XY(n, n2 ?? n) : n
    }

    private set(xy: XY) {
        ({X: this.X, Y: this.Y} = xy)
    }

    plus(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X + xy.X, this.Y + xy.Y)
    }
    plusEQ(n: nXY, n2?: number) { return this.set(this.plus(n, n2)) }

    minus(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X - xy.X, this.Y - xy.Y)
    }
    minusEQ(n: nXY, n2?: number) { return this.set(this.minus(n, n2)) }
    times(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X * xy.X, this.Y * xy.Y)
    }
    timesEQ(n: nXY, n2?: number) { return this.set(this.times(n, n2)) }
    div(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X / xy.X, this.Y / xy.Y)
    }
    divEQ(n: nXY, n2?: number) { return this.set(this.div(n, n2)) }
    mod(n: nXY, n2?: number) {
        const xy = XY.parseInput(n, n2)
        return new XY(this.X % xy.X, this.Y % xy.Y)
    }
    modEQ(n: nXY, n2?: number) { return this.set(this.mod(n, n2)) }


    EQ(xy: XY) { return xy.X === this.X && xy.Y === this.Y }

    IsLessEQEither(xy: XY) { return this.X <= xy.X || this.Y <= xy.Y }
    IsLessEQBoth(xy: XY) { return this.X <= xy.X && this.Y <= xy.Y }
    IsLessEither(xy: XY) { return this.X < xy.X || this.Y < xy.Y }
    IsLessBoth(xy: XY) { return this.X < xy.X && this.Y < xy.Y }
    IsGreaterEQEither(xy: XY) { return this.X >= xy.X || this.Y >= xy.Y }
    IsGreaterEQBoth(xy: XY) { return this.X >= xy.X && this.Y >= xy.Y }
    IsGreaterEither(xy: XY) { return this.X > xy.X || this.Y > xy.Y }
    IsGreaterBoth(xy: XY) { return this.X > xy.X && this.Y > xy.Y }

    WithinBounds(xy: XY, xy2: XY) { return this.IsGreaterEQBoth(xy) && this.IsLessEQBoth(xy2)}
    WithinArea(xy: XY, size: XY) { return this.IsGreaterEQBoth(xy) && this.minus(xy).IsLessEQBoth(size) }
    
    Round() { return new XY(Math.round(this.X), Math.round(this.Y)) }
    Floor() { return new XY(Math.floor(this.X), Math.floor(this.Y)) }
    Ceil() { return new XY(Math.ceil(this.X), Math.ceil(this.Y)) }
    Abs() { return new XY(Math.abs(this.X), Math.abs(this.Y)) }
    Reverse() { return new XY(this.Y, this.X)}
    Negate() { return new XY().minus(this) }
    DeZero() { return new XY(this.X === 0 ? 1 : this.X, this.Y === 0 ? 1 : this.Y) }

    get Least() { return this.X > this.Y ? this.Y : this.X }
    get Greatest() { return this.X < this.Y ? this.Y : this.X }
    get LeastAbs() { return Math.abs(this.X) > Math.abs(this.Y) ? this.Y : this.X }
    get GreatestAbs() { return Math.abs(this.X) < Math.abs(this.Y) ? this.Y : this.X }

    toArray() { return [this.X, this.Y] }
    toString() { return `${this.X}, ${this.Y}` }
    Copy() { return new XY(this.X, this.Y) }

    foreachCombination(lambda: (xy: XY) => void, startXY = new XY) {
        for (let x = startXY.X; x <= this.X; x++)
            for (let y = startXY.Y; y <= this.Y; y++)
                lambda(new XY(x, y))
    }

    CountCombinations(lambda: (xy: XY) => boolean, startXY = new XY) {
        let count = 0
        this.foreachCombination(xy => {
            if(lambda(xy)) count++
        }, startXY)
        return count
    }

    Combinations() {
        const combos: XY[] = []
        this.foreachCombination(xy => combos.push(xy))
        return combos
    }

    Neighbours(includeDiags = false) {
        return includeDiags ? [
            this.plus(-1, -1),
            this.plus(-1, 0),
            this.plus(-1, 1),
            this.plus(0, -1),
            this.plus(0, 1),
            this.plus(1, -1),
            this.plus(1, 0),
            this.plus(1, 1),  
        ] : [
            this.minus(1, 0),
            this.plus(1, 0),
            this.plus(0, 1),
            this.minus(0, 1)
        ]
    }

    Neighbourhood(includeDiags = false) {
        return includeDiags ? [
            this.plus(-1, -1),
            this.plus( 0, -1),
            this.plus( 1, -1),
            this.plus(-1,  0),
            this.Copy(),
            this.plus( 1, 0),
            this.plus(-1, 1),
            this.plus( 0, 1),
            this.plus( 1, 1),  
        ] : [
            this.minus(1, 0),
            this.plus(1, 0),
            this.Copy(),
            this.plus(0, 1),
            this.minus(0, 1)
        ]
    }

    static toString(a: XY[]): string {
        return a.map(xy => `(${xy.toString()})`).join(', ')
    }
    
    static fromString(s: string) {
        return new XY(...s.split(', ').toIntArray() as [number, number])
    }

    static fromTuple(t: [number, number]) {
        return new XY(t[0], t[1])
    }

    Log() {
        console.log(this)
        return this
    }
}

export class Array2D<T> {
    Array: (T | undefined)[][] = []

    constructor(public Size: XY, fillValue: T|undefined = undefined) {
        for (let i = 0; i < Size.Y; i++)
            this.Array.push(Array(Size.X).fill(fillValue))
    }

    get(xy:XY) {
        return this.Array[xy.Y] ?
            this.Array[xy.Y][xy.X] :
            undefined
    }

    set(xy:XY, value: T | undefined) {
        this.Array[xy.Y][xy.X] = value
    }

    Copy() {
        const arr = new Array2D<T>(this.Size)
        arr.Array = this.Array.map(a => a.Copy())
        return arr
    }

    Neighbours(xy: XY, includeDiags = false) {
        return xy.Neighbours(includeDiags).map(n => [n, this.get(n)] as [XY, T | undefined]).filter(n => n[1] != undefined) as [XY, T][]
    }

    forEach(lambda: (value: T | undefined, index: XY) => void) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                lambda(this.get(xy), xy)
            }
        }
    }

    every(lambda: (value: T | undefined, index: XY) => boolean): boolean {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                if (!lambda(this.get(xy), xy)) {
                    return false
                }
            }
        }
        return true
    }
    
    some(lambda: (value: T | undefined, index: XY) => boolean): boolean {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                if (lambda(this.get(xy), xy)) {
                    return true
                }
            }
        }
        return false
    }

    map<TT>(lambda: (value: T | undefined, index: XY) => TT | undefined) {
        const arr = new Array2D<TT>(this.Size)
        this.forEach((val, xy) => arr.set(xy, lambda(val, xy)))
        return arr
    }
    
    Flatten() {
        let l: T[] = []
        this.forEach(tile => {
            if (tile) {
                l.push(tile)
            }
        })
        return l
    }

    Log() {
        // console.log(this)

        console.log('[')
        this.Array.forEach(row => {
            // console.log('| '+row.map(v => (v === undefined ? '' : typeof v === "number" && v === Infinity ? '∞' : String(v)).padStart(3)).join())
            console.log('| '+row.map(v => v ?? '.').join(''))
        })
        console.log(']')



        return this
    }

    Entries() {
        const arr: [XY, T][] = []
        this.forEach((val, xy) => {
            if (val) arr.push([xy, val])
        })
        return arr
    }

    static fromArray<T>(arr: T[][]) {
        if (arr.some(row => row.length !== arr[0].length))
            throw new RangeError('Array must be rectangular')

        const out = new Array2D<T>(new XY(arr[0].length, arr.length))
        arr.forEach((row, y) => {
            row.forEach((tile, x) => {
                out.set(new XY(x, y), tile)
            })
        })
        return out
    }
}