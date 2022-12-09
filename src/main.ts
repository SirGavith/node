import { Glib } from './Glib/main'
Glib.init();
import * as Advent2022 from './Advent2022'

const startTime = process.hrtime();

Advent2022.Day8_3()

// [1, 2, 3].Reduce(([a, b], c) => [[a + c, b - c], b === 2] as [[number, number], boolean], [0, 0]).Log()


const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`)