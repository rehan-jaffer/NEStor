var cpu = require('./CPU.js');

describe("CPU initialization", () => {

  let c = new cpu;

  it("It initializes itself with a stack", () => {
    expect(c.stack).toEqual([]);
  });

  it("Sets up the appropriate flags", () => {
    ['break_command', 'carry','negative','overflow','interupt_disable','decimal_mode'].forEach((flag) => {
      expect(c.flags[flag]).not.toBeNull();
    });
  });

});

describe("CPU reset", () => {

  let c = new cpu;
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

  it("sets the initial flags appropriately (via flags object)", () => {
    expect(["carry", "zero", "interrupt_disable", "decimal_mode", "break_command", "overflow", "negative"].map((flag) => {
      return c.flags[flag];
    })).toEqual([false, false, true, false, false, false, false]);
  });


});
