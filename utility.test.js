const utility = require('./utility');

test('merges two bytes', () => {
  expect(utility.merge_bytes(0xa0,0x00)).toEqual(0x00A0);
});
