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
  }
  load_rom(rom) {
    this.rom = rom;
  }
}

module.exports = PPU;
