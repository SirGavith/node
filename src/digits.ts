export class Digits {
    //fucked
    static operations: ((a: number, b: number) => number)[] = [
        (a, b) => a + b,
        (a, b) => a - b,
        (a, b) => a * b,
        // (a, b) => a / b,
    ]
    static main() {
        const target = 55
        const operands = [1,2,4,5,10,25]

        Digits.recurse(operands, target)


        operands.forEach(startNum => {
            this.operations.forEach(firstOpr => {
                operands.forEach(secondNum => {
                    firstOpr(startNum, secondNum)
                })
            })
        })
    }
    static recurse(nums: number[], target: number) {
        nums.forEach((num, i) => {
            this.operations.forEach(firstOpr => {
                nums.forEach((num2, i2) => {
                    const n = firstOpr(num, num2)
                    if (n === target)
                        // const nnums = [n]
                    for (let j = 0; j < nums.length; j++) {
                        if (j !== i && j !== i2) {
                            nnums.push(nums[i])
                        }
                    }

                })
            })
        })
    }
}
