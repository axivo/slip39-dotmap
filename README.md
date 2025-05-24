# slip39-dotmap

Turn SLIP39 words into dotmap, for use with [OneKey KeyTag](https://onekey.so/products/onekey-keytag/) hardware backup devices. This document provides the complete conversion table to physically encode SLIP39 mnemonic phrases using the correct SLIP39 specification, as alternative to official OneKey [BIP39 dotmap](https://github.com/OneKeyHQ/bip39-dotmap).

## Overview

SLIP39 (Shamir's Secret Sharing for Mnemonic Codes) offers enhanced security over BIP39 through threshold secret sharing, allowing you to split your seed into multiple shares where only a subset is needed for recovery. This dotmap implementation enables you to store SLIP39 phrases on durable metal KeyTag devices.

**Key differences from BIP39:**

- **Wordlist**: SLIP39 uses [1024 words](https://github.com/satoshilabs/slips/tree/master/slip-0039) (indices 1-1024) vs BIP39's 2048 words (indices 1-2048)
- **Security model**: Supports threshold sharing (e.g., 2-of-3, 3-of-5 schemes) vs single point of failure
- **Encoding**: Uses 12-bit binary encoding for proper SLIP39 index mapping
- **Hardware**: Compatible with OneKey KeyTag and other dotmap-based backup devices

## Methodology

Each SLIP39 word is converted to a unique 12-dot pattern using binary encoding:

1. **Index Mapping**: Use the word's SLIP39 index (1-1024) directly
2. **Binary Conversion**: Convert the index value to 12-bit binary
3. **Dot Encoding**: ● = bit value 1, ○ = bit value 0
4. **KeyTag Layout**: Split into three 4-dot columns for easy punching

This ensures mathematical consistency and unique representation for each word, while maintaining compatibility with existing KeyTag hardware.

### Verification Method

The following verification method was used:

- Columns: [bits 11-8][bits 7-4][bits 3-0]
- Dotmap: ● = bit 1, ○ = bit 0  
- Formula: SLIP39 index → 12-bit binary → dotmap pattern

### Usage

Use 12 dots per word to record your mnemonic phrase.

#### Physical KeyTag Layout

The KeyTag hardware provides 12 bit positions arranged as follows:

```
[2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
```

#### BIP39 vs SLIP39 Bit Usage

- **BIP39**: Uses all 12 bits (2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1)
  - Word range: 2048 words (indices 1-2048)
  - Any dot pattern possible
- **SLIP39**: Uses only 11 bits (1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1)
  - Word range: 1024 words (indices 1-1024)
  - Position 2048 always remains empty (○)

#### Hardware Compatibility

The same KeyTag hardware works for both standards. For SLIP39 words, the leftmost dot (2048 position) will always remain un-punched across all words. This is correct and expected behavior, not an error.

For instance (showing physical KeyTag positions):

#63 `avoid` = 32 + 16 + 8 + 4 + 2 + 1
```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ○     ○       ○     ○    ●    ●      ●   ●   ●   ●
```
| ○○○○ | ○○●● | ●●●● |

#977 `veteran` = 512 + 256 + 128 + 64 + 16 + 1
```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ●     ●       ●     ●    ○    ●      ○   ○   ○   ●
```
| ○○●● | ●●○● | ○○○● |

### Visual Example

The [diagram](https://raw.githubusercontent.com/axivo/slip39-dotmap/refs/heads/main/keytag-demo.svg) shows how SLIP39 words are encoded on the KeyTag hardware device. Each numbered row corresponds to a word in your mnemonic phrase, with dots representing the 12-bit binary encoding. The `*` row can be used for optional passphrases, using the same encoding method.

## Offline Word Recovery

For maximum security, retrieve SLIP39 words from your KeyTag using only offline methods. Never enter actual seed patterns into electronic devices (e.g., computer, mobile phone, tablet), use air-gapped calculators or manual methods only.

### Method 1: Scientific Calculator (Recommended)

Equipment needed:

- Scientific calculator with binary/decimal conversion (e.g., Casio fx-991ES PLUS C)
- Printed SLIP39 wordlist

#### Steps

1. **Enter Binary Mode**: `MODE` → `3` → `1` (BIN)
2. **Read KeyTag pattern**: Convert ○ = 0, ● = 1
3. **Enter 12-bit pattern**: e.g., `000000111111`
4. **Convert to decimal**: `MODE` → `3` → `4` (DEC)
5. **Look up word**: Use result as SLIP39 word index

#### Examples

- Pattern `○○○○○○●●●●●●` → `000000111111` → 63 → `avoid`
- Pattern `○○●●●●○●○○○●` → `001111010001` → 977 → `veteran`

### Method 2: Manual Calculation

Equipment needed:

- Basic calculator
- Printed SLIP39 wordlist

#### Steps

1. **Identify bit positions**: [2048][1024][512][256][128][64][32][16][8][4][2][1]
2. **Add punched positions**: Sum all ● positions
3. **Look up word**: Use result as SLIP39 word index

#### Examples

- Pattern `○○○○○○●●●●●●` → positions 32+16+8+4+2+1 = 63 → `avoid`
- Pattern `○○●●●●○●○○○●` → positions 512+256+128+64+16+1 = 977 → `veteran`

## Conversion Table

This table shows SLIP39 indices (1-1024) with their corresponding dotmap patterns, each word's SLIP39 index is encoded directly in 12-bit binary.

| Index | Word     | Column1 | Column2 | Column3 |
|-------|----------|---------|---------|---------|
| 1     | academic | ○○○○    | ○○○○    | ○○○●    |
| 2     | acid     | ○○○○    | ○○○○    | ○○●○    |
| 3     | acne     | ○○○○    | ○○○○    | ○○●●    |
| 4     | acquire  | ○○○○    | ○○○○    | ○●○○    |
| 5     | acrobat  | ○○○○    | ○○○○    | ○●○●    |
| 6     | activity | ○○○○    | ○○○○    | ○●●○    |
| 7     | actress  | ○○○○    | ○○○○    | ○●●●    |
| 8     | adapt    | ○○○○    | ○○○○    | ●○○○    |
| 9     | adequate | ○○○○    | ○○○○    | ●○○●    |
| 10    | adjust   | ○○○○    | ○○○○    | ●○●○    |
| 11    | admit    | ○○○○    | ○○○○    | ●○●●    |
| 12    | adorn    | ○○○○    | ○○○○    | ●●○○    |
| 13    | adult    | ○○○○    | ○○○○    | ●●○●    |
| 14    | advance  | ○○○○    | ○○○○    | ●●●○    |
| 15    | advocate | ○○○○    | ○○○○    | ●●●●    |
| 16    | afraid   | ○○○○    | ○○○●    | ○○○○    |
| 17    | again    | ○○○○    | ○○○●    | ○○○●    |
| 18    | agency   | ○○○○    | ○○○●    | ○○●○    |
| 19    | agree    | ○○○○    | ○○○●    | ○○●●    |
| 20    | aide     | ○○○○    | ○○○●    | ○●○○    |
| 21    | aircraft | ○○○○    | ○○○●    | ○●○●    |
| 22    | airline  | ○○○○    | ○○○●    | ○●●○    |
| 23    | airport  | ○○○○    | ○○○●    | ○●●●    |
| 24    | ajar     | ○○○○    | ○○○●    | ●○○○    |
| 25    | alarm    | ○○○○    | ○○○●    | ●○○●    |
| 26    | album    | ○○○○    | ○○○●    | ●○●○    |
| 27    | alcohol  | ○○○○    | ○○○●    | ●○●●    |
| 28    | alien    | ○○○○    | ○○○●    | ●●○○    |
| 29    | alive    | ○○○○    | ○○○●    | ●●○●    |
| 30    | alpha    | ○○○○    | ○○○●    | ●●●○    |
| 31    | already  | ○○○○    | ○○○●    | ●●●●    |
| 32    | alto     | ○○○○    | ○○●○    | ○○○○    |
| 33    | aluminum | ○○○○    | ○○●○    | ○○○●    |
| 34    | always   | ○○○○    | ○○●○    | ○○●○    |
| 35    | amazing  | ○○○○    | ○○●○    | ○○●●    |
| 36    | ambition | ○○○○    | ○○●○    | ○●○○    |
| 37    | amount   | ○○○○    | ○○●○    | ○●○●    |
| 38    | amuse    | ○○○○    | ○○●○    | ○●●○    |
| 39    | analysis | ○○○○    | ○○●○    | ○●●●    |
| 40    | anatomy  | ○○○○    | ○○●○    | ●○○○    |
| 41    | ancestor | ○○○○    | ○○●○    | ●○○●    |
| 42    | ancient  | ○○○○    | ○○●○    | ●○●○    |
| 43    | angel    | ○○○○    | ○○●○    | ●○●●    |
| 44    | angry    | ○○○○    | ○○●○    | ●●○○    |
| 45    | animal   | ○○○○    | ○○●○    | ●●○●    |
| 46    | answer   | ○○○○    | ○○●○    | ●●●○    |
| 47    | antenna  | ○○○○    | ○○●○    | ●●●●    |
| 48    | anxiety  | ○○○○    | ○○●●    | ○○○○    |
| 49    | apart    | ○○○○    | ○○●●    | ○○○●    |
| 50    | aquatic  | ○○○○    | ○○●●    | ○○●○    |
| 51    | arcade   | ○○○○    | ○○●●    | ○○●●    |
| 52    | arena    | ○○○○    | ○○●●    | ○●○○    |
| 53    | argue    | ○○○○    | ○○●●    | ○●○●    |
| 54    | armed    | ○○○○    | ○○●●    | ○●●○    |
| 55    | artist   | ○○○○    | ○○●●    | ○●●●    |
| 56    | artwork  | ○○○○    | ○○●●    | ●○○○    |
| 57    | aspect   | ○○○○    | ○○●●    | ●○○●    |
| 58    | auction  | ○○○○    | ○○●●    | ●○●○    |
| 59    | august   | ○○○○    | ○○●●    | ●○●●    |
| 60    | aunt     | ○○○○    | ○○●●    | ●●○○    |
| 61    | average  | ○○○○    | ○○●●    | ●●○●    |
| 62    | aviation | ○○○○    | ○○●●    | ●●●○    |
| 63    | avoid    | ○○○○    | ○○●●    | ●●●●    |
| 64    | award    | ○○○○    | ○●○○    | ○○○○    |
| 65    | away     | ○○○○    | ○●○○    | ○○○●    |
| 66    | axis     | ○○○○    | ○●○○    | ○○●○    |
| 67    | axle     | ○○○○    | ○●○○    | ○○●●    |
| 68    | beam     | ○○○○    | ○●○○    | ○●○○    |
| 69    | beard    | ○○○○    | ○●○○    | ○●○●    |
| 70    | beaver   | ○○○○    | ○●○○    | ○●●○    |
| 71    | become   | ○○○○    | ○●○○    | ○●●●    |
| 72    | bedroom  | ○○○○    | ○●○○    | ●○○○    |
| 73    | behavior | ○○○○    | ○●○○    | ●○○●    |
| 74    | being    | ○○○○    | ○●○○    | ●○●○    |
| 75    | believe  | ○○○○    | ○●○○    | ●○●●    |
| 76    | belong   | ○○○○    | ○●○○    | ●●○○    |
| 77    | benefit  | ○○○○    | ○●○○    | ●●○●    |
| 78    | best     | ○○○○    | ○●○○    | ●●●○    |
| 79    | beyond   | ○○○○    | ○●○○    | ●●●●    |
| 80    | bike     | ○○○○    | ○●○●    | ○○○○    |
| 81    | biology  | ○○○○    | ○●○●    | ○○○●    |
| 82    | birthday | ○○○○    | ○●○●    | ○○●○    |
| 83    | bishop   | ○○○○    | ○●○●    | ○○●●    |
| 84    | black    | ○○○○    | ○●○●    | ○●○○    |
| 85    | blanket  | ○○○○    | ○●○●    | ○●○●    |
| 86    | blessing | ○○○○    | ○●○●    | ○●●○    |
| 87    | blimp    | ○○○○    | ○●○●    | ○●●●    |
| 88    | blind    | ○○○○    | ○●○●    | ●○○○    |
| 89    | blue     | ○○○○    | ○●○●    | ●○○●    |
| 90    | body     | ○○○○    | ○●○●    | ●○●○    |
| 91    | bolt     | ○○○○    | ○●○●    | ●○●●    |
| 92    | boring   | ○○○○    | ○●○●    | ●●○○    |
| 93    | born     | ○○○○    | ○●○●    | ●●○●    |
| 94    | both     | ○○○○    | ○●○●    | ●●●○    |
| 95    | boundary | ○○○○    | ○●○●    | ●●●●    |
| 96    | bracelet | ○○○○    | ○●●○    | ○○○○    |
| 97    | branch   | ○○○○    | ○●●○    | ○○○●    |
| 98    | brave    | ○○○○    | ○●●○    | ○○●○    |
| 99    | breathe  | ○○○○    | ○●●○    | ○○●●    |
| 100   | briefing | ○○○○    | ○●●○    | ○●○○    |
| 101   | broken   | ○○○○    | ○●●○    | ○●○●    |
| 102   | brother  | ○○○○    | ○●●○    | ○●●○    |
| 103   | browser  | ○○○○    | ○●●○    | ○●●●    |
| 104   | bucket   | ○○○○    | ○●●○    | ●○○○    |
| 105   | budget   | ○○○○    | ○●●○    | ●○○●    |
| 106   | building | ○○○○    | ○●●○    | ●○●○    |
| 107   | bulb     | ○○○○    | ○●●○    | ●○●●    |
| 108   | bulge    | ○○○○    | ○●●○    | ●●○○    |
| 109   | bumpy    | ○○○○    | ○●●○    | ●●○●    |
| 110   | bundle   | ○○○○    | ○●●○    | ●●●○    |
| 111   | burden   | ○○○○    | ○●●○    | ●●●●    |
| 112   | burning  | ○○○○    | ○●●●    | ○○○○    |
| 113   | busy     | ○○○○    | ○●●●    | ○○○●    |
| 114   | buyer    | ○○○○    | ○●●●    | ○○●○    |
| 115   | cage     | ○○○○    | ○●●●    | ○○●●    |
| 116   | calcium  | ○○○○    | ○●●●    | ○●○○    |
| 117   | camera   | ○○○○    | ○●●●    | ○●○●    |
| 118   | campus   | ○○○○    | ○●●●    | ○●●○    |
| 119   | canyon   | ○○○○    | ○●●●    | ○●●●    |
| 120   | capacity | ○○○○    | ○●●●    | ●○○○    |
| 121   | capital  | ○○○○    | ○●●●    | ●○○●    |
| 122   | capture  | ○○○○    | ○●●●    | ●○●○    |
| 123   | carbon   | ○○○○    | ○●●●    | ●○●●    |
| 124   | cards    | ○○○○    | ○●●●    | ●●○○    |
| 125   | careful  | ○○○○    | ○●●●    | ●●○●    |
| 126   | cargo    | ○○○○    | ○●●●    | ●●●○    |
| 127   | carpet   | ○○○○    | ○●●●    | ●●●●    |
| 128   | carve    | ○○○○    | ●○○○    | ○○○○    |
| 129   | category | ○○○○    | ●○○○    | ○○○●    |
| 130   | cause    | ○○○○    | ●○○○    | ○○●○    |
| 131   | ceiling  | ○○○○    | ●○○○    | ○○●●    |
| 132   | center   | ○○○○    | ●○○○    | ○●○○    |
| 133   | ceramic  | ○○○○    | ●○○○    | ○●○●    |
| 134   | champion | ○○○○    | ●○○○    | ○●●○    |
| 135   | change   | ○○○○    | ●○○○    | ○●●●    |
| 136   | charity  | ○○○○    | ●○○○    | ●○○○    |
| 137   | check    | ○○○○    | ●○○○    | ●○○●    |
| 138   | chemical | ○○○○    | ●○○○    | ●○●○    |
| 139   | chest    | ○○○○    | ●○○○    | ●○●●    |
| 140   | chew     | ○○○○    | ●○○○    | ●●○○    |
| 141   | chubby   | ○○○○    | ●○○○    | ●●○●    |
| 142   | cinema   | ○○○○    | ●○○○    | ●●●○    |
| 143   | civil    | ○○○○    | ●○○○    | ●●●●    |
| 144   | class    | ○○○○    | ●○○●    | ○○○○    |
| 145   | clay     | ○○○○    | ●○○●    | ○○○●    |
| 146   | cleanup  | ○○○○    | ●○○●    | ○○●○    |
| 147   | client   | ○○○○    | ●○○●    | ○○●●    |
| 148   | climate  | ○○○○    | ●○○●    | ○●○○    |
| 149   | clinic   | ○○○○    | ●○○●    | ○●○●    |
| 150   | clock    | ○○○○    | ●○○●    | ○●●○    |
| 151   | clogs    | ○○○○    | ●○○●    | ○●●●    |
| 152   | closet   | ○○○○    | ●○○●    | ●○○○    |
| 153   | clothes  | ○○○○    | ●○○●    | ●○○●    |
| 154   | club     | ○○○○    | ●○○●    | ●○●○    |
| 155   | cluster  | ○○○○    | ●○○●    | ●○●●    |
| 156   | coal     | ○○○○    | ●○○●    | ●●○○    |
| 157   | coastal  | ○○○○    | ●○○●    | ●●○●    |
| 158   | coding   | ○○○○    | ●○○●    | ●●●○    |
| 159   | column   | ○○○○    | ●○○●    | ●●●●    |
| 160   | company  | ○○○○    | ●○●○    | ○○○○    |
| 161   | corner   | ○○○○    | ●○●○    | ○○○●    |
| 162   | costume  | ○○○○    | ●○●○    | ○○●○    |
| 163   | counter  | ○○○○    | ●○●○    | ○○●●    |
| 164   | course   | ○○○○    | ●○●○    | ○●○○    |
| 165   | cover    | ○○○○    | ●○●○    | ○●○●    |
| 166   | cowboy   | ○○○○    | ●○●○    | ○●●○    |
| 167   | cradle   | ○○○○    | ●○●○    | ○●●●    |
| 168   | craft    | ○○○○    | ●○●○    | ●○○○    |
| 169   | crazy    | ○○○○    | ●○●○    | ●○○●    |
| 170   | credit   | ○○○○    | ●○●○    | ●○●○    |
| 171   | cricket  | ○○○○    | ●○●○    | ●○●●    |
| 172   | criminal | ○○○○    | ●○●○    | ●●○○    |
| 173   | crisis   | ○○○○    | ●○●○    | ●●○●    |
| 174   | critical | ○○○○    | ●○●○    | ●●●○    |
| 175   | crowd    | ○○○○    | ●○●○    | ●●●●    |
| 176   | crucial  | ○○○○    | ●○●●    | ○○○○    |
| 177   | crunch   | ○○○○    | ●○●●    | ○○○●    |
| 178   | crush    | ○○○○    | ●○●●    | ○○●○    |
| 179   | crystal  | ○○○○    | ●○●●    | ○○●●    |
| 180   | cubic    | ○○○○    | ●○●●    | ○●○○    |
| 181   | cultural | ○○○○    | ●○●●    | ○●○●    |
| 182   | curious  | ○○○○    | ●○●●    | ○●●○    |
| 183   | curly    | ○○○○    | ●○●●    | ○●●●    |
| 184   | custody  | ○○○○    | ●○●●    | ●○○○    |
| 185   | cylinder | ○○○○    | ●○●●    | ●○○●    |
| 186   | daisy    | ○○○○    | ●○●●    | ●○●○    |
| 187   | damage   | ○○○○    | ●○●●    | ●○●●    |
| 188   | dance    | ○○○○    | ●○●●    | ●●○○    |
| 189   | darkness | ○○○○    | ●○●●    | ●●○●    |
| 190   | database | ○○○○    | ●○●●    | ●●●○    |
| 191   | daughter | ○○○○    | ●○●●    | ●●●●    |
| 192   | deadline | ○○○○    | ●●○○    | ○○○○    |
| 193   | deal     | ○○○○    | ●●○○    | ○○○●    |
| 194   | debris   | ○○○○    | ●●○○    | ○○●○    |
| 195   | debut    | ○○○○    | ●●○○    | ○○●●    |
| 196   | decent   | ○○○○    | ●●○○    | ○●○○    |
| 197   | decision | ○○○○    | ●●○○    | ○●○●    |
| 198   | declare  | ○○○○    | ●●○○    | ○●●○    |
| 199   | decorate | ○○○○    | ●●○○    | ○●●●    |
| 200   | decrease | ○○○○    | ●●○○    | ●○○○    |
| 201   | deliver  | ○○○○    | ●●○○    | ●○○●    |
| 202   | demand   | ○○○○    | ●●○○    | ●○●○    |
| 203   | density  | ○○○○    | ●●○○    | ●○●●    |
| 204   | deny     | ○○○○    | ●●○○    | ●●○○    |
| 205   | depart   | ○○○○    | ●●○○    | ●●○●    |
| 206   | depend   | ○○○○    | ●●○○    | ●●●○    |
| 207   | depict   | ○○○○    | ●●○○    | ●●●●    |
| 208   | deploy   | ○○○○    | ●●○●    | ○○○○    |
| 209   | describe | ○○○○    | ●●○●    | ○○○●    |
| 210   | desert   | ○○○○    | ●●○●    | ○○●○    |
| 211   | desire   | ○○○○    | ●●○●    | ○○●●    |
| 212   | desktop  | ○○○○    | ●●○●    | ○●○○    |
| 213   | destroy  | ○○○○    | ●●○●    | ○●○●    |
| 214   | detailed | ○○○○    | ●●○●    | ○●●○    |
| 215   | detect   | ○○○○    | ●●○●    | ○●●●    |
| 216   | device   | ○○○○    | ●●○●    | ●○○○    |
| 217   | devote   | ○○○○    | ●●○●    | ●○○●    |
| 218   | diagnose | ○○○○    | ●●○●    | ●○●○    |
| 219   | dictate  | ○○○○    | ●●○●    | ●○●●    |
| 220   | diet     | ○○○○    | ●●○●    | ●●○○    |
| 221   | dilemma  | ○○○○    | ●●○●    | ●●○●    |
| 222   | diminish | ○○○○    | ●●○●    | ●●●○    |
| 223   | dining   | ○○○○    | ●●○●    | ●●●●    |
| 224   | diploma  | ○○○○    | ●●●○    | ○○○○    |
| 225   | disaster | ○○○○    | ●●●○    | ○○○●    |
| 226   | discuss  | ○○○○    | ●●●○    | ○○●○    |
| 227   | disease  | ○○○○    | ●●●○    | ○○●●    |
| 228   | dish     | ○○○○    | ●●●○    | ○●○○    |
| 229   | dismiss  | ○○○○    | ●●●○    | ○●○●    |
| 230   | display  | ○○○○    | ●●●○    | ○●●○    |
| 231   | distance | ○○○○    | ●●●○    | ○●●●    |
| 232   | dive     | ○○○○    | ●●●○    | ●○○○    |
| 233   | divorce  | ○○○○    | ●●●○    | ●○○●    |
| 234   | document | ○○○○    | ●●●○    | ●○●○    |
| 235   | domain   | ○○○○    | ●●●○    | ●○●●    |
| 236   | domestic | ○○○○    | ●●●○    | ●●○○    |
| 237   | dominant | ○○○○    | ●●●○    | ●●○●    |
| 238   | dough    | ○○○○    | ●●●○    | ●●●○    |
| 239   | downtown | ○○○○    | ●●●○    | ●●●●    |
| 240   | dragon   | ○○○○    | ●●●●    | ○○○○    |
| 241   | dramatic | ○○○○    | ●●●●    | ○○○●    |
| 242   | dream    | ○○○○    | ●●●●    | ○○●○    |
| 243   | dress    | ○○○○    | ●●●●    | ○○●●    |
| 244   | drift    | ○○○○    | ●●●●    | ○●○○    |
| 245   | drink    | ○○○○    | ●●●●    | ○●○●    |
| 246   | drove    | ○○○○    | ●●●●    | ○●●○    |
| 247   | drug     | ○○○○    | ●●●●    | ○●●●    |
| 248   | dryer    | ○○○○    | ●●●●    | ●○○○    |
| 249   | duckling | ○○○○    | ●●●●    | ●○○●    |
| 250   | duke     | ○○○○    | ●●●●    | ●○●○    |
| 251   | duration | ○○○○    | ●●●●    | ●○●●    |
| 252   | dwarf    | ○○○○    | ●●●●    | ●●○○    |
| 253   | dynamic  | ○○○○    | ●●●●    | ●●○●    |
| 254   | early    | ○○○○    | ●●●●    | ●●●○    |
| 255   | earth    | ○○○○    | ●●●●    | ●●●●    |
| 256   | easel    | ○○○●    | ○○○○    | ○○○○    |
| 257   | easy     | ○○○●    | ○○○○    | ○○○●    |
| 258   | echo     | ○○○●    | ○○○○    | ○○●○    |
| 259   | eclipse  | ○○○●    | ○○○○    | ○○●●    |
| 260   | ecology  | ○○○●    | ○○○○    | ○●○○    |
| 261   | edge     | ○○○●    | ○○○○    | ○●○●    |
| 262   | editor   | ○○○●    | ○○○○    | ○●●○    |
| 263   | educate  | ○○○●    | ○○○○    | ○●●●    |
| 264   | either   | ○○○●    | ○○○○    | ●○○○    |
| 265   | elbow    | ○○○●    | ○○○○    | ●○○●    |
| 266   | elder    | ○○○●    | ○○○○    | ●○●○    |
| 267   | election | ○○○●    | ○○○○    | ●○●●    |
| 268   | elegant  | ○○○●    | ○○○○    | ●●○○    |
| 269   | element  | ○○○●    | ○○○○    | ●●○●    |
| 270   | elephant | ○○○●    | ○○○○    | ●●●○    |
| 271   | elevator | ○○○●    | ○○○○    | ●●●●    |
| 272   | elite    | ○○○●    | ○○○●    | ○○○○    |
| 273   | else     | ○○○●    | ○○○●    | ○○○●    |
| 274   | email    | ○○○●    | ○○○●    | ○○●○    |
| 275   | emerald  | ○○○●    | ○○○●    | ○○●●    |
| 276   | emission | ○○○●    | ○○○●    | ○●○○    |
| 277   | emperor  | ○○○●    | ○○○●    | ○●○●    |
| 278   | emphasis | ○○○●    | ○○○●    | ○●●○    |
| 279   | employer | ○○○●    | ○○○●    | ○●●●    |
| 280   | empty    | ○○○●    | ○○○●    | ●○○○    |
| 281   | ending   | ○○○●    | ○○○●    | ●○○●    |
| 282   | endless  | ○○○●    | ○○○●    | ●○●○    |
| 283   | endorse  | ○○○●    | ○○○●    | ●○●●    |
| 284   | enemy    | ○○○●    | ○○○●    | ●●○○    |
| 285   | energy   | ○○○●    | ○○○●    | ●●○●    |
| 286   | enforce  | ○○○●    | ○○○●    | ●●●○    |
| 287   | engage   | ○○○●    | ○○○●    | ●●●●    |
| 288   | enjoy    | ○○○●    | ○○●○    | ○○○○    |
| 289   | enlarge  | ○○○●    | ○○●○    | ○○○●    |
| 290   | entrance | ○○○●    | ○○●○    | ○○●○    |
| 291   | envelope | ○○○●    | ○○●○    | ○○●●    |
| 292   | envy     | ○○○●    | ○○●○    | ○●○○    |
| 293   | epidemic | ○○○●    | ○○●○    | ○●○●    |
| 294   | episode  | ○○○●    | ○○●○    | ○●●○    |
| 295   | equation | ○○○●    | ○○●○    | ○●●●    |
| 296   | equip    | ○○○●    | ○○●○    | ●○○○    |
| 297   | eraser   | ○○○●    | ○○●○    | ●○○●    |
| 298   | erode    | ○○○●    | ○○●○    | ●○●○    |
| 299   | escape   | ○○○●    | ○○●○    | ●○●●    |
| 300   | estate   | ○○○●    | ○○●○    | ●●○○    |
| 301   | estimate | ○○○●    | ○○●○    | ●●○●    |
| 302   | evaluate | ○○○●    | ○○●○    | ●●●○    |
| 303   | evening  | ○○○●    | ○○●○    | ●●●●    |
| 304   | evidence | ○○○●    | ○○●●    | ○○○○    |
| 305   | evil     | ○○○●    | ○○●●    | ○○○●    |
| 306   | evoke    | ○○○●    | ○○●●    | ○○●○    |
| 307   | exact    | ○○○●    | ○○●●    | ○○●●    |
| 308   | example  | ○○○●    | ○○●●    | ○●○○    |
| 309   | exceed   | ○○○●    | ○○●●    | ○●○●    |
| 310   | exchange | ○○○●    | ○○●●    | ○●●○    |
| 311   | exclude  | ○○○●    | ○○●●    | ○●●●    |
| 312   | excuse   | ○○○●    | ○○●●    | ●○○○    |
| 313   | execute  | ○○○●    | ○○●●    | ●○○●    |
| 314   | exercise | ○○○●    | ○○●●    | ●○●○    |
| 315   | exhaust  | ○○○●    | ○○●●    | ●○●●    |
| 316   | exotic   | ○○○●    | ○○●●    | ●●○○    |
| 317   | expand   | ○○○●    | ○○●●    | ●●○●    |
| 318   | expect   | ○○○●    | ○○●●    | ●●●○    |
| 319   | explain  | ○○○●    | ○○●●    | ●●●●    |
| 320   | express  | ○○○●    | ○●○○    | ○○○○    |
| 321   | extend   | ○○○●    | ○●○○    | ○○○●    |
| 322   | extra    | ○○○●    | ○●○○    | ○○●○    |
| 323   | eyebrow  | ○○○●    | ○●○○    | ○○●●    |
| 324   | facility | ○○○●    | ○●○○    | ○●○○    |
| 325   | fact     | ○○○●    | ○●○○    | ○●○●    |
| 326   | failure  | ○○○●    | ○●○○    | ○●●○    |
| 327   | faint    | ○○○●    | ○●○○    | ○●●●    |
| 328   | fake     | ○○○●    | ○●○○    | ●○○○    |
| 329   | false    | ○○○●    | ○●○○    | ●○○●    |
| 330   | family   | ○○○●    | ○●○○    | ●○●○    |
| 331   | famous   | ○○○●    | ○●○○    | ●○●●    |
| 332   | fancy    | ○○○●    | ○●○○    | ●●○○    |
| 333   | fangs    | ○○○●    | ○●○○    | ●●○●    |
| 334   | fantasy  | ○○○●    | ○●○○    | ●●●○    |
| 335   | fatal    | ○○○●    | ○●○○    | ●●●●    |
| 336   | fatigue  | ○○○●    | ○●○●    | ○○○○    |
| 337   | favorite | ○○○●    | ○●○●    | ○○○●    |
| 338   | fawn     | ○○○●    | ○●○●    | ○○●○    |
| 339   | fiber    | ○○○●    | ○●○●    | ○○●●    |
| 340   | fiction  | ○○○●    | ○●○●    | ○●○○    |
| 341   | filter   | ○○○●    | ○●○●    | ○●○●    |
| 342   | finance  | ○○○●    | ○●○●    | ○●●○    |
| 343   | findings | ○○○●    | ○●○●    | ○●●●    |
| 344   | finger   | ○○○●    | ○●○●    | ●○○○    |
| 345   | firefly  | ○○○●    | ○●○●    | ●○○●    |
| 346   | firm     | ○○○●    | ○●○●    | ●○●○    |
| 347   | fiscal   | ○○○●    | ○●○●    | ●○●●    |
| 348   | fishing  | ○○○●    | ○●○●    | ●●○○    |
| 349   | fitness  | ○○○●    | ○●○●    | ●●○●    |
| 350   | flame    | ○○○●    | ○●○●    | ●●●○    |
| 351   | flash    | ○○○●    | ○●○●    | ●●●●    |
| 352   | flavor   | ○○○●    | ○●●○    | ○○○○    |
| 353   | flea     | ○○○●    | ○●●○    | ○○○●    |
| 354   | flexible | ○○○●    | ○●●○    | ○○●○    |
| 355   | flip     | ○○○●    | ○●●○    | ○○●●    |
| 356   | float    | ○○○●    | ○●●○    | ○●○○    |
| 357   | floral   | ○○○●    | ○●●○    | ○●○●    |
| 358   | fluff    | ○○○●    | ○●●○    | ○●●○    |
| 359   | focus    | ○○○●    | ○●●○    | ○●●●    |
| 360   | forbid   | ○○○●    | ○●●○    | ●○○○    |
| 361   | force    | ○○○●    | ○●●○    | ●○○●    |
| 362   | forecast | ○○○●    | ○●●○    | ●○●○    |
| 363   | forget   | ○○○●    | ○●●○    | ●○●●    |
| 364   | formal   | ○○○●    | ○●●○    | ●●○○    |
| 365   | fortune  | ○○○●    | ○●●○    | ●●○●    |
| 366   | forward  | ○○○●    | ○●●○    | ●●●○    |
| 367   | founder  | ○○○●    | ○●●○    | ●●●●    |
| 368   | fraction | ○○○●    | ○●●●    | ○○○○    |
| 369   | fragment | ○○○●    | ○●●●    | ○○○●    |
| 370   | frequent | ○○○●    | ○●●●    | ○○●○    |
| 371   | freshman | ○○○●    | ○●●●    | ○○●●    |
| 372   | friar    | ○○○●    | ○●●●    | ○●○○    |
| 373   | fridge   | ○○○●    | ○●●●    | ○●○●    |
| 374   | friendly | ○○○●    | ○●●●    | ○●●○    |
| 375   | frost    | ○○○●    | ○●●●    | ○●●●    |
| 376   | froth    | ○○○●    | ○●●●    | ●○○○    |
| 377   | frozen   | ○○○●    | ○●●●    | ●○○●    |
| 378   | fumes    | ○○○●    | ○●●●    | ●○●○    |
| 379   | funding  | ○○○●    | ○●●●    | ●○●●    |
| 380   | furl     | ○○○●    | ○●●●    | ●●○○    |
| 381   | fused    | ○○○●    | ○●●●    | ●●○●    |
| 382   | galaxy   | ○○○●    | ○●●●    | ●●●○    |
| 383   | game     | ○○○●    | ○●●●    | ●●●●    |
| 384   | garbage  | ○○○●    | ●○○○    | ○○○○    |
| 385   | garden   | ○○○●    | ●○○○    | ○○○●    |
| 386   | garlic   | ○○○●    | ●○○○    | ○○●○    |
| 387   | gasoline | ○○○●    | ●○○○    | ○○●●    |
| 388   | gather   | ○○○●    | ●○○○    | ○●○○    |
| 389   | general  | ○○○●    | ●○○○    | ○●○●    |
| 390   | genius   | ○○○●    | ●○○○    | ○●●○    |
| 391   | genre    | ○○○●    | ●○○○    | ○●●●    |
| 392   | genuine  | ○○○●    | ●○○○    | ●○○○    |
| 393   | geology  | ○○○●    | ●○○○    | ●○○●    |
| 394   | gesture  | ○○○●    | ●○○○    | ●○●○    |
| 395   | glad     | ○○○●    | ●○○○    | ●○●●    |
| 396   | glance   | ○○○●    | ●○○○    | ●●○○    |
| 397   | glasses  | ○○○●    | ●○○○    | ●●○●    |
| 398   | glen     | ○○○●    | ●○○○    | ●●●○    |
| 399   | glimpse  | ○○○●    | ●○○○    | ●●●●    |
| 400   | goat     | ○○○●    | ●○○●    | ○○○○    |
| 401   | golden   | ○○○●    | ●○○●    | ○○○●    |
| 402   | graduate | ○○○●    | ●○○●    | ○○●○    |
| 403   | grant    | ○○○●    | ●○○●    | ○○●●    |
| 404   | grasp    | ○○○●    | ●○○●    | ○●○○    |
| 405   | gravity  | ○○○●    | ●○○●    | ○●○●    |
| 406   | gray     | ○○○●    | ●○○●    | ○●●○    |
| 407   | greatest | ○○○●    | ●○○●    | ○●●●    |
| 408   | grief    | ○○○●    | ●○○●    | ●○○○    |
| 409   | grill    | ○○○●    | ●○○●    | ●○○●    |
| 410   | grin     | ○○○●    | ●○○●    | ●○●○    |
| 411   | grocery  | ○○○●    | ●○○●    | ●○●●    |
| 412   | gross    | ○○○●    | ●○○●    | ●●○○    |
| 413   | group    | ○○○●    | ●○○●    | ●●○●    |
| 414   | grownup  | ○○○●    | ●○○●    | ●●●○    |
| 415   | grumpy   | ○○○●    | ●○○●    | ●●●●    |
| 416   | guard    | ○○○●    | ●○●○    | ○○○○    |
| 417   | guest    | ○○○●    | ●○●○    | ○○○●    |
| 418   | guilt    | ○○○●    | ●○●○    | ○○●○    |
| 419   | guitar   | ○○○●    | ●○●○    | ○○●●    |
| 420   | gums     | ○○○●    | ●○●○    | ○●○○    |
| 421   | hairy    | ○○○●    | ●○●○    | ○●○●    |
| 422   | hamster  | ○○○●    | ●○●○    | ○●●○    |
| 423   | hand     | ○○○●    | ●○●○    | ○●●●    |
| 424   | hanger   | ○○○●    | ●○●○    | ●○○○    |
| 425   | harvest  | ○○○●    | ●○●○    | ●○○●    |
| 426   | have     | ○○○●    | ●○●○    | ●○●○    |
| 427   | havoc    | ○○○●    | ●○●○    | ●○●●    |
| 428   | hawk     | ○○○●    | ●○●○    | ●●○○    |
| 429   | hazard   | ○○○●    | ●○●○    | ●●○●    |
| 430   | headset  | ○○○●    | ●○●○    | ●●●○    |
| 431   | health   | ○○○●    | ●○●○    | ●●●●    |
| 432   | hearing  | ○○○●    | ●○●●    | ○○○○    |
| 433   | heat     | ○○○●    | ●○●●    | ○○○●    |
| 434   | helpful  | ○○○●    | ●○●●    | ○○●○    |
| 435   | herald   | ○○○●    | ●○●●    | ○○●●    |
| 436   | herd     | ○○○●    | ●○●●    | ○●○○    |
| 437   | hesitate | ○○○●    | ●○●●    | ○●○●    |
| 438   | hobo     | ○○○●    | ●○●●    | ○●●○    |
| 439   | holiday  | ○○○●    | ●○●●    | ○●●●    |
| 440   | holy     | ○○○●    | ●○●●    | ●○○○    |
| 441   | home     | ○○○●    | ●○●●    | ●○○●    |
| 442   | hormone  | ○○○●    | ●○●●    | ●○●○    |
| 443   | hospital | ○○○●    | ●○●●    | ●○●●    |
| 444   | hour     | ○○○●    | ●○●●    | ●●○○    |
| 445   | huge     | ○○○●    | ●○●●    | ●●○●    |
| 446   | human    | ○○○●    | ●○●●    | ●●●○    |
| 447   | humidity | ○○○●    | ●○●●    | ●●●●    |
| 448   | hunting  | ○○○●    | ●●○○    | ○○○○    |
| 449   | husband  | ○○○●    | ●●○○    | ○○○●    |
| 450   | hush     | ○○○●    | ●●○○    | ○○●○    |
| 451   | husky    | ○○○●    | ●●○○    | ○○●●    |
| 452   | hybrid   | ○○○●    | ●●○○    | ○●○○    |
| 453   | idea     | ○○○●    | ●●○○    | ○●○●    |
| 454   | identify | ○○○●    | ●●○○    | ○●●○    |
| 455   | idle     | ○○○●    | ●●○○    | ○●●●    |
| 456   | image    | ○○○●    | ●●○○    | ●○○○    |
| 457   | impact   | ○○○●    | ●●○○    | ●○○●    |
| 458   | imply    | ○○○●    | ●●○○    | ●○●○    |
| 459   | improve  | ○○○●    | ●●○○    | ●○●●    |
| 460   | impulse  | ○○○●    | ●●○○    | ●●○○    |
| 461   | include  | ○○○●    | ●●○○    | ●●○●    |
| 462   | income   | ○○○●    | ●●○○    | ●●●○    |
| 463   | increase | ○○○●    | ●●○○    | ●●●●    |
| 464   | index    | ○○○●    | ●●○●    | ○○○○    |
| 465   | indicate | ○○○●    | ●●○●    | ○○○●    |
| 466   | industry | ○○○●    | ●●○●    | ○○●○    |
| 467   | infant   | ○○○●    | ●●○●    | ○○●●    |
| 468   | inform   | ○○○●    | ●●○●    | ○●○○    |
| 469   | inherit  | ○○○●    | ●●○●    | ○●○●    |
| 470   | injury   | ○○○●    | ●●○●    | ○●●○    |
| 471   | inmate   | ○○○●    | ●●○●    | ○●●●    |
| 472   | insect   | ○○○●    | ●●○●    | ●○○○    |
| 473   | inside   | ○○○●    | ●●○●    | ●○○●    |
| 474   | install  | ○○○●    | ●●○●    | ●○●○    |
| 475   | intend   | ○○○●    | ●●○●    | ●○●●    |
| 476   | intimate | ○○○●    | ●●○●    | ●●○○    |
| 477   | invasion | ○○○●    | ●●○●    | ●●○●    |
| 478   | involve  | ○○○●    | ●●○●    | ●●●○    |
| 479   | iris     | ○○○●    | ●●○●    | ●●●●    |
| 480   | island   | ○○○●    | ●●●○    | ○○○○    |
| 481   | isolate  | ○○○●    | ●●●○    | ○○○●    |
| 482   | item     | ○○○●    | ●●●○    | ○○●○    |
| 483   | ivory    | ○○○●    | ●●●○    | ○○●●    |
| 484   | jacket   | ○○○●    | ●●●○    | ○●○○    |
| 485   | jerky    | ○○○●    | ●●●○    | ○●○●    |
| 486   | jewelry  | ○○○●    | ●●●○    | ○●●○    |
| 487   | join     | ○○○●    | ●●●○    | ○●●●    |
| 488   | judicial | ○○○●    | ●●●○    | ●○○○    |
| 489   | juice    | ○○○●    | ●●●○    | ●○○●    |
| 490   | jump     | ○○○●    | ●●●○    | ●○●○    |
| 491   | junction | ○○○●    | ●●●○    | ●○●●    |
| 492   | junior   | ○○○●    | ●●●○    | ●●○○    |
| 493   | junk     | ○○○●    | ●●●○    | ●●○●    |
| 494   | jury     | ○○○●    | ●●●○    | ●●●○    |
| 495   | justice  | ○○○●    | ●●●○    | ●●●●    |
| 496   | kernel   | ○○○●    | ●●●●    | ○○○○    |
| 497   | keyboard | ○○○●    | ●●●●    | ○○○●    |
| 498   | kidney   | ○○○●    | ●●●●    | ○○●○    |
| 499   | kind     | ○○○●    | ●●●●    | ○○●●    |
| 500   | kitchen  | ○○○●    | ●●●●    | ○●○○    |
| 501   | knife    | ○○○●    | ●●●●    | ○●○●    |
| 502   | knit     | ○○○●    | ●●●●    | ○●●○    |
| 503   | laden    | ○○○●    | ●●●●    | ○●●●    |
| 504   | ladle    | ○○○●    | ●●●●    | ●○○○    |
| 505   | ladybug  | ○○○●    | ●●●●    | ●○○●    |
| 506   | lair     | ○○○●    | ●●●●    | ●○●○    |
| 507   | lamp     | ○○○●    | ●●●●    | ●○●●    |
| 508   | language | ○○○●    | ●●●●    | ●●○○    |
| 509   | large    | ○○○●    | ●●●●    | ●●○●    |
| 510   | laser    | ○○○●    | ●●●●    | ●●●○    |
| 511   | laundry  | ○○○●    | ●●●●    | ●●●●    |
| 512   | lawsuit  | ○○●○    | ○○○○    | ○○○○    |
| 513   | leader   | ○○●○    | ○○○○    | ○○○●    |
| 514   | leaf     | ○○●○    | ○○○○    | ○○●○    |
| 515   | learn    | ○○●○    | ○○○○    | ○○●●    |
| 516   | leaves   | ○○●○    | ○○○○    | ○●○○    |
| 517   | lecture  | ○○●○    | ○○○○    | ○●○●    |
| 518   | legal    | ○○●○    | ○○○○    | ○●●○    |
| 519   | legend   | ○○●○    | ○○○○    | ○●●●    |
| 520   | legs     | ○○●○    | ○○○○    | ●○○○    |
| 521   | lend     | ○○●○    | ○○○○    | ●○○●    |
| 522   | length   | ○○●○    | ○○○○    | ●○●○    |
| 523   | level    | ○○●○    | ○○○○    | ●○●●    |
| 524   | liberty  | ○○●○    | ○○○○    | ●●○○    |
| 525   | library  | ○○●○    | ○○○○    | ●●○●    |
| 526   | license  | ○○●○    | ○○○○    | ●●●○    |
| 527   | lift     | ○○●○    | ○○○○    | ●●●●    |
| 528   | likely   | ○○●○    | ○○○●    | ○○○○    |
| 529   | lilac    | ○○●○    | ○○○●    | ○○○●    |
| 530   | lily     | ○○●○    | ○○○●    | ○○●○    |
| 531   | lips     | ○○●○    | ○○○●    | ○○●●    |
| 532   | liquid   | ○○●○    | ○○○●    | ○●○○    |
| 533   | listen   | ○○●○    | ○○○●    | ○●○●    |
| 534   | literary | ○○●○    | ○○○●    | ○●●○    |
| 535   | living   | ○○●○    | ○○○●    | ○●●●    |
| 536   | lizard   | ○○●○    | ○○○●    | ●○○○    |
| 537   | loan     | ○○●○    | ○○○●    | ●○○●    |
| 538   | lobe     | ○○●○    | ○○○●    | ●○●○    |
| 539   | location | ○○●○    | ○○○●    | ●○●●    |
| 540   | losing   | ○○●○    | ○○○●    | ●●○○    |
| 541   | loud     | ○○●○    | ○○○●    | ●●○●    |
| 542   | loyalty  | ○○●○    | ○○○●    | ●●●○    |
| 543   | luck     | ○○●○    | ○○○●    | ●●●●    |
| 544   | lunar    | ○○●○    | ○○●○    | ○○○○    |
| 545   | lunch    | ○○●○    | ○○●○    | ○○○●    |
| 546   | lungs    | ○○●○    | ○○●○    | ○○●○    |
| 547   | luxury   | ○○●○    | ○○●○    | ○○●●    |
| 548   | lying    | ○○●○    | ○○●○    | ○●○○    |
| 549   | lyrics   | ○○●○    | ○○●○    | ○●○●    |
| 550   | machine  | ○○●○    | ○○●○    | ○●●○    |
| 551   | magazine | ○○●○    | ○○●○    | ○●●●    |
| 552   | maiden   | ○○●○    | ○○●○    | ●○○○    |
| 553   | mailman  | ○○●○    | ○○●○    | ●○○●    |
| 554   | main     | ○○●○    | ○○●○    | ●○●○    |
| 555   | makeup   | ○○●○    | ○○●○    | ●○●●    |
| 556   | making   | ○○●○    | ○○●○    | ●●○○    |
| 557   | mama     | ○○●○    | ○○●○    | ●●○●    |
| 558   | manager  | ○○●○    | ○○●○    | ●●●○    |
| 559   | mandate  | ○○●○    | ○○●○    | ●●●●    |
| 560   | mansion  | ○○●○    | ○○●●    | ○○○○    |
| 561   | manual   | ○○●○    | ○○●●    | ○○○●    |
| 562   | marathon | ○○●○    | ○○●●    | ○○●○    |
| 563   | march    | ○○●○    | ○○●●    | ○○●●    |
| 564   | market   | ○○●○    | ○○●●    | ○●○○    |
| 565   | marvel   | ○○●○    | ○○●●    | ○●○●    |
| 566   | mason    | ○○●○    | ○○●●    | ○●●○    |
| 567   | material | ○○●○    | ○○●●    | ○●●●    |
| 568   | math     | ○○●○    | ○○●●    | ●○○○    |
| 569   | maximum  | ○○●○    | ○○●●    | ●○○●    |
| 570   | mayor    | ○○●○    | ○○●●    | ●○●○    |
| 571   | meaning  | ○○●○    | ○○●●    | ●○●●    |
| 572   | medal    | ○○●○    | ○○●●    | ●●○○    |
| 573   | medical  | ○○●○    | ○○●●    | ●●○●    |
| 574   | member   | ○○●○    | ○○●●    | ●●●○    |
| 575   | memory   | ○○●○    | ○○●●    | ●●●●    |
| 576   | mental   | ○○●○    | ○●○○    | ○○○○    |
| 577   | merchant | ○○●○    | ○●○○    | ○○○●    |
| 578   | merit    | ○○●○    | ○●○○    | ○○●○    |
| 579   | method   | ○○●○    | ○●○○    | ○○●●    |
| 580   | metric   | ○○●○    | ○●○○    | ○●○○    |
| 581   | midst    | ○○●○    | ○●○○    | ○●○●    |
| 582   | mild     | ○○●○    | ○●○○    | ○●●○    |
| 583   | military | ○○●○    | ○●○○    | ○●●●    |
| 584   | mineral  | ○○●○    | ○●○○    | ●○○○    |
| 585   | minister | ○○●○    | ○●○○    | ●○○●    |
| 586   | miracle  | ○○●○    | ○●○○    | ●○●○    |
| 587   | mixed    | ○○●○    | ○●○○    | ●○●●    |
| 588   | mixture  | ○○●○    | ○●○○    | ●●○○    |
| 589   | mobile   | ○○●○    | ○●○○    | ●●○●    |
| 590   | modern   | ○○●○    | ○●○○    | ●●●○    |
| 591   | modify   | ○○●○    | ○●○○    | ●●●●    |
| 592   | moisture | ○○●○    | ○●○●    | ○○○○    |
| 593   | moment   | ○○●○    | ○●○●    | ○○○●    |
| 594   | morning  | ○○●○    | ○●○●    | ○○●○    |
| 595   | mortgage | ○○●○    | ○●○●    | ○○●●    |
| 596   | mother   | ○○●○    | ○●○●    | ○●○○    |
| 597   | mountain | ○○●○    | ○●○●    | ○●○●    |
| 598   | mouse    | ○○●○    | ○●○●    | ○●●○    |
| 599   | move     | ○○●○    | ○●○●    | ○●●●    |
| 600   | much     | ○○●○    | ○●○●    | ●○○○    |
| 601   | mule     | ○○●○    | ○●○●    | ●○○●    |
| 602   | multiple | ○○●○    | ○●○●    | ●○●○    |
| 603   | muscle   | ○○●○    | ○●○●    | ●○●●    |
| 604   | museum   | ○○●○    | ○●○●    | ●●○○    |
| 605   | music    | ○○●○    | ○●○●    | ●●○●    |
| 606   | mustang  | ○○●○    | ○●○●    | ●●●○    |
| 607   | nail     | ○○●○    | ○●○●    | ●●●●    |
| 608   | national | ○○●○    | ○●●○    | ○○○○    |
| 609   | necklace | ○○●○    | ○●●○    | ○○○●    |
| 610   | negative | ○○●○    | ○●●○    | ○○●○    |
| 611   | nervous  | ○○●○    | ○●●○    | ○○●●    |
| 612   | network  | ○○●○    | ○●●○    | ○●○○    |
| 613   | news     | ○○●○    | ○●●○    | ○●○●    |
| 614   | nuclear  | ○○●○    | ○●●○    | ○●●○    |
| 615   | numb     | ○○●○    | ○●●○    | ○●●●    |
| 616   | numerous | ○○●○    | ○●●○    | ●○○○    |
| 617   | nylon    | ○○●○    | ○●●○    | ●○○●    |
| 618   | oasis    | ○○●○    | ○●●○    | ●○●○    |
| 619   | obesity  | ○○●○    | ○●●○    | ●○●●    |
| 620   | object   | ○○●○    | ○●●○    | ●●○○    |
| 621   | observe  | ○○●○    | ○●●○    | ●●○●    |
| 622   | obtain   | ○○●○    | ○●●○    | ●●●○    |
| 623   | ocean    | ○○●○    | ○●●○    | ●●●●    |
| 624   | often    | ○○●○    | ○●●●    | ○○○○    |
| 625   | olympic  | ○○●○    | ○●●●    | ○○○●    |
| 626   | omit     | ○○●○    | ○●●●    | ○○●○    |
| 627   | oral     | ○○●○    | ○●●●    | ○○●●    |
| 628   | orange   | ○○●○    | ○●●●    | ○●○○    |
| 629   | orbit    | ○○●○    | ○●●●    | ○●○●    |
| 630   | order    | ○○●○    | ○●●●    | ○●●○    |
| 631   | ordinary | ○○●○    | ○●●●    | ○●●●    |
| 632   | organize | ○○●○    | ○●●●    | ●○○○    |
| 633   | ounce    | ○○●○    | ○●●●    | ●○○●    |
| 634   | oven     | ○○●○    | ○●●●    | ●○●○    |
| 635   | overall  | ○○●○    | ○●●●    | ●○●●    |
| 636   | owner    | ○○●○    | ○●●●    | ●●○○    |
| 637   | paces    | ○○●○    | ○●●●    | ●●○●    |
| 638   | pacific  | ○○●○    | ○●●●    | ●●●○    |
| 639   | package  | ○○●○    | ○●●●    | ●●●●    |
| 640   | paid     | ○○●○    | ●○○○    | ○○○○    |
| 641   | painting | ○○●○    | ●○○○    | ○○○●    |
| 642   | pajamas  | ○○●○    | ●○○○    | ○○●○    |
| 643   | pancake  | ○○●○    | ●○○○    | ○○●●    |
| 644   | pants    | ○○●○    | ●○○○    | ○●○○    |
| 645   | papa     | ○○●○    | ●○○○    | ○●○●    |
| 646   | paper    | ○○●○    | ●○○○    | ○●●○    |
| 647   | parcel   | ○○●○    | ●○○○    | ○●●●    |
| 648   | parking  | ○○●○    | ●○○○    | ●○○○    |
| 649   | party    | ○○●○    | ●○○○    | ●○○●    |
| 650   | patent   | ○○●○    | ●○○○    | ●○●○    |
| 651   | patrol   | ○○●○    | ●○○○    | ●○●●    |
| 652   | payment  | ○○●○    | ●○○○    | ●●○○    |
| 653   | payroll  | ○○●○    | ●○○○    | ●●○●    |
| 654   | peaceful | ○○●○    | ●○○○    | ●●●○    |
| 655   | peanut   | ○○●○    | ●○○○    | ●●●●    |
| 656   | peasant  | ○○●○    | ●○○●    | ○○○○    |
| 657   | pecan    | ○○●○    | ●○○●    | ○○○●    |
| 658   | penalty  | ○○●○    | ●○○●    | ○○●○    |
| 659   | pencil   | ○○●○    | ●○○●    | ○○●●    |
| 660   | percent  | ○○●○    | ●○○●    | ○●○○    |
| 661   | perfect  | ○○●○    | ●○○●    | ○●○●    |
| 662   | permit   | ○○●○    | ●○○●    | ○●●○    |
| 663   | petition | ○○●○    | ●○○●    | ○●●●    |
| 664   | phantom  | ○○●○    | ●○○●    | ●○○○    |
| 665   | pharmacy | ○○●○    | ●○○●    | ●○○●    |
| 666   | photo    | ○○●○    | ●○○●    | ●○●○    |
| 667   | phrase   | ○○●○    | ●○○●    | ●○●●    |
| 668   | physics  | ○○●○    | ●○○●    | ●●○○    |
| 669   | pickup   | ○○●○    | ●○○●    | ●●○●    |
| 670   | picture  | ○○●○    | ●○○●    | ●●●○    |
| 671   | piece    | ○○●○    | ●○○●    | ●●●●    |
| 672   | pile     | ○○●○    | ●○●○    | ○○○○    |
| 673   | pink     | ○○●○    | ●○●○    | ○○○●    |
| 674   | pipeline | ○○●○    | ●○●○    | ○○●○    |
| 675   | pistol   | ○○●○    | ●○●○    | ○○●●    |
| 676   | pitch    | ○○●○    | ●○●○    | ○●○○    |
| 677   | plains   | ○○●○    | ●○●○    | ○●○●    |
| 678   | plan     | ○○●○    | ●○●○    | ○●●○    |
| 679   | plastic  | ○○●○    | ●○●○    | ○●●●    |
| 680   | platform | ○○●○    | ●○●○    | ●○○○    |
| 681   | playoff  | ○○●○    | ●○●○    | ●○○●    |
| 682   | pleasure | ○○●○    | ●○●○    | ●○●○    |
| 683   | plot     | ○○●○    | ●○●○    | ●○●●    |
| 684   | plunge   | ○○●○    | ●○●○    | ●●○○    |
| 685   | practice | ○○●○    | ●○●○    | ●●○●    |
| 686   | prayer   | ○○●○    | ●○●○    | ●●●○    |
| 687   | preach   | ○○●○    | ●○●○    | ●●●●    |
| 688   | predator | ○○●○    | ●○●●    | ○○○○    |
| 689   | pregnant | ○○●○    | ●○●●    | ○○○●    |
| 690   | premium  | ○○●○    | ●○●●    | ○○●○    |
| 691   | prepare  | ○○●○    | ●○●●    | ○○●●    |
| 692   | presence | ○○●○    | ●○●●    | ○●○○    |
| 693   | prevent  | ○○●○    | ●○●●    | ○●○●    |
| 694   | priest   | ○○●○    | ●○●●    | ○●●○    |
| 695   | primary  | ○○●○    | ●○●●    | ○●●●    |
| 696   | priority | ○○●○    | ●○●●    | ●○○○    |
| 697   | prisoner | ○○●○    | ●○●●    | ●○○●    |
| 698   | privacy  | ○○●○    | ●○●●    | ●○●○    |
| 699   | prize    | ○○●○    | ●○●●    | ●○●●    |
| 700   | problem  | ○○●○    | ●○●●    | ●●○○    |
| 701   | process  | ○○●○    | ●○●●    | ●●○●    |
| 702   | profile  | ○○●○    | ●○●●    | ●●●○    |
| 703   | program  | ○○●○    | ●○●●    | ●●●●    |
| 704   | promise  | ○○●○    | ●●○○    | ○○○○    |
| 705   | prospect | ○○●○    | ●●○○    | ○○○●    |
| 706   | provide  | ○○●○    | ●●○○    | ○○●○    |
| 707   | prune    | ○○●○    | ●●○○    | ○○●●    |
| 708   | public   | ○○●○    | ●●○○    | ○●○○    |
| 709   | pulse    | ○○●○    | ●●○○    | ○●○●    |
| 710   | pumps    | ○○●○    | ●●○○    | ○●●○    |
| 711   | punish   | ○○●○    | ●●○○    | ○●●●    |
| 712   | puny     | ○○●○    | ●●○○    | ●○○○    |
| 713   | pupal    | ○○●○    | ●●○○    | ●○○●    |
| 714   | purchase | ○○●○    | ●●○○    | ●○●○    |
| 715   | purple   | ○○●○    | ●●○○    | ●○●●    |
| 716   | python   | ○○●○    | ●●○○    | ●●○○    |
| 717   | quantity | ○○●○    | ●●○○    | ●●○●    |
| 718   | quarter  | ○○●○    | ●●○○    | ●●●○    |
| 719   | quick    | ○○●○    | ●●○○    | ●●●●    |
| 720   | quiet    | ○○●○    | ●●○●    | ○○○○    |
| 721   | race     | ○○●○    | ●●○●    | ○○○●    |
| 722   | racism   | ○○●○    | ●●○●    | ○○●○    |
| 723   | radar    | ○○●○    | ●●○●    | ○○●●    |
| 724   | railroad | ○○●○    | ●●○●    | ○●○○    |
| 725   | rainbow  | ○○●○    | ●●○●    | ○●○●    |
| 726   | raisin   | ○○●○    | ●●○●    | ○●●○    |
| 727   | random   | ○○●○    | ●●○●    | ○●●●    |
| 728   | ranked   | ○○●○    | ●●○●    | ●○○○    |
| 729   | rapids   | ○○●○    | ●●○●    | ●○○●    |
| 730   | raspy    | ○○●○    | ●●○●    | ●○●○    |
| 731   | reaction | ○○●○    | ●●○●    | ●○●●    |
| 732   | realize  | ○○●○    | ●●○●    | ●●○○    |
| 733   | rebound  | ○○●○    | ●●○●    | ●●○●    |
| 734   | rebuild  | ○○●○    | ●●○●    | ●●●○    |
| 735   | recall   | ○○●○    | ●●○●    | ●●●●    |
| 736   | receiver | ○○●○    | ●●●○    | ○○○○    |
| 737   | recover  | ○○●○    | ●●●○    | ○○○●    |
| 738   | regret   | ○○●○    | ●●●○    | ○○●○    |
| 739   | regular  | ○○●○    | ●●●○    | ○○●●    |
| 740   | reject   | ○○●○    | ●●●○    | ○●○○    |
| 741   | relate   | ○○●○    | ●●●○    | ○●○●    |
| 742   | remember | ○○●○    | ●●●○    | ○●●○    |
| 743   | remind   | ○○●○    | ●●●○    | ○●●●    |
| 744   | remove   | ○○●○    | ●●●○    | ●○○○    |
| 745   | render   | ○○●○    | ●●●○    | ●○○●    |
| 746   | repair   | ○○●○    | ●●●○    | ●○●○    |
| 747   | repeat   | ○○●○    | ●●●○    | ●○●●    |
| 748   | replace  | ○○●○    | ●●●○    | ●●○○    |
| 749   | require  | ○○●○    | ●●●○    | ●●○●    |
| 750   | rescue   | ○○●○    | ●●●○    | ●●●○    |
| 751   | research | ○○●○    | ●●●○    | ●●●●    |
| 752   | resident | ○○●○    | ●●●●    | ○○○○    |
| 753   | response | ○○●○    | ●●●●    | ○○○●    |
| 754   | result   | ○○●○    | ●●●●    | ○○●○    |
| 755   | retailer | ○○●○    | ●●●●    | ○○●●    |
| 756   | retreat  | ○○●○    | ●●●●    | ○●○○    |
| 757   | reunion  | ○○●○    | ●●●●    | ○●○●    |
| 758   | revenue  | ○○●○    | ●●●●    | ○●●○    |
| 759   | review   | ○○●○    | ●●●●    | ○●●●    |
| 760   | reward   | ○○●○    | ●●●●    | ●○○○    |
| 761   | rhyme    | ○○●○    | ●●●●    | ●○○●    |
| 762   | rhythm   | ○○●○    | ●●●●    | ●○●○    |
| 763   | rich     | ○○●○    | ●●●●    | ●○●●    |
| 764   | rival    | ○○●○    | ●●●●    | ●●○○    |
| 765   | river    | ○○●○    | ●●●●    | ●●○●    |
| 766   | robin    | ○○●○    | ●●●●    | ●●●○    |
| 767   | rocky    | ○○●○    | ●●●●    | ●●●●    |
| 768   | romantic | ○○●●    | ○○○○    | ○○○○    |
| 769   | romp     | ○○●●    | ○○○○    | ○○○●    |
| 770   | roster   | ○○●●    | ○○○○    | ○○●○    |
| 771   | round    | ○○●●    | ○○○○    | ○○●●    |
| 772   | royal    | ○○●●    | ○○○○    | ○●○○    |
| 773   | ruin     | ○○●●    | ○○○○    | ○●○●    |
| 774   | ruler    | ○○●●    | ○○○○    | ○●●○    |
| 775   | rumor    | ○○●●    | ○○○○    | ○●●●    |
| 776   | sack     | ○○●●    | ○○○○    | ●○○○    |
| 777   | safari   | ○○●●    | ○○○○    | ●○○●    |
| 778   | salary   | ○○●●    | ○○○○    | ●○●○    |
| 779   | salon    | ○○●●    | ○○○○    | ●○●●    |
| 780   | salt     | ○○●●    | ○○○○    | ●●○○    |
| 781   | satisfy  | ○○●●    | ○○○○    | ●●○●    |
| 782   | satoshi  | ○○●●    | ○○○○    | ●●●○    |
| 783   | saver    | ○○●●    | ○○○○    | ●●●●    |
| 784   | says     | ○○●●    | ○○○●    | ○○○○    |
| 785   | scandal  | ○○●●    | ○○○●    | ○○○●    |
| 786   | scared   | ○○●●    | ○○○●    | ○○●○    |
| 787   | scatter  | ○○●●    | ○○○●    | ○○●●    |
| 788   | scene    | ○○●●    | ○○○●    | ○●○○    |
| 789   | scholar  | ○○●●    | ○○○●    | ○●○●    |
| 790   | science  | ○○●●    | ○○○●    | ○●●○    |
| 791   | scout    | ○○●●    | ○○○●    | ○●●●    |
| 792   | scramble | ○○●●    | ○○○●    | ●○○○    |
| 793   | screw    | ○○●●    | ○○○●    | ●○○●    |
| 794   | script   | ○○●●    | ○○○●    | ●○●○    |
| 795   | scroll   | ○○●●    | ○○○●    | ●○●●    |
| 796   | seafood  | ○○●●    | ○○○●    | ●●○○    |
| 797   | season   | ○○●●    | ○○○●    | ●●○●    |
| 798   | secret   | ○○●●    | ○○○●    | ●●●○    |
| 799   | security | ○○●●    | ○○○●    | ●●●●    |
| 800   | segment  | ○○●●    | ○○●○    | ○○○○    |
| 801   | senior   | ○○●●    | ○○●○    | ○○○●    |
| 802   | shadow   | ○○●●    | ○○●○    | ○○●○    |
| 803   | shaft    | ○○●●    | ○○●○    | ○○●●    |
| 804   | shame    | ○○●●    | ○○●○    | ○●○○    |
| 805   | shaped   | ○○●●    | ○○●○    | ○●○●    |
| 806   | sharp    | ○○●●    | ○○●○    | ○●●○    |
| 807   | shelter  | ○○●●    | ○○●○    | ○●●●    |
| 808   | sheriff  | ○○●●    | ○○●○    | ●○○○    |
| 809   | short    | ○○●●    | ○○●○    | ●○○●    |
| 810   | should   | ○○●●    | ○○●○    | ●○●○    |
| 811   | shrimp   | ○○●●    | ○○●○    | ●○●●    |
| 812   | sidewalk | ○○●●    | ○○●○    | ●●○○    |
| 813   | silent   | ○○●●    | ○○●○    | ●●○●    |
| 814   | silver   | ○○●●    | ○○●○    | ●●●○    |
| 815   | similar  | ○○●●    | ○○●○    | ●●●●    |
| 816   | simple   | ○○●●    | ○○●●    | ○○○○    |
| 817   | single   | ○○●●    | ○○●●    | ○○○●    |
| 818   | sister   | ○○●●    | ○○●●    | ○○●○    |
| 819   | skin     | ○○●●    | ○○●●    | ○○●●    |
| 820   | skunk    | ○○●●    | ○○●●    | ○●○○    |
| 821   | slap     | ○○●●    | ○○●●    | ○●○●    |
| 822   | slavery  | ○○●●    | ○○●●    | ○●●○    |
| 823   | sled     | ○○●●    | ○○●●    | ○●●●    |
| 824   | slice    | ○○●●    | ○○●●    | ●○○○    |
| 825   | slim     | ○○●●    | ○○●●    | ●○○●    |
| 826   | slow     | ○○●●    | ○○●●    | ●○●○    |
| 827   | slush    | ○○●●    | ○○●●    | ●○●●    |
| 828   | smart    | ○○●●    | ○○●●    | ●●○○    |
| 829   | smear    | ○○●●    | ○○●●    | ●●○●    |
| 830   | smell    | ○○●●    | ○○●●    | ●●●○    |
| 831   | smirk    | ○○●●    | ○○●●    | ●●●●    |
| 832   | smith    | ○○●●    | ○●○○    | ○○○○    |
| 833   | smoking  | ○○●●    | ○●○○    | ○○○●    |
| 834   | smug     | ○○●●    | ○●○○    | ○○●○    |
| 835   | snake    | ○○●●    | ○●○○    | ○○●●    |
| 836   | snapshot | ○○●●    | ○●○○    | ○●○○    |
| 837   | sniff    | ○○●●    | ○●○○    | ○●○●    |
| 838   | society  | ○○●●    | ○●○○    | ○●●○    |
| 839   | software | ○○●●    | ○●○○    | ○●●●    |
| 840   | soldier  | ○○●●    | ○●○○    | ●○○○    |
| 841   | solution | ○○●●    | ○●○○    | ●○○●    |
| 842   | soul     | ○○●●    | ○●○○    | ●○●○    |
| 843   | source   | ○○●●    | ○●○○    | ●○●●    |
| 844   | space    | ○○●●    | ○●○○    | ●●○○    |
| 845   | spark    | ○○●●    | ○●○○    | ●●○●    |
| 846   | speak    | ○○●●    | ○●○○    | ●●●○    |
| 847   | species  | ○○●●    | ○●○○    | ●●●●    |
| 848   | spelling | ○○●●    | ○●○●    | ○○○○    |
| 849   | spend    | ○○●●    | ○●○●    | ○○○●    |
| 850   | spew     | ○○●●    | ○●○●    | ○○●○    |
| 851   | spider   | ○○●●    | ○●○●    | ○○●●    |
| 852   | spill    | ○○●●    | ○●○●    | ○●○○    |
| 853   | spine    | ○○●●    | ○●○●    | ○●○●    |
| 854   | spirit   | ○○●●    | ○●○●    | ○●●○    |
| 855   | spit     | ○○●●    | ○●○●    | ○●●●    |
| 856   | spray    | ○○●●    | ○●○●    | ●○○○    |
| 857   | sprinkle | ○○●●    | ○●○●    | ●○○●    |
| 858   | square   | ○○●●    | ○●○●    | ●○●○    |
| 859   | squeeze  | ○○●●    | ○●○●    | ●○●●    |
| 860   | stadium  | ○○●●    | ○●○●    | ●●○○    |
| 861   | staff    | ○○●●    | ○●○●    | ●●○●    |
| 862   | standard | ○○●●    | ○●○●    | ●●●○    |
| 863   | starting | ○○●●    | ○●○●    | ●●●●    |
| 864   | station  | ○○●●    | ○●●○    | ○○○○    |
| 865   | stay     | ○○●●    | ○●●○    | ○○○●    |
| 866   | steady   | ○○●●    | ○●●○    | ○○●○    |
| 867   | step     | ○○●●    | ○●●○    | ○○●●    |
| 868   | stick    | ○○●●    | ○●●○    | ○●○○    |
| 869   | stilt    | ○○●●    | ○●●○    | ○●○●    |
| 870   | story    | ○○●●    | ○●●○    | ○●●○    |
| 871   | strategy | ○○●●    | ○●●○    | ○●●●    |
| 872   | strike   | ○○●●    | ○●●○    | ●○○○    |
| 873   | style    | ○○●●    | ○●●○    | ●○○●    |
| 874   | subject  | ○○●●    | ○●●○    | ●○●○    |
| 875   | submit   | ○○●●    | ○●●○    | ●○●●    |
| 876   | sugar    | ○○●●    | ○●●○    | ●●○○    |
| 877   | suitable | ○○●●    | ○●●○    | ●●○●    |
| 878   | sunlight | ○○●●    | ○●●○    | ●●●○    |
| 879   | superior | ○○●●    | ○●●○    | ●●●●    |
| 880   | surface  | ○○●●    | ○●●●    | ○○○○    |
| 881   | surprise | ○○●●    | ○●●●    | ○○○●    |
| 882   | survive  | ○○●●    | ○●●●    | ○○●○    |
| 883   | sweater  | ○○●●    | ○●●●    | ○○●●    |
| 884   | swimming | ○○●●    | ○●●●    | ○●○○    |
| 885   | swing    | ○○●●    | ○●●●    | ○●○●    |
| 886   | switch   | ○○●●    | ○●●●    | ○●●○    |
| 887   | symbolic | ○○●●    | ○●●●    | ○●●●    |
| 888   | sympathy | ○○●●    | ○●●●    | ●○○○    |
| 889   | syndrome | ○○●●    | ○●●●    | ●○○●    |
| 890   | system   | ○○●●    | ○●●●    | ●○●○    |
| 891   | tackle   | ○○●●    | ○●●●    | ●○●●    |
| 892   | tactics  | ○○●●    | ○●●●    | ●●○○    |
| 893   | tadpole  | ○○●●    | ○●●●    | ●●○●    |
| 894   | talent   | ○○●●    | ○●●●    | ●●●○    |
| 895   | task     | ○○●●    | ○●●●    | ●●●●    |
| 896   | taste    | ○○●●    | ●○○○    | ○○○○    |
| 897   | taught   | ○○●●    | ●○○○    | ○○○●    |
| 898   | taxi     | ○○●●    | ●○○○    | ○○●○    |
| 899   | teacher  | ○○●●    | ●○○○    | ○○●●    |
| 900   | teammate | ○○●●    | ●○○○    | ○●○○    |
| 901   | teaspoon | ○○●●    | ●○○○    | ○●○●    |
| 902   | temple   | ○○●●    | ●○○○    | ○●●○    |
| 903   | tenant   | ○○●●    | ●○○○    | ○●●●    |
| 904   | tendency | ○○●●    | ●○○○    | ●○○○    |
| 905   | tension  | ○○●●    | ●○○○    | ●○○●    |
| 906   | terminal | ○○●●    | ●○○○    | ●○●○    |
| 907   | testify  | ○○●●    | ●○○○    | ●○●●    |
| 908   | texture  | ○○●●    | ●○○○    | ●●○○    |
| 909   | thank    | ○○●●    | ●○○○    | ●●○●    |
| 910   | that     | ○○●●    | ●○○○    | ●●●○    |
| 911   | theater  | ○○●●    | ●○○○    | ●●●●    |
| 912   | theory   | ○○●●    | ●○○●    | ○○○○    |
| 913   | therapy  | ○○●●    | ●○○●    | ○○○●    |
| 914   | thorn    | ○○●●    | ●○○●    | ○○●○    |
| 915   | threaten | ○○●●    | ●○○●    | ○○●●    |
| 916   | thumb    | ○○●●    | ●○○●    | ○●○○    |
| 917   | thunder  | ○○●●    | ●○○●    | ○●○●    |
| 918   | ticket   | ○○●●    | ●○○●    | ○●●○    |
| 919   | tidy     | ○○●●    | ●○○●    | ○●●●    |
| 920   | timber   | ○○●●    | ●○○●    | ●○○○    |
| 921   | timely   | ○○●●    | ●○○●    | ●○○●    |
| 922   | ting     | ○○●●    | ●○○●    | ●○●○    |
| 923   | tofu     | ○○●●    | ●○○●    | ●○●●    |
| 924   | together | ○○●●    | ●○○●    | ●●○○    |
| 925   | tolerate | ○○●●    | ●○○●    | ●●○●    |
| 926   | total    | ○○●●    | ●○○●    | ●●●○    |
| 927   | toxic    | ○○●●    | ●○○●    | ●●●●    |
| 928   | tracks   | ○○●●    | ●○●○    | ○○○○    |
| 929   | traffic  | ○○●●    | ●○●○    | ○○○●    |
| 930   | training | ○○●●    | ●○●○    | ○○●○    |
| 931   | transfer | ○○●●    | ●○●○    | ○○●●    |
| 932   | trash    | ○○●●    | ●○●○    | ○●○○    |
| 933   | traveler | ○○●●    | ●○●○    | ○●○●    |
| 934   | treat    | ○○●●    | ●○●○    | ○●●○    |
| 935   | trend    | ○○●●    | ●○●○    | ○●●●    |
| 936   | trial    | ○○●●    | ●○●○    | ●○○○    |
| 937   | tricycle | ○○●●    | ●○●○    | ●○○●    |
| 938   | trip     | ○○●●    | ●○●○    | ●○●○    |
| 939   | triumph  | ○○●●    | ●○●○    | ●○●●    |
| 940   | trouble  | ○○●●    | ●○●○    | ●●○○    |
| 941   | true     | ○○●●    | ●○●○    | ●●○●    |
| 942   | trust    | ○○●●    | ●○●○    | ●●●○    |
| 943   | twice    | ○○●●    | ●○●○    | ●●●●    |
| 944   | twin     | ○○●●    | ●○●●    | ○○○○    |
| 945   | type     | ○○●●    | ●○●●    | ○○○●    |
| 946   | typical  | ○○●●    | ●○●●    | ○○●○    |
| 947   | ugly     | ○○●●    | ●○●●    | ○○●●    |
| 948   | ultimate | ○○●●    | ●○●●    | ○●○○    |
| 949   | umbrella | ○○●●    | ●○●●    | ○●○●    |
| 950   | uncover  | ○○●●    | ●○●●    | ○●●○    |
| 951   | undergo  | ○○●●    | ●○●●    | ○●●●    |
| 952   | unfair   | ○○●●    | ●○●●    | ●○○○    |
| 953   | unfold   | ○○●●    | ●○●●    | ●○○●    |
| 954   | unhappy  | ○○●●    | ●○●●    | ●○●○    |
| 955   | union    | ○○●●    | ●○●●    | ●○●●    |
| 956   | universe | ○○●●    | ●○●●    | ●●○○    |
| 957   | unkind   | ○○●●    | ●○●●    | ●●○●    |
| 958   | unknown  | ○○●●    | ●○●●    | ●●●○    |
| 959   | unusual  | ○○●●    | ●○●●    | ●●●●    |
| 960   | unwrap   | ○○●●    | ●●○○    | ○○○○    |
| 961   | upgrade  | ○○●●    | ●●○○    | ○○○●    |
| 962   | upstairs | ○○●●    | ●●○○    | ○○●○    |
| 963   | username | ○○●●    | ●●○○    | ○○●●    |
| 964   | usher    | ○○●●    | ●●○○    | ○●○○    |
| 965   | usual    | ○○●●    | ●●○○    | ○●○●    |
| 966   | valid    | ○○●●    | ●●○○    | ○●●○    |
| 967   | valuable | ○○●●    | ●●○○    | ○●●●    |
| 968   | vampire  | ○○●●    | ●●○○    | ●○○○    |
| 969   | vanish   | ○○●●    | ●●○○    | ●○○●    |
| 970   | various  | ○○●●    | ●●○○    | ●○●○    |
| 971   | vegan    | ○○●●    | ●●○○    | ●○●●    |
| 972   | velvet   | ○○●●    | ●●○○    | ●●○○    |
| 973   | venture  | ○○●●    | ●●○○    | ●●○●    |
| 974   | verdict  | ○○●●    | ●●○○    | ●●●○    |
| 975   | verify   | ○○●●    | ●●○○    | ●●●●    |
| 976   | very     | ○○●●    | ●●○●    | ○○○○    |
| 977   | veteran  | ○○●●    | ●●○●    | ○○○●    |
| 978   | vexed    | ○○●●    | ●●○●    | ○○●○    |
| 979   | victim   | ○○●●    | ●●○●    | ○○●●    |
| 980   | video    | ○○●●    | ●●○●    | ○●○○    |
| 981   | view     | ○○●●    | ●●○●    | ○●○●    |
| 982   | vintage  | ○○●●    | ●●○●    | ○●●○    |
| 983   | violence | ○○●●    | ●●○●    | ○●●●    |
| 984   | viral    | ○○●●    | ●●○●    | ●○○○    |
| 985   | visitor  | ○○●●    | ●●○●    | ●○○●    |
| 986   | visual   | ○○●●    | ●●○●    | ●○●○    |
| 987   | vitamins | ○○●●    | ●●○●    | ●○●●    |
| 988   | vocal    | ○○●●    | ●●○●    | ●●○○    |
| 989   | voice    | ○○●●    | ●●○●    | ●●○●    |
| 990   | volume   | ○○●●    | ●●○●    | ●●●○    |
| 991   | voter    | ○○●●    | ●●○●    | ●●●●    |
| 992   | voting   | ○○●●    | ●●●○    | ○○○○    |
| 993   | walnut   | ○○●●    | ●●●○    | ○○○●    |
| 994   | warmth   | ○○●●    | ●●●○    | ○○●○    |
| 995   | warn     | ○○●●    | ●●●○    | ○○●●    |
| 996   | watch    | ○○●●    | ●●●○    | ○●○○    |
| 997   | wavy     | ○○●●    | ●●●○    | ○●○●    |
| 998   | wealthy  | ○○●●    | ●●●○    | ○●●○    |
| 999   | weapon   | ○○●●    | ●●●○    | ○●●●    |
| 1000  | webcam   | ○○●●    | ●●●○    | ●○○○    |
| 1001  | welcome  | ○○●●    | ●●●○    | ●○○●    |
| 1002  | welfare  | ○○●●    | ●●●○    | ●○●○    |
| 1003  | western  | ○○●●    | ●●●○    | ●○●●    |
| 1004  | width    | ○○●●    | ●●●○    | ●●○○    |
| 1005  | wildlife | ○○●●    | ●●●○    | ●●○●    |
| 1006  | window   | ○○●●    | ●●●○    | ●●●○    |
| 1007  | wine     | ○○●●    | ●●●○    | ●●●●    |
| 1008  | wireless | ○○●●    | ●●●●    | ○○○○    |
| 1009  | wisdom   | ○○●●    | ●●●●    | ○○○●    |
| 1010  | withdraw | ○○●●    | ●●●●    | ○○●○    |
| 1011  | wits     | ○○●●    | ●●●●    | ○○●●    |
| 1012  | wolf     | ○○●●    | ●●●●    | ○●○○    |
| 1013  | woman    | ○○●●    | ●●●●    | ○●○●    |
| 1014  | work     | ○○●●    | ●●●●    | ○●●○    |
| 1015  | worthy   | ○○●●    | ●●●●    | ○●●●    |
| 1016  | wrap     | ○○●●    | ●●●●    | ●○○○    |
| 1017  | wrist    | ○○●●    | ●●●●    | ●○○●    |
| 1018  | writing  | ○○●●    | ●●●●    | ●○●○    |
| 1019  | wrote    | ○○●●    | ●●●●    | ●○●●    |
| 1020  | year     | ○○●●    | ●●●●    | ●●○○    |
| 1021  | yelp     | ○○●●    | ●●●●    | ●●○●    |
| 1022  | yield    | ○○●●    | ●●●●    | ●●●○    |
| 1023  | yoga     | ○○●●    | ●●●●    | ●●●●    |
| 1024  | zero     | ○●○○    | ○○○○    | ○○○○    |
