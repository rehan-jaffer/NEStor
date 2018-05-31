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

optable[0xBE] = {
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

optable[0x78] = {
  name: 'SEI',
  cycles: 2,
  bytes: 1,
  flags: ['UI'],
  op: opcodes['SEI']
};

optable[0xF8] = {
  name: 'SED',
  cycles: 2,
  bytes: 1,
  flags: ['UD'],
  op: opcodes['SED']
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
  op: opcodes['CLD']
};

optable[0x58] = {
  name: 'CLI',
  cycles: 2,
  bytes: 1,
  flags: ['CI'],
  op: opcodes['CLI']
};

optable[0xB8] = {
  name: 'CLV',
  cycles: 2,
  bytes: 1,
  flags: ['CV'],
  op: opcodes['CLV']
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
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
};

optable[0x50] = {
  name: 'BVC',
  cycles: 2,
  bytes: 2,
  op: opcodes['BVC'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
};

optable[0x10] = {
  name: 'BPL',
  cycles: 2,
  bytes: 2,
  op: opcodes['BPL'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
};

optable[0xB0] = {
  name: 'BCS',
  cycles: 2,
  bytes: 2,
  op: opcodes['BCS'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
};

optable[0x30] = {
  name: 'BMI',
  cycles: 2,
  bytes: 2,
  op: opcodes['BMI'],
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
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
  actions: ["INCREMENT_CYCLES_IF_BRANCH","INCREMENT_CYCLES_IF_NEW_PAGE","NO_UPDATE_PC"]
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

optable[0x09] = {
  name: 'ORA_IMM',
  cycles: 2,
  bytes: 2,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_IMM']
};

optable[0x05] = {
  name: 'ORA_ZP',
  cycles: 3,
  bytes: 2,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_IMM']
};

optable[0x15] = {
  name: 'ORA_ZP_X',
  cycles: 3,
  bytes: 2,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_ZP_X']
};

optable[0x0D] = {
  name: 'ORA_ABS',
  cycles: 4,
  bytes: 3,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_ABS']
};

optable[0x01] = {
  name: 'ORA_IND_X',
  cycles: 6,
  bytes: 2,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_IND_X']
};

optable[0x1D] = {
  name: 'ORA_ABS_X',
  cycles: 4,
  bytes: 3,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_ABS_X']
};

optable[0x19] = {
  name: 'ORA_ABS_Y',
  cycles: 4,
  bytes: 3,
  operand: "A",
  flags: ['UZ','UN'],
  op: opcodes['ORA_ABS_Y']
};


optable[0x08] = {
  name: 'PHP',
  cycles: 3,
  bytes: 1,
  op: opcodes['PHP']
};

optable[0x28] = {
  name: 'PLP',
  cycles: 4,
  bytes: 1,
  op: opcodes['PLP']
};

optable[0x68] = {
  name: 'PLA',
  cycles: 4,
  bytes: 1,
  op: opcodes['PLA']
};

optable[0x48] = {
  name: 'PHA',
  cycles: 3,
  bytes: 1,
  op: opcodes['PHA']
};

optable[0x29] = {
  name: 'AND_IMM',
  cycles: 2,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['AND_IMM']
};

optable[0x25] = {
  name: 'AND_ZP',
  cycles: 3,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['AND_ZP']
};

optable[0x35] = {
  name: 'AND_ZP_X',
  cycles: 4,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['AND_ZP_X']
};

optable[0x39] = {
  name: 'AND_ZP_Y',
  cycles: 4,
  bytes: 2,
  flags: ['UZ','UN'],
  operand: "A",
  op: opcodes['AND_ZP']
};

optable[0xC0] = {
  name: 'CPY_IMM',
  bytes: 2,
  cycles: 2,
  op: opcodes['CPY_IMM']
};

optable[0xC4] = {
  name: 'CPY_ZP',
  bytes: 2,
  cycles: 3,
  op: opcodes['CPY_ZP']
};

optable[0xCC] = {
  name: 'CPY_ABS',
  bytes: 3,
  cycles: 4,
  op: opcodes['CPY_ABS']
};

optable[0xE0] = {
  name: 'CPX_IMM',
  bytes: 2,
  cycles: 2,
  op: opcodes['CPX_IMM']
};

optable[0xE4] = {
  name: 'CPX_ZP',
  bytes: 2,
  cycles: 3,
  op: opcodes['CPX_ZP']
};

optable[0xEC] = {
  name: 'CPX_ABS',
  bytes: 3,
  cycles: 4,
  op: opcodes['CPX_IMM']
};

optable[0xC9] = {
  name: 'CMP_IMM',
  bytes: 2,
  cycles: 2,
  op: opcodes['CMP_IMM']
};

optable[0xC5] = {
  name: 'CMP_ZP',
  bytes: 2,
  cycles: 3,
  op: opcodes['CMP_ZP']
};

optable[0xD5] = {
  name: 'CMP_ZP_X',
  bytes: 2,
  cycles: 2,
  op: opcodes['CMP_ZP_X']
};

optable[0xCD] = {
  name: 'CMP_ABS',
  bytes: 2,
  cycles: 4,
  op: opcodes['CMP_ABS']
};

optable[0x49] = {
  name: 'EOR_IMM',
  bytes: 2,
  cycles: 2,
  op: opcodes['EOR_IMM']
};

optable[0xE9] = {
  name: 'SBC_IMM',
  bytes: 2,
  cycles: 2,
  flags: ['UZ'],
  operand: "A",
  op: opcodes['SBC_IMM']
};

optable[0x84] = {
  name: "STY_ZP",
  bytes: 2,
  cycles: 3,
  op: opcodes['STY_ZP']
};

optable[0x94] = {
  name: "STY_ZP_X",
  bytes: 2,
  cycles: 4,
  op: opcodes['STY_ZP_X']
};

optable[0x8C] = {
  name: "STY_ABS",
  bytes: 2,
  cycles: 3,
  op: opcodes['STY_ABS']
};

optable[0xC8] = {
  name: "INY",
  operand: "Y",
  flags: ["UZ","UN"],
  op: opcodes["INY"],
  bytes: 1,
  cycles: 2
};

optable[0x88] = {
  name: "DEY",
  operand: "Y",
  flags: ["UZ","UN"],
  op: opcodes["DEY"],
  bytes: 1,
  cycles: 2
};

optable[0xCA] = {
  name: "DEX",
  operand: "X",
  flags: ["UZ","UN"],
  op: opcodes["DEX"],
  bytes: 1,
  cycles: 2
};

optable[0xE8] = {
  name: "INX",
  operand: "X",
  flags: ["UZ","UN"],
  op: opcodes["INX"],
  bytes: 1,
  cycles: 2
};

optable[0xA8] = {
  name: 'TAY',
  operand: "Y",
  flags: ["UZ","UN"],
  bytes: 1,
  cycles: 2,
  op: opcodes["TAY"]
};

optable[0xAA] = {
  name: 'TAX',
  operand: "X",
  flags: ["UZ","UN"],
  bytes: 1,
  cycles: 2,
  op: opcodes["TAX"]
};

optable[0x98] = {
  name: "TYA",
  operand: "A",
  flags: ["UZ","UN"],
  bytes: 1,
  cycles: 2,
  op: opcodes["TYA"]
};

optable[0x8A] = {
  name: "TXA",
  operand: "A",
  flags: ["UZ","UN"],
  bytes: 1,
  cycles: 2,
  op: opcodes["TXA"]
};

optable[0x9A] = {
  name: "TXS",
  bytes: 1,
  cycles: 2,
  op: opcodes["TXS"]
};

optable[0xBA] = {
  name: "TSX",
  bytes: 1,
  cycles: 2,
  op: opcodes["TSX"],
  flags: ["UZ","UN"],
  operand: "X"
};

optable[0x40] = {
  name: "RTI",
  bytes: 1,
  cycles: 6,
  op: opcodes["RTI"]
};

module.exports = optable;
