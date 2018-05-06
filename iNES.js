var fs = require('fs');

class ROM {

  constructor() {
    this.rom = "";
    this.header = Array(0x10);
  }

  load(filename) {

    try {
      let rom = fs.readFileSync(filename);      
      this.rom = rom;
    } catch (exception) {
      console.log("Couldn't read ROM:" + exception);
    }

    this.parse();
 
  }

  parse() {
    this.nes_str = this.rom.toString("utf-8", 0, 3);
    this.prg_r1_size = this.rom[4];
    this.prg_r2_size = this.rom[8];
    this.chr_size = this.rom[5];
    let ROM_SIZE = 16384*this.prg_r1_size;
    this.prg_rom = new Buffer(ROM_SIZE);
    this.rom.copy(this.prg_rom, 0, 528, ROM_SIZE);
  }

}

module.exports = ROM;
