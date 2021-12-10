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
    Negate() { return new XY().minus(this) }
    DeZero() { return new XY(this.X === 0 ? 1 : this.X, this.Y === 0 ? 1 : this.Y) }

    get Least() { return this.X > this.Y ? this.Y : this.X }
    get Greatest() { return this.X < this.Y ? this.Y : this.X }

    toArray() { return [this.X, this.Y] }
    toString() { return `${this.X}, ${this.Y}` }
    copy() { return new XY(this.X, this.Y) }

    foreachCombination(lambda: (xy: XY) => void) {
        for (let x = 0; x < this.X; x++)
            for (let y = 0; y < this.Y; y++)
                lambda(new XY(x, y))
    }

    Combinations() {
        const combos: XY[] = []
        this.foreachCombination(xy => combos.push(xy))
        return combos
    }

    Neighbours() {
        return [
            this.minus(1, 0),
            this.plus(1, 0),
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
}

export class Array2D<T> {
    Array: T[][] = []

    constructor(public Size: XY) {
        for (let i = 0; i < Size.Y; i++)
            this.Array.push(Array(Size.X).fill(undefined))
    }

    get(xy:XY) {
        return this.Array[xy.Y] ?
            this.Array[xy.Y][xy.X] :
            undefined
    }

    set(xy:XY, value: T) {
        this.Array[xy.Y][xy.X] = value
    }

    Neighbours(xy: XY) {
        return xy.Neighbours().map(n => [n, this.get(n)]).toObject().RemoveUndefinedVals() as {[xy: string]: T}
    }

    forEach(lambda: (value: T | undefined, index: XY) => void) {
        for (let y = 0; y < this.Array.length; y++) {
            for (let x = 0; x < this.Array[y]?.length; x++) {
                let xy = new XY(x, y)
                lambda(this.get(xy), xy)
            }
        }
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