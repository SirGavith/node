type nXY = number | Twople

export class Twople {
    protected a: number
    protected b: number

    constructor()
    constructor(size: number)
    constructor(X: number, Y: number)

    constructor(X?: number, Y?: number) {
        this.a = X ?? 0
        this.b = Y ?? this.a
    }

    private static parseInput(n: nXY, n2?: number): Twople {
        return typeof n === "number" ? new Twople(n, n2 ?? n) : n
    }

    private set(xy: this) {
        ({ a: this.a, b: this.b } = xy)
    }

    plus(n: nXY, n2?: number) {
        const xy = Twople.parseInput(n, n2)
        return new Twople(this.a + xy.a, this.b + xy.b) as this
    }
    plusEQ(n: nXY, n2?: number) { return this.set(this.plus(n, n2)) }

    minus(n: nXY, n2?: number) {
        const xy = Twople.parseInput(n, n2)
        return new Twople(this.a - xy.a, this.b - xy.b) as this
    }
    minusEQ(n: nXY, n2?: number) { return this.set(this.minus(n, n2)) }
    times(n: nXY, n2?: number) {
        const xy = Twople.parseInput(n, n2)
        return new Twople(this.a * xy.a, this.b * xy.b) as this
    }
    timesEQ(n: nXY, n2?: number) { return this.set(this.times(n, n2)) }
    div(n: nXY, n2?: number) {
        const xy = Twople.parseInput(n, n2)
        return new Twople(this.a / xy.a, this.b / xy.b) as this
    }
    divEQ(n: nXY, n2?: number) { return this.set(this.div(n, n2)) }
    mod(n: nXY, n2?: number) {
        const xy = Twople.parseInput(n, n2)
        return new Twople(this.a % xy.a, this.b % xy.b) as this
    }
    modEQ(n: nXY, n2?: number) { return this.set(this.mod(n, n2)) }


    EQ(xy: this) { return xy.a === this.a && xy.b === this.b }

    IsLessEQEither(xy: this) { return this.a <= xy.a || this.b <= xy.b }
    IsLessEQBoth(xy: this) { return this.a <= xy.a && this.b <= xy.b }
    IsLessEither(xy: this) { return this.a < xy.a || this.b < xy.b }
    IsLessBoth(xy: this) { return this.a < xy.a && this.b < xy.b }
    IsGreaterEQEither(xy: this) { return this.a >= xy.a || this.b >= xy.b }
    IsGreaterEQBoth(xy: this) { return this.a >= xy.a && this.b >= xy.b }
    IsGreaterEither(xy: this) { return this.a > xy.a || this.b > xy.b }
    IsGreaterBoth(xy: this) { return this.a > xy.a && this.b > xy.b }

    WithinBounds(xy: this, xy2: this) { return this.IsGreaterEQBoth(xy) && this.IsLessEQBoth(xy2) }
    WithinArea(xy: this, size: this) { return this.IsGreaterEQBoth(xy) && this.minus(xy).IsLessEQBoth(size) }

    Round() { return new Twople(Math.round(this.a), Math.round(this.b)) as this }
    Floor() { return new Twople(Math.floor(this.a), Math.floor(this.b)) as this }
    Ceil() { return new Twople(Math.ceil(this.a), Math.ceil(this.b)) as this }
    Abs() { return new Twople(Math.abs(this.a), Math.abs(this.b)) as this }
    Reverse() { return new Twople(this.b, this.a) as this }
    Negate() { return new Twople().minus(this) as this }
    DeZero() { return new Twople(this.a === 0 ? 1 : this.a, this.b === 0 ? 1 : this.b) as this }

    get Least() { return this.a > this.b ? this.b : this.a }
    get Greatest() { return this.a < this.b ? this.b : this.a }
    get LeastAbs() { return Math.abs(this.a) > Math.abs(this.b) ? this.b : this.a }
    get GreatestAbs() { return Math.abs(this.a) < Math.abs(this.b) ? this.b : this.a }
    get Norm() { return Math.sqrt(this.a ** 2 + this.b ** 2) }
    get TaxicabNorm() { return Math.abs(this.a) + Math.abs(this.b) }

    toArray() { return [this.a, this.b] }
    toString() { return `${this.a}, ${this.b}` }
    Copy() { return new Twople(this.a, this.b) as this }

    foreachCombination(lambda: (xy: this) => void, startXY = new Twople as this) {
        for (let x = startXY.a; x <= this.a; x++)
            for (let y = startXY.b; y <= this.b; y++)
                lambda(new Twople(x, y) as this)
    }

    CountCombinations(lambda: (xy: this) => boolean, startXY = new Twople as this) {
        let count = 0
        this.foreachCombination(xy => {
            if (lambda(xy)) count++
        }, startXY)
        return count
    }

    Combinations() {
        const combos: this[] = []
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
            this.plus(0, -1),
            this.plus(1, -1),
            this.plus(-1, 0),
            this.Copy(),
            this.plus(1, 0),
            this.plus(-1, 1),
            this.plus(0, 1),
            this.plus(1, 1),
        ] : [
            this.minus(1, 0),
            this.plus(1, 0),
            this.Copy(),
            this.plus(0, 1),
            this.minus(0, 1)
        ]
    }

    static toString(a: Twople[]): string {
        return a.map(xy => `(${xy.toString()})`).join(', ')
    }



    Log() {
        console.log(this)
        return this
    }
}