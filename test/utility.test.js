const utility = require('../utility.js');

describe("utility.merge_bytes()", () => {
  it('merges two non-null bytes', () => {
    expect(utility.merge_bytes(0xa0,0xa0)).toEqual(0xA0A0);
  });

  it('merges two null bytes', () => {
    expect(utility.merge_bytes(0x00,0x00)).toEqual(0x0000);
  });
});

describe("utility.bit", () => {
  it('extracts 7th bit from a non-null byte', () => {
    expect(utility.bit(255, 7)).toEqual(1);
  });

  it('extracts 7th bit from a null byte', () => {
    expect(utility.bit(0, 7)).toEqual(0);
  });
});

describe("utility.split_byte", () => {
  it("splits an arbitrary byte (0)", () => {
    let byte = "e3a4";
    expect(utility.split_byte(byte)).toEqual([0xe3, 0xa4]);
  });

  it("splits an arbitrary byte (1)", () => {
    let byte = "a100";
    expect(utility.split_byte(byte)).toEqual([0xa1, 0x00]);
  });

  it("splits an arbitrary byte (0)", () => {
    let byte = "0102";
    expect(utility.split_byte(byte)).toEqual([0x01, 0x02]);
  });
});
