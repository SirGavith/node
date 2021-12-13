class Byte {
    private value = 0
    get Value() {
        return this.value
    }
    set Value(val: number) {
        if (val >= 0 && val < 256) {
            this.value = val
        }
    }
    constructor(n?: number) {
        this.Value = n ?? 0
    }
}
class Word {
    private value = 0
    get Value() {
        return this.value
    }
    set Value(val: number) {
        if (val >= 0 && val < Math.pow(2, 16)) {
            this.value = val
        }
    }
    constructor(n?: number) {
        this.Value = n ?? 0
    }
}

const Registers = {
    PC: new Word(),
    IR: new Word(),
    ACC: new Word(),
}

function Evaluate(word: Word) {
    const opcode = word.Value >>> 12,
        memAddress = word.Value & 0x0FFF
    switch (opcode) {
        case 0: //LDA - Load Address
            Registers.ACC = ram[memAddress]
            break
        case 1: //STO - Store Value
            ram[memAddress] = Registers.ACC
            break
        case 2: //ADD - Add
            Registers.ACC.Value = Registers.ACC.Value + ram[memAddress].Value
            break
        case 3: //SUB - Subtract
            Registers.ACC.Value = Registers.ACC.Value - ram[memAddress].Value
            break
        case 4: //JMP - Jump
            Registers.PC = memAddress.Value
            break
        case 5: //JGE
            if (Registers.ACC.Value >= 0)
                Registers.PC = memAddress
            break
        case 6: //JNE
            if (Registers.ACC.Value != 0)
                Registers.PC = memAddress
            break
        case 7: //STP - Stop
            Running = false
            break
    }
}


const ram: Word[] = [
    0x0004,
    0x20A5,
    0x1006,
    0x7000,
    0x000A,
    0x0001,
    0x0000
].map(n => new Word(n))

let Running = true
while (true) {

    //FETCH
    //fetch instruction from memory at PC; write it to IR
    //pc++

    //EXEC
    //instruction opcode is decoded
    //instruction is executed


        //get operands from memory
        //perform operation
        //write result
    Evaluate()

    if (!Running) break
}
