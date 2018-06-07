var fs = require('fs');
var rom = require('./iNES.js');
var cpu = require('./CPU.js');
var ppu = require('./PPU.js');
var nestest = require('./nestest.js');

class NES {
  constructor() {
    this.cpu = new cpu;
    this.ppu = new ppu;
  }
  insert(filename) {

    var self = this;
    this.rom = new rom;
    return this.rom.load(filename).then(function() {
      self.cpu.load_rom(self.rom);
      self.ppu.load_rom(self.rom);
    });

  }
  boot() {
    // initialize states
    //        this.cpu.initialize();
    // begin with reboot
    this.cpu.reset();
    this.cpu.execute();
  }
  test() {

    let test_suite = new nestest;
    this.cpu.reset();
    let running = true;
    while (running) {
      this.cpu.execute(1);
      let test_line = test_suite["code"][this.cpu.registers.PC];
      if (!test_line) {
        console.log(this.cpu.registers.PC.toString(16));
        process.exit();
      }
      Object.entries(this.cpu.registers).forEach((register) => {
        if (parseInt(this.cpu.registers[register[0]]) == parseInt(test_line.flags[register[0]], 16)) {
//          console.log(`Registers ${register[0]} match`);
        } else {
          console.log(`Registers ${register[0]} mismatch`);
          console.log(`Got ${this.cpu.registers[register[0]].toString(16)}, expected ${test_line.flags[register[0]]}`);
          console.log(test_line.flags);
          console.log(this.cpu.flags);
          console.log(this.cpu.registers);
          console.log(this.cpu.registers.PC.toString(16));
          running = false;
        }
      });
    }

  }
}

module.exports = NES;
