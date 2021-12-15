export class Word {
    private value = 0
    get Value() {
        return this.value
    }
    set Value(val: number) {
        if (val >= 0 && val < Math.pow(2, this.capacity)) {
            this.value = val
        }
    }
    set (val: Word) {
        if (val.Value >= 0 && val.Value < Math.pow(2, this.capacity)) {
            this.value = val.Value
        }
        else throw new Error('out of range')
    }
    toString() {
        return '0x'+this.Value.toString(16).padStart(4,'0')
    }
    constructor(private capacity: number, value = 0) { this.Value = value }
}

const instructions = [
    'LDA',
    'STO',
    'ADD',
    'SUB',
    'JMP',
    'JGE',
    'JNE',
    'STP'
]

// function Disassemble(assembly: Word[]) {
    
//     assembly.forEach(instr => {
//         const opcode = instr.Value >>> 12,
//             memAddress = instr.Value & 0x0FFF;

//         `| ${instructions[opcode]} ${memAddress}: (${ram[memAddress].toString()}) || ${instr}`.Log()

//     })
// }
function DisassembleInstr(memory: Word[], Registers: {[reg: string]: Word}) {
    const instr = Registers.IR,
        opcode = instr.Value >>> 12,
        memAddress = instr.Value & 0x0FFF,
        instrmapped = instructions[opcode]
    switch (instrmapped) {
        case 'LDA': return `LDA ${memAddress}: (${memory[memAddress].toString()})`
        case 'STO': return `STO ${memAddress} => ${memory[memAddress].toString()}`
        case 'ADD': return `ADD ${memAddress}: +${memory[memAddress].toString()} => ${Registers.ACC.toString()}`
        case 'SUB': return `SUB ${memAddress}: -${memory[memAddress].toString()} => ${Registers.ACC.toString()}`
        case 'JMP': return `JMP ${memAddress}: ${Registers.PC}`
        case 'JGE': return `JGE ${memAddress}: ${Registers.PC}`
        case 'JNE': return `JNE ${memAddress}: ${Registers.PC}`
        case 'STP': return `STP`
    }
}

export function Execute(ram: Word[]) {

    const Registers: {[reg: string]: Word} = {
        PC: new Word(12), // Program Counter
        IR: new Word(16), // Instruction Register
        ACC: new Word(16),// Accumulator
    }

    let Running = true,
        maxSteps = 25

    for (let i = 0; Running && i < maxSteps; i++) {
        //FETCH
        Registers.IR.set(ram[Registers.PC.Value])
        Registers.PC.Value++

        //EXEC
        const opcode = Registers.IR.Value >>> 12,
            memAddress = Registers.IR.Value & 0x0FFF

        switch (opcode) {
            case 0: //LDA - Load Address
                Registers.ACC.set(ram[memAddress])
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
                Registers.PC.Value = memAddress
                break
            case 5: //JGE - Jump if >0
                if (Registers.ACC.Value >= 0)
                    Registers.PC.Value = memAddress
                break
            case 6: //JNE - Jump if !=0
                if (Registers.ACC.Value != 0)
                    Registers.PC.Value = memAddress
                break
            case 7: //STP - Stop
                Running = false
                break
        }

        DisassembleInstr(ram, Registers)?.Log()
        ram.map(w => w.toString()).Log()
    }
}