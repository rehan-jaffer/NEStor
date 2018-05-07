var fs = require('fs');
var rom = require('./iNES.js');
var cpu = require('./CPU.js');

class Emulator {
  constructor() {
    this.cpu = new cpu;
  }
  insert(filename) {
    this.rom = new rom;
    this.rom.load(filename);
    this.cpu.load_rom(this.rom.rom);
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
emu.insert('nestest.nes');
emu.boot();
