var emulator = require('../emulator.js');
var fs = require('fs');


var instructions = [0xA2,0x00];

var results = {A: 0, X: 0, Y:0, P: 0x24, SP: 0xFD};

test(instructions, results);

function create_test(instructions, output) {

}

function test(instructions, output) {

  let failed = false;
  let emu = new emulator;
  emu.direct_load(instructions);
  emu.boot()
  Object.keys(results).forEach((register) => {
    if (emu.cpu.registers[register] == results[register]) {
      console.log(`${register} [OK]`);
    } else {
      console.log(`${register} [FAIL]`);
      failed = true;
    }
  });
  return failed;

}
