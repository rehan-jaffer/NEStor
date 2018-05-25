const utility = require('./utility');

test('merges two bytes', () => {
  expect(utility.merge_bytes(0xa0,0x00)).toEqual(0x00A0);
});

test('extracts 7th bit from a byte', () => {
  expect(utility.bit(255, 7)).toEqual(1);
  expect(utility.bit(0, 7)).toEqual(0);
});
