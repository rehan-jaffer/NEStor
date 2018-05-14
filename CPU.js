	var ops = require('./opcodes.js');

function merge_bytes(b1, b2) {
  return parseInt(("00" + b2.toString(16)).substr(-2) + ("00" + b1.toString(16)).substr(-2), 16);
}


const LOGGING_ENABLED = true;

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
    this.stack = new Array;
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

  next_byte() {
    let nb1 = this.memory.fetch(this.registers.PC+1);
    return nb1;
  }

  next_bytes() {
    let nb1 = this.memory.fetch(this.registers.PC+1);
    let nb2 = this.memory.fetch(this.registers.PC+2);
    let j = merge_bytes(nb1, nb2);
    return j
  }

  execute() {

    this.logger.log("Beginning execution at " + this.registers.PC);
    this.running = true;

    while(this.running == true) {

      let opcode = this.memory.fetch(this.registers.PC);
      /* replace this with opcode table as soon as it gets unwieldy */
      switch(opcode) {
      case 234:
        this.logger.log('NOOP', this.registers.PC);
        this.flags.break_command = true;
        this.interrupt = true;
        this.registers.PC += 1;
        break;
      case 1:
        break;
      case 165:
          this.dump_bytes(this.registers.PC, 5);
        break;
      case 0x20:
        // push address of next operation onto the stack
        this.stack.push(this.registers.PC+3);
        // then jump to subroutine location
          let nb1 = this.memory.fetch(this.registers.PC+1);
          let nb2 = this.memory.fetch(this.registers.PC+2);
          let j = merge_bytes(nb1, nb2);
        this.logger.log("JSR " + j, this.registers.PC);
        this.registers.PC = j;
        break;
      case ops.LDX:
          // LDX
          this.logger.log("LDX " + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.registers.X = this.next_byte();;
          this.registers.PC = this.registers.PC+2;
        break;
      case ops.JMP:
          let next_byte1 = this.memory.fetch(this.registers.PC+1);
          let next_byte2 = this.memory.fetch(this.registers.PC+2);
          let i = merge_bytes(next_byte1, next_byte2);
          this.logger.log("JMP " + i.toString(16), this.registers.PC);
          this.cycles += 3;
          this.registers.PC = i;
        break;
      case ops.STX:
          let addr = this.memory.fetch(this.registers.PC+1);
          this.memory.set(addr, this.registers.X)
          this.logger.log("STX " + addr, this.registers.PC);
          this.registers.PC += 2;
        break;
      case ops.SEC:
          this.logger.log("SEC", this.registers.PC);
          this.flags.carry = true;
          this.registers.PC++;
        break;
      case ops.BCS:
          let bcs_addr = this.registers.PC+2 + this.next_byte();
          this.logger.log("BCS " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.carry == true) {
            this.logger.log("- Branch taken", bcs_addr);
            this.registers.PC = bcs_addr;
          }
        break;
      case ops.CLC:
          this.logger.log("CLC", this.registers.PC);
          this.flags.carry = false;
          this.registers.PC++;
      break;
      case ops.CLD:
          this.logger.log("CLD", this.registers.PC);
          this.flags.decimal = false;
          this.registers.PC++;
      break;
      case ops.CLV:
          this.logger.log("CLD", this.registers.PC);
          this.flags.overflow = false;
          this.registers.PC++;
      break;
      case ops.PHA:
        this.logger.log("PHA", this.registers.PC);
        this.stack.push(this.registers.A)
        this.registers.PC++;
      break;
      case ops.PLP:
        this.logger.log("PLP", this.registers.PC);
        let pflags = this.stack.pop();
        let t = ("00000000" + pflags.toString(2)).substr(-8)
        this.flags.carry = ! t[0];
        this.flags.zero = ! t[1];
        this.interrupt = ! t[2];
        this.flags.decimal = ! t[3];
        this.flags.break_command = ! t[4];
        this.flags.overflow = ! t[6];
        this.flags.negative = ! t[7];
        this.registers.PC++;
      break;
      case ops.BCC:
          let bcc_addr = this.registers.PC+2 + this.next_byte();
          this.logger.log("BCC " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.carry == false) {
            this.logger.log("- Branch taken", bcc_addr);
            this.registers.PC = bcc_addr;
          }
      break;
      case ops.LDA_ZP:
          this.logger.log("LDA #" + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.registers.A = this.memory.fetch(this.registers.PC+1);
          this.registers.PC = this.registers.PC+2;
          if (this.registers.A == 0) {
            this.flags.zero = true;
          }
      break;
      case ops.BEQ:
          this.logger.log("BEQ " + (this.next_byte() + this.registers.PC + 2).toString(16), this.registers.PC);
          if (this.flags.zero == true) {
//            this.logger.log("Branch taken", bvs_addr);
            this.registers.PC += 2 + this.next_byte();
          } else {
            this.registers.PC += 2;
          }
      break;
      case ops.BNE:
          this.logger.log("BNE " + (this.next_byte() + this.registers.PC + 2).toString(16), this.registers.PC);
          if (this.flags.zero == false) {
//            this.logger.log("Branch taken", bvs_addr);
            this.registers.PC += 2 + this.next_byte();
          } else {
            this.registers.PC += 2;
          }
      break;
      case ops.STA_ZP:
          this.logger.log("STA #" + this.next_byte(), this.registers.PC)
          this.cycles += 3;
          this.memory.set(this.next_byte(), this.registers.A);
          this.registers.PC = this.registers.PC+2;
      break;
      case ops.BIT:
          this.logger.log("BIT #" + this.next_byte(), this.registers.PC)
          let mem = this.next_byte();
          let r = (this.registers.A & mem).toString(2);
          let s = ("00000000" + r).substr(-8)
          this.flags.negative = !!s[7];
          this.flags.overflow = !!s[6];
          this.registers.PC += 2;
      break;
      case ops.BVS:
          let bvs_addr = this.registers.PC+2 + this.next_byte();
          this.logger.log("BVS " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.overflow == true) {
            this.logger.log("- Branch taken", bvs_addr);
            this.registers.PC = bvs_addr;
          }
      break;
      case ops.BVC:
          let bvc_addr = this.registers.PC+2 + this.next_byte();
          this.logger.log("BVC " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.overflow == false) {
            this.logger.log("- Branch taken", bvc_addr);
            this.registers.PC = bvc_addr;
          }
      break;
      case ops.BPL:
          let bpl_addr = this.registers.PC+2 + this.next_byte();
          this.logger.log("BPL " + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
          this.registers.PC += 2;
          if (this.flags.negative == false) {
            this.logger.log("- Branch taken", bpl_addr);
            this.registers.PC = bpl_addr;
          }
      break;
      case ops.RTS:
         let ret_addr = this.stack.pop()
         this.logger.log("RTS " + ret_addr.toString(16), this.registers.PC)
         this.registers.PC = ret_addr;
      break;
      case ops.SEI:
        this.interrupt = true;
        this.logger.log("SEI", this.registers.PC);
        this.registers.PC++;
      break;
      case ops.SED:
        this.flags.decimal = true;
        this.logger.log("SED", this.registers.PC);
        this.registers.PC++;
      break;
      case ops.PHP:
        this.logger.log("PHP", this.registers.PC);
        this.registers.PC++;
        this.stack.push(this.status_byte());
      break;
      case ops.PLA:
        let byte = this.stack.pop();
        this.logger.log("PLA", this.registers.PC);
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
        this.logger.log("AND #" + this.next_byte(), this.registers.PC);
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
        this.logger.log("BAD ADC #" + this.next_byte(), this.registers.PC);
        this.registers.PC += 2;
      break;
      case ops.CMP_IMM:
        this.logger.log("CMP #" + this.next_byte(), this.registers.PC);
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
        this.logger.log("CPY #" + this.next_byte(), this.registers.PC);
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
        this.logger.log("CPX #" + this.next_byte(), this.registers.PC);
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
          this.logger.log("LDY #" + this.next_byte(), this.registers.PC)
          this.registers.Y = this.next_byte();;
          this.registers.PC += 2;
      break;
      case ops.BMI:
        this.logger.log("BMI " + this.next_byte(), this.registers.PC);
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
      default:
        this.logger.log('Unimplemented opcode ' + ops.op_table[opcode] + " at " + this.registers.PC.toString(16));
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

  status_byte() {

    let status = new Array;
    status.push(this.flags.carry)
    status.push(this.flags.zero)
    status.push(this.interrupt)
    status.push(this.flags.decimal)
    status.push(this.flags.break_command)
    status.push(true)
    status.push(this.flags.overflow)
    status.push(this.flags.negative)
    let byte = parseInt(status.map((s) => + s).join(''), 2);
    return byte;
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
  memsize() {
    return this.rom.byteLength + 0xC000;
  }
  load_rom(rom) {
    this.rom = rom;
  }
  set(loc, value) {
    if(loc >= 0 && loc < 0x7FF) {
      this.ram[loc] = value;
    }
  }
  fetch(addr) {
    if(addr >= 0 && addr < 0x7FF) {
      return this.ram[addr];
    } else if (addr >= 0x800 && addr < 0x0FFF) {
      return this.ram[addr-0x800];
    } else if (addr >= 0x1000 && addr < 0x17FF) {
      return this.ram[addr-0x1000];
    } else if (addr >= 0x1800 && addr < 0x1FFF) {
      return this.ram[addr-0x1800];
    } else if (addr >= 0x2000 && addr < 0x2007) {
      // NES PPU registers
    } else if (addr >= 0x2008 && addr < 0x3FFF) {
      // Mirrors of $2000-2007
    } else if (addr >= 0x4000 && addr < 0x4017) {
      // NES APU and I/O registers
    } else if (addr >= 0x4018 && addr < 0x401F) {
      // APU and I/O functionality
    } else if (addr > 0x4020 && addr < 0xFFFF) {
      if (addr >= 0xC000 && addr < 0xFFFF) {
        return this.rom[addr-0xC000];
      }
    }

  }
  store(addr) {

  }
}

module.exports = CPU;
