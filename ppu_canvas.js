var ppu = require('./PPU.js');
var rom = require('./iNES.js');

let canvas = document.querySelector("#viewport");

let p = new ppu;
// let tables = p.dump_tables();

let ines = new rom;
var pattern_tables = [];

window.onload = function() {

  alert("hi");
  let file_input = document.querySelector("#rom_file");
  file_input.onchange = (self) => {
    let reader = new FileReader();
    let file = self.target.files[0];
    reader.onload = (event) => {
      ines.load_data(event.target.result);
      p.load_rom(ines);
      p.dump_tables();
    };
    reader.readAsArrayBuffer(file);
  };

};

function draw_bitmap(bitmap, canvas) {

  

}

console.log(tables);
