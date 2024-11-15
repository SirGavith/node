import { Glib } from './Glib/main'
import { Main } from './stoer-wagner';
Glib.init();
 


const startTime = process.hrtime();

Main()

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`)