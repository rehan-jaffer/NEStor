var fs = require('fs');
var rom = require('./iNES.js');
var cpu = require('./CPU.js');
var ppu = require('./PPU.js');

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
}

let emu = new NES;
emu.insert('nestest.nes').then(() => {
  emu.boot();
}).catch(function(e) {
  console.log(e);
});
