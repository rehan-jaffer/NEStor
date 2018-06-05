class NEStest {

  constructor() {
    this.code = [];
    var fs = require('fs');
    var nt = fs.readFileSync("nestest.log","utf-8").split("\n").filter((x) => x != "");
    nt.forEach((line) => {
      let segments = line.split(/[ ]{2,}/);
      let line_hash = {flags: {PC: segments[0]}};
      let flags = segments[3].split(/ /);
      flags.forEach((flag_str) => {
        var parts = flag_str.split(":");
        line_hash.flags[parts[0]] = parts[1];
      });
      this.code[parseInt(segments[0],16)] = line_hash;
   });
   }

};

module.exports = NEStest;
