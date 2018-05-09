var fs = require('fs');

const ROM_MULTIPLE_SIZE = 16384;
const PRG_ROM_START_INDEX = 16;
const PRG_ROM_SIZE_INDEX = 4;
const CHR_ROM_SIZE_INDEX = 5;
const HEADER_SIZE = 0x10;

class ROM {

  constructor() {
    this.rom = '';
    this.header = Array(HEADER_SIZE);
  }

  load(filename) {

    try {
      let rom = fs.readFileSync(filename);      
      this.rom = rom;
    } catch (exception) {
      console.log('Couldn\'t read ROM:' + exception);
    }

    this.parse();
 
  }

  parse() {
    this.nes_str = this.rom.toString('utf-8', 0, 3);
    if (this.nes_str != "NES") {
      console.log("Error parsing iNES header");
      throw err;
    }
    this.prg_r1_size = this.rom[PRG_ROM_SIZE_INDEX];
    this.chr_size = this.rom[CHR_ROM_SIZE_INDEX];
    const ROM_SIZE = ROM_MULTIPLE_SIZE*this.prg_r1_size;
    this.prg_rom = new Buffer(ROM_SIZE);
    this.rom.copy(this.prg_rom, 0, PRG_ROM_START_INDEX, ROM_SIZE);
  }

}

module.exports = ROM;
