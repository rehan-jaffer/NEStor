var ops = require('./opcodes.js');
var utility = require('./utility.js');
var ppu = require('./PPU.js');
const CYCLE_COUNT = 1000;

const LOGGING_ENABLED = true;
const MODE = "node";
// mode = browser

class Logger {
  constructor() {
      this.logging = LOGGING_ENABLED;
  }
  log(line, pc=null, flags) {
    if (this.logging) {
      if (pc) {
        console.log(pc.toString(16) + " " + line + "\t\t\t" + flags);
      } else {
        console.log(line)
      }
    }
  }
}

class WebLogger {
  constructor() {
    this.element = document.querySelector("#console");
  }
  log(line, pc=null, flags) {
    if (LOGGING_ENABLED) {
      if (pc) {
        this.element.append(pc.toString(16) + " " + line + "\t\t\t" + flags + "\r\n\r\n");
      } else {
        this.element.append(line + "\r\n")
      }
    }
  }
}

class CPU {

  constructor() {

    this.ppu = new ppu;
    this.cycles = CYCLE_COUNT;
    this.bus = Array;
    this.memory = new Memory;
    this.init_ram();
    this.registers = {PC: 0, SP: 0xFD, P:0, A:0, X: 0, Y: 0};
    this.flags = {carry: false, zero: false,
      interrupt_disable: true, decimal_mode: false,
      break_command: true, overflow: false, negative: false};
    this.running = false;
    this.cycles = 0;
    if (MODE == "browser") {
      this.logger = new WebLogger;
    } else {
      this.logger = new Logger;
    }
    this.stack = new Array;
    this.log("CPU Initialized");
  }

  init_ram() {

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

  read_bus() {
    return this.bus.pop();
  }

  write_bus(op) {
    return this.bus.push(op);
  }

  load_rom(rom) {
    this.rom = rom.prg_rom;
  }

  debug_flags() {

    return "A: " + this.registers.A.toString(16) + " X: " + this.registers.X.toString(16) + " Y: " + this.registers.Y.toString(16) + " P: " + this.status_byte().toString(16) + " SP: " + this.registers.SP.toString(16);

  }

  dump_bytes(addr, num) {

    for (let x=0;x<num;x++) {
      console.log((addr + x).toString(16) + ": " + this.fetch((addr+x)).toString(16));
    }

  }

  next_byte() {
    let nb1 = this.fetch(this.registers.PC+1);
    return nb1;
  }

  next_bytes() {
    let nb1 = this.fetch(this.registers.PC+1);
    let nb2 = this.fetch(this.registers.PC+2);
    let j = utility.Utility.merge_bytes(nb1, nb2);
    return j
  }

  log(cmd, cruft) {
    this.logger.log(cmd, this.registers.PC, this.debug_flags());
  }

  execute() {

    this.log("Beginning execution at " + this.registers.PC);
    this.running = true;

    while(this.running == true) {

      let opcode = this.fetch(this.registers.PC);
      /* replace this with opcode table as soon as it gets unwieldy */
      switch(opcode) {
      case 234:
        this.log('NOOP', this.registers.PC);
        this.flags.break_command = true;
        this.flags.interrupt_disable = true;
        this.registers.PC += 1;
        break;
      case 0x20:
        // push address of next operation onto the stack
        // then jump to subroutine location
          let nb1 = this.fetch(this.registers.PC+1);
          let nb2 = this.fetch(this.registers.PC+2);
          let j = utility.Utility.merge_bytes(nb1, nb2);
        this.log("JSR " + j, this.registers.PC);
        let bytes = utility.Utility.split_byte(this.registers.PC+3);
        this.stack.push(bytes[0]);
        this.stack.push(bytes[1]);
        this.registers.SP -= 2;
        this.registers.PC = j;
        break;
      case ops.TSX:
          this.log("TSX", this.registers.PC)
          this.registers.X = this.registers.SP;
          this.cycles -= 2;

          if (this.registers.X == 0) {
            this.flags.zero = true;
          }

          if (utility.Utility.bit(this.registers.X, 7) == 1) {
            this.flags.negative = true;
          }

          this.registers.PC++;
      break;
      case ops.TXS:
          this.log("TXS", this.registers.PC)
          this.registers.SP = this.registers.X;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.TYA:
          this.log("TYA", this.registers.PC)
          this.registers.A = this.registers.Y;
          this.cycles -= 2;
          if (this.registers.A == 0) {
            this.flags.zero = true;
          }

          if (utility.Utility.bit(this.registers.negative, 7) == 1) {
            this.flags.negative = true;
          }

          this.registers.PC++;
      break;
      case ops.TAY:
          this.log("TAY", this.registers.PC)
          this.registers.Y = this.registers.A;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.TAX:
          this.log("TAX", this.registers.PC)
          this.registers.X = this.registers.A;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.TXA:
          this.log("TXA", this.registers.PC)
          this.registers.A = this.registers.X;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.INY:
          this.log("INY", this.registers.PC)
          this.registers.Y++;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.DEY:
          this.log("DEY", this.registers.PC)
          this.registers.Y--;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.DEX:
          this.log("DEY", this.registers.PC)
          this.registers.Y--;
          this.cycles -= 2;
          this.registers.PC++;
      break;
      case ops.INX:
          this.log("INX", this.registers.PC)
          this.registers.Y++;
          this.cycles -= 2;
          this.registers.PC++;

      break;
      case ops.ROL_A:
        /* partial */
        this.log("ROL A", this.registers.PC);
        this.registers.A << 1;
        this.cycles -= 2;
        this.registers.PC++;
      break;
      case ops.LDX:
          // LDX
          this.log("LDX " + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.registers.X = this.next_byte();
          this.registers.PC = this.registers.PC+2;
          if (this.registers.X == 0) {
            this.flags.zero = true;
          }
          if (this.registers.X.toString(2)[7] == 1) {
            this.flags.negative = true;
          }
        break;
      case ops.LDX_ABS:
          // LDX
          this.log("LDX " + this.next_bytes(), this.registers.PC)
          this.cycles += 3;
 //         console.log(this.fetch(this.next_bytes()));
          this.registers.X = this.fetch(this.next_bytes());
          this.registers.PC += 3;
        break;
      case ops.LDA_ABS:
          // LDX
          this.log("LDA " + this.next_bytes(), this.registers.PC)
          this.registers.A = this.fetch(this.next_bytes());
          this.registers.PC += 3;
        break;
      case ops.JMP:
          let next_byte1 = this.fetch(this.registers.PC+1);
          let next_byte2 = this.fetch(this.registers.PC+2);
          let i = utility.Utility.merge_bytes(next_byte1, next_byte2);
          this.log("JMP " + i.toString(16), this.registers.PC);
          this.cycles += 3;
          this.registers.PC = i;
        break;
      case ops.STX:
          let addr = this.fetch(this.next_byte());
          this.set(addr, this.registers.X)
          this.log("STX " + addr, this.registers.PC);
          this.registers.PC += 2;
        break;
      case ops.STX_ABS:
          let addr3 = this.next_bytes();
          this.set(addr3, this.registers.X)
          this.log("STX " + addr3, this.registers.PC);
          this.registers.PC += 3;
        break;
      case ops.STY_ZP:
          let addr1 = this.fetch(this.registers.PC+1);
          this.set(addr1, this.registers.X)
          this.log("STY #" + addr1, this.registers.PC);
          this.registers.PC += 2;
        break;
      case ops.SEC:
          this.log("SEC", this.registers.PC);
          this.flags.carry = true;
          this.registers.PC++;
        break;
      case ops.BCS:
          let bcs_addr = this.registers.PC+2 + this.next_byte();
          this.log("BCS " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.carry == true) {
            this.log("- Branch taken", bcs_addr);
            this.registers.PC = bcs_addr;
          }
        break;
      case ops.CLC:
          this.log("CLC", this.registers.PC);
          this.flags.carry = false;
          this.registers.PC++;
      break;
      case ops.CLD:
          this.log("CLD", this.registers.PC);
          this.flags.decimal_mode = false;
          this.registers.PC++;
      break;
      case ops.CLV:
          this.log("CLD", this.registers.PC);
          this.flags.overflow = false;
          this.registers.PC++;
      break;
      case ops.PHA:
        this.log("PHA", this.registers.PC);
        this.stack.push(this.registers.A);
        this.registers.SP--;
       this.registers.PC++;
      break;
      case ops.PLP:
        this.log("PLP", this.registers.PC);
        let pflags = this.stack.pop();
        this.registers.SP++;
        let t = ("00000000" + pflags.toString(2)).substr(-8)
        this.flags.carry = ! t[0];
        this.flags.zero = ! t[1];
        this.flags.interrupt_disable = ! t[2];
        this.flags.decimal_mode = ! t[3];
        this.flags.break_command = ! t[4];
        this.flags.overflow = ! t[6];
        this.flags.negative = ! t[7];
        this.registers.PC++;
      break;
      case ops.BCC:
          let bcc_addr = this.registers.PC+2 + this.next_byte();
          this.log("BCC " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.carry == false) {
            this.log("- Branch taken", bcc_addr);
            this.registers.PC = bcc_addr;
          }
      break;
      case ops.LDA_IMM:
        this.log("LDA #$" + this.next_byte(), this.registers.PC)
        this.registers.A = this.next_byte();
        this.registers.PC += 2;
        if (this.registers.A == 0) {
          this.flags.zero = true;
        }
      break;
      case ops.LDA_ZP:
          this.log("LDA $" + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.registers.A = this.fetch(this.registers.PC+1);
          this.registers.PC += 2;
          if (this.registers.A == 0) {
            this.flags.zero = true;
          }
      break;
      case ops.BEQ:
          this.log("BEQ " + (this.next_byte() + this.registers.PC + 2).toString(16), this.registers.PC);
          if (this.flags.zero == true) {
//            this.log("Branch taken", bvs_addr);
            this.registers.PC += 2 + this.next_byte();
          } else {
            this.registers.PC += 2;
          }
      break;
      case ops.BNE:
          this.log("BNE " + (this.next_byte() + this.registers.PC + 2).toString(16), this.registers.PC);
          if (this.flags.zero == false) {
//            this.log("Branch taken", bvs_addr);
            this.registers.PC += 2 + this.next_byte();
          } else {
            this.registers.PC += 2;
          }
      break;
      case ops.STA_ZP:
          this.log("STA #" + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.set(this.next_byte(), this.registers.A);
          this.registers.PC = this.registers.PC+2;
      break;
      case ops.BIT:
          this.log("BIT #" + this.next_byte(), this.registers.PC)
          let mem = this.next_byte();
          let r = (this.registers.A & mem).toString(2);
          let s = ("00000000" + r).substr(-8)
          this.flags.negative = !!s[7];
          this.flags.overflow = !!s[6];
          this.registers.PC += 2;
      break;
      case ops.BVS:
          let bvs_addr = this.registers.PC+2 + this.next_byte();
          this.log("BVS " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.overflow == true) {
            this.log("- Branch taken", bvs_addr);
            this.registers.PC = bvs_addr;
          }
      break;
      case ops.BVC:
          let bvc_addr = this.registers.PC+2 + this.next_byte();
          this.log("BVC " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.overflow == false) {
            this.log("- Branch taken", bvc_addr);
            this.registers.PC = bvc_addr;
          }
      break;
      case ops.BPL:
          let bpl_addr = this.registers.PC+2 + this.next_byte();
          this.log("BPL " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.negative == false) {
            this.log("- Branch taken", bpl_addr);
            this.registers.PC = bpl_addr;
          }
      break;
      case ops.RTS:
         let ret_addr = utility.Utility.merge_bytes(this.stack.pop(), this.stack.pop())
         this.registers.SP++;
         this.log("RTS " + ret_addr.toString(16), this.registers.PC)
         this.registers.PC = ret_addr;
      break;
      case ops.SEI:
        this.flags.interrupt_disable = true;
        this.log("SEI", this.registers.PC);
        this.registers.PC++;
      break;
      case ops.SED:
        this.flags.decimal_mode = true;
        this.log("SED", this.registers.PC);
        this.registers.PC++;
      break;
      case ops.PHP:
        this.log("PHP", this.registers.PC);
        this.registers.PC++;
        this.stack.push(this.status_byte());
        this.registers.SP--;
      break;
      case ops.PLA:
        let byte = this.stack.pop();
        this.registers.SP++;
        this.log("PLA", this.registers.PC);
        this.registers.A = byte;
        if (this.registers.A == 0) {
          this.flags.zero = true;
        }
        if (byte[7] == "1") {
          this.flags.negative = true;
        }
        this.registers.PC++;
      break;
      case ops.AND_IMM:
        this.registers.A = this.registers.A & this.next_byte();
        this.log("AND #" + this.next_byte(), this.registers.PC);
        if (this.registers.A == 0) {
          this.flags.zero = true;
        }
        if (this.registers.A.toString(2)[7] == 1) {
          this.flags.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.ADC_IMM:
        this.registers.A = this.registers.A + this.next_byte();
        this.log("BAD ADC #" + this.next_byte(), this.registers.PC);
        this.registers.PC += 2;
      break;
      case ops.SBC_IMM:
        this.registers.A = this.registers.A - this.next_byte();
        this.log("BAD SBC #" + this.next_byte(), this.registers.PC);
        this.registers.PC += 2;
      break;
      case ops.CMP_IMM:
        this.log("CMP #" + this.next_byte(), this.registers.PC);
        if (this.registers.A >= this.next_byte()) {
          this.flags.carry = true;
        } else if (this.registers.A == this.flags.zero) {
          this.flags.zero = true;
        } else if ((this.registers.A).toString(2)[7] == 1) {
          this.flags.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.CPY_IMM:
        this.log("CPY #" + this.next_byte(), this.registers.PC);
        let val2 = this.next_byte();
        if (this.registers.Y >= val2) {
          this.registers.carry = true;
        }
        if (this.registers.Y == val2) {
          this.registers.zero = true;
        }
        if (this.registers.Y < val2) {
          this.registers.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.CPX_IMM:
        this.log("CPX #" + this.next_byte(), this.registers.PC);
        let val = this.next_byte();
        if (this.registers.X >= val) {
          this.registers.carry = true;
        }
        if (this.registers.X == val) {
          this.registers.zero = true;
        }
        if (this.registers.X < val) {
          this.registers.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.LDY_IMM:
          this.log("LDY #" + this.next_byte(), this.registers.PC)
          this.registers.Y = this.next_byte();
          this.registers.PC += 2;
      break;
      case ops.BMI:
        this.log("BMI " + this.next_byte(), this.registers.PC);
        if (this.flags.negative == true) {
          this.registers.PC += this.next_byte() + 2;
        } else {
          this.registers.PC += 2;
        }
      break;
      case ops.ORA_IMM:
        this.registers.A = this.registers.A | this.next_byte();
        if (this.registers.A == 0) {
          this.flags.zero = true;
        }
        if (this.registers.A.toString(2)[7] == 1) {
          this.flags.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.EOR_IMM:
        this.registers.A = this.registers.A ^ this.next_byte();
        if (this.registers.A == 0) {
          this.flags.zero = true;
        }
        if (this.registers.A.toString(2)[7] == 1) {
          this.flags.negative = true;
        }
        this.registers.PC += 2;
      break;
      case ops.LSR_A:
        /* partial */
        this.log("LSR A", this.registers.PC);
        this.registers.A >>> 1;
        this.registers.PC++;
      break;
      case ops.ASL_A:
        /* partial */
        this.log("LSR A", this.registers.PC);
        this.registers.A *= 2;
        this.registers.PC++;
      break;
      case ops.ROR_A:
        /* partial */
        this.log("ROR A", this.registers.PC);
        this.registers.A >> 1;
        this.registers.PC++;
      break;
      default:
        this.log('Unimplemented opcode ' + ops.op_table[opcode] + " at " + this.registers.PC.toString(16));
        process.exit();
        break;
      }
      
    }
  }

  get_reset_vector() {

    let reset1 = this.fetch(0xFFFC);
    let reset2 = this.fetch(0xFFFD);

    return utility.Utility.merge_bytes(reset1, reset2);

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
    let binary_digits = status.map((s) => + s)
    let byte = parseInt(binary_digits.join(''), 2);
    return byte;
  }

  reset() {

    let vec = this.get_reset_vector();

    this.registers.SP = 0xFD;
    this.registers.A = 0;
    this.registers.X = 0;
    this.registers.Y = 0;
    this.registers.PC = 0xC000;

    this.flags.carry = false;
    this.flags.zero = false;
    this.flags.interrupt_disable = true;
    this.flags.decimal_mode = false;
    this.flags.break_Command = true;
    this.flags.overflow = false;
    this.flags.negative = false;
    this.operations = [];
//    this.stack.push(0xFF);
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
//        console.log("SNEAKIER STACK PUSH");
      }
    }
  }

}

class Memory {
  constructor() {

  }
  memsize() {
    console.log(this.rom[this.rom.byteLength]);
    return this.rom.byteLength + 0xC000;
  }
  load_rom(rom) {
    this.rom = rom;
  }

  store(addr) {

  }
}

module.exports = CPU;
