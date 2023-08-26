import { CustomError } from "../Glib/Error"

export class RuntimeError extends CustomError { constructor(...message: any[]) { super(message); this.name = this.constructor.name} }


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
    set (val: Word | number) {
        const v = typeof val === 'number' ? val : val.Value

        if (v >= 0) {
            this.value = v % this.capacity
        }
        else throw new Error('out of range')
    }
    toString() {
        return '0x'+this.Value.toString(16).padStart(4,'0')
    }
    constructor(private capacity: number, value = 0) { this.Value = value }
}

export const instructionsMU0 = [
    'LDA',
    'STO',
    'ADD',
    'SUB',
    'JMP',
    'JGE',
    'JNE',
    'STP'
]

export function ExecuteMU0(ram: Word[]) {
    
    // ram is 4096 words (000 - FFF)

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
                Registers.ACC.set(Registers.ACC.Value + ram[memAddress].Value)
                break
            case 3: //SUB - Subtract
                Registers.ACC.set(Registers.ACC.Value - ram[memAddress].Value)
                break
            case 4: //JMP - Jump
                Registers.PC.set(memAddress)
                break
            case 5: //JGE - Jump if >0
                if (Registers.ACC.Value >= 0)
                    Registers.PC.Value = memAddress
                break
            case 6: //JNE - Jump if != 0
                if (Registers.ACC.Value != 0)
                    Registers.PC.set(memAddress)
                break
            case 7: //STP - Stop
                Running = false
                break
        }

        ram.map(w => w.toString()).Log()
    }
}

export class MU1 {
    ROM?: Uint16Array
    static readonly Instructions = [
        'LDA',
        'STA',
        'ADD',
        'SUB',
        'JMP',
        'JGZ',
        'JNZ',
        'STP',
        'JSR',
        'RSR',
        'PHA',
        'PLA',
        'LDL',
        'LOG'
    ]
    private RAM = new Uint16Array(0xFFFF)
    private Stack = new Uint16Array(0xFF)
    private readonly registers16 = new Uint16Array(1)
    private readonly registers8 = new Uint8Array(4)

    private get PC() { return this.registers16[0] }         // Program Counter
    private set PC(n: number) { this.registers16[0] = n }   // Program Counter
    private get IR() { return this.registers8[0] }          // Instruction Regiuster
    private set IR(n: number) { this.registers8[0] = n }    // Instruction Regiuster
    private get A () { return this.registers8[1] }          // Accumulator
    private set A (n: number) { this.registers8[1] = n }    // Accumulator
    private get SP() { return this.registers8[2] }          // Stack Pointer
    private set SP(n: number) { this.registers8[2] = n }    // Stack Pointer
    private get SR() { return this.registers8[3] }          // Status Register
    private set SR(n: number) { this.registers8[3] = n }    // Status Register

    private Running = true

    Execute() {
        if (!this.ROM) throw new RuntimeError('Rom is empty')

        //execution begins at rom[0]

        while (this.Running) {
            //FETCH
            this.IR = this.ROM[this.PC]
            this.PC++

            //EXEC
            this.ExecuteInstruction(
                /** opcode */  this.IR >>> 12, 
                /** operand */ this.IR & 0x0FFF)
        }
    }

    ExecuteInstruction(opcode: number /* max 16 */, operand = 0) {
        switch (opcode) { 
            case 0x0: { // LDA - Load A
                this.A = this.RAM[operand]
                break
            }
			case 0x1: { // STA - Store A
                this.RAM[operand] = this.A
                break
            }
			case 0x2: { // ADD - Add to A
                this.A += this.RAM[operand]
                break
            }
			case 0x3: { // SUB - Subtract from A
                this.A -= this.RAM[operand]
                break
            }
			case 0x4: { // JMP - Unconditional Jump
                this.PC = operand
                break
            }
			case 0x5: { // JGZ - Jump if >0
                if (this.A >= 0)
                    this.PC = operand
                break
            }
			case 0x6: { // JNZ - Jump if !=0
                if (this.A != 0)
                    this.PC = operand
                break
            }
			case 0x7: { // STP - Stop
                this.Running = false
                break
            }
			case 0x8: { // JSR - Jump to Subroutine
                this.Stack[this.SP] = this.PC
                this.SP++
                this.PC = operand
                break
            }
			case 0x9: { // RSR - Return from Subroutine
                this.SP--
                this.PC = this.Stack[this.SP]
                break
            }
			case 0xA: { // PHA - Push A onto Stack
                this.Stack[this.SP] = this.A
                this.SP++
                break
            }
			case 0xB: { // PLA - Pull A from Stack
                this.SP--
                this.A = this.Stack[this.SP]
                break
            }
			case 0xC: { // LDL - Load Literal to A
                this.A = operand
                break
            }
            case 0xD: { // LOG - Log
                console.log(this.RAM[operand])
                break
            }
            default: {
                throw new RuntimeError('Unknown instruction', opcode)
            }
        }
    }
}

// const mu1 = new MU1
// mu1.LoadROMfromAssembly(`
//     // fibbonaci
//     alloc x
//     alloc y
//     alloc z
// @a
//     LDL 0x0
//     STA x
//     LDL 0x1
//     STA y
// @b
//     LOG x

//     LDA x
//     ADD y
//     STA z

//     LDA y
//     STA x

//     LDA z
//     STA y


//     LDL 0xff
//     SUB x
//     JGZ b


//     JMP a

// `.SplitLines())
// mu1.LoadROMfromBasicAssembly(
//     /** x = 0x0
//      *  y = 0x1
//      *  z = 0x2 */`
//     LDL 0
//     STA 0x0
//     LDL 1
//     STA 0x1

//     LOG 0x0
//     LDA 0x0
//     ADD 0x1
//     STA 0x2
//     LDA 0x1
//     STA 0x0
//     LDA 0x2
//     STA 0x1

//     LDL 0xff
//     SUB 0x0
//     JGZ 4

//     JMP 0

// `.SplitLines().map(l => l.trim()).filter(l => l !== ''))

// mu1.Execute()
