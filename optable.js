var optable = {};
var opcodes = require('./ops.js');

optable[0x20] = {
  cycles: 6,
  bytes: 0,
  name: "JSR_ABS",
  actions: ['NO_UPDATE_PC'],
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
  flags: [],
  name: 'JMP',
  actions: ['NO_UPDATE_PC'],
  op: opcodes['JMP']
};

optable[0x60] = {
  cycles: 3,
  bytes: 1,
  flags: [],
  name: 'RTS',
  op: opcodes['RTS']
};

/* LDX opcodes */

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

optable[0xAE] = {
  name: 'LDX_ABS',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_ABS']
};

optable[0xAE] = {
  name: 'LDX_ABS_Y',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: 'X',
  op: opcodes['LDX_ABS_Y']
};

/* LDY opcodes */

optable[0xA0] = {
  name: 'LDY_IMM',
  cycles: 2,
  bytes: 2,
  operand: 'Y',
  flags: ['UZ','UN'],
  op: opcodes['LDY_IMM']
};

optable[0xA4] = {
  name: 'LDY_ZP',
  cycles: 3,
  bytes: 2,
  operand: 'Y',
  flags: ['UZ','UN'],
  op: opcodes['LDY_ZP']
};

optable[0xB4] = {
  name: 'LDY_ZP_X',
  cycles: 4,
  bytes: 2,
  operand: 'Y',
  flags: ['UZ','UN'],
  op: opcodes['LDY_ZP_X']
};

optable[0xAC] = {
  name: 'LDY_ABS',
  cycles: 4,
  bytes: 3,
  operand: 'Y',
  flags: ['UZ','UN'],
  op: opcodes['LDY_ABS']
};

optable[0xBC] = {
  name: 'LDY_ABS_X',
  cycles: 4,
  bytes: 3,
  operand: 'Y',
  flags: ['UZ','UN'],
  op: opcodes['LDY_ABS_X']
};


optable[0x86] = {
  name: 'STX_ZP',
  cycles: 3,
  bytes: 2,
  flags: [],
  operand: 'X',
  op: opcodes['STX_ZP']
};

optable[0x96] = {
  name: 'STX_ZP_Y',
  cycles: 4,
  bytes: 2,
  flags: [],
  operand: 'X',
  op: opcodes['STX_ZP_Y']
};


optable[0x8E] = {
  name: 'STX_ABS',
  cycles: 4,
  bytes: 3,
  flags: [],
  operand: 'X',
  op: opcodes['STX_ABS']
};


optable[0x38] = {
  name: 'SEC',
  cycles: 2,
  bytes: 1,
  flags: ['UC'],
  op: opcodes['SEC'],
};

optable[0x18] = {
  name: 'CLC',
  cycles: 2,
  bytes: 1,
  flags: ['CC'],
  op: opcodes['CLC']
};

optable[0xD8] = {
  name: 'CLD',
  cycles: 2,
  bytes: 1,
  flags: ['CD'],
};

optable[0x58] = {
  name: 'CLI',
  cycles: 2,
  bytes: 1,
  flags: ['CI'],
};

optable[0xB8] = {
  name: 'CLV',
  cycles: 2,
  bytes: 1,
  flags: ['CV'],
};

/* LDA opcodes */

optable[0xA9] = {
  name: 'LDA_IMM',
  cycles: 2,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_IMM']
};

optable[0xA5] = {
  name: 'LDA_ZP',
  cycles: 3,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_ZP']
};

optable[0xB5] = {
  name: 'LDA_ZP_X',
  cycles: 4,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_ZP_X']
};

optable[0xAD] = {
  name: 'LDA_ABS',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_ABS']
};

optable[0xBD] = {
  name: 'LDA_ABS_X',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_ABS_X']
};

optable[0xB9] = {
  name: 'LDA_ABS_Y',
  cycles: 4,
  bytes: 3,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_ABS_Y']
};

optable[0xA1] = {
  name: 'LDA_IND_X',
  cycles: 6,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_IND_X']
};

optable[0xB1] = {
  name: 'LDA_IND_Y',
  cycles: 6,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['LDA_IND_Y']
};

/* Branching */

optable[0x90] = {
  name: 'BCC',
  cycles: 2,
  bytes: 2,
  op: opcodes['BCC'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","BRANCH_UPDATE_PC"]
};

optable[0xB0] = {
  name: 'BCS',
  cycles: 2,
  bytes: 2,
  op: opcodes['BCS'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","BRANCH_UPDATE_PC"]
};

optable[0xD0] = {
  name: 'BNE',
  cycles: 2,
  bytes: 2,
  op: opcodes['BNE'],
  actions: ['NO_UPDATE_PC'],
}

optable[0xF0] = {
  name: 'BEQ',
  cycles: 2,
  bytes: 2,
  op: opcodes['BEQ'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","BRANCH_UPDATE_PC"]
};

optable[0x24] = {
  name: 'BIT',
  cycles: 3,
  bytes: 2,
  op: opcodes['BIT'],
  actions: ["BIT_TEST"]
};

optable[0x70] = {
  name: 'BVS',
  cycles: 2,
  bytes: 2,
  op: opcodes['BVS'],
  actions: ['NO_UPDATE_PC']
};

/* Store accumulator */

optable[0x85] = {
  name: 'STA_ZP',
  cycles: 3,
  bytes: 2,
  op: opcodes['STA_ZP']
};

optable[0x95] = {
  name: 'STA_ZP_X',
  cycles: 4,
  bytes: 2,
  op: opcodes['STA_ZP_X']
};

optable[0x8D] = {
  name: 'STA_ABS',
  cycles: 4,
  bytes: 3,
  op: opcodes['STA_ABS']
};

optable[0x9D] = {
  name: 'STA_ABS_X',
  cycles: 5,
  bytes: 3,
  op: opcodes['STA_ABS_X']
};

optable[0x99] = {
  name: 'STA_ABS_Y',
  cycles: 5,
  bytes: 3,
  op: opcodes['STA_ABS_Y']
};

optable[0x81] = {
  name: 'STA_IND_X',
  cycles: 6,
  bytes: 2,
  op: opcodes['STA_IND_X']
};

optable[0x91] = {
  name: 'STA_IND_Y',
  cycles: 6,
  bytes: 2,
  op: opcodes['STA_IND_Y']
};

optable[0x01] = {
  name: 'ORA_IMM',
  cycles: 2,
  bytes: 2,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_IMM']
};

module.exports = optable;
