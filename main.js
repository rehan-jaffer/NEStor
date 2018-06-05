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
    for(let x = 0; x < 50; x++) {
      this.cpu.execute(1);
      let test_line = test_suite["code"][this.cpu.registers.PC];
      Object.entries(this.cpu.registers).forEach((register) => {
        if (parseInt(this.cpu.registers[register[0]]) == parseInt(test_line.flags[register[0]], 16)) {
//          console.log(`Registers ${register[0]} match`);
        } else {
          console.log(`Registers ${register[0]} mismatch`);
          console.log(`Got ${this.cpu.registers[register[0]]}, expected ${parseInt(test_line.flags[register[0]],16)}`);
        }
      });
    }

  }
}

let emu = new NES;
emu.insert('nestest.nes').then(() => {
  emu.test();
}).catch(function(e) {
  console.log(e);
});
