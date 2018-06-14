var cpu = require('../CPU.js');
const FLAGS_LIST = ["carry", "zero", "interrupt_disable", "decimal_mode", "break_command", "overflow", "negative"];

describe("CPU initialization", () => {

  let c = new cpu(false);

  it("It initializes itself with a stack", () => {
    expect(c.stack).toEqual([]);
  });

  it("Sets up the appropriate flags", () => {
    FLAGS_LIST.forEach((flag) => {
      expect(c.flags[flag]).not.toBeNull();
    });
  });

});

describe("CPU logging functionality", () => {
  
});

describe("CPU reset", () => {

  let c = new cpu(false);
  c.reset();

  it("sets the initial stack pointer to 0xfd", () => {
    expect(c.registers.SP).toEqual(0xfd);
  });

  it("sets the Accumulator register to 0", () => {
    expect(c.registers.A).toEqual(0);
  });

  it("sets the X register to 0", () => {
    expect(c.registers.X).toEqual(0);
  });

  it("sets the Y register to 0", () => {
    expect(c.registers.Y).toEqual(0);
  });

  it("sets the initial flags appropriately (test via flags object)", () => {
    expect(FLAGS_LIST.map((flag) => {
      return c.flags[flag];
    })).toEqual([false, false, true, false, false, false, false]);
  });

  it("sets the initial flags appropriately (test via status byte)", () => {
    expect(c.status_byte()).toEqual(0x24);
  });


});

describe("CPU status_byte() behaviour", () => {

  let c = new cpu(false);
  beforeEach(() => {
    c.reset();
    FLAGS_LIST.forEach((flag) => {
      c.flags[flag] = false;
    });
  });

  it("returns 32 for all flags set to false (bit 5 is always set to 1)", () => {
    expect(c.status_byte()).toEqual(32);
  });

  it("returns 255 for all flags set to true", () => {
    FLAGS_LIST.forEach((flag) => {
      c.flags[flag] = true;
    });
    expect(c.status_byte()).toEqual(255);
  });

});

describe("CPU next_byte() and next_bytes() helpers", () => {

  let c = new cpu(false);
  beforeEach(() => {
    c.reset();
    /* fill memory with range */
    let cycle = [...Array(10).keys()];
    c.direct_load(cycle);
  });

  it("returns the next_byte", () => {
    expect(c.next_byte()).toEqual(1);
  });

  it("increments the program counter and returns the next byte accurately", () => {
    c.registers.PC++;
    expect(c.next_byte()).toEqual(2);
  });

  it("returns the next bytes", () => {
    expect(c.next_bytes()).toEqual(513);
  });

  it("increments the program counter and returns the next bytes accurately", () => {
    c.registers.PC++;
    expect(c.next_bytes()).toEqual(770);
  });

});
