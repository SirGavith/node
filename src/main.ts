import { Glib } from './Glib/main'
Glib.init();
import { Advent2021 } from './Advent2021';
import * as Advent2022 from './Advent2022'
import * as GArray from './Glib/Array';
import * as Advent2019 from './Advent2019';
import * as GMath from './math';
import { Cx } from './Glib/Complex';
import { XY } from './Glib/XY';
import { Filer } from './Glib/Filer';

// const data = []
// for (let x = 0; x < 16; x++) {
//     data[x] = Math.sin(3 * x) + Math.cos(x)
// }

const startTime = process.hrtime()

// synthesize data

// const r = [0,1,0,0]

// GMath.FFT(r.toCx()).Log()

// const [real, imag] = [r, new Array(r.length).fill(0)]
// GMath.transformRadix2(r, imag)
// real.map((r,i) => new Cx(r,imag[i])).Log()

Advent2022.Day2_2()

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 1_000_000}ms`)