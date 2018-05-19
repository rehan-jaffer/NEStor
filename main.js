var fs = require('fs');
var rom = require('./iNES.js');
var cpu = require('./CPU.js');

class Emulator {
  constructor() {
    this.cpu = new cpu;
  }
  insert(filename) {

    var self = this;
    this.rom = new rom;
    return this.rom.load(filename).then(function() {
      self.cpu.load_rom(self.rom.prg_rom);
    });

  }
  boot() {
    // initialize states
    //        this.cpu.initialize();
    // begin with reboot
    this.cpu.reset();
    this.cpu.execute();
  }
}

let emu = new Emulator;
emu.insert('nestest.nes').then(() => {
  emu.boot();
}).catch(function(e) {
  console.log(e);
});
