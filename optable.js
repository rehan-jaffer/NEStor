var optable = {};
var opcodes = require('./ops.js');

optable[0x20] = {
  cycles: 6,
  bytes: 0,
  name: "JSR_ABS",
  extras: ['JMP_TYPE'],
  op: opcodes["JSR_ABS"]
};

optable[0xEA] = {
  cycles: 2,
  bytes: 1,
  name: "NOP",
  op: opcodes["NOP"]
};

optable[0x69] = {
  cycles: 2,
  bytes:2,
  operand: "A",
  flags: ['UC', 'UZ','UV','UN'],
  name: 'ADC_IMM',
  op: opcodes["ADC_IMM"]
};

optable[0x65] = {
  cycles: 3,
  bytes: 3,
  operand: "A",
  flags: ['UC','UZ','UV','UN'],
  name: 'ADC_ZP',
  op: opcodes["ADC_ZP"]
};

optable[0x4C] = {
  cycles: 3,
  bytes: 0,
  extras: ['JMP_TYPE'],
  flags: [],
  name: 'JMP',
  op: opcodes['JMP']
};

optable[0x60] = {
  cycles: 3,
  bytes: 1,
  flags: [],
  name: 'RTS',
  op: opcodes['RTS']
};

optable[0xA2] = {
  name: 'LDX_IMM',
  cycles: 2,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_IMM']
};

optable[0xA6] = {
  name: 'LDX_ZP',
  cycles: 3,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_ZP']
};

optable[0xB6] = {
  name: 'LDX_ZP_Y',
  cycles: 4,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_ZP_Y']
};

optable[0xAE] = {
  name: 'LDX_ABS',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_ABS']
};

optable[0x86] = {
  name: 'STX_ZP',
  cycles: 3,
  bytes: 2,
  flags: [],
  operand: 'X',
  op: opcodes['STX_ZP']
};


optable[0x38] = {
  name: 'SEC',
  cycles: 2,
  bytes: 1,
  flags: ['UC'],
  op: opcodes['SEC'],
};

optable[0xB0] = {
  name: 'BCS',
  cycles: 2,
  bytes: 0,
  op: opcodes['BCS']
};

optable[0x18] = {
  name: 'CLC',
  cycles: 2,
  bytes: 1,
  flags: ['CC'],
};

optable[0xD8] = {
  name: 'CLD',
  cycles: 2,
  bytes: 1,
  flags: ['CD'],
};

optable[0x18] = {
  name: 'CLI',
  cycles: 2,
  bytes: 1,
  flags: ['CI'],
};

optable[0x18] = {
  name: 'CLV',
  cycles: 2,
  bytes: 1,
  flags: ['CV'],
};

module.exports = optable;
