function merge_bytes(b1, b2) {
  return parseInt(b2.toString(16) + b1.toString(16), 16);
}


const LOGGING_ENABLED = true;

const LDX = 0xA2;
const JMP = 0x4C;
const STX = 0x86;

class Logger {
  constructor() {
      this.logging = LOGGING_ENABLED;
  }
  log(line, pc=null) {
    if (this.logging) {
      if (pc) {
        console.log(pc.toString(16) + " " + line);
      } else {
        console.log(line)
      }
    }
  }
}

class CPU {

  constructor() {
    this.memory = new Memory;
    /* A - Accumulator Register, byte-wide
    X - Index register, byte-wide
    Y - Index register, byte-wide
    S - Stack pointer, byte-wide
    P - Status register, byte-wide */
    this.registers = {PC: 0, SP: 0, P:0, A:0, X: 0, Y: 0};
    this.flags = {carry: false, zero: false,
      interrupt_disable: true, decimal_mode: false,
      break_command: false, overflow: false, negative: false};
    this.interrupt = null;
    this.running = false;
    this.cycles = 0;
    this.logger = new Logger;
    this.logger.log("CPU Initialized");
  }

  load_rom(rom) {
    this.memory.load_rom(rom);
  }

  dump_bytes(addr, num) {

    for (let x=0;x<num;x++) {
      console.log((addr + x).toString(16) + ": " + this.memory.fetch((addr+x)).toString(16));
    }

  }

  execute() {

    this.logger.log("Beginning execution at " + this.registers.PC);
    this.running = true;

    while(this.running == true) {

      let opcode = this.memory.fetch(this.registers.PC);
      /* replace this with opcode table as soon as it gets unwieldy */
      switch(opcode) {
      case 0:
        this.logger.log('NOOP');
        this.flags.break_command = true;
        this.interrupt = true;
        this.registers.PC += 2;
        break;
      case 1:
        break;
      case 8:
        break;
      case 165:
          this.dump_bytes(this.registers.PC, 5);
        break;
      case LDX:
          // LDX
          this.logger.log("LDX")
          this.registers.PC = this.registers.PC + 2;
        break;
      case JMP:
          let next_byte1 = this.memory.fetch(this.registers.PC+1);
          let next_byte2 = this.memory.fetch(this.registers.PC+2);
          let i = merge_bytes(next_byte1, next_byte2);
          this.logger.log("JMP " + i, this.registers.PC);
          this.registers.PC = i;
        break;
      case STX:
          this.logger.log("STX", this.registers.PC);
          this.registers.PC++;
        break;
      default:
        this.logger.log('Unimplemented opcode ' + opcode);
        process.exit();
        break;
      }


    }
  }

  get_reset_vector() {

    let reset1 = this.memory.fetch(0xFFFC);
    let reset2 = this.memory.fetch(0xFFFD);
    // process.exit();
  }

  reset() {

    this.get_reset_vector();

    this.registers.S = 0xFD;
    this.registers.A = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.PC = 0xC000;

    this.flags.carry = false;
    this.flags.zero = false;
    this.flags.interrupt_disable = true;
    this.flags.decimal_mode = false;
    this.flags.break_Command = false;
    this.flags.overflow = false;
    this.flags.negative = false;
    this.operations = [];
  }

}

class Memory {
  constructor() {
    this.ram = Array(65536);
    // initialize 2KB of Internal RAM
    for(let i=0; i < 0x2000; i++) {
      this.ram[i] = 0xFF;
    }
  
    // All others set to 0
    for(let i=0x2000; i <= 0x8000; i++) {
      this.ram[i] = 0;
    }

  }
  load_rom(rom) {
    this.rom = rom;
  }
  fetch(addr) {
    if(addr > 0 && addr < 0x7FF) {
      return this.ram[addr];
      // internal RAM
    } else if (addr >= 0x800 && addr < 0x0FFF) {
      // mirror 1
    } else if (addr >= 0x1000 && addr < 0x17FF) {
      // mirror 2
    } else if (addr >= 0x1800 && addr < 0x1FFF) {
      // mirror 3
    } else if (addr >= 0x2000 && addr < 0x2007) {
      // NES PPU registers
    } else if (addr >= 0x2008 && addr < 0x3FFF) {
      // Mirrors of $2000-2007
    } else if (addr >= 0x4000 && addr < 0x4017) {
      // NES APU and I/O registers
    } else if (addr >= 0x4018 && addr < 0x401F) {
      // APU and I/O functionality
    } else if (addr > 0x4020 && addr < 0xFFFF) {
      if (addr >= 0xC000 && addr < 0xDFFF) {
        return this.rom[addr-0xC000];
      }
    }

  }
  store(addr) {

  }
}

module.exports = CPU;
