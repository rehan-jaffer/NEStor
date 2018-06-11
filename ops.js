var ops = require('./opcodes.js');
var utility = require('./utility.js');

var operations = {
  234: function() {
    this.log('NOOP', this.registers.PC);
    this.flags.break_command = true;
    this.flags.interrupt_disable = true;
    this.registers.PC += 1;
  },
  NOP: function() {
    this.log('NOP');
  },
  JSR_ABS: function() {
    // push address of next operation onto the stack
    // then jump to subroutine location
    let j = this.next_bytes();
    this.log('JSR ' + (j).toString(16), this.registers.PC);
    let bytes = utility.split_byte((this.registers.PC+3));
    this.stack.push(bytes[0]);
    this.stack.push(bytes[1]);
    this.registers.SP -= 2;
    this.registers.PC = j;
  },
  TSX: function() {
    this.log('TSX', this.registers.PC);
    this.registers.X = this.registers.SP;
  }, 
  TXS: function() {
    this.log('TXS', this.registers.PC);
    this.registers.SP = this.registers.X;
  },
  TYA: function() {
    this.log('TYA', this.registers.PC);
    this.registers.A = this.registers.Y;
  },
  TAY: function() {
    this.log('TAY', this.registers.PC);
    this.registers.Y = this.registers.A;
  },
  TAX: function() {
    this.log('TAX', this.registers.PC);
    this.registers.X = this.registers.A;
  },
  TXA: function() {
    this.log('TXA', this.registers.PC);
    this.registers.A = this.registers.X;
  },
  INY: function() {
    this.log('INY', this.registers.PC);
    this.registers.Y++;
  },
  DEY: function() {
    this.log('DEY', this.registers.PC);
    this.registers.Y--;
  },
  DEX: function() {
    this.log('DEY', this.registers.PC);
    this.registers.Y--;
  },
  INX: function() {
    this.log('INX', this.registers.PC);
    this.registers.Y++;

  },
  ROL_A: function() {
    /* partial */
    this.log('ROL A', this.registers.PC);
    this.registers.A << 1;
  },
  LDX_IMM: function() {
    this.registers.X = this.next_byte();
    this.log('LDX #$' + this.next_byte(), this.registers.PC);
  },
  LDX_ZP: function() {
    this.registers.X = this.fetch(this.next_byte());
    this.log('LDX #$' + this.next_byte(), this.registers.PC);
  },
  LDX_ABS: function() {
    this.registers.X = this.fetch(this.next_bytes());
    this.log('LDX ' + this.next_bytes(), this.registers.PC);
  },
  LDA_IND_X: function() {
    this.log('LDA ($' + this.next_byte().toString(16) + '), X', this.registers.PC);
    this.registers.A = this.fetch(this.next_byte() + this.registers.X);
  },
  LDA_ABS: function() {
    this.log('LDA $' + this.next_bytes(), this.registers.PC);
    this.registers.A = this.fetch(this.next_bytes());
  },
  JMP: function() {
    let jmp_addr = this.next_bytes();
    this.log('JMP $' + jmp_addr.toString(16), this.registers.PC);
    this.registers.PC = jmp_addr;
  },
  STX: function() {
    let addr = this.fetch(this.next_byte());
    this.set(addr, this.registers.X);
    this.log('STX $' + addr, this.registers.PC);
  },
  STX_ZP: function() {
    let addr = this.fetch(this.next_byte());
    this.set(addr, this.registers.X);
    this.log('STX $' + addr, this.registers.PC);
  },
  STX_ZP_Y: function() {
    let addr = this.fetch(this.next_byte()) + this.registers.Y;
    this.set(addr, this.registers.X);
    this.log('STX $' + addr, this.registers.PC);
  },
  STX_ABS: function() {
    let addr3 = this.next_bytes();
    this.set(addr3, this.registers.X);
    this.log('STX $' + addr3, this.registers.PC);
  },
  STY_ZP: function() {
    let addr1 = this.fetch(this.registers.PC+1);
    this.set(addr1, this.registers.X);
    this.log('STY #' + addr1, this.registers.PC);
  },
  STA_ABS: function() {
    let sta_address = this.next_bytes();
    this.set(sta_address, this.registers.A);
    this.log('STA $' + sta_address, this.registers.PC);
  },
  STA_IND_X: function() {
    let sta_address = this.fetch(this.next_byte() + this.registers.X);
    this.set(sta_address, this.registers.A);
    this.log('STA $' + sta_address, this.registers.PC);
  },
  SEC: function() {
    this.log('SEC', this.registers.PC);
    this.flags.carry = true;
  },
  BCS: function() {
    let bcs_addr = this.registers.PC+2 + this.next_byte();
    this.log('BCS ' + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
    if (this.flags.carry == true) {
      this.log('- Branch taken', bcs_addr);
      this.registers.PC = bcs_addr;
    } else {
      this.registers.PC += 2;
    }
  },
  CLC: function() {
    this.log('CLC', this.registers.PC);
    this.flags.carry = false;
  },
  CLD: function() {
    this.log('CLD', this.registers.PC);
    this.flags.decimal_mode = false;
  },
  CLV: function() {
    this.log('CLD', this.registers.PC);
    this.flags.overflow = false;
  },
  PHA: function() {
    this.log('PHA', this.registers.PC);
    this.stack.push(this.registers.A);
    this.registers.SP--;
  },
  PLP: function() {
    this.log('PLP', this.registers.PC);
    let pflags = this.stack.pop();
    this.cycles -= 4;
    this.registers.SP++;
    let t = ('00000000' + pflags.toString(2)).substr(-8);
    this.flags.carry = ! t[0];
    this.flags.zero = ! t[1];
    this.flags.interrupt_disable = ! t[2];
    this.flags.decimal_mode = ! t[3];
    this.flags.break_command = ! t[4];
    this.flags.overflow = ! t[6];
    this.flags.negative = ! t[7];
  },
  BCC: function() {
    let bcc_addr = (this.registers.PC+2) + this.next_byte();
    this.log('BCC ' + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
    if (this.flags.carry == false) {
      this.log('- Branch taken', bcc_addr);
      this.registers.PC = bcc_addr;
    } else {
      this.registers.PC += 2;
    }
  },
  LDA_IMM: function() {
    this.log('LDA #$' + this.next_byte(), this.registers.PC);
    this.registers.A = this.next_byte();
  },
  LDA_ZP: function() {
    this.log('LDA $' + this.next_byte(), this.registers.PC);
    this.registers.A = this.fetch(this.registers.PC+1);
  },
  BEQ: function() {
    this.log('BEQ ' + (this.next_byte() + this.registers.PC).toString(16), this.registers.PC);
    if (this.flags.zero == true) {
      this.registers.PC += 2 + this.next_byte();
    } else {
      this.registers.PC += 2;
    }
  },
  BNE: function() {
    this.log('BNE ' + (this.next_byte() + this.registers.PC + 2).toString(16), this.registers.PC);
    if (this.flags.zero == false) {
      this.registers.PC += 2 + this.next_byte();
    } else {
      this.registers.PC += 2;
    }
  },
  STA_ZP: function() {
    this.log('STA #' + this.next_byte(), this.registers.PC);
    this.cycles += 3;
    this.set(this.next_byte(), this.registers.A);
  },
  BIT: function() {
    this.log('BIT #' + this.next_byte(), this.registers.PC);
    let mem = this.next_byte();
    let mem_bits = ('00000000' + this.next_byte().toString(2)).substr(-8);
    let r = (this.registers.A & mem).toString(2);
    let s = ('00000000' + r).substr(-8);
    this.flags.zero = (parseInt(r) == 0);
    this.flags.negative = ! mem_bits[0];
    this.flags.overflow = ! mem_bits[1];
  },
  BVS: function() {
    let bvs_addr = this.registers.PC+2 + this.next_byte();
    this.log('BVS ' + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
    this.registers.PC += 2;
    if (this.flags.overflow == true) {
      this.log('- Branch taken', bvs_addr);
      this.registers.PC = bvs_addr;
    }
  },
  BVC: function() {
    let bvc_addr = this.registers.PC+2 + this.next_byte();
    this.log('BVC ' + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
    this.registers.PC += 2;
    if (this.flags.overflow == false) {
      this.log('- Branch taken', bvc_addr);
      this.registers.PC = bvc_addr;
    }
  },
  BPL: function() {
    let bpl_addr = (this.registers.PC+2) + this.next_byte();
    this.log('BPL ' + (this.next_byte()+this.registers.PC+2).toString(16), this.registers.PC);
    if (this.flags.negative == false) {
      this.log('- Branch taken', bpl_addr);
      this.registers.PC = bpl_addr;
    } else {
      this.registers.PC += 2;
    }
  },
  RTS: function() {
    let ret_addr = utility.merge_bytes(this.stack.pop(), this.stack.pop());
    this.registers.SP++;
    this.log('RTS ' + ret_addr.toString(16), this.registers.PC);
    this.registers.PC = ret_addr;
  },
  RTI: function() {
    let status = this.stack.pop();
    this.set_flags(status);
    this.log('RTI', this.registers.PC);
  },
  SEI: function() {
    this.flags.interrupt_disable = true;
    this.log('SEI', this.registers.PC);
  },
  SED: function() {
    this.flags.decimal_mode = true;
    this.log('SED', this.registers.PC);
  },
  PHP: function() {
    this.log('PHP', this.registers.PC);
    this.stack.push(this.status_byte());
    this.registers.SP--;
  },
  PLA: function() {
    let byte = this.stack.pop();
    this.registers.SP++;
    this.log('PLA', this.registers.PC);
    this.registers.A = byte;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(byte, 7) == 1) {
      this.flags.negative = true;
    }
  },
  AND_IMM: function() {
    this.registers.A = this.registers.A & this.next_byte();
    this.log('AND #' + this.next_byte(), this.registers.PC);
  },
  AND_ZP: function() {
    this.registers.A = this.registers.A & this.fetch(this.next_byte());
    this.log('AND $' + this.next_byte(), this.registers.PC);
  },
  AND_ZP_X: function() {
    this.registers.A = this.registers.A & this.fetch(this.registers.X + this.next_byte());
    this.log('AND $' + this.next_byte(), this.registers.PC);
  },
  AND_IND_X: function() {
    this.registers.A = this.registers.A & this.fetch(this.next_byte() + this.registers.X);
    this.log('AND (' + this.next_byte() + '), X', this.registers.PC);
    this.cycles -= 6;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
  },
  AND_IND_Y: function() {
    this.registers.A = this.registers.A & this.fetch(this.next_byte() + this.registers.Y);
    this.log('AND (' + this.next_byte() + '), X', this.registers.PC);
    this.cycles -= 5;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
  },
  ADC_IMM: function() {
    this.registers.A = this.registers.A + this.next_byte();
    this.log('BAD ADC #' + this.next_byte(), this.registers.PC);
  },
  ADC_ZP: function() {
    this.registers.A = this.registers.A + this.fetch(this.next_byte());
    this.log('BAD ADC #' + this.next_byte(), this.registers.PC);
  },
  ADC_IND_X: function() {
    this.registers.A = this.fetch(this.registers.X + this.next_byte()) + this.registers.A;
    this.log('BAD ADC #' + this.next_byte(), this.registers.PC);
  },
  SBC_IMM: function() {
    this.registers.A = this.registers.A - this.next_byte();
    this.log('BAD SBC #' + this.next_byte(), this.registers.PC);
  },
  SBC_IND_X: function() {
    this.registers.A = this.registers.A - this.fetch(this.registers.X + this.next_byte());
    this.log('BAD SBC #' + this.next_byte(), this.registers.PC);
  },
  CMP_IMM: function() {
    this.log('CMP #' + this.next_byte(), this.registers.PC);
    if (this.registers.A >= this.next_byte()) {
      this.flags.carry = true;
    } else if (this.registers.A == this.flags.zero) {
      this.flags.zero = true;
    } else if ((this.registers.A).toString(2)[7] == 1) {
      this.flags.negative = true;
    }
  },
  CMP_ZP: function() {
    this.log('CMP #' + this.next_byte(), this.registers.PC);
    if (this.registers.A >= this.fetch(this.next_byte())) {
      this.flags.carry = true;
    } else if (this.registers.A == this.flags.zero) {
      this.flags.zero = true;
    } else if (utility.bit(this.registers.A, 1) == 1) {
      this.flags.negative = true;
    }
  },
  CMP_IND_X: function() {
    let c = this.fetch(this.next_byte() + this.registers.X);
    this.log("CMP #" + this.next_byte(), this.registers.PC);
    if (this.registers.A >= c) {
      this.flags.carry = true;
    } else if (this.registers.A == c) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 1) == 1) {
      this.flags.negative = true;
    }
  },
  CPY_IMM: function() {
    this.log('CPY #' + this.next_byte(), this.registers.PC);
    let val2 = this.next_byte();
    this.cycles -= 2;
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
  },
  CPX_IMM: function() {
    this.log('CPX #' + this.next_byte(), this.registers.PC);
    let val = this.next_byte();
    this.cycles -= 2;
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
  },
  LDY_IMM: function() {
    this.log('LDY #' + this.next_byte(), this.registers.PC);
    this.registers.Y = this.next_byte();
  },
  LDY_ZP: function() {
    this.log('LDY #' + this.next_byte(), this.registers.PC);
    this.registers.Y = this.fetch(this.next_byte());
  },
  BMI: function() {
    this.log('BMI ' + this.next_byte(), this.registers.PC);
    if (this.flags.negative == true) {
      this.registers.PC += this.next_byte() + 2;
    } else {
      this.registers.PC += 2;
    }
  },
  ORA_IMM: function() {
    this.log('ORA ' + this.next_byte(), this.registers.PC);
    this.registers.A = this.registers.A | this.next_byte();
  },
  ORA_ZP: function() {
    this.registers.A = this.registers.A | this.fetch(this.next_byte());
    this.log('ORA ' + this.next_byte(), this.registers.PC);
  },
  ORA_ABS_X: function() {
    this.log('ORA (' + this.next_bytes() + '), X', this.registers.PC);
    this.registers.A = this.registers.A | (this.next_bytes() + this.registers.X);
    this.cycles -= 2;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
  }, 
  ORA_IND_X: function() {
    this.log('ORA (' + this.fetch(this.next_byte()) + '), X', this.registers.PC);
    this.registers.A = this.registers.A | this.fetch(this.next_byte() + this.registers.X);
    this.cycles -= 2;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
  },
  ORA_IND_Y: function() {
    this.log('ORA (' + this.fetch(this.next_byte()) + '), Y', this.registers.PC);
    this.registers.A = this.registers.A | this.fetch(this.next_byte() + this.registers.Y);
    this.cycles -= 2;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
  },
  EOR_IMM: function() {
    this.registers.A = this.registers.A ^ this.next_byte();
    this.cycles -= 2;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (this.registers.A.toString(2)[7] == 1) {
      this.flags.negative = true;
    }
  },
  EOR_ZP: function() {
    this.registers.A = this.registers.A ^ this.fetch(this.next_byte());
  },
  EOR_ZP_X: function() {
    this.registers.A = this.registers.A ^ this.fetch(this.next_byte() + this.registers.X);
    this.cycles -= 4;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
    this.registers.PC += 3;
  },
  EOR_ABS: function() {
    this.registers.A = this.registers.A ^ this.fetch(this.next_bytes());
    this.cycles -= 4;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
    this.registers.PC += 3;
  },
  EOR_ABS_X: function() {
    this.registers.A = this.registers.A ^ this.fetch(this.next_bytes() + this.registers.X);
    this.cycles -= 4;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
    this.registers.PC += 3;
  },
  EOR_ABS_Y: function() {
    this.registers.A = this.registers.A ^ this.fetch(this.next_bytes() + this.registers.Y);
    this.cycles -= 4;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
    this.registers.PC += 3;
  },
  EOR_IND_X: function() {
    this.registers.A = this.registers.A ^ (this.fetch(this.next_bytes()) + this.registers.X);
  },
  EOR_IND_Y: function() {
    this.registers.A = this.registers.A ^ (this.fetch(this.next_bytes()) + this.registers.Y);
    this.cycles -= 4;
    if (this.registers.A == 0) {
      this.flags.zero = true;
    }
    if (utility.bit(this.registers.A, 7) == 1) {
      this.flags.negative = true;
    }
    this.registers.PC += 3;
  },
  LSR_A: function() {
    this.log('LSR A', this.registers.PC);
    this.registers.A >>> 1;
  },
  ASL_A: function() {
    this.log('ASL A', this.registers.PC);
    this.registers.A *= 2;
  },
  ROR_A: function() {
    this.log('ROR A', this.registers.PC);
    this.cycles -= 2;
    this.registers.A >> 1;
  },
  ASL_ABS_X: function() {
    this.log('ASL #$', this.registers.PC);
    this.cycles -= 2;
    let byte_shift = this.fetch(this.next_bytes() + this.registers.X);
    this.set(this.next_bytes() + this.registers.X, byte_shift);
  }
};

module.exports = operations;
