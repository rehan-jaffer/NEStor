var nes = require('./emulator.js');

let emu = new nes;
emu.insert('nestest.nes').then(() => {
  emu.boot();
}).catch(function(e) {
  console.log(e);
});
