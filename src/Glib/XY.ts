import { Twople } from "./Twople"

export class XY extends Twople {

    get X() { return this.a }
    set X(x: number) { this.a = x}
    get Y() { return this.b }
    set Y(y: number) { this.b = y }


    static fromString(s: string) {
        return new XY(...s.split(', ').toIntArray() as [number, number])
    }

    static fromTuple(t: [number, number]) {
        return new XY(t[0], t[1])
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
            console.log('| '+row.map(v => (v === undefined ? '' : typeof v === "number" && v === Infinity ? '∞' : String(v)).padStart(3)).join())
            // console.log('| '+row.map(v => v ?? '.').join(''))
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