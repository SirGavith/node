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