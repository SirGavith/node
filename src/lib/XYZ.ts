type nXYZ = number | XYZ
export class XYZ {
    X: number
    Y: number
    Z: number

    constructor()
    constructor(size: number)
    constructor(X: number, Y: number, Z: number)

    constructor(X?: number, Y?: number, Z?: number) {
        this.X = X ?? 0
        this.Y = Y ?? this.X
        this.Z = Z ?? this.X
    }

    private static parseInput(n: nXYZ, n2?: number, n3?: number): XYZ {
        return typeof n === "number" ? new XYZ(n, n2 ?? n, n3 ?? n2 ?? n) : n
    }

    private set(xyz: XYZ) {
        ({X: this.X, Y: this.Y, Z: this.Z} = xyz)
    }

    plus(n: nXYZ, n2?: number, n3?: number) {
        const xyz = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X + xyz.X, this.Y + xyz.Y, this.Z + xyz.Z)
    }
    plusEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.plus(n, n2, n3)) }
    minus(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X - xy.X, this.Y - xy.Y, this.Z - xy.Z)
    }
    minusEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.minus(n, n2, n3)) }
    times(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X * xy.X, this.Y * xy.Y, this.Z * xy.Z)
    }
    timesEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.times(n, n2, n3)) }
    div(n: nXYZ, n2?: number, n3?: number) {
        const xy = XYZ.parseInput(n, n2, n3)
        return new XYZ(this.X / xy.X, this.Y / xy.Y, this.Z / xy.Z)
    }
    divEQ(n: nXYZ, n2?: number, n3?: number) { return this.set(this.div(n, n2, n3)) }

    EQ(xyz: XYZ) { return xyz.X === this.X && xyz.Y === this.Y && this.Z === xyz.Z }

    ManhattanDist(xyz: XYZ) {
        const m = this.minus(xyz).Abs()
        return m.X + m.Y + m.Z
    }

    Abs() { return new XYZ(Math.abs(this.X), Math.abs(this.Y), Math.abs(this.Z)) }

    toArray() { return [this.X, this.Y, this.Z] }
    toString() { return `(${this.X}, ${this.Y}, ${this.Z})` }
    Copy() { return new XYZ(this.X, this.Y, this.Z) }

    Orientations () {
        let [x, y, z] = this.toArray()
        return [
            new XYZ(x, y, z),
            new XYZ(x, z, -y),
            new XYZ(x, -y, -z),
            new XYZ(x, -z, y),

            new XYZ(-x, -y, z),
            new XYZ(-x, z, y),
            new XYZ(-x, y, -z),
            new XYZ(-x, -z, -y),

            new XYZ(y,-x, z),
            new XYZ(y,-z, -x),
            new XYZ(y, x, -z),
            new XYZ(y, z, x),

            new XYZ(-y, z, -x),
            new XYZ(-y, x, z),
            new XYZ(-y, -z, x),
            new XYZ(-y, -x, -z),

            new XYZ(z, -y, x),
            new XYZ(z, -x, -y),
            new XYZ(z, y, -x),
            new XYZ(z, x, y),

            new XYZ(-z, y, x),
            new XYZ(-z, -x, y),
            new XYZ(-z, -y, -x),
            new XYZ(-z, x, -y),
        ]
    }


    static toString(a: XYZ[]): string {
        return a.map(xy => `(${xy.toString()})`).join(', ')
    }

    static fromString(s: string) {
        return new XYZ(...s.split(', ').toIntArray() as [number, number, number])
    }
    static fromTuple(t: [number, number, number]) {
        return new XYZ(t[0], t[1], t[2])
    }
}