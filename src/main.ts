import { Glib } from './Glib/main'
Glib.init();
import { Advent2021 } from './Advent2021';
import * as Advent2022 from './Advent2022'
import { XY } from './Glib/XY';
import { Range } from './Glib/Array';

const startTime = process.hrtime()

// Advent2022.Day1();


// Euler's method
for (let j = 0; j < 100; j++) {
    const dydx = (xy: XY) => xy.X + xy.Y
    const xy = new XY(1,2)
    const dx = 1/j

    for (let i = 0; i < j; i++) {
        xy.plusEQ(dx, dydx(xy) * dx)
    }
    xy.Y.Log()
}


const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 1_000_000}ms`)
