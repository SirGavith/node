import { XY } from "./Glib/XY"

// Euler's method
export function Euler() {
    for (let j = 0; j < 100; j++) {
        const dydx = (xy: XY) => xy.X + xy.Y
        const xy = new XY(1, 2)
        const dx = 1 / j

        for (let i = 0; i < j; i++) {
            xy.plusEQ(dx, dydx(xy) * dx)
        }
        xy.Y.Log()
    }
}

export function DFT(signal: number[]) {
    const angles = signal.map((_, i, a) => 2 * Math.PI * i / a.length).Log()

    const out = signal.map((_, f, s) => {
        //step 1
        s.reduce((xy, v, n) => {
            return xy.plus(new XY(1, 0).pow(v))
        }, new XY)


    })

}