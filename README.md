# SLIP39 KeyTag Dotmap

A comprehensive solution that converts SLIP39 mnemonic words into physical dot patterns, for use with OneKey KeyTag [hardware](https://onekey.so/products/onekey-keytag/) backup devices. This project provides a complete reference documentation for secure, offline wallet backups, as an alternative to the official OneKey KeyTag [BIP39 dotmap](https://github.com/OneKeyHQ/bip39-dotmap).

## Security Notice

This project is designed for air-gapped, offline usage to prevent exposure of sensitive cryptographic material. SLIP39 mnemonics control cryptocurrency funds, **always use offline methods** when working with seed phrases.

> [!WARNING]
> There is a saying in the cryptocurrency world: "_the words **seed phrase** and **keyboard** should never appear in the same sentence_."
>
> - **Always use air-gapped devices**, never enter real patterns into electronic devices
> - **Create multiple copies** stored in separate secure locations
> - **Verify accuracy**, incorrect dots mean lost funds

## Methodology

SLIP39 (Shamir's Secret Sharing for Mnemonic Codes) provides enhanced security over BIP39 through threshold secret sharing, allowing you to split your seed into multiple shares where only a subset is needed for recovery. This dotmap implementation enables you to store SLIP39 phrases on durable metal OneKey KeyTag hardware backup devices, providing:

- **Compatibility** - Works with existing OneKey KeyTag hardware backup devices
- **Physical durability** - Resistant to fire, water and electromagnetic pulses
- **Threshold security** - 2-of-3, 3-of-5 sharing schemes vs single point of failure
- **Offline storage** - No digital attack surface

### Key Differences

| Aspect | BIP39 | SLIP39 |
|--------|-------|--------|
| **Word Count** | 2048 words (indices 1-2048) | 1024 words (indices 1-1024) |
| **Security Model** | Single seed phrase | Threshold sharing (M-of-N) |
| **Dot Usage** | All 12 dots used | 11 dots used (leftmost always empty) |
| **Recovery** | Need complete phrase | Need threshold number of shares |

## Usage

The process involves converting SLIP39 words to their corresponding dot patterns for physical storage, and later recovering the original words from the punched patterns.

### Dotmap Generation

Equipment needed:

- OneKey KeyTag [hardware](https://onekey.so/products/onekey-keytag/) backup device
- Printed SLIP39 [conversion table](docs/dotmap.md)

Steps:

1. Look up each word in the conversion table
2. Mark corresponding dots on your KeyTag hardware backup device
3. Verify patterns match the reference exactly

### Dotmap Recovery

#### Method 1: Scientific Calculator (Recommended)

Equipment needed:

- Scientific calculator with binary/decimal conversion (e.g., Casio fx-991ES PLUS C)
- Printed SLIP39 [conversion table](docs/dotmap.md)

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
- Printed SLIP39 [conversion table](docs/dotmap.md)

Steps:

1. **Identify bit positions**: [2048][1024][512][256][128][64][32][16][8][4][2][1]
2. **Add punched positions**: Sum all ● positions
3. **Look up word**: Use result as SLIP39 word index

Examples:

- Pattern `○○○○○○○○●●●●` → positions 8 + 4 + 2 + 1 = 15 → `advocate`
- Pattern `○○●○●●●●○○●○` → positions 512 + 128 + 64 + 32 + 16 + 2 = 754 → `result`

### Physical Layout

The OneKey KeyTag hardware backup device provides 12 positions, arranged in 3 groups of 4:

```
[2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
```

> [!IMPORTANT]
> For SLIP39, the leftmost `2048` position is always empty (○). This is correct behavior, not an error.

#### Examples

Word `#15 advocate` → 8 + 4 + 2 + 1 = 15

```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ○     ○       ○     ○    ○    ○      ●   ●   ●   ●
```

Word `#754 result` → 512 + 128 + 64 + 32 + 16 + 2 = 754

```
Physical: [2048] [1024] [512] [256] | [128] [64] [32] [16] | [8] [4] [2] [1]
Pattern:   ○      ○      ●     ○       ●     ●    ●    ●      ○   ○   ●   ○
```

## Technical Details

For hands-on learning and practice, see the interactive [SLIP39 KeyTag Converter](converter) web application. The following formula was used, to build the SLIP39 [conversion table](docs/dotmap.md):

```javascript
function calculateDotmap(index) {
  // Convert index to 12-bit binary
  const binary = index.toString(2).padStart(12, '0');

  // Split into 3 columns of 4 bits each
  const bits11to8 = binary.substring(0, 4);
  const bits7to4 = binary.substring(4, 8);
  const bits3to0 = binary.substring(8, 12);

  // Convert binary to dotmap (● = 1, ○ = 0)
  function binaryToDotmap(binaryStr) {
    return binaryStr.split('').map(bit => bit === '1' ? '●' : '○').join('');
  }

  return [
    binaryToDotmap(bits11to8),  // Column1
    binaryToDotmap(bits7to4),   // Column2  
    binaryToDotmap(bits3to0)    // Column3
  ];
}
```

This ensures mathematical consistency and unique representation for each word, while maintaining compatibility with existing OneKey KeyTag hardware backup device.
