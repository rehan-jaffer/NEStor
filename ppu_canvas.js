var ppu = require("./PPU.js");
var rom = require("./iNES.js");

let canvas = document.querySelector("#viewport");

let p = new ppu();
// let tables = p.dump_tables();

let ines = new rom();
var tiles = [];

window.onload = function() {
  let file_input = document.querySelector("#rom_file");
  file_input.onchange = self => {
    let reader = new FileReader();
    let file = self.target.files[0];
    reader.onload = event => {
      ines.load_data(event.target.result);
      p.load_rom(ines);
      p.get_tiles();
      tiles = p.tiles;
      draw_tiles(tiles);
    };
    reader.readAsArrayBuffer(file);
  };
};

function pad_byte(byte) {
  return ("00000000" + byte.toString(2)).substr(-8);
}

function highlight_bits(pattern) {
  return pattern.replace(/1/gi, "<strong>1</strong>").replace(/0/gi, "&nbsp;");
}

function create_imagedata(tiles) {
  for (let tile in tiles) {
    for (let byte in tile) {
    }
  }
}

function draw_tiles(tiles) {
  let t = "";

  tiles.forEach(tile => {
    tile.forEach(chunk => {
      t += pad_byte(chunk[0] | chunk[1]);
      t += "<br />";
    });
  });

  document.querySelector("#tiles").innerHTML += highlight_bits(t);
}
