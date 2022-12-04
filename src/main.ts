import { Glib } from './Glib/main'
Glib.init();
import * as Advent2019 from './Advent2019';
import { Advent2021 } from './Advent2021';
import * as Advent2022 from './Advent2022'

const startTime = process.hrtime()


Advent2022.Day4()


const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 1_000_000}ms`)