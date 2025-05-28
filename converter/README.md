# SLIP39 KeyTag Converter

A secure, offline-first tool for converting SLIP39 mnemonic words into dot patterns for physical KeyTag hardware implementation. This tool enables the creation of physical, air-gapped cryptocurrency wallet backups using the OneKey KeyTag system.

![SLIP39 KeyTag Converter](../docs/images/converter.png)

## Security Notice

**CRITICAL**: This tool is designed for offline use only when handling real cryptocurrency mnemonics. Network connectivity poses security risks for sensitive cryptographic material.

## Quick Start

### Prerequisites

This application requires Node.js and npm. Install them using Homebrew:

```bash
# Install Node.js and npm via Homebrew
brew install node

# Verify installation
node --version
npm --version
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/axivo/slip39-dotmap.git .
   ```

2. **Navigate to converter directory:**
   ```bash
   cd slip39-dotmap/converter
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open browser:**
   Navigate to `http://localhost:3000`

3. **For secure use:**
   - Disconnect from internet after loading the page
   - Verify the network warning appears when online
   - Only enter real mnemonics when offline

### Basic Usage

1. **Select word count:** Choose the number of words in your SLIP39 mnemonic (20, 23, 26, 29, or 33)
2. **Enter mnemonic:** Paste or type your SLIP39 words in the text area
3. **Convert:** Click "Convert to Dots" to generate the dot patterns
4. **Print:** Click "Print Layout" to generate a professional printable version
5. **Reset:** Click "Reset" to clear all data and start over

## Security Best Practices

### Critical Security Steps

1. **Load the application online first** (to cache resources)
2. **Disconnect from internet** before entering any real mnemonics
3. **Verify network warning** - you should see: "Warning: Network connection detected, it is not safe to convert mnemonics"
4. **Only proceed when offline** - the warning should disappear when disconnected

### Data Protection

- **Never enter real mnemonics while online**
- **Clear browser data** after use (history, cache, local storage)
- **Use a dedicated offline computer** for maximum security
- **Test with sample data** first to verify functionality

### Physical Security

- **Store printed KeyTags securely** - treat them like cash or gold
- **Use multiple copies** stored in different secure locations
- **Test recovery process** with small amounts first
- **Protect from physical damage** (fire, water, corrosion)

## Application Features

- **Real-time conversion** of SLIP39 words to 12-bit binary dot patterns
- **Input validation** with detailed error messages and suggestions
- **Professional print layouts** optimized for physical KeyTag marking
- **Network security monitoring** with automatic offline detection
- **Interactive dot editing** for manual pattern verification

## Testing

Before using real mnemonics, test with these sample SLIP39 words:

```
20 words (test only):
academic acid acne acquire across action activity actor actual adapt add address adjust admit adult advice afraid again against age agree
```

**Test Process:**
1. Enter test words while online to verify functionality
2. Go offline and verify network warning appears
3. Re-test conversion offline to ensure it works
4. Print test layout and verify quality
5. Clear browser completely before real use

## Troubleshooting

### Common Issues

**Network Warning Not Showing:**
- Refresh the page and check internet connection
- Ensure JavaScript is enabled

**Conversion Errors:**
- Verify words are from SLIP39 wordlist (not BIP39)
- Check for typos and remove extra spaces
- Ensure correct word count is selected

**Print Layout Issues:**
- Check browser popup settings
- Verify JavaScript is enabled
- Try a different browser if needed

## Important Warnings

- **SLIP39 mnemonics control cryptocurrency funds** - exposure can result in permanent financial loss
- **Mark dots accurately** - incorrect patterns mean lost funds
- **Test recovery process** with small amounts before trusting large funds
- **Never share real mnemonic data** when seeking help

## Support

For support:
1. Check this README for common issues
2. Test with sample data to isolate problems
3. Verify your environment is properly isolated
4. Never share real mnemonic data when seeking help

## License

MIT License - See project files for details.

## Disclaimer

This tool is provided as-is for educational and personal use. Users are responsible for proper security practices, accurate implementation, and safe storage of physical KeyTags. The authors assume no responsibility for lost funds due to misuse or implementation errors.
