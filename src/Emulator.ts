import { isNullOrUndefined } from "util";
import { AssemblerError } from "./Compiler";
import { CustomError } from "./lib/Error"

class RuntimeError extends CustomError { constructor(...message: any[]) { super(message); this.name = this.constructor.name} }


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

    LoadROMfromCode(code: string) {

    }

    LoadROMfromAssembly(assembly: string[]) {
        const code = assembly.map(l => l.trim()).filter(l => l !== '').map(l => l.split(' '))
        const identifiers = code.filter(l => l[0] === 'alloc').map((alloc, i) => [alloc[1], i] as const)
        let instructions: string[][] = []

        code.reduce((a, l) => {
            if (l[0].startsWith('@')) { // labels
                identifiers.push([l[0].slice(1), a])
                l = l.slice(1)
            }
            if (l[0] && MU1.Instructions.includes(l[0])) {
                a++
                instructions.push(l)
            }
            return a
        }, 0)

        for (const [id, pos] of identifiers) {
            instructions = instructions.map((inst, i) => inst[1] === id ? [inst[0], pos.toString(16)] : inst)
        }

        console.log(instructions)

        this.LoadROMfromBasicAssembly(instructions.map(i => i.join(' ')))
    }

    LoadROMfromBasicAssembly(assembly: string[]) {
        this.ROM = new Uint16Array(assembly.map(line => {
            const spl = line.split(' ')
            if (MU1.Instructions.includes(spl[0]) && (spl.length === 2 || spl.length === 1)) {

                return (MU1.Instructions.indexOf(spl[0]) << 12) | (spl[1]?.toInt() ?? 0)
            }
            else throw new AssemblerError(`Could not understand line '${line}'`)
        }))

        this.ROM.forEach(short => short.toString(16).padStart(4, '0').Log())
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

export class Emu6502 {
    ROM?: Uint8Array
    RAM = new Uint8Array(0xFFFF)
    Stack = new Uint8Array(0xFF)

    //Registers
    readonly registers16 = new Uint8Array(1)
    readonly registers8 = new Uint8Array(5)
    get PC() { return this.registers16[0] }         // Program Counter
    set PC(n: number) { this.registers16[0] = n }   // Program Counter
    get A () { return this.registers8[0] }          // Accumulator
    set A (n: number) { this.registers8[0] = n }    // Accumulator
    get X () { return this.registers8[1] }          // X Register
    set X (n: number) { this.registers8[1] = n }    // X Register
    get Y () { return this.registers8[2] }          // Y Register
    set Y (n: number) { this.registers8[2] = n }    // Y Register
    get SP() { return this.registers8[3] }          // Stack Pointer
    set SP(n: number) { this.registers8[3] = n }    // Stack Pointer
    get SR() { return this.registers8[4] }          // Status Register [NV-BDIZC]
    set SR(n: number) { this.registers8[4] = n }    // Status Register [NV-BDIZC]

    get Negative() { return this.SR >> 7 & 1 }
    get Overflow() { return this.SR >> 6 & 1 }
    get Break() { return this.SR >> 4 & 1 }
    get Decimal() { return this.SR >> 3 & 1 }
    get Interrupt() { return this.SR >> 2 & 1 }
    get Zero() { return this.SR >> 1 & 1 }
    get Carry() { return this.SR & 1 }

    set Negative(n: number) { this.SR = this.SR & 0x7F | n << 7}
    set Overflow(n: number) { this.SR = this.SR & 0xBF | n << 6}
    set Break(n: number) { this.SR = this.SR & 0xEF | n << 4}
    set Decimal(n: number) { this.SR = this.SR & 0xF7 | n << 3}
    set Interrupt(n: number) { this.SR = this.SR & 0xFB | n << 2}
    set Zero(n: number) { this.SR = this.SR & 0xFD | n << 1}
    set Carry(n: number) { this.SR = this.SR & 0xFE | n}

    setNZ = (n: number) => { this.Negative = n >> 8 & 1; this.Zero = n === 0 ? 1 : 0 }
    setNZC = (n: number, c: number) => { this.setNZ(n); this.Carry = c}
    setNZA = (n: number) => { this.setNZ(n); this.A = n }

    StackPush(n: number) {
        this.Stack[this.SP] = n
        this.SP++
    }
    StackPull() {
        this.SP--
        const pull = this.Stack[this.SP]
        this.Stack[this.SP] = 0
        return pull
    }

    public Running = true

    Execute() {
        if (!this.ROM) throw new RuntimeError('Rom is empty')

        //execution begins at rom[0]

        while (this.Running) {
            if (this.PC >= this.ROM.length) break
            this.ExecuteInstruction()
            this.PC++
        }
    }

    ExecuteInstruction() {
        if (!this.ROM) throw new RuntimeError('Rom is empty')
        this.Instructions[this.instr()]()
    }
    instr(offset = 0) { return this.ROM![this.PC + offset]}
    get nextByte() { this.PC++; return this.instr()}
    get nextWord() { this.PC += 2; return this.instr() << 8 | this.instr(-1)}

    getRAMWord(memAddress: number) { return (this.RAM[(memAddress + 1) & 0xFF] << 8) | this.RAM[memAddress] }

    get AdrAbsolute() { return this.nextWord }
    get AdrAbsoluteX() { return (this.nextWord + this.X) & 0xFFFF }
    get AdrAbsoluteY() { return (this.nextWord + this.Y) & 0xFFFF }
    get AdrIndirect() { return this.RAM[this.nextWord] }
    get AdrXIndirect() { return this.getRAMWord(this.nextByte + this.X) }
    get AdrIndirectY() { return this.RAM[this.nextByte] + this.Y }
    get AdrRelative() { return this.PC + this.nextByte  }
    get AdrZeropage() { return this.nextByte }
    get AdrZeropageX() { return (this.nextByte + this.X) & 0xFF }
    get AdrZeropageY() { return (this.nextByte + this.X) & 0xFF }
    

    ADC(arg: number) {
        const sum = this.A + arg + this.Carry
        this.Carry = sum > 0xFF ? 1 : 0
        this.Overflow = ~(this.A ^ arg) & (this.A ^ sum) & 0x80
        this.setNZA(sum)
    }
    AND(arg: number) { this.setNZA(this.A & arg) }
    ASL(memAddress?: number) {
        const val = memAddress ? this.RAM[memAddress] : this.A
        this.Carry = val >> 7 & 1
        if (memAddress) {
            this.RAM[memAddress] = val << 1 & 0xFF
            this.setNZ(this.RAM[memAddress])
        } else {
            //accumulator
            this.setNZA(this.A << 1 & 0xFF)
        }
    }
    BCC(arg: number) { if (this.Carry === 0) this.PC = arg }
    BCS(arg: number) { if (this.Carry === 1) this.PC = arg }
    BEQ(arg: number) { if (this.Zero === 1) this.PC = arg }
    BIT(arg: number) {
        this.SR = this.SR & 0x3D | (arg & 0xC0) | ((this.A & arg) === 0 ? 2 : 1)

    }
    BMI(arg: number) { if (this.Negative === 1) this.PC = arg }
    BNE(arg: number) { if (this.Zero === 0) this.PC = arg }
    BPL(arg: number) { if (this.Negative === 0) this.PC = arg }
    BRK() {} //TODO: www.masswerk.at/6502/6502_instruction_set.html#BRK
    BVC(arg: number) { if (this.Overflow === 0) this.PC = arg }
    BVS(arg: number) { if (this.Overflow === 1) this.PC = arg }
    CLC() { this.Carry = 0 }
    CLD() { this.Decimal = 0 }
    CLI() { this.Interrupt = 0 }
    CLV() { this.Overflow = 0 }
    CMP(arg: number) { this.setNZC(this.A - arg, this.A >= arg ? 1 : 0) }
    CPX(arg: number) { this.setNZC(this.X - arg, this.A >= arg ? 1 : 0) }
    CPY(arg: number) { this.setNZC(this.Y - arg, this.A >= arg ? 1 : 0) }
    DEC(memLocation: number) { this.setNZ(this.RAM[memLocation] - 1) }
    DEX() { this.setNZ(--this.X) }
    DEY() { this.setNZ(--this.X) }
    EOR(arg: number) { this.setNZA(this.A ^ arg) }
    INC(memLocation: number) { this.setNZ(this.RAM[memLocation] + 1) }
    INX() { this.setNZ(++this.X) }
    INY() { this.setNZ(+this.X) }
    JMP(arg: number) { this.PC = arg }
    JSR(arg: number) {
        this.StackPush(this.PC + 2)
        this.PC = arg
    } 
    LDA(arg: number) { this.A = arg }
    LDX(arg: number) { this.X = arg }
    LDY(arg: number) { this.Y = arg }
    LSR(memAddress?: number) {
        const val = memAddress ? this.RAM[memAddress] : this.A
        this.Carry = val & 1
        if (memAddress) {
            this.setNZ(this.RAM[memAddress])
            this.RAM[memAddress] = (val >> 1) & 0xFF
        } else {
            //accumulator
            this.setNZA((val >> 1) & 0xFF)
        }
    }
    NOP() {}
    ORA(arg: number) { this.setNZA(this.A | arg) }
    PHA() { this.StackPush(this.A) }
    PHP() { this.StackPush(this.SR | 0x30) }
    PLA() { this.setNZA(this.StackPull()) }
    PLP() { this.SR = this.StackPull() & 0xCF }
    ROL(memAddress?: number) {
        const val = memAddress ? this.RAM[memAddress] : this.A
        const c = this.Carry
        this.Carry = val >> 7 & 1
        if (memAddress) {
            this.RAM[memAddress] = val << 1 | c & 0xFF
            this.setNZ(this.RAM[memAddress])
        } else {
            this.setNZA(val << 1 | c & 0xFF)
        }
    }
    ROR(memAddress?: number) {
        const val = memAddress ? this.RAM[memAddress] : this.A
        const c = this.Carry
        this.Carry = val & 1
        if (memAddress) {
            this.RAM[memAddress] = val >> 1 | (c << 7) 
            this.setNZ(this.RAM[memAddress])
        } else {
            this.setNZA(val >> 1 | (c << 7) )
        }
    }
    RTI() {
        this.PLP()
        this.PC = this.StackPull()
    }
    RTS() { this.PC = this.StackPull() + 1 }
    SBC(arg: number) { this.ADC(~arg) }
    SEC() { this.Carry = 1 }
    SED() { this.Decimal = 1 }
    SEI() { this.Interrupt = 1 }
    STA(memLocation: number) { this.RAM[memLocation] = this.A }
    STX(memLocation: number) { this.RAM[memLocation] = this.X }
    STY(memLocation: number) { this.RAM[memLocation] = this.Y }
    TAX() { this.X = this.A }
    TAY() { this.Y = this.A }
    TSX() { this.X = this.SP }
    TXA() { this.A = this.X }
    TXS() { this.SP = this.X }
    TYA() { this.A = this.Y }


    Instructions: {[opcode: number]: () => void} = {
        0x00: () => { this.BRK() }, /** BRK impl  */
        0x01: () => { this.ORA(this.RAM[this.AdrXIndirect]) }, /** ORA X,ind	*/
        0x05: () => { this.ORA(this.RAM[this.AdrZeropage]) }, /** ORA zpg	*/
        0x06: () => { this.ASL(this.RAM[this.AdrZeropage]) }, /** ASL zpg	*/
        0x08: () => { this.PHP() }, /** PHP impl	*/
        0x09: () => { this.ORA(this.nextByte) }, /** ORA #	    */
        0x0A: () => { this.ASL() }, /** ASL A	    */
        0x0D: () => { this.ORA(this.RAM[this.AdrAbsolute]) }, /** ORA abs	*/
        0x0E: () => { this.ASL(this.RAM[this.AdrAbsolute]) }, /** ASL abs	*/
        0x10: () => { this.BPL(this.RAM[this.AdrRelative]) }, /** BPL rel	*/
        0x11: () => { this.ORA(this.RAM[this.AdrIndirectY]) }, /** ORA ind,Y	*/
        0x15: () => { this.ORA(this.RAM[this.AdrZeropageX]) }, /** ORA zpg,X	*/
        0x16: () => { this.ASL(this.RAM[this.AdrZeropageX]) }, /** ASL zpg,X	*/
        0x18: () => { this.CLC() }, /** CLC impl	*/
        0x19: () => { this.ORA(this.RAM[this.AdrAbsoluteY]) }, /** ORA abs,Y	*/
        0x1D: () => { this.ORA(this.RAM[this.AdrAbsoluteX]) }, /** ORA abs,X	*/
        0x1E: () => { this.ASL(this.RAM[this.AdrAbsoluteX]) }, /** ASL abs,X	*/
        0x20: () => { this.JSR(this.RAM[this.AdrAbsolute]) }, /** JSR abs	*/
        0x21: () => { this.AND(this.RAM[this.AdrXIndirect]) }, /** AND X,ind	*/
        0x24: () => { this.BIT(this.RAM[this.AdrZeropage]) }, /** BIT zpg	*/
        0x25: () => { this.AND(this.RAM[this.AdrZeropage]) }, /** AND zpg	*/
        0x26: () => { this.ROL(this.RAM[this.AdrZeropage]) }, /** ROL zpg	*/
        0x28: () => { this.PLP() }, /** PLP impl	*/
        0x29: () => { this.AND(this.nextByte) }, /** AND #      */
        0x2A: () => { this.ROL() }, /** ROL A      */
        0x2C: () => { this.BIT(this.RAM[this.AdrAbsolute]) }, /** BIT abs	*/
        0x2D: () => { this.AND(this.RAM[this.AdrAbsolute]) }, /** AND abs	*/
        0x2E: () => { this.ROL(this.RAM[this.AdrAbsolute]) }, /** ROL abs    */
        0x30: () => { this.BMI(this.RAM[this.AdrRelative]) }, /** BMI rel	*/
        0x31: () => { this.AND(this.RAM[this.AdrIndirectY]) }, /** AND ind,Y	*/
        0x35: () => { this.AND(this.RAM[this.AdrZeropageX]) }, /** AND zpg,X	*/
        0x36: () => { this.ROL(this.RAM[this.AdrZeropageX]) }, /** ROL zpg,X	*/
        0x38: () => { this.SEC() }, /** SEC impl	*/
        0x39: () => { this.AND(this.RAM[this.AdrAbsoluteY]) }, /** AND abs,Y	*/
        0x3D: () => { this.AND(this.RAM[this.AdrAbsoluteX]) }, /** AND abs,X	*/
        0x3E: () => { this.ROL(this.RAM[this.AdrAbsoluteX]) }, /** ROL abs,X	*/
        0x40: () => { this.RTI() }, /** RTI impl	*/
        0x41: () => { this.EOR(this.RAM[this.AdrXIndirect]) }, /** EOR X,ind	*/
        0x45: () => { this.EOR(this.RAM[this.AdrZeropage]) }, /** EOR zpg	*/
        0x46: () => { this.LSR(this.RAM[this.AdrZeropage]) }, /** LSR zpg	*/
        0x48: () => { this.PHA() }, /** PHA impl	*/
        0x49: () => { this.EOR(this.nextByte) }, /** EOR #	    */
        0x4A: () => { this.LSR() }, /** LSR A	    */
        0x4C: () => { this.JMP(this.RAM[this.AdrAbsolute]) }, /** JMP abs	*/
        0x4D: () => { this.EOR(this.RAM[this.AdrAbsolute]) }, /** EOR abs	*/
        0x4E: () => { this.LSR(this.RAM[this.AdrAbsolute]) }, /** LSR abs	*/
        0x50: () => { this.BVC(this.RAM[this.AdrRelative]) }, /** BVC rel	*/
        0x51: () => { this.EOR(this.RAM[this.AdrIndirectY]) }, /** EOR ind,Y	*/
        0x55: () => { this.EOR(this.RAM[this.AdrZeropageX]) }, /** EOR zpg,X	*/
        0x56: () => { this.LSR(this.RAM[this.AdrZeropageX]) }, /** LSR zpg,X	*/
        0x58: () => { this.CLI() }, /** CLI impl	*/
        0x59: () => { this.EOR(this.RAM[this.AdrAbsoluteY]) }, /** EOR abs,Y	*/
        0x5D: () => { this.EOR(this.RAM[this.AdrAbsoluteX]) }, /** EOR abs,X	*/
        0x5E: () => { this.LSR(this.RAM[this.AdrAbsoluteX]) }, /** LSR abs,X	*/
        0x60: () => { this.RTS() }, /** RTS impl	*/
        0x61: () => { this.ADC(this.RAM[this.AdrXIndirect]) }, /** ADC X,ind	*/
        0x65: () => { this.ADC(this.RAM[this.AdrZeropage]) }, /** ADC zpg	*/
        0x66: () => { this.ROR(this.RAM[this.AdrZeropage]) }, /** ROR zpg	*/
        0x68: () => { this.PLA() }, /** PLA impl	*/
        0x69: () => { this.ADC(this.nextByte) }, /** ADC #	    */
        0x6A: () => { this.ROR() }, /** ROR A	    */
        0x6C: () => { this.JMP(this.RAM[this.AdrIndirect]) }, /** JMP ind	*/
        0x6D: () => { this.ADC(this.RAM[this.AdrAbsolute]) }, /** ADC abs	*/
        0x6E: () => { this.ROR(this.RAM[this.AdrAbsolute]) }, /** ROR abs	*/
        0x70: () => { this.BVS(this.RAM[this.AdrRelative]) }, /** BVS rel	*/
        0x71: () => { this.ADC(this.RAM[this.AdrIndirectY]) }, /** ADC ind,Y	*/
        0x75: () => { this.ADC(this.RAM[this.AdrZeropageX]) }, /** ADC zpg,X	*/
        0x76: () => { this.ROR(this.RAM[this.AdrZeropageX]) }, /** ROR zpg,X	*/
        0x78: () => { this.SEI() }, /** SEI impl	*/
        0x79: () => { this.ADC(this.RAM[this.AdrAbsoluteY]) }, /** ADC abs,Y	*/
        0x7D: () => { this.ADC(this.RAM[this.AdrAbsoluteX]) }, /** ADC abs,X	*/
        0x7E: () => { this.ROR(this.RAM[this.AdrAbsoluteX]) }, /** ROR abs,X	*/
        0x81: () => { this.STA(this.RAM[this.AdrXIndirect]) }, /** STA X,ind	*/
        0x84: () => { this.STY(this.RAM[this.AdrZeropage]) }, /** STY zpg	*/
        0x85: () => { this.STA(this.RAM[this.AdrZeropage]) }, /** STA zpg	*/
        0x86: () => { this.STX(this.RAM[this.AdrZeropage]) }, /** STX zpg	*/
        0x88: () => { this.DEY() }, /** DEY impl	*/
        0x8A: () => { this.TXA() }, /** TXA impl	*/
        0x8C: () => { this.STY(this.RAM[this.AdrAbsolute]) }, /** STY abs	*/
        0x8D: () => { this.STA(this.RAM[this.AdrAbsolute]) }, /** STA abs	*/
        0x8E: () => { this.STX(this.RAM[this.AdrAbsolute]) }, /** STX abs	*/
        0x90: () => { this.BCC(this.RAM[this.AdrRelative]) }, /** BCC rel	*/
        0x91: () => { this.STA(this.RAM[this.AdrIndirectY]) }, /** STA ind,Y	*/
        0x94: () => { this.STY(this.RAM[this.AdrZeropageX]) }, /** STY zpg,X	*/
        0x95: () => { this.STA(this.RAM[this.AdrZeropageX]) }, /** STA zpg,X	*/
        0x96: () => { this.STX(this.RAM[this.AdrZeropageY]) }, /** STX zpg,Y	*/
        0x98: () => { this.TYA() }, /** TYA impl	*/
        0x99: () => { this.STA(this.RAM[this.AdrAbsoluteY]) }, /** STA abs,Y	*/
        0x9A: () => { this.TXS() }, /** TXS impl	*/
        0x9D: () => { this.STA(this.RAM[this.AdrAbsoluteX]) }, /** STA abs,X	*/
        0xA0: () => { this.LDY(this.nextByte) }, /** LDY #	    */
        0xA1: () => { this.LDA(this.RAM[this.AdrXIndirect]) }, /** LDA X,ind	*/
        0xA2: () => { this.LDX(this.nextByte) }, /** LDX #	    */
        0xA4: () => { this.LDY(this.RAM[this.AdrZeropage]) }, /** LDY zpg	*/
        0xA5: () => { this.LDA(this.RAM[this.AdrZeropage]) }, /** LDA zpg	*/
        0xA6: () => { this.LDX(this.RAM[this.AdrZeropage]) }, /** LDX zpg	*/
        0xA8: () => { this.TAY() }, /** TAY impl	*/
        0xA9: () => { this.LDA(this.nextByte) }, /** LDA #	    */
        0xAA: () => { this.TAX() }, /** TAX impl	*/
        0xAC: () => { this.LDY(this.RAM[this.AdrAbsolute]) }, /** LDY abs	*/
        0xAD: () => { this.LDA(this.RAM[this.AdrAbsolute]) }, /** LDA abs	*/
        0xAE: () => { this.LDX(this.RAM[this.AdrAbsolute]) }, /** LDX abs	*/
        0xB0: () => { this.BCS(this.RAM[this.AdrRelative]) }, /** BCS rel	*/
        0xB1: () => { this.LDA(this.RAM[this.AdrIndirectY]) }, /** LDA ind,Y	*/
        0xB4: () => { this.LDY(this.RAM[this.AdrZeropageX]) }, /** LDY zpg,X	*/
        0xB5: () => { this.LDA(this.RAM[this.AdrZeropageX]) }, /** LDA zpg,X	*/
        0xB6: () => { this.LDX(this.RAM[this.AdrZeropageY]) }, /** LDX zpg,Y	*/
        0xB8: () => { this.CLV() }, /** CLV impl	*/
        0xB9: () => { this.LDA(this.RAM[this.AdrAbsoluteY]) }, /** LDA abs,Y	*/
        0xBA: () => { this.TSX() }, /** TSX impl	*/
        0xBC: () => { this.LDY(this.RAM[this.AdrAbsoluteX]) }, /** LDY abs,X	*/
        0xBD: () => { this.LDA(this.RAM[this.AdrAbsoluteX]) }, /** LDA abs,X	*/
        0xBE: () => { this.LDX(this.RAM[this.AdrAbsoluteY]) }, /** LDX abs,Y	*/
        0xC0: () => { this.CPY(this.nextByte) }, /** CPY #	    */
        0xC1: () => { this.CMP(this.RAM[this.AdrXIndirect]) }, /** CMP X,ind	*/
        0xC4: () => { this.CPY(this.RAM[this.AdrZeropage]) }, /** CPY zpg	*/
        0xC5: () => { this.CMP(this.RAM[this.AdrZeropage]) }, /** CMP zpg	*/
        0xC6: () => { this.DEC(this.RAM[this.AdrZeropage]) }, /** DEC zpg	*/
        0xC8: () => { this.INY() }, /** INY impl	*/
        0xC9: () => { this.CMP(this.nextByte) }, /** CMP #	    */
        0xCA: () => { this.DEX() }, /** DEX impl	*/
        0xCC: () => { this.CPY(this.RAM[this.AdrAbsolute]) }, /** CPY abs	*/
        0xCD: () => { this.CMP(this.RAM[this.AdrAbsolute]) }, /** CMP abs	*/
        0xCE: () => { this.DEC(this.RAM[this.AdrAbsolute]) }, /** DEC abs	*/
        0xD0: () => { this.BNE(this.RAM[this.AdrRelative]) }, /** BNE rel	*/
        0xD1: () => { this.CMP(this.RAM[this.AdrIndirectY]) }, /** CMP ind,Y	*/
        0xD5: () => { this.CMP(this.RAM[this.AdrZeropageX]) }, /** CMP zpg,X	*/
        0xD6: () => { this.DEC(this.RAM[this.AdrZeropageX]) }, /** DEC zpg,X	*/
        0xD8: () => { this.CLD() }, /** CLD impl	*/
        0xD9: () => { this.CMP(this.RAM[this.AdrAbsoluteY]) }, /** CMP abs,Y	*/
        0xDD: () => { this.CMP(this.RAM[this.AdrAbsoluteX]) }, /** CMP abs,X	*/
        0xDE: () => { this.DEC(this.RAM[this.AdrAbsoluteX]) }, /** DEC abs,X	*/
        0xE0: () => { this.CPX(this.nextByte) }, /** CPX #	    */
        0xE1: () => { this.SBC(this.RAM[this.AdrXIndirect]) }, /** SBC X,ind	*/
        0xE4: () => { this.CPX(this.RAM[this.AdrZeropage]) }, /** CPX zpg	*/
        0xE5: () => { this.SBC(this.RAM[this.AdrZeropage]) }, /** SBC zpg	*/
        0xE6: () => { this.INC(this.RAM[this.AdrZeropage]) }, /** INC zpg	*/
        0xE8: () => { this.INX() }, /** INX impl	*/
        0xE9: () => { this.SBC(this.nextByte) }, /** SBC #	    */
        0xEA: () => { this.NOP() }, /** NOP impl	*/
        0xEC: () => { this.CPX(this.RAM[this.AdrAbsolute]) }, /** CPX abs	*/
        0xED: () => { this.SBC(this.RAM[this.AdrAbsolute]) }, /** SBC abs	*/
        0xEE: () => { this.INC(this.RAM[this.AdrAbsolute]) }, /** INC abs	*/
        0xF0: () => { this.BEQ(this.RAM[this.AdrRelative]) }, /** BEQ rel	*/
        0xF1: () => { this.SBC(this.RAM[this.AdrIndirectY]) }, /** SBC ind,Y	*/
        0xF5: () => { this.SBC(this.RAM[this.AdrZeropageX]) }, /** SBC zpg,X	*/
        0xF6: () => { this.INC(this.RAM[this.AdrZeropageX]) }, /** INC zpg,X	*/
        0xF8: () => { this.SED() }, /** SED impl	*/
        0xF9: () => { this.SBC(this.RAM[this.AdrAbsoluteY]) }, /** SBC abs,Y	*/
        0xFD: () => { this.SBC(this.RAM[this.AdrAbsoluteX]) }, /** SBC abs,X	*/
        0xFE: () => { this.INC(this.RAM[this.AdrAbsoluteX]) }, /** INC abs,X	*/
        0xFF: () => { console.log(this.A) }
    }


    

    static readonly InstructionOpcodes: {[instruction: string]: InstructionSignature} = {
        ADC: {
            immediate: 0x69,
            zeropage: 0x65,
            zeropageX: 0x75,
            absolute: 0x6D,
            absoluteX: 0x7D,
            absoluteY: 0x79,
            indirectX: 0x61,
            indirectY: 0x71,
        },
        AND: {
            immediate: 0x29,
            zeropage: 0x25,
            zeropageX: 0x35,
            absolute: 0x2D,
            absoluteX: 0x3D,
            absoluteY: 0x39,
            indirectX: 0x21,
            indirectY: 0x31,
        },
        ASL: {
            accumulator: 0x0A,
            zeropage: 0x06,
            zeropageX: 0x16,
            absolute: 0x0E,
            absoluteX: 0x1E,
        },
        BCC: {
            relative: 0x90,
        },
        BCS: {
            relative: 0xB0,
        },
        BEQ: {
            relative: 0xF0,
        },
        BIT: {
            zeropage: 0x24,
            absolute: 0x2C,
        },
        BMI: {
            relative: 0x30,
        },
        BNE: {
            relative: 0xD0,
        },
        BPL: {
            relative: 0x10,
        },
        BRK: {
            implied: 0x00,
        },
        BVC: {
            relative: 0x50,
        },
        BVS: {
            relative: 0x70,
        },
        CLC: {
            implied: 0x18,
        },
        CLD: {
            implied: 0xD8,
        },
        CLI: {
            implied: 0xB8,
        },
        CMP: {
            immediate: 0xC9,
            zeropage: 0xC5,
            zeropageX: 0xD5,
            absolute: 0xCD,
            absoluteX: 0xDD,
            absoluteY: 0xD9,
            indirectX: 0xC1,
            indirectY: 0xD1,
        },
        CPX: {
            immediate: 0xE0,
            zeropage: 0xE4,
            absolute: 0xEC,
        },
        CPY: {
            immediate: 0xC0,
            zeropage: 0xC4,
            absolute: 0xCC,
        },
        DEC: {
            zeropage: 0xC6,
            zeropageX: 0xD6,
            absolute: 0xCE,
            absoluteX: 0xDE,
        },
        DEX: {
            implied: 0xCA,
        },
        DEY: {
            implied: 0x88,
        },
        EOR: {
            immediate: 0x49,
            zeropage: 0x45,
            zeropageX: 0x55,
            absolute: 0x4D,
            absoluteX: 0x5D,
            absoluteY: 0x59,
            indirectX: 0x41,
            indirectY: 0x51,
        },
        INC: {
            zeropage: 0xE6,
            zeropageX: 0xF6,
            absolute: 0xEE,
            absoluteX: 0xFE,
        },
        INX: {
            implied: 0xE8,
        },
        INY: {
            implied: 0xC8,
        },
        JMP: {
            absolute: 0x4C,
            indirect: 0x6C,
        },
        JSR: {
            absolute: 0x20,
        },
        LDA: {
            immediate: 0xA9,
            zeropage: 0xA5,
            zeropageX: 0xB5,
            absolute: 0xAD,
            absoluteX: 0xBD,
            absoluteY: 0xB9,
            indirectX: 0xA1,
            indirectY: 0xB1,
        },
        LDX: {
            immediate: 0xA2,
            zeropage: 0xA6,
            zeropageY: 0xB6,
            absolute: 0xAE,
            absoluteY: 0xBE,
        },
        LDY: {
            immediate: 0xA0,
            zeropage: 0xA4,
            zeropageX: 0xB4,
            absolute: 0xAC,
            absoluteX: 0xBC,
        },
        LOG: {
            accumulator: 0xFF,
        },
        LSR: {
            accumulator: 0x4A,
            zeropage: 0x46,
            zeropageX: 0x56,
            absolute: 0x4E,
            absoluteX: 0x5E,
        },
        NOP: {
            implied: 0xEA,
        },
        ORA: {
            immediate: 0x09,
            zeropage: 0x05,
            zeropageX: 0x15,
            absolute: 0x0D,
            absoluteX: 0x1D,
            absoluteY: 0x19,
            indirectX: 0x01,
            indirectY: 0x11,
        },
        PHA: {
            implied: 0x48,
        },
        PHP: {
            implied: 0x08,
        },
        PLA: {
            implied: 0x68,
        },
        PLP: {
            implied: 0x28,
        },
        ROL: {
            accumulator: 0x2A,
            zeropage: 0x26,
            zeropageX: 0x36,
            absolute: 0x2E,
            absoluteX: 0x3E,
        },
        ROR: {
            accumulator: 0x6A,
            zeropage: 0x66,
            zeropageX: 0x76,
            absolute: 0x6E,
            absoluteX: 0x7E,
        },
        RTI: {
            implied: 0x40,
        },
        RTS: {
            implied: 0x60,
        },
        SBC: {
            immediate: 0xE9,
            zeropage: 0xE5,
            zeropageX: 0xF5,
            absolute: 0xED,
            absoluteX: 0xFD,
            absoluteY: 0xF9,
            indirectX: 0xE1,
            indirectY: 0xF1,
        },
        SEC: {
            implied: 0x38,
        },
        SED: {
            implied: 0xF8,
        },
        SEI: {
            implied: 0x78,
        },
        STA: {
            zeropage: 0x85,
            zeropageX: 0x95,
            absolute: 0x8D,
            absoluteX: 0x9D,
            absoluteY: 0x99,
            indirectX: 0x81,
            indirectY: 0x91,
        },
        STX: {
            zeropage: 0x86,
            zeropageY: 0x96,
            absolute: 0x8E,
        },
        STY: {
            zeropage: 0x84,
            zeropageX: 0x94,
            absolute: 0x8C,
        },
        TAX: {
            implied: 0xAA,
        },
        TAY: {
            implied: 0xA8,
        },
        TSX: {
            implied: 0xBA,
        },
        TXA: {
            implied: 0x8A,
        },
        TXS: {
            implied: 0x9A,
        },
        TYA: {
            implied: 0x98,
        }
    }
    static Instructions = Emu6502.InstructionOpcodes.Keys()

    LoadROMfromAssembly(assembly: string[]) {
        const code = assembly.map(l => l.trim()).filter(l => l !== '').map(l => l.split(' '))
        const allocs = code.filter(l => l[0] === 'alloc').map(alloc => alloc[1])
        let instructions = code.map(l => 
            l[0].startsWith('alloc') ? undefined :
            l[0].startsWith('@') ? new Instruction(l[1], l[2], l[0].slice(1)) :
            l.length === 2 ? new Instruction(l[0], l[1]) :
            undefined
            ).RemoveUndefined()
        
        instructions.forEach(i => {
            const pos = allocs.indexOf(i.opr)
            if (pos !== -1) i.opr = `$${pos.toString(16)}`
        })


        const identifiers = instructions.filter(i => i.label)

        identifiers.forEach((instr, i) => {
            instr

        })


        console.log(instructions)

        // this.LoadROMfromBasicAssembly(instructions)
    }

    private getInstructionLength(mode: AddressModes) {
        switch (mode) {
            case AddressModes.Absolute: return 3
            case AddressModes.AbsoluteX: return 3
            case AddressModes.AbsoluteY: return 3
            case AddressModes.Accumulator: return 1
            case AddressModes.Immediate: return 2
            case AddressModes.Implied: return 1
            case AddressModes.Indirect: return 3
            case AddressModes.IndirectX: return 2
            case AddressModes.IndirectY: return 2
            case AddressModes.Relative: return 2
            case AddressModes.Zeropage: return 2
            case AddressModes.ZeropageX: return 2
            case AddressModes.ZeropageY: return 2
        }
    }

    LoadROMfromBasicAssembly(assembly: Instruction[]) {
        this.ROM = new Uint8Array(assembly.flatMap((instr) => {
            if (Emu6502.Instructions.includes(instr.opc)) {
                const inst = Emu6502.InstructionOpcodes[instr.opc],
                    hexDigits = instr.opr.match(/\$[0-9A-F]+/)?.at(0) ?? '',
                    mode = instr.InstructionMode,
                    opcode: number | undefined = (mode === AddressModes.Zeropage ? inst[AddressModes.Relative] : undefined) ?? inst[mode]

                if (opcode === undefined) throw new AssemblerError(`Could not understand line '${instr.tuple}'`)

                if (hexDigits.length === 4) {
                    return [opcode,
                        hexDigits.slice(2).toInt(16), // LO
                        hexDigits.slice(0, 2).toInt(16)] // HI
                }
                else if (hexDigits.length === 2) {
                    return [opcode,
                        hexDigits.slice(0, 2).toInt(16)] // LO
                }
                else return [opcode]
            }
        }) as number[])

        this.ROM.forEach(short => short.toString(16).padStart(4, '0').Log())
    }
}

enum AddressModes {
    Accumulator,
    Absolute,
    AbsoluteX,
    AbsoluteY,
    Immediate,
    Implied,
    Indirect,
    IndirectX,
    IndirectY,
    Relative,
    Zeropage,
    ZeropageX,
    ZeropageY
}

class Instruction {
    constructor(public opc: string, public opr: string, public label?: string) {}
    get tuple() { return [this.opc, this.opr] }
    get InstructionMode(): AddressModes | undefined {
        const hexDigits = this.opr.RegexTest(/\$[0-9A-F]+/) ? this.opr.slice(this.opr.indexOf('$') + 1) : '',
            indexed = this.opr.includes('X') ? 'X' : this.opr.includes('Y') ? 'Y' : ''

        if (!this.opr || this.opr === '') { // accumulator || implied; 1 byte
            return AddressModes.Implied
        } else if (this.opr === 'A') {
            return AddressModes.Accumulator
        } else if (this.opr.startsWith('(')) { // indirect; 3 or 2 bytes
            return indexed === '' ? AddressModes.Indirect : indexed === 'X' ? AddressModes.IndirectX : AddressModes.IndirectY
        } else if (this.opr.startsWith('#')) { //immidiate; 2 bytes
            return AddressModes.Immediate
        } else if (hexDigits.length === 4) { //absolute; 3 bytes
            return indexed === '' ? AddressModes.Absolute : indexed === 'X' ? AddressModes.AbsoluteX : AddressModes.AbsoluteY
        } else if (hexDigits.length === 2) { // relative || zeropage; 2 bytes
            return indexed === 'X' ? AddressModes.ZeropageX : indexed === 'Y' ? AddressModes.ZeropageY : AddressModes.Zeropage // or relative
        }
        return undefined
    }
}

interface InstructionSignature {
    [AddressModes.Accumulator]?: number
    [AddressModes.Absolute]?: number
    [AddressModes.AbsoluteX]?: number
    [AddressModes.AbsoluteY]?: number
    [AddressModes.Immediate]?: number
    [AddressModes.Implied]?: number
    [AddressModes.Indirect]?: number
    [AddressModes.IndirectX]?: number
    [AddressModes.IndirectY]?: number
    [AddressModes.Relative]?: number
    [AddressModes.Zeropage]?: number
    [AddressModes.ZeropageX]?: number
    [AddressModes.ZeropageY]?: number
}

const AddressModeLengths = {
    [AddressModes.Accumulator]: 1,
    [AddressModes.Absolute]: 3,
    [AddressModes.AbsoluteX]: 3,
    [AddressModes.AbsoluteY]: 3,
    [AddressModes.Immediate]: 2,
    [AddressModes.Implied]: 1,
    [AddressModes.Indirect]: 3,
    [AddressModes.IndirectX]: 2,
    [AddressModes.IndirectY]: 3,
    [AddressModes.Relative]: 2,
    [AddressModes.Zeropage]: 2,
    [AddressModes.ZeropageX]: 2,
    [AddressModes.ZeropageY]: 2,
}

// const e = new Emu6502
// e.LoadROMfromAssembly(`
// alloc x
// alloc y
// alloc z

// LDA #$0
// STA x
// LDA #$1
// STA y

// LDA x
// LOG
// ADC y
// STA z
// LDA y
// STA x
// LDA z
// STA y

// LDA x
// CMP #255


// `.SplitLines())

// e.Execute()