var emulator = require('../emulator.js');
var fs = require('fs');
var glob = require('glob');

var instructions = [0xA2,0x00];

var results = {A: 0, X: 0, Y:0, P: 0x24, SP: 0xFD};

let cases = [];

glob('cases/*.test', (err, files) => {

  files.map((file) => {
    var text = fs.readFileSync(file);
    cases.push(JSON.parse(text));
  });

  cases.forEach((c) => {
    test(c["code"], c["registers"]);
  });

});

function test(instructions, output) {

  let failed = false;
  let emu = new emulator;
  emu.direct_load(instructions);
  emu.boot()
  Object.keys(output).forEach((register) => {
    if (emu.cpu.registers[register] == output[register]) {
      console.log(`${register} [OK]`);
    } else {
      console.log(`${register} [FAIL]`);
      failed = true;
    }
  });
  return failed;

}
