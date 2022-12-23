import { Glib } from './Glib/main'
Glib.init();
import * as Advent2022 from './Advent2022'

const startTime = process.hrtime();

Advent2022.Day19()

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`)