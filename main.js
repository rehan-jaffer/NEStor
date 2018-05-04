var fs = require('fs');

class CPU {

  constructor() {
    this.memory = new Memory;
    this .registers = {PC: 0, SP: 0};
  }

}

class Memory {
  constructor() {

  }
  fetch() {

  }
}

class Emulator {
  constructor() {
    this.cpu = new CPU;
  }
  execute() {
    let opcode = this.cpu.memory.fetch(this.cpu.registers.PC);
  }
}

let emu = new Emulator;
emu.execute();
rom = fs.readFileSync("test.rom");
console.log(rom);
