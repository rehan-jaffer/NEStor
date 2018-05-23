const JSR = 0x20;
const LDX = 0xA2;
const JMP = 0x4C;
const STX = 0x86;
const SEC = 0x38;
const BCS = 0xB0;
const CLC = 0x18;
const LDA_ZP = 0xA5;
const BEQ = 0xF0;
const BNE = 0xD0;
const BIT = 0x24;
const BVS = 0x70;
const BVC = 0x50;
const BPL = 0x10;
const INX = 0xE8;
const TSX = 0xBA;

const BRK = 0x00;
const ORA_I = 0x01;
const ORA_ZP = 0x01;
const ASL_ZP = 0x06;
const PHP = 0x8;
const ORA_IMM = 0x09;
const ASL_A = 0x0A;
const ORA_ABS = 0x0D;
const ORA_IY = 0x11;
const ORA_ZP_X = 0x15;
const ASL_ZP_X = 0x16;
const AND_IX = 0x21;
const AND_ZP = 0x25;
const ROL_ZP = 0x26;
const PLP = 0x28;
const AND_IMM = 0x29;
const ROL_ABS = 0x2E;
const BMI = 0x30;
const AND_IY = 0x31;
const AND_ZP_X = 0x35;
const ROL_ZP_X = 0x36;
const AND_ABS_Y = 0x39;
const AND_ABS_X = 0x3D;
const ROL_ABS_X = 0x3E;
const RTI = 0x40;
const EOR_IX = 0x41;
const EOR_ZP = 0x45;
const LSR_ZP = 0x46;
const PHA = 0x48;
const EOR_IMM = 0x49;
const LSR_A = 0x4A;
const EOR_ABS = 0x4D;
const LSR_ABS = 0x4E;
const EOR_IY = 0x51;
const EOR_ZP_X = 0x55;
const LSR_ZP_X = 0x56;
const EOR_ABS_Y = 0x59;
const EOR_ABS_X = 0x5D;
const LSR_ABS_X = 0x5E;
const RTS = 0x60;
const ADC_IX = 0x61;
const ADC_ZP = 0x65;
const ROR_ZP = 0x66;
const PLA = 0x68;
const ADC_IMM = 0x69;
const ROR_A = 0x6A;
const JMP_I = 0x6C;
const ADC_ABS = 0x6D;
const ROR_ABS = 0x6E;
const ADC_IY = 0x71;
const ADC_ZP_X = 0x75;
const ROR_ZP_X = 0x76;
const SEI = 0x78;
const ADC_ABS_Y = 0x79;
const ADC_ABS_X = 0x7D;
const ROR_ABS_X = 0x7E;
const STA_IX = 0x81;
const STY_ZP = 0x84;
const STA_ZP = 0x85;
const STX_ZP = 0x86;
const DEY = 0x88;
const TXA = 0x8A;
const STY_ABS = 0x8C;
const STY_STA = 0x8D;
const STX_ABS = 0x8E;
const BCC = 0x90;
const STA_IY = 0x91;
const STY_ZP_X = 0x94;
const STA_ZP_X = 0x95;
const STX_ZP_Y = 0x96;
const TYA = 0x98;
const STA_ABS_Y = 0x99;
const TXS = 0x9a;
const STA = 0x9D;
const LDY_IMM = 0xA0;
const LDA_IX = 0xA1;
const LDX_IMM = 0xA2;
const TAY = 0xA8;
const LDA_IMM = 0xA9;
const TAX = 0xAA;
const LDY_ABS = 0xAC;
const LDA_ABS = 0xAD;
const LDX_ABS = 0xAE;
const LDA_IY = 0xB1;
const LDY_ZP_X = 0xB4;
const LDA_ZP_X = 0xB6;
const LDX_ZP_Y = 0xB6;
const CLV = 0xB8;
const LDA_ABS_Y = 0xB9;
const LDY_ABS_X = 0xBC;
const LDA_ABS_X = 0xBD;
const LDX_ABS_Y = 0xBE;
const CPY_IMM = 0xC0;
const CMP_IX = 0xC1;
const CPY_ZP = 0xC4;
const DEC_ZP = 0xC6;
const INY = 0xC8;
const CMP_IMM = 0xC9;
const DEX = 0xCA;
const CPY_ABS = 0xCC;
const CMP_ABS = 0xCD;
const DEC_ABS = 0xCE;
const CMP_IY = 0xD1;
const CMP_ZP_X = 0xD5;
const DEC_ZP_X = 0xD6;
const CLD = 0xD8;
const CMP_ABS_Y = 0xD9;
const CMP_ABS_X = 0xDD;
const DEC_ABS_X = 0xDE;
const CPX_IMM = 0xE0;
const SBC_IX = 0xE1;
const CPX_ZP = 0xE4;
const SBC_ZP = 0xE5;
const INC_ZP = 0xE6;
const SBC_IMM = 0xE9;
const NOP = 0xEA;
const CPX_ABS = 0xEC;
const SBC_ABS = 0xED;
const INC_ABS = 0xEE;
const SBC_IY = 0xF1;
const SBC_ZP_X = 0xF5;
const INC_ZP_X = 0xF6;
const SED = 0xF8;
const SBC_ABS_Y = 0xF9;
const SBC_ABS_X = 0xFD;
const INC_ABS_X = 0xFE;
const ROL_A = 0x2A;

// module.exports = {LDX, JMP, STX, SEC, BCS, CLC, BCC, LDA_ZP, BEQ, BNE, STA_ZP, BIT, BVS, BVC, BPL}

var op_table = {};
op_table[162] = 'LDX';
op_table[76] = 'JMP';
op_table[134] = 'STX';
op_table[56] = 'SEC';
op_table[176] = 'BCS';
op_table[24] = 'CLC';
op_table[169] = 'LDA_ZP';
op_table[240] = 'BEQ';
op_table[208] = 'BNE';
op_table[36] = 'BIT';
op_table[112] = 'BVS';
op_table[80] = 'BVC';
op_table[16] = 'BPL';
op_table[0] = 'BRK';
op_table[1] = 'ORA_I';
op_table[1] = 'ORA_ZP';
op_table[6] = 'ASL_ZP';
op_table[8] = 'PHP';
op_table[9] = 'ORA_IMM';
op_table[10] = 'ASL_A';
op_table[13] = 'ORA_ABS';
op_table[17] = 'ORA_IY';
op_table[21] = 'ORA_ZP_X';
op_table[22] = 'ASL_ZP_X';
op_table[33] = 'AND_IX';
op_table[37] = 'AND_ZP';
op_table[38] = 'ROL_ZP';
op_table[40] = 'PLP';
op_table[41] = 'AND_IMM';
op_table[46] = 'ROL_ABS';
op_table[48] = 'BMI';
op_table[49] = 'AND_IY';
op_table[53] = 'AND_ZP_X';
op_table[54] = 'ROL_ZP_X';
op_table[57] = 'AND_ABS_Y';
op_table[61] = 'AND_ABS_X';
op_table[62] = 'ROL_ABS_X';
op_table[64] = 'RTI';
op_table[65] = 'EOR_IX';
op_table[69] = 'EOR_ZP';
op_table[70] = 'LSR_ZP';
op_table[72] = 'PHA';
op_table[73] = 'EOR_IMM';
op_table[74] = 'LSR_A';
op_table[77] = 'EOR_ABS';
op_table[78] = 'LSR_ABS';
op_table[81] = 'EOR_IY';
op_table[85] = 'EOR_ZP_X';
op_table[86] = 'LSR_ZP_X';
op_table[89] = 'EOR_ABS_Y';
op_table[93] = 'EOR_ABS_X';
op_table[94] = 'LSR_ABS_X';
op_table[96] = 'RTS';
op_table[97] = 'ADC_IX';
op_table[101] = 'ADC_ZP';
op_table[102] = 'ROR_ZP';
op_table[104] = 'PLA';
op_table[105] = 'ADC_IMM';
op_table[106] = 'ROR_A';
op_table[108] = 'JMP_I';
op_table[109] = 'ADC_ABS';
op_table[110] = 'ROR_ABS';
op_table[113] = 'ADC_IY';
op_table[117] = 'ADC_ZP_X';
op_table[118] = 'ROR_ZP_X';
op_table[120] = 'SEI';
op_table[121] = 'ADC_ABS_Y';
op_table[125] = 'ADC_ABS_X';
op_table[126] = 'ROR_ABS_X';
op_table[129] = 'STA_IX';
op_table[132] = 'STY_ZP';
op_table[133] = 'STA_ZP';
op_table[134] = 'STX_ZP';
op_table[136] = 'DEY';
op_table[138] = 'TXA';
op_table[140] = 'STY_ABS';
op_table[141] = 'STY_STA';
op_table[142] = 'STX_ABS';
op_table[144] = 'BCC';
op_table[145] = 'STA_IY';
op_table[148] = 'STY_ZP_X';
op_table[149] = 'STA_ZP_X';
op_table[150] = 'STX_ZP_Y';
op_table[152] = 'TYA';
op_table[153] = 'STA_ABS_Y';
op_table[154] = 'TXS';
op_table[157] = 'STA';
op_table[160] = 'LDY_IMM';
op_table[161] = 'LDA_IX';
op_table[162] = 'LDX_IMM';
op_table[168] = 'TAY';
op_table[169] = 'LDA_IMM';
op_table[170] = 'TAX';
op_table[172] = 'LDY_ABS';
op_table[173] = 'LDA_ABS';
op_table[174] = 'LDX_ABS';
op_table[177] = 'LDA_IY';
op_table[180] = 'LDY_ZP_X';
op_table[182] = 'LDA_ZP_X';
op_table[182] = 'LDX_ZP_Y';
op_table[184] = 'CLV';
op_table[185] = 'LDA_ABS_Y';
op_table[188] = 'LDY_ABS_X';
op_table[189] = 'LDA_ABS_X';
op_table[190] = 'LDX_ABS_Y';
op_table[192] = 'CPY_IMM';
op_table[193] = 'CMP_IX';
op_table[196] = 'CPY_ZP';
op_table[198] = 'DEC_ZP';
op_table[200] = 'INY';
op_table[201] = 'CMP_IMM';
op_table[202] = 'DEX';
op_table[204] = 'CPY_ABS';
op_table[205] = 'CMP_ABS';
op_table[206] = 'DEC_ABS';
op_table[209] = 'CMP_IY';
op_table[213] = 'CMP_ZP_X';
op_table[214] = 'DEC_ZP_X';
op_table[216] = 'CLD';
op_table[217] = 'CMP_ABS_Y';
op_table[221] = 'CMP_ABS_X';
op_table[222] = 'DEC_ABS_X';
op_table[224] = 'CPX_IMM';
op_table[225] = 'SBC_IX';
op_table[228] = 'CPX_ZP';
op_table[229] = 'SBC_ZP';
op_table[230] = 'INC_ZP';
op_table[233] = 'SBC_IMM';
op_table[234] = 'NOP';
op_table[236] = 'CPX_ABS';
op_table[237] = 'SBC_ABS';
op_table[238] = 'INC_ABS';
op_table[241] = 'SBC_IY';
op_table[245] = 'SBC_ZP_X';
op_table[246] = 'INC_ZP_X';
op_table[248] = 'SED';
op_table[249] = 'SBC_ABS_Y';
op_table[253] = 'SBC_ABS_X';
op_table[254] = 'INC_ABS_X';

module.exports = {op_table, LDX,JMP,STX,SEC,BCS,CLC,LDA_ZP,BEQ,BNE,BIT,BVS,BVC,BPL,BRK,ORA_I,ORA_ZP,ASL_ZP,PHP,ORA_IMM,ASL_A,ORA_ABS,ORA_IY,ORA_ZP_X,ASL_ZP_X,AND_IX,AND_ZP,ROL_ZP,PLP,AND_IMM,ROL_ABS,BMI,AND_IY,AND_ZP_X,ROL_ZP_X,AND_ABS_Y,AND_ABS_X,ROL_ABS_X,RTI,EOR_IX,EOR_ZP,LSR_ZP,PHA,EOR_IMM,LSR_A,EOR_ABS,LSR_ABS,EOR_IY,EOR_ZP_X,LSR_ZP_X,EOR_ABS_Y,EOR_ABS_X,LSR_ABS_X,RTS,ADC_IX,ADC_ZP,ROR_ZP,PLA,ADC_IMM,ROR_A,JMP_I,ADC_ABS,ROR_ABS,ADC_IY,ADC_ZP_X,ROR_ZP_X,SEI,ADC_ABS_Y,ADC_ABS_X,ROR_ABS_X,STA_IX,STY_ZP,STA_ZP,STX_ZP,DEY,TXA,STY_ABS,STY_STA,STX_ABS,BCC,STA_IY,STY_ZP_X,STA_ZP_X,STX_ZP_Y,TYA,STA_ABS_Y,TXS,STA,LDY_IMM,LDA_IX,LDX_IMM,TAY,LDA_IMM,TAX,LDY_ABS,LDA_ABS,LDX_ABS,LDA_IY,LDY_ZP_X,LDA_ZP_X,LDX_ZP_Y,CLV,LDA_ABS_Y,LDY_ABS_X,LDA_ABS_X,LDX_ABS_Y,CPY_IMM,CMP_IX,CPY_ZP,DEC_ZP,INY,CMP_IMM,DEX,CPY_ABS,CMP_ABS,DEC_ABS,CMP_IY,CMP_ZP_X,DEC_ZP_X,CLD,CMP_ABS_Y,CMP_ABS_X,DEC_ABS_X,CPX_IMM,SBC_IX,CPX_ZP,SBC_ZP,INC_ZP,SBC_IMM,NOP,CPX_ABS,SBC_ABS,INC_ABS,SBC_IY,SBC_ZP_X,INC_ZP_X,SED,SBC_ABS_Y,SBC_ABS_X,INC_ABS_X, INX, TSX, ROL_A, LDA_ZP, JSR}
