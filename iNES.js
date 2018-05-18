var fs = require('fs');

const ROM_MULTIPLE_SIZE = 16384;
const PRG_ROM_START_INDEX = 16;
const PRG_ROM_SIZE_INDEX = 4;
const CHR_ROM_SIZE_INDEX = 5;
const HEADER_SIZE = 0x10;
const MODE = "node"

class ROM {

  constructor() {
    this.rom = new Uint8Array(16000);
    this.prg_rom = new Uint8Array(16000);
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
        console.log(self.prg_rom);
      }).catch(function(error) {
        console.log(error);
        console.log("WTF");
      });

    } else {

      var rom_buffer = fs.readFileSync(filename);    
      console.log(rom_buffer);

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
      console.log(this.nes_str);
      console.log("Error parsing iNES header");
      return null;
    }
    this.prg_r1_size = this.rom[PRG_ROM_SIZE_INDEX];
    this.chr_size = this.rom[CHR_ROM_SIZE_INDEX];
    const ROM_SIZE = ROM_MULTIPLE_SIZE*this.prg_r1_size;
    console.log(PRG_ROM_START_INDEX);
    this.prg_rom = this.rom.slice(PRG_ROM_START_INDEX, ROM_SIZE);
  }

}

module.exports = ROM;
