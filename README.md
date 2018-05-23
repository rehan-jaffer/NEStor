# NEStor - A NES emulator in JavaScript

Initial approach is to implement the CPU by testing the status in relation to nestest golden log http://www.qmtpro.com/~nes/misc/nestest.log

The emulator's name comes from the tradition of a pun + an obscure reference. Nestor of Gerenia (Ancient Greek: Νέστωρ Γερήνιος, Nestōr Gerēnios) was the wise King of Pylos described in Homer's Odyssey. Nestor was an Argonaut, helped fight the centaurs, and participated in the hunt for the Calydonian Boar. He became the King of Pylos after Heracles killed Neleus and all of Nestor's siblings. It also appears in the Star Trek universe: In Cardassian judicial proceedings, a nestor is an officer of the Cardassian court.

## Current Status:

* CPU - Partially implemented, many opcodes working.
** Cycles currently unimplemented. At all. This will need to change to start syncing with the PPU
** Status flags giving some strange results, probably related to implementation

* ROM Loading - Partially implemented
* PPU - Unimplemented
* APU - Unimplemented

Running nestest.nes from 0xC000 will allow the CPU to execute about 700 instructions. Starting from the reset vector at 0xC004 will not, as it attempts PPU initialization.

## Performance considerations

* Many parts of code are using string functions for bit manipulation to speed up time (and also because I am not good at bitwise operations). Fixing this by using bit math should speed up these functions considerably.

# NES Specs

## Registers

* A - Accumulator register
* X & Y - Index registers
* SP - Stack Pointer
* PC - Program Counter
* P - Processor Status

## Hardware

* 8-bit 6502 CPU @ 1.7mhz
* 16-bit Addressable Memory Space
* PPU supports rendering 256x240 composed of 8x8 tiles
* APU supports (?? I am not good at understanding audio)
