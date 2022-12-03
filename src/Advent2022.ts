const UseExample = false
import { BigMap } from './Glib/BigMap'
import { LinkedList, LinkedNode } from './Glib/LinkedList'
import { Stack } from './Glib/Stack'
import { Array2D as Array2D, XY } from './Glib/XY'
import { Array3D, XYZ } from './Glib/XYZ'
import { Filer } from './Glib/Filer'
import { Sorts } from './Glib/Sort'
import * as GArray from './Glib/Array'

const Data = Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt')

export function Day1() {
    let max = 0
    let e: number | undefined = undefined;
    DataFull.split('\n\n').forEach((v,i) => {
        const sum = v.toIntList().Sum()
        if (sum > max) {
            max = sum
            e = i
        }
    })
    console.log(e)
    max.Log()
}
export function Day1_2() {

    const elves = DataFull.Split2Lines().map(v =>
        v.toIntList().Sum()
    )
    elves.sort(Sorts.GreatestFirst)

    elves.slice(0,3).Sum().Log()
}

export function Day2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors

            'X': '0', // rock
            'Y': '1', // paper
            'Z': '2'  // scissors
        }).split(' ').toIntArray().Log()
        let score = p[1] + 1

        if (p[0] === p[1]) return score + 3

        if ((p[0] + 1) % 3 === p[1]) return score + 6
        
        return score;
    }).Log().Sum().Log()
}
export function Day2_2() {
    Data.map(d => {
        const p = d.ReplaceMap({
            'A': '0', // rock
            'B': '1', // paper
            'C': '2', // scissors
        }).split(' ').Log()
        let score = p[0].toInt().Log()

        if (p[1] === 'X') {
            //lose
            return 1 + ((score + 2) % 3)
        } else if (p[1] === 'Y') {
            //draw
            return 1 + score + 3
        } else {
            //win
            return 1 + ((score + 1) % 3) + 6
        }


    }).Log().Sum().Log()
}