import { Glib } from './Glib/main'
Glib.init();
import { Advent2021 } from './Advent2021';
import * as Advent2022 from './Advent2022'
import * as GArray from './Glib/Array';
import * as Advent2019 from './Advent2019';
import * as GMath from './math';
import { Cx } from './Glib/Complex';

const startTime = process.hrtime()

//synthesize data
// const data = []
// for (let x = 0; x < 10; x++) {
//     data[x] = Math.sin(3 * x) + Math.cos(x)
// }

// GMath.DFT(data)

// const cpx = new Cx
// cpx.

Advent2019.Day1()

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 1_000_000}ms`)
