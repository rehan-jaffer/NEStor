var fs = require('fs');

const ROM_MULTIPLE_SIZE = 16384;
const PRG_ROM_START_INDEX = 16;
const PRG_ROM_SIZE_INDEX = 4;
const CHR_ROM_SIZE_INDEX = 5;
const HEADER_SIZE = 0x10;
const MODE = "node"

class ROM {

  constructor() {
    this.rom = '';
    this.prg_rom = '';
    this.header = Array(HEADER_SIZE);
    this.rom_buffer = new ArrayBuffer;
  }

  load(filename) {

    var self = this;

    if (MODE == "browser") {

      fetch(filename).then(function(response) {
        return response.arrayBuffer();
      }).then(function(buffer) {
        self.rom_buffer = buffer;
        self.parse();
      }).catch(function(error) {
        console.log(error);
      });

    } else {

      this.rom_buffer = fs.readFileSync(filename);    
      this.parse();

    }

//    this.parse();
 
  }

  get prg() {
    console.log(this.prg_rom);
    return this.prg_rom;
  }

  parse() {
    this.rom = new Uint8Array(this.rom_buffer);
    this.nes_str = Array.from(this.rom.slice(0,3)).map((s) => String.fromCharCode(s)).join('');
    // .map((s) => String.fromCharCode(s));
    if (this.nes_str != "NES") {
      console.log("Error parsing iNES header");
      return null;
    }
    this.prg_r1_size = this.rom[PRG_ROM_SIZE_INDEX];
    this.chr_size = this.rom[CHR_ROM_SIZE_INDEX];
    const ROM_SIZE = ROM_MULTIPLE_SIZE*this.prg_r1_size;
    this.prg_rom = new Uint8Array(ROM_SIZE);
    // this.rom.copy(this.prg_rom, 0, PRG_ROM_START_INDEX, ROM_SIZE);
    this.prg_rom = Uint8Array.from(this.rom_buffer.slice(PRG_ROM_START_INDEX, ROM_SIZE));
  }

}

module.exports = ROM;
