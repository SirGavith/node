"use strict";
class Geology {
    static MagmaCrystallization() {
        const Steps = [
            [2, 0, 0, 0, 0, 0, 0],
            [3, 0, 0, 1, 0, 0, 0],
            [4, 1, 0, 2, 0, 0, 0],
            [3, 1, 1, 3, 0, 0, 0],
            [2, 1, 1, 3, 0, 0, 1],
            [0, 0, 4, 4, 1, 0, 3],
            [0, 0, 2, 3, 3, 0, 2],
            [0, 0, 2, 3, 6, 0, 2],
            [0, 0, 1, 1, 5, 1, 1],
            [0, 0, 1, 1, 7, 4, 1]
        ];
        const MineralComp = [
            [1, 0, 0, 2, 0, 0],
            [1, 0, 2, 0, 0, 0],
            [2, 0, 0, 1, 1, 0],
            [2, 2, 0, 0, 1, 0],
            [3, 1, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0],
            [0, 0, 3, 0, 0, 0]
        ]; // Magnetite
        let Magma = [184, 70, 39, 40, 34, 24];
        function LogMagma() {
            // console.log(Magma.map(n => n.toString().padStart(3)).join(', '))
            console.log(Magma
                .map(n => Math.round(n / Magma.reduce((a, b) => a + b) * 100))
                .map(n => n.toString().padStart(3))
                .join(', '));
        }
        LogMagma();
        for (const step of Steps) {
            //for each kind of mineral
            step.forEach((count, i) => {
                //remove the right number of each type of element
                Magma = Magma.map((e, t) => e - MineralComp[i][t] * count);
            });
            LogMagma();
        }
    }
}
