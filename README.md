# SLIP39 KeyTag Dotmap

A comprehensive solution that converts SLIP39 mnemonic words into physical dot patterns, for use with [OneKey KeyTag](https://onekey.so/products/onekey-keytag/) hardware backup devices. This project provides a complete reference documentation for secure, offline wallet backups, as an alternative to the official OneKey [BIP39 dotmap](https://github.com/OneKeyHQ/bip39-dotmap).

## Security Notice

SLIP39 mnemonics control cryptocurrency funds. Always use offline methods when working with real mnemonics. This project is designed for air-gapped, offline usage to prevent exposure of sensitive cryptographic material.

## Overview

SLIP39 (Shamir's Secret Sharing for Mnemonic Codes) provides enhanced security over BIP39 through threshold secret sharing, allowing you to split your seed into multiple shares where only a subset is needed for recovery. This dotmap implementation enables you to store SLIP39 phrases on durable metal KeyTag devices, providing:

- **Physical durability** - Resistant to fire, water, and electromagnetic pulses
- **Threshold security** - 2-of-3, 3-of-5 sharing schemes vs single point of failure
- **Offline storage** - No digital attack surface
- **Hardware compatibility** - Works with existing OneKey KeyTag devices

### Key Differences from BIP39

| Aspect | BIP39 | SLIP39 |
|--------|-------|--------|
| **Word Count** | 2048 words (indices 1-2048) | 1024 words (indices 1-1024) |
| **Security Model** | Single seed phrase | Threshold sharing (M-of-N) |
| **Dot Usage** | All 12 dots used | 11 dots used (leftmost always empty) |
| **Recovery** | Need complete phrase | Need threshold number of shares |

## Usage

1. Look up each word in the [conversion table](docs/dotmap.md)
2. Mark corresponding dots on your KeyTag hardware
3. Verify patterns match the reference exactly

### Dotmaps Recovery

#### Method 1: Scientific Calculator (Recommended)

Equipment needed:

- Scientific calculator with binary/decimal conversion (e.g., Casio fx-991ES PLUS C)
- Printed SLIP39 wordlist

Steps:

1. **Enter BASE-N Mode**: Press `MODE` → Select `BASE-N`
2. **Switch to Binary Mode**: Press `SHIFT` → Press `log` (Bin)
3. **Read KeyTag pattern**: Convert ○ = 0, ● = 1
4. **Enter 12-bit pattern**: e.g., `000000001111` → Press `=` to execute the input
5. **Convert to decimal**: Press `SHIFT` → Press `x²` (Dec)
6. **Look up word**: Use result as SLIP39 word index

Examples:

- Pattern `○○○○○○○○●●●●` → `000000001111` → 15 → `advocate`
- Pattern `○○●○●●●●○○●○` → `001011110010` → 754 → `result`

#### Method 2: Manual Calculation

Equipment needed:

- Basic calculator
- Printed SLIP39 wordlist

Steps:

1. **Identify bit positions**: [2048][1024][512][256][128][64][32][16][8][4][2][1]
2. **Add punched positions**: Sum all ● positions
3. **Look up word**: Use result as SLIP39 word index

Examples:
- Pattern `○○○○○○○○●●●●` → positions 8+4+2+1 = 15 → `advocate`
- Pattern `○○●○●●●●○○●○` → positions 512+128+64+32+16+2 = 754 → `result`

### Physical KeyTag Layout

KeyTag hardware provides 12 positions arranged in 3 groups of 4:

```
[2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
```

**Important**: For SLIP39, the leftmost position (2048) is always empty (○). This is correct behavior, not an error.

#### Examples

`#15 advocate` → 8 + 4 + 2 + 1 = 15

```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ○     ○       ○     ○    ○    ○      ●   ●   ●   ●
```

`#754 result` → 512 + 128 + 64 + 32 + 16 + 2 = 754

```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ●     ○       ●     ●    ●    ●      ○   ○   ●   ○
```

## Security Best Practices

There is a saying into cryptocurrency world, the words **seed phrase** and **keyboard** don't belong into same sentence.

- **Always use air-gapped devices**, never enter real patterns into electronic devices
- **Create multiple copies** stored in separate secure locations
- **Verify accuracy**, incorrect dots mean lost funds
