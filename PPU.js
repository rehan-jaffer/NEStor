/* 
  The NES Picture Processing Unit

    PPU Registers
    Pattern Table
    Name Table
    Sprites
    Rendering Pipeline
    Scrolling

*/

class PPU {
  constructor() {
    this.registers = { ppu_ctrl: 0, ppu_mask: 0, ppu_status: 0, oam_addr: 0, oamdata: 0, ppu_scroll: 0, ppu_addr: 0, ppu_data: 0, oam_dma: 0 };
    this.tiles = [];
  }
  load_rom(rom) {
    this.rom = rom.chr_rom;
  }
  dump_tables() {

    let rom = this.rom;
    let tables = [];
    let chunk = 2;

    for (let i = 0, j=rom.length;i<j;i+=chunk) {
      tables.push(rom.slice(i, i+chunk));
    }

    for (let x = 0; x<tables.length; x++) {
      for (let y = 0; y < 2; y++) {
        console.log(("00000000" + tables[x][y].toString(2)).substr(-8));
      }
      console.log("");
    }

  }
}



module.exports = PPU;
