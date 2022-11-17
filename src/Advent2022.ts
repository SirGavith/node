import { BigMap } from './Glib/BigMap'
import { LinkedList, LinkedNode } from './Glib/LinkedList'
import { Stack } from './Glib/Stack'
import { Array2D as Array2D, XY } from './Glib/XY'
import { Array3D, XYZ } from './Glib/XYZ'
import { Filer } from './Glib/Filer'
import { Sorts } from './Glib/Sort'
import { Range } from './Glib/Array'

const UseExample = true,
    Data = Filer.ReadAllLines(UseExample ? '../example.txt' : '../input.txt'),
    DataFull = Filer.ReadFile(UseExample ? '../example.txt' : '../input.txt')

class Advent2022 {

}