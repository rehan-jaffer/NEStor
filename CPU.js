class CPU {

  constructor() {
    this.memory = new Memory;
    /* A - Accumulator Register, byte-wide
    X - Index register, byte-wide
    Y - Index register, byte-wide
    S - Stack pointer, byte-wide
    P - Status register, byte-wide */
    this.registers = {PC: 0, S: 0, P:0, A:0, X: 0, Y: 0};
    this.flags = {carry: false, zero: false,
      interrupt_disable: true, decimal_mode: false,
      break_command: false, overflow: false, negative: false};
    this.interrupt = null;
    this.running = false;
  }
  load_rom(rom) {
    this.memory.load_rom(rom);
  }
  execute() {

    this.running = true;

    while(this.running == true) {

      let opcode = this.memory.fetch(this.registers.PC);
      /* replace this with opcode table as soon as it gets unwieldy */
      switch(opcode) {
      case 0:
        console.log('NOOP');
        break;
      case 0x69:
        console.log('boop!');
        break;
      default:
        console.log('Unimplemented opcode ' + opcode);
        break;
      }

      this.registers.PC++;

    }
  }

  reset() {
    this.memory = new Memory;
    this.registers.S = 0xFD;
    this.registers.A = 0;
    this.registers.X = 0;
    this.registers.Y = 0;

    this.flags.carry = false;
    this.flags.zero = false;
    this.flags.interrupt_disable = true;
    this.flags.decimal_mode = false;
    this.flags.break_Command = false;
    this.flags.overflow = false;
    this.flags.negative = false;
    this.operations = {};
  }

}

class Memory {
  constructor() {
    this.ram = Array(0x10000); // use a byte array buffer for this?

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
    return this.rom[addr];
  }
}

module.exports = CPU;
