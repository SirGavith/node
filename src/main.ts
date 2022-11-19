import { Glib } from './Glib/main'
Glib.init();
import { Advent2021 } from './Advent2021';
import * as Advent2022 from './Advent2022'
import * as GArray from './Glib/Array';

const startTime = process.hrtime()

Advent2022.Day1();

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 1_000_000}ms`)
