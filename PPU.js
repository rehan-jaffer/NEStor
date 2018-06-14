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
    this.registers = {
      ppu_ctrl: 0,
      ppu_mask: 0,
      ppu_status: 0,
      oam_addr: 0,
      oamdata: 0,
      ppu_scroll: 0,
      ppu_addr: 0,
      ppu_data: 0,
      oam_dma: 0
    };
    this.tiles = [];
  }
  load_rom(rom) {
    this.rom = rom.chr_rom;
  }
  get_tiles() {
    let rom = this.rom;
    let tables = [];

    for (let i = 0; i < rom.length; i += 16) {
      let chunk = rom.slice(i, i + 16);
      let chunk_array = [];
      for (let j = 0; j < 16; j += 2) {
        chunk_array.push(chunk.slice(j, j + 2));
      }
      this.tiles.push(chunk_array);
    }
  }
}

module.exports = PPU;
