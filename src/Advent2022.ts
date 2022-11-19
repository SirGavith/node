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

    Data.toIntArray().ReduceAccumulate((p, v) => v > p ? 1 : 0).Log()

    GArray.Convolute(Data.toIntArray(), [1/3,1/3,1/3]).map(v => Math.round(3 * v))
        .ReduceAccumulate((p, v) => v > p ? 1 : 0).Log()
}