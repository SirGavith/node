class GMath {
    /**
     * Generates an array composed of the action called for each value in the range.
     * @param action The id of the employee.
     * @param range The range of values.
     * @returns The array of the action called for each value in the range.
     */
    static Comprehend<T extends numericals>(action: (i: T) => T, range: GRange<T>) {
        return range.Array.map(i => action(i))
    }
}

class GRange<T extends numericals> {
    Min: T
    Max: T
    constructor(min: T, max: T) {
        this.Min = min
        this.Max = max
    }

    get Array() {
        let out: Array<T> = []
        for (let i = this.Min; i < this.Max; i++) {
            out.push(i)
        }
        return out
    }

    *YArray() {
        for (let i = this.Min; i < this.Max; i++) {
            yield i
        }
    }

    static DoubleForRange<T extends numericals>(r1: GRange<T>, r2: GRange<T>, action: (a: T, b: T) => void) {
        for (let a = r1.Min; a <= r1.Max; a++) {
            for (let b = r2.Min; b <= r2.Max; b++) {
                action(a, b)
            }
        }
    }
}

class ProjectEuler {
    static P16() {
        console.log(2n.Exp(1000n).SumDigits())
    }

    static P20() {
        console.log(100n.Factorial().SumDigits())
    }

    static P25() {
        let i = 2,
            lastval = 0n,
            val = 1n

        while (true) {
            let temp = val 
            val += lastval
            lastval = temp
            if (val.DigitCount() >= 1000) {
                console.log(i, val)
                break
            }

            i++
        }
    }

    static P29() {
        let s = new Set<bigint>()

        GRange.DoubleForRange(new GRange(2n, 100n), new GRange(2n, 100n), (a, b) => s.add(a.Exp(b)))
        console.log(s.size)
    }

    static P30() {
        // let nums: bigint[] = []
        // let i = 2n;

        console.log(
            new GRange(2n, 1_000_000n).Array
            .filter(i => 
                i.IntDigits()
                .map(n => BigInt(n ** 5))
                .Sum() == i
            ).Sum()
        )

        // while (i < 1_000_000) {
        //     if (i.IntDigits().map(n => BigInt(n ** 5)).Sum() == i) {
        //         nums.push(i)
        //         console.log(i)
        //     }
        //     i++
        // }
        // console.log(nums.Sum())
    }

    static P34() {
        // let nums = []
        // let i = 3n
        // while (i < 1000000) {
        //     if (i.IntDigits().map(n => BigInt(n).Factorial()).Sum() == i) {
        //         nums.push(i)
        //         console.log(i)
        //     }
        //     i++
        // }
        // console.log(nums.Sum())

        console.log(
            new GRange(3n, 1_000_000n).Array
            .filter(i => 
                i.IntDigits()
                .map(n => BigInt(n).Factorial())
                .Sum() == i
            ).Sum()
        )
    }

    static P35() {
        console.log(
            new GRange<bigint>(2n, 100n).Array
            .filter(n => {
                for (let i = 0; i < n.DigitCount(); i++) {
                    if (!n.IsPrime()) {
                        return false
                    }
                    n = n.RotateDigits()
                }
                return true
            })
        )
    }

    static P39() {
        let validtriangles = []
        let frequencies: { [perimeter: number]: number; } = {}

        GRange.DoubleForRange<number>(new GRange(1, 500), new GRange(1, 500), (a, b) => {
            let c = Math.sqrt(a * a + b * b)
            let c2 = Math.hypot(a, b)
            if (c.IsInteger() != c2.IsInteger()) {
                console.log(a, b, c, c2)
            }
            let p = a + b + c
            if (c.IsInteger() && p <= 1000) {
                // let triangle = [a, b, c].sort((a, b) => a - b)

                validtriangles.push({a: a, b: b})
                
                p in frequencies ? frequencies[p]+= 0.5 : frequencies[p] = 0.5
                //console.log(`valid triangle ${triangle.toString()}; p=${p}`)
            }
        })
        let maxfreq = 0
        let maxfreqper
        for (const p in frequencies) {
            if (Object.prototype.hasOwnProperty.call(frequencies, p)) {
                const f = frequencies[p];
                if (f > maxfreq) {
                    maxfreq = f
                    maxfreqper = p
                }
            }
        }
        console.log(maxfreqper, maxfreq)
    }
    static P48() {
        let n = 0n
        for (let i = 1n; i <= 1000n; i++) {
            n += i.Exp(i)
        }
        console.log(n)
    }

    static P56() {
        let maxdigitalsum = 0,
            maxa,
            maxb
        GRange.DoubleForRange(new GRange(1n, 100n), new GRange(1n, 100n), (a, b) => {
            let n = a.Exp(b).SumDigits()
            if (n > maxdigitalsum) {
                maxdigitalsum = n
                maxa = a
                maxb = b
                // console.log(a, b, n)
            }
        })
        console.log(maxa, maxb, maxdigitalsum)
    }

    static P80() {
        console.log(
            GMath.Comprehend<bigint>(
                i => BigInt(i.SqrtDigits(100).SumDigits()),
                new GRange(1n, 100n)
            ).Sum()
        )
    }

    static P101() {
        let triangle = '-340,495,-153,-910,835,-947'.split(',').map(n => parseInt(n))
        console.log(triangle.Sum())
    }
}

ProjectEuler.P35()