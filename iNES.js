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

  load_data(data) {
    this.rom_buffer = data;
    this.parse();
  }

  load(filename) {

    var self = this;

    if (MODE == "browser") {

      return new Promise(function(resolve, reject) {
        fetch(filename).then(function(response) {
          return response.arrayBuffer();
        }).then(function(buffer) {
          self.rom_buffer = buffer;
          self.parse();
          resolve("SUCCESS")
        }).catch(function(error) {
          reject(error);
        });

        });

    } else {

      return new Promise(function(resolve, reject) {
          self.rom_buffer = fs.readFileSync(filename);    
          if (self.parse()) {
            resolve("SUCCESS");
          } else {
            reject(self.rom_buffer);
          }
        });

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
      return false;
    }
    const CHR_MULTIPLE_SIZE = 8192;
    this.prg_r1_size = this.rom[PRG_ROM_SIZE_INDEX];
    this.chr_size = this.rom[CHR_ROM_SIZE_INDEX];
    const PRG_ROM_SIZE = ROM_MULTIPLE_SIZE*this.prg_r1_size;
    const CHR_ROM_SIZE = CHR_MULTIPLE_SIZE * this.chr_size
    const CHR_ROM_START_INDEX = PRG_ROM_START_INDEX + PRG_ROM_SIZE;
    this.prg_rom = new Uint8Array(this.rom_buffer.slice(PRG_ROM_START_INDEX, PRG_ROM_START_INDEX + PRG_ROM_SIZE));
    this.chr_rom = new Uint8Array(this.rom_buffer.slice(CHR_ROM_START_INDEX, CHR_ROM_START_INDEX + CHR_ROM_SIZE));
    return true
  }

}

module.exports = ROM;
