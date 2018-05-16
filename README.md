# NEStor - A NES emulator in JavaScript

Initial approach is to implement the CPU by testing the status in relation to nestest golden log http://www.qmtpro.com/~nes/misc/nestest.log

## Current Status:

* CPU - Partially implemented, many opcodes working.
** Cycles currently unimplemented. At all. This will need to change to start syncing with the PPU
** Status flags giving some strange results, probably related to implementation

* ROM Loading - Partially implemented
* PPU - Unimplemented
* APU - Unimplemented
