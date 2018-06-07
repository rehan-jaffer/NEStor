var ops = require('./opcodes.js');
var utility = require('./utility.js');
var ppu = require('./PPU.js');
var logging = require('./logging.js');
var operations = require('./ops.js');
var optable = require('./optable.js');

const CYCLE_COUNT = 1000;
const LOGGING_ENABLED = true;
const MODE = "node";

const MEM_INTERNAL_RAM_START = 0x0;
const MEM_RAM_MIRROR_1_START = 0x0800;
const MEM_RAM_MIRROR_2_START = 0x1000;
const MEM_RAM_MIRROR_3_START = 0x1800;
const MEM_PPU_REGISTERS_START = 0x2000;
const MEM_PPU_MIRROR_1_START = 0x2008;
const MEM_APU_REGISTERS_START = 0x4000;
const MEM_TEST_MODE_START = 0x4018;
const MEM_ROM_START = 0x4020;
const MEM_PRG_ROM_START = 0xC000;
const RESET_VECTOR_START = 0xFFFC;
const RESET_VECTOR_END = 0xFFFC;
const RAM_SIZE_BYTES =  2048;
const INITIAL_ADDRESS = 0xC000;
const INITIAL_STACK_POINTER = 0xFD;
const VECTORS = {0xFFFC: [0x04,0xC0]};

class CPU {

  constructor(log_enabled=true) {

    this.ppu = new ppu;
    this.cycles = CYCLE_COUNT;
    this.init_ram();
    this.registers = {PC: 0, SP: 0xFD, P:0, A:0, X: 0, Y: 0};
    this.flags = {carry: false, zero: false,
      interrupt_disable: true, decimal_mode: false,
      break_command: true, overflow: false, negative: false};
    this.running = false;
    this.cycles = 0;

    this.logger = (MODE == "browser") ? new logging.WebLogger : new logging.Logger;

    this.logging = log_enabled;

    this.operations = operations;
    this.stack = new Array;
    this.log("CPU Initialized");

  }

  init_ram() {

    this.ram = new Array(RAM_SIZE_BYTES);

    for(let i=0; i < 0x2000; i++) {
      this.ram[i] = 0xFF;
    }

    for(let i=0x2000; i <= 0x8000; i++) {
      this.ram[i] = 0;
    }

  }

  set_flags(pflags) {
        let t = ("00000000" + pflags.toString(2)).substr(-8)
        this.flags.carry = ! t[0];
        this.flags.zero = ! t[1];
        this.flags.interrupt_disable = ! t[2];
        this.flags.decimal_mode = ! t[3];
        this.flags.break_command = ! t[4];
        this.flags.overflow = ! t[6];
        this.flags.negative = ! t[7];
  }

  update_flags(flags, operand) {

    flags.forEach((flag) => {
      switch(flag) {
        case 'UN':
          let t = ("00000000" + this.registers[operand].toString(2)).substr(-8)
          if (utility.bit(t, 0) == 1) {
            this.flags.negative = true;
          } else {
            this.flags.negative = false;
          }
        break;
        case 'UV':
            this.flags.overflow = true;
        break;
        case 'UZ':
          if (this.registers[operand] == 0) {
            this.flags.zero = true;
          } else {
            this.flags.zero = false;
          }
        break;
        case 'CC':
          this.flags.carry = false;
        break;
        case 'CD':
          this.flags.decimal = false;
        break;
        case 'CI':
          this.flags.interrupt_disable = false;
        break;
        case 'CV':
          this.flags.overflow = false;
        break;
      }
    })

  }

  direct_load(code) {

    this.rom = code;

  }

  load_rom(rom) {
    this.rom = rom.prg_rom;
  }

  debug_flags() {

    return "[A: " + this.registers.A.toString(16)
         + " X: " + this.registers.X.toString(16)
         + " Y: " + this.registers.Y.toString(16)
         + " P: " + this.status_byte().toString(16)
         + " SP: " + this.registers.SP.toString(16)
         + " CYC: " + (this.cycles % 400) + "]";

  }

  next_byte() {
    let nb1 = this.fetch(this.registers.PC+1);
    return nb1;
  }

  /* refactor this to have memory rw and rdw */

  next_bytes() {
    let nb1 = this.fetch(this.registers.PC+1);
    let nb2 = this.fetch(this.registers.PC+2);
    return utility.merge_bytes(nb1, nb2);
  }

  log(cmd, cruft) {
    if (this.logging == true)
      this.logger.log(cmd, this.registers.PC, this.debug_flags());
  }

  execute(instr_count = null) {

    this.log("Beginning execution at " + this.registers.PC);
    this.running = true;

    while(this.running == true) {

      let opcode = this.fetch(this.registers.PC);

      if (!opcode) {
        break;
      }

      if (typeof optable[opcode] === "undefined" || typeof optable[opcode].op === "undefined") {
        console.log("Unimplemented opcode: " + opcode.toString(16) + " at " + this.registers.PC.toString(16));
        process.exit();
      }

      optable[opcode].op.bind(this).call();

      this.update_flags(optable[opcode].flags || [], optable[opcode].operand || "");

      this.cycles += (optable[opcode].cycles + optable[opcode].bytes);

      if (!optable[opcode].actions || !optable[opcode].actions.includes("NO_UPDATE_PC")) {
        this.registers.PC += optable[opcode].bytes;
      }

      this.registers.P = this.status_byte();

      if (instr_count && --instr_count == 0) {
        this.running = false;
      } 

    }
  }

  get_reset_vector() {

    let reset1 = this.fetch(0xFFFC);
    let reset2 = this.fetch(0xFFFD);

    return utility.merge_bytes(reset1, reset2);

  }

  status_byte() {

    let status = new Array;
    status.push(this.flags.carry)
    status.push(this.flags.zero)
    status.push(this.flags.interrupt_disable)
    status.push(this.flags.decimal_mode)
    status.push(this.flags.break_command)
    status.push(true)
    status.push(this.flags.overflow)
    status.push(this.flags.negative)
    let binary_digits = status.map((s) => + s).reverse();
    let byte = parseInt(binary_digits.join(''), 2);
    return byte;
  }

  reset() {

    let vec = this.get_reset_vector();

    this.registers.SP = INITIAL_STACK_POINTER;
    this.registers.A = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.PC = INITIAL_ADDRESS;

    // set up initial NES flags

    this.flags.carry = false;
    this.flags.zero = false;
    this.flags.interrupt_disable = true;
    this.flags.decimal_mode = false;
    this.flags.break_command = false;
    this.flags.overflow = false;
    this.flags.negative = false;

  }

   read(addr, n=1) {

    if (addr < 0) {
      throw "requested negative memory address";
    }

    switch (true) {
      case (addr < MEM_RAM_MIRROR_1_START):
          this.ram.slice(addr, n);
        break;
      case (addr < MEM_RAM_MIRROR_2_START):
          this.ram.slice(addr, n);
        break;
      case (addr < MEM_RAM_MIRROR_3_START):
          this.ram.slice(addr, n);
      break;
      case (addr < MEM_PPU_REGISTERS_START):
        this.ram.slice(addr, n);
      break;
      case (addr < MEM_PPU_MIRROR_1_START):
        // do ppu stuff
      case (addr < MEM_APU_REGISTERS_START):
        // do ppu stuff, mirrored
      break;
      case (addr < MEM_TEST_MODE_START):
        // do apu stuff
      break;
      case (addr < MEM_ROM_START):
        // test mode stuff
      break;
      case (addr < MEM_END):
        if (addr >= 0xC000 && addr < 0xFFFA) {
          return this.rom[(addr-0xC000)];
        }
      break;
    }
   }

  fetch(addr) {
    if(addr >= 0 && addr <= 0x7FF) {
      // 0000-00FF Zero-paged region
      // 0100-01FF - Stack Memory
      if (addr >= 0x0100 && addr <= 0x01FF) {
      }
      return this.ram[addr];
    } else if (addr >= 0x800 && addr < 0x0FFF) {
      // mirrors RAM
      return this.ram[addr-0x800];
    } else if (addr >= 0x1000 && addr < 0x17FF) {
      // mirrors RAM
      return this.ram[addr-0x1000];
    } else if (addr >= 0x1800 && addr < 0x1FFF) {
      // mirrors RAM
      return this.ram[addr-0x1800];
    } else if (addr >= 0x2000 && addr < 0x2007) {
      // NES PPU registers
      let self = this;
      let PPU_OPS = {0x2000: () => { }, // ppu ctrl
       0x2001: () => { }, // ppu mask
       0x2002: () => { return self.ppu.status }, // ppu status
       0x2003: () => { }, // oama addr
       0x2004: () => { }, // ppu scroll
       0x2005: () => { }, // ppu addr
       0x2006: () => { }, // ppu data
       0x2007: () => { }, // oam dma
       0x4014: () => { }}
       console.log(PPU_OPS[addr]());
       return PPU_OPS[addr]();
    } else if (addr >= 0x2008 && addr < 0x3FFF) {
      // Mirrors of $2000-2007
    } else if (addr >= 0x4000 && addr < 0x4017) {
      // NES APU and I/O registers
    } else if (addr >= 0x4018 && addr < 0x401F) {
      // APU and I/O functionality
    } else if (addr > 0x4020 && addr < 0xFFFF) {
      if (addr >= 0xC000 && addr < 0xFFFA) {
        return this.rom[(addr-0xC000)];
      }

        if (addr == 0xFFFC) {
          return 0x04;
        } else if (addr = 0xFFFD) {
          return 0xC0;
        }
    }

  }

  set(loc, value) {
    if(loc >= 0 && loc < 0x7FF) {
      this.ram[loc] = value;
      if (loc >= 0x0100 && loc <= 0x01FF) {
      }
    }
  }

}

module.exports = CPU;
