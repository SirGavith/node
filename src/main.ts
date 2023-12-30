import { Vector } from './Glib/Vector';
import { Glib } from './Glib/main'
Glib.init();
// import { Lexer } from './Computer/Lexer';
// import { Digits } from './digits';

// import * as strava from './strava';
// strava.main();

// Mathhomework.main()


// u.mag().Log()



// u.dot(v).Log()



import * as Advent2022 from './Advent2022'

const startTime = process.hrtime();

Advent2022.Day1()

const time = process.hrtime(startTime)
console.log(`Ran in ${time[0]}s ${time[1] / 10 ** 6}ms`)