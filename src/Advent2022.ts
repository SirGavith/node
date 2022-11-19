const UseExample = false
import { BigMap } from './Glib/BigMap'
import { LinkedList, LinkedNode } from './Glib/LinkedList'
import { Stack } from './Glib/Stack'
import { Array2D as Array2D, XY } from './Glib/XY'
import { Array3D, XYZ } from './Glib/XYZ'
import { Filer } from './Glib/Filer'
import { Sorts } from './Glib/Sort'
import { Range } from './Glib/Array'
import * as GArray from './Glib/Array'

const Data = Filer.ReadAllLines(UseExample ? '../../data/example.txt' : '../../data/input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../../data/example.txt' : '../../data/input.txt')

export function Day1() {

    GArray.Convolute(Data.toIntArray(), [1/3,1/3,1/3]).map(v => Math.round(3 * v)).Log()
        .reduce(([acc, prev], v) => [acc + (v > prev ? 1 : 0), v] as [number, number], [0, Number.MAX_VALUE])[0].Log()

    Data.toIntArray().ReduceFilter

}