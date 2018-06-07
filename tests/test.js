var emulator = require('../emulator.js');
var fs = require('fs');
var glob = require('glob');

var instructions = [0xA2,0x00];

var results = {A: 0, X: 0, Y:0, P: 0x24, SP: 0xFD};

let cases = [];

class Tests {
  constructor() {

  }
  run() {

    let cases = this.load_tests();

    let results = cases.map((c) => {
      return this.test(c);
    });


    let passed = this.get_passing_count(results);
    let failed = this.get_failing_summary(results);

    console.log(`(${passed}/${results.length}) tests passed`);
    console.log('Failing: ');
    console.log(failed.join('\n'));

  }

  load_tests() {

    var cases = [];
    let files = glob.sync('cases/*.test');
    files.forEach((file) => {
      let text = fs.readFileSync(file);
      cases.push(JSON.parse(text));
    });

    return cases;

  }

  get_failing_summary(results) {

      return results.map((result) => {
        return result['name'] + " [" + this.parse_results(result['results']) + "] "
      });

  }

  get_passing_count(results) {

      return results.map((result) => {
        return result['status'] ? 1 : 0;
      }).reduce((acc,x) => acc + x);

  }

  parse_results(registers) {
    return Object.keys(registers).filter((r) => {
      return !registers[r];
    }).join(" ");
  }

  test(test_case) {

    let failed = false;
    let emu = new emulator;
    let result = {};

    emu.direct_load(test_case['code']);
    emu.boot();

    Object.keys(test_case['registers']).forEach((register) => {
      if (emu.cpu.registers[register] == test_case['registers'][register]) {
        result[register] = true;
      } else {
        result[register] = false;
        failed = true;
      }
    });
    console.log(result);
    return {success: !failed, name: test_case['name'] || 'Unnamed test', results: result};

  }

}

tests = new Tests;
tests.run();
